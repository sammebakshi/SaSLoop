const pool = require('../db');

async function checkStatus() {
    try {
        console.log("🔍 Checking app_users Meta Credentials:");
        const users = await pool.query("SELECT id, username, email, phone, meta_phone_id, meta_access_token FROM app_users WHERE meta_phone_id IS NOT NULL OR role = 'user' OR role = 'brand_owner'");
        console.log("Users:", users.rows.map(u => ({
            id: u.id,
            username: u.username,
            meta_phone_id: u.meta_phone_id,
            has_token: Boolean(u.meta_access_token)
        })));

        console.log("\n🔍 Checking recent conversation_sessions:");
        const sessions = await pool.query("SELECT user_id, customer_number, state, is_paused, updated_at FROM conversation_sessions ORDER BY updated_at DESC LIMIT 10");
        console.log("Recent Sessions:", sessions.rows);

        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

checkStatus();
