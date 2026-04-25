const express = require("express");
const router = express.Router();
const pool = require("../db");
const whatsappManager = require("../whatsappManager");
const { isBusinessOpen, getDeliveryDetails } = require("../utils/businessUtils");

// Helper to ensure +CountryCode format
const formatToInter = (p) => {
    if (!p) return "";
    const digits = p.replace(/\D/g, "");
    return digits ? `+${digits}` : "";
};

// 📋 GET MENU FOR QR CUSTOMER
router.get("/menu/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const bizRes = await pool.query(
            `SELECT r.*, u.whatsapp_number 
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
        const { userId, tableNumber, items, totalPrice, customerName, customerPhone, pointsToRedeem, loyaltyOtp, address, fulfillmentMode, source, subtotal: frontendSubtotal, cgst: frontendCgst, sgst: frontendSgst, status: customStatus, paymentMethod, paymentStatus, discount_amount, service_charge } = req.body;
        
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

        // Loyalty Redemption Logic
        const ptsRatio = parseFloat(bizData?.points_to_amount_ratio) || 10.00;
        const ptsEnabled = bizData?.loyalty_enabled !== false;
        const minRedeem = parseInt(bizData?.min_redeem_points) || 300;

        if (ptsEnabled && pointsToRedeem && pointsToRedeem >= minRedeem && dbPhone) {
            try {
                // Verify OTP for point redemption
                const otpCheck = await pool.query(
                    "SELECT id FROM loyalty_otps WHERE user_id=$1 AND customer_number=$2 AND otp_code=$3 AND expires_at > NOW()",
                    [userId, dbPhone, loyaltyOtp]
                );

                if (otpCheck.rows.length > 0) {
                    const checkPoints = await pool.query("SELECT points FROM customer_loyalty WHERE user_id=$1 AND customer_number=$2", [userId, dbPhone]);
                    const available = checkPoints.rows[0]?.points || 0;
                    if (available >= pointsToRedeem) {
                        redeemedPoints = pointsToRedeem;
                        await pool.query("DELETE FROM loyalty_otps WHERE id = $1", [otpCheck.rows[0].id]);
                    }
                }
            } catch (e) { console.error("Redemption logic fail (Safe-Skip):", e); }
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

        // SMART UPSERT LOGIC
        let existingOrder = null;
        if (tableNumber && tableNumber !== "0" && source === "POS_MANUAL") {
           const checkRes = await pool.query(
             "SELECT id, order_reference FROM orders WHERE user_id=$1 AND table_number=$2 AND status IN ('PENDING', 'PREPARING') ORDER BY created_at DESC LIMIT 1",
             [userId, tableNumber]
           );
           existingOrder = checkRes.rows[0];
        }

        let insertRes;
        let orderId;
        let currentOrderRef = orderRef;

        if (existingOrder) {
            orderId = existingOrder.id;
            currentOrderRef = existingOrder.order_reference;
            insertRes = await pool.query(
              "UPDATE orders SET items=$1, total_price=$2, status=$3, payment_method=$4, payment_status=$5, discount_amount=$6, service_charge=$7, delivery_charge=$8 WHERE id=$9 RETURNING *",
              [JSON.stringify(items || []), finalPrice, customStatus || 'PENDING', paymentMethod || 'CASH', paymentStatus || 'PENDING', discount_amount || 0, service_charge || 0, finalDeliveryCharge, orderId]
            );
        } else {
            insertRes = await pool.query(
                "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, table_number, payment_method, payment_status, discount_amount, service_charge, delivery_charge) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
                [userId, customerName || "Guest", dbPhone || (isPOS ? "POS-MANUAL" : "QR-ORDER"), finalOrderAddress, JSON.stringify(items || []), finalPrice, orderRef, customStatus || 'PENDING', tableNumber, paymentMethod || 'CASH', paymentStatus || 'PENDING', discount_amount || 0, service_charge || 0, finalDeliveryCharge]
            );
            orderId = insertRes.rows[0].id;
        }
        
        // Notify Staff (Using standardized phone)
        try {
            const cgstRate = parseFloat(bizData?.cgst_percent) || 0;
            const sgstRate = parseFloat(bizData?.sgst_percent) || 0;
            let subtotalCalc = parseFloat(frontendSubtotal) || 0;
            if (!frontendSubtotal && items) {
                const itemsArr = Array.isArray(items) ? items : (typeof items === 'string' ? JSON.parse(items) : []);
                itemsArr.forEach(i => subtotalCalc += ((parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0)));
            }
            
            await whatsappManager.notifyKitchenAndStaff(
                userId, currentOrderRef, customerName || "Guest", dbPhone || "QR-Customer", items || [],
                subtotalCalc, finalPrice, parseFloat(frontendCgst) || 0, parseFloat(frontendSgst) || 0, cgstRate, sgstRate, currSymbol,
                (fulfillmentMode || "QR").toLowerCase(), finalOrderAddress, (tableNumber && tableNumber !== "0") ? tableNumber : null
            );
        } catch (notifErr) { console.error("KITCHEN NOTIF FAIL:", notifErr.message); }
        
        // Notify Customer
        if (isOnline && dbPhone && dbPhone.startsWith('+')) {
            try {
                const itemLines = (items || []).map(i => `• ${i.qty}x ${i.name}`).join("\n");
                
                const receiptRows = [
                    `✅ *Order Confirmed!*`,
                    ``,
                    `*${bizData?.name || 'Restaurant'}* received your order.`,
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

// 🔑 REQUEST LOYALTY OTP
router.post("/loyalty/request-otp", async (req, res) => {
    try {
        const { userId, phone, manual } = req.body;
        const dbPhone = formatToInter(phone);
        
        if (!dbPhone) return res.status(400).json({ error: "Phone number is required." });

        const checkPoints = await pool.query("SELECT points FROM customer_loyalty WHERE user_id=$1 AND customer_number=$2", [userId, dbPhone]);
        if (checkPoints.rows.length === 0 || (checkPoints.rows[0]?.points || 0) <= 0) {
            return res.status(400).json({ error: "No loyalty points found for this number." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query("DELETE FROM loyalty_otps WHERE user_id = $1 AND customer_number = $2", [userId, dbPhone]);
        await pool.query(
            "INSERT INTO loyalty_otps (user_id, customer_number, otp_code, expires_at) VALUES ($1, $2, $3, $4)",
            [userId, dbPhone, otp, expiresAt]
        );

        if (!manual) {
            const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1", [userId]);
            const bizName = bizRes.rows[0]?.name || "Restaurant";
            const otpMsg = `🔐 *Verification Code*\n\nYour OTP for points redemption at *${bizName}* is: *${otp}*.\n\nValid for 10 minutes.`;
            await whatsappManager.sendOfficialMessage(dbPhone, otpMsg, userId);
        }
        
        res.json({ success: true, message: "OTP generated." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process OTP request" });
    }
});

// 📋 GET LOYALTY POINTS
router.get("/loyalty/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const digits = (phone || "").replace(/\D/g, "");
        const dbPhone = digits ? `+${digits}` : "";
        const result = await pool.query("SELECT points, total_spent, name FROM customer_loyalty WHERE user_id=$1 AND customer_number=$2", [userId, dbPhone]);
        res.json(result.rows[0] || { points: 0, total_spent: 0, name: "Guest" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 📋 GET CUSTOMER ORDERS (Amazon-style Tracking)
router.get("/orders/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const digits = (phone || "").replace(/\D/g, "");
        const dbPhone = digits ? `+${digits}` : "";
        
        const result = await pool.query(
            "SELECT id, order_reference, items, total_price, status, created_at, table_number, address FROM orders WHERE user_id=$1 AND customer_number=$2 ORDER BY created_at DESC LIMIT 20",
            [userId, dbPhone]
        );
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 🔑 REQUEST LOGIN OTP (WHATSAPP)
router.post("/auth/request-otp", async (req, res) => {
    try {
        const { userId, phone } = req.body;
        const dbPhone = formatToInter(phone);
        if (!dbPhone) return res.status(400).json({ error: "Phone number required." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await pool.query("DELETE FROM loyalty_otps WHERE user_id = $1 AND customer_number = $2", [userId, dbPhone]);
        await pool.query(
            "INSERT INTO loyalty_otps (user_id, customer_number, otp_code, expires_at) VALUES ($1, $2, $3, $4)",
            [userId, dbPhone, otp, expiresAt]
        );

        const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1", [userId]);
        const bizName = bizRes.rows[0]?.name || "Restaurant";
        
        const otpMsg = `🔐 *Verification Code*\n\nYour login code for *${bizName}* is: *${otp}*.`;
        const sent = await whatsappManager.sendOfficialMessage(dbPhone, otpMsg, userId);
        
        if (!sent) return res.status(500).json({ error: "WhatsApp service unavailable." });
        res.json({ success: true, message: "OTP sent." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// ✅ VERIFY LOGIN OTP
router.post("/auth/verify-otp", async (req, res) => {
    try {
        const { userId, phone, otp } = req.body;
        const dbPhone = formatToInter(phone);

        const otpCheck = await pool.query(
            "SELECT id FROM loyalty_otps WHERE user_id=$1 AND customer_number=$2 AND otp_code=$3 AND expires_at > NOW()",
            [userId, dbPhone, otp]
        );

        if (otpCheck.rows.length === 0) return res.status(401).json({ error: "Invalid or expired OTP." });
        await pool.query("DELETE FROM loyalty_otps WHERE id = $1", [otpCheck.rows[0].id]);
        res.json({ success: true, message: "Verified." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Verification failed" });
    }
});

module.exports = router;
