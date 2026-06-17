const fs = require('fs');
const readline = require('readline');

const logFilePath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function extract() {
    const fileStream = fs.createReadStream(logFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        if (line.includes('"step_index":3317')) {
            console.log(`Found step 3317 at line ${lineNum}`);
            const parsed = JSON.parse(line);
            const toolCall = parsed.tool_calls.find(tc => tc.name === 'multi_replace_file_content');
            if (toolCall) {
                // In the log, the args object has properties
                const args = toolCall.args;
                // If ReplacementChunks is a string, parse it
                let chunks = args.ReplacementChunks;
                if (typeof chunks === 'string') {
                    chunks = JSON.parse(chunks);
                }
                
                console.log(`Successfully extracted ${chunks.length} chunks.`);
                chunks.forEach((c, idx) => {
                    const filename = `scratch/preorder_chunk_${idx + 1}.txt`;
                    fs.writeFileSync(filename, c.ReplacementContent, 'utf8');
                    console.log(`Wrote chunk ${idx + 1} (lines ${c.StartLine}-${c.EndLine}) to ${filename}`);
                });
            } else {
                console.log('No multi_replace_file_content tool call in this step');
            }
            break;
        }
    }
}

extract();
