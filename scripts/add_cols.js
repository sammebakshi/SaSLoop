const pool = require("./db");

async function run() {
  try {
    await pool.query("ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS business_type VARCHAR(50) DEFAULT 'restaurant'");
    await pool.query("ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb");
    console.log("Columns added successfully");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
