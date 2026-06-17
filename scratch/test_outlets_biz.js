const pool = require('../db');

async function testQuery() {
  try {
    // queryUserId = 48 (which is the bizId of pos@test.com)
    const queryUserId = 48;
    const outlets = await pool.query(`
      SELECT r.*, b.name as brand_parent_name, u.email as outlet_email, u.name as owner_name
      FROM restaurants r
      LEFT JOIN brands b ON r.brand_id = b.id
      JOIN app_users u ON r.user_id = u.id
      WHERE u.id = $1 OR u.parent_user_id = $1`, [queryUserId]);
    console.log("Query returned outlets count:", outlets.rows.length);
    console.log("Query returned outlets name:", outlets.rows[0]?.name);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
testQuery();
