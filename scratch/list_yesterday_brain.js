const fs = require('fs');
const path = require('path');

const yesterdayBrain = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\c128cc3f-394c-4d5f-8471-2201f6e29d9e';

function listRec(dir) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const full = path.join(dir, file);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) {
                listRec(full);
            } else {
                console.log(`${full} (${stat.size} bytes)`);
            }
        }
    } catch (e) {}
}

listRec(yesterdayBrain);
