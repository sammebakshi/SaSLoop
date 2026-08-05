const pool = require('../db');
async function run() {
  try {
    const colOrd = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'");
    console.log('orders columns:', colOrd.rows.map(c => c.column_name));
    
    const sampleOrd = await pool.query("SELECT * FROM orders ORDER BY id DESC LIMIT 2");
    console.log('SAMPLE ORDER:', sampleOrd.rows[0]);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
