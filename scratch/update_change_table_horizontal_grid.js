const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update isChangeTableModalOpen JSX design to horizontal layout with grid inside
const oldModalPattern = /\{isChangeTableModalOpen && \([\s\S]*?Cancel\s*<\/button>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)\}/;

const newModalStr = `{isChangeTableModalOpen && (
           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
              <div className={\`border rounded-[2rem] w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden \${
                 isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'
              }\`}>
                 {/* Header */}
                 <div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                     <h3 className={\`text-lg font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Change Table / Transfer Order
                     </h3>
                     <button 
                        onClick={() => {
                           if (changeTableResolveRef.current) changeTableResolveRef.current(null);
                           setIsChangeTableModalOpen(false);
                        }} 
                        className={\`p-2 rounded-xl transition-all text-sm cursor-pointer \${
                           isDark ? 'text-[#8b949e] hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-800'
                        }\`}
                     >
                        ✕
                     </button>
                  </div>
                 {/* Body */}
                 <div className="p-6 space-y-4">
                    <p className={\`text-[11px] font-black uppercase tracking-widest \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                       Select target table to transfer <span className="text-[#18ba60]">{selectedTable?.table_name}</span> to:
                    </p>
                    
                    {/* Wide grid of tables */}
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-[45vh] overflow-y-auto pr-1 no-scrollbar">
                       {tables
                         .filter(t => t.id !== selectedTable?.id)
                         .map(table => {
                            const isOccupied = (tableBills[table.id] || []).filter(item => !item.isCancelled).length > 0 || (tableCarts[table.id] || []).length > 0;
                            return (
                               <button
                                  key={table.id}
                                  onClick={() => {
                                     if (changeTableResolveRef.current) changeTableResolveRef.current(table);
                                     setIsChangeTableModalOpen(false);
                                  }}
                                  className={\`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 group cursor-pointer \${
                                     isOccupied
                                       ? (isDark ? 'bg-amber-500/5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10' : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100')
                                       : (isDark ? 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] hover:border-emerald-500/50 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-emerald-500/50 hover:text-slate-900')
                                  }\`}
                               >
                                  <div className={\`w-2 h-2 rounded-full \${isOccupied ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}\`}></div>
                                  <span className="text-xs font-black uppercase tracking-tight">{table.table_name}</span>
                                  <span className="text-[8px] font-bold uppercase px-2.5 py-0.5 rounded tracking-wide bg-black/10">
                                     {isOccupied ? 'Merge' : 'Vacant'}
                                  </span>
                               </button>
                            );
                         })}
                    </div>
                 </div>
                 {/* Footer */}
                 <div className={\`p-4 flex justify-end \${isDark ? 'bg-[#161b22] border-t border-[#30363d]' : 'bg-slate-50 border-t border-slate-200'}\`}>
                    <button
                       onClick={() => {
                          if (changeTableResolveRef.current) changeTableResolveRef.current(null);
                          setIsChangeTableModalOpen(false);
                       }}
                       className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer \${
                          isDark ? 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                       }\`}
                    >
                       Cancel
                    </button>
                 </div>
              </div>
           </div>
        )}`;

if (oldModalPattern.test(content)) {
  content = content.replace(oldModalPattern, newModalStr);
  console.log("Modal JSX updated to horizontal grid successfully!");
} else {
  console.error("Modal JSX pattern not found!");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("App.jsx updated!");
