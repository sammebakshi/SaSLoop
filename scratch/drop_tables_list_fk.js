const pool = require("../db");

async function dropConstraint() {
    try {
        await pool.query("ALTER TABLE tables_list DROP CONSTRAINT IF EXISTS tables_list_outlet_id_fkey");
        console.log("Dropped constraint tables_list_outlet_id_fkey successfully");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dropConstraint();
