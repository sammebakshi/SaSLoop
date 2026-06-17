const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
if (!fs.existsSync(filePath)) {
  console.log('App.jsx does not exist');
  process.exit(1);
}

const buf = fs.readFileSync(filePath);
let content = buf.toString('utf16le');
if (!content.includes('import') && !content.includes('function')) {
  content = buf.toString('utf8');
}

const lines = content.split('\n');
let startLine = -1;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('setActiveTrayTab(\'KOT\')') && lines[i].includes('button')) {
    // Find the enclosing <div className="flex gap-1"> above it
    for (let j = i; j > i - 20; j--) {
      if (lines[j].includes('<div className="flex gap-1">')) {
        startLine = j + 1;
        break;
      }
    }
    
    // Find the closing </div> of Billing button below it
    let divCount = 0;
    for (let k = i; k < i + 100; k++) {
      if (lines[k].includes('Billing') && lines[k].includes('/button')) {
        // The closing div of <div className="flex gap-1"> should be the next </div>
        for (let l = k; l < k + 10; l++) {
          if (lines[l].includes('</div>')) {
            endLine = l + 1;
            break;
          }
        }
        break;
      }
    }
    break;
  }
}

console.log(`Found sub-tabs block from line ${startLine} to ${endLine}:`);
if (startLine > -1 && endLine > -1) {
  for (let i = startLine - 1; i < endLine; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} else {
  console.log('Could not find sub-tabs block with these markers.');
}
