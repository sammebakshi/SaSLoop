const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize newlines to LF for matching
content = content.replace(/\r\n/g, '\n');

// Helper to replace matching regexes
function replaceRegex(pattern, replacement, label) {
  if (pattern.test(content)) {
    content = content.replace(pattern, replacement);
    console.log(`[SUCCESS] Updated ${label}`);
  } else {
    console.warn(`[FAILED] Pattern not found for ${label}`);
  }
}

// 1. isAccessLevelModalOpen header
replaceRegex(
  /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Update Desktop Access Level([\s\S]*?)setIsAccessLevelModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                       <div>
                          <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Lock className="text-[#10ac84]" size={22}/> Update Desktop Access Level</h3>
                          <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Configure visibility for dashboard and reports</p>
                       </div>
                       <button onClick={() => setIsAccessLevelModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                    </div>`,
  'isAccessLevelModalOpen header'
);

// 2. isSettingsModalOpen header (in case it failed previously)
replaceRegex(
  /<div className=\{\`p-5 flex justify-between items-center shrink-0 border-b [\s\S]*?bg-\[\#f8f9fa\][\s\S]*?\}\`\}>([\s\S]*?)Terminal Settings([\s\S]*?)setIsSettingsModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Settings className="text-[#10ac84]" size={22}/> Terminal Settings</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Configure terminal preferences and printer layouts</p>
                        </div>
                        <button onClick={() => setIsSettingsModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-855'}\`}>✕</button>
                     </div>`,
  'isSettingsModalOpen header'
);

// 3. isPayDueModalOpen header
replaceRegex(
  /<div className=\{\`p-5 border-b flex justify-between items-center [\s\S]*?bg-slate-50'\}\`\}>([\s\S]*?)Pay Previous Balance([\s\S]*?)setIsPayDueModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-slate-200 bg-slate-50'}\`}>
                        <div>
                           <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                              <Wallet size={18} className="text-emerald-500" /> Pay Previous Balance
                           </h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>{trayCustomer?.name || 'Customer'} • {trayFullPhone}</p>
                        </div>
                        <button onClick={() => setIsPayDueModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isPayDueModalOpen header'
);

// 4. isTableManagementModalOpen header
replaceRegex(
  /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Table Management([\s\S]*?)setIsTableManagementModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><LayoutGrid className="text-[#10ac84]" size={22}/> Table Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage tables, departments, and QR codes</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1.5 bg-[#10ac84]/20 text-[#10ac84] rounded-lg text-[10px] font-black uppercase">Call Waiter Functionality</span>
                           <button onClick={() => setIsTableManagementModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                        </div>
                     </div>`,
  'isTableManagementModalOpen header'
);

// 5. isUserManagementModalOpen header
replaceRegex(
  /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)User Management([\s\S]*?)setIsUserManagementModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Users className="text-[#10ac84]" size={22}/> User Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage staff, roles, and access levels</p>
                        </div>
                        <button onClick={() => setIsUserManagementModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isUserManagementModalOpen header'
);

// 6. isCaptainAppModalOpen header
replaceRegex(
  /<div className="p-6 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\] mt-6">([\s\S]*?)Captain App([\s\S]*?)setIsCaptainAppModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 mt-6 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Monitor className="text-[#10ac84]" size={22}/> Captain App</h3>
                        </div>
                        <button onClick={() => setIsCaptainAppModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-850'}\`}>✕</button>
                     </div>`,
  'isCaptainAppModalOpen header'
);

// 7. isFeedbackModalOpen header
replaceRegex(
  /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Feedback Management([\s\S]*?)setIsFeedbackModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><MessageSquare className="text-[#10ac84]" size={22}/> Feedback Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Customer experience form</p>
                        </div>
                        <button onClick={() => setIsFeedbackModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isFeedbackModalOpen header'
);

// 8. isInventoryModalOpen header
replaceRegex(
  /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Inventory Management([\s\S]*?)setIsInventoryModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Package className="text-[#10ac84]" size={22}/> Inventory Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage stock on hand and purchased items</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1.5 bg-red-600/20 text-red-500 rounded-lg text-[10px] font-black uppercase">Expired Stock</span>
                           <span className="px-3 py-1.5 bg-yellow-600/20 text-yellow-500 rounded-lg text-[10px] font-black uppercase">Low Stock</span>
                           <span className="px-3 py-1.5 bg-purple-600/20 text-purple-500 rounded-lg text-[10px] font-black uppercase">Expire In 3 Days</span>
                           <button onClick={() => setIsInventoryModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                        </div>
                     </div>`,
  'isInventoryModalOpen header'
);

// 9. isReservationModalOpen header
replaceRegex(
  /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Table Reservations([\s\S]*?)setIsReservationModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Calendar className="text-[#10ac84]" size={22}/> Table Reservations</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage table bookings and guests</p>
                        </div>
                        <button onClick={() => setIsReservationModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isReservationModalOpen header'
);

// 10. isOldKOTModalOpen header
replaceRegex(
  /<div className="p-4 border-b border-\[\#30363d\] flex justify-between items-center bg-\[\#161b22\] rounded-t-2xl">([\s\S]*?)Old KOT([\s\S]*?)setIsOldKOTModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                     <h3 className={\`text-xl font-black uppercase italic tracking-tighter \${isDark ? 'text-white' : 'text-slate-900'}\`}>Old KOT</h3>
                     <button
                        onClick={() => {
                           setIsOldKOTModalOpen(false);
                           setSelectedOldKOTItems({});
                           setOldKOTItemReasons({});
                           setSelectAllOldKOT(false);
                        }}
                        className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                     >
                        ✕
                     </button>
                  </div>`,
  'isOldKOTModalOpen header'
);

// 11. isTransferModalOpen header
replaceRegex(
  /<div className="p-4 border-b border-\[\#30363d\] flex justify-between items-center bg-\[\#161b22\]">([\s\S]*?)Transfer Items to Table([\s\S]*?)setIsTransferModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                     <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Transfer Items to Table
                     </h3>
                     <button onClick={() => setIsTransferModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                  </div>`,
  'isTransferModalOpen header'
);

// 12. isExpenseModalOpen header
replaceRegex(
  /<div className="p-8 bg-\[\#1e293b\] text-white flex justify-between items-center shrink-0\">([\s\S]*?)Daily Expense Ledger([\s\S]*?)setIsExpenseModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><TrendingUp className="text-rose-400"/> Daily Expense Ledger</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Track and manage your operational outflows</p>
                        </div>
                        <button onClick={() => setIsExpenseModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isExpenseModalOpen header'
);

// 13. isOpenPriceModalOpen container
replaceRegex(
  /w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border transition-all/,
  'w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border transition-all',
  'isOpenPriceModalOpen container'
);

// 14. isOpenPriceModalOpen header
replaceRegex(
  /<div className=\{\`p-5 flex justify-between items-center border-b[\s\S]*?Calculator[\s\S]*?setIsOpenPriceModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className={\`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500\`}>
                              <Calculator size={16} />
                           </div>
                           <div>
                              <h3 className={\`text-xl font-black uppercase italic tracking-tighter leading-none \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                                 {openPriceItem.product_name}
                              </h3>
                              <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1.5 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                                 Enter Custom Item Price
                              </p>
                           </div>
                        </div>
                        <button
                           onClick={() => {
                              setIsOpenPriceModalOpen(false);
                              setOpenPriceItem(null);
                              setOpenPriceValue('');
                           }}
                           className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${
                              isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>`,
  'isOpenPriceModalOpen header'
);

// 15. isCouponModalOpen header
replaceRegex(
  /<div className=\{\`p-5 border-b flex justify-between items-center[\s\S]*?Apply Coupon Discount[\s\S]*?setIsCouponModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center \${
                      isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                   }\`}>
                      <div className="flex items-center gap-2">
                         <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                            <path d="M21 5H3a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2Z"/>
                            <path d="M8 6v12" strokeDasharray="2 2"/>
                            <circle cx="12.5" cy="10.5" r="1.2" fill="currentColor"/>
                            <path d="M11.5 14.5 16.5 9.5"/>
                            <circle cx="15.5" cy="13.5" r="1.2" fill="currentColor"/>
                         </svg>
                         <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                            Apply Coupon Discount
                         </h3>
                      </div>
                      <button
                         onClick={() => setIsCouponModalOpen(false)}
                         className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                      >
                         ✕
                      </button>
                   </div>`,
  'isCouponModalOpen header'
);

// 16. isSplitModalOpen header
replaceRegex(
  /<div className="p-8 bg-\[\#1e293b\] text-white flex justify-between items-center shrink-0">([\s\S]*?)Split Bill Settlement([\s\S]*?)setIsSplitModalOpen\(false\)[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                        <div className="flex items-center gap-6">
                           <div>
                              <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><ArrowRight className="text-emerald-500"/> Split Bill Settlement</h3>
                              <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Divide the check for individual payments</p>
                           </div>
                           <div className={\`flex items-center rounded-xl p-1 \${isDark ? 'bg-[#0d1117] border border-[#30363d]' : 'bg-slate-100 border border-slate-200'}\`}>
                              {['PORTION', 'PERCENT', 'ITEM'].map(mode => (
                                 <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setSplitMode(mode)}
                                    className={\`px-4 py-1.5 rounded-lg text-xs font-black uppercase italic transition-all \${splitMode === mode ? 'bg-[#10ac84] text-white shadow-sm' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}\`}
                                 >
                                    {mode}
                                 </button>
                              ))}
                           </div>
                        </div>
                        <button onClick={() => setIsSplitModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isSplitModalOpen header'
);

// Restore CRLF
content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Flex regex replacements completed.');
