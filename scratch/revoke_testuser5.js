const pool = require('../db');
async function run() {
    try {
        await pool.query("UPDATE app_users SET web_access = false WHERE username = 'testuser5'");
        console.log("✅ Success: testuser5 web_access has been strictly revoked.");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
