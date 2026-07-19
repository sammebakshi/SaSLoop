const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET ALL TABLES FOR POS
router.get("/tables", authMiddleware, async (req, res) => {
    try {
        const outletId = req.user.bizId;
        const result = await pool.query(
            "SELECT t.id, t.name as table_name, t.department_id, d.department_name FROM tables_list t LEFT JOIN table_departments d ON t.department_id = d.id WHERE (t.outlet_id = $1 OR (t.outlet_id IS NULL AND t.user_id = $1)) AND t.is_active = true AND (d.id IS NULL OR d.is_active = true) ORDER BY substring(t.name from '^[a-zA-Z\\s]*') ASC, COALESCE(substring(t.name from '[0-9]+')::integer, 0) ASC, t.name ASC",
            [outletId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tables" });
    }
});

// ✅ GET OPTION GROUPS FOR POS
router.get("/option-groups", authMiddleware, async (req, res) => {
    try {
        const outletId = req.user.bizId;
        // Fetch option groups linked to items (using LEFT JOIN to handle orphans)
        const result = await pool.query(
            `SELECT og.id, og.name, og.min_selectable, og.max_selectable, 
                    bi.id as item_id, 
                    omi.id as outlet_menu_item_id
             FROM option_groups og
             JOIN item_option_groups iog ON og.id = iog.group_id
             LEFT JOIN outlet_menu_items omi ON iog.item_id = omi.id
             LEFT JOIN business_items bi ON (
               (omi.short_code IS NOT NULL AND omi.short_code != '' AND omi.short_code = bi.code)
               OR
               ((omi.short_code IS NULL OR omi.short_code = '') AND omi.item_name = bi.product_name)
             ) AND bi.user_id = $1
             WHERE (og.outlet_id = $1 OR (og.outlet_id IS NULL AND og.user_id = $1)) AND og.is_active = true`,
            [outletId]
        );
        
        const groups = result.rows;
        const finalGroups = [];

        // Fetch options for each group
        for (let group of groups) {
            let menuItemId = group.outlet_menu_item_id;
            let posItemId = group.item_id;

            // Self-healing fallback for broken item references
            if (!menuItemId || !posItemId) {
                const activeMenuRes = await pool.query(
                  `SELECT id FROM outlet_menus 
                   WHERE (outlet_id = $1 OR user_id = $1) 
                     AND (is_digital_default = true OR is_pos_default = true) 
                   LIMIT 1`,
                  [outletId]
                );
                const activeMenuId = activeMenuRes.rows[0]?.id;
                if (activeMenuId) {
                  const matchedItemRes = await pool.query(
                    `SELECT id, item_name as product_name, short_code as code 
                     FROM outlet_menu_items 
                     WHERE menu_id = $1 AND item_name ILIKE $2 AND (item_type = '0' OR item_type = 'main') 
                     LIMIT 1`,
                    [activeMenuId, group.name]
                  );
                  if (matchedItemRes.rows.length > 0) {
                    const matchedItem = matchedItemRes.rows[0];
                    console.log(`[POS-SELF-HEALING] Healing option group '${group.name}' (ID: ${group.id}): updating stale link to active item '${matchedItem.product_name}' (ID: ${matchedItem.id})`);
                    
                    // Update database link
                    await pool.query("DELETE FROM item_option_groups WHERE group_id = $1", [group.id]);
                    await pool.query(
                      "INSERT INTO item_option_groups (item_id, group_id) VALUES ($1, $2)",
                      [matchedItem.id, group.id]
                    );

                    menuItemId = matchedItem.id;
                    
                    // Resolve business_items ID
                    const biRes = await pool.query(
                      `SELECT id FROM business_items 
                       WHERE user_id = $1 AND (
                         (code IS NOT NULL AND code != '' AND code = $2)
                         OR
                         ((code IS NULL OR code = '') AND product_name = $3)
                       ) LIMIT 1`,
                      [outletId, matchedItem.code, matchedItem.product_name]
                    );
                    if (biRes.rows.length > 0) {
                      posItemId = biRes.rows[0].id;
                    }
                  }
                }
            }

            // If still not resolved/found, skip
            if (!menuItemId || !posItemId) {
                console.warn(`[POS] Skipping group '${group.name}' (ID: ${group.id}) because it has no valid item link.`);
                continue;
            }

            // Fetch options for the group
            const optionsQuery = `
              SELECT * FROM (
                SELECT DISTINCT ON (ol.id) ol.id, ol.name, ol.price_override, omi.base_price as item_price, ol.sorting_order
                FROM options_list ol
                LEFT JOIN outlet_menu_items omi ON ol.name = omi.item_name 
                  AND omi.menu_id = (SELECT menu_id FROM outlet_menu_items WHERE id = $1)
                  AND (
                    (omi.item_type = '0') 
                    OR 
                    (
                      omi.item_type = '1' 
                      AND omi.id > $1 
                      AND omi.id < COALESCE(
                        (SELECT MIN(id) FROM outlet_menu_items WHERE item_type = '0' AND menu_id = (SELECT menu_id FROM outlet_menu_items WHERE id = $1) AND id > $1), 
                        99999999
                      )
                    )
                  )
                WHERE ol.group_id = $2 AND ol.is_active = true 
                ORDER BY ol.id, omi.item_type DESC, omi.id ASC
              ) sub
              ORDER BY sorting_order ASC`;

            let optionsRes = await pool.query(optionsQuery, [menuItemId, group.id]);
            
            // Check if we need price fallback (e.g. if options returned null base price and no price override)
            const needsFallback = optionsRes.rows.some(o => 
                (o.item_price === null || parseFloat(o.item_price) === 0) && 
                (o.price_override === null || parseFloat(o.price_override) === 0)
            );

            if (needsFallback) {
                // Find other items linked to the same option group in the same menu
                const otherItemsRes = await pool.query(
                    `SELECT iog.item_id 
                     FROM item_option_groups iog
                     JOIN outlet_menu_items omi ON iog.item_id = omi.id
                     WHERE iog.group_id = $1 
                       AND omi.menu_id = (SELECT menu_id FROM outlet_menu_items WHERE id = $2) 
                       AND iog.item_id != $2`,
                    [group.id, menuItemId]
                );

                for (const otherItem of otherItemsRes.rows) {
                    const fallbackRes = await pool.query(optionsQuery, [otherItem.item_id, group.id]);
                    const hasValidPrices = fallbackRes.rows.some(o => 
                        (o.item_price !== null && parseFloat(o.item_price) > 0) || 
                        (o.price_override !== null && parseFloat(o.price_override) > 0)
                    );
                    if (hasValidPrices) {
                        // Found a valid fallback! Copy the prices/overrides to the original options array
                        optionsRes.rows = optionsRes.rows.map(originalOpt => {
                            const matchingFallback = fallbackRes.rows.find(fo => fo.id === originalOpt.id);
                            if (matchingFallback) {
                                return {
                                    ...originalOpt,
                                    item_price: matchingFallback.item_price,
                                    price_override: matchingFallback.price_override
                                };
                            }
                            return originalOpt;
                        });
                        break;
                    }
                }
            }
            
            group.options = optionsRes.rows.map(o => ({
                id: o.id,
                name: o.name,
                price_override: parseFloat(o.price_override) > 0 ? o.price_override : o.item_price
            }));
            
            group.outlet_menu_item_id = menuItemId;
            group.item_id = posItemId;
            
            finalGroups.push(group);
        }
        
        res.json(finalGroups);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch option groups" });
    }
});

// ✅ SAVE/UPDATE TABLE POSITIONS (BULK)
router.post("/tables/sync", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId;
        const { tables } = req.body; // Array of { id, x_pos, y_pos, status, table_name }
        console.log(`Syncing ${tables.length} tables for user ${userId}`);
        for (const table of tables) {
            if (table.id) {
                console.log(`Updating table ${table.id}`);
                await pool.query(
                    "UPDATE pos_tables SET x_pos = $1, y_pos = $2, status = $3, table_name = $4, updated_at = NOW() WHERE id = $5 AND user_id = $6",
                    [table.x_pos, table.y_pos, table.status, table.table_name, table.id, userId]
                );
            } else {
                console.log(`Inserting new table ${table.table_name}`);
                await pool.query(
                    "INSERT INTO pos_tables (user_id, table_name, x_pos, y_pos, status) VALUES ($1, $2, $3, $4, $5)",
                    [userId, table.table_name, table.x_pos, table.y_pos, table.status || 'AVAILABLE']
                );
            }
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to sync tables" });
    }
});

// ✅ UPDATE SINGLE TABLE STATUS
router.put("/tables/:tableName/status", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId;
        const { tableName } = req.params;
        const { status } = req.body;

        await pool.query(
            "UPDATE pos_tables SET status = $1, updated_at = NOW() WHERE user_id = $2 AND table_name = $3",
            [status, userId, tableName]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update table status" });
    }
});

