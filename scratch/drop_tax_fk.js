const pool = require("../db");

async function dropFK() {
    try {
        await pool.query("ALTER TABLE tax_configurations DROP CONSTRAINT tax_configurations_outlet_id_fkey");
        console.log("Dropped constraint tax_configurations_outlet_id_fkey successfully");
        process.exit(0);
    } catch (err) {
        console.error("Failed to drop constraint:", err);
        process.exit(1);
    }
}

dropFK();
