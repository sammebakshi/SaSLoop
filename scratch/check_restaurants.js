const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'sasloop_db',
  password: 'Admin@123',
  port: 5432
});

async function main() {
  try {
    const res = await pool.query("SELECT id, user_id, name, loyalty_enabled, points_per_100, loyalty_bill_amount_threshold, loyalty_points_earned, loyalty_points_dinein, loyalty_points_pickup, loyalty_points_delivery FROM restaurants");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
