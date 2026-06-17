const fs = require('fs');
const path = require('path');

const targetFileArg = process.argv[2];
const query = process.argv[3];

if (!targetFileArg || !query) {
    console.error('Usage: node search_app.js <relative_file_path> <query_string>');
    process.exit(1);
}

const filePath = path.resolve(__dirname, '..', targetFileArg);
if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

console.log(`Searching for "${query}" in ${filePath}...`);

let matches = 0;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(query.toLowerCase())) {
        console.log(`${i + 1}: ${lines[i].trim().substring(0, 150)}`);
        matches++;
        if (matches >= 100) {
            console.log('Too many matches, truncating...');
            break;
        }
    }
}
console.log(`Found ${matches} matches.`);
