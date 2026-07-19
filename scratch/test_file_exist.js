const fs = require('fs');
const path = require('path');
const os = require('os');

const filePath = path.join(os.homedir(), 'Desktop', 'SaSLoop-Bills', 'Bill_1.pdf');
if (fs.existsSync(filePath)) {
  const buffer = fs.readFileSync(filePath);
  console.log('File size:', buffer.length, 'bytes');
  console.log('Header:', buffer.slice(0, 20).toString('ascii'));
  console.log('Footer:', buffer.slice(buffer.length - 20).toString('ascii'));
} else {
  console.log('File does not exist');
}
