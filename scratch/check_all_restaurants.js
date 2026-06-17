const pool = require("../db");

async function run() {
  try {
    console.log("=== ALL RESTAURANTS ===");
    const res = await pool.query("SELECT id, user_id, name, loyalty_enabled, loyalty_bill_amount_threshold, loyalty_points_earned, loyalty_points_dinein, loyalty_points_pickup, loyalty_points_delivery FROM restaurants");
    console.log(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
