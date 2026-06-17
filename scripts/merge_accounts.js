const pool = require("./db");

async function mergeAccounts() {
    console.log("🔄 MERGING DUPLICATE ACCOUNTS...");
    try {
        // 1. Get all loyalty records
        const { rows } = await pool.query("SELECT * FROM customer_loyalty");
        
        const accounts = {}; // { normalizedPhone: { id, points, total_spent, name } }

        for (let row of rows) {
            const normalized = row.customer_number.replace(/\s+/g, "");
            
            if (accounts[normalized]) {
                // DUPLICATE FOUND! Merge into the first one
                console.log(`🔗 Merging ${row.customer_number} into ${accounts[normalized].customer_number}`);
                
                const mainAccount = accounts[normalized];
                const newPoints = (mainAccount.points || 0) + (row.points || 0);
                const newSpent = (parseFloat(mainAccount.total_spent) || 0) + (parseFloat(row.total_spent) || 0);
                
                // Update the main account
                await pool.query(
                    "UPDATE customer_loyalty SET points = $1, total_spent = $2 WHERE id = $3",
                    [newPoints, newSpent, mainAccount.id]
                );
                
                // Delete the duplicate
                await pool.query("DELETE FROM customer_loyalty WHERE id = $1", [row.id]);
                
                // Also update orders to point to the normalized number
                await pool.query("UPDATE orders SET customer_number = $1 WHERE customer_number = $2", [normalized, row.customer_number]);
            } else {
                // First time seeing this number
                accounts[normalized] = row;
                // Normalize the number in place for the "main" account
                if (row.customer_number !== normalized) {
                    await pool.query("UPDATE customer_loyalty SET customer_number = $1 WHERE id = $2", [normalized, row.id]);
                }
            }
        }
        
        console.log("✅ ALL ACCOUNTS MERGED SUCCESSFULLY!");
        process.exit(0);
    } catch (err) {
        console.error("❌ MERGE FAILED:", err.message);
        process.exit(1);
    }
}

mergeAccounts();
