const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJsonPath = path.join(__dirname, 'package.json');
const backupJsonPath = path.join(__dirname, 'package.json.bak');

console.log('🏁 Starting SaSLoop POS Terminal build automation...');

// 1. Back up package.json
try {
  fs.copyFileSync(packageJsonPath, backupJsonPath);
  console.log('💾 Created backup of package.json');
} catch (e) {
  console.error('❌ Failed to create package.json backup:', e);
  process.exit(1);
}

try {
  // 2. Modify package.json details
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.productName = 'sasloop-terminal-pos-v1.0.1';
  if (packageJson.build && packageJson.build.nsis) {
    packageJson.build.nsis.shortcutName = 'SaSLoop POS Terminal';
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log('📝 Modified package.json for Terminal build');

  // 3. Compile and build the application
  console.log('🔨 Launching build compiler (npm run build && electron-builder)...');
  execSync('npm run build && npx electron-builder', { stdio: 'inherit', cwd: __dirname });
  console.log('✨ Build compiled successfully!');

  // 3b. Rename win-unpacked to win-unpacked-terminal for isolated testing
  const unpackedPath = path.join(__dirname, 'release-v2', 'win-unpacked');
  const terminalUnpackedPath = path.join(__dirname, 'release-v2', 'win-unpacked-terminal');
  if (fs.existsSync(unpackedPath)) {
    if (fs.existsSync(terminalUnpackedPath)) {
      fs.rmSync(terminalUnpackedPath, { recursive: true, force: true });
    }
    fs.renameSync(unpackedPath, terminalUnpackedPath);
    console.log('📂 Moved Terminal unpacked folder to: release-v2/win-unpacked-terminal');
  }
} catch (err) {
  console.error('❌ Build failed:', err);
} finally {
  // 4. Restore original package.json
  try {
    if (fs.existsSync(backupJsonPath)) {
      fs.copyFileSync(backupJsonPath, packageJsonPath);
      fs.unlinkSync(backupJsonPath);
      console.log('🔄 Restored original package.json');
    }
  } catch (e) {
    console.error('⚠️ Warning: Failed to restore original package.json:', e);
  }
}
