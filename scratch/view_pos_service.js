const fs = require('fs');
if (fs.existsSync('pos-app/src/services/api.js')) {
  console.log(fs.readFileSync('pos-app/src/services/api.js', 'utf8'));
} else if (fs.existsSync('pos-app/src/services/api.ts')) {
  console.log(fs.readFileSync('pos-app/src/services/api.ts', 'utf8'));
} else {
  console.log("Not found");
}
