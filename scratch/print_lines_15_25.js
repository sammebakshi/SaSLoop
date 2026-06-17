const { execSync } = require('child_process');

try {
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    
    const lines = indexContent.split('\n');
    console.log("Lines 15 to 25:");
    for (let i = 14; i < 25; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
} catch (e) {
    console.error("Error:", e.message);
}
