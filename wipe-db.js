const pool = require("./db");

async function wipeUserData(userId) {
    if (!userId) {
        console.error("Please provide a userId as an argument. Usage: node wipe-db.js <userId>");
        process.exit(1);
    }

    try {
        console.log(`🧹 WIPING DATA FOR USER ID: ${userId}...`);

        // Wipe Orders
        await pool.query("DELETE FROM orders WHERE user_id = $1", [userId]);
        console.log("✅ Orders cleared");

        // Wipe Marketing Contacts
        await pool.query("DELETE FROM marketing_contacts WHERE user_id = $1", [userId]);
        console.log("✅ Marketing contacts cleared");

        // Wipe Customer Loyalty
        await pool.query("DELETE FROM customer_loyalty WHERE user_id = $1", [userId]);
        console.log("✅ Loyalty data cleared");

        // Wipe Chat Messages
        await pool.query("DELETE FROM chat_messages WHERE user_id = $1", [userId]);
        console.log("✅ Chat history cleared");

        // Wipe AI Sessions
        await pool.query("DELETE FROM conversation_sessions WHERE user_id = $1", [userId]);
        console.log("✅ AI Sessions cleared");

        console.log("\n✨ DATABASE IS NOW FRESH FOR USER ID:", userId);
    } catch (e) {
        console.error("❌ Wipe Failed:", e.message);
    } finally {
        process.exit();
    }
}

// Get userId from command line argument
const userId = process.argv[2];
wipeUserData(userId);
