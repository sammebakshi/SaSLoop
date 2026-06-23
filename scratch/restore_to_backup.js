const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'App_backup_before_restoration.jsx');
const destPath = path.join(__dirname, '../pos-app/src/App.jsx');

if (fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, destPath);
  console.log('SUCCESS: Copied App_backup_before_restoration.jsx to pos-app/src/App.jsx');
} else {
  console.error('ERROR: Backup file does not exist.');
}
