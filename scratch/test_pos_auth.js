const pool = require('../db');
const bcrypt = require('bcrypt');

async function testLogin() {
    const username = 'shahetehzeeb';
    const password = 'Admin@123'; // As per reset_password.js

    try {
        const result = await pool.query(
            "SELECT * FROM app_users WHERE (username = $1 OR email = $1) AND status = 'active'",
            [username]
        );

        if (result.rows.length === 0) {
            console.log("❌ User not found or inactive");
            return;
        }

        const user = result.rows[0];
        const validPass = await bcrypt.compare(password, user.password);
        if (validPass) {
            console.log("✅ Login successful for", username);
        } else {
            console.log("❌ Invalid password for", username);
        }
    } catch (err) {
        console.error("❌ DB ERROR:", err.message);
    } finally {
        process.exit();
    }
}

testLogin();
