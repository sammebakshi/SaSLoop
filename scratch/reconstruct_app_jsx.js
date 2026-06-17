const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';
const outputFilePath = path.join(projectDir, 'scratch', 'App_reconstructed.jsx');

// Normalizes line endings to \n
function normalizeContent(str) {
    if (!str) return '';
    return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

async function reconstruct() {
    // 1. Get base content of App.jsx from commit 50cc67d
    console.log("Fetching base App.jsx from commit 50cc67d...");
    let baseContent;
    try {
        baseContent = execSync('git show 50cc67d:pos-app/src/App.jsx', { cwd: projectDir, encoding: 'utf8' });
    } catch (e) {
        console.error("Failed to fetch base App.jsx from git:", e.message);
        return;
    }
    console.log(`Base App.jsx loaded successfully (${baseContent.length} bytes, ~${baseContent.split('\n').length} lines).`);

    // 2. Scan brain directory for all transcripts
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
                            if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
                                const args = tc.args || {};
                                const file = args.TargetFile || args.targetFile || '';
                                const cleanFile = file.replace(/^["']|["']$/g, '');
                                const basename = path.basename(cleanFile);
                                if (basename === 'App.jsx') {
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

    // Sort edits chronologically
    edits.sort((a, b) => new Date(a.time) - new Date(b.time));
    console.log(`Found ${edits.length} total edits to App.jsx across history.`);

    // 3. Sequentially apply edits
    let currentContent = baseContent;
    let successCount = 0;
    let failCount = 0;
    let writeCount = 0;

    for (let i = 0; i < edits.length; i++) {
        const edit = edits[i];
        
        if (edit.tool === 'write_to_file') {
            if (edit.args.CodeContent) {
                currentContent = edit.args.CodeContent;
                // console.log(`[Edit #${i + 1}] Step ${edit.step} (${edit.time}) -> Full write: Replaced content completely (${currentContent.length} bytes)`);
                writeCount++;
                successCount++;
            } else {
                console.log(`[Edit #${i + 1}] Step ${edit.step} (${edit.time}) -> Full write: Warning - No CodeContent in write_to_file!`);
                failCount++;
            }
            continue;
        }

        const chunks = [];
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

        let editSuccess = true;
        for (let j = 0; j < chunks.length; j++) {
            const chunk = chunks[j];
            let target = chunk.target;
            let replacement = chunk.replacement;

            if (!target) {
                // Empty targets sometimes occur in search replacements
                continue;
            }

            // Normal replacement check
            if (currentContent.includes(target)) {
                currentContent = currentContent.replace(target, replacement);
            } else {
                // Try normalizing line endings and see if it matches
                const normContent = normalizeContent(currentContent);
                const normTarget = normalizeContent(target);
                const normReplacement = normalizeContent(replacement);

                if (normContent.includes(normTarget)) {
                    const replacedNorm = normContent.replace(normTarget, normReplacement);
                    const usesCRLF = currentContent.includes('\r\n');
                    currentContent = usesCRLF ? replacedNorm.replace(/\n/g, '\r\n') : replacedNorm;
                } else {
                    console.log(`[Edit #${i + 1} Step ${edit.step} ${edit.time}] Chunk #${j + 1}: WARNING - Target not found!`);
                    console.log(`Target snippet (first 800 chars):`, JSON.stringify(target.slice(0, 800)));
                    editSuccess = false;
                }
            }
        }

        if (editSuccess) {
            successCount++;
        } else {
            failCount++;
        }
    }

    console.log(`\nReconstruction finished.`);
    console.log(`Success: ${successCount}/${edits.length}`);
    console.log(`Failed edits: ${failCount}`);
    console.log(`Full writes: ${writeCount}`);

    // 4. Save to temporary output file
    fs.writeFileSync(outputFilePath, currentContent, 'utf8');
    console.log(`Saved reconstructed App.jsx to ${outputFilePath} (${currentContent.length} bytes).`);
}

reconstruct();
