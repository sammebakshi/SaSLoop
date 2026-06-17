const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl';

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
                    
                    if (totalLines === 3091) {
                        const toolCalls = parsed.tool_calls || [];
                        let rangeStr = '';
                        if (parsed.tool_call) {
                            const tc = parsed.tool_call;
                            rangeStr = `Lines ${tc.args?.StartLine} - ${tc.args?.EndLine}`;
                        } else if (toolCalls.length > 0) {
                            rangeStr = `Lines ${toolCalls[0].args?.StartLine} - ${toolCalls[0].args?.EndLine}`;
                        }
                        console.log(`Line ${lineNum} (Step ${parsed.step_index}): Range ${rangeStr} (total ${totalLines})`);
                    }
                }
            } catch (e) {}
        }
    }
    console.log("Scan finished.");
}

scan();
