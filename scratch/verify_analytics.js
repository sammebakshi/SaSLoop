const pool = require('../db');

async function testQuery(mode) {
    console.log(`\n--- Testing Mode: ${mode} ---`);
    const countAdvanceInSales = (mode === 'BOOKING_DAY');
    
    const salesSumExpr = countAdvanceInSales
        ? "total_price - COALESCE(pre_order_advance, 0)"
        : "total_price";
    const salesSumExprWithAlias = countAdvanceInSales
        ? "o.total_price - COALESCE(o.pre_order_advance, 0)"
        : "o.total_price";
    const creditSumExpr = countAdvanceInSales
        ? `CASE 
             WHEN UPPER(payment_method) IN ('CREDIT', 'DUE') THEN (total_price - COALESCE(pre_order_advance, 0))
             ELSE (COALESCE(credit_amount, 0) - CASE WHEN COALESCE(credit_amount, 0) > 0 THEN COALESCE(pre_order_advance, 0) ELSE 0 END)
           END`
        : `CASE 
             WHEN UPPER(payment_method) IN ('CREDIT', 'DUE') THEN total_price
             ELSE COALESCE(credit_amount, 0)
           END`;

    const userId = 55; // sample user ID
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    try {
        // Today's Sales Query
        const todayQuery = `SELECT COALESCE(SUM(${salesSumExpr}), 0) as total, COUNT(*) as count FROM orders WHERE user_id = $1 AND created_at >= $2 AND status != 'CANCELLED'`;
        const res1 = await pool.query(todayQuery, [userId, todayStart]);
        console.log("Today Sales Query Output:", res1.rows[0]);

        // Credit Sales Query
        const creditQuery = `SELECT COALESCE(SUM(${creditSumExpr}), 0) as total FROM orders WHERE user_id = $1 AND created_at >= $2 AND status NOT IN ('CANCELLED', 'DELETED')`;
        const res2 = await pool.query(creditQuery, [userId, todayStart]);
        console.log("Today Credit Sales Query Output:", res2.rows[0]);
        
        console.log("✅ SQL Query executed successfully under mode:", mode);
    } catch (e) {
        console.error("❌ SQL Query failed under mode:", mode, e.message);
    }
}

async function run() {
    await testQuery('BOOKING_DAY');
    await testQuery('FULFILLMENT_DAY');
    process.exit();
}

run();
