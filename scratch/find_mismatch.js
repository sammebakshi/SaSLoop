const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../pos-app/src/App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

// Let's extract the target string for step 12
const scriptPath = path.join(__dirname, 'apply_remaining_permissions.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8').replace(/\r\n/g, '\n');

// We will extract the exact string passed to the 12th call of replaceExactlyOnce
// Let's locate the target content between `replaceExactlyOnce(\n\`` and `\`,\n\`` around line 526
const targetMarker = "activeTrayTab === 'KOT' ? (";
const indexInScript = scriptContent.indexOf(targetMarker);
if (indexInScript === -1) {
  console.log("Could not find KOT marker in script");
  process.exit(1);
}

// Find the enclosing backticks
const backtickStart = scriptContent.lastIndexOf('`', indexInScript);
const backtickEnd = scriptContent.indexOf('`', indexInScript + targetMarker.length);

const targetString = scriptContent.substring(backtickStart + 1, backtickEnd);

console.log("Target string length:", targetString.length);

// Now let's find where in App.jsx the first line matches
const firstLine = "                  ) : activeTrayTab === 'KOT' ? (";
const indexInApp = appContent.indexOf(firstLine);

if (indexInApp === -1) {
  console.log("Could not find first line in App.jsx!");
  process.exit(1);
}

console.log("Found first line in App.jsx at index:", indexInApp);

// Let's compare character by character
let mismatchFound = false;
for (let i = 0; i < targetString.length; i++) {
  const appChar = appContent[indexInApp + i];
  const targetChar = targetString[i];
  if (appChar !== targetChar) {
    console.log(`Mismatch at index ${i}:`);
    console.log(`App.jsx:   ${JSON.stringify(appContent.substring(indexInApp + i, indexInApp + i + 50))}`);
    console.log(`Target:    ${JSON.stringify(targetString.substring(i, i + 50))}`);
    mismatchFound = true;
    break;
  }
}

if (!mismatchFound) {
  console.log("No mismatch found! The strings are identical.");
}
