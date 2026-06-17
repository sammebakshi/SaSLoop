const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const diffPath = path.join(projectDir, 'scratch', 'pos_diff.diff');
const outputPath = path.join(projectDir, 'pos-app', 'src', 'App_restored.jsx');

function extract() {
  console.log("Reading pos_diff.diff...");
  let content;
  try {
    // Try reading as UTF-16LE first
    content = fs.readFileSync(diffPath, 'utf16le');
  } catch (e) {
    console.error("Failed to read as UTF-16LE:", e.message);
    return;
  }

  // If it didn't start with diff header, try UTF-8
  if (!content.includes('diff --git')) {
    console.log("Not UTF-16LE, trying UTF-8...");
    content = fs.readFileSync(diffPath, 'utf8');
  }

  // Strip Byte Order Mark (BOM) if present
  if (content.charCodeAt(0) === 0xFEFF || content.charCodeAt(0) === 0xFFFE) {
    content = content.substring(1);
  }

  const lines = content.split('\n');
  console.log(`Loaded ${lines.length} lines from diff.`);

  let inAppDiff = false;
  const appLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we are starting the App.jsx diff section
    if (line.includes('diff --git') && (line.includes('pos-app/src/App.jsx') || line.includes('pos-app/src/App.js'))) {
      console.log(`Found App.jsx diff start at line ${i+1}: ${line}`);
      inAppDiff = true;
      // Skip the headers (usually next 4-5 lines until @@)
      while (i < lines.length && !lines[i].startsWith('@@')) {
        i++;
      }
      continue;
    }

    if (inAppDiff) {
      // If we encounter another diff start, stop
      if (line.startsWith('diff --git')) {
        console.log(`Found next file diff start at line ${i+1}: ${line}, stopping extraction.`);
        break;
      }

      // If the line starts with '+', strip it and keep it
      if (line.startsWith('+')) {
        appLines.push(line.substring(1));
      } else if (line.startsWith('-')) {
        // Skip deleted lines (though for a new file there should be none)
      } else {
        // Unchanged lines or headers
        // In a diff of a new file, all code lines start with '+'
      }
    }
  }

  console.log(`Extracted ${appLines.length} lines of code.`);
  if (appLines.length > 0) {
    fs.writeFileSync(outputPath, appLines.join('\n'), 'utf8');
    console.log(`Saved extracted code to ${outputPath}`);
  } else {
    console.warn("No lines extracted!");
  }
}

extract();
