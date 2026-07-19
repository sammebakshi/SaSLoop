const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetPattern = /const KOTHistoryView =[\s\S]*?\/\/ --- POS LOGIN COMPONENTS ---/g;

const replacement = `const KOTHistoryView = ({ tableKots, isDark }) => (
   <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto no-scrollbar">
      <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 flex items-center gap-2"><History size={12}/> Table Order History</h3>
      {tableKots?.map((kot, idx) => (
         <div key={idx} className={\`p-3 rounded-xl border \${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}\`}>
            <div className="flex justify-between items-center mb-2">
               <span className="text-[9px] font-black text-emerald-400">{kot.id}</span>
               <span className={\`px-2 py-0.5 rounded-md text-[7px] font-black uppercase \${kot.status === 'SERVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'}\`}>{kot.status}</span>
            </div>
            <div className="space-y-1">
               {kot.items.map((it, i) => (
                  <div key={i} className="flex flex-col text-[8.5px] font-bold text-slate-400 mb-1">
                     <div className="flex justify-between w-full">
                        <span>{it.product_name || it.name} x{it.quantity || it.qty}</span>
                        {it.modifier && <span className="text-[7.5px] text-amber-500 italic">({it.modifier})</span>}
                     </div>
                     {it.modifiers && it.modifiers.map((m, mIdx) => (
                        <span key={mIdx} className="text-[7.5px] text-slate-400 pl-3 leading-tight">{m.name.toUpperCase()}</span>
                     ))}
                  </div>
               ))}
            </div>
            <div className="mt-2 pt-2 border-t border-dashed border-white/5 text-[7px] font-bold text-slate-600 uppercase flex justify-between">
               <span>{new Date(kot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
               <span>{kot.items.length} Items</span>
            </div>
         </div>
      ))}
      {!tableKots?.length && <div className="p-10 text-center opacity-20 text-[9px] font-black uppercase italic">No active KOTs for this table</div>}
   </div>
);

// --- POS LOGIN COMPONENTS ---`;

if (targetPattern.test(content)) {
  content = content.replace(targetPattern, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("KOTHistoryView fixed successfully!");
} else {
  console.log("Pattern NOT found!");
}
