const pool = require("./db");

async function cleanSlate() {
    try {
        console.log("🧹 WIPING DATABASE FOR A CLEAN START...");
        
        await pool.query("TRUNCATE app_users CASCADE");
        await pool.query("TRUNCATE catalog CASCADE");
        await pool.query("TRUNCATE orders CASCADE");

        console.log("✅ DATABASE IS NOW EMPTY! Ready for your real business setup.");
    } catch (err) {
        console.error("❌ CLEANING ERROR:", err);
    }
}

cleanSlate();
