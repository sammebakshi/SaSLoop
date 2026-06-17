const { execSync } = require('child_process');

try {
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    
    const lines = indexContent.split('\n');
    console.log("Lines 4060 to 4072:");
    for (let i = 4059; i < 4072; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
} catch (e) {
    console.error("Error:", e.message);
}
