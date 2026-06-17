const fs = require('fs');

const files = [
    'scratch/edit_transcript_step_1004_tc_0.json',
    'scratch/edit_transcript_step_3317_tc_0.json',
    'scratch/edit_transcript_step_3453_tc_0.json'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        const data = JSON.parse(fs.readFileSync(f, 'utf8'));
        console.log(`========================================`);
        console.log(`File: ${f}`);
        console.log(`Step: ${data.step_index}`);
        console.log(`Tool: ${data.tool}`);
        console.log(`Description: ${data.description}`);
        console.log(`Instruction: ${data.instruction}`);
        if (typeof data.chunks === 'string') {
            console.log(`Chunks length: ${data.chunks.length}`);
            try {
                // If it is a JSON string containing chunks, try parsing it
                const parsedChunks = JSON.parse(data.chunks);
                console.log(`Parsed chunks count: ${parsedChunks.length}`);
                parsedChunks.forEach((c, idx) => {
                    console.log(`  Chunk ${idx+1}: StartLine=${c.StartLine}, EndLine=${c.EndLine}`);
                    console.log(`    TargetContent length: ${c.TargetContent ? c.TargetContent.length : 0}`);
                    console.log(`    ReplacementContent length: ${c.ReplacementContent ? c.ReplacementContent.length : 0}`);
                });
            } catch (e) {
                console.log(`Failed parsing chunks: ${e.message}`);
                console.log(`Snippet of chunks: ${data.chunks.slice(0, 500)}...`);
            }
        } else if (Array.isArray(data.chunks)) {
            console.log(`Chunks count: ${data.chunks.length}`);
        } else {
            console.log(`Chunks type: ${typeof data.chunks}`);
        }
    } else {
        console.log(`File not found: ${f}`);
    }
});
