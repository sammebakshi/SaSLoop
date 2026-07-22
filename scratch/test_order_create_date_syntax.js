const pool = require('../db');

async function testOrderInsert() {
    try {
        console.log("=== TEST INSERT WITH EMPTY DATE STRING ===");
        try {
            await pool.query(`
                INSERT INTO orders (user_id, items, total_price, pre_order_scheduled_date, created_at)
                VALUES (55, '[]', 100, $1, COALESCE($2::timestamp, NOW()))
            `, ["", ""]);
            console.log("Insert succeeded!");
        } catch (e) {
            console.error("FAIL 1 (empty string):", e.message);
        }

        console.log("=== TEST INSERT WITH NULL ===");
        try {
            await pool.query(`
                INSERT INTO orders (user_id, items, total_price, pre_order_scheduled_date, created_at)
                VALUES (55, '[]', 100, $1, COALESCE($2::timestamp, NOW())) RETURNING id
            `, [null, null]);
            console.log("Insert 2 with NULL succeeded!");
        } catch (e) {
            console.error("FAIL 2 (null):", e.message);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testOrderInsert();
