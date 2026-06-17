const pool = require('../db');

async function checkCategories() {
    try {
        const catRes = await pool.query("SELECT * FROM categories");
        console.log("Categories in categories table:");
        console.table(catRes.rows);

        const itemRes = await pool.query("SELECT DISTINCT category FROM items");
        console.log("Distinct categories in items table:");
        console.table(itemRes.rows);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkCategories();
