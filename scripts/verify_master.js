const pool = require('../db');
const bcrypt = require('bcrypt');

async function test() {
  try {
    const email = 'master@sasloop.com';
    const pwd = 'password123';
    
    const res = await pool.query('SELECT password FROM app_users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
        console.log("No user found with that email!");
        return;
    }
    
    const hash = res.rows[0].password;
    console.log("Database hash:", hash);
    
    const match = await bcrypt.compare(pwd, hash);
    console.log("Does 'Admin@123' match this hash?", match);

    // Try case sensitivity
    const matchLower = await bcrypt.compare('admin@123', hash);
    console.log("Does 'admin@123' (lowercase) match?", matchLower);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
test();
