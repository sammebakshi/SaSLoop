const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

function checkReplace(target, replacement, name) {
  const normalizedTarget = target.replace(/\r\n/g, '\n');
  const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

  const index = content.indexOf(normalizedTarget);
  if (index === -1) {
    console.log(`❌ Failed to match: ${name}`);
    const firstLine = normalizedTarget.split('\n')[0];
    const indexFirstLine = content.indexOf(firstLine);
    if (indexFirstLine === -1) {
      console.log(`  Cannot even find the first line: ${JSON.stringify(firstLine)}`);
    } else {
      console.log(`  Found first line at index ${indexFirstLine}. Finding mismatch...`);
      let mismatchIndex = 0;
      for (let i = 0; i < normalizedTarget.length; i++) {
        if (content[indexFirstLine + i] !== normalizedTarget[i]) {
          mismatchIndex = i;
          break;
        }
      }
      console.log(`  Mismatch at character index ${mismatchIndex}:`);
      console.log(`  App.jsx context:  ${JSON.stringify(content.substring(indexFirstLine + mismatchIndex, indexFirstLine + mismatchIndex + 60))}`);
      console.log(`  Target context:   ${JSON.stringify(normalizedTarget.substring(mismatchIndex, mismatchIndex + 60))}`);
    }
  } else {
    if (content.indexOf(normalizedTarget, index + 1) !== -1) {
      console.log(`⚠️ Multiple matches found for: ${name}`);
    } else {
      console.log(`✅ Matches exactly once: ${name}`);
    }
  }
}

let scriptContent = fs.readFileSync(path.join(__dirname, 'apply_phase2_permissions.js'), 'utf8');
scriptContent = scriptContent.replace(/function replaceOnce[\s\S]*?\n\}/, 'const replaceOnce = checkReplace;');
scriptContent = scriptContent.replace(/fs\.writeFileSync[\s\S]*$/, '');

eval(scriptContent);
