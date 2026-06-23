const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "sasloop_db",
  password: "Admin@123",
  port: 5432,
});

async function run() {
  try {
    console.log("=== CHECKING RESTAURANTS DATABASE STATE ===");
    const res = await pool.query(
      "SELECT id, user_id, name, loyalty_enabled, loyalty_bill_amount_threshold, loyalty_points_earned FROM restaurants ORDER BY id"
    );
    console.table(res.rows);
  } catch (e) {
    console.error("Query failed:", e);
  } finally {
    await pool.end();
  }
}

run();
