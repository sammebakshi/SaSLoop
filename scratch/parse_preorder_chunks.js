const fs = require('fs');

function cleanJsonString(str) {
    let result = '';
    let inString = false;
    let escape = false;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '"' && !escape) {
            inString = !inString;
            result += char;
        } else if (char === '\\' && inString) {
            escape = !escape;
            result += char;
        } else if (inString && (char === '\n' || char === '\r')) {
            if (char === '\n') {
                result += '\\n';
            } else if (char === '\r') {
                result += '\\r';
            }
            escape = false;
        } else {
            result += char;
            escape = false;
        }
    }
    return result;
}

try {
    const raw = fs.readFileSync('scratch/chunks_3990.json', 'utf8');
    const cleaned = cleanJsonString(raw);
    fs.writeFileSync('scratch/chunks_3990_cleaned.json', cleaned, 'utf8');
    const chunks = JSON.parse(cleaned);
    console.log("Successfully cleaned and parsed chunks. Count:", chunks.length);
    chunks.forEach((chunk, i) => {
        console.log(`Chunk ${i+1}: StartLine=${chunk.StartLine}, EndLine=${chunk.EndLine}, TargetLength=${chunk.TargetContent?.length}, ReplacementLength=${chunk.ReplacementContent?.length}`);
        if (chunk.ReplacementContent && chunk.ReplacementContent.includes('fun MenuSubTab')) {
            console.log(`  -> Chunk ${i+1} has MenuSubTab!`);
            fs.writeFileSync(`scratch/extracted_MenuSubTab.txt`, chunk.ReplacementContent, 'utf8');
        }
        if (chunk.ReplacementContent && chunk.ReplacementContent.includes('fun KotSubTab')) {
            console.log(`  -> Chunk ${i+1} has KotSubTab!`);
            fs.writeFileSync(`scratch/extracted_KotSubTab.txt`, chunk.ReplacementContent, 'utf8');
        }
        if (chunk.ReplacementContent && chunk.ReplacementContent.includes('fun BillingSubTab')) {
            console.log(`  -> Chunk ${i+1} has BillingSubTab!`);
            fs.writeFileSync(`scratch/extracted_BillingSubTab.txt`, chunk.ReplacementContent, 'utf8');
        }
    });
} catch (e) {
    console.error("Failed to clean/parse JSON:", e);
}
