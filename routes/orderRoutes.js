const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const whatsappManager = require("../whatsappManager");

// ✅ GET ALL ORDERS FOR LOGGED-IN BUSINESS (or target user if admin)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { target_user_id } = req.query;
    let userId = req.user.id;

    // If an admin wants to see someone else's orders
    if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
       userId = target_user_id;
    }

    const dbRes = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", 
      [userId]
    );
    res.json(dbRes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE ORDER STATUS
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Verify ownership & Fetch order data for notification
    const checkRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (checkRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const order = checkRes.rows[0];

    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
    
    // Proactively Notify Customer via WhatsApp
    try {
        const customerNumber = order.customer_number;
        const ref = order.order_reference || `#${id}`;
        let updateMsg = "";
        
        if (status === 'PROCESSING') {
            updateMsg = `👨‍🍳 *Order Update:* Your order *${ref}* is being prepared!`;
        } else if (status === 'DISPATCHED') {
            updateMsg = `🚚 *Out for Delivery:* Your order *${ref}* is on the way!`;
        } else if (status === 'COMPLETED') {
            // 🏆 AWARD LOYALTY POINTS ON COMPLETION
            let pointsSummary = "";
            try {
                const bizRes = await pool.query("SELECT points_per_100 FROM restaurants WHERE user_id = $1", [userId]);
                const bizData = bizRes.rows[0];
                const cleanPhone = (order.customer_number || "").replace(/\D/g, "");
                const dbPhone = cleanPhone ? `+${cleanPhone}` : "";
                
                if (dbPhone && bizData) {
                    const ptsEarnRate = (parseFloat(bizData.points_per_100) || 5) / 100;
                    const earned = Math.floor((parseFloat(order.total_price) || 0) * ptsEarnRate);
                    
                    const loyaltyRes = await pool.query(
                        `INSERT INTO customer_loyalty (user_id, customer_number, points, total_spent, last_visit)
                         VALUES ($1, $2, $3, $4, NOW())
                         ON CONFLICT (user_id, customer_number) 
                         DO UPDATE SET 
                            total_spent = customer_loyalty.total_spent + EXCLUDED.total_spent,
                            points = COALESCE(customer_loyalty.points, 0) + EXCLUDED.points,
                            last_visit = NOW() RETURNING points`,
                        [userId, dbPhone, earned, parseFloat(order.total_price) || 0]
                    );
                    
                    if (earned > 0) {
                        const newBal = loyaltyRes.rows[0]?.points ?? 0;
                        pointsSummary = `\n🎁 *Loyalty Reward:* You earned *${earned} points*!\n🌟 *New Balance:* *${newBal} points*`;
                    }
                }
            } catch (loyaltyErr) { console.error("Completion Loyalty Error:", loyaltyErr); }

            const isTable = order.table_number ? true : false;
            if (isTable) {
                updateMsg = `🏁 *Served:* Your items for Table *${order.table_number}* have been served. Enjoy your meal! 🍽️${pointsSummary}\n\nHow was your experience? Reply with a rating (1 to 5)!`;
            } else {
                updateMsg = `🏁 *Delivered:* Your order *${ref}* was successful. Enjoy!${pointsSummary}\n\nHow was your experience? Reply with a rating (1 to 5) and any comments!`;
            }
        } else if (status === 'CANCELLED') {
            updateMsg = `❌ *Cancelled:* Your order *${ref}* has been cancelled.`;
        }

        if (updateMsg && customerNumber) {
            await whatsappManager.sendOfficialMessage(customerNumber, updateMsg, userId, `STATUS_${id}_${status}`);
        }
    } catch (notifErr) { console.error("Notification Fail:", notifErr); }

    res.json({ message: "Order status updated and customer notified" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
