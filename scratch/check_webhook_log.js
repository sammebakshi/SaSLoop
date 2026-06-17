const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'webhook_debug.log');
if (fs.existsSync(logPath)) {
  console.log('Webhook debug log exists! Contents:');
  console.log(fs.readFileSync(logPath, 'utf8'));
} else {
  console.log('Webhook debug log does NOT exist yet. No webhook hits recorded.');
}
