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

const dir = path.join(__dirname, '..', 'SaSLoop-dashboard', 'src', 'pages');
const files = fs.readdirSync(dir).map(f => path.join(dir, f));

const regex = /Select\s+Outlet/i;

files.forEach(f => {
  if (fs.statSync(f).isFile() && f.endsWith('.jsx')) {
    searchFile(f, regex);
  }
});
