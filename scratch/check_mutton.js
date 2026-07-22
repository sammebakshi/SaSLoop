const pool = require('../db');

async function check() {
  try {
    console.log('=== ALL OPTION GROUPS IN DB ===');
    const allOg = await pool.query("SELECT * FROM option_groups ORDER BY id DESC LIMIT 20");
    console.log(allOg.rows);

    for (let g of allOg.rows) {
      const opts = await pool.query('SELECT * FROM options_list WHERE group_id = $1', [g.id]);
      console.log(`\nGroup ID ${g.id} (${g.name}) -> Options:`, opts.rows);
      const items = await pool.query('SELECT * FROM item_option_groups WHERE group_id = $1', [g.id]);
      console.log(`Group ID ${g.id} (${g.name}) -> Linked Items:`, items.rows);
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

check();
