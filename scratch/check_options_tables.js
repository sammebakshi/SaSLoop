const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const tablesRes = await pool.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema='public' AND table_name LIKE '%option%'`
    );
    console.log('Tables matching "option":', tablesRes.rows);

    const tablesRes2 = await pool.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema='public' AND table_name LIKE '%modifier%'`
    );
    console.log('Tables matching "modifier":', tablesRes2.rows);
    
    // Inspect schemas of relevant tables
    const targets = ['option_groups', 'options_list', 'item_option_groups'];
    for (const table of targets) {
      const exists = await pool.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`, [table]);
      if (exists.rows[0].exists) {
        const columns = await pool.query(
          `SELECT column_name, data_type 
           FROM information_schema.columns 
           WHERE table_name = $1`,
          [table]
        );
        console.log(`\nSchema for "${table}":`);
        columns.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
      } else {
        console.log(`\nTable "${table}" does not exist.`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
