const pool = require("./db");

async function clearAllData() {
    console.log("⚠️  PREPARING TO WIPE DATA...");
    try {
        // 1. Clear Orders
        await pool.query("TRUNCATE TABLE orders RESTART IDENTITY CASCADE");
        console.log("✅ Orders cleared.");

        // 2. Clear CRM Contacts
        await pool.query("TRUNCATE TABLE marketing_contacts RESTART IDENTITY CASCADE");
        console.log("✅ CRM Contacts cleared.");

        // 3. Clear Loyalty Points
        await pool.query("TRUNCATE TABLE customer_loyalty RESTART IDENTITY CASCADE");
        console.log("✅ Loyalty Points cleared.");

        // 4. Clear Chats
        await pool.query("TRUNCATE TABLE chat_messages RESTART IDENTITY CASCADE");
        console.log("✅ Chat history cleared.");

        // 5. Clear Sessions
        await pool.query("TRUNCATE TABLE conversation_sessions RESTART IDENTITY CASCADE");
        console.log("✅ Bot sessions cleared.");

        console.log("\n✨ ALL CUSTOMER & ORDER DATA WIPED SUCCESSFULLY!");
        process.exit(0);
    } catch (err) {
        console.error("❌ ERROR CLEARING DATA:", err.message);
        process.exit(1);
    }
}

clearAllData();
