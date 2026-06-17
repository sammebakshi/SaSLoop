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
    try {
        const data = JSON.parse(line);
        if (data.step_index >= 3167 && data.step_index <= 3175) {
            console.log(`Line ${stepCount}: Step ${data.step_index} [${data.type || ''}] [${data.source || ''}]`);
            if (data.content) {
                console.log(`  -> Content length: ${data.content.length}`);
                const isTruncated = data.content.includes('truncated') || data.content.includes('NOT show the entire file contents');
                console.log(`  -> Is truncated text inside: ${isTruncated}`);
                fs.writeFileSync(`scratch/step_${data.step_index}_output.txt`, data.content, 'utf8');
                console.log(`  -> Wrote to scratch/step_${data.step_index}_output.txt`);
            }
        }
    } catch (e) {
        // ignore
    }
});
