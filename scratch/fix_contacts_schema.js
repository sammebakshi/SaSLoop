
const pool = require("./db");

async function migrate() {
    try {
        console.log("🚀 Starting Database Migration...");
        
        // Add total_spent to marketing_contacts if missing
        await pool.query(`
            ALTER TABLE marketing_contacts 
            ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0,
            ADD COLUMN IF NOT EXISTS last_order_at TIMESTAMP DEFAULT NOW();
        `);
        
        console.log("✅ Database Migration Successful!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration Failed:", err.message);
        process.exit(1);
    }
}

migrate();
