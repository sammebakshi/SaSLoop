const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../scratch/find_unused_permissions.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');

// Replace the check loop with a smarter one
const findTargetLoop = `    // Check 2: Dynamic checks via functions
    if (!isUsed) {
      if (section === 'Billing' || section === 'Delivery.Billing' || section === 'Pickup.Billing' || section === 'PreOrder.Billing') {
        const checkCall = new RegExp(\`checkBillingPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'OldKOT' || section === 'Delivery.OldKOT' || section === 'Pickup.OldKOT' || section === 'PreOrder.OldKOT') {
        const checkCall = new RegExp(\`checkOldKOTPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'KOT') {
        const checkCall = new RegExp(\`checkKOTPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'Dashboard') {
        const checkCall = new RegExp(\`checkDashboardPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'OrderWindow') {
        const checkCall = new RegExp(\`checkPosAccess\\\\(\\\\s*['"]OrderWindow['"]\\\\s*,\\\\s*['"]\${key}['"]\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'SplitBill' || section === 'Delivery.SplitBill' || section === 'Pickup.SplitBill' || section === 'PreOrder.SplitBill') {
        const checkCall = new RegExp(\`checkSplitBillPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'CustomerManagement' || section === 'CustomerManagement.WalletManagement') {
        const checkCall = new RegExp(\`checkCustomerPermission\\\\(\\\\s*['"]\${key} === 'visible' ? 'visible' : key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'Account' || section === 'Account.CloseDayWindow' || section === 'Account.CloseShiftWindow') {
        const checkCall = new RegExp(\`checkAccountPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'OnlineOrder' || section === 'OnlineOrder.StoreSettings') {
        const checkCall = new RegExp(\`checkOnlineOrderPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'Receipts' || section === 'Receipts.EditBill') {
        const checkCall = new RegExp(\`checkReceiptsPermission\\\\(\\\\s*['"]\${key}['"]\\\\s*\\\\)\`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'Reports') {
        // Look inside getFilteredReportsList mapping
        // e.g. access.sales_report, access.todays_report
        const reportAccess = new RegExp(\`access\\\\??\\\\.\${key}\\\\b\`, 'i');
        if (reportAccess.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'Settings') {
        // Look inside getFilteredSettingsTabs
        // e.g. access?.general, access?.profile, etc.
        const settingsAccess = new RegExp(\`access\\\\??\\\\.\${key}\\\\b\`, 'i');
        if (settingsAccess.test(content)) {
          isUsed = true;
        }
      }
    }`;

const replaceTargetLoop = `    // Check 2: Dynamic checks via functions
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

content = content.replace(findTargetLoop, replaceTargetLoop);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated find_unused_permissions.js!");
