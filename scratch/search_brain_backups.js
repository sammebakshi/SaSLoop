const fs = require('fs');
const path = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134';
try {
    if (fs.existsSync(path)) {
        console.log("Previous brain folder exists!");
        const files = fs.readdirSync(path);
        console.log("Files inside it:", files);
        
        // Let's search recursively for any .kt or backup files
        function scanDir(dir) {
            const list = fs.readdirSync(dir);
            list.forEach(file => {
                const fullPath = fs.realpathSync(dir + '/' + file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    if (file !== '.system_generated') {
                        scanDir(fullPath);
                    }
                } else {
                    if (file.includes('BillingScreen') || file.endsWith('.kt') || file.endsWith('.txt') || file.endsWith('.md')) {
                        console.log(`Found file: ${fullPath} (${stat.size} bytes)`);
                    }
                }
            });
        }
        scanDir(path);
    } else {
        console.log("Previous brain folder does not exist at " + path);
    }
} catch (e) {
    console.error("Error accessing previous brain folder:", e.message);
}
