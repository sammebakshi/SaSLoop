const pool = require("../db");

async function update() {
    try {
        const result = await pool.query("UPDATE app_users SET pos_pin = '123456' WHERE username = 'testuser1' RETURNING id");
        console.log("Updated rows:", result.rowCount);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

update();
