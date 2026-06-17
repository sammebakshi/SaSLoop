const fs = require('fs');
const readline = require('readline');

const logFilePath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function extract() {
    const fileStream = fs.createReadStream(logFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes('"step_index":3317')) {
            console.log("Found step 3317");
            const parsed = JSON.parse(line);
            const toolCall = parsed.tool_calls.find(tc => tc.name === 'multi_replace_file_content');
            if (toolCall) {
                const chunksStr = toolCall.args.ReplacementChunks;
                // Escape control characters in the JSON string
                // Let's replace any literal newlines inside the string
                let cleanStr = chunksStr.replace(/[\r\n]/g, function(match) {
                    return match === '\n' ? '\\n' : '\\r';
                });
                
                // Wait! If there are already escaped backslashes, we have to be careful.
                // Let's print the length of chunksStr
                console.log(`Original string length: ${chunksStr.length}`);
                
                // Let's try to parse the chunks string
                let chunks;
                try {
                    chunks = JSON.parse(chunksStr);
                } catch (e) {
                    console.log("Normal JSON.parse failed. Retrying with escaped string...");
                    try {
                        // Let's escape only unescaped newlines
                        // A common way is to escape backslashes first, but they are already escaped as \\ in JSON.
                        // Wait, let's write chunksStr directly to a file and see what it contains!
                        fs.writeFileSync('scratch/raw_chunks_str.txt', chunksStr, 'utf8');
                        console.log("Wrote raw chunks string to scratch/raw_chunks_str.txt");
                        
                        // Let's parse it using a custom javascript evaluator!
                        // Since it's a valid Javascript array literal if we wrap it in parentheses and eval it (safely)!
                        const evalFunc = new Function(`return ${chunksStr};`);
                        chunks = evalFunc();
                        console.log("Successfully parsed using Function evaluator!");
                    } catch (e2) {
                        console.error("Function evaluator failed too:", e2.message);
                    }
                }
                
                if (chunks) {
                    console.log(`Successfully parsed ${chunks.length} chunks.`);
                    chunks.forEach((c, idx) => {
                        const filename = `scratch/preorder_chunk_${idx + 1}.txt`;
                        fs.writeFileSync(filename, c.ReplacementContent, 'utf8');
                        console.log(`Wrote chunk ${idx + 1} (lines ${c.StartLine}-${c.EndLine}) to ${filename}`);
                    });
                }
            }
            break;
        }
    }
}

extract();
