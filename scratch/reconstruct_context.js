const fs = require('fs');

const originalPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\src\\App.jsx'; // Original May 3rd clean App.jsx
const editsPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\all_app_edits.json';

const originalContent = fs.readFileSync(originalPath, 'utf8').replace(/\r\n/g, '\n');
const originalLines = originalContent.split('\n');

const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));

let currentContent = originalContent;

const safeParseValue = (val) => {
  if (typeof val !== 'string') return val;
  if (val.startsWith('"') && val.endsWith('"')) {
    try {
      return JSON.parse(val);
    } catch (e) {
      try {
        const cleaned = val
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        return JSON.parse(cleaned);
      } catch (e2) {
        return val;
      }
    }
  }
  return val;
};

const safeParseChunks = (chunksStr) => {
  if (typeof chunksStr !== 'string') return chunksStr;
  try {
    return JSON.parse(chunksStr);
  } catch (err) {
    try {
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

function performReplace(target, replacement, startLine, endLine) {
  const tNorm = safeParseValue(target).replace(/\r\n/g, '\n');
  const rNorm = safeParseValue(replacement).replace(/\r\n/g, '\n');

  if (!tNorm) return { success: false, error: 'Empty target' };

  // Helper to count occurrences
  const countOccurrences = (str, sub) => str.split(sub).length - 1;

  const count = countOccurrences(currentContent, tNorm);
  if (count === 1) {
    // 100% safe exact match
    currentContent = currentContent.split(tNorm).join(rNorm);
    return { success: true, type: 'exact_single' };
  }

  // If already applied (exact replacement exists)
  if (countOccurrences(currentContent, rNorm) >= 1) {
    return { success: true, type: 'already_applied' };
  }

  // Restrict via context from originalLines
  if (startLine && endLine) {
    const sLine = parseInt(startLine);
    const eLine = parseInt(endLine);

    // Get original target lines from original file
    const origTarget = originalLines.slice(sLine - 1, eLine).join('\n');

    // Let's try expanding context around sLine and eLine
    for (let contextSize of [3, 2, 1]) {
      const beforeIndex = Math.max(0, sLine - 1 - contextSize);
      const afterIndex = Math.min(originalLines.length, eLine + contextSize);

      const beforeContext = originalLines.slice(beforeIndex, sLine - 1).join('\n');
      const afterContext = originalLines.slice(eLine, afterIndex).join('\n');

      const expandedTarget = (beforeContext ? beforeContext + '\n' : '') +
                             origTarget +
                             (afterContext ? '\n' + afterContext : '');

      const expCount = countOccurrences(currentContent, expandedTarget);
      if (expCount === 1) {
        const expandedReplacement = (beforeContext ? beforeContext + '\n' : '') +
                                    rNorm +
                                    (afterContext ? '\n' + afterContext : '');
        currentContent = currentContent.split(expandedTarget).join(expandedReplacement);
        return { success: true, type: `context_match_size_${contextSize}` };
      }
    }
  }

  // Try line-by-line fuzzy search as fallback
  const targetLines = tNorm.split('\n').map(l => l.trim()).filter(Boolean);
  const currentLines = currentContent.split('\n');

  if (targetLines.length > 0) {
    let matchStart = -1;
    let matchCount = 0;

    for (let i = 0; i <= currentLines.length - targetLines.length; i++) {
      let match = true;
      for (let j = 0; j < targetLines.length; j++) {
        if (currentLines[i + j].trim() !== targetLines[j]) {
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
      const replLines = rNorm.split('\n');
      const newLines = [
        ...currentLines.slice(0, matchStart),
        ...replLines,
        ...currentLines.slice(matchStart + targetLines.length)
      ];
      currentContent = newLines.join('\n');
      return { success: true, type: 'fuzzy_single' };
    }
  }

  return { success: false, error: `Match count: ${count}. Target not found or ambiguous.` };
}

edits.forEach((edit, idx) => {
  const stepNum = edit.step;
  console.log(`[Edit ${idx+1}] Step: ${stepNum}, Tool: ${edit.tool}, Description: ${edit.description}`);

  if (edit.tool === 'replace_file_content') {
    const target = edit.args.TargetContent;
    const replacement = edit.args.ReplacementContent;
    const startLine = edit.args.StartLine;
    const endLine = edit.args.EndLine;
    const res = performReplace(target, replacement, startLine, endLine);
    if (res.success) {
      console.log(`  -> Success (${res.type})`);
    } else {
      console.log(`  -> ERROR: ${res.error}`);
    }
  } else if (edit.tool === 'multi_replace_file_content') {
    let chunks = edit.args.ReplacementChunks;
    chunks = safeParseChunks(chunks);
    if (!chunks) {
      console.log(`  -> ERROR: Failed to parse chunks (possibly truncated in JSON)`);
      return;
    }
    chunks.forEach((chunk, cIdx) => {
      const target = chunk.TargetContent;
      const replacement = chunk.ReplacementContent;
      const startLine = chunk.StartLine;
      const endLine = chunk.EndLine;
      const res = performReplace(target, replacement, startLine, endLine);
      if (res.success) {
        console.log(`  -> Success chunk ${cIdx} (${res.type})`);
      } else {
        console.log(`  -> ERROR chunk ${cIdx}: ${res.error}`);
      }
    });
  }
});

fs.writeFileSync('C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\App_reconstructed_context.jsx', currentContent, 'utf8');
console.log('Reconstruction finished. Wrote to App_reconstructed_context.jsx');
