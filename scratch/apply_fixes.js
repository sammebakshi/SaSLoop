const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace CRLF to LF for consistent replacements
content = content.replace(/\r\n/g, '\n');

// ==========================================
// 1. FIX: Delete temporary table when KOT is deleted/cancelled
// ==========================================
const deleteOldKOTTarget = `    setTableBills(prev => ({ ...prev, [selectedTable.id]: updatedBill }));

    const activeRemaining = updatedBill.filter(item => !item.isCancelled);
    if (activeRemaining.length === 0) {
      setTableStatuses(statusPrev => ({ ...statusPrev, [selectedTable.id]: 'AVAILABLE' }));
      setTableActiveTimestamps(timePrev => { const n = { ...timePrev }; delete n[selectedTable.id]; return n; });
      setTableBillNumbers(numPrev => { const n = { ...numPrev }; delete n[selectedTable.id]; return n; });
      releaseTableExtraState(selectedTable.id);
      setIsOldKOTModalOpen(false);
      setSelectedTable(null);
    }`;

const deleteOldKOTReplacement = `    setTableBills(prev => ({ ...prev, [selectedTable.id]: updatedBill }));

    const activeRemaining = updatedBill.filter(item => !item.isCancelled);
    if (activeRemaining.length === 0) {
      setTableStatuses(statusPrev => ({ ...statusPrev, [selectedTable.id]: 'AVAILABLE' }));
      setTableActiveTimestamps(timePrev => { const n = { ...timePrev }; delete n[selectedTable.id]; return n; });
      setTableBillNumbers(numPrev => { const n = { ...numPrev }; delete n[selectedTable.id]; return n; });
      releaseTableExtraState(selectedTable.id);
      if (selectedTable.is_temporary) {
        setTables(prevTables => prevTables.filter(t => t.id !== selectedTable.id));
      }
      setIsOldKOTModalOpen(false);
      setSelectedTable(null);
    }`;

if (content.includes(deleteOldKOTTarget)) {
  content = content.replace(deleteOldKOTTarget, deleteOldKOTReplacement);
  console.log("Success: Added temporary table deletion in handleOldKOTDelete");
} else {
  console.error("Error: Failed to find target in handleOldKOTDelete");
}

const cancelOldKOTTarget = `    setTableBills(prev => ({ ...prev, [selectedTable.id]: updatedBill }));

    const activeItems = updatedBill.filter(item => !item.isCancelled);
    if (activeItems.length === 0) {
      setTableStatuses(statusPrev => ({ ...statusPrev, [selectedTable.id]: 'AVAILABLE' }));
      setTableActiveTimestamps(timePrev => { const n = { ...timePrev }; delete n[selectedTable.id]; return n; });
      setTableBillNumbers(numPrev => { const n = { ...numPrev }; delete n[selectedTable.id]; return n; });
      releaseTableExtraState(selectedTable.id);
      setIsOldKOTModalOpen(false);
      setSelectedTable(null);
    }`;

const cancelOldKOTReplacement = `    setTableBills(prev => ({ ...prev, [selectedTable.id]: updatedBill }));

    const activeItems = updatedBill.filter(item => !item.isCancelled);
    if (activeItems.length === 0) {
      setTableStatuses(statusPrev => ({ ...statusPrev, [selectedTable.id]: 'AVAILABLE' }));
      setTableActiveTimestamps(timePrev => { const n = { ...timePrev }; delete n[selectedTable.id]; return n; });
      setTableBillNumbers(numPrev => { const n = { ...numPrev }; delete n[selectedTable.id]; return n; });
      releaseTableExtraState(selectedTable.id);
      if (selectedTable.is_temporary) {
        setTables(prevTables => prevTables.filter(t => t.id !== selectedTable.id));
      }
      setIsOldKOTModalOpen(false);
      setSelectedTable(null);
    }`;

if (content.includes(cancelOldKOTTarget)) {
  content = content.replace(cancelOldKOTTarget, cancelOldKOTReplacement);
  console.log("Success: Added temporary table deletion in handleOldKOTCancel");
} else {
  console.error("Error: Failed to find target in handleOldKOTCancel");
}


// ==========================================
// 2. FIX: Pickup/Delivery Toggle Switch logic
// ==========================================
const toggleTarget = `                            <input
                              type="checkbox"
                              checked={subOrderType === 'DELIVERY'}
                              onChange={e => setSubOrderType(e.target.checked ? 'DELIVERY' : 'PICKUP')}
                              className="sr-only peer"
                            />`;

