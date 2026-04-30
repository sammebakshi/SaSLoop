const pool = require('./db');

async function mergeLoyalty() {
    console.log("🚀 Starting Loyalty Merge & Cleanup...");
    
    try {
        // 1. Get all loyalty entries
        const res = await pool.query("SELECT * FROM customer_loyalty");
        const entries = res.rows;
        console.log(`📊 Found ${entries.length} total entries.`);

        const map = {};

        // 2. Group by normalized number (digits only, last 10 digits)
        entries.forEach(e => {
            const digits = e.customer_number.replace(/\D/g, "");
            const last10 = digits.slice(-10);
            if (!last10) return;

            if (!map[last10]) {
                map[last10] = [];
            }
            map[last10].push(e);
        });

        for (const last10 in map) {
            const group = map[last10];
            if (group.length > 1) {
                console.log(`\n🔄 Merging ${group.length} entries for number ending in ...${last10}`);
                
                let totalPoints = 0;
                let totalSpent = 0;
                let bestName = "";
                let bestLastVisit = null;
                const idsToDelete = [];
                let primaryId = group[0].id;

                group.forEach((e, idx) => {
                    totalPoints += (parseInt(e.points) || 0);
                    totalSpent += (parseFloat(e.total_spent) || 0);
                    
                    // Keep the "best" name (not 'Customer' or 'Guest' if possible)
                    if (e.name && e.name !== 'Customer' && e.name !== 'Guest') {
                        bestName = e.name;
                        primaryId = e.id; // Make the one with the real name the primary
                    } else if (!bestName) {
                        bestName = e.name;
                    }

                    if (!bestLastVisit || new Date(e.last_visit) > new Date(bestLastVisit)) {
                        bestLastVisit = e.last_visit;
                    }
                });

                // Collect IDs to delete (all except primary)
                group.forEach(e => {
                    if (e.id !== primaryId) idsToDelete.push(e.id);
                });

                // 1. Delete duplicates first to free up the unique constraint
                if (idsToDelete.length > 0) {
                    await pool.query("DELETE FROM customer_loyalty WHERE id = ANY($1)", [idsToDelete]);
                    console.log(`🗑️ Deleted ${idsToDelete.length} duplicates.`);
                }

                // 2. Update primary with combined data and standardized number
                const standardizedNum = `+91${last10}`; 
                await pool.query(
                    "UPDATE customer_loyalty SET points=$1, total_spent=$2, name=$3, last_visit=$4, customer_number=$5 WHERE id=$6",
                    [totalPoints, totalSpent, bestName, bestLastVisit, standardizedNum, primaryId]
                );
                console.log(`✅ Result: ${bestName} | Total Points: ${totalPoints} | Total Spent: ₹${totalSpent}`);
            } else {
                // Even for single entries, let's standardize the format to +91
                const e = group[0];
                const digits = e.customer_number.replace(/\D/g, "");
                const last10Num = digits.slice(-10);
                const standardizedNum = `+91${last10Num}`;
                if (e.customer_number !== standardizedNum) {
                    await pool.query("UPDATE customer_loyalty SET customer_number=$1 WHERE id=$2", [standardizedNum, e.id]);
                }
            }
        }

        console.log("\n✨ Cleanup Complete! All loyalty records are now merged and standardized.");
    } catch (err) {
        console.error("❌ Error during merge:", err);
    } finally {
        process.exit();
    }
}

mergeLoyalty();
