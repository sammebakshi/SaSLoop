const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
if (!fs.existsSync(filePath)) {
  console.error("File not found at:", filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n
content = content.replace(/\r\n/g, '\n');

const replacements = [
  // 1. Edit customer
  {
    regex: /setCustomerDb\(\s*prev\s*=>\s*\{\s*const\s+existing\s*=\s*prev\[editingCustomerPhone\];\s*return\s*\{\s*\.\.\.prev,\s*\[editingCustomerPhone\]:\s*\{\s*\.\.\.existing,\s*name:\s*editingCustomerFields\.name,\s*address:\s*editingCustomerFields\.address\s*\}\s*\};\s*\}\)/g,
    replacement: `setCustomerDb(prev => {
                                        const existing = prev[editingCustomerPhone];
                                        const nextDb = {
                                           ...prev,
                                           [editingCustomerPhone]: {
                                              ...existing,
                                              name: editingCustomerFields.name,
                                              address: editingCustomerFields.address
                                           }
                                        };
                                        localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
                                        return nextDb;
                                     })`
  },
  // 2. Delete customer
  {
    regex: /setCustomerDb\(\s*prev\s*=>\s*\{\s*const\s+next\s*=\s*\{\s*\.\.\.prev\s*\};\s*delete\s+next\[c\.phone\];\s*return\s+next;\s*\}\)/g,
    replacement: `setCustomerDb(prev => {
                                                             const next = { ...prev };
                                                             delete next[c.phone];
                                                             localStorage.setItem('pos_customer_db', JSON.stringify(next));
                                                             return next;
                                                          })`
  },
  // 3. Balance adjustment
  {
    regex: /setCustomerDb\(\s*prev\s*=>\s*\{\s*const\s+existing\s*=\s*prev\[editingCustomerPhone\];\s*const\s+newVal\s*=\s*Number\(res\.data\.loyalty\.balance\);\s*return\s*\{\s*\.\.\.prev,\s*\[editingCustomerPhone\]:\s*\{\s*\.\.\.existing,\s*balance:\s*newVal\s*\}\s*\};\s*\}\)/g,
    replacement: `setCustomerDb(prev => {
                                              const existing = prev[editingCustomerPhone];
                                              const newVal = Number(res.data.loyalty.balance);
                                              const nextDb = {
                                                 ...prev,
                                                 [editingCustomerPhone]: {
                                                    ...existing,
                                                    balance: newVal
                                                 }
                                              };
                                              localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
                                              return nextDb;
                                           })`
  },
  // 4. Points adjustment
  {
    regex: /setCustomerDb\(\s*prev\s*=>\s*\{\s*const\s+existing\s*=\s*prev\[editingCustomerPhone\];\s*const\s+newVal\s*=\s*Number\(res\.data\.loyalty\.points\);\s*return\s*\{\s*\.\.\.prev,\s*\[editingCustomerPhone\]:\s*\{\s*\.\.\.existing,\s*points:\s*newVal\s*\}\s*\};\s*\}\)/g,
    replacement: `setCustomerDb(prev => {
                                              const existing = prev[editingCustomerPhone];
                                              const newVal = Number(res.data.loyalty.points);
                                              const nextDb = {
                                                 ...prev,
                                                 [editingCustomerPhone]: {
                                                    ...existing,
                                                    points: newVal
                                                 }
                                              };
                                              localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
                                              return nextDb;
                                           })`
  },
  // 5. Due payment
  {
    regex: /setCustomerDb\(\s*prev\s*=>\s*\(\{\s*\.\.\.prev,\s*\[trayFullPhone\]:\s*\{\s*\.\.\.\(prev\[trayFullPhone\]\s*\|\|\s*\{\}\),\s*balance:\s*newBal\s*\}\s*\}\)\)/g,
    replacement: `setCustomerDb(prev => {
                                       const nextDb = {
                                          ...prev,
                                          [trayFullPhone]: {
                                             ...(prev[trayFullPhone] || {}),
                                             balance: newBal
                                          }
                                       };
                                       localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
                                       return nextDb;
                                    })`
  },
  // 6. Add new customer
  {
    regex: /setCustomerDb\(\s*prev\s*=>\s*\(\{\s*\.\.\.prev,\s*\[fullPhone\]:\s*\{\s*name:\s*newCustomerForm\.name,\s*phone:\s*fullPhone,\s*address:\s*newCustomerForm\.address,\s*points:\s*Number\(newCustomerForm\.points\)\s*\|\|\s*0,\s*orders:\s*0,\s*totalSpent:\s*0,\s*balance:\s*Number\(newCustomerForm\.balance\)\s*\|\|\s*0\s*\}\s*\}\)\)/g,
    replacement: `setCustomerDb(prev => {
                               const nextDb = {
                                  ...prev,
                                  [fullPhone]: {
                                     name: newCustomerForm.name,
                                     phone: fullPhone,
                                     address: newCustomerForm.address,
                                     points: Number(newCustomerForm.points) || 0,
                                     orders: 0,
                                     totalSpent: 0,
                                     balance: Number(newCustomerForm.balance) || 0
                                  }
                               };
                               localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
                               return nextDb;
                            })`
  },
  // 7. Thermal subtotal
  {
    regex: /\{\(posSettings\.currency\s*\|\|\s*'Rs'\)\}\s*\{\(\(\)\s*=>\s*\{\s*const\s+sub\s*=\s*parseFloat\(previewReceipt\.subtotal\s*\|\|\s*0\)\s*>\s*0\s*\?\s*parseFloat\(previewReceipt\.subtotal\)\s*:\s*\(Array\.isArray\(previewReceipt\.items\)\s*\?\s*previewReceipt\.items\s*:\s*\(typeof\s+previewReceipt\.items\s*===\s*'string'\s*\?\s*JSON\.parse\(previewReceipt\.items\s*\|\|\s*'\[\]'\)\s*:\s*\[\]\)\)\.reduce\(\(sum,\s*item\)\s*=>\s*sum\s*\+\s*\(parseFloat\(item\.price\s*\|\|\s*0\)\s*\+\s*\(item\.modifiers\s*\|\|\s*\[\]\)\.reduce\(\(ma,\s*m\)\s*=>\s*ma\s*\+\s*parseFloat\(m\.price\s*\|\|\s*0\),\s*0\)\)\s*\*\s*parseFloat\(item\.qty\s*\|\|\s*item\.quantity\s*\|\|\s*1\),\s*0\);\s*return\s+sub\.toFixed\(posSettings\.decimalPlaces\s*\|\|\s*2\);\s*\}\)\(\)\}/g,
    replacement: `{(posSettings.currency || 'Rs')} {getReceiptSubtotal(previewReceipt).toFixed(posSettings.decimalPlaces || 2)}`
  },
  // 8. Thermal grand total
  {
    regex: /<span className="w-24 text-right">\{\(posSettings\.currency\s*\|\|\s*'Rs'\)\}\s*\{parseFloat\(previewReceipt\.total_price\s*\|\|\s*0\)\.toFixed\(posSettings\.decimalPlaces\s*\|\|\s*2\)\}<\/span>/g,
    replacement: `<span className="w-24 text-right">{(posSettings.currency || 'Rs')} {getReceiptGrandTotal(previewReceipt, posSettings?.isTaxInclusive).toFixed(posSettings.decimalPlaces || 2)}</span>`
  },
  // 9. Diagnostics subtotal
  {
    regex: /<span className="font-bold">Rs\s*\{parseFloat\(previewReceipt\.subtotal\s*\|\|\s*0\)\.toFixed\(2\)\}<\/span>/g,
    replacement: `<span className="font-bold">Rs {getReceiptSubtotal(previewReceipt).toFixed(2)}</span>`
  },
  // 10. Diagnostics grand total
  {
    regex: /<span>Rs\s*\{parseFloat\(previewReceipt\.total_price\s*\|\|\s*0\)\.toFixed\(2\)\}<\/span>/g,
    replacement: `<span>Rs {getReceiptGrandTotal(previewReceipt, posSettings?.isTaxInclusive).toFixed(2)}</span>`
  }
];

let appliedCount = 0;
for (let i = 0; i < replacements.length; i++) {
  const r = replacements[i];
  if (r.regex.test(content)) {
    // Reset regex lastIndex since it's global
    r.regex.lastIndex = 0;
    content = content.replace(r.regex, r.replacement);
    appliedCount++;
    console.log(`✅ Applied replacement #${i + 1}`);
  } else {
    console.warn(`⚠️ Warning: Replacement pattern #${i + 1} did not match!`);
  }
}

if (appliedCount > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\n🎉 Successfully applied ${appliedCount} regex replacements to App.jsx!`);
} else {
  console.error("❌ No replacements could be applied. Please check regular expressions.");
}
