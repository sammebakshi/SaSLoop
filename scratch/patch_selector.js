const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = `{[{tier: 1, label: 'Dine-In'}, {tier: 2, label: 'Takeaway'}, {tier: 3, label: 'Delivery'}, {tier: 4, label: 'Quick Bill'}].map`;
const replacement = `{[{tier: 1, label: 'Sale Price 1'}, {tier: 2, label: 'Sale Price 2'}, {tier: 3, label: 'Sale Price 3'}].map`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("SUCCESS: Patched App.jsx button array.");
} else {
  console.log("ERROR: Target string not found.");
}
