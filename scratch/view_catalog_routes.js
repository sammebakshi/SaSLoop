const fs = require('fs');
const content = fs.readFileSync('routes/catalogRoutes.js', 'utf8');
console.log(content.substring(3000));
