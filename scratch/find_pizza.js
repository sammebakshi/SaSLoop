const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // Find all menu items matching 'pizza'
    const items = await pool.query(
      `SELECT omi.id, omi.menu_id, omi.item_name, omi.base_price, m.user_id, m.outlet_id 
       FROM outlet_menu_items omi
       JOIN outlet_menus m ON omi.menu_id = m.id
       WHERE omi.item_name ILIKE '%pizza%'`
    );
    console.log('Pizza Menu Items:', items.rows);

    // Find option groups matching 'pizza' or user 8
    const ogs = await pool.query(
      `SELECT og.id, og.name, og.user_id, og.min_selectable, og.max_selectable 
       FROM option_groups og
       WHERE og.name ILIKE '%pizza%' OR og.user_id = 8`
    );
    console.log('Option Groups matching pizza or user 8:', ogs.rows);

    // Find any mappings for those items or groups
    if (items.rows.length > 0) {
      const itemIds = items.rows.map(i => i.id);
      const mappings = await pool.query(
        `SELECT iog.id, iog.item_id, iog.group_id, omi.item_name, og.name as group_name
         FROM item_option_groups iog
         JOIN outlet_menu_items omi ON iog.item_id = omi.id
         JOIN option_groups og ON iog.group_id = og.id
         WHERE iog.item_id = ANY($1) OR og.name ILIKE '%pizza%'`,
        [itemIds]
      );
      console.log('Pizza/group mappings:', mappings.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
