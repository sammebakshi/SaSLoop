const pool = require('./backend/db');

async function testInsert() {
  try {
    await pool.query(
      `INSERT INTO app_users 
      (first_name, last_name, username, parentage, dof, email, password, phone, address, role, security_question, security_answer, business_type, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'active')`,
      [
        "Test First",
        "Test Last",
        "testuser2",
        "test parentage",
        "" || null, // Wait, "" || null in JS evaluates to null.
        "testbiz2@example.com",
        "password",
        "123",
        "addr",
        "user",
        "Favorite color?",
        "Blue",
        "restaurant"
      ]
    );
    console.log("Success with blank/null");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

testInsert();
