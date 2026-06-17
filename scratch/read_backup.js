const fs = require('fs');
const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\tasks\\task-3740.log';
try {
    if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf8');
        console.log("Found task-3740.log! Content:");
        console.log(content);
    } else {
        console.log("task-3740.log does not exist");
    }
} catch (e) {
    console.error(e.message);
}
