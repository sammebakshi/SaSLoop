const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
if (fs.existsSync(filePath)) {
  const buf = fs.readFileSync(filePath);
  const content = buf.toString('utf16le');
  const lines = content.split('\n');

  let currentEdit = '';
  let description = '';
  let instruction = '';
  let targetFile = '';

  lines.forEach(line => {
    if (line.includes('Edit #')) {
      if (currentEdit) {
        console.log(`${currentEdit} | File: ${targetFile} | Desc: ${description}`);
      }
      currentEdit = line.trim();
      description = '';
      instruction = '';
      targetFile = '';
    } else if (line.includes('Description:')) {
      description = line.replace('Description:', '').trim();
    } else if (line.includes('Instruction:')) {
      instruction = line.replace('Instruction:', '').trim();
    } else if (line.includes('TargetFile:')) {
      targetFile = line.replace('TargetFile:', '').trim();
    }
  });
  if (currentEdit) {
    console.log(`${currentEdit} | File: ${targetFile} | Desc: ${description}`);
  }
} else {
  console.log('yesterday_edits.txt not found');
}
