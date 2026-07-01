const fs = require('fs');
let content = fs.readFileSync('scratch/apply_phase3_permissions.js', 'utf8');

const start = content.indexOf('// 12. Split Bill switcher');
const end = content.indexOf('// 13. Customer management buttons');

if (start === -1 || end === -1) {
  console.error("Could not find start or end index!");
  process.exit(1);
}

const prefix = content.substring(0, start);
const suffix = content.substring(end);

const originalStep12 = `// 12. Split Bill switcher
replaceExactlyOnce(
\`<div className={\\\`flex items-center rounded-xl p-1 \\\${isDark ? 'bg-[#0d1117] border border-[#30363d]' : 'bg-slate-100 border border-slate-200'}\\\`}>
   {['PORTION', 'PERCENT', 'ITEM'].map(mode => (
      <button
         key={mode}
         type="button"
         onClick={() => setSplitMode(mode)}
         className={\\\`px-4 py-1.5 rounded-lg text-xs font-black uppercase italic transition-all \\\${splitMode === mode ? 'bg-[#10ac84] text-white shadow-sm' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}\\\`}
      >
         {mode}
      </button>
   ))}
</div>\`,
\`<div className={\\\`flex items-center rounded-xl p-1 \\\${isDark ? 'bg-[#0d1117] border border-[#30363d]' : 'bg-slate-100 border border-slate-200'}\\\`}>
   {['PORTION', 'PERCENT', 'ITEM'].filter(mode => {
      if (mode === 'PORTION') return checkSplitBillPermission('portion_wise');
      if (mode === 'PERCENT') return checkSplitBillPermission('percentage_wise');
      if (mode === 'ITEM') return checkSplitBillPermission('item_wise');
      return true;
   }).map(mode => (
      <button
         key={mode}
         type="button"
         onClick={() => setSplitMode(mode)}
         className={\\\`px-4 py-1.5 rounded-lg text-xs font-black uppercase italic transition-all \\\${splitMode === mode ? 'bg-[#10ac84] text-white shadow-sm' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}\\\`}
      >
         {mode}
      </button>
   ))}
</div>\`,
  "12. Split Bill switcher"
);

`;

content = prefix + originalStep12 + suffix;
fs.writeFileSync('scratch/apply_phase3_permissions.js', content, 'utf8');
console.log("🎉 Successfully restored original Step 12 in apply_phase3_permissions.js!");
