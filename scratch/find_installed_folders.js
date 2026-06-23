const fs = require('fs');
const path = require('path');

const userProfile = process.env.USERPROFILE || 'C:\\Users\\Sajad';
const localAppData = path.join(userProfile, 'AppData\\Local\\Programs');

console.log(`Checking local AppData Programs folder: ${localAppData}`);
try {
  if (fs.existsSync(localAppData)) {
    const list = fs.readdirSync(localAppData);
    console.log('Folders found in Local Programs:');
    list.forEach(folder => {
      if (folder.toLowerCase().includes('sasloop') || folder.toLowerCase().includes('pos')) {
        console.log(`- ${folder}`);
        const innerPath = path.join(localAppData, folder, 'resources\\app.asar');
        if (fs.existsSync(innerPath)) {
          console.log(`  -> Contains app.asar (${(fs.statSync(innerPath).size / 1024 / 1024).toFixed(2)} MB)`);
        }
      }
    });
  } else {
    console.log('Local Programs folder does not exist.');
  }
} catch (e) {
  console.error('Error checking AppData:', e);
}
