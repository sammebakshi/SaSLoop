const pool = require('../db');
const userId = 8;
pool.query("SELECT * FROM tax_product_groups WHERE user_id = $1 ORDER BY group_name ASC", [userId])
    .then(res => console.log("Success:", res.rows.length))
    .catch(err => console.log("ERROR:", err.message))
    .finally(() => process.exit());
