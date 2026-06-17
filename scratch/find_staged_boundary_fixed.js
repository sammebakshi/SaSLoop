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
        
        let chunks = [];
        if (edit.tool === 'replace_file_content') {
            chunks.push({
                target: edit.args.TargetContent || edit.args.targetContent,
                replacement: edit.args.ReplacementContent || edit.args.replacementContent
            });
        } else {
            let chunksList = edit.args.ReplacementChunks || edit.args.replacementChunks || [];
            if (typeof chunksList === 'string') {
                try {
                    chunksList = JSON.parse(chunksList);
                } catch (e) {
                    chunksList = [];
                }
            }
            chunksList.forEach(c => {
                chunks.push({
                    target: c.TargetContent || c.targetContent,
                    replacement: c.ReplacementContent || c.replacementContent
                });
            });
        }

        if (chunks.length === 0) {
            console.log(`[Edit #${i + 1}] Step ${edit.step} (${edit.time}) - No chunks found`);
            continue;
        }

        // We'll check if the replacements are in the index
        let allReplacementsPresent = true;
        let allTargetsAbsent = true;

        for (const chunk of chunks) {
            const target = (chunk.target || '').replace(/\r\n/g, '\n');
            const replacement = (chunk.replacement || '').replace(/\r\n/g, '\n');
            if (target && replacement) {
                const targetInIndex = indexContent.includes(target);
                const replacementInIndex = indexContent.includes(replacement);
                if (!replacementInIndex) {
                    allReplacementsPresent = false;
                }
                if (targetInIndex && target !== replacement) {
                    // target might be substring of replacement, so check if it's there as a separate occurrence
                    const occurrencesTarget = indexContent.split(target).length - 1;
                    const occurrencesReplacement = indexContent.split(replacement).length - 1;
                    if (occurrencesTarget > occurrencesReplacement) {
                        allTargetsAbsent = false;
                    }
                }
            }
        }

        console.log(`[Edit #${i + 1}] Step ${edit.step} (${edit.time}) - Applied: ${allReplacementsPresent && allTargetsAbsent}, ReplacementsPresent: ${allReplacementsPresent}, TargetsAbsent: ${allTargetsAbsent}`);
        
        if (allReplacementsPresent && allTargetsAbsent) {
            lastStagedIndex = i;
        }
    }

    if (lastStagedIndex !== -1) {
        const boundaryEdit = edits[lastStagedIndex];
        console.log(`\nLast applied edit in index is likely Edit #${lastStagedIndex + 1}: Step ${boundaryEdit.step} in ${boundaryEdit.folder} (${boundaryEdit.time})`);
        console.log(`The edits starting from Edit #${lastStagedIndex + 2} (or boundary index ${lastStagedIndex + 1}) need to be applied to index to reach latest!`);
    } else {
        console.log("\nCould not determine boundary edit.");
    }
}

findBoundary();
