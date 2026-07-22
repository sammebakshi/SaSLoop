const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏁 Building SaSLoop POS (1 Unpacked Folder + 1 Installer Executable)...');

const releaseDir = path.join(__dirname, 'release-v2');

// 1. Vite Build
console.log('🔨 Compiling Vite frontend...');
execSync('npm run build', {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
});

// 2. Electron Builder
console.log('🔨 Compiling Electron App...');
execSync('npx electron-builder', {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env, CSC_IDENTITY_AUTO_DISCOVERY: 'false', NODE_OPTIONS: '--max-old-space-size=4096' }
});

// 3. Clean up duplicate folder (win-unpacked-master) only
const masterUnpackedPath = path.join(releaseDir, 'win-unpacked-master');
if (fs.existsSync(masterUnpackedPath)) {
  try { fs.rmSync(masterUnpackedPath, { recursive: true, force: true }); } catch (e) {}
}

console.log('✨ Build finished cleanly!');
