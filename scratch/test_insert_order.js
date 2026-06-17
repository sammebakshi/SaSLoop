const pool = require("../db");

async function testInsert() {
    try {
        // Find a valid user
        const userRes = await pool.query("SELECT id FROM app_users LIMIT 1");
        if (userRes.rows.length === 0) {
            console.log("No users found in app_users table!");
            return;
        }
        const userId = userRes.rows[0].id;
        console.log("Using User ID:", userId);

        const orderRef = `TEST-${Math.random().toString(36).substring(7).toUpperCase()}`;
        
        const result = await pool.query(
            `INSERT INTO orders (
                user_id, order_reference, customer_name, customer_number, items, 
                total_price, payment_method, status, payment_status, 
                table_number, address, source, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) RETURNING *`,
            [
                userId, orderRef, 'Test Customer', '1234567890', 
                JSON.stringify([{id: 1, name: 'Test Item', qty: 1, price: 100}]), 100, 'CASH', 
                'COMPLETED', 'PAID', '1', 'In-Store', 'POS_TERMINAL'
            ]
        );

        console.log("Inserted Order:", result.rows[0]);

    } catch (err) {
        console.error("Error inserting test order:", err);
    } finally {
        await pool.end();
    }
}

testInsert();
