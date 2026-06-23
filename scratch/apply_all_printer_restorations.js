const fs = require('fs');

const appPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// Normalize CRLF to LF
content = content.replace(/\r\n/g, '\n');

// 1. Helper functions: updateOrderPrinterSetting & resolvePrinterConfig
const helperCode = `
  const updateOrderPrinterSetting = (orderTypeKey, jobType, field, value) => {
    setPosSettings(prev => {
      const printers = { ...(prev.orderPrinters || {}) };
      if (!printers[orderTypeKey]) {
        printers[orderTypeKey] = {
          kot: { enabled: true, name: '', paperSize: 'THERMAL_80MM' },
          bill: { enabled: true, name: '', paperSize: 'THERMAL_80MM' }
        };
      }
      printers[orderTypeKey] = {
        ...printers[orderTypeKey],
        [jobType]: {
          ...(printers[orderTypeKey][jobType] || {}),
          [field]: value
        }
      };
      return {
        ...prev,
        orderPrinters: printers
      };
    });
  };

  const resolvePrinterConfig = (orderTypeKey, printerJobType) => {
    let key = String(orderTypeKey || '').toUpperCase().trim();
    if (key.includes('PRE_ORDER') || key.includes('PREORDER')) {
      key = 'PRE_ORDER';
    } else if (key.includes('DELIVERY')) {
      key = 'DELIVERY';
    } else if (key.includes('PICKUP')) {
      key = 'PICKUP';
    } else if (key.includes('QUICK')) {
      key = 'QUICK';
    } else if (key.includes('DINE_IN') || key.includes('DINEIN')) {
      key = 'DINE_IN';
    } else {
      key = 'DINE_IN';
    }

    const printers = posSettings.orderPrinters || {};
    const configGroup = printers[key] || {};
    const jobConfig = configGroup[printerJobType] || {};

    return {
      enabled: jobConfig.enabled !== false,
      name: jobConfig.name || posSettings.printerName || 'Default Thermal Printer',
      paperSize: jobConfig.paperSize || posSettings.printerType || 'THERMAL_80MM'
    };
  };
`;

const compileTarget = '  const compileLedgerData = () => {';
if (!content.includes(compileTarget)) {
  console.error("Could not find compileLedgerData in App.jsx");
  process.exit(1);
}
content = content.replace(compileTarget, helperCode + '\n' + compileTarget);
console.log("1. Injected helper functions.");

// 2. Default settings: orderPrinters & pre-order copy flags
const defaultSettingsTarget = `      printLoyaltyPoints: true,
      loyaltyPrintOption: 'all'
    };`;

const defaultSettingsReplacement = `      printLoyaltyPoints: true,
      loyaltyPrintOption: 'all',
      printCustomerCopyPreorder: true,
      printRestaurantCopyPreorder: true,
      orderPrinters: {
        DINE_IN: {
          kot: { enabled: true, name: '', paperSize: 'THERMAL_80MM' },
          bill: { enabled: true, name: '', paperSize: 'THERMAL_80MM' }
        },
        PICKUP: {
          kot: { enabled: true, name: '', paperSize: 'THERMAL_80MM' },
          bill: { enabled: true, name: '', paperSize: 'THERMAL_80MM' }
        },
        DELIVERY: {
          kot: { enabled: true, name: '', paperSize: 'THERMAL_80MM' },
          bill: { enabled: true, name: '', paperSize: 'THERMAL_80MM' }
        },
        QUICK: {
          kot: { enabled: true, name: '', paperSize: 'THERMAL_80MM' },
          bill: { enabled: true, name: '', paperSize: 'THERMAL_80MM' }
        },
        PRE_ORDER: {
          kot: { enabled: true, name: '', paperSize: 'THERMAL_80MM' },
          bill: { enabled: true, name: '', paperSize: 'THERMAL_80MM' }
        }
      }
    };`;

if (!content.includes(defaultSettingsTarget)) {
  console.error("Could not find defaultSettings target in App.jsx");
  process.exit(1);
}
content = content.replace(defaultSettingsTarget, defaultSettingsReplacement);
console.log("2. Injected defaultSettings values.");

