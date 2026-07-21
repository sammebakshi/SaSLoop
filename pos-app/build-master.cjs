const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJsonPath = path.join(__dirname, 'package.json');
const backupJsonPath = path.join(__dirname, 'package.json.bak');

console.log('🏁 Starting SaSLoop Master POS v1.0.2 build automation...');

// 1. Back up package.json
try {
  fs.copyFileSync(packageJsonPath, backupJsonPath);
  console.log('💾 Created backup of package.json');
} catch (e) {
  console.error('❌ Failed to create package.json backup:', e);
  process.exit(1);
}

try {
  // 2. Modify package.json details for Master build v1.0.2
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = '1.0.2';
  packageJson.productName = 'sasloop-master-pos-v1.0.2';
  if (packageJson.build && packageJson.build.nsis) {
    packageJson.build.nsis.shortcutName = 'SaSLoop POS Master';
    packageJson.build.nsis.artifactName = 'Master-POS-Setup-v${version}.${ext}';
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log('📝 Modified package.json to v1.0.2 for Master build');

  // 3. Compile and build the application
  console.log('🔨 Launching build compiler (npm run build && electron-builder)...');
  execSync('npm run build && npx electron-builder', {
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env, CSC_IDENTITY_AUTO_DISCOVERY: 'false', NODE_OPTIONS: '--max-old-space-size=4096' }
  });
  console.log('✨ Build compiled successfully!');

  // 3b. Rename win-unpacked to win-unpacked-master for isolated testing
  const unpackedPath = path.join(__dirname, 'release-v2', 'win-unpacked');
  const masterUnpackedPath = path.join(__dirname, 'release-v2', 'win-unpacked-master');
  if (fs.existsSync(unpackedPath)) {
    if (fs.existsSync(masterUnpackedPath)) {
      fs.rmSync(masterUnpackedPath, { recursive: true, force: true });
    }
    fs.renameSync(unpackedPath, masterUnpackedPath);
    console.log('📂 Moved Master unpacked folder to: release-v2/win-unpacked-master');
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
