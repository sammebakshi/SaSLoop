const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

function replaceExactlyOnce(target, replacement, label) {
  const normTarget = target.replace(/\r\n/g, '\n').trim();
  const normReplacement = replacement.replace(/\r\n/g, '\n').trim();
  
  const index = content.indexOf(normTarget);
  if (index === -1) {
    console.error(`❌ Failed: Target not found for: ${label}`);
    process.exit(1);
  }
  if (content.indexOf(normTarget, index + 1) !== -1) {
    console.error(`❌ Failed: Multiple occurrences found for: ${label}`);
    process.exit(1);
  }
  
  content = content.replace(normTarget, normReplacement);
  console.log(`✅ Success: Replaced ${label}`);
}

// 1. Adjust button in manage-balances list
replaceExactlyOnce(
`<button
                                                   onClick={() => {
                                                      setEditingCustomerPhone(c.phone);
                                                      setAdjustmentType('ADD');
                                                      setAdjustmentAmount('');
                                                   }}
                                                   className={\`p-2 rounded-lg transition-colors inline-flex items-center gap-1 \${isDark ? 'bg-[#18ba60]/10 text-[#18ba60] hover:bg-[#18ba60]/20' : 'bg-[#18ba60]/10 text-[#18ba60] hover:bg-[#18ba60]/20'}\`}
                                                >
                                                   <Coins size={12} />
                                                   <span className="text-[9px] font-bold uppercase">Adjust</span>
                                                </button>`,
`{getStaffPermissions()?.pos_access?.CustomerManagement?.WalletManagement?.add_credit !== false && (
                                                <button
                                                   onClick={() => {
                                                      setEditingCustomerPhone(c.phone);
                                                      setAdjustmentType('ADD');
                                                      setAdjustmentAmount('');
                                                   }}
                                                   className={\`p-2 rounded-lg transition-colors inline-flex items-center gap-1 \${isDark ? 'bg-[#18ba60]/10 text-[#18ba60] hover:bg-[#18ba60]/20' : 'bg-[#18ba60]/10 text-[#18ba60] hover:bg-[#18ba60]/20'}\`}
                                                >
                                                   <Coins size={12} />
                                                   <span className="text-[9px] font-bold uppercase">Adjust</span>
                                                </button>
                                             )}`,
  "Adjust balance button"
);

// 2. Points Ledger tab button
replaceExactlyOnce(
`<button
                              type="button"
                              onClick={() => setCustomerHistoryActiveTab('points')}
                              className={\`px-4 py-1.5 rounded-lg text-xs font-black uppercase italic transition-all \${
                                 customerHistoryActiveTab === 'points'
                                    ? 'bg-[#10ac84] text-white shadow-sm'
                                    : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                              }\`}
                           >
                              Points Ledger
                           </button>`,
`{getStaffPermissions()?.pos_access?.CustomerManagement?.WalletManagement?.view_transactions !== false && (
                              <button
                                 type="button"
                                 onClick={() => setCustomerHistoryActiveTab('points')}
                                 className={\`px-4 py-1.5 rounded-lg text-xs font-black uppercase italic transition-all \${
                                    customerHistoryActiveTab === 'points'
                                       ? 'bg-[#10ac84] text-white shadow-sm'
                                       : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                                 }\`}
                              >
                                 Points Ledger
                              </button>
                           )}`,
  "Points Ledger tab button"
);

// 3. Points History click handler 1
replaceExactlyOnce(
`                          refreshCustomerHistory(fullPhone);
                          setCustomerHistoryActiveTab('points');
                          setIsCustomerHistoryModalOpen(true);`,
`                          refreshCustomerHistory(fullPhone);
                          const canViewTx = getStaffPermissions()?.pos_access?.CustomerManagement?.WalletManagement?.view_transactions !== false;
                          setCustomerHistoryActiveTab(canViewTx ? 'points' : 'orders');
                          setIsCustomerHistoryModalOpen(true);`,
  "Points History click handler 1"
);

// 4. Points History click handler 2
replaceExactlyOnce(
`                            refreshCustomerHistory(fullPhone);
                            setCustomerHistoryActiveTab('points');
                            setIsCustomerHistoryModalOpen(true);`,
`                            refreshCustomerHistory(fullPhone);
                            const canViewTx = getStaffPermissions()?.pos_access?.CustomerManagement?.WalletManagement?.view_transactions !== false;
                            setCustomerHistoryActiveTab(canViewTx ? 'points' : 'orders');
                            setIsCustomerHistoryModalOpen(true);`,
  "Points History click handler 2"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("🎉 Customer Wallet and Transaction Ledger permissions applied successfully!");
