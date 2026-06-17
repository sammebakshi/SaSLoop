const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    // 1. Get menu ID for User 48
    const menuRes = await pool.query(
      "SELECT id FROM outlet_menus WHERE (outlet_id = 48 OR user_id = 48) AND is_digital_default = true LIMIT 1"
    );
    const menuId = menuRes.rows[0]?.id;
    console.log('Digital Default Menu ID for user 48:', menuId);

    // 2. Fetch all menu items for this menu
    const omi = await pool.query(
      "SELECT id, item_name, base_price, item_type FROM outlet_menu_items WHERE menu_id = $1 ORDER BY id",
      [menuId]
    );
    console.log(`\nItems in Menu ${menuId}:`);
    omi.rows.forEach(r => {
      if (r.item_name.includes('KABAB') || r.item_name === 'HALF' || r.item_name === 'FULL') {
        console.log(`  ${r.id}: ${r.item_name} - ${r.base_price} [type: ${r.item_type}]`);
      }
    });

    // 3. Fetch item option groups
    const iog = await pool.query(`
      SELECT iog.id, iog.item_id, omi.item_name as main_item, iog.group_id, og.name as group_name 
      FROM item_option_groups iog 
      JOIN outlet_menu_items omi ON iog.item_id = omi.id 
      JOIN option_groups og ON iog.group_id = og.id 
      WHERE omi.menu_id = $1
    `, [menuId]);
    console.log('\nItem option groups for this menu:');
    console.log(iog.rows);

    // 4. Fetch options list
    const ol = await pool.query(`
      SELECT ol.id, ol.group_id, og.name as group_name, ol.name as option_name, ol.price_override 
      FROM options_list ol 
      JOIN option_groups og ON ol.group_id = og.id 
      WHERE og.user_id = 48
    `);
    console.log('\nOptions list:');
    console.log(ol.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
