const pool = require("../db");

async function run() {
  try {
    const res = await pool.query("SELECT * FROM restaurants");
    console.log("RESTAURANTS:", res.rows.map(r => ({
      id: r.id,
      name: r.name,
      user_id: r.user_id,
      loyalty_enabled: r.loyalty_enabled,
      loyalty_bill_amount_threshold: r.loyalty_bill_amount_threshold,
      loyalty_points_earned: r.loyalty_points_earned,
      loyalty_points_dinein: r.loyalty_points_dinein,
      loyalty_points_pickup: r.loyalty_points_pickup,
      loyalty_points_delivery: r.loyalty_points_delivery
    })));
    
    const usersRes = await pool.query("SELECT id, username, parent_user_id, role FROM app_users");
    console.log("USERS:", usersRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
