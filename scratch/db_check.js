const pool = require("../db");

async function check() {
    try {
        const res = await pool.query("SELECT id, bill_no, order_reference, total_price, status, created_at FROM orders ORDER BY created_at DESC LIMIT 30");
        console.log("Recent orders:", JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error("Query failed:", e);
    } finally {
        await pool.end();
    }
}

check();
