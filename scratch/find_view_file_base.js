const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';
const folder = 'c128cc3f-394c-4d5f-8471-2201f6e29d9e';
const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');

async function find() {
  if (!fs.existsSync(logPath)) {
    console.error("Log not found!");
    return;
  }

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let stepCount = 0;
  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      stepCount++;
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if (tc.name === 'view_file') {
            const file = tc.args.AbsolutePath || tc.args.absolutePath || '';
            if (file.includes('App.jsx') && parsed.step_index < 1000) {
              console.log(`Step ${parsed.step_index}: view_file on App.jsx`);
              console.log("Args:", JSON.stringify(tc.args));
              console.log("Response fields:", Object.keys(parsed));
              if (parsed.status) console.log("Status:", parsed.status);
            }
          }
        }
      }
      if ((parsed.type === 'TOOL_RESPONSE' || parsed.source === 'SYSTEM' || parsed.content) && parsed.step_index < 1000) {
        const contentStr = typeof parsed.content === 'string' ? parsed.content : JSON.stringify(parsed.content || '');
        if (contentStr.includes('import React') && contentStr.includes('UniversalPOS')) {
          console.log(`Step ${parsed.step_index}: Found React & UniversalPOS in content (type: ${parsed.type}, source: ${parsed.source}, length: ${contentStr.length})`);
        }
      }
    } catch (e) {}
  }
  console.log(`Scanned ${stepCount} steps.`);
}

find().catch(console.error);
