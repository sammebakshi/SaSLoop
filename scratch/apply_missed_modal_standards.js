const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

function replaceExact(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Replaced ${label}`);
  } else {
    console.warn(`[FAILED] Exact match not found for ${label}`);
  }
}

// 1. isSettingsModalOpen Header
const findSettingsHeader = `                    {/* Header */}
                    <div className={\`p-5 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-[#f8f9fa] border-slate-200 text-slate-800'}\`}>
                       <div>
                          <h3 className={\`text-base font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Settings className="text-[#10ac84]" size={18}/> Terminal Settings</h3>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8b949e] mt-0.5 font-bold">Configure terminal preferences and printer layouts</p>
                       </div>
                       <button onClick={() => setIsSettingsModalOpen(false)} className={\`p-2 rounded-full transition-all \${isDark ? 'hover:bg-white/10 text-[#8b949e] hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}\`}>✕</button>
                    </div>`;

const replaceSettingsHeader = `                    {/* Header */}
                    <div className={\`p-6 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                       <div>
                          <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Settings className="text-[#10ac84]" size={22}/> Terminal Settings</h3>
                          <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Configure terminal preferences and printer layouts</p>
                       </div>
                       <button onClick={() => setIsSettingsModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                    </div>`;

replaceExact(findSettingsHeader, replaceSettingsHeader, 'isSettingsModalOpen header');


// 2. isPayDueModalOpen Container and Header
const findPayDueContainerAndHeader = `                 <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={\`rounded-3xl border w-full max-w-md overflow-hidden shadow-2xl flex flex-col \${isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}>
                    {/* Header */}
                    <div className={\`p-5 border-b flex justify-between items-center \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-slate-200 bg-slate-50'}\`}>
                       <div>
                          <h3 className="text-sm font-black uppercase italic tracking-tighter flex items-center gap-2">
                             <Wallet size={18} className="text-emerald-500" /> Pay Previous Balance
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{trayCustomer?.name || 'Customer'} • {trayFullPhone}</p>
                       </div>
                       <button onClick={() => setIsPayDueModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
                    </div>`;

const replacePayDueContainerAndHeader = `                 <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={\`rounded-[2rem] border w-full max-w-md overflow-hidden shadow-2xl flex flex-col \${isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}>
                    {/* Header */}
                    <div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-slate-200 bg-slate-50'}\`}>
                       <div>
                          <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                             <Wallet size={18} className="text-emerald-500" /> Pay Previous Balance
                          </h3>
                          <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>{trayCustomer?.name || 'Customer'} • {trayFullPhone}</p>
                       </div>
                       <button onClick={() => setIsPayDueModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                    </div>`;

replaceExact(findPayDueContainerAndHeader, replacePayDueContainerAndHeader, 'isPayDueModalOpen container and header');


// 3. isAddCustomerModalOpen Header
const findAddCustomerHeader = `                  <div className={\`p-8 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-[#f8f9fa] border-slate-200 text-slate-800'}\`}>
                     <div>
                        <h3 className={\`text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 \${isDark ? 'text-white' : 'text-slate-900'}\`}><UserPlus className="text-[#18ba60]"/> Adding Customers</h3>
                        <p className={\`text-[10px] font-black uppercase tracking-[0.2em] mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Create a new customer profile</p>
                     </div>
                     <button onClick={() => setIsAddCustomerModalOpen(false)} className={\`p-2.5 rounded-xl transition-all \${isDark ? 'hover:bg-white/10 text-[#8b949e] hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}\`}>X</button>
                  </div>`;

const replaceAddCustomerHeader = `                  <div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                     <div>
                        <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><UserPlus className="text-[#10ac84]" size={22}/> Adding Customers</h3>
                        <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Create a new customer profile</p>
                     </div>
                     <button onClick={() => setIsAddCustomerModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                  </div>`;

replaceExact(findAddCustomerHeader, replaceAddCustomerHeader, 'isAddCustomerModalOpen header');


// 4. isOpenPriceModalOpen Container and Header
const findOpenPriceContainerAndHeader = `                 <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className={\`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border transition-all \${
                       isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                    }\`}
                 >
                    {/* Header */}
                    <div className={\`p-5 flex justify-between items-center border-b \${
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
                    </div>`;

const replaceOpenPriceContainerAndHeader = `                 <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className={\`w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border transition-all \${
                       isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                    }\`}
                 >
                    {/* Header */}
                    <div className={\`p-6 flex justify-between items-center border-b \${
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
                    </div>`;

replaceExact(findOpenPriceContainerAndHeader, replaceOpenPriceContainerAndHeader, 'isOpenPriceModalOpen container and header');


// 5. isDiscountModalOpen Header
const findDiscountHeader = `                     {/* Header */}
                     <div className={\`p-5 flex justify-between items-center border-b \${
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
                     </div>`;

const replaceDiscountHeader = `                     {/* Header */}
                     <div className={\`p-6 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
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
                     </div>`;

replaceExact(findDiscountHeader, replaceDiscountHeader, 'isDiscountModalOpen header');


// 6. isChargesModalOpen Header
const findChargesHeader = `                     {/* Header */}
                     <div className={\`p-5 flex justify-between items-center border-b \${
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
                     </div>`;

const replaceChargesHeader = `                     {/* Header */}
                     <div className={\`p-6 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
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
                     </div>`;

replaceExact(findChargesHeader, replaceChargesHeader, 'isChargesModalOpen header');


// Restore CRLF line endings
content = content.replace(/\n/g, '\r\n');

// Write back to App.jsx
fs.writeFileSync(filePath, content, 'utf8');
console.log('Missed changes applied successfully!');
