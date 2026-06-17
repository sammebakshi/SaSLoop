const { execSync } = require('child_process');
const fs = require('fs');
try {
    const cmd = `C:\\Windows\\System32\\OpenSSH\\ssh.exe -i ./ssh-key-2026-04-19.key -o StrictHostKeyChecking=no ubuntu@80.225.240.191 "cd SaSLoop && node -e \\"const db = require('./db'); db.query('SELECT settings FROM restaurants WHERE user_id=2', function(err, res) { if (err) { console.error(err); } else { console.log(JSON.stringify(res.rows[0])); } process.exit(0); })\\""`;
    const res = execSync(cmd, { encoding: 'utf8' });
    fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/production_settings.txt', res);
    console.log('Result written to scratch/production_settings.txt');
} catch (e) {
    console.error(e.message);
}
