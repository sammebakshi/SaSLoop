const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

// Replace printSave button nested braces
const findPrintSave = `                        {checkBillingPermission('allow_draft_bill_printing') && (
                          {checkPosAccess('OrderWindow', 'enable_print_settle') && (
                        <button
                            disabled={isCheckingOut}
                            onClick={() => handleCheckout('PRINT')}
                            className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                          >
                            Print & Save
                          </button>
                      )}
                        )}`;

const replacePrintSave = `                        {checkBillingPermission('allow_draft_bill_printing') && checkPosAccess('OrderWindow', 'enable_print_settle') && (
                          <button
                            disabled={isCheckingOut}
                            onClick={() => handleCheckout('PRINT')}
                            className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                          >
                            Print & Save
                          </button>
                        )}`;

function apply(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Fixed: ${label}`);
  } else {
    // Try without spacing
    const normalizedFind = find.replace(/\r\n/g, '\n').replace(/\s+/g, '');
    const normalizedContent = content.replace(/\s+/g, '');
    const index = normalizedContent.indexOf(normalizedFind);
    if (index !== -1) {
      console.warn(`[WARNING] Found normalized target for: ${label}, but direct match failed.`);
    } else {
      console.error(`[FAILED] Target not found for: ${label}`);
    }
  }
}

apply(findPrintSave, replacePrintSave, 'Print & Save button nested braces');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done fixing printSave button nested braces!');
