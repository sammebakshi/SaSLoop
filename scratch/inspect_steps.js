const fs = require('fs');

function inspect(filename) {
    if (!fs.existsSync(filename)) {
        console.log(`${filename} does not exist.`);
        return;
    }
    const raw = fs.readFileSync(filename, 'utf8');
    const parsed = JSON.parse(raw);
    console.log(`=== Inspecting ${filename} ===`);
    console.log(`Step: ${parsed.step_index}, Type: ${parsed.type}`);
    if (parsed.tool_calls) {
        console.log(`Tool calls count: ${parsed.tool_calls.length}`);
        parsed.tool_calls.forEach((tc, idx) => {
            console.log(`Tool Call ${idx + 1}: name=${tc.name}`);
            if (tc.args && tc.args.TargetFile) {
                console.log(`  TargetFile: ${tc.args.TargetFile}`);
            }
            if (tc.name === 'multi_replace_file_content' || tc.name === 'replace_file_content') {
                const chunks = tc.args.ReplacementChunks || [tc.args];
                console.log(`  Chunks: ${chunks.length}`);
                chunks.forEach((c, cIdx) => {
                    const content = c.ReplacementContent || '';
                    console.log(`    Chunk ${cIdx + 1}: StartLine=${c.StartLine}, EndLine=${c.EndLine}, length=${content.length}`);
                    if (content.includes('fun MenuSubTab')) {
                        console.log(`      -> Declares fun MenuSubTab!`);
                    }
                    if (content.includes('MenuSubTab(')) {
                        console.log(`      -> References MenuSubTab!`);
                    }
                });
            }
        });
    }
}

inspect('scratch/step_3317_full.json');
inspect('scratch/step_3318_full.json');
inspect('scratch/step_3454_full.json');
