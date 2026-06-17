const pool = require("../db");

async function check() {
  try {
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    console.log("All tables containing 'order' or 'type':");
    const matched = tables.rows
      .map(r => r.table_name)
      .filter(t => t.includes('order') || t.includes('type') || t.includes('price') || t.includes('pricing'));
    console.log(matched);

    for (const tbl of matched) {
      try {
        const countRes = await pool.query(`SELECT COUNT(*) FROM ${tbl}`);
        console.log(`Table ${tbl}: ${countRes.rows[0].count} rows`);
      } catch (err) {
        console.log(`Table ${tbl}: error reading - ${err.message}`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

check();
