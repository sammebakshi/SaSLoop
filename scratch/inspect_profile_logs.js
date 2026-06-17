const { execSync } = require('child_process');
const fs = require('fs');

try {
    const output = execSync('adb logcat -d --pid=5124', { encoding: 'utf8' });
    const lines = output.split('\n');
    let logDumps = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('api/auth/profile')) {
            logDumps.push(`=== MATCH AT LINE ${i} ===`);
            for (let j = 0; j < 40 && (i + j) < lines.length; j++) {
                logDumps.push(lines[i + j]);
            }
            logDumps.push('=========================\n');
        }
    }
    fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/profile_response_dump.txt', logDumps.join('\n'));
    console.log('Successfully written log dump to scratch/profile_response_dump.txt');
} catch (e) {
    console.error('Error running script:', e);
}
