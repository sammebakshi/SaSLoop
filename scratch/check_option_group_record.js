const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    console.log("=== Querying option group 'MEETHI' ===");
    const res = await pool.query(
      "SELECT * FROM option_groups WHERE name = 'MEETHI'"
    );
    console.log("Option Group record:", JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
