const pool = require('../db');
pool.query("SELECT COUNT(*) FROM restaurants")
    .then(res => console.log("Total restaurants:", res.rows[0].count))
    .catch(console.error)
    .finally(() => process.exit());
