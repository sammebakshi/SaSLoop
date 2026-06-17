const { execSync } = require('child_process');

try {
    const content = execSync('git show 50cc67d:pos-app/src/App.jsx', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    console.log("File size in 50cc67d:", content.length);
    console.log("Lines in 50cc67d:", content.split('\n').length);
} catch (e) {
    console.error("Failed:", e.message);
}
