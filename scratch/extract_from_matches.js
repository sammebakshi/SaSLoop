const fs = require('fs');

const matchesPath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/matches_utf8.txt';
if (!fs.existsSync(matchesPath)) {
  console.error("matches_utf8.txt does not exist!");
  process.exit(1);
}

const content = fs.readFileSync(matchesPath, 'utf8');
console.log("matches_utf8.txt length:", content.length);

let idx = 0;
let occurrence = 0;
while (true) {
  idx = content.indexOf('dial-spin-sequence', idx);
  if (idx === -1) break;
  occurrence++;
  console.log(`Occurrence ${occurrence} at index ${idx}`);
  
  // Find "const TransitionSplashScreen =" before this index
  let startIdx = content.lastIndexOf('const TransitionSplashScreen =', idx);
  if (startIdx !== -1) {
    // Let's grab 6000 characters from startIdx
    let block = content.substring(startIdx, startIdx + 8000);
    // Find the end of the TransitionSplashScreen component, e.g. where the next helper component starts:
    // "const SidebarIcon =" or "// --- HELPER COMPONENTS ---"
    let endIdx = block.indexOf('// --- HELPER COMPONENTS ---');
    if (endIdx === -1) {
      endIdx = block.indexOf('const SidebarIcon =');
    }
    if (endIdx !== -1) {
      block = block.substring(0, endIdx);
    }
    
    fs.writeFileSync(`c:/Users/Sajad/Desktop/SaSLoop/scratch/dial_block_${occurrence}.jsx`, block, 'utf8');
    console.log(`Wrote block ${occurrence} to dial_block_${occurrence}.jsx`);
  }
  idx += 'dial-spin-sequence'.length;
}
