const fs = require('fs');
const path = require('path');

const yesterdayEditsPath = path.join(__dirname, 'yesterday_edits.txt');
if (!fs.existsSync(yesterdayEditsPath)) {
  console.log('yesterday_edits.txt not found');
  process.exit(1);
}

const content = fs.readFileSync(yesterdayEditsPath).toString('utf16le');
const edits = content.split('Edit #');

console.log(`Parsed ${edits.length - 1} edits from yesterday_edits.txt`);

// Helper to clean quotes and unescape
const cleanContent = (str) => {
  let s = str.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1);
  }
  try {
    s = s.replace(/\\n/g, '\n')
         .replace(/\\t/g, '\t')
         .replace(/\\r/g, '\r')
         .replace(/\\"/g, '"')
         .replace(/\\\\/g, '\\');
  } catch (e) {}
  return s;
};

// Find all extracted json files in scratch
const scratchFiles = fs.readdirSync(__dirname).filter(f => f.startsWith('edit_extracted_') && f.endsWith('.json'));

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

  description = description.replace(/"/g, '').trim();

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
  if (!fs.existsSync(absolutePath)) return;

  let fileContent = fs.readFileSync(absolutePath, 'utf8');
  let cleanReplacement = cleanContent(replacementContent);
  let cleanTarget = cleanContent(targetContent);

  const matchedRep = fileContent.includes(cleanReplacement);
  const matchedTar = fileContent.includes(cleanTarget);

  if (cleanReplacement && !matchedRep && matchedTar) {
    console.log(`\n⚠️ Missing Edit #${editNum}: ${description}`);
    
    // Find the matching JSON file in scratch by description
    const matchFile = scratchFiles.find(f => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
        const fileDesc = (data.Description || '').replace(/"/g, '').trim();
        return fileDesc === description;
      } catch (e) {
        return false;
      }
    });

    if (matchFile) {
      console.log(`  Found matching JSON file: ${matchFile}`);
      try {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, matchFile), 'utf8'));
        if (data.ReplacementChunks) {
          // It's a multi_replace_file_content
          let chunks = data.ReplacementChunks;
          if (typeof chunks === 'string') chunks = JSON.parse(chunks);
          
          console.log(`  Applying ${chunks.length} multi-replace chunks...`);
          let modifiedContent = fileContent;
          let successCount = 0;
          
          chunks.forEach((chunk, ci) => {
            const t = cleanContent(chunk.TargetContent);
            const r = cleanContent(chunk.ReplacementContent);
            if (modifiedContent.includes(t)) {
              modifiedContent = modifiedContent.replace(t, r);
              successCount++;
            } else {
              console.log(`    ❌ Chunk #${ci + 1} target content not found in file!`);
            }
          });
          
          if (successCount > 0) {
            fs.writeFileSync(absolutePath, modifiedContent, 'utf8');
            console.log(`  ✅ Successfully applied ${successCount}/${chunks.length} chunks to ${path.basename(absolutePath)}!`);
          }
        } else {
          // It's a single replace_file_content
          const t = cleanContent(data.TargetContent || cleanTarget);
          const r = cleanContent(data.ReplacementContent || cleanReplacement);
          
          if (fileContent.includes(t)) {
            const modifiedContent = fileContent.replace(t, r);
            fs.writeFileSync(absolutePath, modifiedContent, 'utf8');
            console.log(`  ✅ Successfully applied single replacement to ${path.basename(absolutePath)}!`);
          } else {
            console.log(`  ❌ Target content not found in file!`);
          }
        }
      } catch (err) {
        console.log(`  Error applying fix: ${err.message}`);
      }
    } else {
      console.log(`  No matching JSON file found in scratch directory.`);
    }
  }
});
