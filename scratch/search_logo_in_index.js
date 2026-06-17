const { execSync } = require('child_process');

try {
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    
    console.log("logo.png in index:", indexContent.includes('logo.png'));
    console.log("SaSLoopLogo in index:", indexContent.includes('SaSLoopLogo'));
} catch (e) {
    console.error("Error:", e.message);
}
