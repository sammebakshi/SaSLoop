const pool = require("../db");

async function check() {
  try {
    const cols = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'outlet_order_types'"
    );
    console.log("Columns in outlet_order_types:");
    console.table(cols.rows);

    const rows = await pool.query("SELECT * FROM outlet_order_types LIMIT 10");
    console.log("Sample rows in outlet_order_types:");
    console.log(rows.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

check();
