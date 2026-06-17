const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'routes', 'orderRoutes.js');
if (!fs.existsSync(filePath)) {
  console.log("orderRoutes.js not found.");
  process.exit(0);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("=== ROUTES IN orderRoutes.js ===");
lines.forEach((line, idx) => {
  if (line.includes('router.put') || line.includes('router.post') || line.includes('router.get') || line.includes('status')) {
    if (line.length < 150) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
