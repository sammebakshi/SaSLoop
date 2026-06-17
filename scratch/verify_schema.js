const pool = require("../db");

async function verify() {
  try {
    // Check charge_details column on orders
    const r1 = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name='charge_details'`);
    console.log("orders.charge_details exists:", r1.rows.length > 0);

    // Check sale_price_2, sale_price_3 on outlet_menu_items
    const r2 = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='outlet_menu_items' AND column_name IN ('sale_price_2','sale_price_3') ORDER BY column_name`);
    console.log("outlet_menu_items price columns:", r2.rows.map(r => r.column_name));

    // Test creating an additional charge
    const r3 = await pool.query(`INSERT INTO additional_charges (user_id, name, amount, charge_type, applicable_on, is_active) VALUES (2, 'TEST_PACKING', 10.00, 'fixed', 'All Channels', true) RETURNING *`);
    console.log("Test charge created:", r3.rows[0]);

    // Clean up
    await pool.query(`DELETE FROM additional_charges WHERE name='TEST_PACKING' AND user_id=2`);
    console.log("Test charge cleaned up");

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}
verify();
