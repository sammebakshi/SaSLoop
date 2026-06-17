const { execSync } = require('child_process');

try {
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    
    console.log("Splash in index:", indexContent.toLowerCase().includes('splash'));
} catch (e) {
    console.error("Error:", e.message);
}
