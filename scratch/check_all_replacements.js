const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

function checkReplace(target, replacement, name) {
  const normalizedTarget = target.replace(/\r\n/g, '\n');
  const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

  const index = content.indexOf(normalizedTarget);
  if (index === -1) {
    console.log(`\n❌ Failed to match: ${name}`);
    
    // Find the closest match or where it starts mismatching
    // Let's search for a unique substring first, e.g. the first 30 chars
    const firstLine = normalizedTarget.split('\n')[0];
    const indexFirstLine = content.indexOf(firstLine);
    if (indexFirstLine === -1) {
      console.log(`  Cannot even find the first line: ${JSON.stringify(firstLine)}`);
      // Try searching for any subset of the first line
      const shortFirstLine = firstLine.trim();
      const indexShort = content.indexOf(shortFirstLine);
      if (indexShort === -1) {
        console.log(`  Cannot find trimmed first line: ${JSON.stringify(shortFirstLine)}`);
      } else {
        console.log(`  Found trimmed first line at index ${indexShort}`);
      }
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
      content = content.replace(normalizedTarget, normalizedReplacement);
    }
  }
}

// Now let's execute apply_remaining_permissions.js by replacing the definition of replaceExactlyOnce and eval'ing it.
let scriptContent = fs.readFileSync(path.join(__dirname, 'apply_remaining_permissions.js'), 'utf8');

// Replace the define of replaceExactlyOnce in scriptContent
scriptContent = scriptContent.replace(/function replaceExactlyOnce[\s\S]*?\n\}/, 'const replaceExactlyOnce = checkReplace;');
// Remove fs.writeFileSync at the end so it doesn't write anything
scriptContent = scriptContent.replace(/fs\.writeFileSync[\s\S]*$/, '');

eval(scriptContent);
