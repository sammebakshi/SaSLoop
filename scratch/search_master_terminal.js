const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
if (fs.existsSync(filePath)) {
  const buf = fs.readFileSync(filePath);
  const content = buf.toString('utf16le');
  const lines = content.split('\n');

  lines.forEach(line => {
    if (line.toLowerCase().includes('master') || line.toLowerCase().includes('terminal') || line.toLowerCase().includes('both')) {
      console.log(line.trim());
    }
  });
} else {
  console.log('yesterday_edits.txt not found');
}
