const pool = require('../db');
async function migrate() {
    try {
        console.log("Migrating business_items...");
        await pool.query("ALTER TABLE business_items ADD COLUMN IF NOT EXISTS track_stock BOOLEAN DEFAULT FALSE");
        await pool.query("ALTER TABLE business_items ADD COLUMN IF NOT EXISTS ai_pricing BOOLEAN DEFAULT FALSE");
        await pool.query("ALTER TABLE business_items ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT 0");
        console.log("Migration successful!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
migrate();
