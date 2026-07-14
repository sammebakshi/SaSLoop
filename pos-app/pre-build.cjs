const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const destDir = path.join(__dirname, 'server');

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Exclude node_modules and hidden folders
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        copyDirSync(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('📦 Running pre-build script: bundling Express backend files...');

try {
  // Ensure destination exists
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(destDir, { recursive: true });

  // Copy single files
  const filesToCopy = ['server.js', 'db.js', 'whatsappManager.js'];
  for (const file of filesToCopy) {
    const srcFile = path.join(rootDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(destDir, file));
      console.log(`✓ Copied file: ${file}`);
    }
  }

  // Copy folders recursively
  const foldersToCopy = ['routes', 'middleware', 'utils'];
  for (const folder of foldersToCopy) {
    const srcFolder = path.join(rootDir, folder);
    if (fs.existsSync(srcFolder)) {
      copyDirSync(srcFolder, path.join(destDir, folder));
      console.log(`✓ Copied folder: ${folder}`);
    }
  }

  console.log('✅ Express backend successfully bundled in pos-app/server!');
} catch (err) {
  console.error('❌ Pre-build bundling failed:', err);
  process.exit(1);
}
