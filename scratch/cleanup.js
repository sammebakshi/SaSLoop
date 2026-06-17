const pool = require("../db");

async function cleanup() {
  try {
    console.log("Cleaning up mock order 58...");
    await pool.query(
      "DELETE FROM orders WHERE user_id = 48 AND id = 58"
    );
    console.log("Resetting active_pos_state to null...");
    await pool.query(
      "UPDATE restaurants SET settings = jsonb_set(COALESCE(settings, '{}'::jsonb), '{active_pos_state}', 'null'::jsonb) WHERE user_id = 48"
    );
    console.log("Cleanup completed successfully.");
  } catch (err) {
    console.error("Cleanup Error:", err);
  } finally {
    await pool.end();
  }
}

cleanup();
