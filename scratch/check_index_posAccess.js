const { execSync } = require('child_process');

try {
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    
    console.log("posAccess in index:", indexContent.includes('posAccess'));
    console.log("isModuleAllowed in index:", indexContent.includes('isModuleAllowed'));
} catch (e) {
    console.error("Error:", e.message);
}
