const fs = require('fs');
const path = require('path');

const localHistoryDir = 'C:\\Users\\Sajad\\AppData\\Local\\Google\\AndroidStudio2025.2.1\\LocalHistory';

if (!fs.existsSync(localHistoryDir)) {
    console.log("Android Studio LocalHistory directory does not exist.");
    process.exit(0);
}

console.log("Scanning Android Studio LocalHistory directory...");

function scan(dir) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            let stat;
            try {
                stat = fs.statSync(fullPath);
            } catch (e) {
                continue;
            }
            if (stat.isDirectory()) {
                scan(fullPath);
            } else {
                try {
                    const fd = fs.openSync(fullPath, 'r');
                    const buffer = Buffer.alloc(1024 * 100); // 100KB buffer to search more thoroughly
                    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
                    fs.closeSync(fd);
                    
                    const content = buffer.toString('utf8', 0, bytesRead);
                    if (content.includes('BillingScreen') || content.includes('sasloopmanager')) {
                        console.log(`Found match in history file: ${fullPath} (size: ${stat.size} bytes)`);
                    }
                } catch (e) {
                    // ignore
                }
            }
        }
    } catch (e) {
        // ignore
    }
}

scan(localHistoryDir);
console.log("LocalHistory scan finished.");
