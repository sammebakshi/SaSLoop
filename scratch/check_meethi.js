const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const res = await pool.query("SELECT id, menu_id, short_code, item_name, base_price, category_id, item_type FROM outlet_menu_items WHERE short_code IN ('DG30', 'DG11', 'DG12', 'DG20', 'DG21', 'DG31', 'DG32') OR item_name ILIKE '%MEETHI%' ORDER BY id ASC");
  console.log("MATCHING ITEMS:");
  res.rows.forEach(r => {
    console.log(`id: ${r.id}, menu_id: ${r.menu_id}, short_code: ${r.short_code}, item_name: ${r.item_name}, item_type: ${r.item_type}, category_id: ${r.category_id}`);
  });

  console.log("\n--- RANGE AROUND DG30 ---");
  const dg30Res = await pool.query("SELECT id, menu_id FROM outlet_menu_items WHERE short_code = 'DG30'");
  if (dg30Res.rows.length > 0) {
    const dg30Id = dg30Res.rows[0].id;
    const menuId = dg30Res.rows[0].menu_id;
    const around = await pool.query("SELECT id, menu_id, short_code, item_name, base_price, category_id, item_type FROM outlet_menu_items WHERE menu_id = $1 AND id >= $2 - 5 AND id <= $2 + 10 ORDER BY id ASC", [menuId, dg30Id]);
    around.rows.forEach(r => {
      console.log(`id: ${r.id}, menu_id: ${r.menu_id}, short_code: ${r.short_code}, item_name: ${r.item_name}, item_type: ${r.item_type}, category_id: ${r.category_id}`);
    });
  }

  pool.end();
}

run().catch(console.error);
