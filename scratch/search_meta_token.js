const fs = require('fs');
const path = require('path');

function searchFile(filePath, regex) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (regex.test(line)) {
      console.log(`${path.basename(filePath)}:${index + 1}: ${line.trim()}`);
    }
  });
}

const files = [
  path.join(__dirname, '..', 'routes', 'whatsappRoutes.js')
];

const regex = /meta_access_token/i;

files.forEach(f => {
  if (fs.existsSync(f)) {
    searchFile(f, regex);
  } else {
    console.log(`File not found: ${f}`);
  }
});
