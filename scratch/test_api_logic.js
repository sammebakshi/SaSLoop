const pool = require('../db');
async function testFetch() {
    try {
        const targetId = 10;
        const result = await pool.query("SELECT * FROM tax_product_groups WHERE user_id = $1 ORDER BY group_name ASC", [targetId]);
        console.log("DB Result for user 10:", JSON.stringify(result.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
testFetch();
