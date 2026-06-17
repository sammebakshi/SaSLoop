const pool = require('../db');
async function run() {
  try {
    const res = await pool.query(
      `SELECT * FROM conversation_sessions WHERE customer_number LIKE '%7006089744%'`
    );
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
