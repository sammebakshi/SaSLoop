const fs = require('fs');
try {
    const content = fs.readFileSync('scratch/log_excerpt.txt', 'utf8');
    console.log(`log_excerpt.txt size: ${content.length}`);
    if (content.includes('fun MenuSubTab')) {
        console.log("Found fun MenuSubTab in log_excerpt.txt!");
    } else {
        console.log("Did not find fun MenuSubTab in log_excerpt.txt");
    }
} catch (e) {
    console.error(e.message);
}
