const pool = require('../db');

async function testMasterAdminQuery() {
    try {
        console.log("=== TEST MASTER ADMIN QUERY ===");
        const q = await pool.query(`
          SELECT omi.id, omi.item_name, omi.base_price, m.menu_name, m.outlet_id, m.user_id
          FROM outlet_menu_items omi
          JOIN outlet_menus m ON omi.menu_id = m.id
          WHERE (
            $1::text = 'master_admin' OR
            $1::text = 'admin' OR
            m.outlet_id = $2 OR 
            m.user_id = $2 OR 
            m.user_id = (SELECT parent_user_id FROM app_users WHERE id = $2) OR 
            m.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $2) OR
            m.outlet_id IN (SELECT id FROM app_users WHERE parent_user_id = $2)
          )
        `, ['master_admin', 54]);

        console.log(`Master admin query returned: ${q.rows.length} items!`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testMasterAdminQuery();
