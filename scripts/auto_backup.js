const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// ⚙️ CONFIGURATION
const DB_NAME = process.env.DB_NAME || 'sasloop';
const BACKUP_DIR = path.join(__dirname, '../backups');
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const fileName = `sasloop_backup_${timestamp}.sql`;
const filePath = path.join(BACKUP_DIR, fileName);

async function uploadToTelegram(fileName, filePath) {
    if (!BOT_TOKEN || !CHAT_ID) {
        console.log('⚠️ Telegram credentials not found in .env. Skipping upload.');
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('caption', `📦 SaSLoop Database Backup\n🕒 ${new Date().toLocaleString()}\n🗄️ Database: ${DB_NAME}`);
        form.append('document', fs.createReadStream(filePath), { filename: fileName });

        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        if (response.data.ok) {
            console.log('📱 Backup sent to Telegram successfully!');
        } else {
            console.error('❌ Telegram Error:', response.data.description);
        }
    } catch (err) {
        if (err.response && err.response.data) {
            console.error('❌ Telegram API Detailed Error:', err.response.data.description);
        } else {
            console.error('❌ Telegram Upload Error:', err.message);
        }
    }
}

console.log(`🚀 Starting daily backup for ${DB_NAME}...`);

// 1. Create SQL Dump (PostgreSQL)
const pgDumpPath = process.env.PG_DUMP_PATH || 'pg_dump';
const dumpCmd = `"${pgDumpPath}" -h ${process.env.DB_HOST || 'localhost'} -U ${process.env.DB_USER || 'postgres'} ${DB_NAME} > "${filePath}"`;

exec(dumpCmd, { env: { ...process.env, PGPASSWORD: process.env.DB_PASSWORD } }, async (err, stdout, stderr) => {
    if (err) {
        console.error('❌ Backup failed:', stderr || err.message);
        return;
    }

    console.log(`✅ Backup saved to: ${filePath}`);

    // 2. Upload to Telegram
    await uploadToTelegram(fileName, filePath);

    // 3. Cleanup old backups locally (Keep last 7 days)
    fs.readdir(BACKUP_DIR, (err, files) => {
        if (err) return;
        const now = Date.now();
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

        files.forEach(file => {
            const fPath = path.join(BACKUP_DIR, file);
            const stats = fs.statSync(fPath);
            if (now - stats.mtimeMs > thirtyDaysMs) {
                fs.unlinkSync(fPath);
                console.log(`🗑️ Deleted old local backup: ${file}`);
            }
        });
    });
});
