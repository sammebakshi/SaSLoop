const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);
const candidates = [];

for (const file of files) {
    if (file.includes('dial') && (file.endsWith('.jsx') || file.endsWith('.txt'))) {
        const filePath = path.join(__dirname, file);
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('TransitionSplashScreen')) {
            const hasTruncated = content.includes('truncated');
            candidates.push({
                name: file,
                length: content.length,
                hasTruncated: hasTruncated,
                preview: content.substring(0, 100)
            });
        }
    }
}

candidates.sort((a, b) => b.length - a.length);
console.log('Candidates found:');
candidates.forEach(c => {
    console.log(`- Name: ${c.name}, Length: ${c.length}, Has "truncated": ${c.hasTruncated}`);
});
