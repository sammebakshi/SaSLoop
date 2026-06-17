const pool = require("../db");

async function checkUser() {
    try {
        const res = await pool.query("SELECT * FROM app_users WHERE username = 'nasirpos'");
        console.log("USER DETAILS:", res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkUser();
