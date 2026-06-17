const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    console.log("Backfilling image_url, price and availability from outlet_menu_items to business_items...");
    const res = await pool.query(
      `SELECT id, item_id, image_url, base_price, is_active, food_type, short_code, description, menu_id
       FROM outlet_menu_items 
       WHERE item_id IS NOT NULL`
    );
    console.log(`Found ${res.rows.length} linked items to sync.`);
    let updateCount = 0;
    for (const row of res.rows) {
      const menuRes = await pool.query("SELECT user_id FROM outlet_menus WHERE id = $1", [row.menu_id]);
      if (menuRes.rows.length === 0) continue;
      const userId = menuRes.rows[0].user_id;

      const isVeg = row.food_type?.toLowerCase() === 'veg';
      const price = parseFloat(row.base_price) || 0;
      const desc = row.description || '';

      await pool.query(
        `UPDATE business_items SET 
           code = COALESCE($1, code), 
           price = $2, 
           availability = $3, 
           image_url = COALESCE($4, image_url), 
           description = COALESCE($5, description), 
           is_veg = $6
         WHERE id = $7 AND user_id = $8`,
        [row.short_code, price, row.is_active, row.image_url, desc, isVeg, row.item_id, userId]
      );
      updateCount++;
    }
    console.log(`Successfully backfilled ${updateCount} items!`);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
