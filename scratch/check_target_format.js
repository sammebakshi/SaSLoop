const fs = require('fs');
const path = require('path');

const folder = 'c128cc3f-394c-4d5f-8471-2201f6e29d9e';
const logPath = path.join('C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain', folder, '.system_generated', 'logs', 'transcript.jsonl');

function check() {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line) continue;
    const p = JSON.parse(line);
    if (p.step_index === 1738 && p.tool_calls) {
      p.tool_calls.forEach(tc => {
        const target = tc.args.TargetContent || tc.args.targetContent || '';
        console.log('Type of target:', typeof target);
        console.log('Target starts with quote:', target.startsWith('"'));
        console.log('Target contains actual newline:', target.includes('\n'));
        console.log('Target contains escaped newline:', target.includes('\\n'));
        console.log('Target first 50 chars:', JSON.stringify(target.substring(0, 50)));
        console.log('Target last 50 chars:', JSON.stringify(target.substring(target.length - 50)));
        console.log('Target ends with quote:', target.endsWith('"'));
        console.log('Last character code:', target.charCodeAt(target.length - 1));
        
        // If it starts with quote and contains escaped newlines, let's try to JSON.parse it!
        if (target.startsWith('"')) {
          try {
            const unescaped = JSON.parse(target);
            console.log('Unescaped starts with quote:', unescaped.startsWith('"'));
            console.log('Unescaped contains actual newline:', unescaped.includes('\n'));
            console.log('Unescaped contains escaped newline:', unescaped.includes('\\n'));
            console.log('Unescaped length:', unescaped.length);
          } catch (e) {
            console.log('JSON.parse failed on target:', e.message);
          }
        }
      });
      break;
    }
  }
}

check();
