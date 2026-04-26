const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

// ⚙️ CONFIGURATION
const DB_NAME = process.env.DB_NAME || 'sasloop';
const BACKUP_DIR = path.join(__dirname, '../backups');
const KEY_FILE = path.join(__dirname, '../google-key.json');
const FOLDER_ID = process.env.GDRIVE_FOLDER_ID; // The ID of your "SaSLoop Backups" folder

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const fileName = `sasloop_backup_${timestamp}.sql`;
const filePath = path.join(BACKUP_DIR, fileName);

async function uploadToDrive(fileName, filePath) {
    if (!fs.existsSync(KEY_FILE)) {
        console.log('⚠️ google-key.json not found. Skipping GDrive upload.');
        return;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE,
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        const drive = google.drive({ version: 'v3', auth });
        const fileMetadata = {
            name: fileName,
            parents: FOLDER_ID ? [FOLDER_ID] : []
        };
        const media = {
            mimeType: 'application/sql',
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
            supportsAllDrives: true
        });

        console.log(`☁️ Uploaded to GDrive! File ID: ${response.data.id}`);
    } catch (err) {
        console.error('❌ GDrive Upload Error:', err.message);
    }
}

console.log(`🚀 Starting daily backup for ${DB_NAME}...`);

// 1. Create SQL Dump
const dumpCmd = `PGPASSWORD='${process.env.DB_PASSWORD || 'your_password'}' pg_dump -h ${process.env.DB_HOST || 'localhost'} -U ${process.env.DB_USER || 'postgres'} ${DB_NAME} > ${filePath}`;

exec(dumpCmd, async (err, stdout, stderr) => {
    if (err) {
        console.error('❌ Backup failed:', stderr);
        return;
    }

    console.log(`✅ Backup saved to: ${filePath}`);

    // 2. Upload to Google Drive
    await uploadToDrive(fileName, filePath);

    // 3. Cleanup old backups locally (Keep last 7 days)
    fs.readdir(BACKUP_DIR, (err, files) => {
        if (err) return;
        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

        files.forEach(file => {
            const fPath = path.join(BACKUP_DIR, file);
            const stats = fs.statSync(fPath);
            if (now - stats.mtimeMs > sevenDaysMs) {
                fs.unlinkSync(fPath);
                console.log(`🗑️ Deleted old local backup: ${file}`);
            }
        });
    });
});
