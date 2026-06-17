const pool = require('../db');
const sql = `
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='table_departments' AND column_name='brand_id') THEN
        ALTER TABLE table_departments ADD COLUMN brand_id INTEGER;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='table_departments' AND column_name='name') THEN
        ALTER TABLE table_departments RENAME COLUMN name TO department_name;
    END IF;
END $$;
`;

pool.query(sql)
    .then(() => console.log("Table 'table_departments' schema updated successfully!"))
    .catch(console.error)
    .finally(() => process.exit());