const toggleReplacement = `                            <input
                              type="checkbox"
                              checked={subOrderType === 'DELIVERY'}
                              onChange={e => {
                                const newType = e.target.checked ? 'DELIVERY' : 'PICKUP';
                                setSubOrderType(newType);
                                if (selectedTable && selectedTable.is_temporary) {
                                  let newName = selectedTable.table_name;
                                  if (selectedTable.table_name.startsWith('Pickup #')) {
                                    newName = selectedTable.table_name.replace('Pickup #', 'Delivery #');
                                  } else if (selectedTable.table_name.startsWith('Delivery #')) {
                                    newName = selectedTable.table_name.replace('Delivery #', 'Pickup #');
                                  }
                                  const updatedTable = {
                                    ...selectedTable,
                                    table_name: newName,
                                    original_sub_order_type: newType
                                  };
                                  setSelectedTable(updatedTable);
                                  setTables(tPrev => tPrev.map(t => t.id === selectedTable.id ? updatedTable : t));
                                }
                              }}
                              className="sr-only peer"
                            />`;

if (content.includes(toggleTarget)) {
  content = content.replace(toggleTarget, toggleReplacement);
  console.log("Success: Updated subOrderType toggle behavior for temporary tables");
} else {
  console.error("Error: Failed to find target for toggle checkbox");
}


// ==========================================
// 3. FIX: Silent KOT print support for multiple target printers
// ==========================================
const silentKOTTarget = `    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('print-silent', {
          html: receiptHtml.replace('<script>window.onload = () => { window.print(); window.close(); }</script>', ''),
          printerName: posSettings.printerName
        });
        return;
      } catch (err) {
        console.error("Silent KOT print failed:", err);
      }
    }`;

const silentKOTReplacement = `    // Resolve printers list based on order type
    let kotConfigKey = 'QUICK';
    if (activeTrayTab === 'PreOrder' || (tableName && tableName.startsWith('Pre-Order'))) {
      kotConfigKey = 'PRE_ORDER';
    } else {
      let typeLower = '';
      if (selectedTable) {
        if (selectedTable.original_order_type === 'PICKUP') {
          typeLower = String(selectedTable.original_sub_order_type || 'pickup').toLowerCase();
        } else {
          typeLower = String(selectedTable.original_order_type || orderType || '').toLowerCase();
        }
      } else {
        typeLower = String(orderType || '').toLowerCase();
        if (typeLower === 'pickup') {
          typeLower = String(subOrderType || 'pickup').toLowerCase();
        }
      }
      
      if (typeLower.includes('dine')) {
        kotConfigKey = 'DINE_IN';
      } else if (typeLower.includes('delivery')) {
        kotConfigKey = 'DELIVERY';
      } else if (typeLower.includes('pickup') || typeLower.includes('takeaway')) {
        kotConfigKey = 'PICKUP';
      } else if (typeLower.includes('quick')) {
        kotConfigKey = 'QUICK';
      }
    }

    const kotConfigGroup = (posSettings.orderPrinters && posSettings.orderPrinters[kotConfigKey]) || {
      kot: { enabled: true, name: '', paperSize: 'THERMAL_80MM' }
    };
    const kotConfig = kotConfigGroup.kot || { enabled: true, name: '', paperSize: 'THERMAL_80MM' };

    if (kotConfig.enabled === false) {
      toast.info(\`KOT printing is disabled for \${kotConfigKey === 'PRE_ORDER' ? 'Pre-Order' : kotConfigKey} order type.\`);
      return;
    }

    let targetKOTPrinters = [];
    if (Array.isArray(kotConfig.names) && kotConfig.names.length > 0) {
      targetKOTPrinters = kotConfig.names;
    } else if (kotConfig.name) {
      targetKOTPrinters = [kotConfig.name];
    } else {
      targetKOTPrinters = [posSettings.printerName || ''];
    }

    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        targetKOTPrinters.forEach(printer => {
          ipcRenderer.send('print-silent', {
            html: receiptHtml.replace('<script>window.onload = () => { window.print(); window.close(); }</script>', ''),
            printerName: printer
          });
        });
        return;
      } catch (err) {
        console.error("Silent KOT print failed:", err);
      }
    }`;

if (content.includes(silentKOTTarget)) {
  content = content.replace(silentKOTTarget, silentKOTReplacement);
  console.log("Success: Implemented multiple printers support in KOT silent print");
} else {
  console.error("Error: Failed to find target silent KOT print logic");
}


