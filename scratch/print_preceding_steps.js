const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(transcriptPath)) {
  console.log('Transcript file does not exist');
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(transcriptPath),
  crlfDelay: Infinity
});

const steps = [];

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    steps.push({
      step: obj.step_index,
      source: obj.source,
      type: obj.type,
      content: obj.content || '',
      tool_calls: obj.tool_calls || []
    });
  } catch (e) {
    // ignore
  }
});

rl.on('close', () => {
  console.log(`Loaded ${steps.length} steps from transcript.`);
  
  // Filter steps in range 5750 to 5900
  const rangeSteps = steps.filter(s => s.step >= 5750 && s.step < 5900);
  console.log(`\n=== STEPS BETWEEN 5750 AND 5900 ===`);
  
  rangeSteps.forEach(s => {
    console.log(`\n----------------------------------------`);
    console.log(`Step ${s.step} - Source: ${s.source} - Type: ${s.type}`);
    
    if (s.content) {
      const displayContent = s.content.length > 300 ? s.content.substring(0, 300) + '...' : s.content;
      console.log(`Content: ${displayContent.replace(/\n/g, ' ')}`);
    }
    
    if (s.tool_calls && s.tool_calls.length > 0) {
      console.log('Tool calls:');
      s.tool_calls.forEach(tc => {
        console.log(`  - ${tc.name || tc.toolName}`);
        const args = tc.args || tc.arguments || {};
        if (args.TargetFile) console.log(`    TargetFile: ${args.TargetFile}`);
        if (args.Description) console.log(`    Description: ${args.Description}`);
        if (args.Instruction) console.log(`    Instruction: ${args.Instruction}`);
        if (args.CommandLine) console.log(`    CommandLine: ${args.CommandLine}`);
      });
    }
  });
});
