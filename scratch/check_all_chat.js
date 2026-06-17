const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let stepCount = 0;
rl.on('line', (line) => {
    stepCount++;
    if (line.includes('fun MenuSubTab(') || line.includes('fun KotSubTab(') || line.includes('fun BillingSubTab(')) {
        try {
            const data = JSON.parse(line);
            console.log(`Line ${stepCount}: Step ${data.step_index} [${data.type || ''}] [${data.source || ''}]:`);
            
            // Check if it's in content
            if (data.content && (data.content.includes('fun MenuSubTab') || data.content.includes('fun KotSubTab') || data.content.includes('fun BillingSubTab'))) {
                console.log(`  -> Found in content! Length: ${data.content.length}`);
                fs.writeFileSync(`scratch/chat_content_step_${data.step_index}.txt`, data.content, 'utf8');
                console.log(`  Wrote content to scratch/chat_content_step_${data.step_index}.txt`);
            }
            
            // Check if it's in tool calls
            if (data.tool_calls) {
                data.tool_calls.forEach((tc, idx) => {
                    const argStr = JSON.stringify(tc.args);
                    if (argStr.includes('fun MenuSubTab') || argStr.includes('fun KotSubTab') || argStr.includes('fun BillingSubTab')) {
                        console.log(`  -> Found in tool call ${tc.name}!`);
                    }
                });
            }
        } catch (e) {
            // ignore
        }
    }
});
