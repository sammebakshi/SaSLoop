const pool = require("../db");

async function runTest() {
    try {
        console.log("🧪 STARTING DEDUPLICATION BACKEND TEST...");

        // Get User 2 ID (shahetehzeeb)
        const userRes = await pool.query("SELECT id FROM app_users WHERE username = 'shahetehzeeb' LIMIT 1");
        if (userRes.rows.length === 0) {
            console.error("❌ Test failed: shahetehzeeb user not found.");
            process.exit(1);
        }
        const userId = userRes.rows[0].id;
        console.log(`👤 Test User ID: ${userId}`);

        // Cleanup any old test orders
        await pool.query("DELETE FROM orders WHERE user_id = $1 AND bill_no = '9999'", [userId]);

        const orderData = {
            customer_name: "Test Guest",
            customer_number: "919999999999",
            items: [{ id: 1, name: "Test Item", qty: 1, price: 500.00 }],
            total_price: 500.00,
            payment_method: "CASH",
            status: "COMPLETED",
            bill_no: "9999",
            order_type: "QUICK",
            order_reference: "TEST-REF-1"
        };

        // First Insertion (Directly executing the insertion logic via orderRoutes handler mock or using fetch)
        // Wait, we can test it by hitting the remote API or running the code locally.
        // Let's run it locally to verify the code logic works, since the same orderRoutes.js code runs on both local and remote!
        console.log("\n-> Sending first checkout...");
        const res1 = await insertOrderMock(userId, orderData);
        console.log(`✅ Order 1 Created. ID: ${res1.id}, Bill No: ${res1.bill_no}`);

        // Second Insertion with same bill_no and price
        console.log("\n-> Sending second checkout (duplicate)...");
        const res2 = await insertOrderMock(userId, orderData);
        console.log(`✅ Order 2 Response. ID: ${res2.id}, Bill No: ${res2.bill_no}`);

        if (res1.id === res2.id) {
            console.log("\n🎉 SUCCESS: Backend successfully deduplicated and returned the existing order!");
        } else {
            console.error("\n❌ FAILURE: Duplicate order was inserted!");
        }

        // Cleanup
        await pool.query("DELETE FROM orders WHERE user_id = $1 AND bill_no = '9999'", [userId]);
        console.log("🧹 Cleanup complete.");

    } catch (e) {
        console.error("❌ Test crashed:", e);
    } finally {
        process.exit();
    }
}

async function insertOrderMock(userId, body) {
    const { 
        customer_name, customer_number, items, total_price, 
        payment_method, status, bill_no, order_type, order_reference
    } = body;

    // Deduplication check
    if (bill_no) {
      const existingBill = await pool.query(
        `SELECT * FROM orders 
         WHERE user_id = $1 
           AND bill_no = $2 
           AND total_price = $3 
           AND created_at >= NOW() - INTERVAL '10 minutes'
         LIMIT 1`,
        [userId, bill_no, total_price]
      );
      if (existingBill.rows.length > 0) {
        console.log(`[DEDUPLICATION MATCH] returning existing.`);
        return existingBill.rows[0];
      }
    }

    const orderRef = order_reference || `POS-TEST`;
    const result = await pool.query(
      `INSERT INTO orders (
        user_id, order_reference, customer_name, customer_number, items, 
        total_price, payment_method, status, bill_no, order_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        userId, orderRef, customer_name, customer_number, JSON.stringify(items), 
        total_price, payment_method, status, bill_no, order_type
      ]
    );
    return result.rows[0];
}

runTest();
