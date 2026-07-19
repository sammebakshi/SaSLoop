const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const masterLnk = 'c:\\Users\\Sajad\\Desktop\\SaSLoop Master POS.lnk';
  const terminalLnk = 'c:\\Users\\Sajad\\Desktop\\SaSLoop POS Terminal.lnk';

  const cmdMaster = `powershell -Command "$sh = New-Object -ComObject WScript.Shell; $sh.CreateShortcut('${masterLnk}').TargetPath"`;
  const targetMaster = execSync(cmdMaster).toString().trim();

  const cmdTerminal = `powershell -Command "$sh = New-Object -ComObject WScript.Shell; $sh.CreateShortcut('${terminalLnk}').TargetPath"`;
  const targetTerminal = execSync(cmdTerminal).toString().trim();

  console.log('Master POS Lnk Target:', targetMaster);
  console.log('Terminal POS Lnk Target:', targetTerminal);
} catch (err) {
  console.error('Error resolving link targets:', err);
}
