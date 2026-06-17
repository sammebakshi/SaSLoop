const pool = require('../db');
pool.query("INSERT INTO kitchen_departments (user_id, department_name) VALUES (8, 'TEST')")
    .then(() => console.log("Success"))
    .catch(err => console.log("ERROR:", err.message))
    .finally(() => process.exit());
