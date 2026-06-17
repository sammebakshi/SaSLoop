const fs = require('fs');
const path = require('path');

const backupPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\src\\App.jsx'; // Current checked-out base
const editsPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\all_app_edits.json';
const outputPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\src\\App.jsx';

let fileContent = fs.readFileSync(backupPath, 'utf8');
const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));

console.log(`Loaded ${edits.length} edits total.`);
const startIdx = 43; // Step 1911 onwards (today's edits)
const todayEdits = edits.slice(startIdx);
console.log(`Applying ${todayEdits.length} edits (from step ${edits[startIdx].step} onwards) to checked-out App.jsx...`);

const normalizeCR = str => str.replace(/\r\n/g, '\n');

// Clean JSON string that has raw control characters
const safeParseChunks = (chunksStr) => {
  if (typeof chunksStr !== 'string') return chunksStr;
  try {
    return JSON.parse(chunksStr);
  } catch (err) {
    try {
      const cleaned = chunksStr
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      return JSON.parse(cleaned);
    } catch (e2) {
      console.error("Failed to parse chunks string even after cleaning!");
      throw e2;
    }
  }
};

todayEdits.forEach((edit, idx) => {
  const currentIdx = startIdx + idx;
  console.log(`[Edit ${currentIdx+1}/${edits.length}] Step: ${edit.step}, Tool: ${edit.tool}, Description: ${edit.description}`);
  
  if (edit.tool === 'replace_file_content') {
    const target = edit.args.TargetContent;
    const replacement = edit.args.ReplacementContent;
    
    const normFile = normalizeCR(fileContent);
    const normTarget = normalizeCR(target);
    const normReplacement = normalizeCR(replacement);
    
    if (normFile.includes(normTarget)) {
      const parts = normFile.split(normTarget);
      fileContent = parts.join(normReplacement);
      console.log("-> Applied replacement");
    } else if (normFile.includes(normReplacement)) {
      console.log("-> Skipped (already applied)");
    } else {
      console.error(`ERROR: Target NOT found in step ${edit.step}!`);
    }
  } else if (edit.tool === 'multi_replace_file_content') {
    let chunks = edit.args.ReplacementChunks;
    chunks = safeParseChunks(chunks);
    
    chunks.forEach((chunk, cIdx) => {
      const target = chunk.TargetContent;
      const replacement = chunk.ReplacementContent;
      
      const normFile = normalizeCR(fileContent);
      const normTarget = normalizeCR(target);
      const normReplacement = normalizeCR(replacement);
      
      if (normFile.includes(normTarget)) {
        const parts = normFile.split(normTarget);
        fileContent = parts.join(normReplacement);
        console.log(`-> Applied multi-chunk ${cIdx}`);
      } else if (normFile.includes(normReplacement)) {
        console.log(`-> Skipped multi-chunk ${cIdx} (already applied)`);
      } else {
        console.error(`ERROR: Multi-chunk target ${cIdx} NOT found in step ${edit.step}!`);
      }
    });
  }
});

const outputContent = fileContent.replace(/\r?\n/g, '\r\n');
fs.writeFileSync(outputPath, outputContent, 'utf8');
console.log("Reconstruction completed! Saved to:", outputPath);
console.log("Final file size:", outputContent.length, "characters");
