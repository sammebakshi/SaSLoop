const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
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
                    const rangeMatch = content.match(/Showing lines (\d+) to (\d+)/);
                    const totalLines = totalMatch ? totalMatch[1] : 'unknown';
                    const rangeStr = rangeMatch ? `${rangeMatch[1]}-${rangeMatch[2]}` : 'unknown';
                    console.log(`Step ${parsed.step_index}: TotalLines=${totalLines}, Range=${rangeStr}`);
                    if (parsed.step_index > 1000) {
                        break;
                    }
                }
            } catch (e) {}
        }
    }
}

main();
