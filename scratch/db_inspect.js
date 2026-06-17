const pool = require("../db");

async function run() {
  try {
    console.log("=== DB INSPECT ===");
    
    // Check tables
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables:", tablesRes.rows.map(r => r.table_name));

    // Inspect columns of app_users table
    const columnsRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'app_users'
    `);
    console.log("app_users columns:", columnsRes.rows.map(c => `${c.column_name} (${c.data_type})`));

    // Query all users
    const usersRes = await pool.query("SELECT id, username, email, role, business_name, brand_name FROM app_users LIMIT 30");
    console.log("Users records:");
    console.table(usersRes.rows);

    // Query all restaurants/outlets
    const restRes = await pool.query("SELECT id, name, user_id FROM restaurants LIMIT 30");
    console.log("Restaurants records:");
    console.table(restRes.rows);

  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await pool.end();
  }
}

run();
