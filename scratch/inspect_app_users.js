const pool = require('../db');

async function run() {
    try {
        const res = await pool.query("SELECT * FROM app_users LIMIT 1");
        console.log("Columns of app_users:", Object.keys(res.rows[0] || {}));
        console.log("Sample row:", res.rows[0]);
    } catch (e) {
        console.error("Error inspecting table:", e);
    } finally {
        pool.end();
    }
}

run();
