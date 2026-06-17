const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    console.log("Resetting RISTA, GOSHTABA, CHEESE PIZZA, HALF, FULL in menu 33 to active...");
    const r1 = await pool.query("UPDATE outlet_menu_items SET is_active = true WHERE menu_id = 33 AND id IN (5638, 5779, 5637, 5640, 5636) RETURNING id, item_name, is_active");
    console.log("Updated outlet_menu_items:", r1.rows);

    console.log("Resetting items in business_items for user 48 to availability = true...");
    const r2 = await pool.query("UPDATE business_items SET availability = true WHERE user_id = 48 AND product_name IN ('RISTA', 'GOSHTABA', 'CHEESE PIZZA', 'HALF', 'FULL') RETURNING id, product_name, availability");
    console.log("Updated business_items:", r2.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
