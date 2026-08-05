const pool = require('../db');
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%order%'")
  .then(r => { console.log('ORDER TABLES:', r.rows.map(c => c.table_name)); process.exit(0); })
  .catch(e => { console.error(e.message); process.exit(1); });
