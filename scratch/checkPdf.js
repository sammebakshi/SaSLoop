const fs = require('fs');
const pdfPath = 'C:\\Users\\Sajad\\Downloads\\Bill_1.pdf';
if (fs.existsSync(pdfPath)) {
  const content = fs.readFileSync(pdfPath, 'utf8');
  const matches = content.match(/\/MediaBox\s*\[[^\]]+\]/g);
  console.log('MediaBox entries in Bill_1.pdf:', matches);
} else {
  console.log("File not found");
}