// 3. handlePrint start hook
const handlePrintTarget = `  const handlePrint = async (order) => {
    // Normalize fields to support both a POS Order and a Pre-Order DB object
    const orderItems = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');`;

const handlePrintReplacement = `  const handlePrint = async (order) => {
    let activeType = 'DINE_IN';
    if (order.pre_order_id || (order.advance_paid !== undefined && order.status !== 'COMPLETED')) {
      activeType = 'PRE_ORDER';
    } else {
      const typeStr = String(order.order_type || '').toUpperCase();
      if (typeStr.includes('DELIVERY')) {
        activeType = 'DELIVERY';
      } else if (typeStr.includes('PICKUP')) {
        activeType = 'PICKUP';
      } else if (typeStr.includes('QUICK')) {
        activeType = 'QUICK';
      } else {
        activeType = 'DINE_IN';
      }
    }

    const printConfig = resolvePrinterConfig(activeType, 'bill');
    if (!printConfig.enabled) {
      toast.info(\`Bill printing is disabled for \${activeType} orders.\`);
      return;
    }

    const resolvedWidth = printConfig.paperSize === 'THERMAL_58MM' ? 48 : (posSettings.printWidth || 72);

    // Normalize fields to support both a POS Order and a Pre-Order DB object
    const orderItems = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');`;

if (!content.includes(handlePrintTarget)) {
  console.error("Could not find handlePrint start target in App.jsx");
  process.exit(1);
}
content = content.replace(handlePrintTarget, handlePrintReplacement);
console.log("3. Modified handlePrint start hook.");

// 4. handlePrint body style width replacement
const printWidthTarget = `            body {
              font-family: Arial, Helvetica, sans-serif;
              width: \${posSettings.printWidth || 72}mm;`;

const printWidthReplacement = `            body {
              font-family: Arial, Helvetica, sans-serif;
              width: \${resolvedWidth}mm;`;

const firstWidthIndex = content.indexOf(printWidthTarget);
if (firstWidthIndex === -1) {
  console.error("Could not find printWidth target in App.jsx");
  process.exit(1);
}
content = content.substring(0, firstWidthIndex) + printWidthReplacement + content.substring(firstWidthIndex + printWidthTarget.length);
console.log("4. Updated body width in handlePrint.");

// 5. handlePrint silent print & window open size replacement
const silentPrintTarget = `        ipcRenderer.send('print-silent', {
          html: receiptHtml.replace('<script>window.onload = () => { window.print(); window.close(); }</script>', ''),
          printerName: posSettings.printerName
        });
        return;
      } catch (err) {
        console.error("Silent print failed:", err);
      }
    }

    const printWindow = window.open('', '_blank', 'width=300,height=600');`;

const silentPrintReplacement = `        ipcRenderer.send('print-silent', {
          html: receiptHtml.replace('<script>window.onload = () => { window.print(); window.close(); }</script>', ''),
          printerName: printConfig.name
        });
        return;
      } catch (err) {
        console.error("Silent print failed:", err);
      }
    }

    const printWindow = window.open('', '_blank', \`width=\${printConfig.paperSize === 'THERMAL_58MM' ? 220 : 300},height=600\`);`;

if (!content.includes(silentPrintTarget)) {
  console.error("Could not find silentPrint target in App.jsx");
  process.exit(1);
}
content = content.replace(silentPrintTarget, silentPrintReplacement);
console.log("5. Updated silent print and popup width in handlePrint.");

// 6. handlePrintKOT signature, resolve config, style width, and silent print
const handlePrintKOTTarget = `  const handlePrintKOT = (items, tableName, bNo, type = 'NEW') => {
    const receiptHtml = \`
      <html>
        <head>
          <style>
            @page { margin: 0; }
            * { box-sizing: border-box; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              width: \${posSettings.printWidth || 72}mm;`;

