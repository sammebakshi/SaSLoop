const pool = require("./db");

async function checkTables() {
    try {
        const res = await pool.query("SELECT * FROM pos_tables");
        console.log("Total tables in DB:", res.rowCount);
        console.table(res.rows);
        
        const users = await pool.query("SELECT id, name, email FROM app_users");
        console.log("Users in DB:");
        console.table(users.rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

checkTables();
