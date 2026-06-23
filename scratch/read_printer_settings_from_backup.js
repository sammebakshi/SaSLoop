const { execSync } = require('child_process');
const fs = require('fs');

const fileContent = execSync('git show 0e4f164:pos-app/src/App.jsx', {
  cwd: 'C:/Users/Sajad/Desktop/SaSLoop_Backups',
  maxBuffer: 50 * 1024 * 1024
}).toString();

const lines = fileContent.split('\n');

// Let's find updateOrderPrinterSetting in the file
const updateIndex = lines.findIndex(l => l.includes('updateOrderPrinterSetting'));
if (updateIndex !== -1) {
  console.log(`\n--- updateOrderPrinterSetting definition (Lines ${updateIndex - 2} to ${updateIndex + 25}) ---`);
  console.log(lines.slice(updateIndex - 2, updateIndex + 25).join('\n'));
} else {
  console.log('updateOrderPrinterSetting not found');
}

// Let's find defaultSettings object initialization
const defaultSettingsIndex = lines.findIndex(l => l.includes('orderPrinters: {'));
if (defaultSettingsIndex !== -1) {
  console.log(`\n--- defaultSettings orderPrinters (Lines ${defaultSettingsIndex - 5} to ${defaultSettingsIndex + 30}) ---`);
  console.log(lines.slice(defaultSettingsIndex - 5, defaultSettingsIndex + 30).join('\n'));
} else {
  console.log('defaultSettings orderPrinters not found');
}

// Let's find the entire printer settings UI block by starting at settingsActiveTab === 'printer'
const tabIndex = lines.findIndex(l => l.includes("settingsActiveTab === 'printer'"));
if (tabIndex !== -1) {
  // Let's search for the end of that tab. We can print 350 lines to make sure we capture it all.
  console.log(`\n--- Full Printer settings tab UI ---`);
  fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/printer_settings_ui_backup.txt', lines.slice(tabIndex, tabIndex + 350).join('\n'));
  console.log("Written printer settings UI to scratch/printer_settings_ui_backup.txt!");
}
