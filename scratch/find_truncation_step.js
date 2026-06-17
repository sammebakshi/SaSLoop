const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

function normalizeContent(str) {
    if (!str) return '';
    return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

async function findTruncation() {
    let baseContent;
    try {
        baseContent = execSync('git show 50cc67d:pos-app/src/App.jsx', { cwd: projectDir, encoding: 'utf8' });
    } catch (e) {
        console.error("Failed to fetch base:", e.message);
        return;
    }

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
    console.log(`Sorted edits: ${edits.length}`);

    let currentContent = baseContent;
    for (let i = 0; i < edits.length; i++) {
        const edit = edits[i];
        let prevHasTruncated = currentContent.includes('truncated');
        
        if (edit.tool === 'write_to_file') {
            if (edit.args.CodeContent) {
                currentContent = edit.args.CodeContent;
            }
        } else {
            const chunks = [];
            if (edit.tool === 'replace_file_content') {
                chunks.push({
                    target: edit.args.TargetContent || edit.args.targetContent,
                    replacement: edit.args.ReplacementContent || edit.args.replacementContent
                });
            } else {
                let chunksList = edit.args.ReplacementChunks || edit.args.replacementChunks || [];
                if (typeof chunksList === 'string') {
                    try { chunksList = JSON.parse(chunksList); } catch (e) {}
                }
                if (Array.isArray(chunksList)) {
                    chunksList.forEach(c => {
                        chunks.push({
                            target: c.TargetContent || c.targetContent,
                            replacement: c.ReplacementContent || c.replacementContent
                        });
                    });
                }
            }

            for (let j = 0; j < chunks.length; j++) {
                const chunk = chunks[j];
                let target = chunk.target;
                let replacement = chunk.replacement;
                if (!target) continue;

                if (currentContent.includes(target)) {
                    currentContent = currentContent.replace(target, replacement);
                } else {
                    const normContent = normalizeContent(currentContent);
                    const normTarget = normalizeContent(target);
                    const normReplacement = normalizeContent(replacement);
                    if (normContent.includes(normTarget)) {
                        const replacedNorm = normContent.replace(normTarget, normReplacement);
                        const usesCRLF = currentContent.includes('\r\n');
                        currentContent = usesCRLF ? replacedNorm.replace(/\n/g, '\r\n') : replacedNorm;
                    }
                }
            }
        }

        let hasTruncated = currentContent.includes('truncated');
        if (hasTruncated && !prevHasTruncated) {
            console.log(`\n!!! TRUNCATION INTRODUCED at Edit #${i + 1} (Step ${edit.step}, folder: ${edit.folder}, time: ${edit.time})`);
            console.log(`Tool: ${edit.tool}`);
            console.log("Arguments used in this step:");
            console.log(JSON.stringify(edit.args, null, 2).slice(0, 1000));
        }
    }
}

findTruncation();
