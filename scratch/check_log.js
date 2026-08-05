const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function checkLog() {
    try {
        const logPath = path.join(__dirname, 'webhook_debug.log');
        if (fs.existsSync(logPath)) {
            console.log("📜 Recent Webhook Hits from webhook_debug.log:");
            const content = fs.readFileSync(logPath, 'utf8');
            const lines = content.split('\n');
            console.log(lines.slice(-30).join('\n'));
        } else {
            console.log("ℹ️ scratch/webhook_debug.log does not exist on local dev environment yet.");
        }

        console.log("\n🔍 Checking App User Meta Phone IDs:");
        const res = await pool.query("SELECT id, username, email, phone, meta_phone_id, meta_access_token FROM app_users WHERE meta_phone_id IS NOT NULL OR meta_access_token IS NOT NULL");
        console.log(res.rows);

        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

checkLog();
