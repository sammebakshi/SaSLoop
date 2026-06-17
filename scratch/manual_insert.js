const pool = require('../db');
pool.query("INSERT INTO tax_product_groups (user_id, group_name) VALUES (10, 'FOODS')")
    .then(() => console.log("Manual Insert Success"))
    .catch(err => console.error("Insert Error:", err.message))
    .finally(() => process.exit());
