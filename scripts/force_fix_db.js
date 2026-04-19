const pool = require("./db");

async function forceFix() {
    try {
        console.log("🛠️ FORCING DATABASE COLUMN UPDATE...");
        
        // 1. Rename/Create tables to match the bot's expectations
        await pool.query(`CREATE TABLE IF NOT EXISTS business_items (id SERIAL PRIMARY KEY, user_id INTEGER, product_name VARCHAR(255), category VARCHAR(100), price DECIMAL(10,2), availability BOOLEAN DEFAULT true)`);
        await pool.query(`CREATE TABLE IF NOT EXISTS conversation_sessions (id SERIAL PRIMARY KEY, customer_number VARCHAR(20), user_id INTEGER, state VARCHAR(100) DEFAULT 'IDLE', context JSONB DEFAULT '{}', updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(customer_number, user_id))`);

        // 2. Add missing columns to restaurants
        await pool.query("ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS business_type VARCHAR(100) DEFAULT 'Restaurant'");
        await pool.query("ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'");
        await pool.query("ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS address TEXT");
        
        console.log("✅ MASTER DATABASE FIX COMPLETED SUCCESSFULLY!");
        process.exit(0);
    } catch (err) {
        console.error("❌ FORCE FIX ERROR:", err);
        process.exit(1);
    }
}

forceFix();
