const pool = require("../db");

async function checkMenuCounts() {
  try {
    const res = await pool.query(
      "SELECT menu_id, COUNT(*) FROM outlet_menu_items GROUP BY menu_id ORDER BY menu_id ASC"
    );
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkMenuCounts();
