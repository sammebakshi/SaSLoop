const pool = require('../db');

async function check() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('TABLES:', res.rows.map(x => x.table_name));
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

check();
