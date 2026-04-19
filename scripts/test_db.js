const pool = require('./db');

async function checkData() {
    try {
        const uRes = await pool.query("SELECT * FROM app_users WHERE id = 41");
        console.log("App Users:", uRes.rows[0]);

        const rRes = await pool.query("SELECT * FROM restaurants WHERE user_id = 41");
        console.log("Restaurants:", rRes.rows[0]);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

checkData();
