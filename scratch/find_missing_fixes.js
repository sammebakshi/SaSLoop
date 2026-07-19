const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'yesterday_edits.txt');
if (!fs.existsSync(filePath)) {
  console.log('yesterday_edits.txt not found');
  process.exit(0);
}

const content = fs.readFileSync(filePath).toString('utf16le');
const edits = content.split('Edit #');

console.log(`Total edits parsed: ${edits.length - 1}`);

edits.slice(1).forEach((editBlock, idx) => {
  const lines = editBlock.split('\n');
  const editNum = idx + 1;
  
  let description = '';
  let targetFile = '';
  let targetContent = '';
  let replacementContent = '';
  
  let inTarget = false;
  let inReplacement = false;
  
  lines.forEach(line => {
    if (line.startsWith('Description:')) {
      description = line.replace('Description:', '').trim();
    } else if (line.startsWith('TargetFile:')) {
      targetFile = line.replace('TargetFile:', '').trim();
    } else if (line.startsWith('Target Content:')) {
      inTarget = true;
      inReplacement = false;
    } else if (line.startsWith('Replacement Content:')) {
      inTarget = false;
      inReplacement = true;
    } else if (line.startsWith('===') || line.startsWith('Instruction:')) {
      inTarget = false;
      inReplacement = false;
    } else {
      if (inTarget) targetContent += line + '\n';
      if (inReplacement) replacementContent += line + '\n';
    }
  });

  // Clean up content quotes
  const cleanContent = (str) => {
    let s = str.trim();
    if (s.startsWith('"') && s.endsWith('"')) {
      s = s.slice(1, -1);
    }
    // Unescape javascript escape sequences
    try {
      s = s.replace(/\\n/g, '\n')
           .replace(/\\t/g, '\t')
           .replace(/\\r/g, '\r')
           .replace(/\\"/g, '"')
           .replace(/\\\\/g, '\\');
    } catch (e) {}
    return s.trim();
  };

  // Resolve absolute path in workspace based on description keywords
  let absolutePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
  if (description.includes('api.js') || description.toLowerCase().includes('api service')) {
    absolutePath = path.join(__dirname, '..', 'pos-app', 'src', 'services', 'api.js');
  } else if (description.includes('App.js')) {
    absolutePath = path.join(__dirname, '..', 'SaSLoop-dashboard', 'src', 'App.js');
  } else if (description.toLowerCase().includes('timesync') || description.includes('timeSync.js')) {
    absolutePath = path.join(__dirname, '..', 'SaSLoop-dashboard', 'src', 'timeSync.js');
  } else if (description.includes('authRoutes') || description.includes('authRoutes.js')) {
    absolutePath = path.join(__dirname, '..', 'routes', 'authRoutes.js');
  }

  absolutePath = path.normalize(absolutePath);
  
  if (!fs.existsSync(absolutePath)) {
    console.log(`❌ Edit #${editNum}: File not found: ${absolutePath}`);
    return;
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf8');
  const cleanReplacement = cleanContent(replacementContent);
  const cleanTarget = cleanContent(targetContent);

  const matchedRep = fileContent.includes(cleanReplacement);
  const matchedTar = fileContent.includes(cleanTarget);
  
  console.log(`Edit #${editNum} | File: ${path.basename(absolutePath)} | Matched Replacement: ${matchedRep} | Matched Target: ${matchedTar}`);

  if (cleanReplacement && !matchedRep) {
    if (matchedTar) {
      console.log(`  ⚠️ MISSING: [${d(description)}]`);
    } else {
      console.log(`  ℹ️ UNVERIFIED: [${d(description)}]`);
    }
  }
});

function d(s) {
  return s.length > 60 ? s.slice(0, 57) + '...' : s;
}
