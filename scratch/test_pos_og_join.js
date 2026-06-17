const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  try {
    const outletId = 48;
    console.log("=== RUNNING MODIFIED POS OPTION GROUPS QUERY ===");
    const query = `
      SELECT og.id, og.name, og.min_selectable, og.max_selectable, bi.id as item_id, omi.id as outlet_menu_item_id
      FROM option_groups og
      JOIN item_option_groups iog ON og.id = iog.group_id
      JOIN outlet_menu_items omi ON iog.item_id = omi.id
      JOIN business_items bi ON omi.short_code = bi.code AND bi.user_id = $1
      WHERE og.outlet_id = $1 AND og.is_active = true
    `;
    const result = await pool.query(query, [outletId]);
    console.log("RESULT ROWS:", result.rows);
  } catch (err) {
    console.error("QUERY FAILED:", err.message);
  }
  pool.end();
}

run().catch(console.error);
