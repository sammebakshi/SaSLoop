const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function run() {
  try {
    const ogs = await pool.query(
      `SELECT og.id, og.name, og.user_id, og.min_selectable, og.max_selectable, u.email
       FROM option_groups og
       LEFT JOIN app_users u ON og.user_id = u.id
       ORDER BY og.user_id, og.id`
    );
    console.log('All Option Groups:', ogs.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
