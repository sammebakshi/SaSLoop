const pool = require("../db");

async function runMigration() {
    console.log("🚀 Running Mobile Auth & Tiered Delivery Migration...");
    try {
        const queries = [
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_tiers JSONB DEFAULT '[]'`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS is_auth_required BOOLEAN DEFAULT false`,
            `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS fulfillment_options JSONB DEFAULT '{"dinein": true, "pickup": true, "delivery": true}'`,
            // Add distance_charge to orders to track what was paid
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_charge DECIMAL(10,2) DEFAULT 0.00`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_lat DECIMAL(10,6)`,
            `ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_long DECIMAL(10,6)`
        ];

        for (let q of queries) {
            await pool.query(q);
        }
        console.log("✅ Migration Successful");
    } catch (err) {
        console.error("❌ Migration Failed:", err);
    } finally {
        process.exit();
    }
}

runMigration();
