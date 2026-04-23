const pool = require("../db");

async function checkOrders() {
    try {
        console.log("--- RECENT ORDERS ---");
        const res = await pool.query("SELECT id, user_id, order_reference, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5");
        console.table(res.rows);

        console.log("\n--- BUSINESSES ---");
        const bizRes = await pool.query("SELECT user_id, name FROM restaurants LIMIT 5");
        console.table(bizRes.rows);

        console.log("\n--- APP USERS ---");
        const userRes = await pool.query("SELECT id, username, role FROM app_users WHERE role != 'master_admin' LIMIT 5");
        console.table(userRes.rows);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkOrders();
