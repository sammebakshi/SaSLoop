const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/extracted_dial_code.txt';
let content = fs.readFileSync(filePath, 'utf8');

console.log("Length:", content.length);
console.log("Start charCodes:", [...content.slice(0, 10)].map(c => c.charCodeAt(0)));
console.log("End charCodes:", [...content.slice(-10)].map(c => c.charCodeAt(0)));

// Let's try parsing it using JSON.parse directly on the content or custom parser:
try {
  // If it's a quoted JS string, let's see if we can parse it
  // Sometimes it's wrapped in double quotes but has surrounding whitespace or newlines
  const trimmed = content.trim();
  console.log("Trimmed starts with quote?", trimmed.startsWith('"'), "ends with quote?", trimmed.endsWith('"'));
  
  // Let's try to parse as JSON string:
  // If it's just raw text, write it out
  // If it has escaped characters, let's unescape them
  let clean = trimmed;
  if (clean.startsWith('"') && clean.endsWith('"')) {
     clean = clean.slice(1, -1);
  }
  // replace escaped characters
  clean = clean
    .replace(/\\r/g, '\r')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
    
  fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/temp_dial.jsx', clean, 'utf8');
  console.log("Unescaped to temp_dial.jsx successfully.");
} catch(e) {
  console.error("Error:", e);
}
