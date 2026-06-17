const fs = require('fs');
const path = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';
try {
    const stats = fs.statSync(path);
    console.log(`Log file exists! Size: ${stats.size} bytes`);
} catch (e) {
    console.error("Error accessing log file:", e.message);
}
