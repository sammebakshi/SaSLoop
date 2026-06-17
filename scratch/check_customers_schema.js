const pg = require('pg');
const pool = new pg.Pool({ connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db' });
pool.query(`
  SELECT conname, pg_get_constraintdef(c.oid) 
  FROM pg_constraint c 
  JOIN pg_namespace n ON n.oid = c.connamespace 
  WHERE conrelid = 'customers'::regclass;
`)
  .then(res => {
    console.log(res.rows);
    pool.end();
  })
  .catch(err => {
    console.error(err);
    pool.end();
  });
