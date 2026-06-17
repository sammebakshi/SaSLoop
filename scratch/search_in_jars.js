const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findJars(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                results = results.concat(findJars(fullPath));
            } else {
                if (file.endsWith('.jar')) {
                    results.push(fullPath);
                }
            }
        });
    } catch (e) {
        // ignore
    }
    return results;
}

const buildDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\sasloop-android\\app\\build';
console.log('Finding jar files under:', buildDir);
const jars = findJars(buildDir);
console.log(`Found ${jars.length} jar files.`);

jars.forEach(jar => {
    try {
        // Run jar tf to list contents of the jar
        // Since JDK is installed, jar command should be available
        const stdout = execSync(`jar tf "${jar}"`, { encoding: 'utf8' });
        if (stdout.includes('BillingScreen')) {
            console.log(`Jar matches: ${jar}`);
            const lines = stdout.split('\n');
            lines.forEach(l => {
                if (l.includes('BillingScreen')) {
                    console.log(`  - ${l.trim()}`);
                }
            });
        }
    } catch (e) {
        // ignore errors (if jar command is not on path, or jar is empty)
    }
});
