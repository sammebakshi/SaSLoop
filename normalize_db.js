const pool = require("./db");

async function normalize() {
    console.log("🧹 Normalizing Phone Numbers & Fixing Contribution...");
    try {
        // Fix spaces
        await pool.query(`UPDATE customer_loyalty SET customer_number = regexp_replace(customer_number, '\s+', '', 'g')`);
        await pool.query(`UPDATE orders SET customer_number = regexp_replace(customer_number, '\s+', '', 'g')`);
        
        // Fix NULL contribution (This was the ₹0 bug)
        await pool.query(`UPDATE customer_loyalty SET total_spent = 0 WHERE total_spent IS NULL`);
        
        console.log("✅ Database normalized! Existing ₹0 contribution issues fixed.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

normalize();
