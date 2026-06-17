const pool = require("../db");

async function check() {
    try {
        const res = await pool.query(
            "SELECT id, name, user_id FROM restaurants"
        );
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

check();