const handlePrintKOTReplacement = `  const handlePrintKOT = (items, tableName, bNo, type = 'NEW', targetOrderType = null) => {
    let activeType = 'DINE_IN';
    if (targetOrderType) {
      const t = String(targetOrderType).toUpperCase();
      if (t.includes('PRE_ORDER') || t.includes('PREORDER')) activeType = 'PRE_ORDER';
      else if (t.includes('DELIVERY')) activeType = 'DELIVERY';
      else if (t.includes('PICKUP')) activeType = 'PICKUP';
      else if (t.includes('QUICK')) activeType = 'QUICK';
      else activeType = 'DINE_IN';
    } else {
      if (activeTrayTab === 'PreOrder') activeType = 'PRE_ORDER';
      else activeType = orderType || 'DINE_IN';
    }

    const printConfig = resolvePrinterConfig(activeType, 'kot');
    if (!printConfig.enabled) {
      toast.info(\`KOT printing is disabled for \${activeType} orders.\`);
      return;
    }

    const resolvedWidth = printConfig.paperSize === 'THERMAL_58MM' ? 48 : (posSettings.printWidth || 72);

    const receiptHtml = \`
      <html>
        <head>
          <style>
            @page { margin: 0; }
            * { box-sizing: border-box; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              width: \${resolvedWidth}mm;`;

if (!content.includes(handlePrintKOTTarget)) {
  console.error("Could not find handlePrintKOT target in App.jsx");
  process.exit(1);
}
content = content.replace(handlePrintKOTTarget, handlePrintKOTReplacement);
console.log("6. Updated handlePrintKOT signature & styling.");

// 7. handlePrintKOT execution end
const silentPrintKOTTarget = `        ipcRenderer.send('print-silent', {
          html: receiptHtml.replace('<script>window.onload = () => { window.print(); window.close(); }</script>', ''),
          printerName: posSettings.printerName
        });
        return;
      } catch (err) {
        console.error("Silent KOT print failed:", err);
      }
    }

    const printWindow = window.open('', '_blank', 'width=300,height=600');`;

const silentPrintKOTReplacement = `        ipcRenderer.send('print-silent', {
          html: receiptHtml.replace('<script>window.onload = () => { window.print(); window.close(); }</script>', ''),
          printerName: printConfig.name
        });
        return;
      } catch (err) {
        console.error("Silent KOT print failed:", err);
      }
    }

    const printWindow = window.open('', '_blank', \`width=\${printConfig.paperSize === 'THERMAL_58MM' ? 220 : 300},height=600\`);`;

if (!content.includes(silentPrintKOTTarget)) {
  console.error("Could not find silentPrintKOT target in App.jsx");
  process.exit(1);
}
content = content.replace(silentPrintKOTTarget, silentPrintKOTReplacement);
console.log("7. Updated silent print and popup width in handlePrintKOT.");

