const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'restaurants'
    `);
    console.log("Restaurants columns:");
    columns.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));

    const res = await pool.query("SELECT id, name, user_id, notification_numbers, settings FROM restaurants");
    console.log("\nRestaurants Rows:");
    res.rows.forEach(r => {
      console.log(`ID: ${r.id}, Name: ${r.name}, User ID: ${r.user_id}`);
      console.log(`  Notification Numbers: ${JSON.stringify(r.notification_numbers)}`);
      console.log(`  Settings: ${JSON.stringify(r.settings)}`);
    });
  } catch (err) {
    console.error(err.message);
  } finally {
    await pool.end();
  }
}
run();
