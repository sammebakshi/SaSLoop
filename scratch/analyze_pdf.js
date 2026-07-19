const fs = require('fs');
const filePath = "C:\\Users\\Sajad\\Downloads\\New folder (4)\\receipt samp.pdf";
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('Has Images:', content.includes('/Image'));
  console.log('Has Fonts:', content.includes('/Font'));
  console.log('Objects count:', (content.match(/\d+\s+\d+\s+obj/g) || []).length);
}
