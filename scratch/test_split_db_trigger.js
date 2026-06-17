const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres:Admin%40123@80.225.240.191:5432/sasloop_db'
  });
  
  await client.connect();
  console.log("Connected to OCI database.");

  try {
    const userId = 2; // Tehzeeb Restauant business ID
    const customerPhone = '+917006089744';
    const testBillNo = 'TEST-SPLIT-999';

    // 1. Reset Sajad balance to 0 for a clean test
    await client.query("UPDATE customer_loyalty SET balance = 0.00 WHERE user_id = $1 AND customer_number = $2", [userId, customerPhone]);
    await client.query("DELETE FROM customer_transactions WHERE user_id = $1 AND customer_number = $2 AND reason LIKE 'TEST-%'", [userId, customerPhone]);
    await client.query("DELETE FROM orders WHERE user_id = $1 AND bill_no = $2", [userId, testBillNo]);

    console.log("Database reset completed for test customer.");

    // 2. Insert a PENDING order representing the saved dine-in bill
    const orderInsert = await client.query(`
      INSERT INTO orders (
        user_id, restaurant_id, order_reference, customer_name, customer_number, items, 
        total_price, payment_method, status, payment_status, bill_no, source, created_at
      ) VALUES ($1, 1, 'REF-999', 'Sajad', $2, '[]', 640.00, 'CASH', 'PENDING', 'PENDING', $3, 'POS_WINDOWS', NOW())
      RETURNING *
    `, [userId, customerPhone, testBillNo]);
    
    const pendingOrder = orderInsert.rows[0];
    console.log("Inserted pending order:", pendingOrder.id, "Bill No:", pendingOrder.bill_no);

    // 3. Simulate backend settlement updating order 74 logic (from routes/orderRoutes.js)
    const upperMethod = 'SPLIT';
    const paid_amount = 100.00;
    const credit_amount = 540.00;
    const total_price = 640.00;

    const finalPaidAmount = paid_amount;
    const finalCreditAmount = credit_amount;
    let paymentStatus = 'PARTIALLY_PAID';

    const updateRes = await client.query(`
      UPDATE orders SET 
        payment_method = $1, status = 'COMPLETED', payment_status = $2,
        paid_amount = $3, credit_amount = $4, created_at = NOW()
       WHERE id = $5 RETURNING *
    `, [upperMethod, paymentStatus, finalPaidAmount, finalCreditAmount, pendingOrder.id]);

    const updatedOrder = updateRes.rows[0];
    console.log("Updated order to COMPLETED:", updatedOrder.id, "payment_method:", updatedOrder.payment_method);

    // 4. Run the customer_loyalty balance updates (exactly like the backend code)
    if (finalCreditAmount > 0 && customerPhone) {
      const loyaltyRes = await client.query(
        "SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
        [userId, customerPhone]
      );
      if (loyaltyRes.rows.length === 0) {
        await client.query(
          `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
           VALUES ($1, $2, 'Sajad', 0, $3, 0.00, NOW())`,
          [userId, customerPhone, -finalCreditAmount]
        );
      } else {
        await client.query(
          `UPDATE customer_loyalty 
           SET balance = COALESCE(balance, 0) - $1, last_visit = NOW() 
           WHERE user_id = $2 AND customer_number = $3`,
          [finalCreditAmount, userId, customerPhone]
        );
      }

      await client.query(
        `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
         VALUES ($1, $2, 'CREDIT_PURCHASE', $3, 0, $4, NOW())`,
        [userId, customerPhone, -finalCreditAmount, `TEST-Credit purchase for Order Bill: ${testBillNo}`]
      );
      console.log("Deducted customer balance by credit amount:", finalCreditAmount);
    }

    // 5. Query and verify the results
    const finalLoyalty = await client.query(
      "SELECT balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
      [userId, customerPhone]
    );
    const finalBalance = parseFloat(finalLoyalty.rows[0].balance);
    console.log("--- TEST RESULTS ---");
    console.log("Customer Balance (Expected -540.00):", finalBalance);

    if (finalBalance === -540.00) {
      console.log("✅ SUCCESS: Balance updated correctly!");
    } else {
      console.error("❌ FAILURE: Balance is " + finalBalance);
    }

    // 6. Cleanup
    await client.query("UPDATE customer_loyalty SET balance = 0.00 WHERE user_id = $1 AND customer_number = $2", [userId, customerPhone]);
    await client.query("DELETE FROM customer_transactions WHERE user_id = $1 AND customer_number = $2 AND reason LIKE 'TEST-%'", [userId, customerPhone]);
    await client.query("DELETE FROM orders WHERE user_id = $1 AND bill_no = $2", [userId, testBillNo]);
    console.log("Cleaned up test data.");

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    await client.end();
  }
}

run();
