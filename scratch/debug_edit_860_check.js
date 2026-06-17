const fs = require('fs');
const { execSync } = require('child_process');

const indexContent = execSync('git show :pos-app/src/App.jsx', { 
    cwd: 'c:\\Users\\Sajad\\Desktop\\SaSLoop', 
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
}).replace(/\r\n/g, '\n');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\5b1f6df8-6da8-4b0b-9562-4d541d53ecb6\\.system_generated\\logs\\transcript.jsonl';

async function debug() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const parsed = JSON.parse(line);
            if (parsed.step_index === 1979) {
                const tc = parsed.tool_calls[0];
                const target = (tc.args.TargetContent || tc.args.targetContent || '').replace(/\r\n/g, '\n');
                const replacement = (tc.args.ReplacementContent || tc.args.replacementContent || '').replace(/\r\n/g, '\n');
                
                console.log("Target in index:", indexContent.includes(target));
                console.log("Replacement in index:", indexContent.includes(replacement));
                console.log("Target length:", target.length);
                console.log("Replacement length:", replacement.length);
            }
        } catch (e) {}
    }
}
debug();
