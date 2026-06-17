const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    console.log("=== ALL OPTION GROUPS ===");
    const ogRes = await pool.query(
      "SELECT id, name, user_id, outlet_id, is_active FROM option_groups WHERE user_id = 48"
    );
    console.log(ogRes.rows);

    console.log("\n=== ALL ITEM OPTION GROUPS (iog) ===");
    const iogRes = await pool.query(`
      SELECT iog.id, iog.group_id, iog.item_id, og.name as group_name
      FROM item_option_groups iog
      JOIN option_groups og ON iog.group_id = og.id
      WHERE og.user_id = 48
    `);
    console.log(iogRes.rows);

    console.log("\n=== RESOLVING iog ITEM REFERENCES IN outlet_menu_items ===");
    for (const link of iogRes.rows) {
      const omiRes = await pool.query(
        "SELECT id, item_name, base_price, item_type, menu_id FROM outlet_menu_items WHERE id = $1",
        [link.item_id]
      );
      if (omiRes.rows.length === 0) {
        console.log(`  Link ID ${link.id}: group '${link.group_name}' (ID ${link.group_id}) -> Stale ID ${link.item_id} (NOT FOUND)`);
      } else {
        const omi = omiRes.rows[0];
        console.log(`  Link ID ${link.id}: group '${link.group_name}' (ID ${link.group_id}) -> Valid ID ${link.item_id} ('${omi.item_name}', type ${omi.item_type}, menu ${omi.menu_id})`);
      }
    }

    console.log("\n=== OPTIONS FOR EACH GROUP ===");
    for (const group of ogRes.rows) {
      const olRes = await pool.query(
        "SELECT id, name, price_override, is_active FROM options_list WHERE group_id = $1",
        [group.id]
      );
      console.log(`  Group '${group.name}' (ID ${group.id}) options:`);
      console.log(olRes.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
