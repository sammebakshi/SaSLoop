const pool = require('../db');

async function fix() {
  try {
    console.log("??? CREATING outlet_designations TABLE AND ADDING designation_id COLUMN...");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS outlet_designations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        outlet_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, name, outlet_id)
      )
    `);
    console.log("? Created outlet_designations table");

    await pool.query(`
      ALTER TABLE app_users ADD COLUMN IF NOT EXISTS designation_id INTEGER REFERENCES outlet_designations(id) ON DELETE SET NULL
    `);
    console.log("? Added designation_id column to app_users");

  } catch (err) {
    console.error("Error fixing DB:", err);
  } finally {
    await pool.end();
  }
}

fix();