// ==========================================
// 4. FIX: Silent Receipt print support for multiple target printers
// ==========================================
const silentBillTarget = `    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('print-silent', {
          html: receiptHtml.replace('<script>window.onload = () => { window.print(); window.close(); }</script>', ''),
          printerName: posSettings.printerName
        });
        return;
      } catch (err) {
        console.error("Silent print failed:", err);
      }
    }`;

const silentBillReplacement = `    let targetBillPrinters = [];
    if (Array.isArray(billConfig.names) && billConfig.names.length > 0) {
      targetBillPrinters = billConfig.names;
    } else if (billConfig.name) {
      targetBillPrinters = [billConfig.name];
    } else {
      targetBillPrinters = [posSettings.printerName || ''];
    }

    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        targetBillPrinters.forEach(printer => {
          ipcRenderer.send('print-silent', {
            html: receiptHtml.replace('<script>window.onload = () => { window.print(); window.close(); }</script>', ''),
            printerName: printer
          });
        });
        return;
      } catch (err) {
        console.error("Silent print failed:", err);
      }
    }`;

if (content.includes(silentBillTarget)) {
  content = content.replace(silentBillTarget, silentBillReplacement);
  console.log("Success: Implemented multiple printers support in Bill silent print");
} else {
  console.error("Error: Failed to find target silent Bill print logic");
}


// ==========================================
// 5. UI: Update Settings UI to display multiple printer select checkboxes
// ==========================================
const uiKOTTarget = `                                                   <div className="flex flex-col gap-1">
                                                      <label className="text-[8.5px] font-bold text-[#8b949e] uppercase font-bold">Target Printer</label>
                                                      {availablePrinters && availablePrinters.length > 0 ? (
                                                         <select
                                                            value={kotConfig.name || ''}
                                                            onChange={e => updateOrderPrinterSetting(type.key, 'kot', 'name', e.target.value)}
                                                            className={\`w-full p-2 rounded-lg border outline-none text-[10px] font-black transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white focus:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-400'}\`}
                                                         >
                                                            <option value="">Use Default Global ({posSettings.printerName || 'Default'})</option>
                                                            {availablePrinters.map(p => (
                                                               <option key={p.id} value={p.name}>{p.name}</option>
                                                            ))}
                                                         </select>
                                                      ) : (
                                                         <input
                                                            type="text"
                                                            placeholder="Type system printer name..."
                                                            value={kotConfig.name || ''}
                                                            onChange={e => updateOrderPrinterSetting(type.key, 'kot', 'name', e.target.value)}
                                                            className={\`w-full p-2 rounded-lg border outline-none text-[10px] font-black transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-gray-600 focus:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-400'}\`}
                                                         />
                                                      )}
                                                   </div>`;

const uiKOTReplacement = `                                                   <div className="flex flex-col gap-1">
                                                      <label className="text-[8.5px] font-bold text-[#8b949e] uppercase font-bold">Target Printers (Select Multiple)</label>
                                                      {availablePrinters && availablePrinters.length > 0 ? (
                                                         <div className={\`p-2.5 rounded-lg border max-h-28 overflow-y-auto space-y-1.5 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                                                            {availablePrinters.map(p => {
                                                               const isChecked = Array.isArray(kotConfig.names) 
                                                                  ? kotConfig.names.includes(p.name)
                                                                  : kotConfig.name === p.name;
                                                               return (
                                                                  <label key={p.id} className="flex items-center gap-2 text-[10px] font-black cursor-pointer select-none">
                                                                     <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={e => {
                                                                           let currentNames = Array.isArray(kotConfig.names) ? [...kotConfig.names] : (kotConfig.name ? [kotConfig.name] : []);
                                                                           if (e.target.checked) {
                                                                              if (!currentNames.includes(p.name)) currentNames.push(p.name);
                                                                           } else {
                                                                              currentNames = currentNames.filter(n => n !== p.name);
                                                                           }
                                                                           updateOrderPrinterSetting(type.key, 'kot', 'names', currentNames);
                                                                           updateOrderPrinterSetting(type.key, 'kot', 'name', currentNames[0] || '');
                                                                        }}
                                                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                                                                     />
                                                                     <span className={isDark ? 'text-gray-300' : 'text-slate-700'}>{p.name}</span>
                                                                  </label>
                                                               );
                                                            })}
                                                         </div>
                                                      ) : (
                                                         <input
                                                            type="text"
                                                            placeholder="Type printer names (comma separated)..."
                                                            value={Array.isArray(kotConfig.names) ? kotConfig.names.join(', ') : (kotConfig.name || '')}
                                                            onChange={e => {
                                                               const names = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                               updateOrderPrinterSetting(type.key, 'kot', 'names', names);
                                                               updateOrderPrinterSetting(type.key, 'kot', 'name', names[0] || '');
                                                            }}
                                                            className={\`w-full p-2 rounded-lg border outline-none text-[10px] font-black transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-gray-600 focus:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-400'}\`}
                                                         />
                                                      )}
                                                   </div>`;

