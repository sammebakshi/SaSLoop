const pool = require('../db');

async function run() {
  try {
    const colsRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'delivery_partners'
    `);
    console.log('delivery_partners columns:');
    colsRes.rows.forEach(r => {
      console.log(`- ${r.column_name} (${r.data_type})`);
    });

    const rowsRes = await pool.query('SELECT * FROM delivery_partners LIMIT 10');
    console.log('delivery_partners rows:', rowsRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
