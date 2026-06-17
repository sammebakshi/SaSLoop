const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function main() {
  const res = await pool.query(
    "SELECT id, customer_number, role, text, created_at FROM chat_messages WHERE customer_number LIKE '%7006089744' ORDER BY created_at DESC LIMIT 20"
  );
  console.log("Total rows:", res.rows.length);
  res.rows.forEach(row => {
    const txt = (row.text || "").substring(0, 60);
    console.log(`ID:${row.id} | ${row.role} | ${txt} | ${row.created_at}`);
  });
  await pool.end();
}
main().catch(e => { console.error(e); pool.end(); });
