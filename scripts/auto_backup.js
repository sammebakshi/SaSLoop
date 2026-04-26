const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// ⚙️ CONFIGURATION
const DB_NAME = process.env.DB_NAME || 'sasloop';
const BACKUP_DIR = path.join(__dirname, '../backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const fileName = `sasloop_backup_${timestamp}.sql`;
const filePath = path.join(BACKUP_DIR, fileName);

console.log(`🚀 Starting daily backup for ${DB_NAME}...`);

// 1. Create SQL Dump
const dumpCmd = `mysqldump -u root -p${process.env.DB_PASS || 'your_password'} ${DB_NAME} > ${filePath}`;

exec(dumpCmd, (err, stdout, stderr) => {
    if (err) {
        console.error('❌ Backup failed:', stderr);
        return;
    }

    console.log(`✅ Backup saved to: ${filePath}`);

    // 2. Cleanup old backups (Keep last 7 days)
    fs.readdir(BACKUP_DIR, (err, files) => {
        if (err) return;
        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

        files.forEach(file => {
            const fPath = path.join(BACKUP_DIR, file);
            const stats = fs.statSync(fPath);
            if (now - stats.mtimeMs > sevenDaysMs) {
                fs.unlinkSync(fPath);
                console.log(`🗑️ Deleted old backup: ${file}`);
            }
        });
    });

    // 3. TODO: Upload to GDrive or Send to Telegram
    console.log('🔗 Ready for cloud upload/transfer.');
});
