const pool = require("../db");
const bcrypt = require("bcrypt");

async function run() {
    try {
        const hash = await bcrypt.hash("password123", 10);
        console.log("Setting passwords to 'password123' (hash:", hash, ")...");

        const res1 = await pool.query("UPDATE app_users SET password = $1 WHERE username = 'masteradmin';", [hash]);
        console.log("Updated masteradmin:", res1.rowCount);

        const res2 = await pool.query("UPDATE app_users SET password = $1 WHERE username = 'shahetehzeeb';", [hash]);
        console.log("Updated shahetehzeeb:", res2.rowCount);

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}
run();
