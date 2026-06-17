const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '..', 'routes');
const files = fs.readdirSync(routesPath);

console.log("=== SEARCH FOR STATUS IN ROUTE FILES ===");
files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(routesPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('/status') || line.includes('status') || line.includes('update')) {
        if (line.length < 150) {
          console.log(`[${file}:${idx + 1}]: ${line.trim()}`);
        }
      }
    });
  }
});
