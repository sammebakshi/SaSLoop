const pool = require("../db");

async function testSave() {
    try {
        const userRes = await pool.query("SELECT id FROM app_users LIMIT 1");
        const ownerId = userRes.rows[0].id;

        const result = await pool.query(
            `INSERT INTO tax_configurations 
             (user_id, tax_name, display_name, tax_value, tax_product_group_id, is_inclusive, is_dividable, hide_on_bill, is_active, outlet_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                ownerId, "TEST_TAX", "TEST", 10.0, null, 
                true, false, false, true, null
            ]
        );
        console.log("Insert successful:", result.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error("Insert failed:", err);
        process.exit(1);
    }
}

testSave();
