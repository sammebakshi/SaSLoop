const pool = require("../db");

const getItemOptions = async (itemId, userId) => {
    try {
        console.log(`\nResolving options for itemId: ${itemId}, userId: ${userId}`);
        // Find menu ID for this user/outlet
        const menuRes = await pool.query(
            "SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1) AND is_digital_default = true LIMIT 1",
            [userId]
        );
        let menuId = menuRes.rows[0]?.id;
        if (!menuId) {
            const posMenuRes = await pool.query(
                "SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1) AND is_pos_default = true LIMIT 1",
                [userId]
            );
            menuId = posMenuRes.rows[0]?.id;
        }
        if (!menuId) {
            console.log("No menuId found for user:", userId);
            return null;
        }
        console.log("Found Menu ID:", menuId);

        let resolvedItemId = itemId;
        // Try to resolve outlet_menu_items.id from business_items.id (itemId)
        const mapRes = await pool.query(
            "SELECT id FROM outlet_menu_items WHERE menu_id = $1 AND item_id = $2 LIMIT 1",
            [menuId, itemId]
        );
        if (mapRes.rows.length > 0) {
            resolvedItemId = mapRes.rows[0].id;
            console.log(`Resolved itemId ${itemId} directly to outlet_menu_items.id ${resolvedItemId} via item_id`);
        } else {
            // Fallback: match by product_name/item_name
            const nameRes = await pool.query(
                `SELECT omi.id FROM outlet_menu_items omi
                 JOIN business_items bi ON omi.item_name = bi.product_name
                 WHERE omi.menu_id = $1 AND bi.id = $2 LIMIT 1`,
                [menuId, itemId]
            );
            if (nameRes.rows.length > 0) {
                resolvedItemId = nameRes.rows[0].id;
                console.log(`Resolved itemId ${itemId} to outlet_menu_items.id ${resolvedItemId} via item_name matching`);
            } else {
                console.log(`Could not resolve itemId ${itemId} to outlet_menu_items.id, falling back to original id`);
            }
        }

        const ogRes = await pool.query(
            `SELECT og.id, og.name, og.min_selectable, og.max_selectable
             FROM option_groups og
             JOIN item_option_groups iog ON og.id = iog.group_id
             WHERE iog.item_id = $1 AND og.is_active = true LIMIT 1`,
            [resolvedItemId]
        );
        if (ogRes.rows.length === 0) {
            console.log(`No option groups found for resolvedItemId: ${resolvedItemId}`);
            
            // Check fallback logic in whatsappManager:
            const fallbackRes = await pool.query(
                `SELECT id, item_name as name, base_price as price
                 FROM outlet_menu_items
                 WHERE menu_id = $1
                   AND item_type = '1'
                   AND id > $2
                   AND id < COALESCE(
                     (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = $1 AND id > $2),
                     99999999
                   )
                 ORDER BY id ASC`,
                [menuId, resolvedItemId]
            );
            if (fallbackRes.rows.length > 0) {
                console.log(`Found fallback option items:`, fallbackRes.rows);
                return {
                    groupId: resolvedItemId,
                    groupName: "Size/Portion",
                    minSelectable: 1,
                    maxSelectable: 1,
                    options: fallbackRes.rows.map(o => ({
                        id: o.id,
                        name: o.name,
                        price: parseFloat(o.price) || 0
                    }))
                };
            }
            return null;
        }
        
        const og = ogRes.rows[0];
        console.log("Found Option Group:", og);
        
        const optionsRes = await pool.query(
            `SELECT DISTINCT ON (ol.id) ol.id, ol.name, COALESCE(NULLIF(ol.price_override, 0.00), omi.base_price) as price, omi.id as menu_item_id
             FROM options_list ol
             LEFT JOIN outlet_menu_items omi ON ol.name = omi.item_name 
               AND omi.menu_id = $2
               AND (
                 omi.item_type = '1' 
                 AND omi.id > $1 
                 AND omi.id < COALESCE(
                   (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = $2 AND id > $1), 
                   99999999
                 )
               )
             WHERE ol.group_id = $3 AND ol.is_active = true 
             ORDER BY ol.id, omi.id ASC`,
            [resolvedItemId, menuId, og.id]
        );
        
        console.log("optionsRes rows:", optionsRes.rows);
        
        if (optionsRes.rows.length === 0) return null;
        
        return {
            groupId: og.id,
            groupName: og.name,
            minSelectable: og.min_selectable,
            maxSelectable: og.max_selectable,
            options: optionsRes.rows.map(o => ({
                id: o.menu_item_id || o.id, // Prefer actual menu_item_id
                name: o.name,
                price: parseFloat(o.price) || 0
            }))
        };
    } catch (e) {
        console.error("Error fetching item options:", e);
        return null;
    }
};

async function run() {
  const ids = [5638, 5635, 5640, 5650];
  for (const id of ids) {
    const result = await getItemOptions(id, 48);
    console.log("Result:", JSON.stringify(result, null, 2));
  }
  pool.end();
}
run();
