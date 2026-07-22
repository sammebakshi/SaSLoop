const pool = require('../db');

async function testOutletAllItems() {
    try {
        console.log("=== CHECK ALL OUTLET MENUS ===");
        const menus = await pool.query(`SELECT * FROM outlet_menus`);
        console.table(menus.rows);

        console.log("=== CHECK ITEMS FOR USER 8 (SHAHE TEHZEEB OWNER) ===");
        const user8Res = await pool.query(`
          SELECT omi.id, omi.item_name, omi.base_price, m.menu_name, m.outlet_id, m.user_id
          FROM outlet_menu_items omi
          JOIN outlet_menus m ON omi.menu_id = m.id
          WHERE m.user_id = 8 OR m.outlet_id = 8
        `);
        console.log(`User 8 Items Count: ${user8Res.rows.length}`);
        console.table(user8Res.rows.slice(0, 10));

        console.log("=== CHECK ITEMS FOR ALL USERS/OUTLETS ===");
        const allRes = await pool.query(`
          SELECT omi.id, omi.item_name, omi.base_price, m.menu_name, m.outlet_id, m.user_id
          FROM outlet_menu_items omi
          JOIN outlet_menus m ON omi.menu_id = m.id
        `);
        console.log(`Total Items Count across all menus: ${allRes.rows.length}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testOutletAllItems();