// 8. Replace handlePrintKOT calls
const callsToReplace = [
  {
    target: `    if (isPrint) {\n      handlePrintKOT(cart, tableName, bNo);\n    }\n\n    setSelectedTable(newTempTable);`,
    replacement: `    if (isPrint) {\n      handlePrintKOT(cart, tableName, bNo, 'NEW', 'PRE_ORDER');\n    }\n\n    setSelectedTable(newTempTable);`
  },
  {
    target: `    if (isPrint) {\n      handlePrintKOT(cart, tableName, bNo);\n    }\n\n    setCart([]);`,
    replacement: `    if (isPrint) {\n      handlePrintKOT(cart, tableName, bNo, 'NEW', 'PRE_ORDER');\n    }\n\n    setCart([]);`
  },
  {
    target: `    if (printKOT) {\n      const bNo = tableBillNumbers[selectedTable.id];\n      handlePrintKOT(selectedItems, selectedTable.table_name, bNo);\n      toast.success("KOT printed for selected items!");`,
    replacement: `    if (printKOT) {\n      const bNo = tableBillNumbers[selectedTable.id];\n      handlePrintKOT(selectedItems, selectedTable.table_name, bNo, 'NEW', selectedTable?.original_order_type || 'DINE_IN');\n      toast.success("KOT printed for selected items!");`
  },
  {
    target: `    if (printCancelledKOT) {\n      const bNo = tableBillNumbers[selectedTable.id];\n      handlePrintKOT(cancelledItems, selectedTable.table_name, bNo, 'CANCELLED');\n    }`,
    replacement: `    if (printCancelledKOT) {\n      const bNo = tableBillNumbers[selectedTable.id];\n      handlePrintKOT(cancelledItems, selectedTable.table_name, bNo, 'CANCELLED', selectedTable?.original_order_type || 'DINE_IN');\n    }`
  },
  {
    target: `    if (printTransferredKOT) {\n      const bNo = tableBillNumbers[selectedTable.id];\n      handlePrintKOT(selectedItems, \`\${selectedTable.table_name} -> \${targetTable.table_name}\`, bNo, 'TRANSFERRED');\n    }`,
    replacement: `    if (printTransferredKOT) {\n      const bNo = tableBillNumbers[selectedTable.id];\n      handlePrintKOT(selectedItems, \`\${selectedTable.table_name} -> \${targetTable.table_name}\`, bNo, 'TRANSFERRED', selectedTable?.original_order_type || 'DINE_IN');\n    }`
  },
  {
    target: `                            // Print KOT\n                            handlePrintKOT(cart, selectedTable.table_name, bNo);\n                            // Set status to SAVED (Red)`,
    replacement: `                            // Print KOT\n                            handlePrintKOT(cart, selectedTable.table_name, bNo, 'NEW', selectedTable?.original_order_type || 'DINE_IN');\n                            // Set status to SAVED (Red)`
  },
  {
    target: `                              <button\n                                onClick={() => handlePrintKOT(orderItems, order.table_number || 'Digital', order.bill_no)}\n                                className="flex-1 py-2 bg-[#21262d]`,
    replacement: `                              <button\n                                onClick={() => handlePrintKOT(orderItems, order.table_number || 'Digital', order.bill_no, 'NEW', order.order_type)}\n                                className="flex-1 py-2 bg-[#21262d]`
  }
];

// Let's modify the target of index 5 (target 6) to have the exact spacing of 26 spaces:
callsToReplace[5].target = `                          // Print KOT\n                          handlePrintKOT(cart, selectedTable.table_name, bNo);\n                          // Set status to SAVED (Red)`;
callsToReplace[5].replacement = `                          // Print KOT\n                          handlePrintKOT(cart, selectedTable.table_name, bNo, 'NEW', selectedTable?.original_order_type || 'DINE_IN');\n                          // Set status to SAVED (Red)`;

callsToReplace.forEach((item, idx) => {
  if (!content.includes(item.target)) {
    console.error(`Could not find handlePrintKOT call target ${idx + 1}`);
    process.exit(1);
  }
  content = content.replace(item.target, item.replacement);
  console.log(`8.${idx + 1} Replaced handlePrintKOT call.`);
});

// 9. Replace Settings active tab UI block cleanly
const backupUiPath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/printer_settings_ui_backup.txt';
// Read backup file and normalize CRLF
const backupUiContent = fs.readFileSync(backupUiPath, 'utf8').replace(/\r\n/g, '\n');
const backupLines = backupUiContent.split('\n');
// We extract lines 1 to 315 (0-indexed 0 to 314)
const printerTabUi = backupLines.slice(0, 315).join('\n').trim();

const uiStartTarget = "                        {settingsActiveTab === 'printer' && (";
const uiEndTarget = "                        {settingsActiveTab === 'shortcuts' && (";

const uiStartIndex = content.indexOf(uiStartTarget);
const uiEndIndex = content.indexOf(uiEndTarget);

if (uiStartIndex === -1 || uiEndIndex === -1) {
  console.error("Could not find settings active tab targets in App.jsx");
  process.exit(1);
}

content = content.substring(0, uiStartIndex) + printerTabUi + '\n\n' + content.substring(uiEndIndex);
console.log("9. Replaced printer settings UI tab.");

// Convert LF back to CRLF
content = content.replace(/\n/g, '\r\n');

// Save results
fs.writeFileSync(appPath, content, 'utf8');
console.log("🎉 ALL RESTORATIONS APPLIED SUCCESSFULLY AND SAVED!");
