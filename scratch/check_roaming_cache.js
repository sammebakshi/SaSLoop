const fs = require('fs');
const path = require('path');

const userProfile = process.env.USERPROFILE || 'C:\\Users\\Sajad';
const roamingData = path.join(userProfile, 'AppData\\Roaming');

console.log(`Checking Roaming AppData folder: ${roamingData}`);
try {
  if (fs.existsSync(roamingData)) {
    const list = fs.readdirSync(roamingData);
    console.log('Folders found in Roaming matching SaSLoop or POS:');
    list.forEach(folder => {
      if (folder.toLowerCase().includes('sasloop') || folder.toLowerCase().includes('pos')) {
        console.log(`- ${folder}`);
        const cacheDir = path.join(roamingData, folder, 'Cache');
        const codeCacheDir = path.join(roamingData, folder, 'Code Cache');
        if (fs.existsSync(cacheDir)) {
          console.log(`  -> Contains Cache folder`);
        }
        if (fs.existsSync(codeCacheDir)) {
          console.log(`  -> Contains Code Cache folder`);
        }
      }
    });
  } else {
    console.log('Roaming folder does not exist.');
  }
} catch (e) {
  console.error('Error checking Roaming AppData:', e);
}
