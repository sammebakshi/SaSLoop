const fs = require('fs');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

const content = fs.readFileSync(logPath, 'utf8').trim().split('\n');
console.log(`Total lines: ${content.length}`);
for (let i = 1; i <= 5; i++) {
    const line = content[content.length - i];
    try {
        const parsed = JSON.parse(line);
        console.log(`Line from end ${i}: Step ${parsed.step_index} [${parsed.type}] (${parsed.status})`);
        if (parsed.content) {
            console.log(`  Content snippet: ${parsed.content.substring(0, 200)}`);
        }
        if (parsed.tool_calls) {
            console.log(`  Tool Calls:`, parsed.tool_calls.map(tc => tc.name));
        }
    } catch (e) {
        console.log(`Line from end ${i} is not valid JSON:`, line.substring(0, 100));
    }
}
