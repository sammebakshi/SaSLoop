const express = require("express");
const router = express.Router();
const pool = require("../db");
const whatsappManager = require("../whatsappManager");

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
        const isOnline = source === "ONLINE_ORDER";
        const isPOS = source === "POS_MANUAL";
        const prefix = isOnline ? "ONL" : (isPOS ? "POS" : "QR");
        const orderRef = `${prefix}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const bizData = bizRes.rows[0];
        if (!bizData) return res.status(404).json({ error: "Business details not found" });

        const currSymbol = bizData?.currency_code === 'INR' ? '₹' : (bizData?.currency_code === 'USD' ? '$' : '₹');
        
        let finalPrice = totalPrice;
        let redeemedPoints = 0;

        // Loyalty Redemption Logic
        const ptsRatio = parseFloat(bizData?.points_to_amount_ratio) || 10.00;
        const ptsEnabled = bizData?.loyalty_enabled !== false;
        const minRedeem = bizData?.min_redeem_points || 300;

        if (ptsEnabled && pointsToRedeem && pointsToRedeem >= minRedeem && customerPhone) {
            // 🛡️ SECURITY: Verify OTP for point redemption
            const normPhone = customerPhone.replace(/\D/g, "");
            const otpCheck = await pool.query(
                "SELECT id FROM loyalty_otps WHERE user_id=$1 AND customer_number=$2 AND otp_code=$3 AND expires_at > NOW()",
                [userId, normPhone, loyaltyOtp]
            );

            if (otpCheck.rows.length === 0) {
                return res.status(401).json({ error: "Invalid or expired Loyalty OTP. Please verify your phone number." });
            }

            const checkPoints = await pool.query("SELECT points FROM customer_loyalty WHERE user_id=$1 AND customer_number=$2", [userId, normPhone]);
            const available = checkPoints.rows[0]?.points || 0;
            if (available >= pointsToRedeem) {
                redeemedPoints = pointsToRedeem;
                // Cleanup OTP after successful entry
                await pool.query("DELETE FROM loyalty_otps WHERE id = $1", [otpCheck.rows[0].id]);
            }
        }
        const orderAddress = address || (tableNumber && tableNumber !== "0" ? `Table ${tableNumber}` : "Pickup");

        // SMART UPSERT LOGIC: Check if this table already has an active session
        let existingOrder = null;
        if (tableNumber && tableNumber !== "0" && isPOS) {
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
           // UPDATE EXISTING SESSION
           orderId = existingOrder.id;
           currentOrderRef = existingOrder.order_reference;
           insertRes = await pool.query(
             "UPDATE orders SET items=$1, total_price=$2, status=$3, payment_method=$4, payment_status=$5, discount_amount=$6, service_charge=$7 WHERE id=$8 RETURNING *",
             [JSON.stringify(items), finalPrice, customStatus || 'PENDING', paymentMethod || 'CASH', paymentStatus || 'PENDING', discount_amount || 0, service_charge || 0, orderId]
           );
        } else {
           // NEW SESSION
           insertRes = await pool.query(
               "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, table_number, payment_method, payment_status, discount_amount, service_charge) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
               [userId, customerName || "Guest", customerPhone || (isPOS ? "POS-MANUAL" : "QR-ORDER"), orderAddress, JSON.stringify(items), finalPrice, orderRef, customStatus || 'PENDING', tableNumber, paymentMethod || 'CASH', paymentStatus || 'PENDING', discount_amount || 0, service_charge || 0]
           );
           orderId = insertRes.rows[0].id;
        }
        
        // Build notification message
        const mode = fulfillmentMode || (tableNumber && tableNumber !== "0" ? "DINEIN" : "PICKUP");
        const modeLabel = mode === "DELIVERY" ? "🚚 Home Delivery" : (mode === "PICKUP" ? "🏪 Pickup" : `🍽️ Dine-In (Table ${tableNumber})`);
        const itemLines = items.map(i => `• ${i.qty}x ${i.name}`).join("\n");
        
        // Notify Kitchen & Staff
        try {
            const cgstRate = parseFloat(bizData?.cgst_percent) || 0;
            const sgstRate = parseFloat(bizData?.sgst_percent) || 0;
            let subtotal = frontendSubtotal !== undefined ? frontendSubtotal : 0;
            if (frontendSubtotal === undefined) items.forEach(i => subtotal += (i.qty * i.price));
            
            let cgstAmount = frontendCgst !== undefined ? frontendCgst : 0;
            let sgstAmount = frontendSgst !== undefined ? frontendSgst : 0;
            
            await whatsappManager.notifyKitchenAndStaff(
                userId, currentOrderRef, customerName || "Guest", customerPhone || (isPOS ? "POS-MANUAL" : "QR-ORDER"), items,
                subtotal, finalPrice, cgstAmount, sgstAmount, cgstRate, sgstRate, currSymbol,
                mode.toLowerCase(), address, tableNumber && tableNumber !== "0" ? tableNumber : null
            );
        } catch (notifErr) { console.error("Staff notification failed:", notifErr); }
        
        // Notify Customer (for online orders)
        try {
            if (isOnline && customerPhone && customerPhone !== "QR-ORDER") {
                const custMsg = `✅ *Order Confirmed!*\n\n*${bizData?.name || 'Restaurant'}* received your order.\n\n*Ref:* ${currentOrderRef}\n*Type:* ${modeLabel}\n───────────────\n${itemLines}\n───────────────\n💰 *Total:* ${currSymbol}${finalPrice}\n\n⏱️ Estimated: ${mode === 'DELIVERY' ? '30-45 min' : '15-20 min'}\n\nWe'll update you when it's ready! 🔥`;
                await whatsappManager.sendOfficialMessage(customerPhone, custMsg, userId, `CONFIRM_${orderId}`);
            }
        } catch (custErr) { console.error("Customer notification failed:", custErr); }
        
        // Update Points (Only for new sales completions)
        if (customerPhone && customerPhone !== "QR-ORDER" && (customStatus === 'COMPLETED' || !existingOrder)) {
            const ptsEarnRate = (parseFloat(bizData.points_per_100) || 5) / 100;
            const earned = Math.floor(finalPrice * ptsEarnRate);
            await pool.query(
                `INSERT INTO customer_loyalty (user_id, customer_number, name, total_spent, points, last_visit)
                 VALUES ($1, $2, $3, $4, $5, NOW())
                 ON CONFLICT (user_id, customer_number) 
                 DO UPDATE SET 
                    name = EXCLUDED.name,
                    total_spent = customer_loyalty.total_spent + EXCLUDED.total_spent,
                    points = (customer_loyalty.points + EXCLUDED.points) - $6,
                    last_visit = NOW()`,
                [userId, customerPhone.replace(/\D/g, ""), customerName || "Guest", finalPrice, earned, redeemedPoints]
            );
        }

        res.json({ success: true, orderId, orderRef: currentOrderRef, finalPrice, redeemedPoints });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
    }
});

// 🔑 REQUEST LOYALTY OTP
router.post("/loyalty/request-otp", async (req, res) => {
    try {
        const { userId, phone, manual } = req.body;
        const normPhone = phone.replace(/\D/g, "");
        
        if (!normPhone) return res.status(400).json({ error: "Phone number is required." });

        // Check if customer exists and has points
        const checkPoints = await pool.query("SELECT points FROM customer_loyalty WHERE user_id=$1 AND customer_number=$2", [userId, normPhone]);
        if (checkPoints.rows.length === 0 || (checkPoints.rows[0]?.points || 0) <= 0) {
            return res.status(400).json({ error: "No loyalty points found for this number." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Clear existing OTPs for this number
        await pool.query("DELETE FROM loyalty_otps WHERE user_id = $1 AND customer_number = $2", [userId, normPhone]);

        await pool.query(
            "INSERT INTO loyalty_otps (user_id, customer_number, otp_code, expires_at) VALUES ($1, $2, $3, $4)",
            [userId, normPhone, otp, expiresAt]
        );

        // If manual is true, we skip sending the chargeble message and let user trigger it via WA Link
        if (!manual) {
            const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1", [userId]);
            const bizName = bizRes.rows[0]?.name || "Restaurant";
            const otpMsg = `🔐 *Verification Code*\n\nYour OTP for redeeming loyalty points at *${bizName}* is: *${otp}*.\n\nValid for 10 minutes. Do not share this with anyone!`;
            await whatsappManager.sendOfficialMessage(normPhone, otpMsg, userId);
        }
        
        res.json({ success: true, message: "OTP generated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process OTP request" });
    }
});

router.get("/loyalty/:userId/:phone", async (req, res) => {
    try {
        const { userId, phone } = req.params;
        const normPhone = phone.replace(/\D/g, ""); 
        const result = await pool.query("SELECT points, total_spent FROM customer_loyalty WHERE user_id=$1 AND customer_number=$2", [userId, normPhone]);
        res.json(result.rows[0] || { points: 0, total_spent: 0 });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 🔔 CALL WAITER
router.post("/call-waiter", async (req, res) => {
    try {
        const { userId, tableNumber } = req.body;
        const bizRes = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [userId]);
        const bizData = bizRes.rows[0];

        const alert = `🛎️ *WAITER REQUESTED*\n*Table ${tableNumber}* is asking for assistance!`;
        
        if (bizData.notification_numbers && Array.isArray(bizData.notification_numbers)) {
            for (let num of bizData.notification_numbers) {
                const cleanNum = num.replace(/\D/g, "");
                if (cleanNum) await whatsappManager.sendOfficialMessage(cleanNum, alert, userId, "WAITER_CALL");
            }
        }
        
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
    }
});

// 🔑 REQUEST LOGIN OTP (WHATSAPP)
router.post("/auth/request-otp", async (req, res) => {
    try {
        const { userId, phone } = req.body;
        const normPhone = phone.replace(/\D/g, "");
        
        if (!normPhone) return res.status(400).json({ error: "Phone number is required." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Clear existing OTPs for login
        await pool.query("DELETE FROM loyalty_otps WHERE user_id = $1 AND customer_number = $2", [userId, normPhone]);

        await pool.query(
            "INSERT INTO loyalty_otps (user_id, customer_number, otp_code, expires_at) VALUES ($1, $2, $3, $4)",
            [userId, normPhone, otp, expiresAt]
        );

        const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1", [userId]);
        const bizName = bizRes.rows[0]?.name || "Restaurant";
        
        const otpMsg = `🔐 *Verification Code*\n\nYour login code for *${bizName}* is: *${otp}*.\n\nValid for 5 minutes. Use this code to view our menu and access special rewards! 🎁`;
        console.log(`[AUTH-OTP] Sending OTP ${otp} to ${normPhone} for User ${userId}`);
        const sent = await whatsappManager.sendOfficialMessage(normPhone, otpMsg, userId);
        
        if (!sent) {
            return res.status(500).json({ error: "WhatsApp service currently unavailable. Please contact the restaurant." });
        }
        
        res.json({ success: true, message: "OTP sent to WhatsApp." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// ✅ VERIFY LOGIN OTP
router.post("/auth/verify-otp", async (req, res) => {
    try {
        const { userId, phone, otp } = req.body;
        const normPhone = phone.replace(/\D/g, "");

        const otpCheck = await pool.query(
            "SELECT id FROM loyalty_otps WHERE user_id=$1 AND customer_number=$2 AND otp_code=$3 AND expires_at > NOW()",
            [userId, normPhone, otp]
        );

        if (otpCheck.rows.length === 0) {
            return res.status(401).json({ error: "Invalid or expired OTP." });
        }

        // Cleanup after verification
        await pool.query("DELETE FROM loyalty_otps WHERE id = $1", [otpCheck.rows[0].id]);
        
        res.json({ success: true, message: "OTP verified." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Verification failed" });
    }
});

module.exports = router;
