const pool = require('../db');

async function main() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='app_users'");
        console.log("APP USERS COLUMNS:", res.rows.map(r => r.column_name));
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit(0);
    }
}
main();
