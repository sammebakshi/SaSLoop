const pool = require('../db');

async function checkPayments() {
    try {
        const res = await pool.query(
            "SELECT DISTINCT payment_method FROM orders"
        );
        console.log("Distinct Payment Methods in Database:");
        console.table(res.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkPayments();
