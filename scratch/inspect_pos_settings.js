const fs = require('fs');
const content = fs.readFileSync('scratch/App_working_backup_v2.jsx', 'utf8');
const lines = content.split('\n');

console.log('posSettings state initialization:');
lines.forEach((line, idx) => {
  if (line.includes('useState(') && lines[idx - 1] && lines[idx - 1].includes('posSettings')) {
    console.log(`${idx}: ${lines[idx-1].trim()}`);
    console.log(`${idx + 1}: ${line.trim()}`);
    for (let i = 1; i <= 20; i++) {
      console.log(`${idx + 1 + i}: ${lines[idx + i].trim()}`);
    }
  }
  if (line.includes('const [posSettings, setPosSettings] = useState(')) {
    console.log(`${idx + 1}: ${line.trim()}`);
    for (let i = 1; i <= 20; i++) {
      console.log(`${idx + 1 + i}: ${lines[idx + i].trim()}`);
    }
  }
});
