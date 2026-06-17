const pool = require("../db");

async function seed() {
    try {
        console.log("🌱 Seeding default discounts for User 48...");
        
        // Clear existing test discounts for user 48 to avoid duplicates
        await pool.query("DELETE FROM discounts WHERE user_id = 48 AND name IN ('Rime Group 100% OFF', 'PayTM Offer 10% OFF')");

        // Insert first discount
        const res1 = await pool.query(
            `INSERT INTO discounts (user_id, name, rate, discount_type, is_active)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [48, 'Rime Group 100% OFF', 100.00, 'percent', true]
        );
        console.log("Inserted:", res1.rows[0]);

        // Insert second discount
        const res2 = await pool.query(
            `INSERT INTO discounts (user_id, name, rate, discount_type, is_active)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [48, 'PayTM Offer 10% OFF', 10.00, 'percent', true]
        );
        console.log("Inserted:", res2.rows[0]);

        console.log("✅ Seeding complete!");
        process.exit(0);
    } catch (e) {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    }
}

seed();
