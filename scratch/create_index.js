const pool = require("../db");

async function createIndex() {
    try {
        await pool.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_outlet_menu_items_menu_name 
            ON outlet_menu_items (menu_id, item_name)
        `);
        console.log("Index created successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createIndex();
