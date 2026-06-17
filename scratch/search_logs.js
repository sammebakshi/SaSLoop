const fs = require('fs');
const readline = require('readline');

const logPath = 'C:/Users/Sajad/.gemini/antigravity-ide/brain/a9c9d4d4-89c8-41c4-936e-e1a3f7a2ab0c/.system_generated/logs/transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    try {
        const data = JSON.parse(line);
        if (data.type === 'USER_INPUT' && data.content.toLowerCase().includes('told')) {
            console.log(`Step ${data.step_index}: USER: ${data.content}`);
        }
    } catch (e) {
        // ignore
    }
});
