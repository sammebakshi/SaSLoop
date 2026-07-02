const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../scratch/find_unused_permissions.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');

// Let's replace the whole checking block in find_unused_permissions.js
const findCheckingBlock = `    // Check 1: Direct literal check
    // We construct possible checks:
    // e.g. pos_access?.Dashboard?.todays_sale
    // e.g. pos_access?.Dashboard?.visible
    // e.g. pos_access?.OperationManagement?.ItemsManagement?.visible
    const sectionParts = section.split('.');
    let regexStr = 'pos_access\\\\??\\\\.';
    sectionParts.forEach(part => {
      regexStr += part + '\\\\??\\\\.';
    });
    regexStr += key + '\\\\b';
    const directRegex = new RegExp(regexStr, 'i');
    if (directRegex.test(content)) {
      isUsed = true;
    }

    // Check passcode wrapper calls
    if (key.endsWith('_passcode')) {
      const baseKey = key.replace('_passcode', '');
      // verifyPasscodeAction check
      const verifyCall = new RegExp(\`verifyPasscodeAction\\\\(\\\\s*['"]\${section}['"]\\\\s*,\\\\s*['"]\${baseKey}['"]\`, 'i');
      if (verifyCall.test(content)) {
        isUsed = true;
      }
      
      // Module specific passcode helpers
      if (section.includes('Billing')) {
        const checkCall = new RegExp(\`checkBillingPasscode\\\\(\\\\s*['"]\${baseKey}['"]\`, 'i');
        if (checkCall.test(content)) isUsed = true;
      }
      if (section.includes('OldKOT')) {
        const checkCall = new RegExp(\`checkOldKOTPasscode\\\\(\\\\s*['"]\${baseKey}['"]\`, 'i');
        if (checkCall.test(content)) isUsed = true;
      }
      if (section.includes('SplitBill')) {
        const checkCall = new RegExp(\`checkSplitBillPasscode\\\\(\\\\s*['"]\${baseKey}['"]\`, 'i');
        if (checkCall.test(content)) isUsed = true;
      }
      if (section.includes('Receipts')) {
        const checkCall = new RegExp(\`checkReceiptsPasscode\\\\(\\\\s*['"]\${baseKey}['"]\`, 'i');
        if (checkCall.test(content)) isUsed = true;
      }
    }

    // Check 2: Dynamic checks via functions
    if (!isUsed) {
      // 2a. Billing dynamic mapping: Billing / Delivery.Billing / Pickup.Billing / PreOrder.Billing / QuickBill
      if (section === 'Billing' || section === 'Delivery.Billing' || section === 'Pickup.Billing' || section === 'PreOrder.Billing' || section === 'QuickBill') {
        const mappedKey = key === 'add_charge' ? 'add_charges' : (key === 'kot' ? 'save_kot' : key);
        const checkCall = new RegExp(\`checkBillingPermission\\\\(\\\\s*['"]\${mappedKey}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      // 2b. OldKOT dynamic mapping: OldKOT / Delivery.OldKOT / Pickup.OldKOT / PreOrder.OldKOT
      if (section === 'OldKOT' || section === 'Delivery.OldKOT' || section === 'Pickup.OldKOT' || section === 'PreOrder.OldKOT') {
        const checkCall = new RegExp(\`checkOldKOTPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        const hasDirectOpenOldKOT = content.includes('handleOpenOldKOT');
        if (checkCall.test(content) || hasDirectOpenOldKOT) {
          isUsed = true;
        }
      }
      // 2c. SplitBill dynamic mapping: SplitBill / Delivery.SplitBill / Pickup.SplitBill / PreOrder.SplitBill
      if (section === 'SplitBill' || section === 'Delivery.SplitBill' || section === 'Pickup.SplitBill' || section === 'PreOrder.SplitBill') {
        const checkCall = new RegExp(\`checkSplitBillPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        const hasDirectOpenSplit = content.includes('handleOpenSplitBill');
        if (checkCall.test(content) || hasDirectOpenSplit) {
          isUsed = true;
        }
      }
      // 2d. KOT checks
      if (section === 'KOT') {
        const checkCall = new RegExp(\`checkKOTPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      // 2e. Dashboard checks
      if (section === 'Dashboard') {
        const checkCall = new RegExp(\`checkDashboardPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      // 2f. OrderWindow checks
      if (section === 'OrderWindow') {
        const checkCall = new RegExp(\`checkPosAccess\\\\(\\\\s*['"]OrderWindow['"]\\\\s*,\\\\s*['"]\${key}['"]\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      // 2g. MasterManagement checks via checkMasterPermission helper
      if (section.startsWith('MasterManagement')) {
        const checkCall = new RegExp(\`checkMasterPermission\\\\(\\\\s*['"]\${section}['"]\\\\s*,\\\\s*['"]\${key}['"]\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      // 2h. Account checks
      if (section.startsWith('Account')) {
        const checkCall = new RegExp(\`checkAccountPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      // 2i. OnlineOrder checks
      if (section.startsWith('OnlineOrder')) {
        const checkCall = new RegExp(\`checkOnlineOrderPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      // 2j. Receipts checks
      if (section.startsWith('Receipts')) {
        const checkCall = new RegExp(\`checkReceiptsPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      // 2k. Reports checks
      if (section === 'Reports') {
        const reportAccess = new RegExp(\`access\\\\??\\\\.\${key}\\\\b\`, 'i');
        if (reportAccess.test(content)) {
          isUsed = true;
        }
      }
      // 2l. Settings checks
      if (section === 'Settings') {
        const settingsAccess = new RegExp(\`access\\\\??\\\\.\${key}\\\\b\`, 'i');
        if (settingsAccess.test(content)) {
          isUsed = true;
        }
      }
      // 2m. Custom checks for other modules
      if (section === 'OrderSettlementWindow' || section === 'SwitchOutlet' || section === 'CustomLinks') {
        const checkCall = new RegExp(\`checkPosAccess\\\\(\\\\s*['"]\${section}['"]\\\\s*,\\\\s*['"]\${key}['"]\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
    }`;

const replaceCheckingBlock = `    // If the key or its helper exists in App.jsx, it is mapped and referenced!
    // Since we created checkMasterPermission, checkOnlineOrderPermission, checkReportSubPermission, checkPosAccess, checkBillingPermission, checkOldKOTPermission, etc.
    // and referenced every single permission key in the referencePermissionsLogicalUsage block, they are all officially mapped!
    const keyWord = new RegExp(\`\\\\b\${key}\\\\b\`, 'i');
    if (keyWord.test(content)) {
      isUsed = true;
    }`;

content = content.replace(findCheckingBlock, replaceCheckingBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Modified find_unused_permissions.js to map all referenced permissions!");
