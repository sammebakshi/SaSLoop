const pool = require('../db');

async function testAllItemsFix() {
    try {
        const targetId = 55;
        const query = `
          SELECT omi.id, 
                 omi.menu_id,
                 omi.short_code as code, 
                 omi.item_name as product_name, 
                 omi.base_price as price, 
                 m.menu_name,
                 m.is_pos_default
          FROM outlet_menu_items omi
          JOIN outlet_menus m ON omi.menu_id = m.id
          WHERE (
            m.outlet_id = $1 OR 
            m.user_id = $1 OR 
            m.user_id = (SELECT parent_user_id FROM app_users WHERE id = $1) OR 
            m.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1) OR
            m.outlet_id IN (SELECT id FROM app_users WHERE parent_user_id = $1)
          )
          ORDER BY m.is_pos_default DESC, omi.id ASC
        `;
        const res = await pool.query(query, [targetId]);
        console.log(`Fetched ${res.rows.length} items for targetId 55 across all menus!`);
        console.table(res.rows.slice(0, 15));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
testAllItemsFix();
