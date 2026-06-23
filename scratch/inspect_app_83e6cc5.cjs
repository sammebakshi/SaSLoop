const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/App_83e6cc5.jsx';
if (!fs.existsSync(filePath)) {
  console.log("File does not exist");
  process.exit(1);
}

let buffer = fs.readFileSync(filePath);
console.log("Buffer length:", buffer.length);
console.log("First few bytes:", buffer.slice(0, 10));

// Check if UTF-16 LE (BOM is FF FE)
let content = '';
if (buffer[0] === 0xff && buffer[1] === 0xfe) {
  console.log("Detected UTF-16 LE");
  content = buffer.toString('utf16le');
} else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
  console.log("Detected UTF-16 BE");
  content = buffer.toString('utf16be');
} else {
  // Let's check if it has zero bytes every second byte
  let hasZeros = false;
  for (let i = 1; i < Math.min(buffer.length, 100); i += 2) {
    if (buffer[i] === 0) hasZeros = true;
  }
  if (hasZeros) {
    console.log("Detected UTF-16 without BOM");
    content = buffer.toString('utf16le');
  } else {
    console.log("Detected UTF-8");
    content = buffer.toString('utf8');
  }
}

console.log("Converted content length:", content.length);

let idx = 0;
while (true) {
  idx = content.indexOf('TransitionSplashScreen', idx);
  if (idx === -1) break;
  console.log("Found TransitionSplashScreen at character index:", idx);
  // print surrounding characters
  console.log(content.slice(idx, idx + 800));
  console.log('---');
  idx += 'TransitionSplashScreen'.length;
}

if (content.includes('dial-spin-sequence')) {
  console.log("Found dial-spin-sequence!");
  let dialIdx = content.indexOf('dial-spin-sequence');
  console.log(content.slice(dialIdx - 200, dialIdx + 800));
}
