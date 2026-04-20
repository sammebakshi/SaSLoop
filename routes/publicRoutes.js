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
        const { userId, tableNumber, items, totalPrice, customerName, customerPhone, pointsToRedeem, address, fulfillmentMode, source, subtotal: frontendSubtotal, cgst: frontendCgst, sgst: frontendSgst } = req.body;
        const isOnline = source === "ONLINE_ORDER";
        const prefix = isOnline ? "ONL" : "QR";
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
            const checkPoints = await pool.query("SELECT points FROM customer_loyalty WHERE user_id=$1 AND customer_number=$2", [userId, customerPhone]);
            const available = checkPoints.rows[0]?.points || 0;
            if (available >= pointsToRedeem) {
                redeemedPoints = pointsToRedeem;
            }
        }

        const orderAddress = address || (tableNumber && tableNumber !== "0" ? `Table ${tableNumber}` : "Pickup");

        const insertRes = await pool.query(
            "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, table_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [userId, customerName || "Guest", customerPhone || "QR-ORDER", orderAddress, JSON.stringify(items), finalPrice, orderRef, 'PENDING', tableNumber]
        );
        
        const orderId = insertRes.rows[0].id;
        
        // Build notification message
        const mode = fulfillmentMode || (tableNumber && tableNumber !== "0" ? "DINEIN" : "PICKUP");
        const modeLabel = mode === "DELIVERY" ? "🚚 Home Delivery" : (mode === "PICKUP" ? "🏪 Pickup" : `🍽️ Dine-In (Table ${tableNumber})`);
        const itemLines = items.map(i => `• ${i.qty}x ${i.name}`).join("\n");
        const addressLine = mode === "DELIVERY" ? `\n📍 *Address:* ${address}` : "";
        const phoneLine = customerPhone ? `\n📱 *Phone:* ${customerPhone}` : "";
        
        const kot = `${isOnline ? '🌐' : '🍽️'} *NEW ${isOnline ? 'ONLINE' : 'QR'} ORDER*\n*Ref:* ${orderRef}\n*Customer:* ${customerName || "Guest"}${phoneLine}\n*Type:* ${modeLabel}${addressLine}\n───────────────\n${itemLines}\n───────────────\n💰 *Total:* ${currSymbol}${finalPrice}${redeemedPoints > 0 ? ` (Redeemed ${redeemedPoints} pts)` : ''}`;
        
        // Notify Kitchen & Staff
        try {
            const cgstRate = parseFloat(bizData?.cgst_percent) || 0;
            const sgstRate = parseFloat(bizData?.sgst_percent) || 0;
            const isGstIncluded = !!bizData?.gst_included;
            let subtotal = frontendSubtotal !== undefined ? frontendSubtotal : 0;
            if (frontendSubtotal === undefined) items.forEach(i => subtotal += (i.qty * i.price));
            
            let cgstAmount = frontendCgst !== undefined ? frontendCgst : 0;
            let sgstAmount = frontendSgst !== undefined ? frontendSgst : 0;
            
            // Fallback backward compatibility calculation if frontend doesn't provide it
            if (frontendCgst === undefined && frontendSgst === undefined) {
                if (cgstRate > 0 || sgstRate > 0) {
                    if (isGstIncluded) {
                        const totalRate = cgstRate + sgstRate;
                        const basePrice = subtotal / (1 + totalRate / 100);
                        cgstAmount = basePrice * (cgstRate / 100);
                        sgstAmount = basePrice * (sgstRate / 100);
                    } else {
                        cgstAmount = subtotal * (cgstRate / 100);
                        sgstAmount = subtotal * (sgstRate / 100);
                    }
                }
            }
            
            await whatsappManager.notifyKitchenAndStaff(
                userId, orderRef, customerName || "Guest", customerPhone || "QR-ORDER", items,
                subtotal, finalPrice, cgstAmount, sgstAmount, cgstRate, sgstRate, currSymbol,
                mode.toLowerCase(), address, tableNumber && tableNumber !== "0" ? tableNumber : null
            );
        } catch (notifErr) { console.error("Staff notification failed:", notifErr); }
        
        // Notify Customer (for online orders)
        try {
            if (isOnline && customerPhone && customerPhone !== "QR-ORDER") {
                const custMsg = `✅ *Order Confirmed!*\n\n*${bizData?.name || 'Restaurant'}* received your order.\n\n*Ref:* ${orderRef}\n*Type:* ${modeLabel}\n───────────────\n${itemLines}\n───────────────\n💰 *Total:* ${currSymbol}${finalPrice}\n\n⏱️ Estimated: ${mode === 'DELIVERY' ? '30-45 min' : '15-20 min'}\n\nWe'll update you when it's ready! 🔥`;
                await whatsappManager.sendOfficialMessage(customerPhone, custMsg, userId, `CONFIRM_${orderId}`);
            }
        } catch (custErr) { console.error("Customer notification failed:", custErr); }
        
        // Update Points (Dynamic logic)
        if (customerPhone && customerPhone !== "QR-ORDER") {
            const biz = bizData; // Already fetched
            const ptsEnabled = biz?.loyalty_enabled !== false;
            
            if (ptsEnabled) {
                const normPhone = customerPhone.replace(/\D/g, "");
                const ptsEarnRate = (parseFloat(biz.points_per_100) || 5) / 100;
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
                [userId, normPhone, customerName || "Guest", finalPrice, earned, redeemedPoints]
            );
          }
        }

        res.json({ success: true, orderId, orderRef, finalPrice, redeemedPoints });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
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

module.exports = router;
