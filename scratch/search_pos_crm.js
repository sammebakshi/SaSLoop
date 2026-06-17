const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const queries = ['Add Customer', 'Loyalty Points', 'Dues', 'Prepayment', 'Customer Balance'];
queries.forEach(q => {
    console.log(`--- Matches for "${q}" ---`);
    lines.forEach((line, index) => {
        if (index > 5000 && line.toLowerCase().includes(q.toLowerCase())) {
            console.log(`Line ${index + 1}: ${line.trim()}`);
        }
    });
});
