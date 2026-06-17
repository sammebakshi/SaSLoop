const { initializeDatabase } = require("../dbInit");
const pool = require("../db");

async function run() {
    try {
        await initializeDatabase();
        console.log("Database initialized.");
        
        // Verify tables exist
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
              AND table_name IN ('discounts', 'additional_charges')
        `);
        console.log("Created tables found:", tables.rows);
    } catch (e) {
        console.error("Error running initialization test:", e);
    } finally {
        await pool.end();
    }
}

run();
