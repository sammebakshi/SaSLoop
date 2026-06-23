const fs = require('fs');

// Read the UTF-16LE file
const buf = fs.readFileSync("scratch/App_e217906.jsx");
const content = buf.toString("utf16le");

// Write it as UTF-8
fs.writeFileSync("scratch/App_e217906_utf8.jsx", content, "utf-8");
console.log("Converted successfully to scratch/App_e217906_utf8.jsx");
