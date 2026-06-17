const { execSync } = require('child_process');
const query = process.argv[2] || "SELECT id, username, name, email, role, business_name FROM app_users";
try {
    const cmd = `C:\\Windows\\System32\\OpenSSH\\ssh.exe -i ./ssh-key-2026-04-19.key -o StrictHostKeyChecking=no ubuntu@80.225.240.191 "cd SaSLoop && node -e \\"const db = require('./db'); db.query(\\\`${query}\\\`, function(err, res) { if (err) { console.error(err); } else { console.log('===RESULT==='); console.log(JSON.stringify(res.rows)); } process.exit(0); })\\""`;
    const res = execSync(cmd, { encoding: 'utf8' });
    const parts = res.split('===RESULT===');
    if (parts.length > 1) {
        console.log(JSON.stringify(JSON.parse(parts[1].trim()), null, 2));
    } else {
        console.log("Raw output:", res);
    }
} catch (e) {
    console.error(e.message);
}
