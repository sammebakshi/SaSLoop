const pool = require('./db');
require('dotenv').config();

async function updateTokens() {
    const token = process.env.META_ACCESS_TOKEN;
    const phoneId = process.env.META_PHONE_ID;
    if (!token || !phoneId) {
        console.error("No ENV token or phoneId found!");
        process.exit(1);
    }
    console.log("Updating app_users with token starting with:", token.substring(0, 20));
    try {
        const res = await pool.query(
            "UPDATE app_users SET meta_access_token = $1, meta_phone_id = $2 WHERE meta_access_token IS NOT NULL OR meta_phone_id IS NOT NULL OR id IN (1, 2)",
            [token, phoneId]
        );
        console.log("Updated rows:", res.rowCount);
    } catch(e) {
        console.error("DB Update Error:", e);
    }
    process.exit(0);
}
updateTokens();
