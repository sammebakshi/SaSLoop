const fs = require('fs');
try {
    const content = fs.readFileSync('scratch/chunks_3990.json', 'utf8');
    const chunks = JSON.parse(content);
    console.log("Successfully parsed chunks:", chunks.length);
    chunks.forEach((chunk, i) => {
        console.log(`Chunk ${i+1}: StartLine=${chunk.StartLine}, EndLine=${chunk.EndLine}, TargetLength=${chunk.TargetContent?.length}, ReplacementLength=${chunk.ReplacementContent?.length}`);
        if (chunk.ReplacementContent && chunk.ReplacementContent.includes('fun MenuSubTab')) {
            console.log(`  -> Chunk ${i+1} has MenuSubTab!`);
        }
        if (chunk.ReplacementContent && chunk.ReplacementContent.includes('fun KotSubTab')) {
            console.log(`  -> Chunk ${i+1} has KotSubTab!`);
        }
        if (chunk.ReplacementContent && chunk.ReplacementContent.includes('fun BillingSubTab')) {
            console.log(`  -> Chunk ${i+1} has BillingSubTab!`);
        }
    });
} catch (e) {
    console.error("Error parsing chunks:", e);
}
