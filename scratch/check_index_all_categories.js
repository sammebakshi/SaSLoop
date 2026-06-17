const { execSync } = require('child_process');

try {
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    
    console.log("getAllowedCategories in index:", indexContent.includes('getAllowedCategories'));
    console.log("getAllowedDepartments in index:", indexContent.includes('getAllowedDepartments'));
} catch (e) {
    console.error("Error:", e.message);
}
