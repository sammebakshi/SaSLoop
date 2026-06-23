const fs = require('fs');

const filePath = 'pos-app/src/App.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize newlines
content = content.replace(/\r\n/g, '\n');

// Find and replace Coupon Modal header padding
const pattern = /p-5 border-b flex justify-between items-center \$\{\s*isDark \? 'bg-\[\#161b22\] border-\[\#30363d\]' : 'bg-slate-50 border-slate-200'\s*\}/;
if (pattern.test(content)) {
  content = content.replace(pattern, "p-6 border-b flex justify-between items-center ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}");
  console.log("Successfully fixed Coupon Modal header padding to p-6!");
} else {
  console.error("Pattern not found for Coupon Modal!");
}

// Restore CRLF
content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(filePath, content, 'utf8');
