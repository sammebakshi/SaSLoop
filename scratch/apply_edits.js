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

const normalize = (str) => str.replace(/\r\n/g, '\n');

const replacements = [
  // 1. Edit customer
  {
    target: normalize(`                                     setCustomerDb(prev => {
                                        const existing = prev[editingCustomerPhone];
                                        return {
                                           ...prev,
                                           [editingCustomerPhone]: {
                                              ...existing,
                                              name: editingCustomerFields.name,
                                              address: editingCustomerFields.address
                                           }
                                        };
                                     });`),
    replacement: normalize(`                                     setCustomerDb(prev => {
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
                                     });`)
  },
  // 2. Delete customer
  {
    target: normalize(`                                                          setCustomerDb(prev => {
                                                             const next = { ...prev };
                                                             delete next[c.phone];
                                                             return next;
                                                          });`),
    replacement: normalize(`                                                          setCustomerDb(prev => {
                                                             const next = { ...prev };
                                                             delete next[c.phone];
                                                             localStorage.setItem('pos_customer_db', JSON.stringify(next));
                                                             return next;
                                                          });`)
  },
  // 3. Balance adjustment
  {
    target: normalize(`                                           setCustomerDb(prev => {
                                              const existing = prev[editingCustomerPhone];
                                              const newVal = Number(res.data.loyalty.balance);
                                              return {
                                                 ...prev,
                                                 [editingCustomerPhone]: {
                                                    ...existing,
                                                    balance: newVal
                                                 }
                                              };
                                           });`),
    replacement: normalize(`                                           setCustomerDb(prev => {
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
                                           });`)
  },
  // 4. Points adjustment
  {
    target: normalize(`                                           setCustomerDb(prev => {
                                              const existing = prev[editingCustomerPhone];
                                              const newVal = Number(res.data.loyalty.points);
                                              return {
                                                 ...prev,
                                                 [editingCustomerPhone]: {
                                                    ...existing,
                                                    points: newVal
                                                 }
                                              };
                                           });`),
    replacement: normalize(`                                           setCustomerDb(prev => {
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
                                           });`)
  },
  // 5. Due payment
  {
    target: normalize(`                                    setCustomerDb(prev => ({
                                       ...prev,
                                       [trayFullPhone]: {
                                          ...(prev[trayFullPhone] || {}),
                                          balance: newBal
                                       }
                                    }));`),
    replacement: normalize(`                                    setCustomerDb(prev => {
                                       const nextDb = {
                                          ...prev,
                                          [trayFullPhone]: {
                                             ...(prev[trayFullPhone] || {}),
                                             balance: newBal
                                          }
                                       };
                                       localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
                                       return nextDb;
                                    });`)
  },
  // 6. Add new customer
  {
    target: normalize(`                            setCustomerDb(prev => ({
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
                            }));`),
    replacement: normalize(`                            setCustomerDb(prev => {
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
                            });`)
  },
  // 7. Thermal subtotal
  {
    target: normalize(`                                 {(posSettings.currency || 'Rs')} {(() => {
                                   const sub = parseFloat(previewReceipt.subtotal || 0) > 0 
                                     ? parseFloat(previewReceipt.subtotal) 
                                     : (Array.isArray(previewReceipt.items) ? previewReceipt.items : (typeof previewReceipt.items === 'string' ? JSON.parse(previewReceipt.items || '[]') : [])).reduce((sum, item) => 
                                         sum + (parseFloat(item.price || 0) + (item.modifiers || []).reduce((ma, m) => ma + parseFloat(m.price || 0), 0)) * parseFloat(item.qty || item.quantity || 1), 0);
                                   return sub.toFixed(posSettings.decimalPlaces || 2);
                                 })()}`),
    replacement: normalize(`                                 {(posSettings.currency || 'Rs')} {getReceiptSubtotal(previewReceipt).toFixed(posSettings.decimalPlaces || 2)}`)
  },
  // 8. Thermal grand total
  {
    target: normalize(`                               <span className="w-24 text-right">{(posSettings.currency || 'Rs')} {parseFloat(previewReceipt.total_price || 0).toFixed(posSettings.decimalPlaces || 2)}</span>`),
    replacement: normalize(`                               <span className="w-24 text-right">{(posSettings.currency || 'Rs')} {getReceiptGrandTotal(previewReceipt, posSettings?.isTaxInclusive).toFixed(posSettings.decimalPlaces || 2)}</span>`)
  },
  // 9. Thermal words
  {
    target: normalize(`                           {numberToWords(parseFloat(previewReceipt.total_price || 0))} only`),
    replacement: normalize(`                           {numberToWords(getReceiptGrandTotal(previewReceipt, posSettings?.isTaxInclusive))} only`)
  },
  // 10. Diagnostics subtotal
  {
    target: normalize(`                               <span className="font-bold">Rs {parseFloat(previewReceipt.subtotal || 0).toFixed(2)}</span>`),
    replacement: normalize(`                               <span className="font-bold">Rs {getReceiptSubtotal(previewReceipt).toFixed(2)}</span>`)
  },
  // 11. Diagnostics grand total
  {
    target: normalize(`                               <span>Rs {parseFloat(previewReceipt.total_price || 0).toFixed(2)}</span>`),
    replacement: normalize(`                               <span>Rs {getReceiptGrandTotal(previewReceipt, posSettings?.isTaxInclusive).toFixed(2)}</span>`)
  }
];

let appliedCount = 0;
for (const r of replacements) {
  if (content.includes(r.target)) {
    content = content.replace(r.target, r.replacement);
    appliedCount++;
  } else {
    console.warn("⚠️ Warning: Replacement target not found!");
    console.log(r.target.slice(0, 150) + "...\n");
  }
}

if (appliedCount > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Successfully applied ${appliedCount} replacements to App.jsx!`);
} else {
  console.error("❌ No replacements could be applied. Please check target strings.");
}
