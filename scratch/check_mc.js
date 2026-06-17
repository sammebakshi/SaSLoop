const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db' });
pool.query(`
    SELECT conname, pg_get_constraintdef(c.oid) 
    FROM pg_constraint c 
    WHERE conrelid = 'marketing_contacts'::regclass;
`).then(r => {
    console.log(r.rows);
    pool.end();
}).catch(e => {
    console.error(e);
    pool.end();
});
