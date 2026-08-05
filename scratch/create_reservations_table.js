const pool = require('../db');
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS table_reservations (
        id SERIAL PRIMARY KEY,
        user_id INT,
        outlet_id INT,
        reservation_ref VARCHAR(50) UNIQUE,
        customer_name VARCHAR(255),
        customer_phone VARCHAR(50),
        guests_count INT DEFAULT 2,
        reservation_date DATE NOT NULL,
        reservation_time VARCHAR(50) NOT NULL,
        seating_preference VARCHAR(100) DEFAULT 'Indoor',
        special_notes TEXT,
        assigned_table_number VARCHAR(50),
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ table_reservations table created successfully!');
  } catch(e) {
    console.error('Error creating table:', e);
  } finally {
    process.exit(0);
  }
}
createTable();
