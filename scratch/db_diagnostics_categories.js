const pool = require("../db");

async function checkCategories() {
  try {
    const cats = await pool.query(
      "SELECT id, user_id, outlet_id, name, sorting_order, is_active FROM categories"
    );
    console.log("ALL CATEGORIES IN DATABASE:");
    console.table(cats.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkCategories();
