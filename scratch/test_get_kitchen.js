const pool = require("../db");

async function testGet() {
    try {
        const ownerId = 8;
        const outlet_id = '12';

        let query = `
          SELECT k.*, COALESCE(k.name, k.department_name) as name, u.business_name as outlet_name 
          FROM kitchen_departments k
          LEFT JOIN app_users u ON k.outlet_id = u.id
          WHERE k.user_id = $1
        `;
        const params = [ownerId];
        if (outlet_id && outlet_id !== "global") {
          query += " AND (k.outlet_id = $2 OR k.outlet_id IS NULL)";
          params.push(outlet_id);
        } else {
          query += " AND k.outlet_id IS NULL";
        }
        query += " ORDER BY name ASC";

        const result = await pool.query(query, params);
        console.log("Result of GET /kitchen-departments:", JSON.stringify(result.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testGet();
