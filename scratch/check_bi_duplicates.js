const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const res = await pool.query("SELECT id, code, product_name, category, price FROM business_items WHERE user_id = 48 AND code IN ('DG30', 'DG19')");
  console.log("business_items for user 48:");
  res.rows.forEach(r => {
    console.log(r);
  });
  pool.end();
}

run().catch(console.error);
