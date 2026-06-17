const pool = require("../db");

async function testAll() {
  console.log("Running validations on database schema & query interfaces...");
  try {
    // 1. Verify outlet_menu_items column addition
    const omiColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'outlet_menu_items' 
        AND column_name IN ('sale_price_2', 'sale_price_3')
    `);
    console.log("outlet_menu_items new price columns status:", omiColumns.rows);

    // 2. Verify orders column addition
    const orderColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
        AND column_name = 'charge_details'
    `);
    console.log("orders charge_details column status:", orderColumns.rows);

    // 3. Test insert an order with charge_details
    console.log("Fetching a valid user_id...");
    const userRes = await pool.query("SELECT id FROM app_users LIMIT 1");
    if (userRes.rows.length === 0) {
      throw new Error("No users found in app_users table. Please create/seed one first.");
    }
    const testUserId = userRes.rows[0].id;
    console.log(`Inserting a test order with charge details using user_id: ${testUserId}...`);
    const testItems = [{ id: 999, name: "Test Kabab", price: 100, qty: 1 }];
    const testCharges = [
      { name: "Service Charge", type: "percent", value: 10, amount: 10 },
      { name: "Custom Charge", type: "fixed", value: 5, amount: 5 }
    ];

    const orderInsert = await pool.query(`
      INSERT INTO orders (
        user_id, order_reference, customer_name, customer_number, items,
        total_price, payment_method, status, payment_status, bill_no, order_type,
        delivery_charge, charge_details, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()) RETURNING *
    `, [
      testUserId,
      "TEST-REF-123456",
      "Test Customer",
      "+919999999999",
      JSON.stringify(testItems),
      115.00,
      "CASH",
      "COMPLETED",
      "PAID",
      "9999",
      "DINEIN",
      15.00,
      JSON.stringify(testCharges)
    ]);
    console.log("Test order inserted successfully! ID:", orderInsert.rows[0].id);

    // 4. Test fetch order with charge_details
    const fetchOrder = await pool.query("SELECT id, charge_details FROM orders WHERE id = $1", [orderInsert.rows[0].id]);
    console.log("Fetched order charge details:", typeof fetchOrder.rows[0].charge_details, fetchOrder.rows[0].charge_details);

    // Clean up
    await pool.query("DELETE FROM orders WHERE id = $1", [orderInsert.rows[0].id]);
    console.log("Test order cleaned up.");

  } catch (err) {
    console.error("Test validation failed:", err);
  } finally {
    await pool.end();
  }
}

testAll();
