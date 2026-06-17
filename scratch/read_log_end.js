const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'webhook_debug.log');
if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  const lastLines = lines.slice(-100).join('\n');
  console.log("=== LAST 100 LINES OF WEBHOOK DEBUG LOG ===");
  console.log(lastLines);
} else {
  console.log("webhook_debug.log not found!");
}
