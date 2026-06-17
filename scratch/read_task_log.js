const fs = require('fs');
const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\1c6e8f20-aa98-4f94-8e42-a5256dcdb5cb\\.system_generated\\tasks\\task-479.log';
try {
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n');
    console.log(`Log lines count: ${lines.length}`);
    console.log("Last 25 lines of compilation log:");
    console.log(lines.slice(-25).join('\n'));
} catch (e) {
    console.error(e.message);
}
