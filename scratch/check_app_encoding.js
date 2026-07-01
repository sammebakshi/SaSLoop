const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const buf = fs.readFileSync(filePath);

console.log("File size:", buf.length);
if (buf[0] === 0xFF && buf[1] === 0xFE) {
  console.log("Encoding is UTF-16 LE");
} else if (buf[0] === 0xFE && buf[1] === 0xFF) {
  console.log("Encoding is UTF-16 BE");
} else if (buf.includes(0x00)) {
  console.log("Encoding is UTF-16 (no BOM detected, but contains null bytes)");
} else {
  console.log("Encoding is UTF-8 / ASCII");
}
