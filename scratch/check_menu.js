const pool = require("../db");
async function run() {
  try {
    const session = await pool.query("SELECT * FROM conversation_sessions WHERE user_id = 48 AND customer_number = '+917006089744'");
    console.log("=== SESSION ===");
    console.log(JSON.stringify(session.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
