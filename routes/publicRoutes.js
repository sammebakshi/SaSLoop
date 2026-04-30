const express = require("express");
const router = express.Router();
const pool = require("../db");
const whatsappManager = require("../whatsappManager");
const { isBusinessOpen, getDeliveryDetails } = require("../utils/businessUtils");

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
        const bizRes = await pool.query(
            `SELECT r.*, u.phone as whatsapp_number 
             FROM restaurants r 
             JOIN app_users u ON u.id = r.user_id 
             WHERE r.user_id = $1`, 
             [userId]
        );
        const itemsRes = await pool.query("SELECT * FROM business_items WHERE user_id = $1 AND availability = true", [userId]);
        
        if (bizRes.rows.length === 0) return res.status(404).json({ error: "Business not found" });
        
        res.json({
            business: bizRes.rows[0],
            items: itemsRes.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
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
        
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const bizData = bizRes.rows[0];
        if (!bizData) return res.status(404).json({ error: "Business details not found" });

        // --- 🕒 CHECK BUSINESS HOURS ---
        const bizStatus = isBusinessOpen(bizData.settings);
        if (!bizStatus.isOpen) {
            return res.status(403).json({ 
                error: "Business is currently CLOSED.", 
                details: `Working hours: ${bizStatus.openingTime} - ${bizStatus.closingTime}` 
            });
        }

        const currSymbol = bizData?.currency_code === 'INR' ? '₹' : (bizData?.currency_code === 'USD' ? '$' : '₹');
        
        let finalPrice = parseFloat(totalPrice) || 0;
        let redeemedPoints = 0;

        // Loyalty Redemption Logic (WhatsApp Verified)
        const ptsRatio = parseFloat(bizData?.points_to_amount_ratio) || 10.00;
        const ptsEnabled = bizData?.loyalty_enabled !== false;
        const minRedeem = parseInt(bizData?.min_redeem_points) || 300;
        const redemptionToken = req.body.redemptionToken;

        if (ptsEnabled && pointsToRedeem && pointsToRedeem >= minRedeem && dbPhone && redemptionToken) {
            try {
                // Verify redemption token for point redemption
                const redemptionCheck = await pool.query(
                    "SELECT id FROM pending_redemptions WHERE user_id=$1 AND token=$2 AND is_verified=TRUE AND created_at > NOW() - INTERVAL '30 minutes'",
                    [userId, redemptionToken]
                );

                if (redemptionCheck.rows.length > 0) {
                    const checkPoints = await pool.query("SELECT points FROM customer_loyalty WHERE user_id=$1 AND customer_number=$2", [userId, dbPhone]);
                    const available = checkPoints.rows[0]?.points || 0;
                    if (available >= pointsToRedeem) {
                        redeemedPoints = pointsToRedeem;
                        await pool.query("DELETE FROM pending_redemptions WHERE id = $1", [redemptionCheck.rows[0].id]);
                    }
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
             "SELECT id, order_reference, items, total_price, discount_amount, service_charge, delivery_charge FROM orders WHERE user_id=$1 AND table_number=$2 AND status IN ('PENDING', 'PREPARING') ORDER BY created_at DESC LIMIT 1",
             [userId, tableNumber]
           );
           existingOrder = checkRes.rows[0];
        }

        let insertRes;
        let orderId;
        let currentOrderRef = orderRef;

        const isCOD = paymentMethod === 'CASH' || !paymentMethod;
        const initialStatus = customStatus || (isCOD ? 'PENDING' : 'AWAITING_PAYMENT');

        if (existingOrder) {
            orderId = existingOrder.id;
            currentOrderRef = existingOrder.order_reference;
            
            // 🥗 SMART MERGE: Append new items to existing items
            const oldItems = Array.isArray(existingOrder.items) ? existingOrder.items : (typeof existingOrder.items === 'string' ? JSON.parse(existingOrder.items) : []);
            const newItemsList = Array.isArray(items) ? items : (typeof items === 'string' ? JSON.parse(items) : []);
            const mergedItems = [...oldItems, ...newItemsList];
            const newTotal = (parseFloat(existingOrder.total_price) || 0) + finalPrice;

            insertRes = await pool.query(
              "UPDATE orders SET items=$1, total_price=$2, status=$3, payment_method=$4, payment_status=$5, discount_amount=$6, service_charge=$7, delivery_charge=$8 WHERE id=$9 RETURNING *",
              [JSON.stringify(mergedItems), newTotal, initialStatus, paymentMethod || 'CASH', paymentStatus || 'PENDING', (parseFloat(existingOrder.discount_amount) || 0) + (discount_amount || 0), (parseFloat(existingOrder.service_charge) || 0) + (service_charge || 0), (parseFloat(existingOrder.delivery_charge) || 0) + finalDeliveryCharge, orderId]
            );
        } else {
            insertRes = await pool.query(
                "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, table_number, payment_method, payment_status, discount_amount, service_charge, delivery_charge) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
                [userId, customerName || "Guest", dbPhone || (isPOS ? "POS-MANUAL" : "QR-ORDER"), finalOrderAddress, JSON.stringify(items || []), finalPrice, orderRef, initialStatus, tableNumber, paymentMethod || 'CASH', paymentStatus || 'PENDING', discount_amount || 0, service_charge || 0, finalDeliveryCharge]
            );
            orderId = insertRes.rows[0].id;
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
                
                const baseUrl = process.env.FRONTEND_URL || 'https://sasloop.in';
                const trackingLink = `${baseUrl}/track/${currentOrderRef}`;
                receiptRows.push(`\n📍 *Track Live:* ${trackingLink}`);

                if (paymentMethod === 'UPI') {
                        const baseUrl = process.env.BACKEND_URL || 'https://sasloop.in';
                    const paymentLink = `${baseUrl}/api/public/payment-redirect/${currentOrderRef}`;
                    receiptRows.push(`\n💳 *Pay Online:* ${paymentLink}`);
                }

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


// 📋 GET LOYALTY POINTS
router.get("/loyalty/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const digits = (phone || "").replace(/\D/g, "");
        if (!digits) return res.json({ points: 0, total_spent: 0, name: "Guest" });
        
        const withPlus = `+${digits}`;
        const withoutPlus = digits;

        const result = await pool.query(
            "SELECT points, total_spent, name FROM customer_loyalty WHERE user_id=$1 AND (customer_number=$2 OR customer_number=$3) LIMIT 1", 
            [userId, withPlus, withoutPlus]
        );
        res.json(result.rows[0] || { points: 0, total_spent: 0, name: "Guest" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 📋 GET CUSTOMER ORDERS (Amazon-style Tracking)
router.get("/orders/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const digits = (phone || "").replace(/\D/g, "");
        if (!digits) return res.json([]);

        const withPlus = `+${digits}`;
        const withoutPlus = digits;
        
        const result = await pool.query(
            "SELECT id, order_reference, items, total_price, status, created_at, table_number, address FROM orders WHERE user_id=$1 AND (customer_number=$2 OR customer_number=$3) ORDER BY created_at DESC LIMIT 20",
            [userId, withPlus, withoutPlus]
        );
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
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

        // 3. Redirect to actual payment link
        const customLink = biz?.settings?.custom_payment_link;
        const upiId = biz?.settings?.upi_id || "restaurant@upi";
        const finalRedirect = customLink || `upi://pay?pa=${upiId}&pn=${encodeURIComponent(biz?.name || "Restaurant")}&am=${order.total_price}&cu=INR&tn=Order%20${order.order_reference}`;
        
        res.redirect(finalRedirect);
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

module.exports = router;
