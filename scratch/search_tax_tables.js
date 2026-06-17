const pool = require('../db');
pool.query("SELECT table_name FROM information_schema.tables WHERE table_name LIKE '%tax%'")
    .then(res => console.log(JSON.stringify(res.rows, null, 2)))
    .finally(() => process.exit());
