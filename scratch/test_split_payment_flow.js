const pool = require('../db');

async function testSplitPaymentFlow() {
  try {
    console.log("🚀 STARTING SPLIT PAYMENT FLOW INTEGRATION TEST...\n");

    const userId = 1;
    const testNumber = "+919999000222";
    const testName = "Split Payment Test Customer";

    // ── CLEANUP ─────────────────────────────────────────
    await pool.query("DELETE FROM customer_transactions WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM orders WHERE customer_number = $1 AND user_id = $2", [testNumber, userId]);
    await pool.query("DELETE FROM customer_loyalty WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM customers WHERE number = $1 AND user_id = $2", [testNumber, userId]);
    console.log("🧹 Cleaned up old test data.\n");

    // ── 1. CREATE CUSTOMER WITH INITIAL BALANCE ───────────
    console.log("1. Creating customer with initial balance of 0...");
    await pool.query(
      `INSERT INTO customers (user_id, name, number, address) VALUES ($1, $2, $3, 'Test Address')
       ON CONFLICT (user_id, number) DO UPDATE SET name = EXCLUDED.name RETURNING *`,
      [userId, testName, testNumber]
    );
    await pool.query(
      `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
       VALUES ($1, $2, $3, 0, 0.00, 0.00, NOW())
       ON CONFLICT (user_id, customer_number) DO UPDATE SET balance = 0.00 RETURNING *`,
      [userId, testNumber, testName]
    );
    let loyalty = await pool.query("SELECT balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, testNumber]);
    console.log("✅ Customer created. Balance:", loyalty.rows[0].balance);
    if (parseFloat(loyalty.rows[0].balance) !== 0.00) throw new Error("Expected initial balance 0.00");

    // ── 2. SIMULATE SPLIT PAYMENT ORDER (total 600, paid 200, credit 400) ──
    console.log("\n2. Simulating split payment order: total ₹600, paid ₹200, credit ₹400...");
    const orderTotal = 600.00;
    const paidAmt = 200.00;
    const creditAmt = 400.00;

    // Insert order simulating orderRoutes POST /
    const orderRef = `TEST-SPLIT-001`;
    const orderRes = await pool.query(
      `INSERT INTO orders (
        user_id, order_reference, customer_name, customer_number, items, 
        total_price, payment_method, status, payment_status, 
        table_number, address, source, discount_amount, tax_cgst, tax_sgst, tip_amount, bill_no, order_type, delivery_charge, service_charge,
        paid_amount, credit_amount, created_at
      ) VALUES ($1, $2, $3, $4, '[]', $5, 'SPLIT', 'COMPLETED', 'PARTIALLY_PAID', '0', 'POS', 'POS_TERMINAL', 0, 0, 0, 0, '12345', 'QUICK', 0, 0, $6, $7, NOW()) RETURNING *`,
      [userId, orderRef, testName, testNumber, orderTotal, paidAmt, creditAmt]
    );
    console.log("✅ Order inserted. payment_status:", orderRes.rows[0].payment_status, "credit_amount:", orderRes.rows[0].credit_amount);

    // Deduct credit_amount from customer balance
    await pool.query(
      `UPDATE customer_loyalty SET balance = COALESCE(balance, 0) - $1, last_visit = NOW()
       WHERE user_id = $2 AND customer_number = $3`,
      [creditAmt, userId, testNumber]
    );
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'CREDIT_PURCHASE', $3, 0, 'Credit purchase (split) for Order Bill: 12345', NOW())`,
      [userId, testNumber, -creditAmt]
    );

    loyalty = await pool.query("SELECT balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, testNumber]);
    console.log("✅ After split credit purchase. Customer Balance:", loyalty.rows[0].balance);
    if (parseFloat(loyalty.rows[0].balance) !== -400.00) throw new Error("Expected balance -400.00");

    // ── 3. SIMULATE CANCELLATION REFUND OF SPLIT ORDER (refund credit portion 400) ──
    console.log("\n3. Simulating cancellation of split order...");
    const orderObj = orderRes.rows[0];
    
    // Compute refund amount: if SPLIT, refund credit_amount
    const creditRefundAmount = (orderObj.payment_method === 'CREDIT')
      ? parseFloat(orderObj.total_price)
      : ((orderObj.payment_method === 'SPLIT') ? parseFloat(orderObj.credit_amount) : 0);

    console.log(`   Calculated credit refund amount: ₹${creditRefundAmount}`);
    if (creditRefundAmount !== 400.00) throw new Error("Expected credit refund amount to be 400.00");

    await pool.query(
      `UPDATE customer_loyalty SET balance = COALESCE(balance, 0) + $1
       WHERE user_id = $2 AND customer_number = $3`,
      [creditRefundAmount, userId, testNumber]
    );
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'CREDIT_REFUND', $3, 0, 'Credit refund for cancelled Split Order', NOW())`,
      [userId, testNumber, creditRefundAmount]
    );

    loyalty = await pool.query("SELECT balance FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, testNumber]);
    const afterRefund = parseFloat(loyalty.rows[0].balance);
    console.log("✅ After refund. Balance:", afterRefund);
    if (afterRefund !== 0.00) throw new Error("Expected balance 0.00 after refund");

    // ── 4. VERIFY FULL LEDGER ────────────────────────────────
    console.log("\n4. Verifying transaction ledger...");
    const txs = await pool.query(
      "SELECT type, amount, reason FROM customer_transactions WHERE customer_number = $1 ORDER BY created_at ASC",
      [testNumber]
    );
    console.log("   Total transactions:", txs.rows.length);
    txs.rows.forEach((t, i) => {
      console.log(`   ${i+1}. [${t.type}] Amount: ${t.amount} — "${t.reason}"`);
    });

    if (txs.rows.length !== 2) throw new Error("Expected 2 transaction records");

    console.log("\n🎉 ALL SPLIT PAYMENT FLOW TESTS PASSED SUCCESSFULLY!\n");

    // ── CLEANUP ─────────────────────────────────────────
    await pool.query("DELETE FROM customer_transactions WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM orders WHERE customer_number = $1 AND user_id = $2", [testNumber, userId]);
    await pool.query("DELETE FROM customer_loyalty WHERE customer_number = $1", [testNumber]);
    await pool.query("DELETE FROM customers WHERE number = $1 AND user_id = $2", [testNumber, userId]);
    console.log("🧹 Test data cleaned up.");

  } catch (err) {
    console.error("❌ TEST FAILED:", err);
  } finally {
    pool.end();
  }
}

testSplitPaymentFlow();
