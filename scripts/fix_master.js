const pool = require("./db");
async function fixMaster() {
    try {
        await pool.query("UPDATE app_users SET role = 'master_admin', brand_name = 'SaSLoop ERP | AI' WHERE username = 'masteradmin'");
        console.log("✅ Master Admin Role Fixed!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fixMaster();
