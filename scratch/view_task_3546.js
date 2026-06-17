const fs = require('fs');
const path = require('path');
const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\tasks\\task-3546.log';

if (fs.existsSync(logPath)) {
    const content = fs.readFileSync(logPath, 'utf8');
    console.log('Total length:', content.length);
    console.log('First 1000 characters:');
    console.log(content.slice(0, 1000));
} else {
    console.log('File does not exist:', logPath);
}
