const pool = require("../db");

async function check() {
  try {
    const res = await pool.query(
      `SELECT settings->'active_pos_state' as active_state FROM restaurants WHERE user_id = 48`
    );
    console.log("=== Active POS State for User 48 ===");
    console.log(JSON.stringify(res.rows[0]?.active_state, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
