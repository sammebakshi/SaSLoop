const fs = require('fs');

const backupPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\src\\App.jsx'; // start from the current restored May 3rd App.jsx
const editsPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\all_app_edits.json';

let fileContent = fs.readFileSync(backupPath, 'utf8');
const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));

const normalizeCR = str => str.replace(/\r\n/g, '\n');

function replaceFuzzy(fileContent, target, replacement, editDesc, chunkIdx) {
  const fContent = normalizeCR(fileContent);
  const targetNorm = normalizeCR(target);
  const replNorm = normalizeCR(replacement);

  // Try exact match first
  if (fContent.includes(targetNorm)) {
    return { success: true, content: fContent.split(targetNorm).join(replNorm), type: 'exact' };
  }

  if (!targetNorm.trim()) {
    return { success: false, content: fContent, error: 'Empty target' };
  }

  const targetLines = targetNorm.split('\n').map(l => l.trim()).filter(Boolean);
  const fileLines = fContent.split('\n');

  if (targetLines.length === 0) {
    return { success: false, content: fContent, error: 'Target has no non-empty lines' };
  }

  let matchStart = -1;
  let matchCount = 0;

  for (let i = 0; i <= fileLines.length - targetLines.length; i++) {
    let match = true;
    for (let j = 0; j < targetLines.length; j++) {
      if (fileLines[i + j].trim() !== targetLines[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      matchStart = i;
      matchCount++;
    }
  }

  if (matchCount === 1) {
    const replLines = replNorm.split('\n');
    const newLines = [
      ...fileLines.slice(0, matchStart),
      ...replLines,
      ...fileLines.slice(matchStart + targetLines.length)
    ];
    return { success: true, content: newLines.join('\n'), type: 'fuzzy' };
  } else if (matchCount > 1) {
    return { success: false, content: fContent, error: `Multiple fuzzy matches found (${matchCount})` };
  }

  // Check if replacement is already applied fuzzy-style
  const replLines = replNorm.split('\n').map(l => l.trim()).filter(Boolean);
  if (replLines.length > 0) {
    let replMatchCount = 0;
    for (let i = 0; i <= fileLines.length - replLines.length; i++) {
      let match = true;
      for (let j = 0; j < replLines.length; j++) {
        if (fileLines[i + j].trim() !== replLines[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        replMatchCount++;
      }
    }
    if (replMatchCount >= 1) {
      return { success: true, content: fContent, type: 'already_applied' };
    }
  }

  return { success: false, content: fContent, error: 'Target not found and replacement not applied' };
}

const safeParseChunks = (chunksStr) => {
  if (typeof chunksStr !== 'string') return chunksStr;
  try {
    return JSON.parse(chunksStr);
  } catch (err) {
    try {
      // Clean typical truncation pattern if possible
      let cleaned = chunksStr
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      return JSON.parse(cleaned);
    } catch (e2) {
      return null;
    }
  }
};

edits.forEach((edit, idx) => {
  const stepNum = edit.step;
  console.log(`[Edit ${idx+1}] Step: ${stepNum}, Tool: ${edit.tool}, Description: ${edit.description}`);

  if (edit.tool === 'replace_file_content') {
    const target = edit.args.TargetContent;
    const replacement = edit.args.ReplacementContent;
    const res = replaceFuzzy(fileContent, target, replacement, edit.description, 0);
    if (res.success) {
      fileContent = res.content;
      console.log(`  -> Success (${res.type})`);
    } else {
      console.error(`  -> ERROR: ${res.error}`);
    }
  } else if (edit.tool === 'multi_replace_file_content') {
    let chunks = edit.args.ReplacementChunks;
    chunks = safeParseChunks(chunks);
    if (!chunks) {
      console.error(`  -> ERROR: Failed to parse chunks (possibly truncated in JSON)`);
      return;
    }
    chunks.forEach((chunk, cIdx) => {
      const target = chunk.TargetContent;
      const replacement = chunk.ReplacementContent;
      const res = replaceFuzzy(fileContent, target, replacement, edit.description, cIdx);
      if (res.success) {
        fileContent = res.content;
        console.log(`  -> Success chunk ${cIdx} (${res.type})`);
      } else {
        console.error(`  -> ERROR chunk ${cIdx}: ${res.error}`);
      }
    });
  }
});
