const pool = require("../db");

async function run() {
  try {
    const res = await pool.query(`
      SELECT count(*), count(image_url) as non_null_count
      FROM outlet_menu_items
    `);
    console.log("=== outlet_menu_items counts ===");
    console.log(res.rows[0]);

    const sampleNonNull = await pool.query(`
      SELECT id, item_name, image_url
      FROM outlet_menu_items
      WHERE image_url IS NOT NULL
      LIMIT 5
    `);
    console.log("=== Non-null sample ===");
    console.table(sampleNonNull.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
