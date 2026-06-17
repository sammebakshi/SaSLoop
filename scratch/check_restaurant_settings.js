const pool = require("../db");

async function check() {
    try {
        const res = await pool.query(
            "SELECT * FROM restaurants WHERE user_id = 48"
        );
        console.log(JSON.stringify(res.rows[0], null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

check();