// ✅ DELETE TABLE
router.delete("/tables/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId;
        const { id } = req.params;
        await pool.query("DELETE FROM pos_tables WHERE id = $1 AND user_id = $2", [id, userId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete table" });
    }
});

// ✅ GET OUTLET PAYMENT MODES (Context-Aware)
router.get("/payment-modes", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.bizId;

        // Impersonation support for admins/brand owners
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        const result = await pool.query(
            "SELECT * FROM outlet_payment_modes WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch payment modes" });
    }
});

// ✅ ADD OUTLET PAYMENT MODE (Context-Aware)
router.post("/payment-modes", authMiddleware, async (req, res) => {
    try {
        const { target_user_id, methodName } = req.body;
        let userId = req.user.bizId;

        if (!methodName) {
            return res.status(400).json({ error: "methodName is required" });
        }

        // Impersonation support
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }
        
        console.log(`[PAYMENT_MATRIX] Authorizing ${methodName} for UserID ${userId}`);

        await pool.query(
            "INSERT INTO outlet_payment_modes (user_id, method_name) VALUES ($1, $2) ON CONFLICT (user_id, method_name) DO UPDATE SET is_active = true",
            [userId, methodName]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("❌ [PAYMENT_MATRIX_ERROR]:", err);
        res.status(500).json({ error: "Failed to add payment mode", details: err.message });
    }
});

