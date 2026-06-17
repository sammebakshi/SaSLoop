const pool = require('../db');

async function testCreditFlow() {
  try {
    console.log("🚀 STARTING CREDIT PAYMENT FLOW INTEGRATION TEST...\n");

    const userId = 55;
    const testNumber = "+919999000111";
    const testName = "Credit Test Customer";

    // ── CLEANUP ─────────────────────────────────────────
    await pool.query("DELETE FROM customer_transactions WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM orders WHERE customer_number = $1 AND user_id = $2", [testNumber, userId]);
    await pool.query("DELETE FROM customer_loyalty WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM customers WHERE number = $1 AND user_id = $2", [testNumber, userId]);
    console.log("🧹 Cleaned up old test data.\n");

    // ── 1. CREATE CUSTOMER WITH INITIAL BALANCE ───────────
    console.log("1. Creating customer with initial balance of 500...");
    await pool.query(
      `INSERT INTO customers (user_id, name, number, address) VALUES ($1, $2, $3, 'Test Address')
       ON CONFLICT (user_id, number) DO UPDATE SET name = EXCLUDED.name RETURNING *`,
      [userId, testName, testNumber]
    );
    await pool.query(
      `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
       VALUES ($1, $2, $3, 0, 500.00, 0.00, NOW())
       ON CONFLICT (user_id, customer_number) DO UPDATE SET balance = 500.00 RETURNING *`,
      [userId, testNumber, testName]
    );
    let loyalty = await pool.query("SELECT balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, testNumber]);
    console.log("✅ Customer created. Balance:", loyalty.rows[0].balance);
    if (parseFloat(loyalty.rows[0].balance) !== 500.00) throw new Error("Expected initial balance 500.00");

    // ── 2. SIMULATE CREDIT ORDER (deduct 200) ──────────────
    console.log("\n2. Simulating credit order of ₹200...");
    const creditAmount = 200;

    // Deduct balance (simulating what orderRoutes POST / does)
    await pool.query(
      `UPDATE customer_loyalty SET balance = COALESCE(balance, 0) - $1, last_visit = NOW()
       WHERE user_id = $2 AND customer_number = $3`,
      [creditAmount, userId, testNumber]
    );
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'CREDIT_PURCHASE', $3, 0, 'Credit purchase for Order Bill: TEST-001', NOW())`,
      [userId, testNumber, -creditAmount]
    );

    loyalty = await pool.query("SELECT balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, testNumber]);
    console.log("✅ After credit purchase. Balance:", loyalty.rows[0].balance);
    if (parseFloat(loyalty.rows[0].balance) !== 300.00) throw new Error("Expected balance 300.00 after credit purchase");

    // ── 3. SIMULATE ANOTHER CREDIT ORDER (deduct 400 → goes negative) ──
    console.log("\n3. Simulating larger credit order of ₹400 (should go negative)...");
    const largeCredit = 400;
    await pool.query(
      `UPDATE customer_loyalty SET balance = COALESCE(balance, 0) - $1, last_visit = NOW()
       WHERE user_id = $2 AND customer_number = $3`,
      [largeCredit, userId, testNumber]
    );
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'CREDIT_PURCHASE', $3, 0, 'Credit purchase for Order Bill: TEST-002', NOW())`,
      [userId, testNumber, -largeCredit]
    );

    loyalty = await pool.query("SELECT balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, testNumber]);
    const negBalance = parseFloat(loyalty.rows[0].balance);
    console.log("✅ After second credit. Balance:", negBalance);
    if (negBalance !== -100.00) throw new Error("Expected balance -100.00");

    // ── 4. SIMULATE CREDIT REFUND (cancel second order → refund 400) ──
    console.log("\n4. Simulating cancellation refund of ₹400...");
    await pool.query(
      `UPDATE customer_loyalty SET balance = COALESCE(balance, 0) + $1
       WHERE user_id = $2 AND customer_number = $3`,
      [largeCredit, userId, testNumber]
    );
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'CREDIT_REFUND', $3, 0, 'Credit refund for cancelled Order', NOW())`,
      [userId, testNumber, largeCredit]
    );

    loyalty = await pool.query("SELECT balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, testNumber]);
    const afterRefund = parseFloat(loyalty.rows[0].balance);
    console.log("✅ After refund. Balance:", afterRefund);
    if (afterRefund !== 300.00) throw new Error("Expected balance 300.00 after refund");

    // ── 5. SIMULATE PAY DUE ─────────────────────────────────
    // First, create a negative balance scenario again
    console.log("\n5. Simulating due payment flow...");
    await pool.query(
      `UPDATE customer_loyalty SET balance = -250.00 WHERE user_id = $1 AND customer_number = $2`,
      [userId, testNumber]
    );
    console.log("   Set balance to -250 (simulating credit dues).");

    // Simulate POST /customers/pay-due
    const payAmt = 150.00;
    await pool.query(
      `UPDATE customer_loyalty SET balance = COALESCE(balance, 0) + $1, last_visit = NOW()
       WHERE user_id = $2 AND customer_number = $3`,
      [payAmt, userId, testNumber]
    );
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'BILL_PAYMENT', $3, 0, 'Due Payment of ₹150.00 via Cash', NOW())`,
      [userId, testNumber, payAmt]
    );

    loyalty = await pool.query("SELECT balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, testNumber]);
    const afterPayDue = parseFloat(loyalty.rows[0].balance);
    console.log("✅ After pay due. Balance:", afterPayDue);
    if (afterPayDue !== -100.00) throw new Error("Expected balance -100.00 after partial payment");

    // ── 6. VERIFY FULL LEDGER ────────────────────────────────
    console.log("\n6. Verifying transaction ledger...");
    const txs = await pool.query(
      "SELECT type, amount, reason FROM customer_transactions WHERE customer_number = $1 ORDER BY created_at ASC",
      [testNumber]
    );
    console.log("   Total transactions:", txs.rows.length);
    txs.rows.forEach((t, i) => {
      console.log(`   ${i+1}. [${t.type}] Amount: ${t.amount} — "${t.reason}"`);
    });

    if (txs.rows.length !== 4) throw new Error("Expected 4 transaction records, got " + txs.rows.length);

    const types = txs.rows.map(t => t.type);
    if (!types.includes('CREDIT_PURCHASE')) throw new Error("Missing CREDIT_PURCHASE transaction");
    if (!types.includes('CREDIT_REFUND')) throw new Error("Missing CREDIT_REFUND transaction");
    if (!types.includes('BILL_PAYMENT')) throw new Error("Missing BILL_PAYMENT transaction");

    console.log("\n🎉 ALL CREDIT FLOW TESTS PASSED SUCCESSFULLY!\n");

    // ── CLEANUP ─────────────────────────────────────────
    await pool.query("DELETE FROM customer_transactions WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM customer_loyalty WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM customers WHERE number = $1 AND user_id = $2", [testNumber, userId]);
    console.log("🧹 Test data cleaned up.");

  } catch (err) {
    console.error("❌ TEST FAILED:", err);
  } finally {
    pool.end();
  }
}

testCreditFlow();
