const fs = require('fs');
const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\5b1f6df8-6da8-4b0b-9562-4d541d53ecb6\\.system_generated\\tasks\\task-2319.log';

if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    console.log("Found total lines:", lines.length);
    console.log("First 60 lines:");
    console.log(lines.slice(0, 60).join('\n'));
} else {
    console.log("Log file not found");
}
