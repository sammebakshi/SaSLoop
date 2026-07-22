const pool = require('../db');

async function testFixedQuery() {
    try {
        const userId = 48; // Administrator or Brand Owner ID
        const outletId = 55; // Shahe Tehzeeb Outlet ID

        console.log("=== TEST 1: With outletId = 55 ===");
        const q1 = await pool.query(`
          SELECT omi.id, omi.item_name, omi.base_price, m.menu_name, m.outlet_id, m.user_id
          FROM outlet_menu_items omi
          JOIN outlet_menus m ON omi.menu_id = m.id
          WHERE (
            m.outlet_id = $1 OR 
            m.user_id = $1 OR 
            m.user_id = (SELECT parent_user_id FROM app_users WHERE id = $1) OR
            m.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1)
          )
        `, [outletId]);
        console.log(`Result count with outlet 55: ${q1.rows.length}`);

        console.log("=== TEST 2: Without outletId, using user_id = 48 ===");
        const q2 = await pool.query(`
          SELECT omi.id, omi.item_name, omi.base_price, m.menu_name, m.outlet_id, m.user_id
          FROM outlet_menu_items omi
          JOIN outlet_menus m ON omi.menu_id = m.id
          WHERE (
            m.user_id = $1 OR 
            m.outlet_id = $1 OR 
            m.user_id = (SELECT parent_user_id FROM app_users WHERE id = $1) OR
            m.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1)
          )
        `, [userId]);
        console.log(`Result count with user 48: ${q2.rows.length}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testFixedQuery();
