const pool = require("../db");

async function addColumn() {
    try {
        await pool.query(`ALTER TABLE outlet_menu_items ADD COLUMN IF NOT EXISTS image_url text`);
        console.log("Added image_url column to outlet_menu_items");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

addColumn();
