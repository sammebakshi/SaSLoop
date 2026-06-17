const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const q = await pool.query(
      "SELECT id, role, text, created_at FROM chat_messages WHERE customer_number = $1 ORDER BY created_at DESC LIMIT 15",
      ['+917006089744']
    );
    console.log("Recent chat messages for +917006089744 (newest first):");
    q.rows.forEach(r => {
      console.log(`[${r.role} at ${r.created_at}]`);
      console.log(r.text);
      console.log("------------------------");
    });
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
