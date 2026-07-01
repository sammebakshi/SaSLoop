const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceRoot = 'c:/Users/Sajad/Desktop/SaSLoop';
const appJsxPath = path.join(workspaceRoot, 'pos-app/src/App.jsx');
const dryrunJsxPath = path.join(workspaceRoot, 'pos-app/src/App_dryrun.jsx');

console.log('1. Copying App.jsx to App_dryrun.jsx...');
fs.copyFileSync(appJsxPath, dryrunJsxPath);

// A. Apply apply_permissions_final.js to dryrun
function runDryRunScript(scriptName) {
  console.log(`\n--- Running Dry-Run for ${scriptName} ---`);
  const scriptPath = path.join(workspaceRoot, 'scratch', scriptName);
  let scriptContent = fs.readFileSync(scriptPath, 'utf8');

  scriptContent = scriptContent.replace(
    /const filePath = path\.join\(__dirname, '\.\.\/pos-app\/src\/App\.jsx'\);/g,
    "const filePath = path.join(__dirname, '../pos-app/src/App_dryrun.jsx');"
  ).replace(
    /const filePath = path\.join\(__dirname, '\.\.', 'pos-app', 'src', 'App\.jsx'\);/g,
    "const filePath = path.join(__dirname, '../pos-app/src/App_dryrun.jsx');"
  );

  const tempScriptPath = path.join(workspaceRoot, 'scratch', scriptName.replace('.js', '_dryrun.js'));
  fs.writeFileSync(tempScriptPath, scriptContent, 'utf8');

  try {
    const output = execSync(`node scratch/${path.basename(tempScriptPath)}`, { cwd: workspaceRoot }).toString();
    console.log(output);
    console.log(`✅ ${scriptName} Dry-Run succeeded!`);
    return true;
  } catch (err) {
    console.error(`❌ ${scriptName} Dry-Run failed!`);
    console.error(err.stdout?.toString() || err.stderr?.toString() || err.message);
    return false;
  } finally {
    try { fs.unlinkSync(tempScriptPath); } catch (e) {}
  }
}

const finalOk = runDryRunScript('apply_permissions_final.js');
const phase3Ok = runDryRunScript('apply_phase3_permissions.js');

if (!finalOk || !phase3Ok) {
  console.log('\n❌ Compatibility check failed on permissions scripts.');
  process.exit(1);
}

// B. Apply Safe Vault Dial Splash Screen
console.log('\n--- Replacing TransitionSplashScreen with Vault Dial ---');
try {
  let dryrunContent = fs.readFileSync(dryrunJsxPath, 'utf8').replace(/\r\n/g, '\n');
  const dialCodePath = path.join(workspaceRoot, 'scratch/dial_from_git_b4f48d8.jsx');
  const dialCode = fs.readFileSync(dialCodePath, 'utf8').replace(/\r\n/g, '\n');

  // Find the target TransitionSplashScreen in dryrunContent
  const targetStart = 'const TransitionSplashScreen = ({ username }) => {';
  const targetEnd = '};\n\n// --- HELPER COMPONENTS ---';

  const startIndex = dryrunContent.indexOf(targetStart);
  if (startIndex === -1) {
    throw new Error('Target TransitionSplashScreen starting line not found');
  }

  const endIndex = dryrunContent.indexOf(targetEnd, startIndex);
  if (endIndex === -1) {
    throw new Error('Target TransitionSplashScreen ending boundary not found');
  }

  const fullTarget = dryrunContent.substring(startIndex, endIndex + 2); // Include the };
  
  // Replace the target with the dialCode
  dryrunContent = dryrunContent.replace(fullTarget, dialCode);
  fs.writeFileSync(dryrunJsxPath, dryrunContent, 'utf8');
  console.log('✅ Successfully replaced TransitionSplashScreen with Vault Dial Safe SVG!');
} catch (err) {
  console.error('❌ Failed to replace TransitionSplashScreen:', err.message);
  process.exit(1);
}

// C. Verify compilation
console.log('\n--- Running Dry-Run build verification ---');
try {
  // Backup real App.jsx temporarily to App_real_backup.jsx
  const realBackupPath = path.join(workspaceRoot, 'pos-app/src/App_real_backup.jsx');
  fs.renameSync(appJsxPath, realBackupPath);
  
  // Rename App_dryrun.jsx to App.jsx so Vite compile runs on it
  fs.renameSync(dryrunJsxPath, appJsxPath);

  console.log('Running npm run build inside pos-app...');
  const buildOutput = execSync('npm run build', { cwd: path.join(workspaceRoot, 'pos-app') }).toString();
  console.log(buildOutput);
  console.log('🎉 compilation SUCCEEDED on the modified file!');

  // Restore everything back to original state
  fs.renameSync(appJsxPath, dryrunJsxPath);
  fs.renameSync(realBackupPath, appJsxPath);
  console.log('✅ Restored real App.jsx back to active position.');
} catch (err) {
  console.error('❌ Compilation FAILED on dryrun code!');
  console.error(err.stdout?.toString() || err.stderr?.toString() || err.message);
  
  // Safety restore in case of build failure
  const realBackupPath = path.join(workspaceRoot, 'pos-app/src/App_real_backup.jsx');
  if (fs.existsSync(realBackupPath)) {
    if (fs.existsSync(appJsxPath)) fs.unlinkSync(appJsxPath);
    fs.renameSync(realBackupPath, appJsxPath);
    console.log('🛡️ Safely restored original App.jsx due to build failure.');
  }
  process.exit(1);
}

console.log('\n🎉 ALL DRY RUN STEPS SUCCESSFUL! Ready to write final files.');
