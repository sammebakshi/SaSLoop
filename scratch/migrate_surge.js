const pool = require('../db');
async function migrate() {
    try {
        console.log("Migrating restaurants for surge...");
        await pool.query("ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS current_surge_multiplier NUMERIC DEFAULT 1.0");
        console.log("Migration successful!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
migrate();
