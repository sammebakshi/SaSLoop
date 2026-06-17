const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

function printRange(start, end) {
    console.log(`--- Lines ${start} to ${end} ---`);
    for (let i = start - 1; i < end; i++) {
        if (lines[i] !== undefined) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
}

printRange(10551, 10700);
