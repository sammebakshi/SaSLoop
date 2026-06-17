const pool = require('../db');

async function checkMenuItems() {
    try {
        const res = await pool.query("SELECT DISTINCT category FROM business_items");
        console.log("Distinct category values in business_items:");
        console.table(res.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkMenuItems();
