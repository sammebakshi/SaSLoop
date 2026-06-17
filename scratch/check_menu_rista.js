const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const userId = 48; // Business user ID
    const menuRes = await pool.query(
      `SELECT id, menu_name FROM outlet_menus 
       WHERE (outlet_id = $1 OR user_id = $1) AND is_digital_default = true LIMIT 1`,
      [userId]
    );
    console.log('Default digital menu:', menuRes.rows);
    
    if (menuRes.rows.length > 0) {
      const menuId = menuRes.rows[0].id;
      const itemsRes = await pool.query(
        `SELECT omi.id, omi.item_name, omi.base_price, omi.is_active, c.name as category
         FROM outlet_menu_items omi
         LEFT JOIN categories c ON omi.category_id = c.id
         WHERE omi.menu_id = $1 AND omi.item_type = '0'
         ORDER BY omi.id ASC`,
        [menuId]
      );
      
      console.log(`Total items in default digital menu (ID ${menuId}):`, itemsRes.rows.length);
      const ristaMatches = itemsRes.rows.filter(i => i.item_name.toUpperCase().includes('RISTA'));
      console.log('RISTA matches in default digital menu:', ristaMatches);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
