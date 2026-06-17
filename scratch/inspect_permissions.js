const pool = require('../db');

async function run() {
    try {
        const res = await pool.query("SELECT id, username, staff_permissions FROM app_users WHERE parent_user_id IS NOT NULL");
        console.log(`Inspecting ${res.rows.length} staff users:`);
        for (let row of res.rows) {
            console.log(`User ${row.username}:`, row.staff_permissions);
        }
    } catch (e) {
        console.error("Error inspecting permissions:", e);
    } finally {
        pool.end();
    }
}

run();
