const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize newlines to LF for matching
content = content.replace(/\r\n/g, '\n');

const replacements = [
  // 1. isAccessLevelModalOpen
  {
    find: `className="w-full max-w-4xl bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh]"`,
    replace: `className={\`w-full max-w-4xl border rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[85vh] transition-all \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`
  },
  {
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

  // 2. isSettingsModalOpen
  {
    find: `className={\`w-[820px] max-w-[95vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border flex flex-col transition-all \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`,
    replace: `className={\`w-[820px] max-w-[95vw] max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl border flex flex-col transition-all \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`
  },
  {
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

  // 3. isPaymentModalOpen
  {
    find: `className={\`rounded-3xl border w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col \${isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}`,
    replace: `className={\`rounded-[2rem] border w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col \${isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}`
  },
  {
    find: `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-slate-200 bg-slate-50'}\`}>
                        <div>
                           <h3 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
                              Choose Payment Mode
                           </h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Bill No: {billNo}</p>
                        </div>
                        <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
                     </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                              Choose Payment Mode
                           </h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Bill No: {billNo}</p>
                        </div>
                        <button onClick={() => setIsPaymentModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
  },

  // 4. isPayDueModalOpen
  {
    find: `className={\`rounded-3xl border w-full max-w-md overflow-hidden shadow-2xl flex flex-col \${isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}`,
    replace: `className={\`rounded-[2rem] border w-full max-w-md overflow-hidden shadow-2xl flex flex-col \${isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}`
  },
  {
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
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                              <Wallet size={18} className="text-emerald-500" /> Pay Previous Balance
                           </h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>{trayCustomer?.name || 'Customer'} • {trayFullPhone}</p>
                        </div>
                        <button onClick={() => setIsPayDueModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
  },

  // 5. isTableManagementModalOpen
  {
    find: `className="w-full max-w-5xl bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh]"`,
    replace: `className="w-full max-w-5xl bg-[#0d1117] rounded-[2rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh]"`
  },
  {
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

  // 6. isUserManagementModalOpen
  {
    find: `className="w-full max-w-5xl bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh]"`,
    replace: `className="w-full max-w-5xl bg-[#0d1117] rounded-[2rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh]"`
  },
  {
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

  // 7. isCaptainAppModalOpen
  {
    find: `className="relative bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh] w-[400px]"`,
    replace: `className="relative bg-[#0d1117] rounded-[2rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh] w-[400px]"`
  },
  {
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

  // 8. isFeedbackModalOpen
  {
    find: `className="w-full max-w-2xl bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col"`,
    replace: `className="w-full max-w-2xl bg-[#0d1117] rounded-[2rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col"`
  },
  {
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

  // 9. isInventoryModalOpen
  {
    find: `className="w-full max-w-6xl bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh]"`,
    replace: `className="w-full max-w-6xl bg-[#0d1117] rounded-[2rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh]"`
  },
  {
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

  // 10. isReservationModalOpen
  {
    find: `className="w-full max-w-6xl bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh]"`,
    replace: `className="w-full max-w-6xl bg-[#0d1117] rounded-[2rem] overflow-hidden shadow-2xl border border-[#30363d] flex flex-col h-[85vh]"`
  },
  {
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

  // 11. isOldKOTModalOpen
  {
    find: `className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-full max-w-4xl flex flex-col shadow-2xl"`,
    replace: `className={\`border rounded-[2rem] w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden transition-all \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`
  },
  {
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

  // 12. isTransferModalOpen
  {
    find: `className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden"`,
    replace: `className={\`border rounded-[2rem] w-full max-w-lg flex flex-col shadow-2xl overflow-hidden transition-all \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`
  },
  {
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

  // 13. isAddCustomerModalOpen
  {
    find: `className={\`w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border flex flex-col \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`,
    replace: `className={\`w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl border flex flex-col \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`
  },
  {
    find: `<div className={\`p-8 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-[#f8f9fa] border-slate-200 text-slate-800'}\`}>
                     <div>
                        <h3 className={\`text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 \${isDark ? 'text-white' : 'text-slate-900'}\`}><UserPlus className="text-[#18ba60]"/> Adding Customers</h3>
                        <p className={\`text-[10px] font-black uppercase tracking-[0.2em] mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Create a new customer profile</p>
                     </div>
                     <button onClick={() => setIsAddCustomerModalOpen(false)} className={\`p-2.5 rounded-xl transition-all \${isDark ? 'hover:bg-white/10 text-[#8b949e] hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}\`}>X</button>
                  </div>`,
    replace: `<div className={\`p-6 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                     <div>
                        <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><UserPlus className="text-[#18ba60]"/> Adding Customers</h3>
                        <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Create a new customer profile</p>
                     </div>
                     <button onClick={() => setIsAddCustomerModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-850'}\`}>✕</button>
                  </div>`
  },

  // 14. isRejectionModalOpen
  {
    find: `className={\`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border flex flex-col bg-[#0d1117] border-[#30363d]\`}`,
    replace: `className={\`w-full max-w-md border rounded-[2rem] overflow-hidden shadow-2xl flex flex-col \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`
  },
  {
    find: `<div className="p-5 flex justify-between items-center shrink-0 border-b bg-[#161b22] border-[#30363d] text-white">
                <div>
                  <h3 className="text-md font-bold uppercase tracking-wider text-red-500 flex items-center gap-2">
                    {isManagingPresets ? "Manage Rejection Presets" : "Cancel / Reject Order"}
                  </h3>
                  <p className="text-[10px] text-[#8b949e] mt-1">
                    {isManagingPresets ? "Add or remove preset rejection reasons" : "Specify a reason to notify the customer"}
                  </p>
                </div>
                <button
                  onClick={() => setIsRejectionModalOpen(false)}
                  className="p-1.5 rounded hover:bg-white/10 text-[#8b949e] hover:text-white transition-all cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                <div>
                  <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                    {isManagingPresets ? "Manage Rejection Presets" : "Cancel / Reject Order"}
                  </h3>
                  <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                    {isManagingPresets ? "Add or remove preset rejection reasons" : "Specify a reason to notify the customer"}
                  </p>
                </div>
                <button
                  onClick={() => setIsRejectionModalOpen(false)}
                  className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                >
                  ✕
                </button>
              </div>`
  },

  // 15. isCustomerHistoryModalOpen
  {
    find: `className={\`p-6 border-b flex justify-between items-center \${
                     isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                  }\`}>
                     <div className="flex items-center gap-6">
                        <div>
                           <h3 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
                              <History className="text-emerald-500" size={22} />
                              Customer Profile & History
                           </h3>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center \${
                     isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                  }\`}>
                     <div className="flex items-center gap-6">
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                              <History className="text-emerald-500" size={22} />
                              Customer Profile & History
                           </h3>`
  },

  // 16. isWaiterModalOpen
  {
    find: `className={\`border rounded-2xl w-full max-w-md flex flex-col shadow-2xl \${
                  isDark ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]' : 'bg-white border-slate-200 text-slate-800'
               }\`}`,
    replace: `className={\`border rounded-[2rem] w-full max-w-md flex flex-col shadow-2xl overflow-hidden \${
                  isDark ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]' : 'bg-white border-slate-200 text-slate-800'
               }\`}`
  },
  {
    find: `<div className={\`p-4 border-b flex justify-between items-center rounded-t-2xl \${
                     isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                  }\`}>
                     <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-emerald-500">
                           <path d="M3 20h18" strokeLinecap="round" />
                           <path d="M19 16a7 7 0 0 0-14 0z" fill="currentColor" />
                           <path d="M12 5v4M10 5h4" strokeLinecap="round" />
                        </svg>
                        <h3 className="text-sm font-bold uppercase tracking-wider">Select Waiter / Staff</h3>
                     </div>
                     <button
                        onClick={() => setIsWaiterModalOpen(false)}
                        className={\`hover:opacity-80 text-sm \${isDark ? 'text-[#8b949e]' : 'text-slate-400'}\`}
                     >
                        ✕
                     </button>
                  </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center \${
                     isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                  }\`}>
                     <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-emerald-500">
                           <path d="M3 20h18" strokeLinecap="round" />
                           <path d="M19 16a7 7 0 0 0-14 0z" fill="currentColor" />
                           <path d="M12 5v4M10 5h4" strokeLinecap="round" />
                        </svg>
                        <h3 className={\`text-xl font-black uppercase italic tracking-tighter \${isDark ? 'text-white' : 'text-slate-900'}\`}>Select Waiter / Staff</h3>
                     </div>
                     <button
                        onClick={() => setIsWaiterModalOpen(false)}
                        className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                     >
                        ✕
                     </button>
                  </div>`
  },

  // 17. isRiderModalOpen
  {
    find: `className={\`border rounded-2xl w-full max-w-md flex flex-col shadow-2xl \${
                  isDark ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]' : 'bg-white border-slate-200 text-slate-800'
               }\`}`,
    // Note: this target is the same as WaiterModalOpen, but WaiterModalOpen is first, so it will be replaced.
    // However, Waiter and Rider use identical container className strings. Let's make sure it replaces it universally.
    // Wait, by setting AllowMultiple, the same container replacement will match both automatically!
    replace: `className={\`border rounded-[2rem] w-full max-w-md flex flex-col shadow-2xl overflow-hidden \${
                  isDark ? 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]' : 'bg-white border-slate-200 text-slate-800'
               }\`}`
  },
  {
    find: `<div className={\`p-4 border-b flex justify-between items-center rounded-t-2xl \${
                     isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                  }\`}>
                     <div className="flex items-center gap-2">
                        <Bike className="text-emerald-500" size={18} />
                        <h3 className="text-sm font-bold uppercase tracking-wider">Select Delivery Boy / Rider</h3>
                     </div>
                     <button
                        onClick={() => setIsRiderModalOpen(false)}
                        className={\`hover:opacity-80 text-sm \${isDark ? 'text-[#8b949e]' : 'text-slate-400'}\`}
                     >
                        ✕
                     </button>
                  </div>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center \${
                     isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                  }\`}>
                     <div className="flex items-center gap-2">
                        <Bike className="text-emerald-500" size={22} />
                        <h3 className={\`text-xl font-black uppercase italic tracking-tighter \${isDark ? 'text-white' : 'text-slate-900'}\`}>Select Delivery Boy / Rider</h3>
                     </div>
                     <button
                        onClick={() => setIsRiderModalOpen(false)}
                        className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                     >
                        ✕
                     </button>
                  </div>`
  },

  // 18. isExpenseModalOpen
  {
    find: `className="w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[85vh]"`,
    replace: `className={\`w-full max-w-5xl border rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[85vh] transition-all \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`
  },
  {
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
  {
    find: `className="flex-1 flex overflow-hidden bg-slate-50"`,
    replace: `className={\`flex-1 flex overflow-hidden \${isDark ? 'bg-[#0d1117]' : 'bg-slate-50'}\`}`
  },
  {
    find: `className="w-[400px] border-r border-slate-200 p-8 overflow-y-auto no-scrollbar space-y-6"`,
    replace: `className={\`w-[400px] border-r p-8 overflow-y-auto no-scrollbar space-y-6 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-slate-50'}\`}`
  },

  // 19. isOpenPriceModalOpen
  {
    find: `className={\`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border transition-all \${
                        isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                     }\`}`,
    replace: `className={\`w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border transition-all \${
                        isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                     }\`}`
  },
  {
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
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-205'
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

  // 20. isDiscountModalOpen
  {
    find: `className={\`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all \${
                        isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                     }\`}`,
    replace: `className={\`w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl border transition-all \${
                        isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                     }\`}`
  },
  {
    find: `<div className={\`p-5 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#0d1117]/50 border-[#30363d]' : 'bg-slate-50 border-slate-100'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className={\`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500\`}>
                              <Tag size={16} />
                           </div>
                           <div>
                              <h3 className={\`text-sm font-black uppercase italic tracking-tight leading-tight \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                                 Apply Discount
                              </h3>
                              <p className={\`text-[8px] font-black uppercase tracking-widest \${isDark ? 'text-gray-400' : 'text-slate-400'}\`}>
                                 Select pre-configured or enter custom discount
                              </p>
                           </div>
                        </div>
                        <button
                           onClick={() => setIsDiscountModalOpen(false)}
                           className={\`opacity-65 hover:opacity-100 text-lg font-bold transition-all p-1 rounded-full \${
                              isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>`,
    replace: `<div className={\`p-6 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-205'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className={\`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500\`}>
                              <Tag size={16} />
                           </div>
                           <div>
                              <h3 className={\`text-xl font-black uppercase italic tracking-tighter leading-none \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                                 Apply Discount
                              </h3>
                              <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1.5 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                                 Select pre-configured or enter custom discount
                              </p>
                           </div>
                        </div>
                        <button
                           onClick={() => setIsDiscountModalOpen(false)}
                           className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${
                              isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>`
  },

  // 21. isChargesModalOpen
  {
    find: `className={\`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all \${
                        isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                     }\`}`,
    replace: `className={\`w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl border transition-all \${
                        isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                     }\`}`
  },
  {
    find: `<div className={\`p-5 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#0d1117]/50 border-[#30363d]' : 'bg-slate-50 border-slate-100'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className={\`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500\`}>
                              <Coins size={16} />
                           </div>
                           <div>
                              <h3 className={\`text-sm font-black uppercase italic tracking-tight leading-tight \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                                 Additional Charges
                              </h3>
                              <p className={\`text-[8px] font-black uppercase tracking-widest \${isDark ? 'text-gray-400' : 'text-slate-400'}\`}>
                                 Apply database charges or add custom fees
                              </p>
                           </div>
                        </div>
                        <button
                           onClick={() => setIsChargesModalOpen(false)}
                           className={\`opacity-65 hover:opacity-100 text-lg font-bold transition-all p-1 rounded-full \${
                              isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>`,
    replace: `<div className={\`p-6 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-205'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className={\`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500\`}>
                              <Coins size={16} />
                           </div>
                           <div>
                              <h3 className={\`text-xl font-black uppercase italic tracking-tighter leading-none \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                                 Additional Charges
                              </h3>
                              <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1.5 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                                 Apply database charges or add custom fees
                              </p>
                           </div>
                        </div>
                        <button
                           onClick={() => setIsChargesModalOpen(false)}
                           className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${
                              isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>`
  },

  // 22. isCouponModalOpen
  {
    find: `<div className={\`p-5 border-b flex justify-between items-center \${
                      isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                   }\`}>`,
    replace: `<div className={\`p-6 border-b flex justify-between items-center \${
                      isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                   }\`}>`
  },

  // 23. isSplitModalOpen
  {
    find: `className="w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[85vh]"`,
    replace: `className={\`w-full max-w-4xl border rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[85vh] transition-all \${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'}\`}`
  },
  {
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
    replace: `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
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

replacements.forEach((r, idx) => {
  if (content.includes(r.find)) {
    content = content.replace(r.find, r.replace);
    applied++;
  } else {
    missed.push(idx + 1);
  }
});

// Restore CRLF
content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, content, 'utf8');

console.log(`Applied ${applied} modal replacements.`);
if (missed.length > 0) {
  console.log(`Missed replacement indices: ${missed.join(', ')}`);
}
