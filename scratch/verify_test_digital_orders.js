const pool = require("../db");

async function verify() {
    try {
        const res = await pool.query(
            "SELECT id, order_reference, customer_name, source, status, created_at FROM orders WHERE order_reference LIKE 'DIGI-%' ORDER BY created_at DESC"
        );
        console.log("Found Digital Orders:", res.rows.length);
        console.table(res.rows);
    } catch (err) {
        console.error("Verification error:", err);
    } finally {
        await pool.end();
    }
}

verify();
