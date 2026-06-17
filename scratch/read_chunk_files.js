const fs = require('fs');
const glob = require('fs').readdirSync('scratch');

const chunkFiles = glob.filter(f => f.startsWith('chunk_step_') && f.endsWith('.txt'));
console.log("Found chunk files:", chunkFiles);

chunkFiles.forEach(file => {
    const filePath = `scratch/${file}`;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    console.log(`File: ${file}`);
    console.log(`  Lines count: ${lines.length}`);
    console.log(`  First 3 lines: ${lines.slice(0, 3).join(' | ').trim()}`);
    console.log(`  Last 3 lines: ${lines.slice(-3).join(' | ').trim()}`);
    
    // Check if MenuSubTab, KotSubTab or BillingSubTab declarations exist
    if (content.includes('fun MenuSubTab(')) {
        console.log(`  -> Declares MenuSubTab!`);
    }
    if (content.includes('fun KotSubTab(')) {
        console.log(`  -> Declares KotSubTab!`);
    }
    if (content.includes('fun BillingSubTab(')) {
        console.log(`  -> Declares BillingSubTab!`);
    }
});
