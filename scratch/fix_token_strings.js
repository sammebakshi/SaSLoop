const fs = require('fs');
let content = fs.readFileSync('scratch/apply_phase3_permissions.js', 'utf8');

// Replace the corrupted TokenString replacements in Step 18
content = content.replace(/\\\${isDark \? 'border-\\[#30363d\\] bg-\\[#0d1117\\] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}1/g, '\\\${isSelected ? \'text-amber-300\' : \'text-amber-500\'}');
content = content.replace(/\\\${isDark \? 'border-\\[#30363d\\] bg-\\[#0d1117\\] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}2/g, '\\\${isSelected ? \'text-white/80\' : \'text-[#8b949e]\'}');
content = content.replace(/\\\${isDark \? 'border-\\[#30363d\\] bg-\\[#0d1117\\] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}3/g, '\\\${isSelected ? \'text-white/80\' : \'text-[#8b949e]\'}');
content = content.replace(/\\\${isDark \? 'border-\\[#30363d\\] bg-\\[#0d1117\\] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}4/g, '\\\${isSelected ? \'text-white\' : (isDark ? \'text-white\' : \'text-slate-900\')}');

fs.writeFileSync('scratch/apply_phase3_permissions.js', content, 'utf8');
console.log('🎉 Step 18 placeholders corrected successfully!');
