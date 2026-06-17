const { execSync } = require('child_process');

try {
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    
    const features = [
        { name: 'pos_initialized_v2', test: indexContent.includes('pos_initialized_v2') },
        { name: 'handleSyncRefresh on auth', test: indexContent.includes('handleSyncRefresh') && indexContent.includes('isAuthenticated') },
        { name: 'SAVED status', test: indexContent.includes('SAVED') },
        { name: 'spinner', test: indexContent.includes('spinner') || indexContent.includes('concentric') },
        { name: 'tables grid button', test: indexContent.includes('LayoutGrid') || indexContent.includes('tables-grid') }
    ];
    
    console.log("=== Checking Features in Staged (Index) App.jsx ===");
    features.forEach(f => {
        console.log(`Feature [${f.name}]: ${f.test ? "FOUND" : "NOT FOUND"}`);
    });
} catch (e) {
    console.error("Error:", e.message);
}
