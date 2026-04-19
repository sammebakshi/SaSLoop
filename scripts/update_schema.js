const pool = require("./db");

async function updateSchema() {
  try {
    console.log("Adding columns to app_users...");
    
    // Check if column exists or just run ALTER TABLE with IF NOT EXISTS (Postgres 9.6+ has IF NOT EXISTS for ADD COLUMN)
    const queries = [
      "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS username VARCHAR(255)",
      "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS parentage VARCHAR(255)",
      "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS dof DATE",
      "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS gst_number VARCHAR(100)",
      "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255)",
      "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS bot_knowledge TEXT",
      "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS broadcast_credits INTEGER DEFAULT 500"
    ];

    for (let q of queries) {
      await pool.query(q);
      console.log("Executed:", q);
    }

    console.log("Schema update complete!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}

updateSchema();
