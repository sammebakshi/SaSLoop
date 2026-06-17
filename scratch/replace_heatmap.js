const fs = require('fs');
const path = 'pos-app/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split(/\r?\n/);
let foundIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('// Calculate dynamic heatmap from recentOrders')) {
        foundIndex = i;
        break;
    }
}

if (foundIndex !== -1) {
    console.log(`Found heatmap start at index ${foundIndex}: "${lines[foundIndex]}"`);
    
    // Replace the next 13 lines starting from foundIndex
    const replacement = [
        "               // Calculate dynamic heatmap from stats.weeklyHeatmap",
        "               const heatmapData = Array(7).fill(0);",
        "               if (Array.isArray(stats.weeklyHeatmap)) {",
        "                 stats.weeklyHeatmap.forEach(item => {",
        "                   const dow = parseInt(item.dow);",
        "                   const idx = dow === 0 ? 6 : dow - 1;",
        "                   if (idx >= 0 && idx < 7) {",
        "                     heatmapData[idx] += parseFloat(item.total || 0);",
        "                   }",
        "                 });",
        "               }",
        "               const maxHeatmapVal = Math.max(...heatmapData, 1);"
    ];

    // Splice the replacement in
    lines.splice(foundIndex, 13, ...replacement);
    fs.writeFileSync(path, lines.join('\r\n'), 'utf8');
    console.log("Successfully replaced heatmap logic in App.jsx!");
} else {
    console.log("Error: Target comment not found in App.jsx!");
}
