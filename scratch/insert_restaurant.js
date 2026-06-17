const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sasloop_db',
  password: 'Admin@123',
  port: 5432,
});

(async () => {
  try {
    const res = await pool.query("INSERT INTO restaurants (user_id, name) VALUES (55, 'Test Restaurant') ON CONFLICT (user_id) DO NOTHING;");
    console.log("Insert result:", res);
    
    const restaurants = await pool.query("SELECT * FROM restaurants;");
    console.log("Current restaurants:");
    console.table(restaurants.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
