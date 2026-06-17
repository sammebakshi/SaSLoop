const pool = require('../db');
async function run() {
    try {
        console.log("--- USERS ---");
        const users = await pool.query("SELECT id, username, role FROM app_users");
        console.log(JSON.stringify(users.rows, null, 2));

        console.log("--- RESTAURANTS ---");
        const res = await pool.query("SELECT id, name, brand_id, user_id FROM restaurants");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
