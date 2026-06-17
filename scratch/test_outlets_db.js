const pool = require('../db');

async function testQuery() {
  try {
    // 1. Get the admin/brand owner user
    const users = await pool.query("SELECT id, name, email, role FROM app_users WHERE role = 'brand_owner' OR parent_user_id IS NULL");
    console.log("Users:", users.rows);
    
    // 2. Query restaurants
    const rest = await pool.query("SELECT * FROM restaurants");
    console.log("Restaurants:", rest.rows);
    
    // 3. Query outlets like the route does
    // SELECT r.*, b.name as brand_parent_name, u.email as outlet_email, u.name as owner_name FROM restaurants r ...
    const queryUserId = users.rows[0]?.id;
    if (queryUserId) {
      const outlets = await pool.query(`
        SELECT r.*, b.name as brand_parent_name, u.email as outlet_email, u.name as owner_name
        FROM restaurants r
        LEFT JOIN brands b ON r.brand_id = b.id
        JOIN app_users u ON r.user_id = u.id
        WHERE u.id = $1 OR u.parent_user_id = $1`, [queryUserId]);
      console.log("Query returned outlets count:", outlets.rows.length);
      console.log("Query returned outlets:", outlets.rows);
    }
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
testQuery();
