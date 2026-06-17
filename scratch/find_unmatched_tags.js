const fs = require('fs');

const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/SalesReport.jsx', 'utf8');

const tags = [];
let i = 0;
const len = content.length;

function matches(str, pos) {
    return content.substring(pos, pos + str.length) === str;
}

function getLineCol(pos) {
    const lines = content.substring(0, pos).split('\n');
    return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

let inComment = false;
let inString = false;
let stringChar = '';
let inTemplate = false;

while (i < len) {
    if (inComment) {
        if (matches('*/', i)) {
            inComment = false;
            i += 2;
        } else {
            i++;
        }
        continue;
    }
    if (matches('/*', i)) {
        inComment = true;
        i += 2;
        continue;
    }
    if (matches('//', i)) {
        while (i < len && content[i] !== '\n') {
            i++;
        }
        continue;
    }
    if (inString) {
        if (content[i] === stringChar && content[i - 1] !== '\\') {
            inString = false;
        }
        i++;
        continue;
    }
    if (inTemplate) {
        if (content[i] === '`' && content[i - 1] !== '\\') {
            inTemplate = false;
        }
        i++;
        continue;
    }

    if (content[i] === '"' || content[i] === "'") {
        inString = true;
        stringChar = content[i];
        i++;
        continue;
    }
    if (content[i] === '`') {
        inTemplate = true;
        i++;
        continue;
    }

    if (content[i] === '<') {
        if (matches('<!--', i)) {
            i += 4;
            while (i < len && !matches('-->', i)) {
                i++;
            }
            i += 3;
            continue;
        }

        const nextChar = content[i + 1];
        if (/[a-zA-Z\/]/.test(nextChar)) {
            const start = i;
            let tagContent = '';
            i++;
            
            let tagStringChar = '';
            let inTagString = false;
            let braceDepth = 0;
            
            while (i < len) {
                const char = content[i];
                if (inTagString) {
                    if (char === tagStringChar && content[i - 1] !== '\\') {
                        inTagString = false;
                    }
                } else if (char === '"' || char === "'") {
                    inTagString = true;
                    tagStringChar = char;
                } else if (char === '{') {
                    braceDepth++;
                } else if (char === '}') {
                    braceDepth--;
                } else if (char === '>' && braceDepth === 0) {
                    break;
                }
                tagContent += char;
                i++;
            }
            
            const fullTag = '<' + tagContent + '>';
            const { line, col } = getLineCol(start);
            
            const trimmed = tagContent.trim();
            let isClose = false;
            let isSelfClose = false;
            let tagName = '';
            
            if (trimmed.startsWith('/')) {
                isClose = true;
                tagName = trimmed.substring(1).trim().split(/\s+/)[0];
            } else if (trimmed.endsWith('/')) {
                isSelfClose = true;
                tagName = trimmed.substring(0, trimmed.length - 1).trim().split(/\s+/)[0];
            } else {
                tagName = trimmed.split(/\s+/)[0];
            }
            
            if (tagName && /^[a-zA-Z0-9:]+$/.test(tagName)) {
                tags.push({
                    name: tagName,
                    isClose,
                    isSelfClose,
                    line,
                    col,
                    full: fullTag
                });
            }
        }
    }
    i++;
}

const stack = [];
const errors = [];

for (const tag of tags) {
    if (tag.isSelfClose) {
        continue;
    }
    if (tag.isClose) {
        if (stack.length === 0) {
            errors.push(`Close tag </${tag.name}> at line ${tag.line}:${tag.col} has no matching open tag.`);
        } else {
            const last = stack.pop();
            if (last.name !== tag.name) {
                errors.push(`Mismatched tags: Open <${last.name}> at line ${last.line}:${last.col} closed by </${tag.name}> at line ${tag.line}:${tag.col}`);
                stack.push(last);
            }
        }
    } else {
        stack.push(tag);
    }
}

while (stack.length > 0) {
    const unclosed = stack.pop();
    errors.push(`Unclosed tag <${unclosed.name}> at line ${unclosed.line}:${unclosed.col}`);
}

console.log(`Parsed ${tags.length} tags.`);
if (errors.length === 0) {
    console.log("No tag nesting issues found!");
} else {
    console.log(`${errors.length} issues found:`);
    errors.forEach(e => console.log(e));
}
