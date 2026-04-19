const pool = require("./db");

async function wipeDatabase() {
    console.log("🧹 WHIPING DATABASE FOR PRODUCTION...");
    try {
        const tables = [
            "orders", "chat_messages", "conversation_sessions", 
            "customer_loyalty", "business_items", "recharge_requests", 
            "marketing_contacts", "customer_feedback", "system_notifications",
            "restaurants"
        ];
        
        console.log(`Cleaning ${tables.length} tables...`);
        await pool.query(`TRUNCATE TABLE ${tables.join(", ")} CASCADE`);
        
        const userWipe = await pool.query("DELETE FROM app_users WHERE role != 'master_admin'");
        console.log(`✅ DATABASE WIPED SUCCESSFULLY. ${userWipe.rowCount} users removed. Only Master Admin remains.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ WIPE FAILED:", err);
        process.exit(1);
    }
}

wipeDatabase();
