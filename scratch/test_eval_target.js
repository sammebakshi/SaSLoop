const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../pos-app/src/App.jsx');
const app = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

const scriptPath = path.join(__dirname, 'apply_permissions_final.js');
const script = fs.readFileSync(scriptPath, 'utf8').replace(/\r\n/g, '\n');

// We will find the target string by parsing the first argument of the replaceExactlyOnce call for Step 12
const targetMarker = "activeTrayTab === 'KOT'";
const idx = script.indexOf(targetMarker);
if (idx === -1) {
  console.log("Could not find KOT marker");
  process.exit(1);
}

// Find enclosing backticks
const backtickStart = script.lastIndexOf('`', idx);
// Find the next backtick that is not escaped and followed by a comma
let searchPos = idx;
let backtickEnd = -1;
while (true) {
  const nextBacktick = script.indexOf('`', searchPos);
  if (nextBacktick === -1) break;
  if (script[nextBacktick - 1] === '\\') {
    searchPos = nextBacktick + 1;
    continue;
  }
  const afterBacktick = script.substring(nextBacktick + 1, nextBacktick + 20);
  if (afterBacktick.trim().startsWith(',')) {
    backtickEnd = nextBacktick;
    break;
  }
  searchPos = nextBacktick + 1;
}

const rawTarget = script.substring(backtickStart + 1, backtickEnd);
console.log("Raw Target string length:", rawTarget.length);

// Let's eval rawTarget as a template literal to see what V8 evaluates it to
const evaluatedTarget = eval('`' + rawTarget + '`');
console.log("Evaluated Target string length:", evaluatedTarget.length);

const indexInApp = app.indexOf(evaluatedTarget);
console.log("Index in App.jsx:", indexInApp);

if (indexInApp === -1) {
  // Let's find the mismatch
  const firstLine = "                  ) : activeTrayTab === 'KOT' ? (";
  const indexFirstLine = app.indexOf(firstLine);
  if (indexFirstLine === -1) {
    console.log("Cannot even find first line of block in App.jsx");
  } else {
    console.log("First line found at index:", indexFirstLine);
    for (let i = 0; i < evaluatedTarget.length; i++) {
      if (app[indexFirstLine + i] !== evaluatedTarget[i]) {
        console.log(`Mismatch at index ${i}:`);
        console.log(`App.jsx context:  ${JSON.stringify(app.substring(indexFirstLine + i, indexFirstLine + i + 60))}`);
        console.log(`Target context:   ${JSON.stringify(evaluatedTarget.substring(i, i + 60))}`);
        break;
      }
    }
  }
}
