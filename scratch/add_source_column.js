const pool = require("../db");

async function addSourceColumn() {
    try {
        // Add source column if not exists
        await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS source VARCHAR(50)");
        console.log("Column 'source' added or already exists.");

        // Check if id is serial
        const idRes = await pool.query(
            "SELECT column_default FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'id'"
        );
        console.log("ID column default:", idRes.rows[0].column_default);

    } catch (err) {
        console.error("Error altering table:", err);
    } finally {
        await pool.end();
    }
}

addSourceColumn();
