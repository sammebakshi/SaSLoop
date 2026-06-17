const pool = require('../db');

async function runTest() {
  try {
    console.log("=== DB QUERY TEST ===");
    
    // Check riders
    const ridersRes = await pool.query("SELECT * FROM delivery_partners");
    console.log("Riders in DB:", ridersRes.rows);
    if (ridersRes.rows.length === 0) {
      console.log("Inserting a test rider...");
      await pool.query("INSERT INTO delivery_partners (id, user_id, name, phone, status) VALUES (1, 55, 'Test Rider 1', '9876543210', 'active') ON CONFLICT (id) DO NOTHING");
    }

    // Check waiters
    const waitersRes = await pool.query("SELECT id, name, username FROM app_users LIMIT 5");
    console.log("Waiters in DB:", waitersRes.rows);
    const firstWaiterId = waitersRes.rows[0]?.id || null;

    // Test INSERT query
    console.log("\nTesting INSERT with rider_id and waiter_id...");
    const insertRes = await pool.query(
      `INSERT INTO orders (
        user_id, restaurant_id, order_reference, customer_name, customer_number, items, 
        total_price, payment_method, status, payment_status, 
        table_number, address, source, discount_amount, tax_cgst, tax_sgst, tip_amount, bill_no, order_type, delivery_charge, service_charge,
        pre_order_id, pre_order_advance, pre_order_balance, paid_amount, credit_amount, waiter_id, charge_details, device_id, pre_order_scheduled_date, pre_order_scheduled_time, coupon_code, rider_id, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, NOW()) RETURNING *, 
        (SELECT COALESCE(name, username) FROM app_users WHERE id = waiter_id) as waiter_name,
        (SELECT name FROM delivery_partners WHERE id = rider_id) as rider_name,
        (SELECT phone FROM delivery_partners WHERE id = rider_id) as rider_phone`,
      [
        55, 1, `TEST-REF-${Date.now()}`, 'Walk-in', '+919906123989', 
        '[]', 150.00, 'CASH', 
        'COMPLETED', 'PAID',
        '0', 'DELIVERY', 'POS_WINDOWS',
        0, 0, 0, 0, '9999', 'DELIVERY',
        0, 0,
        null, 0, 0,
        150.00, 0, firstWaiterId,
        '[]',
        'DEV-TEST',
        null,
        null,
        null,
        1 // rider_id
      ]
    );
    console.log("INSERT Result returned fields:", {
      id: insertRes.rows[0].id,
      waiter_id: insertRes.rows[0].waiter_id,
      waiter_name: insertRes.rows[0].waiter_name,
      rider_id: insertRes.rows[0].rider_id,
      rider_name: insertRes.rows[0].rider_name,
      rider_phone: insertRes.rows[0].rider_phone
    });

    const insertedId = insertRes.rows[0].id;

    // Test UPDATE query
    console.log("\nTesting UPDATE with rider_id...");
    const updateRes = await pool.query(
      `UPDATE orders SET
        customer_name = $1, customer_number = $2, items = $3,
        total_price = $4, payment_method = $5, status = $6,
        payment_status = $7, table_number = $8, address = $9,
        discount_amount = $10, tax_cgst = $11, tax_sgst = $12,
        tip_amount = $13, bill_no = $14, order_type = $15,
        delivery_charge = $16, service_charge = $17,
        paid_amount = $18, credit_amount = $19, waiter_id = $20,
        charge_details = $21,
        pre_order_scheduled_date = $24,
        pre_order_scheduled_time = $25,
        coupon_code = $26,
        rider_id = $27
      WHERE id = $22 AND user_id = $23 RETURNING *, 
        (SELECT COALESCE(name, username) FROM app_users WHERE id = waiter_id) as waiter_name,
        (SELECT name FROM delivery_partners WHERE id = rider_id) as rider_name,
        (SELECT phone FROM delivery_partners WHERE id = rider_id) as rider_phone`,
      [
        'Walk-in Updated', '+919906123989', '[]',
        160.00, 'CASH', 'COMPLETED',
        'PAID',
        '0',
        'DELIVERY',
        0, 0, 0,
        0, '9999', 'DELIVERY',
        0, 0,
        160.00, 0, firstWaiterId,
        '[]',
        insertedId, 55,
        null,
        null,
        null,
        1 // rider_id
      ]
    );
    console.log("UPDATE Result returned fields:", {
      id: updateRes.rows[0].id,
      waiter_name: updateRes.rows[0].waiter_name,
      rider_name: updateRes.rows[0].rider_name,
      rider_phone: updateRes.rows[0].rider_phone
    });

    // Test GET queries
    console.log("\nTesting SELECT recent query...");
    let queryText = `
       SELECT o.*, 
              COALESCE(w.name, w.username) as waiter_name,
              dp.name as rider_name,
              dp.phone as rider_phone
       FROM orders o 
       LEFT JOIN app_users w ON o.waiter_id = w.id 
       LEFT JOIN delivery_partners dp ON o.rider_id = dp.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC LIMIT 1`;
    const selectRes = await pool.query(queryText, [55]);
    console.log("SELECT Result:", {
      id: selectRes.rows[0].id,
      waiter_name: selectRes.rows[0].waiter_name,
      rider_name: selectRes.rows[0].rider_name,
      rider_phone: selectRes.rows[0].rider_phone
    });

    // Cleanup
    await pool.query("DELETE FROM orders WHERE id = $1", [insertedId]);
    console.log("\nCleanup successful.");

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    process.exit();
  }
}

runTest();
