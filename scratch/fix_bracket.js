const fs = require('fs');
let content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

// We find the exact button closing and the premature )} closing
const target = `<ChevronDown size={13} className="text-[#8b949e]" />`; // wait, is it size={13} or size={11}?
// Let's check what size it is in line 12671:
// <ChevronDown size={11} className="text-[#8b949e]" />
// Yes, it is size={11}. Let's do a regex replacement that matches line endings cleanly.

const regex = /<ChevronDown size=\{11\} className="text-\\[#8b949e\\]" \/>\r?\n\s*<\/button>\r?\n\s*\)\}/;

if (!regex.test(content)) {
  console.error("Target pattern not found in App.jsx!");
  process.exit(1);
}

content = content.replace(regex, `<ChevronDown size={11} className="text-[#8b949e]" />\n                                      </button>`);

fs.writeFileSync('pos-app/src/App.jsx', content, 'utf8');
console.log("🎉 Successfully removed premature conditional closing from App.jsx!");
