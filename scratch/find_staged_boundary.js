const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function findBoundary() {
    // 1. Get index content
    console.log("Loading index App.jsx...");
    const indexContent = execSync('git show :pos-app/src/App.jsx', { 
        cwd: projectDir, 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    }).replace(/\r\n/g, '\n');

    // 2. Scan all transcripts for edits
    console.log("Scanning transcripts...");
    const folders = fs.readdirSync(brainDir);
    const edits = [];

    for (const folder of folders) {
        const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        if (fs.existsSync(logPath)) {
            const fileStream = fs.createReadStream(logPath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            for await (const line of rl) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.tool_calls) {
                        for (const tc of parsed.tool_calls) {
                            if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                                const args = tc.args || {};
                                const file = args.TargetFile || args.targetFile || '';
                                if (file.includes('App.jsx')) {
                                    edits.push({
                                        folder: folder,
                                        step: parsed.step_index,
                                        time: parsed.created_at,
                                        tool: tc.name,
                                        args: args
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {}
            }
        }
    }

    edits.sort((a, b) => new Date(a.time) - new Date(b.time));
    console.log(`Sorted ${edits.length} edits.`);

    // Check each edit's presence in the index version
    let lastStagedIndex = -1;
    for (let i = 0; i < edits.length; i++) {
        const edit = edits[i];
        
        let hasReplacement = false;
        let hasTarget = false;

        if (edit.tool === 'replace_file_content') {
            const target = (edit.args.TargetContent || edit.args.targetContent || '').replace(/\r\n/g, '\n');
            const replacement = (edit.args.ReplacementContent || edit.args.replacementContent || '').replace(/\r\n/g, '\n');
            if (target) {
                hasTarget = indexContent.includes(target);
                hasReplacement = indexContent.includes(replacement);
            }
        } else {
            const chunks = edit.args.ReplacementChunks || edit.args.replacementChunks || [];
            if (chunks.length > 0) {
                // If any chunk's replacement is in index and target is not, we consider it partly staged
                const chunk = chunks[0];
                const target = (chunk.TargetContent || chunk.targetContent || '').replace(/\r\n/g, '\n');
                const replacement = (chunk.ReplacementContent || chunk.replacementContent || '').replace(/\r\n/g, '\n');
                hasTarget = indexContent.includes(target);
                hasReplacement = indexContent.includes(replacement);
            }
        }

        console.log(`[Edit #${i + 1}] Step ${edit.step} (${edit.time}) - Target in index: ${hasTarget}, Replacement in index: ${hasReplacement}`);
        
        if (hasReplacement && !hasTarget) {
            lastStagedIndex = i;
        }
    }

    if (lastStagedIndex !== -1) {
        const boundaryEdit = edits[lastStagedIndex];
        console.log(`\nLast applied edit in index is likely Edit #${lastStagedIndex + 1}: Step ${boundaryEdit.step} in ${boundaryEdit.folder} (${boundaryEdit.time})`);
    } else {
        console.log("\nCould not determine boundary edit.");
    }
}

findBoundary();
