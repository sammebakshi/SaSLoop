require('dotenv').config();
const pool = require('./db');

async function testAfghaniSubItems() {
    const userId = 2;
    console.log("=== Testing Sub-Items First Resolution for User 2 ===");
    
    // Test for Afghani Chicken (ID 104)
    const itemId = 104;
    const itemInfoRes = await pool.query(
        "SELECT id, item_name FROM outlet_menu_items WHERE id = $1 LIMIT 1",
        [itemId]
    );
    const targetItemName = itemInfoRes.rows[0].item_name;

    const candidateIdsRes = await pool.query(
        `SELECT omi.id, omi.menu_id, om.is_digital_default
         FROM outlet_menu_items omi
         JOIN outlet_menus om ON omi.menu_id = om.id
         WHERE (om.outlet_id = $1 OR om.user_id = $1)
           AND (omi.id = $2 OR LOWER(omi.item_name) = LOWER($3))
         ORDER BY om.is_digital_default DESC, om.is_digital DESC, om.is_pos_default DESC`,
        [userId, itemId, targetItemName]
    );

    console.log("Candidates:", candidateIdsRes.rows);

    for (const cand of candidateIdsRes.rows) {
        const subItemsRes = await pool.query(
            `SELECT id, item_name as name, base_price as price, short_code
             FROM outlet_menu_items
             WHERE menu_id = $1
               AND item_type = '1'
               AND id > $2
               AND id < COALESCE(
                 (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = $1 AND id > $2),
                 99999999
               )
             ORDER BY id ASC`,
            [cand.menu_id, cand.id]
        );
        console.log(`Sub-items for menu_id ${cand.menu_id}, base item ${cand.id}:`, subItemsRes.rows);
    }

    process.exit(0);
}

testAfghaniSubItems();
