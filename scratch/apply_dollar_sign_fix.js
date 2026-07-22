const fs = require('fs');
const { execSync } = require('child_process');

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace literal `m.id = ${params.length}` or `m.id = $3` with `'m.id = $' + params.length`
    const oldStr = 'conditions.push(`m.id = ${params.length}`);';
    const newStr = "conditions.push('m.id = $' + params.length);";

    if (content.includes(oldStr)) {
        content = content.replace(oldStr, newStr);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`SUCCESSFULLY FIXED in ${filePath}`);
    } else {
        console.log(`Searching regex in ${filePath}...`);
        content = content.replace(/conditions\.push\(`m\.id = \$\{params\.length\}`\);/g, "conditions.push('m.id = ' + '$' + params.length);");
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`REGEX FIXED in ${filePath}`);
    }
}

fixFile('c:/Users/Sajad/Desktop/SaSLoop/routes/brandRoutes.js');
fixFile('c:/Users/Sajad/Desktop/SaSLoop/pos-app/server/routes/brandRoutes.js');

execSync('node -c routes/brandRoutes.js');
console.log("SYNTAX CHECK brandRoutes.js: PASSED ✅");

execSync('node -c pos-app/server/routes/brandRoutes.js');
console.log("SYNTAX CHECK pos-app/server/routes/brandRoutes.js: PASSED ✅");
