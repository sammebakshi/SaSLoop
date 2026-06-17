const pool = require("../db");

async function testQuery(mockUser, mockOutletId) {
  let outlet_id = mockOutletId;
  const ownerId = mockUser.bizId || mockUser.id;

  if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && mockUser.role === "user") {
    outlet_id = mockUser.id;
  }

  try {
    let query = `
      SELECT omi.id, 
             omi.menu_id,
             omi.short_code as code, 
             omi.item_name as product_name, 
             omi.base_price as price, 
             omi.is_active as availability, 
             omi.item_type,
             omi.image_url,
             omi.category_id,
             c.name as category,
             pc.name as parent_category,
             m.menu_name 
      FROM outlet_menu_items omi
      JOIN outlet_menus m ON omi.menu_id = m.id
      LEFT JOIN categories c ON omi.category_id = c.id
      LEFT JOIN categories pc ON c.parent_id = pc.id
    `;
    const params = [];
    if (outlet_id && outlet_id !== 'global' && outlet_id !== 'null' && outlet_id !== 'undefined') {
      query += " WHERE m.outlet_id = $1";
      params.push(outlet_id);
    } else {
      query += " WHERE m.user_id = $1 AND m.outlet_id IS NULL";
      params.push(ownerId);
    }
    query += " ORDER BY omi.id ASC";

    const result = await pool.query(query, params);
    console.log(`TEST CASE: User Role: ${mockUser.role}, User ID: ${mockUser.id}, Passed Outlet ID: ${mockOutletId}`);
    console.log(`Resolved query parameter outlet_id: ${outlet_id}`);
    console.log(`Query parameters:`, params);
    console.log(`Results count: ${result.rows.length}`);
    if (result.rows.length > 0) {
      console.log(`First item sample:`, {
        id: result.rows[0].id,
        menu_id: result.rows[0].menu_id,
        code: result.rows[0].code,
        product_name: result.rows[0].product_name,
        price: result.rows[0].price,
        menu_name: result.rows[0].menu_name
      });
    }
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("ERROR running query:", err.message);
  }
}

async function runTests() {
  // Test Case 1: Direct outlet user login (id: 48) requesting with no query param (null/undefined/global)
  await testQuery({ id: 48, role: 'user', bizId: 48 }, undefined);
  await testQuery({ id: 48, role: 'user', bizId: 48 }, 'global');

  // Test Case 2: Brand owner login (id: 8) requesting a specific outlet (id: 12)
  await testQuery({ id: 8, role: 'brand_owner', bizId: 8 }, 12);

  // Test Case 3: Brand owner login (id: 8) requesting global overview (no outlet_id / 'global')
  await testQuery({ id: 8, role: 'brand_owner', bizId: 8 }, 'global');
  await testQuery({ id: 8, role: 'brand_owner', bizId: 8 }, undefined);

  await pool.end();
}

runTests();
