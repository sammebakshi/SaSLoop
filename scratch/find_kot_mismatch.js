const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../pos-app/src/App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

// Load target 12 from apply_permissions_final.js
const scriptPath = path.join(__dirname, 'apply_permissions_final.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8').replace(/\r\n/g, '\n');

const targetMarker = "activeTrayTab === 'KOT' ? (";
const indexInScript = scriptContent.indexOf(targetMarker);
if (indexInScript === -1) {
  console.log("Could not find KOT marker in script");
  process.exit(1);
}

// Find enclosing backticks in the script content
// We need to parse backticks properly, skipping escaped ones
let backtickStart = -1;
let backtickEnd = -1;

// Let's find the start of replaceExactlyOnce(
const replaceCallIndex = scriptContent.lastIndexOf('replaceExactlyOnce(', indexInScript);
if (replaceCallIndex !== -1) {
  backtickStart = scriptContent.indexOf('`', replaceCallIndex);
}

// Now find the closing backtick of the first argument
// The closing backtick will be followed by a comma, optional whitespace, newlines, and another backtick
let searchPos = indexInScript;
while (true) {
  const nextBacktick = scriptContent.indexOf('`', searchPos);
  if (nextBacktick === -1) break;
  // Check if it's escaped
  if (scriptContent[nextBacktick - 1] === '\\') {
    searchPos = nextBacktick + 1;
    continue;
  }
  // Check if it is followed by comma
  const afterBacktick = scriptContent.substring(nextBacktick + 1, nextBacktick + 20);
  if (afterBacktick.trim().startsWith(',')) {
    backtickEnd = nextBacktick;
    break;
  }
  searchPos = nextBacktick + 1;
}

if (backtickStart === -1 || backtickEnd === -1) {
  console.log("Could not find target boundaries in script");
  process.exit(1);
}

const targetString = scriptContent.substring(backtickStart + 1, backtickEnd).replace(/\r\n/g, '\n');
console.log("Target string length:", targetString.length);

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
