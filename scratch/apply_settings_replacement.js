const fs = require('fs');

const appPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let appContent = fs.readFileSync(appPath, 'utf8');

const backupUiPath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/printer_settings_ui_backup.txt';
const backupUiContent = fs.readFileSync(backupUiPath, 'utf8').trim();

// Let's find the target in App.jsx to replace.
// We want to replace settingsActiveTab === 'printer' UI block.
// Let's find the start index of settingsActiveTab === 'printer' in App.jsx
const startTarget = "                        {settingsActiveTab === 'printer' && (";
const startIndex = appContent.indexOf(startTarget);

if (startIndex === -1) {
  console.log("Could not find start target in App.jsx");
  process.exit(1);
}

// Now let's find the end of this block.
// The end is followed by: {settingsActiveTab === 'shortcuts' && (
const endTarget = "                        {settingsActiveTab === 'shortcuts' && (";
const endIndex = appContent.indexOf(endTarget);

if (endIndex === -1) {
  console.log("Could not find end target in App.jsx");
  process.exit(1);
}

// Perform replacement
const before = appContent.substring(0, startIndex);
const after = appContent.substring(endIndex);

appContent = before + backupUiContent + '\n\n' + after;
fs.writeFileSync(appPath, appContent, 'utf8');
console.log("SUCCESSFULLY REPLACED PRINTER SETTINGS UI IN APP.JSX!");
