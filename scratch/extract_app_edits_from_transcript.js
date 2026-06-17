const fs = require('fs');
const path = require('path');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(transcriptPath)) {
  console.log('Transcript file does not exist at:', transcriptPath);
  process.exit(1);
}

console.log('Parsing transcript...');

const rl = readline.createInterface({
  input: fs.createReadStream(transcriptPath),
  crlfDelay: Infinity
});

let stepCount = 0;
const appEdits = [];

rl.on('line', (line) => {
  stepCount++;
  try {
    const obj = JSON.parse(line);
    // Look for tool calls in the step
    if (obj.tool_calls && Array.isArray(obj.tool_calls)) {
      obj.tool_calls.forEach((tc, tcIndex) => {
        const name = tc.name || tc.toolName;
        const args = tc.args || tc.arguments || {};
        
        // We care about write_to_file, replace_file_content, multi_replace_file_content
        const isEditTool = ['write_to_file', 'replace_file_content', 'multi_replace_file_content', 'default_api:write_to_file', 'default_api:replace_file_content', 'default_api:multi_replace_file_content'].includes(name);
        
        if (isEditTool) {
          const targetFile = args.TargetFile || '';
          if (targetFile.includes('App.jsx')) {
            appEdits.push({
              stepIndex: obj.step_index || stepCount,
              toolName: name,
              description: args.Description || '',
              instruction: args.Instruction || '',
              args: args,
              timestamp: obj.timestamp || ''
            });
          }
        }
      });
    }
  } catch (e) {
    // ignore parse errors for corrupt lines
  }
});

rl.on('close', () => {
  console.log(`\nParsed ${stepCount} steps.`);
  console.log(`Found ${appEdits.length} edits to App.jsx.`);
  
  // Group or display summary of edits
  appEdits.forEach((edit, index) => {
    console.log(`\n========================================`);
    console.log(`Edit #${index + 1} - Step ${edit.stepIndex} - Tool: ${edit.toolName}`);
    console.log(`Timestamp: ${edit.timestamp}`);
    console.log(`Description: "${edit.description}"`);
    console.log(`Instruction: "${edit.instruction}"`);
    
    // Check if it was a replace_file_content or write_to_file
    if (edit.toolName.includes('write_to_file')) {
      console.log(`  [write_to_file] Content length: ${edit.args.CodeContent ? edit.args.CodeContent.length : 0}`);
    } else if (edit.toolName.includes('replace_file_content')) {
      console.log(`  [replace_file_content] Target length: ${edit.args.TargetContent ? edit.args.TargetContent.length : 0}`);
      console.log(`  [replace_file_content] Replacement length: ${edit.args.ReplacementContent ? edit.args.ReplacementContent.length : 0}`);
    } else if (edit.toolName.includes('multi_replace_file_content')) {
      const chunks = edit.args.ReplacementChunks || [];
      console.log(`  [multi_replace_file_content] Chunks count: ${chunks.length}`);
      chunks.forEach((c, ci) => {
        console.log(`    Chunk #${ci + 1} lines ${c.StartLine}-${c.EndLine}:`);
        console.log(`      Target length: ${c.TargetContent ? c.TargetContent.length : 0}`);
        console.log(`      Replacement length: ${c.ReplacementContent ? c.ReplacementContent.length : 0}`);
      });
    }
  });

  // Save the list of edits to scratch for detailed reference
  fs.writeFileSync(path.join(__dirname, 'all_app_edits_from_transcript.json'), JSON.stringify(appEdits, null, 2), 'utf8');
  console.log(`\nDetailed edits saved to scratch/all_app_edits_from_transcript.json`);
});
