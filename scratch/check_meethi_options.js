const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    console.log("=== Querying MEETHI (DG30) details ===");
    const meethiRes = await pool.query(
      "SELECT id, short_code, item_name, item_type, menu_id FROM outlet_menu_items WHERE short_code = 'DG30' OR item_name ILIKE '%MEETHI%' LIMIT 5"
    );
    console.log("MEETHI item:", meethiRes.rows);

    if (meethiRes.rows.length > 0) {
      const meethi = meethiRes.rows[0];
      
      console.log("\n=== Querying items surrounding MEETHI (DG30) by ID ===");
      const surroundingRes = await pool.query(
        "SELECT id, short_code, item_name, item_type, menu_id, category_id FROM outlet_menu_items WHERE menu_id = $1 AND id >= $2 - 5 AND id <= $2 + 10 ORDER BY id ASC",
        [meethi.menu_id, meethi.id]
      );
      console.table(surroundingRes.rows);
      
      console.log("\n=== Querying ALL option items in same menu and category ===");
      const allCategoryOptionsRes = await pool.query(
        "SELECT id, short_code, item_name, item_type, category_id FROM outlet_menu_items WHERE menu_id = $1 AND item_type = '1' ORDER BY id ASC LIMIT 20",
        [meethi.menu_id]
      );
      console.table(allCategoryOptionsRes.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
