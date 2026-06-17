const pool = require('../db');
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    .then(res => console.log(JSON.stringify(res.rows, null, 2)))
    .catch(console.error)
    .finally(() => process.exit());
