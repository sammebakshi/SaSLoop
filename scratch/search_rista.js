const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query("SELECT id, item_name, base_price, is_active FROM outlet_menu_items WHERE item_name ILIKE '%rista%'");
    console.log('Matches in outlet_menu_items:', res.rows);
    
    const res2 = await pool.query("SELECT id, product_name, price, availability FROM business_items WHERE product_name ILIKE '%rista%'");
    console.log('Matches in business_items:', res2.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
