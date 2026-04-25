// c:\Users\Sajad\Desktop\SaSLoop\backend\clear_data.js

const pool = require("./db");

async function clearAllData() {
    console.log("⚠️  PREPARING TO WIPE ALL SALES & CUSTOMER DATA...");
    try {
        const tables = [
            "orders",
            "marketing_contacts",
            "customer_loyalty",
            "chat_messages",
            "conversation_sessions",
            "customer_feedback",
            "loyalty_otps",
            "audit_logs",
            "system_notifications"
        ];

        for (const table of tables) {
            try {
                await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
                console.log(`✅ Table '${table}' cleared.`);
            } catch (e) {
                console.log(`ℹ️ Table '${table}' not found or already empty.`);
            }
        }

        console.log("\n✨ DATABASE WIPED SUCCESSFULLY! System is now fresh.");
        process.exit(0);
    } catch (err) {
        console.error("❌ ERROR CLEARING DATA:", err.message);
        process.exit(1);
    }
}

clearAllData();
