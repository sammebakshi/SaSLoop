const pool = require('../db');

async function check() {
  try {
    console.log('=== OPTION GROUPS FOR USER 55 ===');
    const og = await pool.query("SELECT * FROM option_groups WHERE user_id = 55 OR outlet_id = 55 ORDER BY id DESC");
    console.log(og.rows);

    for (let g of og.rows) {
      console.log(`\n=== GROUP ID ${g.id} (${g.name}) ===`);
      const opts = await pool.query('SELECT * FROM options_list WHERE group_id = $1', [g.id]);
      console.log('OPTIONS:', opts.rows);

      const items = await pool.query(`
        SELECT iog.*, omi.item_name, omi.short_code, omi.menu_id
        FROM item_option_groups iog
        JOIN outlet_menu_items omi ON omi.id = iog.item_id
        WHERE iog.group_id = $1
      `, [g.id]);
      console.log('LINKED ITEMS:', items.rows);
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

check();
