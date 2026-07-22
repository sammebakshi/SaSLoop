const pool = require('../db');

async function debugBackendAllItems() {
    try {
        console.log("=== APP USERS IN DB ===");
        const users = await pool.query(`SELECT id, email, role, business_name, parent_user_id FROM app_users`);
        console.table(users.rows);

        console.log("=== ALL OUTLET MENUS ===");
        const menus = await pool.query(`SELECT id, user_id, outlet_id, menu_name, is_pos_default, is_digital FROM outlet_menus`);
        console.table(menus.rows);

        console.log("=== TEST QUERY FOR ALL USERS (1, 3, 8, 48, 55) ===");
        const userIds = [1, 3, 8, 48, 55];
        for (const uId of userIds) {
            const query = `
              SELECT COUNT(*) as item_count
              FROM outlet_menu_items omi
              JOIN outlet_menus m ON omi.menu_id = m.id
              WHERE (
                m.outlet_id = $1 OR 
                m.user_id = $1 OR 
                m.user_id = (SELECT parent_user_id FROM app_users WHERE id = $1) OR 
                m.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1) OR
                m.outlet_id IN (SELECT id FROM app_users WHERE parent_user_id = $1)
              )
            `;
            const res = await pool.query(query, [uId]);
            console.log(`User/Outlet ID ${uId} -> Item count: ${res.rows[0].item_count}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugBackendAllItems();
