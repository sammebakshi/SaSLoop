const pool = require("../db");

async function check() {
    try {
        const res = await pool.query(
            "SELECT id, product_name, price, availability, stock_count FROM business_items WHERE user_id = 48 ORDER BY id"
        );
        console.log("Business Items for user 48 (Total: " + res.rows.length + "):");
        console.log(res.rows.slice(0, 30));
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

check();
