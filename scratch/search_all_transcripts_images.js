const fs = require('fs');
const readline = require('readline');
const path = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\a9c9d4d4-89c8-41c4-936e-e1a3f7a2ab0c\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(path),
    terminal: false
});

let matches = [];
rl.on('line', (line) => {
    try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
            matches.push(obj);
        }
    } catch (e) {}
});

rl.on('close', () => {
    matches.forEach(m => {
        console.log(`Step ${m.step_index}: content length: ${m.content.length}`);
        if (m.content.includes('<img') || m.content.includes('media__') || m.content.includes('tempmediaStorage')) {
            console.log(`  -> Contains images:`);
            const regex = /(media__\d+|tempmediaStorage\/[^\s]+)/g;
            let match;
            while ((match = regex.exec(m.content)) !== null) {
                console.log(`    * ${match[0]}`);
            }
        }
        console.log(`  -> Content: ${m.content.trim().slice(0, 200)}`);
    });
});
