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
    const waiters = await pool.query("SELECT * FROM waiters;");
    console.log("WAITERS TABLE:");
    console.table(waiters.rows);

    const users = await pool.query("SELECT id, username, role FROM app_users;");
    console.log("APP USERS TABLE:");
    console.table(users.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();
