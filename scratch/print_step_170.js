const fs = require('fs');
const file = 'scratch/step_170_replacement.kt';
if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    console.log("File length:", content.length);
    console.log("Lines count:", content.split('\n').length);
    console.log("First 300 chars:", content.slice(0, 300));
    console.log("Last 300 chars:", content.slice(-300));
} else {
    console.log("File not found");
}
