const { execSync } = require('child_process');

try {
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    
    const lines = indexContent.split('\n');
    lines.forEach((line, idx) => {
        if (line.toLowerCase().includes('pos_initialized')) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
        }
    });
} catch (e) {
    console.error("Error:", e.message);
}
