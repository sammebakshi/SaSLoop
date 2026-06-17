const fs = require('fs');

const appPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const backupPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App_restored.jsx';

const appContent = fs.readFileSync(appPath, 'utf8');
const backupContent = fs.readFileSync(backupPath, 'utf8');

const appLines = appContent.split('\n');
const backupLines = backupContent.split('\n');

let healedCount = 0;
let failedCount = 0;

const cleanForMatch = (str) => {
  // Replace anything containing \uFFFD or adjacent weird chars with a wildcard regex
  // Let's strip out non-ASCII characters and \uFFFD
  return str.replace(/[^\x00-\x7F]+/g, '.*');
};

const newAppLines = [...appLines];

for (let i = 0; i < appLines.length; i++) {
  const line = appLines[i];
  if (line.includes('\uFFFD')) {
    const cleanPattern = cleanForMatch(line.trim());
    if (cleanPattern.length < 10) {
      // Too short to match reliably, skip automatic matching
      console.log(`Skipping line ${i + 1} (too short): ${line.trim()}`);
      failedCount++;
      continue;
    }
    
    // Search for a matching line in backupLines
    // Let's create a regex
    try {
      const regex = new RegExp('^' + cleanPattern.replace(/[/\-\\^$*+?.()|[\]{}]/g, (m) => m === '.*' ? '.*' : '\\' + m) + '$');
      const matches = [];
      for (let j = 0; j < backupLines.length; j++) {
        if (regex.test(backupLines[j].trim())) {
          matches.push({ index: j, text: backupLines[j] });
        }
      }
      
      if (matches.length === 1) {
        // Found a unique match! Heal it.
        const originalText = matches[0].text;
        // Keep the original indentation from App.jsx but use content from App_restored.jsx
        const indent = line.match(/^\s*/)[0];
        newAppLines[i] = indent + originalText.trim();
        healedCount++;
        console.log(`Healed line ${i + 1} using backup line ${matches[0].index + 1}:`);
        console.log(`  Corrupt: ${line.trim()}`);
        console.log(`  Healed : ${originalText.trim()}`);
      } else {
        console.log(`Could not uniquely heal line ${i + 1} (matches found: ${matches.length}): ${line.trim()}`);
        failedCount++;
      }
    } catch (e) {
      console.log(`Error matching line ${i + 1}: ${e.message}`);
      failedCount++;
    }
  }
}

if (healedCount > 0) {
  fs.writeFileSync(appPath, newAppLines.join('\n'), 'utf8');
}

console.log(`\nHealed: ${healedCount}, Failed: ${failedCount}`);
