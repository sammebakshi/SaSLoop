const pool = require("../db");
const bcrypt = require("bcrypt");

async function reset() {
    try {
        const hashed = await bcrypt.hash("Admin@123", 10);
        const res = await pool.query("UPDATE app_users SET password = $1 WHERE username = 'shahetehzeeb' OR email = 'sammebakshi@gmail.com' RETURNING id", [hashed]);
        if (res.rows.length > 0) {
            console.log("✅ Password reset to Admin@123 for user ID:", res.rows[0].id);
        } else {
            console.log("❌ User not found");
        }
        process.exit(0);
    } catch (e) {
        console.error("DB ERROR:", e.message);
        process.exit(1);
    }
}

reset();
