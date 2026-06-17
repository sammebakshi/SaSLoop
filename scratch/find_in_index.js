const { execSync } = require('child_process');

try {
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    
    console.log("checkPosAccess in index:", indexContent.includes('checkPosAccess'));
    // print any lines containing checkPosAccess
    const lines = indexContent.split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('checkPosAccess')) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
        }
    });
} catch (e) {
    console.error("Error:", e.message);
}
