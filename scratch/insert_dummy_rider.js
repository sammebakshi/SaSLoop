const pool = require('../db');

async function run() {
  try {
    const result = await pool.query(
      `INSERT INTO delivery_partners (user_id, name, phone, status) 
       VALUES (55, 'Test Rider 1', '9876543210', 'active') RETURNING *`
    );
    console.log('Dummy rider inserted:', result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
