const fs = require('fs');

if (!fs.existsSync('pos-app/build_error.txt')) {
  console.log('pos-app/build_error.txt not found');
  process.exit(0);
}

const errorText = fs.readFileSync('pos-app/build_error.txt', 'utf8');
const lines = errorText.split('\n');

console.log('=== CLEANED BUILD ERRORS ===');
lines.forEach((line, index) => {
  // If the line contains "Error:" or "src/App.jsx" or line indicators
  if (line.includes('Error:') || line.includes('src/App.jsx') || line.includes('Help:') || line.includes('╭─') || line.includes('│') || line.includes('╰─') || line.includes('──────╯')) {
    console.log(`${index + 1}: ${line.trim().substring(0, 150)}`);
  } else if (line.trim().match(/^\d+\s*│/)) {
    // This matches line numbers in the code frame
    console.log(`${index + 1}: ${line.trim().substring(0, 150)}`);
  }
});
console.log('============================');
