const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

function replaceExact(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Replaced: ${label}`);
  } else {
    console.error(`[FAILED] Target not found for: ${label}`);
  }
}

// 1. Inject helpers right before getFilteredSettingsTabs
const findSettingsTabsStart = `  const getFilteredSettingsTabs = () => {`;
const replaceSettingsTabsStart = `  const verifyManagerPin = (pin) => {
    if (!pin) return false;
    const staffDataStr = localStorage.getItem('pos_all_staff');
    const staff = staffDataStr ? JSON.parse(staffDataStr) : [];
    return !!staff.find(u => {
      const isManager = String(u.role || '').toLowerCase() === 'manager' ||
                        String(u.role || '').toLowerCase() === 'admin' ||
                        String(u.role || '').toLowerCase() === 'brand_owner' ||
                        String(u.designation_name || '').toLowerCase().includes('manager');
      return isManager && u.pos_pin && String(u.pos_pin) === String(pin);
    });
  };

  const verifyPasscodeAction = (moduleName, permissionName, promptText = "Enter Manager PIN to authorize:") => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    
    // Check if passcode is required for this permission
    const requiresPasscode = access[moduleName]?.[permissionName + '_passcode'] === true || access[moduleName]?.[permissionName]?.passcode === true;
    if (!requiresPasscode) return true;
    
    const pin = prompt(promptText);
    if (pin === null) return false;
    
    const isAuthorized = verifyManagerPin(pin);
    if (!isAuthorized) {
      toast.error("Invalid Manager PIN/Passcode!");
      return false;
    }
    return true;
  };

  const checkBillingPasscode = (perm, promptText) => {
    return verifyPasscodeAction('Billing', perm, promptText);
  };

  const checkOldKOTPasscode = (perm, promptText) => {
    const access = getStaffPermissions()?.pos_access;
    let requiresPasscode = false;
    if (orderType === 'DELIVERY') {
      requiresPasscode = access?.Delivery?.OldKOT?.[perm + '_passcode'] === true;
    } else if (orderType === 'PICKUP') {
      requiresPasscode = access?.Pickup?.OldKOT?.[perm + '_passcode'] === true;
    } else if (orderType === 'PRE_ORDER') {
      requiresPasscode = access?.PreOrder?.OldKOT?.[perm + '_passcode'] === true;
    } else {
      requiresPasscode = access?.OldKOT?.[perm + '_passcode'] === true;
    }
    
    if (!requiresPasscode) return true;
    
    const pin = prompt(promptText);
    if (pin === null) return false;
    if (!verifyManagerPin(pin)) {
      toast.error("Invalid Manager PIN/Passcode!");
      return false;
    }
    return true;
  };

  const checkSplitBillPasscode = (perm, promptText) => {
    let requiresPasscode = false;
    const access = getStaffPermissions()?.pos_access;
    if (orderType === 'DELIVERY') {
      requiresPasscode = access?.Delivery?.SplitBill?.[perm + '_passcode'] === true;
    } else if (orderType === 'PICKUP') {
      requiresPasscode = access?.Pickup?.SplitBill?.[perm + '_passcode'] === true;
    } else if (orderType === 'PRE_ORDER') {
      requiresPasscode = access?.PreOrder?.SplitBill?.[perm + '_passcode'] === true;
    } else {
      requiresPasscode = access?.SplitBill?.[perm + '_passcode'] === true;
    }
    
    if (!requiresPasscode) return true;
    
    const pin = prompt(promptText);
    if (pin === null) return false;
    if (!verifyManagerPin(pin)) {
      toast.error("Invalid Manager PIN/Passcode!");
      return false;
    }
    return true;
  };

  const checkReceiptsPasscode = (perm, promptText) => {
    return verifyPasscodeAction('Receipts', perm, promptText);
  };

  const handleTabClick = (tabId, callback) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) {
      callback();
      return;
    }

    if (tabId === 'home') {
      if (access.Dashboard?.visible === false) {
        toast.error("Dashboard is restricted.");
        return;
      }
      if (access.Dashboard?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to access Dashboard:");
        if (pin === null) return;
        if (!verifyManagerPin(pin)) {
          toast.error("Invalid Manager PIN/Passcode!");
          return;
        }
      }
    } else if (tabId === 'billing') {
      if (access.Billing?.visible === false) {
        toast.error("Billing is restricted.");
        return;
      }
      if (access.Billing?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to access Billing:");
        if (pin === null) return;
        if (!verifyManagerPin(pin)) {
          toast.error("Invalid Manager PIN/Passcode!");
          return;
        }
      }
    } else if (tabId === 'live') {
      if (access.OrderWindow?.live_order_tracking === false) {
        toast.error("Live order tracking is restricted.");
        return;
      }
      if (access.OrderWindow?.live_order_tracking_passcode === true) {
        const pin = prompt("Enter Manager PIN to access Live order tracking:");
        if (pin === null) return;
        if (!verifyManagerPin(pin)) {
          toast.error("Invalid Manager PIN/Passcode!");
          return;
        }
      }
    } else if (tabId === 'digital') {
      if (access.OnlineOrder?.visible === false) {
        toast.error("Digital Orders is restricted.");
        return;
      }
      if (access.OnlineOrder?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to access Digital Orders:");
        if (pin === null) return;
        if (!verifyManagerPin(pin)) {
          toast.error("Invalid Manager PIN/Passcode!");
          return;
        }
      }
    } else if (tabId === 'receipts') {
      if (access.Receipts?.visible === false) {
        toast.error("Receipts is restricted.");
        return;
      }
      if (access.Receipts?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to access Receipts:");
        if (pin === null) return;
        if (!verifyManagerPin(pin)) {
          toast.error("Invalid Manager PIN/Passcode!");
          return;
        }
      }
      // Interactive passcode checks for deleted_status and free_status
      if (access.Receipts?.deleted_status_passcode === true) {
        const pin = prompt("Enter Manager PIN to authorize viewing Deleted/Voided bills:");
        if (pin !== null) {
          if (verifyManagerPin(pin)) {
            setAuthorizedDeletedBills(true);
          } else {
            toast.error("Invalid PIN, deleted bills will be hidden.");
          }
        }
      }
      if (access.Receipts?.free_status_passcode === true) {
        const pin = prompt("Enter Manager PIN to authorize viewing Free/FOC bills:");
        if (pin !== null) {
          if (verifyManagerPin(pin)) {
            setAuthorizedFreeBills(true);
          } else {
            toast.error("Invalid PIN, free bills will be hidden.");
          }
        }
      }
    } else if (tabId === 'expenses') {
      if (access.ExpenseManagement?.visible === false) {
        toast.error("Expense Management is restricted.");
        return;
      }
      if (access.ExpenseManagement?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to access Expense Management:");
        if (pin === null) return;
        if (!verifyManagerPin(pin)) {
          toast.error("Invalid Manager PIN/Passcode!");
          return;
        }
      }
    } else if (tabId === 'analytics') {
      if (access.Reports?.visible === false) {
        toast.error("Reports is restricted.");
        return;
      }
      if (access.Reports?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to access Reports:");
        if (pin === null) return;
        if (!verifyManagerPin(pin)) {
          toast.error("Invalid Manager PIN/Passcode!");
          return;
        }
      }
    } else if (tabId === 'config') {
      if (access.OperationManagement?.visible === false) {
        toast.error("Config is restricted.");
        return;
      }
      if (access.OperationManagement?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to access Config:");
        if (pin === null) return;
        if (!verifyManagerPin(pin)) {
          toast.error("Invalid Manager PIN/Passcode!");
          return;
        }
      }
    } else if (tabId === 'settings') {
      if (access.Settings?.visible === false) {
        toast.error("Settings is restricted.");
        return;
      }
      if (access.Settings?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to access Settings:");
        if (pin === null) return;
        if (!verifyManagerPin(pin)) {
          toast.error("Invalid Manager PIN/Passcode!");
          return;
        }
      }
    }

    callback();
  };

  const getFilteredSettingsTabs = () => {`;

replaceExact(findSettingsTabsStart, replaceSettingsTabsStart, 'Helpers Inject');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Helpers inject script completed!');
