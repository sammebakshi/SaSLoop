const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function scan() {
    const folders = fs.readdirSync(brainDir);
    console.log(`Scanning ${folders.length} folders...`);
    
    for (const folder of folders) {
        const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        if (!fs.existsSync(logPath)) continue;
        
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
                        
                        const toolCalls = parsed.tool_calls || [];
                        let rangeStr = '';
                        if (parsed.tool_call) { // System log format might differ
                            const tc = parsed.tool_call;
                            rangeStr = `Lines ${tc.args?.StartLine} - ${tc.args?.EndLine}`;
                        } else if (toolCalls.length > 0) {
                            rangeStr = `Lines ${toolCalls[0].args?.StartLine} - ${toolCalls[0].args?.EndLine}`;
                        }
                        
                        console.log(`VIEW in ${folder} (line ${lineNum}): Total lines in file: ${totalLines}. Range: ${rangeStr}`);
                    }
                } catch (e) {}
            }
        }
    }
    console.log("Scan finished.");
}

scan();
