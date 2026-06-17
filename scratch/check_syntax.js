const fs = require('fs');
const parser = require('@babel/parser');

try {
    const code = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/SalesReport.jsx', 'utf8');
    parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx']
    });
    console.log("SUCCESS: No syntax errors found!");
} catch (e) {
    console.error("Syntax Error Details:");
    console.error(e.message);
    if (e.loc) {
        console.error(`At line ${e.loc.line}, column ${e.loc.column}`);
        // print lines around it
        const lines = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/SalesReport.jsx', 'utf8').split('\n');
        const start = Math.max(0, e.loc.line - 10);
        const end = Math.min(lines.length, e.loc.line + 10);
        for (let i = start; i < end; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
}
