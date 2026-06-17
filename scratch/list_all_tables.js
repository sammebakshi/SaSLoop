const pool = require("../db");

async function check() {
    try {
        const result = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables:", result.rows.map(r => r.table_name));
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

check();
