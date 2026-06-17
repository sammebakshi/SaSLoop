const pool = require("../db");

async function testQuery(userId, role, targetUserId) {
  try {
    console.log(`\n=== Testing for User ID ${userId} (Role: ${role}, Target: ${targetUserId}) ===`);
    let result;
    if (targetUserId) {
      result = await pool.query(`
        SELECT u.id, u.username, u.name, u.role, u.parent_user_id,
               COALESCE(r.name, p.business_name, p.name) as outlet_name
        FROM app_users u
        LEFT JOIN outlet_designations d ON u.designation_id = d.id
        LEFT JOIN app_users p ON u.parent_user_id = p.id
        LEFT JOIN restaurants r ON r.user_id = u.parent_user_id
        WHERE u.parent_user_id = $1 
        ORDER BY u.name ASC`, [targetUserId]);
    } else {
      if (role === 'brand_owner') {
        result = await pool.query(`
          SELECT u.id, u.username, u.name, u.role, u.parent_user_id,
                 COALESCE(r.name, p.business_name, p.name) as outlet_name
          FROM app_users u
          LEFT JOIN outlet_designations d ON u.designation_id = d.id
          LEFT JOIN app_users p ON u.parent_user_id = p.id
          LEFT JOIN restaurants r ON r.user_id = u.parent_user_id
          WHERE u.parent_user_id = $1 
             OR u.parent_user_id IN (SELECT id FROM app_users WHERE owner_id = $1)
          ORDER BY u.name ASC`, [userId]);
      } else {
        result = await pool.query(`
          SELECT u.id, u.username, u.name, u.role, u.parent_user_id,
                 COALESCE(r.name, p.business_name, p.name) as outlet_name
          FROM app_users u
          LEFT JOIN outlet_designations d ON u.designation_id = d.id
          LEFT JOIN app_users p ON u.parent_user_id = p.id
          LEFT JOIN restaurants r ON r.user_id = u.parent_user_id
          WHERE u.parent_user_id = $1 
          ORDER BY u.name ASC`, [userId]);
      }
    }
    console.table(result.rows);
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  // 1. Logged in as sold_cafe (ID 12, role 'user')
  await testQuery(12, 'user', null);
  // 2. Logged in as brand_owner_test (ID 8, role 'brand_owner')
  await testQuery(8, 'brand_owner', null);
  // 3. Logged in as brand_owner_test impersonating sold_cafe
  await testQuery(8, 'brand_owner', 12);
  // 4. Logged in as shahetehzeeb (ID 48, role 'user')
  await testQuery(48, 'user', null);
  
  await pool.end();
}

run();
