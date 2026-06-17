const pool = require('../db');
async function run() {
  try {
    const userRes = await pool.query("SELECT * FROM app_users WHERE id = 48");
    console.log("User 48:", userRes.rows);
    const joinRes = await pool.query(
      `SELECT r.id as restaurant_id, r.user_id, u.id as user_id_from_users 
       FROM restaurants r 
       JOIN app_users u ON r.user_id = u.id 
       WHERE r.user_id = 48`
    );
    console.log("Join result:", joinRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
