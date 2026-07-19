const pool = require("../db");

async function listUsers() {
    try {
        console.log("Listing current users in database...");
        const res = await pool.query("SELECT id, name, username, email, role, phone, parent_user_id, owner_id FROM app_users ORDER BY id ASC");
        console.log("\n--- USERS ---");
        console.table(res.rows);
        console.log("\nListing designations...");
        const desRes = await pool.query("SELECT * FROM outlet_designations");
        console.table(desRes.rows);
    } catch (err) {
        console.error("Error listing users:", err.message);
    } finally {
        await pool.end();
    }
}

listUsers();
