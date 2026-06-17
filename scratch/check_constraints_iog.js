const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:Admin%40123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const res = await pool.query(
      `SELECT conname, pg_get_constraintdef(c.oid) 
       FROM pg_constraint c 
       JOIN pg_namespace n ON n.oid = c.connamespace 
       WHERE conrelid = 'item_option_groups'::regclass`
    );
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
