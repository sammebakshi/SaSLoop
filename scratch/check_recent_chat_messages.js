const pool = require("../db");

async function check() {
    try {
        const res = await pool.query(
            "SELECT id, customer_number, role, text, created_at FROM chat_messages ORDER BY created_at DESC LIMIT 15"
        );
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

check();
