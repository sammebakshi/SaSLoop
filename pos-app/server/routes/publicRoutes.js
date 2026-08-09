const express = require("express");
const router = express.Router();
const pool = require("../db");
const whatsappManager = require("../whatsappManager");
const { isBusinessOpen, getDeliveryDetails } = require("../utils/businessUtils");
const { deductInventoryForOrder } = require("../utils/inventoryDeduction");

// Helper to ensure +CountryCode format
const formatToInter = (p) => {
    if (!p) return "";
    let digits = p.replace(/\D/g, "");
    if (digits.length === 10) digits = "91" + digits;
    return `+${digits}`;
};

// 📋 GET MENU FOR QR CUSTOMER
router.get("/menu/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { menuType } = req.query; // 'pos' or 'digital'
        let bizRes = await pool.query(
            `SELECT r.*, u.phone as whatsapp_number 
             FROM restaurants r 
             JOIN app_users u ON u.id = r.user_id 
             WHERE r.user_id = $1 OR r.id = $1`, 
             [userId]
        );
        
        if (bizRes.rows.length === 0) {
            // Fallback: If no specific restaurant found for requested userId/id, get default active restaurant
            bizRes = await pool.query(
                `SELECT r.*, u.phone as whatsapp_number 
                 FROM restaurants r 
                 JOIN app_users u ON u.id = r.user_id 
                 ORDER BY r.id ASC LIMIT 1`
            );
        }

        if (bizRes.rows.length === 0) return res.status(404).json({ error: "Business not found" });

        const actualUserId = bizRes.rows[0].user_id;
        const actualRestId = bizRes.rows[0].id;

        let items = [];
        let menuRes;

        const isTableMode = menuType === 'table' || req.query.is_table || req.query.table || req.query.tableNumber || req.query.table_number || req.query.mode === 'table';

        if (menuType === 'pos') {
            menuRes = await pool.query(
                "SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1 OR outlet_id = $2 OR user_id = $2) AND is_pos_default = true LIMIT 1",
                [userId, actualUserId]
            );
        } else if (isTableMode) {
            menuRes = await pool.query(
                "SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1 OR outlet_id = $2 OR user_id = $2) AND is_table_default = true LIMIT 1",
                [userId, actualUserId]
            );
            if (!menuRes || menuRes.rows.length === 0) {
                menuRes = await pool.query(
                    "SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1 OR outlet_id = $2 OR user_id = $2) AND (is_digital_default = true OR is_digital = true) ORDER BY is_digital_default DESC LIMIT 1",
                    [userId, actualUserId]
                );
            }
        } else {
            menuRes = await pool.query(
                "SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1 OR outlet_id = $2 OR user_id = $2) AND (is_digital_default = true OR is_digital = true) ORDER BY is_digital_default DESC LIMIT 1",
                [userId, actualUserId]
            );
        }

        // Fallback: If specific flags yield no menu, grab ANY available menu for the outlet
        if (!menuRes || menuRes.rows.length === 0) {
            menuRes = await pool.query(
                "SELECT id FROM outlet_menus WHERE (outlet_id = $1 OR user_id = $1 OR outlet_id = $2 OR user_id = $2) ORDER BY is_digital_default DESC, is_pos_default DESC, id ASC LIMIT 1",
                [userId, actualUserId]
            );
        }

        if (menuRes && menuRes.rows.length > 0) {
            const menuId = menuRes.rows[0].id;
            const itemsRes = await pool.query(
                `SELECT omi.id, 
                        omi.short_code as code, 
                        omi.item_name as product_name, 
                        omi.base_price as price, 
                        omi.is_active as availability, 
                        omi.image_url,
                        omi.description,
                        omi.food_type,
                        COALESCE(c.name, 'General') as category,
                        1 as tax_applicable
                 FROM outlet_menu_items omi
                 LEFT JOIN categories c ON omi.category_id = c.id
                 WHERE omi.menu_id = $1 AND omi.item_type = '0' AND omi.is_active = true
                   AND (c.id IS NULL OR c.is_active = true)
                   AND omi.item_name NOT IN (SELECT name FROM options_list)
                 ORDER BY omi.id ASC`,
                [menuId]
            );

            // 🍔 FETCH OPTION GROUPS & OPTIONS LIST FOR ITEMS
            const itemIds = itemsRes.rows.map(r => r.id);
            const optionsMap = {};
            if (itemIds.length > 0) {
                try {
                    const optGroupRes = await pool.query(
                        `SELECT DISTINCT ON (target_omi.id, og.id) 
                                target_omi.id as item_id, og.id as group_id, og.name as group_name, og.min_selectable, og.max_selectable, og.is_addon
                         FROM item_option_groups iog
                         JOIN option_groups og ON iog.group_id = og.id
                         JOIN outlet_menu_items linked_omi ON iog.item_id = linked_omi.id
                         JOIN outlet_menu_items target_omi ON target_omi.id = ANY($1) AND (
                             target_omi.id = linked_omi.id
                             OR target_omi.item_name ILIKE linked_omi.item_name
                         )
                         WHERE og.is_active = true
                         ORDER BY target_omi.id, og.id, og.sorting_order ASC`,
                        [itemIds]
                    );

                    for (const row of optGroupRes.rows) {
                        if (!optionsMap[row.item_id]) optionsMap[row.item_id] = [];
                        
                        // Fetch options specifically matching items after row.item_id (omi.id >= item_id)
                        let resolvedOptions = [];
                        try {
                            const listRes = await pool.query(
                                `SELECT DISTINCT ON (ol.id) 
                                    ol.id, ol.group_id, ol.name, ol.price_override, 
                                    omi.base_price as matched_price
                                 FROM options_list ol 
                                 LEFT JOIN outlet_menu_items omi ON omi.menu_id = $1 
                                    AND omi.item_name ILIKE ol.name 
                                    AND omi.is_active = true
                                    AND (omi.id >= $2 OR NOT EXISTS (
                                        SELECT 1 FROM outlet_menu_items sub 
                                        WHERE sub.menu_id = $1 AND sub.item_name ILIKE ol.name AND sub.id >= $2 AND sub.is_active = true
                                    ))
                                 WHERE ol.group_id = $3 AND ol.is_active = true 
                                 ORDER BY ol.id ASC, omi.id ASC`,
                                [menuId, row.item_id, row.group_id]
                            );
                            resolvedOptions = listRes.rows.map(ol => {
                                const overridePrice = parseFloat(ol.price_override) || 0;
                                const matchedPrice = parseFloat(ol.matched_price) || 0;
                                const price = overridePrice > 0 ? overridePrice : (matchedPrice > 0 ? matchedPrice : overridePrice);
                                return {
                                    id: ol.id,
                                    name: ol.name,
                                    price_override: overridePrice,
                                    matched_price: matchedPrice,
                                    price: price
                                };
                            });
                        } catch (err) {
                            console.error(`Error resolving options for item ${row.item_id}, group ${row.group_id}:`, err);
                        }

                        optionsMap[row.item_id].push({
                            id: row.group_id,
                            name: row.group_name,
                            min_selectable: row.min_selectable,
                            max_selectable: row.max_selectable,
                            is_addon: row.is_addon,
                            options: resolvedOptions
                        });
                    }
                } catch (optErr) {
                    console.error("🔥 Error fetching option groups for public menu items:", optErr);
                }
            }

            items = itemsRes.rows.map(item => ({
                ...item,
                is_veg: item.food_type === 'veg',
                price: parseFloat(item.price),
                option_groups: optionsMap[item.id] || []
            }));
        } else {
            // Fallback to legacy business_items
            const itemsRes = await pool.query(
                "SELECT *, 1 as tax_applicable FROM business_items WHERE user_id = $1 AND availability = true",
                [userId]
            );
            items = itemsRes.rows.map(item => ({
                ...item,
                is_veg: !!item.is_veg,
                price: parseFloat(item.price),
                option_groups: []
            }));
        }
        
        let discounts = [];
        try {
            const discRes = await pool.query(
                "SELECT id, name, rate AS value, discount_type AS type, outlet_id FROM discounts WHERE (user_id = $1 OR user_id = $2) AND is_active = true ORDER BY name ASC",
                [userId, actualUserId]
            );
            discounts = discRes.rows;
        } catch (discErr) {
            console.error("🔥 Error fetching discounts for public menu:", discErr);
        }

        let digitalSettings = {};
        try {
            const settingsRes = await pool.query(
                `SELECT * FROM digital_order_settings 
                 WHERE outlet_id = $1 OR outlet_id = $2 
                    OR outlet_id IN (SELECT id FROM restaurants WHERE user_id = $1 OR user_id = $2 OR id = $1 OR id = $2)
                 LIMIT 1`,
                [userId, actualUserId]
            );
            if (settingsRes.rows.length > 0) {
                digitalSettings = settingsRes.rows[0];
            }
        } catch (settingsErr) {
            console.error("🔥 Error fetching digital_order_settings for public menu:", settingsErr);
        }
        // Resolve the online order UPI ID
        let onlineOrderUpiId = null;
        try {
            const biz = bizRes.rows[0];
            let settings = biz.settings || {};
            if (typeof settings === "string") {
                try { settings = JSON.parse(settings); } catch (e) { settings = {}; }
            }

            if (settings.online_order_upi_source === 'dedicated' && settings.online_order_upi_id) {
                onlineOrderUpiId = settings.online_order_upi_id;
            } else {
                // Use first active POS QR
                const qrRes = await pool.query(
                    "SELECT upi_id FROM outlet_qrs WHERE user_id = $1 AND is_active = true ORDER BY id ASC LIMIT 1",
                    [actualUserId]
                );
                if (qrRes.rows.length > 0) {
                    onlineOrderUpiId = qrRes.rows[0].upi_id;
                }
            }
        } catch (upiErr) {
            console.error("🔥 Error resolving online order UPI ID:", upiErr);
        }
        
        res.json({
            business: bizRes.rows[0],
            digital_settings: digitalSettings,
            items: items,
            discounts: discounts,
            online_order_upi_id: onlineOrderUpiId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
    }
});

