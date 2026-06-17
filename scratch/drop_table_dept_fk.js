const pool = require("../db");

async function dropFK() {
    try {
        await pool.query("ALTER TABLE table_departments DROP CONSTRAINT table_departments_outlet_id_fkey");
        console.log("Dropped constraint table_departments_outlet_id_fkey successfully");
        process.exit(0);
    } catch (err) {
        console.error("Failed to drop constraint:", err);
        process.exit(1);
    }
}

dropFK();
