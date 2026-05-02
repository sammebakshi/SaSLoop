const pool = require('../db');
async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pos_tables (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
        table_name VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'AVAILABLE',
        capacity INTEGER DEFAULT 4,
        x_pos FLOAT DEFAULT 100,
        y_pos FLOAT DEFAULT 100,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_pos_tables_user ON pos_tables(user_id);
    `);
    console.log("✅ pos_tables table created successfully");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
migrate();
