const pool = require("./db");

async function listUsers() {
    try {
        const res = await pool.query("SELECT id, name, email, business_name FROM app_users");
        console.log("\n--- SYSTEM USERS ---");
        console.table(res.rows);
        console.log("\nUse the 'id' from the table above with your wipe-db.js script.");
        console.log("Example: node wipe-db.js 1\n");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

listUsers();
