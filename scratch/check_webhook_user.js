const pool = require("../db");

async function check() {
    try {
        const res = await pool.query(
            "SELECT id, phone, name, meta_phone_id, meta_access_token FROM app_users WHERE meta_phone_id = '1081456295056156'"
        );
        console.table(res.rows);

        const allUsers = await pool.query("SELECT id, phone, name, meta_phone_id FROM app_users");
        console.log("All users in DB:");
        console.table(allUsers.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

check();
