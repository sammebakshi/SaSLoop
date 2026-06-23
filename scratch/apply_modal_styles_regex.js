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

// 1. Coupon Modal Header Padding (change p-5 to p-6)
replaceRegex(
  /isCouponModalOpen\s*&&\s*\([\s\S]*?<div className={`border rounded-\[2rem\][^`]*`[\s\S]*?<div className={`p-5 border-b flex justify-between items-center/,
  (match) => match.replace('p-5 border-b', 'p-6 border-b'),
  'isCouponModalOpen header padding'
);

// 2. Old KOT Modal Header and close button
replaceRegex(
  /isOldKOTModalOpen\s*&&\s*\([\s\S]*?<div className="p-4 border-b border-\[\#30363d\] flex justify-between items-center bg-\[\#161b22\] rounded-t-2xl">[\s\S]*?<\/div>/,
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

// 3. Transfer Modal Header
replaceRegex(
  /isTransferModalOpen\s*&&\s*\([\s\S]*?<div className="p-4 border-b border-\[\#30363d\] flex justify-between items-center bg-\[\#161b22\]">[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                     <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Transfer Items to Table
                     </h3>
                     <button onClick={() => setIsTransferModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                  </div>`,
  'isTransferModalOpen header'
);

// 4. Access Level Modal Header
replaceRegex(
  /isAccessLevelModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Lock className="text-[#10ac84]" size={22}/> Update Desktop Access Level</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Configure visibility for dashboard and reports</p>
                        </div>
                        <button onClick={() => setIsAccessLevelModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isAccessLevelModalOpen header'
);

// 5. Table Management Modal Header
replaceRegex(
  /isTableManagementModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?<\/div>/,
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

// 6. User Management Modal Header
replaceRegex(
  /isUserManagementModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Users className="text-[#10ac84]" size={22}/> User Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage staff, roles, and access levels</p>
                        </div>
                        <button onClick={() => setIsUserManagementModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isUserManagementModalOpen header'
);

// 7. Captain App Modal Header
replaceRegex(
  /isCaptainAppModalOpen\s*&&\s*\([\s\S]*?<div className="p-6 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\] mt-6">[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 mt-6 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Monitor className="text-[#10ac84]" size={22}/> Captain App</h3>
                        </div>
                        <button onClick={() => setIsCaptainAppModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-850'}\`}>✕</button>
                     </div>`,
  'isCaptainAppModalOpen header'
);

// 8. Feedback Modal Header
replaceRegex(
  /isFeedbackModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><MessageSquare className="text-[#10ac84]" size={22}/> Feedback Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Customer experience form</p>
                        </div>
                        <button onClick={() => setIsFeedbackModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isFeedbackModalOpen header'
);

// 9. Inventory Modal Header
replaceRegex(
  /isInventoryModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?<\/div>/,
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

// 10. Reservation Modal Header
replaceRegex(
  /isReservationModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Calendar className="text-[#10ac84]" size={22}/> Table Reservations</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage table bookings and guests</p>
                        </div>
                        <button onClick={() => setIsReservationModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`,
  'isReservationModalOpen header'
);

// 11. Settings Modal Header
replaceRegex(
  /isSettingsModalOpen[\s\S]*?<div className={`p-5 flex justify-between items-center shrink-0 border-b \${isDark \? 'bg-\[\#161b22\] border-\[\#30363d\] text-white' : 'bg-\[\#f8f9fa\] border-slate-200 text-slate-800'}`}>[\s\S]*?<\/div>/,
  `<div className={\`p-6 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Settings className="text-[#10ac84]" size={22}/> Terminal Settings</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Configure terminal preferences and printer layouts</p>
                        </div>
                        <button onClick={() => setIsSettingsModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-850'}\`}>✕</button>
                     </div>`,
  'isSettingsModalOpen header'
);

// 12. Rejection Modal Header
replaceRegex(
  /isRejectionModalOpen[\s\S]*?<div className="p-5 flex justify-between items-center shrink-0 border-b bg-\[\#161b22\] border-\[\#30363d\] text-white">[\s\S]*?<\/div>/,
  `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
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
               </div>`,
  'isRejectionModalOpen header'
);

// Restore CRLF for writing back
content = content.replace(/\n/g, '\r\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Regex update execution completed.');
