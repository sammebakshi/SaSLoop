const fs = require('fs');
const path = require('path');

const posDiffPath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\pos_diff.diff';
const localDiffPath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\local_diff.diff';

function inspectDiff(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File ${filePath} does not exist`);
        return;
    }
    const stat = fs.statSync(filePath);
    console.log(`\n--- Inspecting ${path.basename(filePath)} (${stat.size} bytes) ---`);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    console.log(`Total lines: ${lines.length}`);
    
    // Print first 10 lines
    console.log("First 15 lines:");
    console.log(lines.slice(0, 15).join('\n'));
    
    // Print lines containing "diff --git"
    const gitDiffLines = lines.filter(l => l.startsWith('diff --git'));
    console.log("Diff targets:");
    gitDiffLines.forEach(l => console.log(`  ${l}`));
}

inspectDiff(posDiffPath);
inspectDiff(localDiffPath);
