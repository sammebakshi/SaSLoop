const pool = require("../db");

async function testGet() {
    try {
        const ownerId = 8;
        const target_user_id = '12';

        let query = `
          SELECT t.*, g.group_name as tax_group_name, u.business_name as outlet_name 
          FROM table_departments t
          LEFT JOIN tax_product_groups g ON t.tax_product_group_id = g.id
          LEFT JOIN app_users u ON t.outlet_id = u.id
          WHERE t.user_id = $1
        `;
        const params = [ownerId];
        if (target_user_id && target_user_id !== "global") {
          query += " AND (t.outlet_id = $2 OR t.outlet_id IS NULL)";
          params.push(parseInt(target_user_id));
        } else {
          query += " AND t.outlet_id IS NULL";
        }
        query += " ORDER BY t.department_name ASC";

        const result = await pool.query(query, params);
        console.log("Result of GET /table-departments:", JSON.stringify(result.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testGet();
