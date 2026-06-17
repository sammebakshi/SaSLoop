const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function scan() {
    if (!fs.existsSync(logPath)) {
        console.log("Log path doesn't exist");
        return;
    }
    
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        if (line.includes('BillingScreen.kt') && line.includes('VIEW_FILE')) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.type === 'VIEW_FILE' && parsed.status === 'DONE') {
                    const content = parsed.content || '';
                    const totalMatch = content.match(/Total Lines: (\d+)/);
                    const totalLines = totalMatch ? parseInt(totalMatch[1]) : 0;
                    
                    if (totalLines === 4402) {
                        console.log(`\nLine ${lineNum} (Step ${parsed.step_index}):`);
                        if (parsed.tool_calls) {
                            console.log("Tool Calls:", JSON.stringify(parsed.tool_calls));
                        }
                        console.log(`Snippet: ${content.slice(0, 300)}`);
                    }
                }
            } catch (e) {}
        }
    }
    console.log("Scan finished.");
}

scan();
