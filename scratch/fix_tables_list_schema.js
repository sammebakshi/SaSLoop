const pool = require('../db');
const sql = `
ALTER TABLE tables_list ADD COLUMN IF NOT EXISTS brand_id INTEGER;
`;

pool.query(sql)
    .then(() => console.log("Table 'tables_list' schema updated successfully!"))
    .catch(console.error)
    .finally(() => process.exit());
