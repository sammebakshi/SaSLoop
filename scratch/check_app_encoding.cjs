const fs = require('fs');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const buffer = fs.readFileSync(filePath);
console.log("Buffer length:", buffer.length);
console.log("First few bytes:", buffer.slice(0, 10));

if (buffer[0] === 0xff && buffer[1] === 0xfe) {
  console.log("UTF-16 LE");
} else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
  console.log("UTF-16 BE");
} else {
  let hasZeros = false;
  for (let i = 1; i < Math.min(buffer.length, 100); i += 2) {
    if (buffer[i] === 0) hasZeros = true;
  }
  if (hasZeros) {
    console.log("UTF-16 LE without BOM");
  } else {
    console.log("UTF-8");
  }
}
