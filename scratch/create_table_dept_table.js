const pool = require('../db');
const sql = `
CREATE TABLE IF NOT EXISTS table_departments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES app_users(id),
    brand_id INTEGER,
    outlet_id INTEGER,
    department_name VARCHAR(255) NOT NULL,
    tax_product_group_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

pool.query(sql)
    .then(() => console.log("Table 'table_departments' created successfully!"))
    .catch(console.error)
    .finally(() => process.exit());
