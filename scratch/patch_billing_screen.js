const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'sasloop-android', 'app', 'src', 'main', 'java', 'com', 'example', 'sasloopmanager', 'ui', 'BillingScreen.kt');
let content = fs.readFileSync(filePath, 'utf8');

if (content.includes('"Base Price"')) {
    content = content.replace('"Base Price"', '"Sale Price 1"');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully replaced Base Price with Sale Price 1!');
} else {
    console.error('Base Price string not found!');
}
