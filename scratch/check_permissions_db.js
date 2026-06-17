const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const config = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
} : {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "sasloop_db",
  password: process.env.DB_PASSWORD || "Admin@123",
  port: process.env.DB_PORT || 5432
};

const pool = new Pool(config);

async function run() {
  try {
    const res = await pool.query(`
      SELECT id, username, role, staff_permissions FROM app_users 
      WHERE staff_permissions IS NOT NULL AND staff_permissions::text <> '{}'
    `);
    console.log(`Found ${res.rows.length} users with staff_permissions.`);
    res.rows.forEach(r => {
      console.log(`\nUser: ${r.username} (role: ${r.role})`);
      console.log(JSON.stringify(r.staff_permissions, null, 2));
    });
  } catch (err) {
    console.error("Database query failed:", err);
  } finally {
    await pool.end();
  }
}

run();
