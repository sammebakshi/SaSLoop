const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const cols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'item_option_groups'
    `);
    console.log('item_option_groups columns:');
    cols.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));

    // Query some data
    const data = await pool.query('SELECT * FROM item_option_groups LIMIT 10');
    console.log('\nitem_option_groups data:');
    console.log(data.rows);

    const og = await pool.query('SELECT * FROM option_groups LIMIT 10');
    console.log('\noption_groups data:');
    console.log(og.rows);

    const ol = await pool.query('SELECT * FROM options_list LIMIT 10');
    console.log('\noptions_list data:');
    console.log(ol.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
