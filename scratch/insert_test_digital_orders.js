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

        const sources = [
            { source: 'QR_MENU', table: '4', address: 'Dine-In', name: 'QR Customer' },
            { source: 'ONLINE_ORDER', table: '0', address: '123 Main St, New Delhi', name: 'Web Customer' },
            { source: 'WHATSAPP', table: '0', address: 'Pickup', name: 'WhatsApp Customer' }
        ];

        for (const s of sources) {
            const orderRef = `DIGI-${s.source.substring(0, 3)}-${Math.random().toString(36).substring(7).toUpperCase()}`;
            const result = await pool.query(
                `INSERT INTO orders (
                    user_id, order_reference, customer_name, customer_number, items, 
                    total_price, payment_method, status, payment_status, 
                    table_number, address, source, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) RETURNING *`,
                [
                    userId, orderRef, s.name, '9876543210', 
                    JSON.stringify([
                        { product_name: 'Veg Noodles', qty: 2, price: 150 },
                        { product_name: 'Spring Roll', qty: 1, price: 120 }
                    ]), 420.00, 'UPI', 
                    'PENDING', 'PENDING', s.table, s.address, s.source
                ]
            );

            console.log(`Inserted ${s.source} Order:`, result.rows[0].order_reference);
        }

    } catch (err) {
        console.error("Error inserting test orders:", err);
    } finally {
        await pool.end();
    }
}

testInsert();
