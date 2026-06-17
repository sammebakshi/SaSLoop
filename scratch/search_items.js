const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const q1 = await pool.query(`
      SELECT o.id, o.item_name, o.base_price, o.menu_id, o.item_type, o.item_id 
      FROM outlet_menu_items o 
      WHERE LOWER(o.item_name) LIKE '%rista%' 
         OR LOWER(o.item_name) LIKE '%kabab%' 
         OR LOWER(o.item_name) LIKE '%goshtaba%'
    `);
    console.log("Matching items in outlet_menu_items:");
    q1.rows.forEach(r => console.log(`  ${r.id}: ${r.item_name} (item_id: ${r.item_id}) - ₹${r.base_price} [menu:${r.menu_id}, type:${r.item_type}]`));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
