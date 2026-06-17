const pool = require("../db");

async function cleanup() {
    try {
        console.log("🧹 Clearing Meta credentials from User ID 1 (SaSLoop Orchestrator)...");
        const res = await pool.query(
            "UPDATE app_users SET meta_phone_id = NULL, meta_access_token = NULL WHERE id = 1 RETURNING *"
        );
        console.log("Cleanup Result:", res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

cleanup();