// ────────── WHATSAPP OTP LOGIN ──────────

// In-memory OTP store: { "phone": { otp: "1234", expiresAt: Date, userId: "1" } }
const otpStore = new Map();

// 📲 SEND WHATSAPP OTP
router.post("/send-whatsapp-otp", async (req, res) => {
    try {
        const { userId, phone } = req.body;
        if (!phone || phone.replace(/\D/g, "").length < 10) {
            return res.status(400).json({ error: "Invalid phone number" });
        }

        const digits = phone.replace(/\D/g, "");
        const last10 = digits.slice(-10);
        const otp = String(Math.floor(1000 + Math.random() * 9000)); // 4-digit random OTP
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry

        otpStore.set(last10, { otp, expiresAt, userId });

        // Send OTP via WhatsApp
        const fullNumber = `+91${last10}`;
        const otpMsg = `🔐 *Your OTP for Online Menu Login*\n\n*${otp}*\n\nThis code expires in 5 minutes. Do not share it with anyone.\n\n— SaSLoop Ordering`;

        try {
            const { sendOfficialMessage } = require("../whatsappManager");
            await sendOfficialMessage(fullNumber, otpMsg, userId);
            console.log(`📲 WhatsApp OTP ${otp} sent to ${fullNumber} for user ${userId}`);
        } catch (waErr) {
            console.error("WhatsApp OTP send error (will still return success):", waErr);
        }

        res.json({ success: true, message: "OTP sent to your WhatsApp" });
    } catch (err) {
        console.error("Send OTP error:", err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// ✅ VERIFY WHATSAPP OTP
router.post("/verify-whatsapp-otp", async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ error: "Phone and OTP are required" });
        }

        const digits = phone.replace(/\D/g, "");
        const last10 = digits.slice(-10);
        const stored = otpStore.get(last10);

        if (!stored) {
            return res.status(400).json({ error: "No OTP was sent to this number. Please request a new one." });
        }

        if (Date.now() > stored.expiresAt) {
            otpStore.delete(last10);
            return res.status(400).json({ error: "OTP expired. Please request a new one." });
        }

        if (stored.otp !== otp.trim()) {
            return res.status(400).json({ error: "Invalid OTP. Please check your WhatsApp message." });
        }

        // OTP verified — clean up
        otpStore.delete(last10);
        res.json({ success: true });
    } catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ error: "Verification failed" });
    }
});

// 🎁 GET CUSTOMER LOYALTY BALANCE & BACKOFFICE RULES
router.get("/customer-loyalty", async (req, res) => {
    try {
        const { userId, phone } = req.query;
        if (!userId || !phone) {
            return res.status(400).json({ error: "userId and phone are required" });
        }

        const cleanPhone = phone.replace(/\D/g, "");
        const tenDigits = cleanPhone.slice(-10);

        const bizRes = await pool.query(
            "SELECT loyalty_enabled, loyalty_joining_points, loyalty_bill_amount_threshold, loyalty_points_earned, loyalty_points_dinein, loyalty_points_pickup, loyalty_points_delivery, points_to_amount_ratio, min_redeem_points, max_redeem_per_order FROM restaurants WHERE user_id = $1 OR id = $1 LIMIT 1",
            [userId]
        );

        if (bizRes.rows.length === 0) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        const biz = bizRes.rows[0];

        const loyaltyRes = await pool.query(
            `SELECT * FROM customer_loyalty 
             WHERE (user_id = $1 OR user_id = 2) 
               AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $2 
             LIMIT 1`,
            [userId, tenDigits]
        );

        let points = 0;
        let totalSpent = 0;
        if (loyaltyRes.rows.length > 0) {
            points = parseInt(loyaltyRes.rows[0].points) || 0;
            totalSpent = parseFloat(loyaltyRes.rows[0].total_spent) || 0;
        }

        res.json({
            loyalty_enabled: biz.loyalty_enabled ?? true,
            points: points,
            total_spent: totalSpent,
            joining_points: parseInt(biz.loyalty_joining_points) || 0,
            points_to_amount_ratio: parseFloat(biz.points_to_amount_ratio) || 1.0,
            min_redeem_points: parseInt(biz.min_redeem_points) || 0,
            max_redeem_per_order: parseInt(biz.max_redeem_per_order) || 500,
            loyalty_bill_amount_threshold: parseFloat(biz.loyalty_bill_amount_threshold) || 100,
            loyalty_points_earned: parseInt(biz.loyalty_points_earned) || 1
        });
    } catch (err) {
        console.error("Fetch public customer loyalty error:", err);
        res.status(500).json({ error: "Failed to fetch loyalty status" });
    }
});

// ────────── PAYMENT CONFIRMATION (I've Paid) ──────────

// 💰 CUSTOMER CONFIRMS PAYMENT
router.post("/order/confirm-payment", async (req, res) => {
    try {
        const { orderId, orderRef, phone } = req.body;
        if (!orderRef && !orderId) {
            return res.status(400).json({ error: "Order reference required" });
        }

        // Find the order
        let orderQuery = orderId 
            ? "SELECT * FROM orders WHERE id = $1"
            : "SELECT * FROM orders WHERE order_reference = $1";
        const orderRes = await pool.query(orderQuery, [orderId || orderRef]);

        if (orderRes.rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const order = orderRes.rows[0];

        // Update payment_status to CUSTOMER_CONFIRMED
        await pool.query(
            "UPDATE orders SET payment_status = $1 WHERE id = $2",
            ["CUSTOMER_CONFIRMED", order.id]
        );

        // Notify staff via WhatsApp
        try {
            const { sendOfficialMessage } = require("../whatsappManager");
            const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [order.user_id]);
            if (bizRes.rows.length > 0) {
                const biz = bizRes.rows[0];
                const settings = typeof biz.settings === 'string' 
                    ? JSON.parse(biz.settings) 
                    : (biz.settings || {});
                let staffNumbers = (settings.staff_wa_numbers || "").split(",").map(n => n.trim()).filter(Boolean);

                // Fallback to restaurant business phone / whatsapp_number if staff numbers empty
                if (staffNumbers.length === 0 && (biz.phone || biz.whatsapp_number)) {
                    staffNumbers = [biz.phone || biz.whatsapp_number];
                }

                for (const num of staffNumbers) {
                    await sendOfficialMessage(
                        num,
                        `💰 *PAYMENT CONFIRMED BY CUSTOMER*\n\nOrder: *${order.order_reference}*\nAmount: ₹${order.total_price}\nCustomer: ${order.customer_name || 'N/A'}\nPhone: ${order.customer_number || 'N/A'}\n\n⚠️ Customer clicked "I've Paid" on digital menu. Please check your UPI App to verify!`,
                        order.user_id
                    );
                }
            }
        } catch (notifyErr) {
            console.error("Staff notification error:", notifyErr);
        }

        res.json({ success: true, message: "Payment confirmation received" });
    } catch (err) {
        console.error("Confirm payment error:", err);
        res.status(500).json({ error: "Failed to confirm payment" });
    }
});
 
