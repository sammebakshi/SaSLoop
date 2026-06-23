const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Sajad/Desktop/SaSLoop/scratch';
const files = fs.readdirSync(dir).filter(f => f.startsWith('transcript_line_') && f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`${file}: length=${content.length}, contains '<truncated'=${content.includes('<truncated')}`);
  try {
    const data = JSON.parse(content);
    console.log(`  parsed: type=${data.type}, status=${data.status}, tool_calls=${data.tool_calls ? data.tool_calls.map(tc => tc.name).join(',') : 'none'}`);
    if (data.tool_calls && data.tool_calls[0] && data.tool_calls[0].args) {
      const args = data.tool_calls[0].args;
      const keys = Object.keys(args);
      console.log(`  args keys: ${keys.join(',')}`);
      if (args.ReplacementContent) {
        console.log(`    ReplacementContent length: ${args.ReplacementContent.length}`);
        if (args.ReplacementContent.length > 2500) {
          fs.writeFileSync(filePath.replace('.json', '_extracted.jsx'), args.ReplacementContent, 'utf8');
          console.log(`    Saved extracted code from ${file}!`);
        }
      }
      if (args.ReplacementChunks) {
        const chunks = typeof args.ReplacementChunks === 'string' ? JSON.parse(args.ReplacementChunks) : args.ReplacementChunks;
        console.log(`    ReplacementChunks count: ${chunks.length}`);
        chunks.forEach((chunk, i) => {
          console.log(`      chunk ${i+1}: replacementContent length: ${chunk.replacementContent ? chunk.replacementContent.length : (chunk.ReplacementContent ? chunk.ReplacementContent.length : 0)}`);
        });
      }
    }
  } catch (e) {
    console.log(`  parse error: ${e.message}`);
  }
});
