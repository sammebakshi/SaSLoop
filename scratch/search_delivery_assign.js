const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../routes/deliveryRoutes.js');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(content);
} catch (err) {
  console.error(err);
}