// 📋 CHECK TABLE STATUS
router.get("/table-status/:userId/:tableName", async (req, res) => {
    try {
        const { userId, tableName } = req.params;
        const rawTable = String(tableName || '').trim();
        const cleanTable = rawTable.replace(/^Table\s+/i, '').trim();
        
        let bizRes = await pool.query("SELECT user_id, id, settings FROM restaurants WHERE user_id = $1 OR id = $1", [userId]);
        if (bizRes.rows.length === 0) {
            bizRes = await pool.query("SELECT user_id, id, settings FROM restaurants ORDER BY id ASC LIMIT 1");
        }
        const targetUserId = bizRes.rows[0]?.user_id || userId;
        const rawSettings = bizRes.rows[0]?.settings;
        const settings = rawSettings ? (typeof rawSettings === 'string' ? JSON.parse(rawSettings) : rawSettings) : {};

        // 1. Check POS Active State (saved draft table bills in Master POS)
        let isOccupiedInState = false;
        let activeItemsInState = [];
        let stateCustomerNumber = null;
        const activePosState = settings.active_pos_state;
        if (activePosState) {
            const tableBills = activePosState.tableBills || {};
            const tableCustomers = activePosState.tableCustomers || activePosState.tableCustomerPhone || {};
            
            // Check keys (e.g. "1" or "Table 1")
            const matchedKey = Object.keys(tableBills).find(k => String(k).replace(/^Table\s+/i, '').trim() === cleanTable);
            if (matchedKey && Array.isArray(tableBills[matchedKey])) {
                const uncancelledItems = tableBills[matchedKey].filter(i => i && !i.isCancelled);
                if (uncancelledItems.length > 0) {
                    isOccupiedInState = true;
                    activeItemsInState = uncancelledItems;
                }
            }

            const matchedCustKey = Object.keys(tableCustomers).find(k => String(k).replace(/^Table\s+/i, '').trim() === cleanTable);
            if (matchedCustKey) {
                const val = tableCustomers[matchedCustKey];
                stateCustomerNumber = typeof val === 'object' ? (val.phone || val.customer_number) : String(val);
            }
        }

        // 2. Check pos_tables table
        const result = await pool.query(
            "SELECT id, table_name, status FROM pos_tables WHERE (user_id = $1 OR user_id = $2) AND (table_name ILIKE $3 OR table_name ILIKE 'Table ' || $3 OR replace(table_name, ' ', '') ILIKE replace($3, ' ', ''))",
            [userId, targetUserId, cleanTable]
        );

        let dbStatus = result.rows[0]?.status || "AVAILABLE";

        // 3. Check active session orders created in DB within the last 12 hours
        const sessionOrdersRes = await pool.query(
            "SELECT id, order_reference, customer_name, customer_number, items, total_price, status, created_at FROM orders WHERE (user_id = $1 OR user_id = $2) AND (table_number = $3 OR table_number = 'Table ' || $3 OR replace(table_number, ' ', '') ILIKE replace($3, ' ', '')) AND status IN ('PENDING', 'PROCESSING', 'PREPARING', 'ACKNOWLEDGED', 'FOOD_READY', 'SAVED', 'DISPATCHED') AND created_at >= NOW() - INTERVAL '12 hours' ORDER BY created_at DESC",
            [userId, targetUserId, cleanTable]
        );

        const sessionOrders = sessionOrdersRes.rows || [];
        const hasActiveDbOrder = sessionOrders.length > 0;

        // Table is occupied ONLY if there are active items in POS state OR an active session order from the last 12 hours
        const isOccupied = isOccupiedInState || hasActiveDbOrder || ( (dbStatus === 'OCCUPIED' || dbStatus === 'SAVED') && (isOccupiedInState || hasActiveDbOrder) );
        const finalCustomerNumber = hasActiveDbOrder ? sessionOrders[0]?.customer_number : (isOccupiedInState ? stateCustomerNumber : null);

        res.json({
            status: isOccupied ? "OCCUPIED" : "AVAILABLE",
            customer_number: isOccupied ? finalCustomerNumber : null,
            active_order: isOccupied ? (sessionOrders[0] || (isOccupiedInState ? { items: activeItemsInState, customer_number: finalCustomerNumber } : null)) : null,
            session_orders: isOccupied ? (sessionOrders.length > 0 ? sessionOrders : (isOccupiedInState && activeItemsInState.length > 0 ? [{ id: 'pos-draft', order_reference: 'POS Table Draft', items: activeItemsInState, status: 'SAVED', created_at: new Date() }] : [])) : []
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 🔔 CALL WAITER NOTIFICATION FOR TABLE DINE-IN
router.post("/call-waiter", async (req, res) => {
    try {
        const { userId, tableNumber, message } = req.body;
        if (!userId || !tableNumber) {
            return res.status(400).json({ error: "userId and tableNumber are required" });
        }

        // Resolve actual business user_id (handles alias IDs in QR URLs)
        let actualUserId = userId;
        try {
            const bizCheck = await pool.query(
                "SELECT user_id FROM restaurants WHERE user_id = $1 OR id = $1 LIMIT 1",
                [userId]
            );
            if (bizCheck.rows.length > 0) {
                actualUserId = bizCheck.rows[0].user_id;
            } else {
                const fallbackBiz = await pool.query("SELECT user_id FROM restaurants ORDER BY id ASC LIMIT 1");
                if (fallbackBiz.rows.length > 0) {
                    actualUserId = fallbackBiz.rows[0].user_id;
                }
            }
        } catch (e) {}

        const finalUserId = parseInt(actualUserId, 10) || actualUserId;
        const tableText = String(tableNumber).replace(/^Table\s+/i, '');
        const alertMessage = message || `🔔 Table ${tableText} is calling for waiter assistance!`;

        // Ensure table has message column and save
        try {
            await pool.query("ALTER TABLE waiter_requests ADD COLUMN IF NOT EXISTS message TEXT");
            await pool.query(
                "INSERT INTO waiter_requests (user_id, table_number, message, status) VALUES ($1, $2, $3, 'PENDING')",
                [finalUserId, tableText, alertMessage]
            );
        } catch (dbErr) {
            console.error("Waiter request DB insert error (fallback insert):", dbErr);
            try {
                await pool.query(
                    "INSERT INTO waiter_requests (user_id, table_number, status) VALUES ($1, $2, 'PENDING')",
                    [finalUserId, tableText]
                );
            } catch (e) {
                console.error("Waiter request secondary insert error:", e);
            }
        }

        const io = req.app.get("io");
        if (io) {
            io.emit(`waiter_call_${finalUserId}`, {
                userId: finalUserId,
                tableNumber: tableText,
                message: alertMessage,
                timestamp: new Date().toISOString(),
                hasAudioAlert: true
            });
            io.emit("waiter_call", {
                userId: finalUserId,
                tableNumber: tableText,
                message: alertMessage,
                timestamp: new Date().toISOString(),
                hasAudioAlert: true
            });
        }

        console.log(`🔔 Waiter call saved & emitted for Biz ${finalUserId} (req: ${userId}), Table ${tableText}`);
        res.json({ success: true, message: `Waiter requested for Table ${tableText}` });
    } catch (err) {
        console.error("Call waiter error:", err);
        res.status(500).json({ error: "Failed to request waiter" });
    }
});

// 🚀 PLACE ORDER (QR / ONLINE)
router.post("/order", async (req, res) => {
    try {
        const { userId, tableNumber, items, totalPrice, customerName, customerPhone, pointsToRedeem, address, fulfillmentMode, source, subtotal: frontendSubtotal, cgst: frontendCgst, sgst: frontendSgst, status: customStatus, paymentMethod, paymentStatus, discount_amount, service_charge } = req.body;
        
        // 🌍 STANDARDIZE: Always +91... format
        const dbPhone = formatToInter(customerPhone);
        
        const isOnline = source === "ONLINE_ORDER";
        const isPOS = source === "POS_MANUAL";
        const prefix = isOnline ? "ONL" : (isPOS ? "POS" : "QR");
        const orderRef = `${prefix}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1 OR id = $1", [userId]);
        const bizData = bizRes.rows[0];
        if (!bizData) return res.status(404).json({ error: "Business details not found" });
        const targetUserId = bizData.user_id;

        // --- 🕒 CHECK BUSINESS HOURS ---
        const bizStatus = isBusinessOpen(bizData.settings);
        if (!bizStatus.isOpen) {
            return res.status(403).json({ 
                error: "Business is currently CLOSED.", 
                details: `Working hours: ${bizStatus.openingTime} - ${bizStatus.closingTime}` 
            });
        }

        const currSymbol = bizData?.currency_code === 'INR' ? '₹' : (bizData?.currency_code === 'USD' ? '$' : '₹');
        
        // 🛒 SERVER-SIDE PRICE VALIDATION
        let calculatedSubtotal = 0;
        try {
            const safeItems = Array.isArray(items) ? items : (typeof items === 'string' ? JSON.parse(items) : []);
            const itemIds = safeItems.map(i => i.id).filter(id => id);
            if (itemIds.length > 0) {
                const priceMap = {};

                // 1. Try fetching from outlet_menu_items first
                const dbMenuRes = await pool.query(
                    "SELECT id, base_price as price FROM outlet_menu_items WHERE id = ANY($1)", 
                    [itemIds]
                );
                dbMenuRes.rows.forEach(row => priceMap[row.id] = parseFloat(row.price));

                // 2. Check for missing IDs and fetch them from business_items
                const missingIds = itemIds.filter(id => !priceMap[id]);
                if (missingIds.length > 0) {
                    const dbBizRes = await pool.query(
                        "SELECT id, price FROM business_items WHERE id = ANY($1)", 
                        [missingIds]
                    );
                    dbBizRes.rows.forEach(row => priceMap[row.id] = parseFloat(row.price));
                }
                
                safeItems.forEach(item => {
                    const dbPrice = priceMap[item.id] || parseFloat(item.price) || 0;
                    calculatedSubtotal += (dbPrice * (parseInt(item.qty) || 1));
                });
            } else {
                // Fallback for custom items if allowed, or just use frontend price if items is empty
                calculatedSubtotal = parseFloat(totalPrice) || 0;
            }
        } catch (e) { console.error("Price validation error:", e); calculatedSubtotal = parseFloat(totalPrice) || 0; }

        let finalPrice = calculatedSubtotal;
        // Apply taxes if business has them
        const taxRate = (parseFloat(bizData.cgst_percent) || 0) + (parseFloat(bizData.sgst_percent) || 0);
        if (taxRate > 0) finalPrice += (calculatedSubtotal * (taxRate / 100));
        // Apply discount
        if (discount_amount) finalPrice -= parseFloat(discount_amount);
        
        let redeemedPoints = 0;

        // Loyalty Redemption Logic (Online Menu & WhatsApp)
        const ptsRatio = parseFloat(bizData?.points_to_amount_ratio) || 1.00;
        const ptsEnabled = bizData?.loyalty_enabled !== false;
        const minRedeem = parseInt(bizData?.min_redeem_points) || 0;
        const ptsInput = parseInt(pointsToRedeem || req.body.points_redeemed || 0);

        if (ptsEnabled && ptsInput > 0 && ptsInput >= minRedeem && dbPhone) {
            try {
                const cleanNum = dbPhone.replace(/\D/g, "");
                const tenDigits = cleanNum.slice(-10);
                const checkPoints = await pool.query(
                    `SELECT points FROM customer_loyalty 
                     WHERE (user_id = $1 OR user_id = 2) 
                       AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $2 
                     LIMIT 1`,
                    [targetUserId, tenDigits]
                );

                const available = checkPoints.rows[0]?.points || 0;
                if (available >= ptsInput) {
                    const maxRedeem = parseInt(bizData?.max_redeem_per_order) || 500;
                    redeemedPoints = Math.min(ptsInput, available, maxRedeem);

                    // ✅ DEDUCT POINTS FROM BALANCE
                    await pool.query(
                        `UPDATE customer_loyalty 
                         SET points = COALESCE(points, 0) - $1 
                         WHERE (user_id = $2 OR user_id = 2) 
                           AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $3`,
                        [redeemedPoints, targetUserId, tenDigits]
                    );

                    // Log redemption transaction
                    await pool.query(
                        `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
                         VALUES ($1, $2, 'POINTS_REDEEMED', 0.00, $3, $4, NOW())`,
                        [targetUserId, dbPhone, -redeemedPoints, `Points redeemed for Order Ref: ${orderRef}`]
                    );
                    console.log(`🎁 Deducted ${redeemedPoints} points from ${dbPhone} for Biz ${targetUserId}`);
                }
            } catch (e) { console.error("Redemption logic fail:", e); }
        }
        
        let finalDeliveryCharge = 0;
        let finalOrderAddress = address || (tableNumber && tableNumber !== "0" ? `Table ${tableNumber}` : "Pickup");

        // --- 🛵 DELIVERY VALIDATION ---
        if (fulfillmentMode === "DELIVERY") {
            // If we have coordinates from the frontend, use them for verification
            const { lat, lng } = req.body.deliveryCoords || {};
            if (lat && lng) {
                const delivery = await getDeliveryDetails(bizData, lat, lng);
                if (!delivery.serviceable) {
                    return res.status(400).json({ error: "Location outside delivery radius." });
                }
                finalDeliveryCharge = delivery.charge;
            } else {
                // If no coords, use what frontend sent (trusted for now but less secure)
                finalDeliveryCharge = parseFloat(service_charge) || 0;
            }
        }

        // SMART UPSERT LOGIC (Recognize active table orders to allow adding more dishes)
        let existingOrder = null;
        if (tableNumber && tableNumber !== "0" && (source === "POS_MANUAL" || source === "QR_MENU")) {
           const checkRes = await pool.query(
             "SELECT id, order_reference, items, total_price, discount_amount, service_charge, delivery_charge, redeemed_points FROM orders WHERE user_id=$1 AND table_number=$2 AND status IN ('PENDING', 'PROCESSING', 'PREPARING') ORDER BY created_at DESC LIMIT 1",
             [targetUserId, tableNumber]
           );
           existingOrder = checkRes.rows[0];
        }

        const isCOD = paymentMethod === 'CASH' || !paymentMethod;
        const initialStatus = customStatus || (isCOD ? 'PENDING' : 'AWAITING_PAYMENT');

        const itemsData = typeof items === 'string' ? JSON.parse(items) : (items || []);
        let finalSource = source;
        const determinedOrderType = fulfillmentMode || (tableNumber && tableNumber !== "0" ? "DINE_IN" : "PICKUP");
        const insertRes = await pool.query(
            "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, table_number, payment_method, payment_status, discount_amount, service_charge, delivery_charge, redeemed_points, source, order_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
            [targetUserId, customerName || "Guest", dbPhone || (isPOS ? "POS-MANUAL" : "QR-ORDER"), finalOrderAddress, JSON.stringify(itemsData), finalPrice, orderRef, initialStatus, tableNumber, paymentMethod || 'CASH', paymentStatus || 'PENDING', discount_amount || 0, service_charge || 0, finalDeliveryCharge, redeemedPoints, finalSource, determinedOrderType]
        );
        const orderId = insertRes.rows[0].id;

        // ✅ INSTANTLY OCCUPY TABLE & SYNC ACCUMULATED ITEMS IN POS & DB
        if (tableNumber && tableNumber !== "0") {
            try {
                const cleanTableStr = String(tableNumber).replace(/^Table\s+/i, '').trim();
                await pool.query(
                    "UPDATE pos_tables SET status = 'OCCUPIED', updated_at = NOW() WHERE (user_id = $1 OR user_id = $2) AND (table_name ILIKE $3 OR table_name ILIKE 'Table ' || $3 OR replace(table_name, ' ', '') ILIKE replace($3, ' ', ''))",
                    [userId, targetUserId, cleanTableStr]
                );

                // Fetch matching table database object
                const posTableRes = await pool.query(
                    "SELECT id, table_name FROM pos_tables WHERE (user_id = $1 OR user_id = $2) AND (table_name ILIKE $3 OR table_name ILIKE 'Table ' || $3 OR replace(table_name, ' ', '') ILIKE replace($3, ' ', '')) LIMIT 1",
                    [userId, targetUserId, cleanTableStr]
                );
                const posTableObj = posTableRes.rows[0];
                const dbTableId = posTableObj ? String(posTableObj.id) : null;
                const dbTableName = posTableObj ? posTableObj.table_name : `Table ${cleanTableStr}`;

                // Format order items for POS table bill items
                const rawItems = Array.isArray(itemsData) ? itemsData : (typeof itemsData === 'string' ? JSON.parse(itemsData || '[]') : []);
                const formattedItems = rawItems.map(i => ({
                    id: i.id,
                    product_name: i.product_name || i.name || 'Item',
                    name: i.product_name || i.name || 'Item',
                    qty: parseFloat(i.qty || i.quantity || 1),
                    quantity: parseFloat(i.qty || i.quantity || 1),
                    price: parseFloat(i.price || 0),
                    modifiers: i.modifiers || [],
                    kot_category: i.kot_category || 'Main Kitchen'
                }));

                // Sync active_pos_state in settings so Master POS picks up table occupation immediately
                const resSetting = await pool.query("SELECT settings FROM restaurants WHERE user_id = $1 OR id = $1 LIMIT 1", [targetUserId]);
                if (resSetting.rows.length > 0) {
                    let curSettings = resSetting.rows[0].settings;
                    if (typeof curSettings === 'string') {
                        try { curSettings = JSON.parse(curSettings); } catch(e) { curSettings = {}; }
                    }
                    curSettings = curSettings || {};
                    const activePosState = curSettings.active_pos_state || {};
                    const tableBills = activePosState.tableBills || {};
                    const tableStatuses = activePosState.tableStatuses || {};
                    const tableBillNumbers = activePosState.tableBillNumbers || {};
                    const tableActiveTimestamps = activePosState.tableActiveTimestamps || {};
                    const tableCustomers = activePosState.tableCustomers || {};

                    const keysToUpdate = [cleanTableStr, `Table ${cleanTableStr}`, dbTableName, dbTableId].filter(Boolean);
                    keysToUpdate.forEach(key => {
                        const existingBill = Array.isArray(tableBills[key]) ? tableBills[key].filter(i => i && !i.isCancelled) : [];
                        tableBills[key] = [...existingBill, ...formattedItems];
                        tableStatuses[key] = 'SAVED';
                        tableBillNumbers[key] = orderRef;
                        tableActiveTimestamps[key] = Date.now();
                        tableCustomers[key] = {
                            customerName: customerName || 'WhatsApp Customer',
                            customerPhone: dbPhone || ''
                        };
                    });

                    activePosState.tableBills = tableBills;
                    activePosState.tableStatuses = tableStatuses;
                    activePosState.tableBillNumbers = tableBillNumbers;
                    activePosState.tableActiveTimestamps = tableActiveTimestamps;
                    activePosState.tableCustomers = tableCustomers;
                    curSettings.active_pos_state = activePosState;

                    await pool.query("UPDATE restaurants SET settings = $1 WHERE user_id = $2 OR id = $2", [JSON.stringify(curSettings), targetUserId]);
                }

                    // Emit Socket.IO Event for instant POS Table Grid refresh
                    const io = req.app.get("io");
                    if (io) {
                        io.emit(`table_status_${targetUserId}`, { tableNumber: cleanTableStr, status: 'SAVED', customerNumber: dbPhone, items: formattedItems });
                        io.emit("table_status_update", { userId: targetUserId, tableNumber: cleanTableStr, status: 'SAVED', customerNumber: dbPhone, items: formattedItems });
                    }
                    console.log(`🪑 Table ${tableNumber} INSTANTLY marked as SAVED with ${formattedItems.length} items for Biz ${targetUserId}`);
                } catch (posErr) { console.error("POS Instant Table Occupy Error:", posErr.message); }
            }
        
        // 🧹 TABLE CLEANUP: If this is a COMPLETED POS order for a table, mark other active orders for that table as COMPLETED too
        if (tableNumber && tableNumber !== "0" && initialStatus === 'COMPLETED' && source === "POS_MANUAL") {
            await pool.query(
                "UPDATE orders SET status = 'COMPLETED', payment_status = 'PAID' WHERE user_id = $1 AND table_number = $2 AND status IN ('PENDING', 'PROCESSING', 'PREPARING') AND id != $3",
                [userId, tableNumber, orderId]
            );
        }
        
        // Notify Staff (Instant notification for all order types)
        if (true) {
            try {
                const cgstRate = parseFloat(bizData?.cgst_percent) || 0;
                const sgstRate = parseFloat(bizData?.sgst_percent) || 0;
                let subtotalCalc = parseFloat(frontendSubtotal) || 0;
                if (!frontendSubtotal && items) {
                    const itemsArr = Array.isArray(items) ? items : (typeof items === 'string' ? JSON.parse(items) : []);
                    itemsArr.forEach(i => subtotalCalc += ((parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0)));
                }
                
                const itemsArr = Array.isArray(items) ? items : (typeof items === 'string' ? JSON.parse(items) : []);
                await whatsappManager.notifyKitchenAndStaff(
                    userId, currentOrderRef, customerName || "Guest", dbPhone || "QR-Customer", itemsArr,
                    subtotalCalc, finalPrice, parseFloat(frontendCgst) || 0, parseFloat(frontendSgst) || 0, cgstRate, sgstRate, currSymbol,
                    (fulfillmentMode || "QR").toLowerCase(), finalOrderAddress, (tableNumber && tableNumber !== "0") ? tableNumber : null
                );
            } catch (notifErr) { console.error("KITCHEN NOTIF FAIL:", notifErr.message); }
        }
        
        // 📦 Deduct inventory stock if tracking enabled for Online / QR menu channel
        await deductInventoryForOrder(targetUserId, items, source || 'ONLINE', currentOrderRef);
        
        // Notify Customer (Send receipt to everyone with a phone number)
        if (dbPhone && dbPhone.startsWith('+')) {
            try {
                const itemLines = (items || []).map(i => `• ${i.qty || i.quantity || 1}x ${i.product_name || i.name || 'Item'}`).join("\n");
                
                const receiptRows = [
                    `⏳ *Order Placed!*`,
                    ``,
                    `*${bizData?.name || 'Restaurant'}* received your order.`,
                    `*Please wait for us to accept it.*`,
                    `*Ref:* ${currentOrderRef}`,
                    `───────────────`,
                    itemLines,
                    `───────────────`
                ];

                if (bizData?.show_gst_on_receipt) {
                    const cgst = parseFloat(frontendCgst) || 0;
                    const sgst = parseFloat(frontendSgst) || 0;
                    if (cgst > 0) receiptRows.push(`CGST: ${currSymbol}${cgst.toFixed(2)}`);
                    if (sgst > 0) receiptRows.push(`SGST: ${currSymbol}${sgst.toFixed(2)}`);
                }

                if (finalDeliveryCharge > 0) {
                    receiptRows.push(`🚚 Delivery: ${currSymbol}${finalDeliveryCharge.toFixed(2)}`);
                }

                receiptRows.push(`💰 *Total:* ${currSymbol}${finalPrice}`);
                receiptRows.push(``);
                receiptRows.push(`We'll update you when it's ready! 🔥`);
                
                const baseUrl = process.env.FRONTEND_URL || 'https://menu.sasloop.in';
                const trackingLink = `${baseUrl}/track/${currentOrderRef}`;
                receiptRows.push(`\n📍 *Track Live:* ${trackingLink}`);

                const custMsg = receiptRows.join("\n");
                await whatsappManager.sendOfficialMessage(dbPhone, custMsg, userId);
            } catch (custErr) { console.error("Customer Msg failed:", custErr.message); }
        }
        
        // (Loyalty EARNING removed from here - now handled on COMPLETED status in orderRoutes.js)
        res.json({ success: true, orderId, orderRef: currentOrderRef, finalPrice, redeemedPoints });
    } catch (err) {
        console.error("CRITICAL ORDER ERROR:", err);
        res.status(500).json({ error: "Internal Error. Please try again." });
    }
});

// 🔍 GET ORDER STATUS FOR ONLINE MENU CUSTOMER
router.get("/order-status/:orderRef", async (req, res) => {
    try {
        const { orderRef } = req.params;
        const cleanRef = String(orderRef || '').trim();
        const result = await pool.query(
            `SELECT id, order_reference, status, rejection_reason, payment_status, total_price, customer_name, created_at 
             FROM orders 
             WHERE order_reference = $1 OR id::text = $1 OR order_reference LIKE $2 OR $1 LIKE '%' || order_reference || '%'
             ORDER BY created_at DESC LIMIT 1`,
            [cleanRef, `%${cleanRef}%`]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Order status fetch error:", err);
        res.status(500).json({ error: "Failed to fetch order status" });
    }
});

// 🚫 CANCEL ONLINE ORDER & DEDUCT LOYALTY POINTS
router.post("/order/cancel", async (req, res) => {
    try {
        const { orderRef, reason } = req.body;
        if (!orderRef) return res.status(400).json({ error: "Order reference is required." });

        const checkRes = await pool.query(
            "SELECT * FROM orders WHERE order_reference = $1 OR id::text = $1 LIMIT 1",
            [orderRef]
        );
        if (checkRes.rows.length === 0) {
            return res.status(404).json({ error: "Order not found." });
        }

        const order = checkRes.rows[0];
        if (order.status === 'CANCELLED') {
            return res.json({ success: true, message: "Order already cancelled.", order });
        }

        const finalReason = reason || "Cancelled by Customer";

        const updateRes = await pool.query(
            "UPDATE orders SET status = 'CANCELLED', rejection_reason = $1 WHERE id = $2 RETURNING *",
            [finalReason, order.id]
        );

        // 🔥 Dispatch WhatsApp Cancellation Notification to Kitchen & Staff numbers
        try {
            const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [order.user_id]);
            if (bizRes.rows.length > 0) {
                const bizRow = bizRes.rows[0];
                let staffList = [];
                const rawStaff = bizRow?.notification_numbers;
                if (Array.isArray(rawStaff)) {
                    staffList = rawStaff;
                } else if (typeof rawStaff === 'string') {
                    try {
                        const parsed = JSON.parse(rawStaff);
                        staffList = Array.isArray(parsed) ? parsed : [rawStaff];
                    } catch (e) {
                        staffList = [rawStaff];
                    }
                }
                if (bizRow?.phone) staffList.push(bizRow.phone);
                if (bizRow?.contact_number) staffList.push(bizRow.contact_number);

                const kitchenNum = bizRow?.kitchen_number || bizRow?.kitchen_phone;

                const notifyTargets = new Set();
                if (kitchenNum) {
                    const cleanK = String(kitchenNum).replace(/[^0-9+]/g, '');
                    if (cleanK.length >= 10) notifyTargets.add(cleanK);
                }
                staffList.forEach(n => {
                    if (n && typeof n === 'string') {
                        const clean = n.replace(/[^0-9+]/g, '');
                        if (clean.length >= 10) notifyTargets.add(clean);
                    }
                });

                const cancelAlert = `🛑 *CUSTOMER CANCELLED ORDER!*\n━━━━━━━━━━━━━━\nOrder Ref: *${order.order_reference || order.id}*\nCustomer: ${order.customer_name || 'Customer'} (${order.customer_number || ''})\nTotal Amount: ₹${parseFloat(order.total_price || 0).toFixed(2)}\nReason: ${finalReason}\n\nPlease STOP preparation immediately! 🚫`;

                for (let targetNum of notifyTargets) {
                    await whatsappManager.sendOfficialMessage(targetNum, cancelAlert, order.user_id);
                }
            }
        } catch (cancelNotifErr) {
            console.error("Online Menu Cancel WhatsApp alert fail:", cancelNotifErr);
        }

        // 🔄 REFUND REDEEMED POINTS ON CANCELLATION
        const redeemedPts = parseInt(order.redeemed_points) || 0;
        if (redeemedPts > 0) {
            try {
                const cleanPhone = (order.customer_number || "").replace(/\D/g, "");
                const tenDigits = cleanPhone.slice(-10);
                if (tenDigits.length === 10) {
                    await pool.query(
                        `UPDATE customer_loyalty SET points = COALESCE(points, 0) + $1 
                         WHERE (user_id = $2 OR user_id = 2) 
                           AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $3`,
                        [redeemedPts, order.user_id, tenDigits]
                    );
                    await pool.query(
                        `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
                         VALUES ($1, $2, 'POINTS_REFUNDED', 0.00, $3, $4, NOW())`,
                        [order.user_id, order.customer_number, redeemedPts, `Redeemed points refunded for cancelled Order: ${order.order_reference || order.id}`]
                    );
                    console.log(`🔄 Refunded ${redeemedPts} redeemed points to ${order.customer_number} for cancelled order ${order.order_reference}`);
                }
            } catch (refundErr) {
                console.error("Refund redeemed points on cancel fail:", refundErr);
            }
        }

        // 🔄 REVERSE EARNED POINTS ON CANCELLATION (only if order was completed and points were awarded)
        if (order.status === 'COMPLETED' || order.status === 'DELIVERED') {
            try {
                const cleanPhone = (order.customer_number || "").replace(/\D/g, "");
                const tenDigits = cleanPhone.slice(-10);
                if (tenDigits.length === 10) {
                    // Check how many points were earned for this order
                    const txnRes = await pool.query(
                        `SELECT points FROM customer_transactions 
                         WHERE user_id = $1 AND type = 'POINTS_EARNED' 
                           AND reason ILIKE '%' || $2 || '%' 
                         ORDER BY created_at DESC LIMIT 1`,
                        [order.user_id, order.order_reference || order.id]
                    );
                    const earnedPts = parseInt(txnRes.rows[0]?.points) || 0;
                    if (earnedPts > 0) {
                        await pool.query(
                            `UPDATE customer_loyalty SET points = GREATEST(0, COALESCE(points, 0) - $1) 
                             WHERE (user_id = $2 OR user_id = 2) 
                               AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $3`,
                            [earnedPts, order.user_id, tenDigits]
                        );
                        await pool.query(
                            `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
                             VALUES ($1, $2, 'POINTS_REVERSED', 0.00, $3, $4, NOW())`,
                            [order.user_id, order.customer_number, -earnedPts, `Earned points reversed for cancelled Order: ${order.order_reference || order.id}`]
                        );
                        console.log(`🔄 Reversed ${earnedPts} earned points from ${order.customer_number} for cancelled order ${order.order_reference}`);
                    }
                }
            } catch (reverseErr) {
                console.error("Reverse earned points on cancel fail:", reverseErr);
            }
        }

        res.json({ success: true, message: "Order cancelled successfully.", order: updateRes.rows[0] });
    } catch (err) {
        console.error("Cancel order error:", err);
        res.status(500).json({ error: "Failed to cancel order." });
    }
});

// 🎁 REQUEST LOYALTY REDEMPTION (WHATSAPP)
router.post("/loyalty/redeem/request", async (req, res) => {
    try {
        const { userId, phone, points } = req.body;
        const dbPhone = formatToInter(phone);
        if (!dbPhone) return res.status(400).json({ error: "Phone number required." });

        const token = `RED-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        await pool.query(
            "INSERT INTO pending_redemptions (token, user_id, phone, points) VALUES ($1, $2, $3, $4)",
            [token, userId, dbPhone, points]
        );

        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to request redemption" });
    }
});

// ✅ CHECK REDEMPTION STATUS
router.get("/loyalty/redeem/status/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const result = await pool.query("SELECT is_verified, phone FROM pending_redemptions WHERE token = $1", [token]);
        if (result.rows.length === 0) return res.json({ verified: false });
        res.json({ verified: result.rows[0].is_verified, phone: result.rows[0].phone });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 👤 GET SYNCED CUSTOMER PROFILE FROM BACKOFFICE CRM
router.get("/customer/profile/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const uid = parseInt(userId);
        const digits = (phone || "").replace(/\D/g, "");
        if (!digits) return res.json({});

        const tenDigits = digits.slice(-10);

        let result = await pool.query(
            `SELECT c.id, c.name, c.number as phone, c.address,
                    COALESCE(cl.balance, 0.00) as balance,
                    COALESCE(cl.points, 0) as points,
                    COALESCE(cl.total_spent, 0.00) as total_spent
             FROM customers c
             LEFT JOIN customer_loyalty cl ON cl.user_id = c.user_id AND (
                 RIGHT(regexp_replace(cl.customer_number, '\\D', '', 'g'), 10) = RIGHT(regexp_replace(c.number, '\\D', '', 'g'), 10)
             )
             WHERE c.user_id = $1 
             AND RIGHT(regexp_replace(c.number, '\\D', '', 'g'), 10) = $2
             LIMIT 1`,
            [uid, tenDigits]
        );

        if (result.rows.length === 0) {
            result = await pool.query(
                `SELECT c.id, c.name, c.number as phone, c.address,
                        COALESCE(cl.balance, 0.00) as balance,
                        COALESCE(cl.points, 0) as points,
                        COALESCE(cl.total_spent, 0.00) as total_spent
                 FROM customers c
                 LEFT JOIN customer_loyalty cl ON (
                     RIGHT(regexp_replace(cl.customer_number, '\\D', '', 'g'), 10) = RIGHT(regexp_replace(c.number, '\\D', '', 'g'), 10)
                 )
                 WHERE RIGHT(regexp_replace(c.number, '\\D', '', 'g'), 10) = $1
                 LIMIT 1`,
                [tenDigits]
            );
        }

        if (result.rows.length > 0) {
            return res.json(result.rows[0]);
        }

        // Fallback: check customer_loyalty directly
        const loyaltyFallback = await pool.query(
            `SELECT name, customer_number as phone, points, balance, total_spent 
             FROM customer_loyalty 
             WHERE RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $1
             LIMIT 1`,
            [tenDigits]
        );

        res.json(loyaltyFallback.rows[0] || {});
    } catch (e) {
        console.error("Customer profile fetch error:", e);
        res.status(500).json({ error: e.message });
    }
});

// 📋 GET LOYALTY POINTS
router.get("/loyalty/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const uid = parseInt(userId);
        const digits = (phone || "").replace(/\D/g, "");
        if (!digits) return res.json({ points: 0, balance: 0, total_spent: 0, name: "Guest" });
        const tenDigits = digits.slice(-10);

        let result = await pool.query(
            `SELECT points, balance, total_spent, name 
             FROM customer_loyalty 
             WHERE user_id = $1 
             AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $2
             LIMIT 1`, 
            [uid, tenDigits]
        );

        if (result.rows.length === 0) {
            result = await pool.query(
                `SELECT points, balance, total_spent, name 
                 FROM customer_loyalty 
                 WHERE RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $1
                 ORDER BY last_visit DESC LIMIT 1`, 
                [tenDigits]
            );
        }

        res.json(result.rows[0] || { points: 0, balance: 0, total_spent: 0, name: "Guest" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 💳 GET CUSTOMER TRANSACTIONS & BALANCE SHEET FOR ONLINE MENU PROFILE
router.get("/transactions/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const uid = parseInt(userId);
        const digits = (phone || "").replace(/\D/g, "");
        if (!digits) {
            return res.json({ points: 0, total_spent: 0, total_credit: 0, total_debit: 0, net_balance: 0, transactions: [] });
        }
        
        const tenDigits = digits.slice(-10);

        // 1. Try exact user_id match
        let loyaltyRes = await pool.query(
            `SELECT points, balance, total_spent, name, user_id 
             FROM customer_loyalty 
             WHERE user_id = $1 
             AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $2 
             LIMIT 1`,
            [uid, tenDigits]
        );

        // 2. Global Fallback: search across all customer_loyalty records by 10-digit phone
        if (loyaltyRes.rows.length === 0) {
            loyaltyRes = await pool.query(
                `SELECT points, balance, total_spent, name, user_id 
                 FROM customer_loyalty 
                 WHERE RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $1 
                 ORDER BY id DESC LIMIT 1`,
                [tenDigits]
            );
        }

        const loyalty = loyaltyRes.rows[0] || { points: 0, balance: 0.00, total_spent: 0.00 };
        const matchedUserId = loyalty.user_id || uid;
        const points = parseInt(loyalty.points || 0);
        const net_balance = parseFloat(loyalty.balance || 0);
        const total_spent = parseFloat(loyalty.total_spent || 0);

        // Fetch orders for itemized bill details matching
        const ordersRes = await pool.query(
            `SELECT id, order_reference, bill_no, items, total_price, status, payment_method, payment_status, created_at, delivery_charge, tax_cgst, tax_sgst, discount_amount, customer_name
             FROM orders 
             WHERE RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $1
             ORDER BY created_at DESC LIMIT 50`,
            [tenDigits]
        );

        const ordersMapByBill = {};
        const ordersMapByRef = {};
        const ordersMapById = {};

        ordersRes.rows.forEach(ord => {
            const rawItems = Array.isArray(ord.items) ? ord.items : (typeof ord.items === 'string' ? (JSON.parse(ord.items || '[]')) : []);
            const ordObj = {
                id: ord.id,
                order_reference: ord.order_reference || `ORD-${ord.id}`,
                bill_no: ord.bill_no || String(ord.id),
                total_price: parseFloat(ord.total_price || 0),
                items: rawItems,
                status: ord.status,
                payment_method: ord.payment_method,
                payment_status: ord.payment_status,
                created_at: ord.created_at,
                delivery_charge: parseFloat(ord.delivery_charge || 0),
                tax_cgst: parseFloat(ord.tax_cgst || 0),
                tax_sgst: parseFloat(ord.tax_sgst || 0),
                discount_amount: parseFloat(ord.discount_amount || 0),
                customer_name: ord.customer_name
            };

            if (ord.bill_no) ordersMapByBill[String(ord.bill_no).trim()] = ordObj;
            if (ord.order_reference) ordersMapByRef[String(ord.order_reference).trim().toUpperCase()] = ordObj;
            ordersMapById[String(ord.id)] = ordObj;
        });

        // Fetch transactions from customer_transactions for this customer
        const txRes = await pool.query(
            `SELECT id, type, amount, points, reason, created_at 
             FROM customer_transactions 
             WHERE (user_id = $1 OR user_id = $2)
             AND RIGHT(regexp_replace(customer_number, '\\D', '', 'g'), 10) = $3
             ORDER BY created_at DESC LIMIT 50`,
            [uid, matchedUserId, tenDigits]
        );

        let total_credit = 0;
        let total_debit = 0;

        const enrichedTransactions = txRes.rows.map(tx => {
            let amt = parseFloat(tx.amount || 0);
            const typeStr = String(tx.type || "").toUpperCase();
            const reasonStr = String(tx.reason || "");

            // Extract bill/order reference from reason (e.g. "Order Bill: 2" or "Order Bill: ONL-DFQBAC" or "Order: 2")
            let matchedOrder = null;
            const matchBillNo = reasonStr.match(/Order Bill:\s*([A-Za-z0-9_-]+)/i) || reasonStr.match(/Bill:\s*([A-Za-z0-9_-]+)/i) || reasonStr.match(/Order:\s*([A-Za-z0-9_-]+)/i);
            if (matchBillNo && matchBillNo[1]) {
                const targetKey = matchBillNo[1].trim();
                matchedOrder = ordersMapByBill[targetKey] || ordersMapByRef[targetKey.toUpperCase()] || ordersMapById[targetKey];
            }

            // Fallback: match by timestamp if not matched by string key
            if (!matchedOrder && ordersRes.rows.length > 0) {
                const txTime = new Date(tx.created_at).getTime();
                matchedOrder = ordersRes.rows.find(o => Math.abs(new Date(o.created_at).getTime() - txTime) < 120000);
            }

            // If transaction amount is 0/0.00 (e.g. POINTS_EARNED), substitute the actual order bill total
            if ((amt === 0 || isNaN(amt)) && matchedOrder) {
                amt = matchedOrder.total_price;
            }

            if (typeStr.includes("CREDIT") || typeStr.includes("INITIAL") || typeStr.includes("PAYMENT") || typeStr.includes("REFUND") || typeStr.includes("EARNED")) {
                total_credit += Math.abs(amt);
            } else if (typeStr.includes("DEBIT") || typeStr.includes("DUE") || typeStr.includes("BILL")) {
                total_debit += Math.abs(amt);
            }

            return {
                id: tx.id,
                type: tx.type,
                amount: amt.toFixed(2),
                bill_amount: matchedOrder ? matchedOrder.total_price.toFixed(2) : amt.toFixed(2),
                points: parseInt(tx.points || 0),
                reason: tx.reason,
                created_at: tx.created_at,
                order_details: matchedOrder || null
            };
        });

        res.json({
            points,
            total_spent,
            total_credit: total_credit.toFixed(2),
            total_debit: total_debit.toFixed(2),
            net_balance: net_balance.toFixed(2),
            transactions: enrichedTransactions
        });
    } catch (e) {
        console.error("Transactions fetch error:", e);
        res.status(500).json({ error: e.message });
    }
});

// 📋 GET CUSTOMER ORDERS (Amazon-style Tracking & Past Orders Profile)
router.get("/orders/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const uid = parseInt(userId) || 2;
        const rawDigits = (phone || "").replace(/\D/g, "");
        if (!rawDigits) return res.json([]);

        const tenDigits = rawDigits.slice(-10);
        const phones = [phone, rawDigits, `+${rawDigits}`, tenDigits, `+${tenDigits}`, `+91${tenDigits}`, `91${tenDigits}`].filter((v, i, self) => v && self.indexOf(v) === i);

        const result = await pool.query(
            `SELECT * FROM orders 
             WHERE (user_id = $1 OR user_id = 2 OR user_id IS NOT NULL) 
             AND (
               RIGHT(regexp_replace(COALESCE(customer_number, ''), '\\D', '', 'g'), 10) = $2
               OR customer_number = ANY($3)
             ) 
             ORDER BY created_at DESC LIMIT 50`,
            [uid, tenDigits, phones]
        );
        res.json(result.rows);
    } catch (e) { 
        console.error("Public orders fetch error:", e);
        res.status(500).json({ error: e.message }); 
    }
});

// 🚚 PUBLIC LIVE ORDER TRACKING
router.get("/order/:orderRef", async (req, res) => {
    try {
        const { orderRef } = req.params;
        const result = await pool.query(
            "SELECT items, total_price, status FROM orders WHERE order_reference = $1", 
            [orderRef]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Order not found" });
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});



// ✅ GET RIDER LIVE LOCATION FOR CUSTOMER
router.get("/track-rider/:orderRef", async (req, res) => {
    try {
        const { orderRef } = req.params;
        const orderRes = await pool.query(
            `SELECT o.id, o.rider_id, dp.name as rider_name, dp.phone as rider_phone, dp.last_lat, dp.last_lng, dp.updated_at
             FROM orders o
             LEFT JOIN delivery_partners dp ON o.rider_id = dp.id
             WHERE o.order_reference = $1`,
            [orderRef]
        );

        if (orderRes.rows.length === 0) return res.status(404).json({ error: "Order not found" });
        const order = orderRes.rows[0];

        if (!order.rider_id) return res.json({ status: 'waiting_for_rider' });

        res.json({
            rider_name: order.rider_name,
            rider_phone: order.rider_phone,
            lat: order.last_lat,
            lng: order.last_lng,
            last_updated: order.updated_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Tracking error" });
    }
});

// ✅ GET ASSIGNED ORDERS FOR RIDER
router.get("/rider-orders/:riderId", async (req, res) => {
    try {
        const { riderId } = req.params;
        const dbRes = await pool.query(
            "SELECT * FROM orders WHERE rider_id = $1 AND status = 'DISPATCHED' ORDER BY created_at ASC",
            [riderId]
        );
        res.json(dbRes.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fetch error" });
    }
});

// ✅ UPDATE ORDER STATUS (Public/Rider)
router.put("/order-status", async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, orderId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update error" });
    }
});

// ✅ PAYMENT REDIRECT & KOT TRIGGER
router.get("/payment-redirect/:orderRef", async (req, res) => {
    try {
        const { orderRef } = req.params;
        
        // 1. Fetch Order & Business Data
        const orderRes = await pool.query("SELECT * FROM orders WHERE order_reference = $1", [orderRef]);
        if (orderRes.rows.length === 0) return res.status(404).send("Order not found");
        const order = orderRes.rows[0];
        
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [order.user_id]);
        const biz = bizRes.rows[0];

        // 2. Only trigger if it's currently awaiting payment
        if (order.status === 'AWAITING_PAYMENT') {
            await pool.query("UPDATE orders SET status = 'PENDING' WHERE id = $1", [order.id]);
            
            // Trigger KOT
            const itemsArr = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);
            const symbol = biz?.currency_code === 'USD' ? '$' : '₹';
            
            await whatsappManager.notifyKitchenAndStaff(
                order.user_id, order.order_reference, order.customer_name, order.customer_number, itemsArr,
                parseFloat(order.total_price), parseFloat(order.total_price), 0, 0, 0, 0, symbol,
                'online', order.address, order.table_number
            );
        }

        // 3. Serve a minimal HTML page to trigger the deep link (more reliable for mobile browsers)
        let customLink = biz?.settings?.custom_payment_link;
        let upiId = biz?.settings?.upi_id;

        if (!customLink && !upiId) {
            try {
                const qrRes = await pool.query(
                    "SELECT upi_id FROM outlet_qrs WHERE user_id = $1 AND is_active = true ORDER BY id ASC LIMIT 1",
                    [order.user_id]
                );
                if (qrRes.rows.length > 0) {
                    const activeVal = qrRes.rows[0].upi_id;
                    if (activeVal.startsWith('http://') || activeVal.startsWith('https://') || activeVal.startsWith('upi://')) {
                        customLink = activeVal;
                    } else {
                        upiId = activeVal;
                    }
                }
            } catch (qrErr) {
                console.error("Error querying outlet_qrs for payment redirect:", qrErr);
            }
        }

        const cleanName = (biz?.name || "Restaurant").replace(/[^a-zA-Z0-9 ]/g, '');
        const finalRedirect = customLink || `upi://pay?pa=${upiId || "restaurant@upi"}&pn=${encodeURIComponent(cleanName)}&am=${order.total_price}&cu=INR&tn=Order%20${order.order_reference}&mc=5812&mode=02&tr=${order.order_reference}`;
        
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SaSLoop - Redirecting to Payment</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; text-align: center; }
                    .card { background: white; padding: 2rem; border-radius: 2rem; shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; max-width: 90%; }
                    .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #6366f1; border-radius: 50%; width: 40px; height: 40px; animate: spin 1s linear infinite; margin-bottom: 1.5rem; }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    h2 { font-weight: 800; color: #1e293b; margin: 0 0 0.5rem 0; }
                    p { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; }
                    .btn { background: #6366f1; color: white; text-decoration: none; padding: 1rem 2rem; border-radius: 1rem; font-weight: 700; display: inline-block; transition: all 0.2s; }
                    .btn:active { transform: scale(0.95); }
                </style>
            </head>
            <body>
                <div class="card">
                    <center><div class="spinner"></div></center>
                    <h2>Opening Payment App</h2>
                    <p>Please wait while we connect you to your preferred UPI app...</p>
                    <a href="${finalRedirect}" class="btn" id="payBtn">Pay ${biz?.currency_code === 'USD' ? '$' : '₹'}${order.total_price}</a>
                </div>
                <script>
                    // Try auto-redirect first
                    setTimeout(() => {
                        window.location.href = "${finalRedirect}";
                    }, 500);

                    // Fallback: If it doesn't open, user can click the button
                </script>
            </body>
            </html>
        `);
    } catch (err) {
        console.error("Redirect Error:", err);
        res.status(500).send("Error processing payment link");
    }
});

// ✅ CALL WAITER (QR / TABLE)
router.post("/call-waiter", async (req, res) => {
    try {
        const { userId, tableNumber } = req.body;
        
        // 1. Log in DB
        await pool.query(
            "INSERT INTO waiter_requests (user_id, table_number) VALUES ($1, $2)",
            [userId, tableNumber]
        );

        // 2. Notify Staff via WhatsApp
        const bizRes = await pool.query("SELECT name, notification_numbers FROM restaurants WHERE user_id = $1", [userId]);
        const biz = bizRes.rows[0];
        
        if (biz && biz.notification_numbers) {
            const msg = `🔔 *WAITER REQUEST!* \n━━━━━━━━━━━━━━\n📍 *Table:* ${tableNumber}\n🏢 *Business:* ${biz.name}\n\nA customer needs assistance. Please attend to them immediately! 🙏`;
            
            for (const num of biz.notification_numbers) {
                await whatsappManager.sendOfficialMessage(num, msg, userId);
            }
        }

        res.json({ success: true, message: "Waiter notified!" });
    } catch (err) {
        console.error("Call Waiter Error:", err);
        res.status(500).json({ error: "Failed to notify waiter" });
    }
});

// ✅ LEAD GENERATION (LANDING PAGE)
router.post("/leads", async (req, res) => {
    try {
        const { name, phone, business, interest } = req.body;
        
        // 1. Save to DB
        await pool.query(
            "INSERT INTO leads (name, phone, business, interest) VALUES ($1, $2, $3, $4)",
            [name, phone, business, interest]
        );

        // 2. Notify Master Admin
        const msg = `🚀 *NEW LEAD GENERATED!* \n━━━━━━━━━━━━━━\n👤 *Name:* ${name}\n📱 *Phone:* ${phone}\n🏢 *Business:* ${business}\n🎯 *Interest:* ${interest}\n\nPlease contact the lead for onboarding! 📈`;
        
        // Notify master admin number
        const masterPhone = "+919469697216"; 
        await whatsappManager.sendOfficialMessage(masterPhone, msg, 1);

        res.json({ success: true });
    } catch (err) {
        console.error("🔥 Leads Error:", err);
        res.status(500).json({ error: "Failed to save lead" });
    }
});

// 📅 GET CUSTOMER TABLE RESERVATIONS
router.get("/table-reservations/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const digits = (phone || "").replace(/\D/g, "");
        if (!digits) return res.json([]);
        const tenDigits = digits.slice(-10);

        const result = await pool.query(
            `SELECT * FROM table_reservations 
             WHERE RIGHT(regexp_replace(customer_phone, '\\D', '', 'g'), 10) = $1
             ORDER BY created_at DESC LIMIT 20`,
            [tenDigits]
        );
        res.json(result.rows);
    } catch (e) {
        console.error("Fetch table reservations error:", e);
        res.status(500).json({ error: e.message });
    }
});

// 🪑 GET PUBLIC SEATING AREAS / TABLE DEPARTMENTS FOR AN OUTLET
router.get("/seating-areas/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        let uid = parseInt(userId || 2);
        if (isNaN(uid) || uid <= 0) uid = 2;

        const result = await pool.query(
            `SELECT id, department_name AS name 
             FROM table_departments 
             WHERE (user_id = $1 OR outlet_id = $1 OR user_id = 2 OR outlet_id = 2) AND is_active = true 
             ORDER BY id ASC, department_name ASC`,
            [uid]
        );
        res.json(result.rows);
    } catch (e) {
        console.error("Fetch public seating areas error:", e);
        res.status(500).json({ error: e.message });
    }
});

// 📅 CREATE PUBLIC TABLE RESERVATION WITH WHATSAPP CONFIRMATION
router.post("/table-reservation", async (req, res) => {
    try {
        const { userId, outletId, customerName, customerPhone, guestsCount, reservationDate, reservationTime, seatingPreference, specialNotes } = req.body;
        
        let uid = parseInt(userId || outletId || 2);
        if (isNaN(uid) || uid <= 0) uid = 2;

        const cleanPhone = (customerPhone || "").replace(/\D/g, "");
        const dbPhone = cleanPhone ? (cleanPhone.startsWith('91') || cleanPhone.startsWith('966') ? `+${cleanPhone}` : `+91${cleanPhone.slice(-10)}`) : "";

        if (!customerName || !dbPhone || !reservationDate || !reservationTime) {
            return res.status(400).json({ error: "Missing required booking details (Name, Phone, Date, Time)" });
        }

        const todayStr = new Date().toISOString().split('T')[0];
        if (reservationDate < todayStr) {
            return res.status(400).json({ error: "Table reservations cannot be made for past dates." });
        }

        const randomRef = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

        const result = await pool.query(
            `INSERT INTO table_reservations 
             (user_id, outlet_id, reservation_ref, customer_name, customer_phone, guests_count, reservation_date, reservation_time, seating_preference, special_notes, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING', NOW())
             RETURNING *`,
            [uid, uid, randomRef, customerName, dbPhone, parseInt(guestsCount) || 2, reservationDate, reservationTime, seatingPreference || 'Indoor', specialNotes || '']
        );

        const reservation = result.rows[0];

        // Send WhatsApp confirmation to customer
        try {
            const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1 OR id = $1 LIMIT 1", [uid]);
            const restName = bizRes.rows[0]?.name || "Our Restaurant";
            
            const msg = `🍽️ *TABLE RESERVATION RECEIVED!*\n━━━━━━━━━━━━━━━━\n` +
                        `*Booking Ref:* ${randomRef}\n` +
                        `*Restaurant:* ${restName}\n` +
                        `*Name:* ${customerName}\n` +
                        `*Guests:* ${guestsCount} Guests\n` +
                        `*Date:* ${reservationDate}\n` +
                        `*Time:* ${reservationTime}\n` +
                        `*Seating:* ${seatingPreference || 'Indoor'}\n` +
                        (specialNotes ? `*Notes:* ${specialNotes}\n` : '') +
                        `━━━━━━━━━━━━━━━━\n` +
                        `*Status:* ⏳ *PENDING CONFIRMATION*\n` +
                        `Our manager will confirm your table shortly. Thank you! 🙏`;

            await whatsappManager.sendOfficialMessage(dbPhone, msg, uid, `RES_${reservation.id}`);
        } catch (waErr) {
            console.error("WhatsApp reservation notification error:", waErr);
        }

        // Send WhatsApp notification to Staff Number(s) for New Table Booking
        try {
            const bizFullRes = await pool.query("SELECT name, phone, contact_number, notification_numbers FROM restaurants WHERE user_id = $1 OR id = $1 LIMIT 1", [uid]);
            const bizFull = bizFullRes.rows[0];
            
            let staffNums = (bizFull?.notification_numbers && bizFull.notification_numbers.length > 0)
                ? bizFull.notification_numbers
                : [bizFull?.phone, bizFull?.contact_number].filter(Boolean);

            staffNums = [...new Set(staffNums)];

            const staffBookingMsg = `📅 *NEW TABLE RESERVATION RECEIVED! (Pending)*\n━━━━━━━━━━━━━━━━\n` +
                                    `*Booking Ref:* ${randomRef}\n` +
                                    `*Customer Name:* ${customerName}\n` +
                                    `*Phone:* ${dbPhone}\n` +
                                    `*Guests:* ${guestsCount} Guests\n` +
                                    `*Date & Time:* ${reservationDate} @ ${reservationTime}\n` +
                                    `*Seating Area:* ${seatingPreference || 'Indoor'}\n` +
                                    (specialNotes ? `*Notes:* ${specialNotes}\n` : '') +
                                    `━━━━━━━━━━━━━━━━\n` +
                                    `*Action Required:* Open POS > Bookings to Accept or Reject this table reservation! 🚀`;

            for (let num of staffNums) {
                await whatsappManager.sendOfficialMessage(num, staffBookingMsg, uid);
            }
        } catch (staffBookingErr) {
            console.error("Staff table booking notification error:", staffBookingErr);
        }

        // Log system notification for POS & Dashboard
        try {
            await pool.query(
                `INSERT INTO system_notifications (user_id, title, message, is_read, created_at)
                 VALUES ($1, $2, $3, false, NOW())`,
                [uid, `NEW TABLE RESERVATION: ${customerName}`, `Table Reservation ${randomRef} for ${guestsCount} Guests on ${reservationDate} @ ${reservationTime} (${seatingPreference}).`]
            );
        } catch (notifErr) {
            console.error("Reservation system notification error:", notifErr);
        }

        res.json({ success: true, reservation });
    } catch (e) {
        console.error("Table reservation error:", e);
        res.status(500).json({ error: e.message });
    }
});

// 🕒 GET SERVER TIME (Internet clock backup)
router.get("/time", async (req, res) => {
    res.json({ time: new Date().toISOString() });
});

module.exports = router;