// ✅ REMOVE OUTLET PAYMENT MODE (Context-Aware)
router.delete("/payment-modes/:methodName", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.bizId;
        const { methodName } = req.params;

        // Impersonation support
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        await pool.query(
            "UPDATE outlet_payment_modes SET is_active = false WHERE user_id = $1 AND method_name = $2",
            [userId, methodName]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to remove payment mode" });
    }
});

// ✅ GET MASTER PAYMENT MODES (Global Pool)
router.get("/master-payment-modes", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId;
        const result = await pool.query(
            "SELECT method_name FROM master_payment_modes WHERE user_id = $1 ORDER BY created_at ASC",
            [userId]
        );
        res.json(result.rows.map(r => r.method_name));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch master payment modes" });
    }
});

// ✅ ADD MASTER PAYMENT MODE
router.post("/master-payment-modes", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId;
        const { methodName } = req.body;

        if (!methodName || methodName !== methodName.toUpperCase()) {
            return res.status(400).json({ error: "Only uppercase letters allowed" });
        }

        await pool.query(
            "INSERT INTO master_payment_modes (user_id, method_name) VALUES ($1, $2) ON CONFLICT (user_id, method_name) DO NOTHING",
            [userId, methodName]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add master payment mode" });
    }
});

// ✅ DELETE MASTER PAYMENT MODE
router.delete("/master-payment-modes/:methodName", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId;
        const { methodName } = req.params;

        await pool.query(
            "DELETE FROM master_payment_modes WHERE user_id = $1 AND method_name = $2",
            [userId, methodName]
        );
        // Also remove from authorized matrix if it was there
        await pool.query(
            "DELETE FROM outlet_payment_modes WHERE user_id = $1 AND method_name = $2",
            [userId, methodName]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete master payment mode" });
    }
});

// ✅ GET TAX PRODUCT GROUPS
router.get("/tax-product-groups", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.bizId || req.user.id;

        // Impersonation support for admins/brand owners
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        const result = await pool.query(
            "SELECT * FROM tax_product_groups WHERE user_id = $1 ORDER BY created_at ASC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tax product groups" });
    }
});

// ✅ ADD TAX PRODUCT GROUP
router.post("/tax-product-groups", authMiddleware, async (req, res) => {
    try {
        const { target_user_id, groupName } = req.body;
        let userId = req.user.bizId || req.user.id;

        if (!groupName) {
            return res.status(400).json({ error: "Group name is required" });
        }

        // Impersonation support
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        console.log("🛠️ ADDING TAX GROUP:", { userId, groupName });

        const result = await pool.query(
            "INSERT INTO tax_product_groups (user_id, group_name) VALUES ($1, $2) ON CONFLICT (user_id, group_name) DO NOTHING RETURNING *",
            [userId, groupName]
        );
        console.log("✅ DB RESULT:", result.rows);
        res.json(result.rows[0] || { message: "Already exists" });
    } catch (err) {
        console.error("🔥 TAX GROUP ERROR:", err);
        res.status(500).json({ error: "Failed to add tax product group" });
    }
});

