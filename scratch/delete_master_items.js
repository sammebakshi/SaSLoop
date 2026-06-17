const pool = require("../db");

async function deleteItems() {
    try {
        const res = await pool.query(`DELETE FROM business_items`);
        console.log("Deleted items count:", res.rowCount);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

deleteItems();
