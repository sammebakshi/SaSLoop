const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const categories = await pool.query(
      "SELECT id, name FROM categories WHERE user_id = 48 ORDER BY sorting_order"
    );
    console.log("=== CATEGORIES ===");
    categories.rows.forEach(c => console.log(`  ${c.id}: ${c.name}`));

    const items = await pool.query(
      "SELECT id, item_name, base_price, item_type, category_id FROM outlet_menu_items WHERE menu_id = 33 ORDER BY id"
    );
    console.log("\n=== ITEMS IN MENU 33 ===");
    items.rows.forEach(r => console.log(`  ${r.id}: ${r.item_name} - ${r.base_price} [type: ${r.item_type}] [category: ${r.category_id}]`));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
