const fs = require('fs');
const path = require('path');
const dir = "c:/Users/Sajad/Desktop/SaSLoop/routes";
const files = fs.readdirSync(dir);

console.log("Searching in routes for staff permissions or access level endpoints...");
files.forEach(file => {
  if (file.endsWith('.js')) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('staff_permissions') || line.includes('access_level') || line.includes('pos_access') || line.includes('desktop')) {
        console.log(`${file}:${idx + 1}: ${line.trim().substring(0, 120)}`);
      }
    });
  }
});
