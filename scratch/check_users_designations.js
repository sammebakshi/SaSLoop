const pool = require('../db');

async function main() {
    try {
        const usersRes = await pool.query("SELECT id, name, email, role, user_type, designation_id FROM app_users");
        console.log("=== APP USERS ===");
        console.log(usersRes.rows);

        const desRes = await pool.query("SELECT * FROM outlet_designations");
        console.log("=== OUTLET DESIGNATIONS ===");
        console.log(desRes.rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
main();
