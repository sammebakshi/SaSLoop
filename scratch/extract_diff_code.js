const fs = require('fs');

const diffPath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/diff_checkpoints_utf8.diff';
if (!fs.existsSync(diffPath)) {
  console.error("Diff file not found!");
  process.exit(1);
}

const lines = fs.readFileSync(diffPath, 'utf8').split(/\r?\n/);

let inComponent = false;
let componentLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.startsWith('+const TransitionSplashScreen =')) {
    inComponent = true;
    componentLines = [];
  }
  
  if (inComponent) {
    if (line.startsWith('+')) {
      componentLines.push(line.substring(1));
    } else if (line.startsWith(' ')) {
      componentLines.push(line.substring(1));
    } else if (line.startsWith('-')) {
      // ignore deleted lines
    } else {
      // check if it's the end of the diff chunk
      if (line.startsWith('@@') || line.startsWith('diff --git')) {
        inComponent = false;
        // Since we only want the first TransitionSplashScreen chunk containing the locker dial
        if (componentLines.length > 50) {
          break;
        }
      }
    }
  }
}

if (componentLines.length > 0) {
  const code = componentLines.join('\n');
  fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/extracted_dial.jsx', code, 'utf8');
  console.log("Successfully extracted TransitionSplashScreen to scratch/extracted_dial.jsx");
  console.log(`Lines extracted: ${componentLines.length}`);
} else {
  console.log("Component not found in diff!");
}
