const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const userId = 48;
    const res = await pool.query(
      `SELECT id, menu_name, is_digital_default, is_pos_default 
       FROM outlet_menus 
       WHERE user_id = $1 OR outlet_id = $1`,
      [userId]
    );
    console.log('All menus:');
    console.log(res.rows);
    
    for (const menu of res.rows) {
      const activeItemsRes = await pool.query(
        `SELECT COUNT(*) as active_cnt 
         FROM outlet_menu_items 
         WHERE menu_id = $1 AND is_active = true`,
        [menu.id]
      );
      const inactiveItemsRes = await pool.query(
        `SELECT COUNT(*) as inactive_cnt 
         FROM outlet_menu_items 
         WHERE menu_id = $1 AND is_active = false`,
        [menu.id]
      );
      console.log(`Menu ${menu.id} (${menu.menu_name}): Active Items = ${activeItemsRes.rows[0].active_cnt}, Inactive Items = ${inactiveItemsRes.rows[0].inactive_cnt}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
