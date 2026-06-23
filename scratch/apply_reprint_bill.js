const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

function replaceExactlyOnce(target, replacement, name) {
  const normalizedTarget = target.replace(/\r\n/g, '\n');
  const normalizedReplacement = replacement.replace(/\r\n/g, '\n');
  const index = content.indexOf(normalizedTarget);
  if (index === -1) {
    console.error(`--- Debug for ${name} ---`);
    console.error(`Target starts with: ${JSON.stringify(normalizedTarget.substring(0, 100))}`);
    throw new Error(`Target not found: ${name}`);
  }
  if (content.indexOf(normalizedTarget, index + 1) !== -1) {
    throw new Error(`Target found multiple times: ${name}`);
  }
  content = content.replace(normalizedTarget, normalizedReplacement);
  console.log(`✅ Successfully replaced: ${name}`);
}

// 1. Store all staff in localStorage
replaceExactlyOnce(
`      const staffRes = await posService.getStaff();
      const staffList = staffRes.data || [];
      const waitersOnly = staffList.filter(s => {`,
`      const staffRes = await posService.getStaff();
      const staffList = staffRes.data || [];
      localStorage.setItem('pos_all_staff', JSON.stringify(staffList));
      const waitersOnly = staffList.filter(s => {`,
  "Store staff in localStorage"
);

// 2. handleCheckout printing check
replaceExactlyOnce(
`    if (type === 'PRINT' && !checkBillingPermission('allow_draft_bill_printing')) {
      return toast.error("You do not have permission to print a draft bill.");
    }`,
`    if (type === 'PRINT') {
      if (!checkBillingPermission('allow_draft_bill_printing')) {
        return toast.error("You do not have permission to print a draft bill.");
      }
      const isBillPrinted = selectedTable && tableStatuses[selectedTable.id] === 'PRINTED';
      if (isBillPrinted) {
        const access = getStaffPermissions()?.pos_access;
        const pathPrefix = orderType === 'DELIVERY' ? ['Delivery', 'Billing'] :
                           orderType === 'PICKUP' ? ['Pickup', 'Billing'] :
                           orderType === 'PRE_ORDER' ? ['PreOrder', 'Billing'] :
                           orderType === 'QUICK' ? ['QuickBill'] : ['Billing'];
        let billingAccess = access;
        if (access) {
          for (const key of pathPrefix) {
            billingAccess = billingAccess?.[key];
          }
        }
        const isRestricted = billingAccess?.restrict_reprint_bill === true;
        const passcodeRequired = billingAccess?.restrict_reprint_bill_passcode === true;
        if (isRestricted) {
          if (passcodeRequired) {
            const pin = prompt("Enter Manager PIN to authorize reprint:");
            if (pin === null) return;
            const staffDataStr = localStorage.getItem('pos_all_staff');
            const staff = staffDataStr ? JSON.parse(staffDataStr) : [];
            const authorized = staff.find(u => {
              const isManager = String(u.role || '').toLowerCase() === 'manager' ||
                                String(u.role || '').toLowerCase() === 'admin' ||
                                String(u.role || '').toLowerCase() === 'brand_owner' ||
                                String(u.designation_name || '').toLowerCase().includes('manager');
              return isManager && u.pos_pin && String(u.pos_pin) === String(pin);
            });
            if (!authorized) {
              return toast.error("Invalid Manager PIN/Passcode!");
            }
          } else {
            return toast.error("Reprinting bills is restricted for this access level.");
          }
        }
      }
    }`,
  "Add reprint billing restrictions to handleCheckout"
);

// 3. Dynamic Button Label in Billing tray
replaceExactlyOnce(
`                        {checkBillingPermission('allow_draft_bill_printing') && (
                          <button
                            disabled={isCheckingOut}
                            onClick={() => handleCheckout('PRINT')}
                            className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                          >
                            Print & Save
                          </button>
                        )}`,
`                        {checkBillingPermission('allow_draft_bill_printing') && (
                          <button
                            disabled={isCheckingOut}
                            onClick={() => handleCheckout('PRINT')}
                            className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                          >
                            {selectedTableStatus === 'PRINTED' ? 'Reprint Bill' : 'Print & Save'}
                          </button>
                        )}`,
  "Change Print & Save button label to Reprint Bill dynamically"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('🎉 All replacements done successfully!');
