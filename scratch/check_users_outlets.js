const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://postgres:Admin%40123@localhost:5432/sasloop_db"
});

async function run() {
  const users = await pool.query("SELECT id, name, username, role, parent_user_id, status FROM app_users ORDER BY id ASC");
  console.log("APP USERS:");
  users.rows.forEach(u => {
    console.log(`id: ${u.id}, name: ${u.name}, username: ${u.username}, role: ${u.role}, parent: ${u.parent_user_id}, status: ${u.status}`);
  });

  const restaurants = await pool.query("SELECT id, user_id, name FROM restaurants");
  console.log("\nRESTAURANTS:");
  restaurants.rows.forEach(r => {
    console.log(`id: ${r.id}, user_id: ${r.user_id}, name: ${r.name}`);
  });

  pool.end();
}

run().catch(console.error);
