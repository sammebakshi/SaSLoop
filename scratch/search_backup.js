const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'App_backup_31c7593_utf8.jsx');
const text = fs.readFileSync(filePath, 'utf8');

function findString(query) {
  console.log(`Searching for: "${query}"`);
  const lines = text.split('\n');
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(query.toLowerCase())) {
      count++;
      if (count <= 40) {
        console.log(`Line ${i + 1}: ${lines[i].trim()}`);
      }
    }
  }
  console.log(`Found ${count} matches.`);
}

findString(process.argv[2] || 'filteredOrders');
