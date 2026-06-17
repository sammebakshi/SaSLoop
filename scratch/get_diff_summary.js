const fs = require('fs');

const file1 = fs.readFileSync('scratch/whatsappManager_backup.js', 'utf8').split('\n');
const file2 = fs.readFileSync('whatsappManager.js', 'utf8').split('\n');

console.log("Backup lines:", file1.length);
console.log("Current lines:", file2.length);

// Let's find matches or mismatching segments.
// Specifically, let's compare processAiAutomations.
const idx1 = file1.findIndex(line => line.includes('const processAiAutomations'));
const idx2 = file2.findIndex(line => line.includes('const processAiAutomations'));

console.log("processAiAutomations start line in backup:", idx1);
console.log("processAiAutomations start line in current:", idx2);

// Let's print the first 50 lines of both from the start of processAiAutomations
console.log("\n--- BACKUP processAiAutomations START ---");
console.log(file1.slice(idx1, idx1 + 100).join('\n'));

console.log("\n--- CURRENT processAiAutomations START ---");
console.log(file2.slice(idx2, idx2 + 100).join('\n'));