if (content.includes(uiKOTTarget)) {
  content = content.replace(uiKOTTarget, uiKOTReplacement);
  console.log("Success: Updated KOT Printer target configuration UI");
} else {
  console.error("Error: Failed to find target for KOT Printer UI");
}

const uiBillTarget = `                                                   <div className="flex flex-col gap-1">
                                                      <label className="text-[8.5px] font-bold text-[#8b949e] uppercase font-bold">Target Printer</label>
                                                      {availablePrinters && availablePrinters.length > 0 ? (
                                                         <select
                                                            value={billConfig.name || ''}
                                                            onChange={e => updateOrderPrinterSetting(type.key, 'bill', 'name', e.target.value)}
                                                            className={\`w-full p-2 rounded-lg border outline-none text-[10px] font-black transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white focus:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-400'}\`}
                                                         >
                                                            <option value="">Use Default Global ({posSettings.printerName || 'Default'})</option>
                                                            {availablePrinters.map(p => (
                                                               <option key={p.id} value={p.name}>{p.name}</option>
                                                            ))}
                                                         </select>
                                                      ) : (
                                                         <input
                                                            type="text"
                                                            placeholder="Type system printer name..."
                                                            value={billConfig.name || ''}
                                                            onChange={e => updateOrderPrinterSetting(type.key, 'bill', 'name', e.target.value)}
                                                            className={\`w-full p-2 rounded-lg border outline-none text-[10px] font-black transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-gray-600 focus:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-400'}\`}
                                                         />
                                                      )}
                                                   </div>`;

const uiBillReplacement = `                                                   <div className="flex flex-col gap-1">
                                                      <label className="text-[8.5px] font-bold text-[#8b949e] uppercase font-bold">Target Printers (Select Multiple)</label>
                                                      {availablePrinters && availablePrinters.length > 0 ? (
                                                         <div className={\`p-2.5 rounded-lg border max-h-28 overflow-y-auto space-y-1.5 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                                                            {availablePrinters.map(p => {
                                                               const isChecked = Array.isArray(billConfig.names) 
                                                                  ? billConfig.names.includes(p.name)
                                                                  : billConfig.name === p.name;
                                                               return (
                                                                  <label key={p.id} className="flex items-center gap-2 text-[10px] font-black cursor-pointer select-none">
                                                                     <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={e => {
                                                                           let currentNames = Array.isArray(billConfig.names) ? [...billConfig.names] : (billConfig.name ? [billConfig.name] : []);
                                                                           if (e.target.checked) {
                                                                              if (!currentNames.includes(p.name)) currentNames.push(p.name);
                                                                           } else {
                                                                              currentNames = currentNames.filter(n => n !== p.name);
                                                                           }
                                                                           updateOrderPrinterSetting(type.key, 'bill', 'names', currentNames);
                                                                           updateOrderPrinterSetting(type.key, 'bill', 'name', currentNames[0] || '');
                                                                        }}
                                                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                                                                     />
                                                                     <span className={isDark ? 'text-gray-300' : 'text-slate-700'}>{p.name}</span>
                                                                  </label>
                                                               );
                                                            })}
                                                         </div>
                                                      ) : (
                                                         <input
                                                            type="text"
                                                            placeholder="Type printer names (comma separated)..."
                                                            value={Array.isArray(billConfig.names) ? billConfig.names.join(', ') : (billConfig.name || '')}
                                                            onChange={e => {
                                                               const names = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                               updateOrderPrinterSetting(type.key, 'bill', 'names', names);
                                                               updateOrderPrinterSetting(type.key, 'bill', 'name', names[0] || '');
                                                            }}
                                                            className={\`w-full p-2 rounded-lg border outline-none text-[10px] font-black transition-all \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-gray-600 focus:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-400'}\`}
                                                         />
                                                      )}
                                                   </div>`;

if (content.includes(uiBillTarget)) {
  content = content.replace(uiBillTarget, uiBillReplacement);
  console.log("Success: Updated Bill Printer target configuration UI");
} else {
  console.error("Error: Failed to find target for Bill Printer UI");
}

fs.writeFileSync(filePath, content, 'utf8');
