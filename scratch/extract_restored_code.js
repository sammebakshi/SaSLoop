const { execSync } = require('child_process');
const fs = require('fs');

// We will check the content of App.jsx in commit 5ff91c9 vs origin/main to see what custom offline features were implemented.
// Let's write the diff of App.jsx to a temporary file
try {
  const diff = execSync('git diff origin/main 5ff91c9 -- pos-app/src/App.jsx', { maxBuffer: 10 * 1024 * 1024 }).toString();
  
  // Let's search inside the diff for relevant keywords
  const lines = diff.split('\n');
  
  console.log("Analyzing diff between origin/main and 5ff91c9...");
  
  // Let's look for:
  // 1. Printer settings
  // 2. Temp tables
  // 3. Pickup/delivery toggle
  // 4. LockerDial / Splash
  
  const results = {
    printers: [],
    temp_table: [],
    toggle: [],
    splash: []
  };
  
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('printer') && (line.startsWith('+') || line.startsWith('-'))) {
      results.printers.push({ lineNum: idx, content: line });
    }
    if (line.toLowerCase().includes('temp') && (line.startsWith('+') || line.startsWith('-'))) {
      results.temp_table.push({ lineNum: idx, content: line });
    }
    if ((line.toLowerCase().includes('pickup') || line.toLowerCase().includes('delivery')) && (line.startsWith('+') || line.startsWith('-'))) {
      results.toggle.push({ lineNum: idx, content: line });
    }
    if (line.toLowerCase().includes('splash') && (line.startsWith('+') || line.startsWith('-'))) {
      results.splash.push({ lineNum: idx, content: line });
    }
  });
  
  console.log(`Printers matches: ${results.printers.length}`);
  console.log(`Temp table matches: ${results.temp_table.length}`);
  console.log(`Toggle matches: ${results.toggle.length}`);
  console.log(`Splash matches: ${results.splash.length}`);
  
  // Save some sample snippets
  fs.writeFileSync('scratch/diff_changes.txt', diff, 'utf8');
  console.log("Saved full diff to scratch/diff_changes.txt");
  
} catch (e) {
  console.error("Failed to run git diff:", e);
}
