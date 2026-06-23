const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');
let isUtf16 = false;

if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
  isUtf16 = true;
}

// Normalize line endings to \n for matching
let normalized = content.replace(/\r\n/g, '\n');

// Find the section of code for newCustomerCountryCode select
const targetSnippet = `value={newCustomerCountryCode}`;
const index = normalized.indexOf(targetSnippet);

if (index !== -1) {
  // Let's find the className string right after it
  const sub = normalized.substring(index, index + 300);
  const classTarget = "className={`px-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] max-w-[90px] ${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}`}";
  const classReplacement = "className={`px-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] max-w-[90px] border ${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}`}";

  if (normalized.includes(classTarget)) {
    normalized = normalized.replace(classTarget, classReplacement);
    console.log('SUCCESS: Replaced select border style!');
  } else {
    console.log('ERROR: classTarget not found in file');
  }
} else {
  console.log('ERROR: value={newCustomerCountryCode} snippet not found');
}

// Convert back to CRLF
let finalContent = normalized.replace(/\n/g, '\r\n');

if (isUtf16) {
  fs.writeFileSync(filePath, finalContent, 'utf16le');
} else {
  fs.writeFileSync(filePath, finalContent, 'utf8');
}
console.log('Select edit script completed.');
