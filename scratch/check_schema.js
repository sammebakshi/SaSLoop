const pool = require('../db');

async function check() {
  try {
    const r = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'customer_loyalty' ORDER BY ordinal_position"
    );
    console.log("customer_loyalty columns:", JSON.stringify(r.rows, null, 2));

    const r2 = await pool.query("SELECT * FROM customer_loyalty LIMIT 3");
    console.log("sample data:", JSON.stringify(r2.rows, null, 2));
  } catch (e) {
    console.error(e.message);
  }
  process.exit();
}
check();
