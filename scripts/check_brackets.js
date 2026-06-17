const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop-new/backend/SaSLoop-dashboard/src/pages/MasterAdminPanel.jsx', 'utf8');

let stack = [];
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  for (let j = 0; j < line.length; j++) {
    let char = line[j];
    if (char === '{' || char === '(' || char === '[') {
      stack.push({ char, line: i + 1, col: j + 1 });
    } else if (char === '}' || char === ')' || char === ']') {
      if (stack.length === 0) {
        console.log(`Unexpected ${char} at line ${i + 1}, col ${j + 1}`);
        continue;
      }
      let top = stack.pop();
      if ((char === '}' && top.char !== '{') ||
          (char === ')' && top.char !== '(') ||
          (char === ']' && top.char !== '[')) {
        console.log(`Mismatch: opened ${top.char} at line ${top.line} but found ${char} at line ${i + 1}`);
      }
    }
  }
}

if (stack.length > 0) {
  console.log('Unclosed brackets:');
  stack.forEach(s => console.log(`${s.char} at line ${s.line}, col ${s.col}`));
} else {
  console.log('All brackets balanced!');
}
