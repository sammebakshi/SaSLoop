const fs = require('fs');
const path = require('path');

const paths = [
  '../pos-app/dist/index.html',
  '../pos-app/release-v2/win-unpacked/resources/app.asar'
];

paths.forEach(p => {
  const fullPath = path.join(__dirname, p);
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      console.log(`File: ${p}`);
      console.log(`- Last Modified: ${stats.mtime.toISOString()}`);
      console.log(`- Size: ${(stats.size / 1024 / 1024).toFixed(3)} MB`);
    } else {
      console.log(`File does not exist: ${p}`);
    }
  } catch (e) {
    console.error(`Error checking ${p}:`, e);
  }
});
