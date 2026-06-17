const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const userId = 48;
    // Check some option groups for this user
    const ogs = await pool.query(
      "SELECT id, name, min_selectable, max_selectable, is_addon FROM option_groups WHERE user_id = $1",
      [userId]
    );
    console.log(`Option groups for user ${userId}:`, ogs.rows);

    if (ogs.rows.length > 0) {
      // Check mappings in item_option_groups
      const mappings = await pool.query(
        `SELECT iog.id, iog.item_id, iog.group_id, omi.item_name 
         FROM item_option_groups iog 
         JOIN outlet_menu_items omi ON iog.item_id = omi.id 
         WHERE iog.group_id IN (${ogs.rows.map(g => g.id).join(',')}) 
         LIMIT 20`
      );
      console.log('Sample item mappings (item_option_groups):', mappings.rows);
      
      // Check options inside groups
      const opts = await pool.query(
        `SELECT id, group_id, name, price_override 
         FROM options_list 
         WHERE group_id IN (${ogs.rows.map(g => g.id).join(',')}) 
         ORDER BY group_id, sorting_order`
      );
      console.log('Options list:', opts.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
