const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'edit_extracted_from_c128cc3f_step_2291.json');
if (fs.existsSync(filePath)) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log('Description:', data.Description);
  console.log('TargetFile:', data.TargetFile);
  console.log('Chunks count:', data.ReplacementChunks.length);
  
  console.log('Type of ReplacementChunks:', typeof data.ReplacementChunks);
  console.log('Is Array?', Array.isArray(data.ReplacementChunks));
  console.log('Value:', data.ReplacementChunks);
} else {
  console.log('File not found:', filePath);
}
