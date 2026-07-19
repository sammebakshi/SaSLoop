const fs = require('fs');
const path = require('path');

const dirPath = __dirname;
const files = fs.readdirSync(dirPath);

const missingDescriptions = [
  { key: 'quickbill', desc: 'Implement Quick Bill printing checkbox controls' },
  { key: 'import_icons', desc: 'Import Receipt and Layers icons from lucide-react' },
  { key: 'floating_elements', desc: 'Expand floating elements to include KOT tickets' },
  { key: 'saved_table_status', desc: 'Allow SAVED table status when settling dine-in pre-orders' },
  { key: 'active_order_saved', desc: 'Include SAVED in active order dine-in status validation' }
];

const matches = {};

files.forEach(filename => {
  if (filename.startsWith('edit_extracted_') && filename.endsWith('.json')) {
    const filePath = path.join(dirPath, filename);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const desc = (data.Description || '').toLowerCase();
      
      missingDescriptions.forEach(item => {
        if (desc.includes(item.key) || desc.includes(item.desc.toLowerCase())) {
          if (!matches[item.key]) matches[item.key] = [];
          matches[item.key].push({
            file: filename,
            desc: data.Description,
            tool: data.toolName || 'unknown'
          });
        }
      });
    } catch (e) {}
  }
});

console.log('Matches found:');
console.log(JSON.stringify(matches, null, 2));
