const fs = require('fs');
let content = fs.readFileSync('scratch/apply_phase3_permissions.js', 'utf8');

const matches = [
  {
    find: `\\\${isDark ? 'border-[#30363d] bg-[#0d1117] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}1`,
    repl: `\\\${isSelected ? 'text-amber-300' : 'text-amber-500'}`
  },
  {
    find: `\\\${isDark ? 'border-[#30363d] bg-[#0d1117] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}2`,
    repl: `\\\${isSelected ? 'text-white/80' : 'text-[#8b949e]'}`
  },
  {
    find: `\\\${isDark ? 'border-[#30363d] bg-[#0d1117] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}3`,
    repl: `\\\${isSelected ? 'text-white/80' : 'text-[#8b949e]'}`
  },
  {
    find: `\\\${isDark ? 'border-[#30363d] bg-[#0d1117] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}4`,
    repl: `\\\${isSelected ? 'text-white' : (isDark ? 'text-white' : 'text-slate-900')}`
  }
];

matches.forEach(m => {
  if (!content.includes(m.find)) {
    console.error(`Warning: Could not find substring: ${m.find}`);
  } else {
    // Replace all occurrences of literal substring
    content = content.split(m.find).join(m.repl);
    console.log(`Successfully replaced literal substring: ${m.find}`);
  }
});

fs.writeFileSync('scratch/apply_phase3_permissions.js', content, 'utf8');
console.log('🎉 Step 18 placeholders corrected successfully!');
