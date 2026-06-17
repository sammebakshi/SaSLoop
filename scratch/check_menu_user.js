const pool = require("../db");

async function check() {
    try {
        const res = await pool.query(
            "SELECT user_id, COUNT(*) FROM business_items GROUP BY user_id"
        );
        console.log("business_items counts grouped by user_id:");
        console.table(res.rows);

        const allRestaurants = await pool.query(
            "SELECT id, name, user_id FROM restaurants"
        );
        console.log("restaurants:");
        console.table(allRestaurants.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

check();
