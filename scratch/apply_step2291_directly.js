const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const editPath = path.join(__dirname, 'edit_extracted_from_c128cc3f_step_2291.json');

if (!fs.existsSync(appPath)) {
  console.log('App.jsx not found');
  process.exit(1);
}
if (!fs.existsSync(editPath)) {
  console.log('edit JSON not found');
  process.exit(1);
}

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

let fileContent = fs.readFileSync(appPath, 'utf8');
const data = JSON.parse(fs.readFileSync(editPath, 'utf8'));

let chunks = data.ReplacementChunks;
if (typeof chunks === 'string') chunks = JSON.parse(chunks);

console.log(`Applying Step 2291 (Quick Bill customization): ${chunks.length} chunks...`);

let successCount = 0;
chunks.forEach((chunk, ci) => {
  const t = cleanContent(chunk.TargetContent);
  const r = cleanContent(chunk.ReplacementContent);
  
  if (fileContent.includes(t)) {
    fileContent = fileContent.replace(t, r);
    successCount++;
  } else {
    console.log(`  ❌ Chunk #${ci + 1} target content not found in App.jsx!`);
    console.log(`    Target start: [${t.substring(0, 100)}]`);
  }
});

if (successCount > 0) {
  fs.writeFileSync(appPath, fileContent, 'utf8');
  console.log(`✅ Successfully applied ${successCount}/${chunks.length} chunks of Step 2291!`);
} else {
  console.log('❌ Failed to apply any chunks.');
}
