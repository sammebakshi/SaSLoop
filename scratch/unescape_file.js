const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'step_912_code.jsx');
const destFile = path.join(__dirname, 'step_912_code_clean.jsx');

if (!fs.existsSync(srcFile)) {
  console.log('Source file does not exist');
  process.exit(1);
}

const rawContent = fs.readFileSync(srcFile, 'utf8');

// The content is a JSON-encoded string, e.g. "foo\nbar"
// We can wrap it in braces to make it valid JSON, then parse it.
try {
  const parsed = JSON.parse(rawContent);
  fs.writeFileSync(destFile, parsed, 'utf8');
  console.log('Successfully unescaped and saved to step_912_code_clean.jsx');
} catch (e) {
  // If parsing fails, try manual unescaping
  console.log('JSON parsing failed, trying manual unescape:', e.message);
  const unescaped = rawContent
    .replace(/^"/, '')
    .replace(/"$/, '')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
  fs.writeFileSync(destFile, unescaped, 'utf8');
  console.log('Manually unescaped and saved to step_912_code_clean.jsx');
}
