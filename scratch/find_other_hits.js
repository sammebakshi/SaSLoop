const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'webhook_debug.log');
if (!fs.existsSync(logPath)) {
  console.log("No webhook log found.");
  process.exit(0);
}

const content = fs.readFileSync(logPath, 'utf8');
const hits = content.split('HIT:\n');

hits.forEach(hit => {
  if (hit.includes('919469697216') || hit.includes('918494089744')) {
    console.log("--- MATCH ---");
    console.log(hit.trim());
  }
});
