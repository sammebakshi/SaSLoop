const pool = require('../db');

// Duplicate of getItemOptions from whatsappManager.js
async function getItemOptions(itemId, userId) {
    const ogRes = await pool.query(
        `SELECT og.id, og.name, og.min_selectable, og.max_selectable 
         FROM item_option_groups iog
         JOIN option_groups og ON iog.option_group_id = og.id
         WHERE iog.item_id = $1 AND og.is_active = true`,
        [itemId]
    );
    if (ogRes.rows.length === 0) return null;
    const og = ogRes.rows[0];
    
    const optsRes = await pool.query(
        `SELECT id, name, price, is_active FROM options_list 
         WHERE option_group_id = $1 AND is_active = true ORDER BY price ASC`,
        [og.id]
    );
    if (optsRes.rows.length === 0) return null;
    return {
        group: og,
        options: optsRes.rows.map(r => ({ id: r.id, name: r.name, price: parseFloat(r.price) }))
    };
}

async function run() {
  try {
    const ids = [5638, 5635, 5640, 5650];
    for (const id of ids) {
      const nameRes = await pool.query("SELECT item_name FROM outlet_menu_items WHERE id = $1", [id]);
      const name = nameRes.rows[0]?.item_name;
      const opts = await getItemOptions(id, 48);
      console.log(`\nItem ID ${id} (${name}):`);
      console.log(opts);
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
