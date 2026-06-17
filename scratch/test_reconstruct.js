const fs = require('fs');
const path = require('path');

const backupPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\App_working_backup.jsx';
const editsPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\all_app_edits.json';
const outputPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\src\\App.jsx';

let fileContent = fs.readFileSync(backupPath, 'utf8');
const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));

const normalizeCR = str => str.replace(/\r\n/g, '\n');

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
      return null;
    }
  }
};

const startIdx = 43; // Step 1911 onwards
const todayEdits = edits.slice(startIdx);

todayEdits.forEach((edit, idx) => {
  const currentIdx = startIdx + idx;
  
  // Skip truncated steps 1963 and 2021, and also skip other intermediate steps from 1963 to 2025
  const stepNum = edit.step;
  if (stepNum >= 1963 && stepNum <= 2025) {
    console.log(`[Edit ${currentIdx+1}] Step ${stepNum} - SKIPPED (intermediate/truncated step)`);
    return;
  }
  
  console.log(`[Edit ${currentIdx+1}] Step: ${edit.step}, Tool: ${edit.tool}, Description: ${edit.description}`);
  
  if (edit.tool === 'replace_file_content') {
    const target = edit.args.TargetContent;
    const replacement = edit.args.ReplacementContent;
    
    const normFile = normalizeCR(fileContent);
    const normTarget = normalizeCR(target);
    const normReplacement = normalizeCR(replacement);
    
    if (normFile.includes(normTarget)) {
      const parts = normFile.split(normTarget);
      fileContent = parts.join(normReplacement);
      console.log("  -> Applied replacement");
    } else if (normFile.includes(normReplacement)) {
      console.log("  -> Skipped (already applied)");
    } else {
      console.error(`  -> ERROR: Target NOT found!`);
    }
  } else if (edit.tool === 'multi_replace_file_content') {
    let chunks = edit.args.ReplacementChunks;
    chunks = safeParseChunks(chunks);
    if (!chunks) {
      console.error(`  -> ERROR: Failed to parse chunks!`);
      return;
    }
    
    chunks.forEach((chunk, cIdx) => {
      const target = chunk.TargetContent;
      const replacement = chunk.ReplacementContent;
      
      const normFile = normalizeCR(fileContent);
      const normTarget = normalizeCR(target);
      const normReplacement = normalizeCR(replacement);
      
      if (normFile.includes(normTarget)) {
        const parts = normFile.split(normTarget);
        fileContent = parts.join(normReplacement);
        console.log(`  -> Applied multi-chunk ${cIdx}`);
      } else if (normFile.includes(normReplacement)) {
        console.log(`  -> Skipped multi-chunk ${cIdx} (already applied)`);
      } else {
        console.error(`  -> ERROR: Multi-chunk target ${cIdx} NOT found!`);
      }
    });
  }
});
