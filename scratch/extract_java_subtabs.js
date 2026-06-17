const fs = require('fs');
const readline = require('readline');

async function search() {
    const fileStream = fs.createReadStream('scratch/decompiled_BillingScreenKt.java');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    const matches = [];
    for await (const line of rl) {
        lineNum++;
        if (line.includes('"MENU"') || line.includes('"KOT"') || line.includes('"BILLING"')) {
            console.log(`Line ${lineNum}: ${line.trim()}`);
        }
    }
}

search();
