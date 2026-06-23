const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'sasloop_db',
  password: 'Admin@123',
  port: 5432
});

async function main() {
  try {
    const userRes = await pool.query("SELECT * FROM app_users WHERE username = 'shahetehzeebpos'");
    console.log("User:", userRes.rows);
    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      const parentId = user.parent_user_id || user.id;
      const restRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [parentId]);
      console.log("Restaurant Info:");
      console.log(restRes.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
