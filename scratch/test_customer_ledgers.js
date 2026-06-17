const pool = require('../db');

async function testLedgers() {
  try {
    console.log("🚀 STARTING BACKEND INTEGRATION TEST FOR CUSTOMER LEDGERS...");

    // Test data
    const userId = 55; // Assuming user_id 55 exists or fits context
    const testNumber = "+447700900077";
    const testName = "Ledger Test Customer";
    const testAddress = "10 Downing Street, London";

    // Clean up previous test run
    await pool.query("DELETE FROM customer_transactions WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM customer_loyalty WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM customers WHERE number = $1", [testNumber]);
    console.log("🧹 Cleaned up old test customer records.");

    // 1. Test upsert with initial values
    console.log("\n1. Testing customer creation with initial balance and points...");
    // Mock crmRoutes POST /customers handler logic directly
    const insertCust = await pool.query(
      `INSERT INTO customers (user_id, name, number, address)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, number)
       DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address
       RETURNING *`,
      [userId, testName, testNumber, testAddress]
    );
    console.log("✅ Customers table record upserted:", insertCust.rows[0].number);

    const initialPoints = 150;
    const initialBalance = 250.50;
    const loyaltyRes = await pool.query(
      `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
       VALUES ($1, $2, $3, $4, $5, 0.00, NOW())
       ON CONFLICT (user_id, customer_number)
       DO UPDATE SET name = EXCLUDED.name,
                     points = COALESCE(customer_loyalty.points, 0) + EXCLUDED.points,
                     balance = COALESCE(customer_loyalty.balance, 0) + EXCLUDED.balance
       RETURNING *`,
      [userId, testNumber, testName, initialPoints, initialBalance]
    );
    console.log("✅ Customer_loyalty table record upserted: Points =", loyaltyRes.rows[0].points, ", Balance =", loyaltyRes.rows[0].balance);

    // Insert initial logs
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'BALANCE_INITIAL', $3, 0, 'Initial Balance during registration', NOW())`,
      [userId, testNumber, initialBalance]
    );
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'POINTS_INITIAL', 0, $3, 'Initial Points during registration', NOW())`,
      [userId, testNumber, initialPoints]
    );
    console.log("✅ Initial transaction logs created.");

    // Verify initial transaction counts
    let txs = await pool.query("SELECT * FROM customer_transactions WHERE customer_number = $1", [testNumber]);
    if (txs.rows.length !== 2) throw new Error("Expected 2 transactions, got " + txs.rows.length);
    console.log("✅ Transaction count verified: 2 records found.");

    // 2. Test manual adjustment with reasons (Add Balance)
    console.log("\n2. Testing manual balance adjustment (Add) with reason...");
    const addAmt = 100.00;
    const addReason = "Guest deposited cash at POS counter";
    
    // Update loyalty table
    const updateBal = await pool.query(
      `UPDATE customer_loyalty SET balance = balance + $1, last_visit = NOW() 
       WHERE user_id = $2 AND customer_number = $3 RETURNING *`,
      [addAmt, userId, testNumber]
    );
    // Log transaction
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'BALANCE_ADJUSTMENT', $3, 0, $4, NOW())`,
      [userId, testNumber, addAmt, addReason]
    );
    console.log("✅ Balance adjusted. New balance =", updateBal.rows[0].balance);

    // 3. Test manual adjustment with reasons (Deduct Points)
    console.log("\n3. Testing manual points adjustment (Deduct) with reason...");
    const deductPoints = -50;
    const deductReason = "Expired points cleanup";
    
    // Update loyalty table
    const updatePts = await pool.query(
      `UPDATE customer_loyalty SET points = points + $1, last_visit = NOW() 
       WHERE user_id = $2 AND customer_number = $3 RETURNING *`,
      [deductPoints, userId, testNumber]
    );
    // Log transaction
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'POINTS_ADJUSTMENT', 0, $3, $4, NOW())`,
      [userId, testNumber, deductPoints, deductReason]
    );
    console.log("✅ Points adjusted. New points =", updatePts.rows[0].points);

    // 4. Query combined history
    console.log("\n4. Retrieving combined customer history...");
    const ordersRes = await pool.query(
      `SELECT id, bill_no, total_price, payment_method, created_at 
       FROM orders 
       WHERE user_id = $1 AND customer_number = $2`,
      [userId, testNumber]
    );
    const transactionsRes = await pool.query(
      `SELECT id, type, amount, points, reason, created_at 
       FROM customer_transactions 
       WHERE user_id = $1 AND customer_number = $2 
       ORDER BY created_at DESC`,
      [userId, testNumber]
    );
    
    console.log("✅ Purchases count:", ordersRes.rows.length);
    console.log("✅ Ledger Transactions count:", transactionsRes.rows.length);
    console.log("\n📜 TRANS LEDGER PREVIEW:");
    transactionsRes.rows.forEach(t => {
      console.log(` - [${t.type}] Amount: ${t.amount}, Points: ${t.points}, Reason: "${t.reason}"`);
    });

    if (transactionsRes.rows.length !== 4) throw new Error("Expected 4 transaction records in history");
    
    console.log("\n🎉 ALL BACKEND LOGIC VERIFIED SUCCESSFULLY!");
  } catch (err) {
    console.error("❌ TEST FAILED:", err);
  } finally {
    pool.end();
  }
}

testLedgers();
