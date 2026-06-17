const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgres://postgres:Admin@123@localhost:5432/sasloop_db"
});

async function updateIndexes() {
  try {
    // 1. Drop the unique index on (menu_id, item_name)
    console.log("Dropping index idx_outlet_menu_items_menu_name...");
    await pool.query("DROP INDEX IF EXISTS idx_outlet_menu_items_menu_name");
    
    // 2. Create a partial unique index on (menu_id, short_code)
    console.log("Creating partial unique index on (menu_id, short_code)...");
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_outlet_menu_items_short_code 
      ON outlet_menu_items (menu_id, short_code) 
      WHERE short_code IS NOT NULL AND short_code != ''
    `);
    
    console.log("Indexes updated successfully.");
    process.exit(0);
  } catch (e) {
    console.error("Error updating indexes:", e);
    process.exit(1);
  }
}

updateIndexes();
