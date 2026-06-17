const fs = require('fs');
const path = 'pos-app/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace category text in TMBill category tree
const target1 = "{cat === selectedCategory ? '▼ ' : '▶ '}{cat}";
const replacement1 = "{cat === selectedCategory ? '▼ ' : '▶ '}{cat === 'Uncategorized' ? 'All items' : cat}";

let updated = content;
if (updated.includes(target1)) {
    // We want to replace it where it occurs. There are two matches.
    // Let's do a global replace or replace them step by step.
    updated = updated.split(target1).join(replacement1);
    console.log("Replaced instances of target successfully!");
} else {
    console.log("Target not found with exact matches. Trying with alternate quotes/spacing...");
    // Let's look for double quotes
    const targetAlt = '{cat === selectedCategory ? "▼ " : "▶ "}{cat}';
    if (updated.includes(targetAlt)) {
        updated = updated.split(targetAlt).join('{cat === selectedCategory ? "▼ " : "▶ "}{cat === \'Uncategorized\' ? \'All items\' : cat}');
        console.log("Replaced with alternate quotes!");
    } else {
        console.log("Alternate target not found.");
    }
}

fs.writeFileSync(path, updated, 'utf8');
