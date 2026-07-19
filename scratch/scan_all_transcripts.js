const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

console.log('Listing recently updated brain directories...');
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

const output = execSync(`powershell -Command "Get-ChildItem -Directory '${brainDir}' | Sort-Object LastWriteTime -Descending | Select-Object -ExpandProperty Name"`).toString();
const folders = output.trim().split('\r\n').map(f => f.trim()).filter(f => f && f !== 'tempmediaStorage' && f !== '31103a4e-822c-4c4b-a7e5-42b34753f329');

console.log(`Found ${folders.length} directories to scan. Starting search...`);

const scanFolder = (folderIndex) => {
  if (folderIndex >= folders.length) {
    console.log('\nAll transcripts scanned.');
    return;
  }
  
  const folder = folders[folderIndex];
  const transcriptPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  
  if (!fs.existsSync(transcriptPath)) {
    scanFolder(folderIndex + 1);
    return;
  }
  
  console.log(`Scanning transcript in folder: ${folder}...`);
  
  const rl = readline.createInterface({
    input: fs.createReadStream(transcriptPath),
    crlfDelay: Infinity
  });
  
  rl.on('line', (line) => {
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls && Array.isArray(obj.tool_calls)) {
        obj.tool_calls.forEach(tc => {
          const isEdit = ['write_to_file', 'replace_file_content', 'multi_replace_file_content', 'default_api:write_to_file', 'default_api:replace_file_content', 'default_api:multi_replace_file_content'].includes(tc.name || tc.toolName);
          const args = tc.args || tc.arguments || {};
          const targetFile = args.TargetFile || '';
          if (isEdit && targetFile.includes('App.jsx')) {
            console.log(`  🌟 FOUND App.jsx edit in folder ${folder} at step ${obj.step_index}!`);
            console.log(`    Tool: ${tc.name || tc.toolName} | Desc: ${args.Description}`);
            
            const outName = `edit_extracted_from_${folder.substring(0, 8)}_step_${obj.step_index}.json`;
            fs.writeFileSync(path.join(__dirname, outName), JSON.stringify(args, null, 2), 'utf8');
            console.log(`    Saved arguments to scratch/${outName}`);
          }
        });
      }
    } catch (e) {}
  });
  
  rl.on('close', () => {
    scanFolder(folderIndex + 1);
  });
};

scanFolder(0);