// ✅ DELETE TAX PRODUCT GROUP
router.delete("/tax-product-groups/:id", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.bizId || req.user.id;
        const { id } = req.params;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        await pool.query(
            "DELETE FROM tax_product_groups WHERE user_id = $1 AND id = $2",
            [userId, id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete tax product group" });
    }
});

// ✅ UPDATE TAX PRODUCT GROUP
router.put("/tax-product-groups/:id", authMiddleware, async (req, res) => {
    try {
        const { target_user_id, groupName } = req.body;
        let userId = req.user.bizId || req.user.id;
        const { id } = req.params;

        if (!groupName) {
            return res.status(400).json({ error: "Group name is required" });
        }

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        await pool.query(
            "UPDATE tax_product_groups SET group_name = $1 WHERE user_id = $2 AND id = $3",
            [groupName, userId, id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update tax product group" });
    }
});

// ✅ GET POS ACTIVE STATE
router.get("/active-state", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.bizId || req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        const deviceId = req.headers['x-device-id'] || req.headers['X-Device-ID'] || req.query.device_id || null;
        console.log(`[POS ACTIVE-STATE GET] Device ID: ${deviceId}, User: ${userId}`);

        const result = await pool.query(
            "SELECT settings FROM restaurants WHERE user_id = $1",
            [userId]
        );
        if (result.rows.length === 0) {
            return res.json({ tableBills: {}, tableStatuses: {}, tableBillNumbers: {}, tableActiveTimestamps: {}, tables: [] });
        }
        const settings = result.rows[0].settings || {};
        const syncAcross = settings.sync_active_state_across_devices === true || settings.sync_active_state_across_devices === 'true';
        
        let activePosState = settings.active_pos_state;
        if (deviceId && !syncAcross) {
            const deviceKey = `active_pos_state_${deviceId}`;
            if (settings[deviceKey]) {
                activePosState = settings[deviceKey];
            }
        }
        
        res.json(activePosState || { tableBills: {}, tableStatuses: {}, tableBillNumbers: {}, tableActiveTimestamps: {}, tables: [] });
    } catch (err) {
        console.error("Failed to load POS active state:", err);
        res.status(500).json({ error: "Failed to load POS active state" });
    }
});

// ✅ SAVE POS ACTIVE STATE
router.post("/active-state", authMiddleware, async (req, res) => {
    try {
        const { target_user_id, activeState } = req.body;
        let userId = req.user.bizId || req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        const deviceId = req.headers['x-device-id'] || req.headers['X-Device-ID'] || req.query.device_id || null;
        console.log(`[POS ACTIVE-STATE POST] Device ID: ${deviceId}, User: ${userId}`);

        const selectSettings = await pool.query("SELECT settings FROM restaurants WHERE user_id = $1", [userId]);
        const settings = selectSettings.rows[0]?.settings || {};
        const syncAcross = settings.sync_active_state_across_devices === true || settings.sync_active_state_across_devices === 'true';

        if (deviceId && !syncAcross) {
            const deviceKey = `active_pos_state_${deviceId}`;
            await pool.query(
                `UPDATE restaurants 
                 SET settings = jsonb_set(COALESCE(settings, '{}'::jsonb), ARRAY[$1], $2::jsonb) 
                 WHERE user_id = $3`,
                [deviceKey, JSON.stringify(activeState), userId]
            );
        } else {
            await pool.query(
                `UPDATE restaurants 
                 SET settings = jsonb_set(COALESCE(settings, '{}'::jsonb), '{active_pos_state}', $1::jsonb) 
                 WHERE user_id = $2`,
                [JSON.stringify(activeState), userId]
            );
        }
        res.json({ success: true });
    } catch (err) {
        console.error("Failed to save POS active state:", err);
        res.status(500).json({ error: "Failed to save POS active state" });
    }
});

