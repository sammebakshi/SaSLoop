const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize newlines to LF for matching
content = content.replace(/\r\n/g, '\n');

function makeFlexRegex(findStr) {
  const escaped = findStr
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // escape regex special characters
    .join('\\s*\\n?\\s*');
  return new RegExp(escaped, 'g');
}

const replacements = [
  // 1. isAccessLevelModalOpen header (in case it wasn't applied or needs to be reapplied)
  {
    name: 'isAccessLevelModalOpen header',
    find: `<div className="p-8 bg-[#161b22] text-white flex justify-between items-center shrink-0 border-b border-[#30363d]">
                       <div>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3"><Lock className="text-[#10ac84]"/> Update Desktop Access Level</h3>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] mt-1">Configure visibility for dashboard and reports</p>
                       </div>
                       <button onClick={() => setIsAccessLevelModalOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-[#8b949e] hover:text-white">✕</button>
                    </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                       <div>
                          <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Lock className="text-[#10ac84]" size={22}/> Update Desktop Access Level</h3>
                          <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Configure visibility for dashboard and reports</p>
                       </div>
                       <button onClick={() => setIsAccessLevelModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                    </div>`
  },

  // 2. isSettingsModalOpen header
  {
    name: 'isSettingsModalOpen header',
    find: `<div className={\`p-5 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-[#f8f9fa] border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-base font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Settings className="text-[#10ac84]" size={18}/> Terminal Settings</h3>
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8b949e] mt-0.5 font-bold">Configure terminal preferences and printer layouts</p>
                        </div>
                        <button onClick={() => setIsSettingsModalOpen(false)} className={\`p-2 rounded-full transition-all \${isDark ? 'hover:bg-white/10 text-[#8b949e] hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}\`}>✕</button>
                     </div>`,
    replace: `<div className={\`p-6 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Settings className="text-[#10ac84]" size={22}/> Terminal Settings</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Configure terminal preferences and printer layouts</p>
                        </div>
                        <button onClick={() => setIsSettingsModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-850'}\`}>✕</button>
                     </div>`
  },

  // 3. isPayDueModalOpen header
  {
    name: 'isPayDueModalOpen header',
    find: `<div className={\`p-5 border-b flex justify-between items-center \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-slate-200 bg-slate-50'}\`}>
                        <div>
                           <h3 className="text-sm font-black uppercase italic tracking-tighter flex items-center gap-2">
                              <Wallet size={18} className="text-emerald-500" /> Pay Previous Balance
                           </h3>
                           <p className="text-[10px] font-bold text-slate-400 mt-0.5">{trayCustomer?.name || 'Customer'} • {trayFullPhone}</p>
                        </div>
                        <button onClick={() => setIsPayDueModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-slate-200 bg-slate-50'}\`}>
                        <div>
                           <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                              <Wallet size={18} className="text-emerald-500" /> Pay Previous Balance
                           </h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>{trayCustomer?.name || 'Customer'} • {trayFullPhone}</p>
                        </div>
                        <button onClick={() => setIsPayDueModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
  },

  // 4. isTableManagementModalOpen header
  {
    name: 'isTableManagementModalOpen header',
    find: `<div className="p-8 bg-[#161b22] text-white flex justify-between items-center shrink-0 border-b border-[#30363d]">
                        <div>
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3"><LayoutGrid className="text-[#10ac84]"/> Table Management</h3>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] mt-1">Manage tables, departments, and QR codes</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1.5 bg-[#10ac84]/20 text-[#10ac84] rounded-lg text-[10px] font-black uppercase">Call Waiter Functionality</span>
                           <button onClick={() => setIsTableManagementModalOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-[#8b949e] hover:text-white">✕</button>
                        </div>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><LayoutGrid className="text-[#10ac84]" size={22}/> Table Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage tables, departments, and QR codes</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1.5 bg-[#10ac84]/20 text-[#10ac84] rounded-lg text-[10px] font-black uppercase">Call Waiter Functionality</span>
                           <button onClick={() => setIsTableManagementModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                        </div>
                     </div>`
  },

  // 5. isUserManagementModalOpen header
  {
    name: 'isUserManagementModalOpen header',
    find: `<div className="p-8 bg-[#161b22] text-white flex justify-between items-center shrink-0 border-b border-[#30363d]">
                        <div>
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3"><Users className="text-[#10ac84]"/> User Management</h3>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] mt-1">Manage staff, roles, and access levels</p>
                        </div>
                        <button onClick={() => setIsUserManagementModalOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-[#8b949e] hover:text-white">✕</button>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Users className="text-[#10ac84]" size={22}/> User Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage staff, roles, and access levels</p>
                        </div>
                        <button onClick={() => setIsUserManagementModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
  },

  // 6. isCaptainAppModalOpen header
  {
    name: 'isCaptainAppModalOpen header',
    find: `<div className="p-6 bg-[#161b22] text-white flex justify-between items-center shrink-0 border-b border-[#30363d] mt-6">
                        <div>
                           <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2"><Monitor className="text-[#10ac84]"/> Captain App</h3>
                        </div>
                        <button onClick={() => setIsCaptainAppModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-[#8b949e] hover:text-white">✕</button>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 mt-6 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Monitor className="text-[#10ac84]" size={22}/> Captain App</h3>
                        </div>
                        <button onClick={() => setIsCaptainAppModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-850'}\`}>✕</button>
                     </div>`
  },

  // 7. isFeedbackModalOpen header
  {
    name: 'isFeedbackModalOpen header',
    find: `<div className="p-8 bg-[#161b22] text-white flex justify-between items-center shrink-0 border-b border-[#30363d]">
                        <div>
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3"><MessageSquare className="text-[#10ac84]"/> Feedback Management</h3>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] mt-1">Customer experience form</p>
                        </div>
                        <button onClick={() => setIsFeedbackModalOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-[#8b949e] hover:text-white">✕</button>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><MessageSquare className="text-[#10ac84]" size={22}/> Feedback Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Customer experience form</p>
                        </div>
                        <button onClick={() => setIsFeedbackModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
  },

  // 8. isInventoryModalOpen header
  {
    name: 'isInventoryModalOpen header',
    find: `<div className="p-8 bg-[#161b22] text-white flex justify-between items-center shrink-0 border-b border-[#30363d]">
                        <div>
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3"><Package className="text-[#10ac84]"/> Inventory Management</h3>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] mt-1">Manage stock on hand and purchased items</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1.5 bg-red-600/20 text-red-500 rounded-lg text-[10px] font-black uppercase">Expired Stock</span>
                           <span className="px-3 py-1.5 bg-yellow-600/20 text-yellow-500 rounded-lg text-[10px] font-black uppercase">Low Stock</span>
                           <span className="px-3 py-1.5 bg-purple-600/20 text-purple-500 rounded-lg text-[10px] font-black uppercase">Expire In 3 Days</span>
                           <button onClick={() => setIsInventoryModalOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-[#8b949e] hover:text-white">✕</button>
                        </div>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
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
                     </div>`
  },

  // 9. isReservationModalOpen header
  {
    name: 'isReservationModalOpen header',
    find: `<div className="p-8 bg-[#161b22] text-white flex justify-between items-center shrink-0 border-b border-[#30363d]">
                        <div>
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3"><Calendar className="text-[#10ac84]"/> Table Reservations</h3>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e] mt-1">Manage table bookings and guests</p>
                        </div>
                        <button onClick={() => setIsReservationModalOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-[#8b949e] hover:text-white">✕</button>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Calendar className="text-[#10ac84]" size={22}/> Table Reservations</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage table bookings and guests</p>
                        </div>
                        <button onClick={() => setIsReservationModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
  },

  // 10. isOldKOTModalOpen header
  {
    name: 'isOldKOTModalOpen header',
    find: `<div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#161b22] rounded-t-2xl">
                     <h3 className="text-sm font-bold text-[#c9d1d9]">Old KOT</h3>
                     <button
                        onClick={() => {
                           setIsOldKOTModalOpen(false);
                           setSelectedOldKOTItems({});
                           setOldKOTItemReasons({});
                           setSelectAllOldKOT(false);
                        }}
                        className="text-[#8b949e] hover:text-[#c9d1d9] text-sm"
                     >
                        ✕
                     </button>
                  </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
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
                  </div>`
  },

  // 11. isTransferModalOpen header
  {
    name: 'isTransferModalOpen header',
    find: `<div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]">
                     <h3 className="text-sm font-bold text-[#c9d1d9] uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Transfer Items to Table
                     </h3>
                     <button onClick={() => setIsTransferModalOpen(false)} className="text-[#8b949e] hover:text-[#c9d1d9] text-sm p-1 hover:bg-[#21262d] rounded-lg transition-colors">✕</button>
                  </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                     <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Transfer Items to Table
                     </h3>
                     <button onClick={() => setIsTransferModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                  </div>`
  },

  // 12. isExpenseModalOpen header
  {
    name: 'isExpenseModalOpen header',
    find: `<div className="p-8 bg-[#1e293b] text-white flex justify-between items-center shrink-0">
                        <div>
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3"><TrendingUp className="text-rose-400"/> Daily Expense Ledger</h3>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Track and manage your operational outflows</p>
                        </div>
                        <button onClick={() => setIsExpenseModalOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-slate-400"><Trash2 size={20}/></button>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><TrendingUp className="text-rose-400"/> Daily Expense Ledger</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Track and manage your operational outflows</p>
                        </div>
                        <button onClick={() => setIsExpenseModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
  },

  // 13. isOpenPriceModalOpen container
  {
    name: 'isOpenPriceModalOpen container',
    find: `className={\`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border transition-all \${
                        isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                     }\`}`,
    replace: `className={\`w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border transition-all \${
                        isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-850'
                     }\`}`
  },

  // 14. isOpenPriceModalOpen header
  {
    name: 'isOpenPriceModalOpen header',
    find: `<div className={\`p-5 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#0d1117]/50 border-[#30363d]' : 'bg-slate-50 border-slate-100'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className={\`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500\`}>
                              <Calculator size={16} />
                           </div>
                           <div>
                              <h3 className={\`text-sm font-black uppercase italic tracking-tight leading-tight \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                                 {openPriceItem.product_name}
                              </h3>
                              <p className={\`text-[8px] font-black uppercase tracking-widest \${isDark ? 'text-gray-400' : 'text-slate-400'}\`}>
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
                           className={\`opacity-65 hover:opacity-100 text-lg font-bold transition-all p-1 rounded-full \${
                              isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>`,
    replace: `<div className={\`p-6 flex justify-between items-center border-b \${
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
                     </div>`
  },

  // 15. isCouponModalOpen header
  {
    name: 'isCouponModalOpen header',
    find: `<div className={\`p-5 border-b flex justify-between items-center \${
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
                         <h3 className="text-sm font-black uppercase italic tracking-tighter">
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
    replace: `<div className={\`p-6 border-b flex justify-between items-center \${
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
                   </div>`
  },

  // 16. isSplitModalOpen header
  {
    name: 'isSplitModalOpen header',
    find: `<div className="p-8 bg-[#1e293b] text-white flex justify-between items-center shrink-0">
                        <div>
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3"><ArrowRight className="text-emerald-500"/> Split Bill Settlement</h3>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Divide the check for individual payments</p>
                        </div>
                        <div className="flex gap-2">
                           {['PORTION', 'PERCENT', 'ITEM'].map(mode => (
                              <button
                                 key={mode}
                                 onClick={() => setSplitMode(mode)}
                                 className={\`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all \${splitMode === mode ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}\`}
                              >
                                 {mode} Wise
                              </button>
                           ))}
                           <button onClick={() => setIsSplitModalOpen(false)} className="ml-4 p-2.5 hover:bg-white/10 rounded-xl transition-all text-slate-400"><Trash2 size={20}/></button>
                        </div>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-205'}\`}>
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
                     </div>`
  }
];

let applied = 0;
let missed = [];

replacements.forEach(r => {
  const regex = makeFlexRegex(r.find);
  if (regex.test(content)) {
    content = content.replace(regex, r.replace);
    console.log(`[SUCCESS] Applied ${r.name}`);
    applied++;
  } else {
    console.warn(`[FAILED] Pattern not found for ${r.name}`);
    missed.push(r.name);
  }
});

// Restore CRLF
content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, content, 'utf8');

console.log(`Done. Applied ${applied} flex replacements. Missed: ${missed.length}`);
