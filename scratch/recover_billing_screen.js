const fs = require('fs');
const readline = require('readline');

const logFilePath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function recover() {
    const fileStream = fs.createReadStream(logFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        if (line.includes('VIEW_FILE') && line.includes('BillingScreen.kt')) {
            try {
                const parsed = JSON.parse(line);
                const content = parsed.content || '';
                if (content.includes('Total Lines: 5164')) {
                    console.log(`Line ${lineNum} (Step ${parsed.step_index}):`);
                    console.log(content.split('\n').slice(0, 15).join('\n'));
                    console.log('==================================================');
                    
                    // Let's write this chunk of content to a separate file so we can view it
                    fs.writeFileSync(`scratch/chunk_step_${parsed.step_index}.txt`, content, 'utf8');
                }
            } catch (e) {
                // ignore
            }
        }
    }
}

recover();