// ✅ BATCH SYNC OFFLINE ORDERS
router.post("/sync-orders", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId || req.user.id;
        const { orders } = req.body;

        if (!Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({ error: "No orders provided for sync" });
        }

        console.log(`[SYNC-ORDERS] Syncing ${orders.length} offline orders for user ${userId}`);

        const results = [];

        for (const order of orders) {
            try {
                const {
                    items, customer_name, customer_number, customer_phone,
                    order_type, table_number, payment_method, total_price,
                    subtotal, discount_amount, tax_cgst, tax_sgst,
                    service_charge, delivery_charge, tip_amount,
                    order_reference, waiter_id, waiter_name, created_at, status, source,
                    charge_details, rider_id
                } = order;

                if (order_reference) {
                    const existingRef = await pool.query(
                        "SELECT * FROM orders WHERE user_id = $1 AND order_reference = $2",
                        [userId, order_reference]
                    );
                    if (existingRef.rows.length > 0) {
                        console.log(`[SYNC-ORDERS] Order with reference ${order_reference} already exists, skipping insert.`);
                        results.push({
                            localId: order.id,
                            serverId: existingRef.rows[0].id,
                            bill_no: existingRef.rows[0].bill_no,
                            created_at: existingRef.rows[0].created_at,
                            success: true
                        });
                        continue;
                    }
                }

                // Parse items if string
                let parsedItems = items;
                if (typeof items === 'string') {
                    try { parsedItems = JSON.parse(items); } catch (e) { parsedItems = []; }
                }

                // Generate bill number
                const billRes = await pool.query(
                    "SELECT COALESCE(MAX(bill_no), 0) + 1 as next_bill FROM orders WHERE user_id = $1",
                    [userId]
                );
                const nextBillNo = billRes.rows[0]?.next_bill || 1;

                const deviceId = req.headers['x-device-id'] || req.headers['X-Device-ID'] || req.query.device_id || null;

                const insertRes = await pool.query(
                    `INSERT INTO orders (
                        user_id, bill_no, customer_name, customer_number, order_type,
                        table_number, payment_method, total_price, subtotal,
                        discount_amount, tax_cgst, tax_sgst, service_charge,
                        delivery_charge, tip_amount, items, order_reference,
                        waiter_id, rider_id, status, source, created_at, charge_details, device_id, updated_at
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9,
                        $10, $11, $12, $13, $14, $15, $16, $17,
                        $18, $24, $19, $21, $20, $22, $23, NOW()
                    ) RETURNING id, bill_no, created_at`,
                    [
                        userId,
                        nextBillNo,
                        customer_name || 'POS Guest',
                        customer_number || customer_phone || null,
                        order_type || 'QUICK',
                        table_number || null,
                        payment_method || 'CASH',
                        parseFloat(total_price) || 0,
                        parseFloat(subtotal) || 0,
                        parseFloat(discount_amount) || 0,
                        parseFloat(tax_cgst) || 0,
                        parseFloat(tax_sgst) || 0,
                        parseFloat(service_charge) || 0,
                        parseFloat(delivery_charge) || 0,
                        parseFloat(tip_amount) || 0,
                        JSON.stringify(parsedItems || []),
                        order_reference || null,
                        waiter_id || null,
                        status || 'COMPLETED',
                        created_at || new Date().toISOString(),
                        source || 'POS_WINDOWS_OFFLINE',
                        charge_details ? (typeof charge_details === 'string' ? charge_details : JSON.stringify(charge_details)) : '[]',
                        deviceId,
                        rider_id || null
                    ]
                );

                results.push({
                    localId: order.id,
                    serverId: insertRes.rows[0].id,
                    bill_no: insertRes.rows[0].bill_no,
                    created_at: insertRes.rows[0].created_at,
                    success: true
                });
            } catch (orderErr) {
                console.error(`[SYNC-ORDERS] Failed to sync order ${order.id}:`, orderErr.message);
                results.push({
                    localId: order.id,
                    success: false,
                    error: orderErr.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;

        console.log(`[SYNC-ORDERS] Completed: ${successCount} synced, ${failCount} failed`);
        res.json({ success: true, synced: successCount, failed: failCount, results });
    } catch (err) {
        console.error("[SYNC-ORDERS] Fatal error:", err);
        res.status(500).json({ error: "Failed to sync offline orders", details: err.message });
    }
});

// ✅ GET OUTLET QRS
router.get("/qrs", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.bizId || req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        const result = await pool.query(
            "SELECT * FROM outlet_qrs WHERE user_id = $1 ORDER BY created_at ASC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("🔥 GET OUTLET QRS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch QRs" });
    }
});

// ✅ CREATE OUTLET QR
router.post("/qrs", authMiddleware, async (req, res) => {
    try {
        const { target_user_id, name, brand, upi_id, qr_type, is_active } = req.body;
        let userId = req.user.bizId || req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        const result = await pool.query(
            `INSERT INTO outlet_qrs (user_id, name, brand, upi_id, qr_type, is_active)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [userId, name, brand || 'other', upi_id, qr_type || 'static', is_active !== undefined ? !!is_active : true]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("🔥 CREATE OUTLET QR ERROR:", err);
        res.status(500).json({ error: "Failed to create QR code" });
    }
});

// ✅ UPDATE OUTLET QR
router.put("/qrs/:id", authMiddleware, async (req, res) => {
    try {
        const { target_user_id, name, brand, upi_id, qr_type, is_active } = req.body;
        let userId = req.user.bizId || req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        const result = await pool.query(
            `UPDATE outlet_qrs
             SET name = $1, brand = $2, upi_id = $3, qr_type = $4, is_active = $5
             WHERE id = $6 AND user_id = $7 RETURNING *`,
            [name, brand || 'other', upi_id, qr_type || 'static', is_active !== undefined ? !!is_active : true, req.params.id, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "QR code not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("🔥 UPDATE OUTLET QR ERROR:", err);
        res.status(500).json({ error: "Failed to update QR code" });
    }
});

// ✅ DELETE OUTLET QR
router.delete("/qrs/:id", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.bizId || req.user.id;

        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
            userId = target_user_id;
        }

        const result = await pool.query(
            `DELETE FROM outlet_qrs WHERE id = $1 AND user_id = $2 RETURNING *`,
            [req.params.id, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "QR code not found" });
        }
        res.json({ success: true });
    } catch (err) {
        console.error("🔥 DELETE OUTLET QR ERROR:", err);
        res.status(500).json({ error: "Failed to delete QR code" });
    }
});

// ✅ SAVE POS SETTINGS
router.post("/settings", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId || req.user.id;
        const { settings } = req.body;

        if (!settings) {
            return res.status(400).json({ error: "Settings are required" });
        }

        // Fetch current settings to merge
        const selectRes = await pool.query("SELECT settings FROM restaurants WHERE user_id = $1", [userId]);
        const currentSettings = selectRes.rows[0]?.settings ? (typeof selectRes.rows[0].settings === 'string' ? JSON.parse(selectRes.rows[0].settings) : selectRes.rows[0].settings) : {};

        const mergedSettings = { ...currentSettings, ...settings };

        await pool.query(
            "UPDATE restaurants SET settings = $1 WHERE user_id = $2",
            [JSON.stringify(mergedSettings), userId]
        );

        res.json({ success: true, settings: mergedSettings });
    } catch (err) {
        console.error("Failed to save POS settings:", err);
        res.status(500).json({ error: "Failed to save POS settings" });
    }
});

// ✅ CLEAR ALL POS SALES DATA FOR THE LOGGED-IN BUSINESS (CLEAN WIPE)
router.post("/clear-sales-data", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId || req.user.id;
        
        // Safety-net: only allow if user is authorized to clear data (or if they are running in development mode)
        const userRes = await pool.query("SELECT staff_permissions FROM app_users WHERE id = $1", [req.user.id]);
        const permissions = userRes.rows[0]?.staff_permissions || {};
        const allowClear = permissions.pos_access?.Settings?.allow_clear_data_on_logout === true || req.user.role === 'master_admin';

        if (!allowClear && process.env.NODE_ENV !== 'development') {
            return res.status(403).json({ error: "Unauthorized to clear sales data" });
        }

        console.log(`[CLEAR-SALES-DATA] Wiping sales data from database for business ID: ${userId}`);

        // Delete sales data related to this business user ID
        await pool.query("DELETE FROM customer_transactions WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM customer_loyalty WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM customer_feedback WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM conversation_sessions WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM chat_messages WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM customers WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM kots WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM marketing_contacts WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM orders WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM business_expenses WHERE user_id = $1", [userId]);
        await pool.query("DELETE FROM inventory_logs WHERE biz_id = $1", [userId]);

        // Reset the active state on the server
        const restRes = await pool.query("SELECT settings FROM restaurants WHERE user_id = $1", [userId]);
        if (restRes.rows.length > 0) {
            const settings = restRes.rows[0].settings || {};
            const cleanSettings = { ...settings };
            Object.keys(cleanSettings).forEach(k => {
                if (k.startsWith("active_pos_state")) {
                    delete cleanSettings[k];
                }
            });
            await pool.query("UPDATE restaurants SET settings = $1 WHERE user_id = $2", [JSON.stringify(cleanSettings), userId]);
        }

        res.json({ success: true, message: "All POS sales and customer data successfully cleared from database." });
    } catch (err) {
        console.error("Failed to clear POS sales data from database:", err);
        res.status(500).json({ error: "Failed to clear sales data from database", details: err.message });
    }
});

module.exports = router;


