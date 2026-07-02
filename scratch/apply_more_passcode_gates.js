const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

function replaceExact(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Replaced: ${label}`);
  } else {
    console.error(`[FAILED] Target not found for: ${label}`);
  }
}

// 6. Re-Sync Bills Passcode
replaceExact(
  `  const handleReSyncBills = async () => {
    const unsyncedOrders = (recentOrders || []).filter(o => o && (o.synced === false || (o.id && String(o.id).startsWith('L-'))));`,
  `  const handleReSyncBills = async () => {
    if (!checkReceiptsPasscode('resync_bills', "Enter Manager PIN to resync all bills:")) {
      return;
    }
    const unsyncedOrders = (recentOrders || []).filter(o => o && (o.synced === false || (o.id && String(o.id).startsWith('L-'))));`,
  'Re-Sync Bills Passcode Gating'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
