const pool = require('../db');
async function run() {
    try {
        console.log("Starting migration...");
        
        // Add missing columns
        await pool.query("ALTER TABLE outlet_menu_items ADD COLUMN IF NOT EXISTS item_type VARCHAR(100) DEFAULT 'Menu Item'");
        console.log("ITEM_TYPE ADDED");

        await pool.query("ALTER TABLE outlet_menu_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true");
        console.log("IS_ACTIVE ADDED");

        // Fix digital_discount type
        // First, check if it's already a boolean. If so, drop and recreate or alter.
        // Dropping and recreating is easier if there's no critical data yet.
        // But better to alter.
        await pool.query("ALTER TABLE outlet_menu_items ALTER COLUMN digital_discount DROP DEFAULT");
        await pool.query("ALTER TABLE outlet_menu_items ALTER COLUMN digital_discount TYPE NUMERIC USING (CASE WHEN digital_discount THEN 1 ELSE 0 END)");
        await pool.query("ALTER TABLE outlet_menu_items ALTER COLUMN digital_discount SET DEFAULT 0");
        console.log("DIGITAL_DISCOUNT TYPE FIXED");

        console.log("Migration successful!");
    } catch(e) {
        console.error("Migration failed:", e);
    }
    process.exit(0);
}
run();
