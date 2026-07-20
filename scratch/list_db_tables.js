const pool = require('../db');

async function listTables() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log("Database Tables:", res.rows.map(r => r.table_name));
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    process.exit();
  }
}

listTables();
