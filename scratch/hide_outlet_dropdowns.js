const fs = require('fs');
const path = require('path');

const reportsDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app\\src\\components\\reports';

fs.readdirSync(reportsDir).forEach(filename => {
    if (!filename.endsWith('.jsx')) return;
    const filepath = path.join(reportsDir, filename);
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Special handling for MealTimeSalesReport.jsx
    if (filename === 'MealTimeSalesReport.jsx') {
        const divTarget = '<div className="flex flex-col px-2">';
        const selectTarget = 'value={filters.outlet_id}';
        const sepTarget = '<div className="w-px h-6 bg-slate-200 mx-1" />';

        if (content.includes(divTarget) && content.includes(selectTarget)) {
            // Find the div containing the select
            const divIdx = content.indexOf(divTarget);
            const selectIdx = content.indexOf(selectTarget);
            if (divIdx < selectIdx) {
                // Add hidden class
                content = content.replace(divTarget, '<div className="flex flex-col px-2 hidden">');
                content = content.replace(sepTarget, '<div className="w-px h-6 bg-slate-200 mx-1 hidden" />');
                fs.writeFileSync(filepath, content, 'utf8');
                console.log(`Updated MealTimeSalesReport.jsx`);
            }
        }
        return;
    }

    // 2. Handling for all other reports
    // We match any <select that has filters.outlet_id in its attributes
    const regex = /<select[^>]*value=\{[^}]*filters\.outlet_id[^}]*\}/g;
    let match = regex.exec(content);
    if (match) {
        const selectIdx = match.index;
        // Search backwards from selectIdx for the closest `<div className="`
        const preContent = content.substring(0, selectIdx);
        const divRegex = /<div\s+className="([^"]*)"/g;
        let divMatch;
        let lastDivMatch = null;
        while ((divMatch = divRegex.exec(preContent)) !== null) {
            lastDivMatch = divMatch;
        }

        if (lastDivMatch) {
            const originalDivText = lastDivMatch[0];
            const originalClasses = lastDivMatch[1];
            
            // Check if it already has hidden class
            if (!originalClasses.includes('hidden')) {
                const newDivText = `<div className="${originalClasses} hidden"`;
                // Verify the distance between the div and the select is small (e.g. less than 300 chars)
                if (selectIdx - lastDivMatch.index < 400) {
                    // Let's replace the last occurrence of originalDivText in preContent
                    const prefix = content.substring(0, lastDivMatch.index);
                    const suffix = content.substring(lastDivMatch.index + originalDivText.length);
                    content = prefix + newDivText + suffix;
                    
                    fs.writeFileSync(filepath, content, 'utf8');
                    console.log(`Updated ${filename} (appended hidden to className)`);
                } else {
                    console.warn(`Warning: closest div is too far in ${filename}`);
                }
            } else {
                console.log(`${filename} already hidden`);
            }
        } else {
            console.warn(`Warning: no div found before select in ${filename}`);
        }
    }
});
