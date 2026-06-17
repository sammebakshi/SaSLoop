const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgres://postgres:Admin@123@localhost:5432/sasloop_db"
});

async function fix() {
  try {
    console.log("Dropping broken constraint...");
    await pool.query("ALTER TABLE outlet_menus DROP CONSTRAINT IF EXISTS outlet_menus_outlet_id_fkey");
    
    console.log("Adding correct constraint to app_users...");
    await pool.query("ALTER TABLE outlet_menus ADD CONSTRAINT outlet_menus_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES app_users(id)");
    
    console.log("SUCCESS!");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

fix();
