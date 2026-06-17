const pool = require('../db');
async function run() {
    try {
        console.log("Attempting to delete User 13...");
        const res = await pool.query("DELETE FROM app_users WHERE id = 13");
        console.log("Deleted successfully!");
    } catch (e) {
        console.error("Deletion failed!");
        console.error("Error Code:", e.code);
        console.error("Error Detail:", e.detail);
        console.error("Message:", e.message);
    } finally {
        process.exit();
    }
}
run();
