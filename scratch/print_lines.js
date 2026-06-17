const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sasloop-android', 'app', 'src', 'main', 'java', 'com', 'example', 'sasloopmanager', 'ui', 'BillingScreen.kt');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
for (let i = 795; i <= 815; i++) {
    console.log(`${i}: ${JSON.stringify(lines[i])}`);
}
