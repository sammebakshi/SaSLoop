const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\SaSLoop-dashboard\\src\\pages';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('Report.jsx')) {
    const filepath = path.join(dir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    
    if (content.includes('value={filters.outlet_id}')) {
      console.log(`\n=========================================`);
      console.log(`FILE: ${file}`);
      
      const selectIndex = content.indexOf('value={filters.outlet_id}');
      const start = Math.max(0, selectIndex - 350);
      const end = Math.min(content.length, selectIndex + 350);
      console.log(content.substring(start, end));
    }
  }
});
