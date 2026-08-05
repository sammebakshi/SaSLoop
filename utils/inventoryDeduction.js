const pool = require("../db");

/**
 * Deducts inventory stock for an order based on business sales channel settings.
 * Channels: 'POS', 'ONLINE', 'WHATSAPP'
 * 
 * Settings checked:
 * - track_inventory (Global master toggle)
 * - settings.track_inventory_pos
 * - settings.track_inventory_online
 * - settings.track_inventory_whatsapp
 */
async function deductInventoryForOrder(userId, items, channel, orderRef) {
    try {
        if (!userId || !items) return;

        const bizRes = await pool.query(
            "SELECT track_inventory, settings FROM restaurants WHERE user_id = $1 OR id = $1",
            [userId]
        );
        const biz = bizRes.rows[0];
        if (!biz) return;

        const globalTrack = biz.track_inventory !== false;
        let settings = {};
        if (typeof biz.settings === 'string') {
            try { settings = JSON.parse(biz.settings); } catch (e) {}
        } else if (biz.settings) {
            settings = biz.settings;
        }

        const normChannel = String(channel || '').toUpperCase();
        let shouldTrack = globalTrack;

        if (normChannel.includes('POS') || normChannel.includes('WALK') || normChannel.includes('DINE') || normChannel.includes('QUICK')) {
            shouldTrack = settings.track_inventory_pos !== undefined ? !!settings.track_inventory_pos : globalTrack;
        } else if (normChannel.includes('ONLINE') || normChannel.includes('QR') || normChannel.includes('WEB') || normChannel.includes('DIGITAL')) {
            shouldTrack = settings.track_inventory_online !== undefined ? !!settings.track_inventory_online : globalTrack;
        } else if (normChannel.includes('WHATSAPP') || normChannel.includes('BOT')) {
            shouldTrack = settings.track_inventory_whatsapp !== undefined ? !!settings.track_inventory_whatsapp : globalTrack;
        }

        if (!shouldTrack) {
            console.log(`📦 [INVENTORY] Stock tracking disabled for channel '${channel}' (User ${userId}). Skipping stock deduction.`);
            return;
        }

        const parsedItems = Array.isArray(items) ? items : (typeof items === 'string' ? JSON.parse(items) : []);
        if (!parsedItems || parsedItems.length === 0) return;

        for (const item of parsedItems) {
            const itemId = item.id || item.item_id;
            const qty = parseFloat(item.qty || item.quantity || 1);
            const itemName = item.product_name || item.name || 'Item';

            // 1. Check Recipe / Bill of Materials (BOM) deduction
            if (itemId) {
                const recipeRes = await pool.query(
                    "SELECT raw_item_id, quantity FROM recipes WHERE menu_item_id = $1",
                    [itemId]
                );

                if (recipeRes.rows.length > 0) {
                    for (const ingredient of recipeRes.rows) {
                        const deductQty = parseFloat(ingredient.quantity) * qty;
                        await pool.query(
                            `UPDATE inventory_raw 
                             SET current_stock = current_stock - $1, updated_at = NOW() 
                             WHERE id = $2 AND (biz_id = $3 OR business_id = $3)`,
                            [deductQty, ingredient.raw_item_id, userId]
                        );
                        await pool.query(
                            `INSERT INTO inventory_logs (biz_id, raw_item_id, change_amount, type, reference_no, note, created_at)
                             VALUES ($1, $2, $3, 'RECIPE_DEDUCTION', $4, $5, NOW())`,
                            [userId, ingredient.raw_item_id, -deductQty, orderRef, `Recipe stock deducted for ${channel} Sale: ${itemName}`]
                        );
                    }
                }
            }

            // 2. Direct stock count deduction on business_items & outlet_menu_items
            const baseItemName = itemName.replace(/\s*\(.*\)$/, '').trim();
            await pool.query(
                `UPDATE business_items 
                 SET stock_count = GREATEST(stock_count - $1, 0),
                     availability = CASE WHEN GREATEST(stock_count - $1, 0) = 0 THEN false ELSE availability END
                 WHERE user_id = $2 AND product_name = $3 AND stock_count IS NOT NULL`,
                [qty, userId, baseItemName]
            );

            if (itemId) {
                await pool.query(
                    `UPDATE outlet_menu_items 
                     SET stock_qty = GREATEST(stock_qty - $1, 0),
                         is_active = CASE WHEN GREATEST(stock_qty - $1, 0) = 0 THEN false ELSE is_active END
                     WHERE (item_id = $2 OR id = $2) AND stock_qty IS NOT NULL`,
                    [qty, itemId]
                );
            }
        }
        console.log(`📦 [INVENTORY] Stock successfully depleted for ${channel} Order ${orderRef} (User ${userId})`);
    } catch (err) {
        console.error("🔥 Error in deductInventoryForOrder:", err);
    }
}

module.exports = { deductInventoryForOrder };
