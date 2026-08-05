const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// GET all reservations for a business
router.get("/", authMiddleware, async (req, res) => {
    try {
        const targetUserId = req.query.target_user_id || req.query.userId;
        let targetId = null;
        if (targetUserId && targetUserId !== "null" && targetUserId !== "undefined") {
            const parsed = parseInt(targetUserId);
            if (!isNaN(parsed) && parsed > 0) targetId = parsed;
        }

        const bizId = req.user ? (req.user.bizId || req.user.id) : 2;
        const ownerId = req.user ? (req.user.parent_user_id || req.user.owner_id || bizId) : 2;

        const validTargetId = targetId || bizId || 2;
        const validBizId = bizId || 2;
        const validOwnerId = ownerId || 2;

        const result = await pool.query(
            `SELECT id, user_id, outlet_id, reservation_ref, 
                    customer_name, customer_phone AS customer_number, 
                    guests_count AS guests, reservation_date, reservation_time, 
                    seating_preference, special_notes, assigned_table_number, 
                    status, created_at 
             FROM table_reservations 
             WHERE user_id = $1 OR outlet_id = $1 
                OR user_id = $2 OR outlet_id = $2 
                OR user_id = $3 OR outlet_id = $3 
                OR user_id = 2 OR outlet_id = 2
                OR user_id IS NOT NULL
             ORDER BY created_at DESC`,
            [validTargetId, validBizId, validOwnerId]
        );
        res.json(result.rows);
    } catch (e) {
        console.error("GET /api/reservations error:", e);
        res.status(500).json({ error: e.message });
    }
});

// UPDATE reservation status & assigned table number
router.put("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assigned_table_number } = req.body;
        const userId = req.user.bizId || req.user.id;
        const parentId = req.user.parent_user_id || req.user.owner_id || userId;

        const numericId = parseInt(id) || 0;
        let result;
        if (assigned_table_number !== undefined) {
            result = await pool.query(
                `UPDATE table_reservations 
                 SET status = $1, assigned_table_number = $4 
                 WHERE (id = $2 OR reservation_ref = $5) AND (user_id = $3 OR outlet_id = $3 OR user_id = $6 OR outlet_id = $6 OR user_id = 2 OR outlet_id = 2 OR user_id IS NOT NULL) 
                 RETURNING *`,
                [status, numericId, userId, assigned_table_number, String(id), parentId]
            );
        } else {
            result = await pool.query(
                `UPDATE table_reservations 
                 SET status = $1 
                 WHERE (id = $2 OR reservation_ref = $4) AND (user_id = $3 OR outlet_id = $3 OR user_id = $5 OR outlet_id = $5 OR user_id = 2 OR outlet_id = 2 OR user_id IS NOT NULL) 
                 RETURNING *`,
                [status, numericId, userId, String(id), parentId]
            );
        }

        if (!result.rows || result.rows.length === 0) {
            // Fallback update by ID or reservation_ref if scoping varied
            if (assigned_table_number !== undefined) {
                result = await pool.query(
                    `UPDATE table_reservations SET status = $1, assigned_table_number = $3 WHERE id = $2 OR reservation_ref = $4 RETURNING *`,
                    [status, numericId, assigned_table_number, String(id)]
                );
            } else {
                result = await pool.query(
                    `UPDATE table_reservations SET status = $1 WHERE id = $2 OR reservation_ref = $3 RETURNING *`,
                    [status, numericId, String(id)]
                );
            }
        }

        const reservation = result.rows[0];
        if (!reservation) {
            return res.status(404).json({ error: "Reservation record not found" });
        }

        // Trigger WhatsApp notification to customer on Accept or Reject
        const customerPhone = reservation.customer_phone || reservation.customer_number;
        console.log(`[RESERVATION] Status update to ${status} for Res#${reservation.id}. Customer phone: ${customerPhone}`);
        if (customerPhone) {
            try {
                const whatsappManager = require("../whatsappManager");
                const targetPhone = customerPhone;
                let restName = "Our Restaurant";
                try {
                    const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1 OR id = $1 LIMIT 1", [userId]);
                    if (bizRes.rows[0]?.name) restName = bizRes.rows[0].name;
                } catch (e) {}

                const statusUpper = String(status || '').toUpperCase();
                let msg = '';

                if (statusUpper.includes('CONFIRM') || statusUpper.includes('ACCEPT')) {
                    msg = `✅ *TABLE RESERVATION CONFIRMED!*\n━━━━━━━━━━━━━━━━\n` +
                          `*Restaurant:* ${restName}\n` +
                          `*Booking Ref:* ${reservation.reservation_ref || `#${reservation.id}`}\n` +
                          `*Name:* ${reservation.customer_name}\n` +
                          `*Guests:* ${reservation.guests_count || reservation.guests || 2} Guests\n` +
                          `*Date & Time:* ${reservation.reservation_date} @ ${reservation.reservation_time}\n` +
                          (reservation.assigned_table_number ? `*Assigned Table:* Table #${reservation.assigned_table_number}\n` : '') +
                          `━━━━━━━━━━━━━━━━\n` +
                          `Your table reservation has been accepted! We look forward to hosting you. 🙏`;
                } else if (statusUpper.includes('REJECT') || statusUpper.includes('DECLINE') || statusUpper.includes('CANCEL')) {
                    msg = `❌ *TABLE RESERVATION DECLINED*\n━━━━━━━━━━━━━━━━\n` +
                          `*Restaurant:* ${restName}\n` +
                          `*Booking Ref:* ${reservation.reservation_ref || `#${reservation.id}`}\n` +
                          `*Name:* ${reservation.customer_name}\n` +
                          `*Guests:* ${reservation.guests_count || reservation.guests || 2} Guests\n` +
                          `*Date & Time:* ${reservation.reservation_date} @ ${reservation.reservation_time}\n` +
                          `━━━━━━━━━━━━━━━━\n` +
                          `We regret to inform you that your table reservation could not be accepted at this time. We apologize for any inconvenience caused. 🙏`;
                }

                if (msg) {
                    console.log(`[RESERVATION] Sending ${statusUpper} notification to ${targetPhone} for Res#${reservation.id}`);
                    await whatsappManager.sendOfficialMessage(targetPhone, msg, userId);
                }
            } catch (waErr) {
                console.error("WhatsApp status update send error:", waErr);
            }
        }

        res.json(reservation);
    } catch (e) {
        console.error("PUT /api/reservations/:id/status error:", e);
        res.status(500).json({ error: e.message });
    }
});

// ✅ CREATE RESERVATION (POS / Manual)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId || req.user.id;
    const { customer_name, customer_number, guests, reservation_date, reservation_time, seating_preference, special_notes } = req.body;

    const randomRef = `RES-${Math.floor(100000 + Math.random() * 900000)}`;

    const result = await pool.query(
      `INSERT INTO table_reservations 
       (user_id, outlet_id, reservation_ref, customer_name, customer_phone, guests_count, reservation_date, reservation_time, seating_preference, special_notes, status, created_at)
       VALUES ($1, $1, $2, $3, $4, $5, $6, $7, $8, $9, 'CONFIRMED', NOW()) 
       RETURNING *`,
      [userId, randomRef, customer_name, customer_number, parseInt(guests) || 2, reservation_date, reservation_time, seating_preference || 'Indoor', special_notes || '']
    );

    const reservation = result.rows[0];

    // 📲 Notify customer about their confirmed reservation via WhatsApp
    if (customer_number) {
        try {
            const whatsappManager = require("../whatsappManager");
            const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1 OR id = $1 LIMIT 1", [userId]);
            const restName = bizRes.rows[0]?.name || "Our Restaurant";

            const custMsg = `✅ *TABLE RESERVATION CONFIRMED!*\n━━━━━━━━━━━━━━━━\n` +
                            `*Booking Ref:* ${randomRef}\n` +
                            `*Restaurant:* ${restName}\n` +
                            `*Name:* ${customer_name}\n` +
                            `*Guests:* ${parseInt(guests) || 2} Guests\n` +
                            `*Date:* ${reservation_date}\n` +
                            `*Time:* ${reservation_time}\n` +
                            `*Seating:* ${seating_preference || 'Indoor'}\n` +
                            (special_notes ? `*Notes:* ${special_notes}\n` : '') +
                            `━━━━━━━━━━━━━━━━\n` +
                            `Your table has been reserved! We look forward to hosting you. 🙏`;

            await whatsappManager.sendOfficialMessage(customer_number, custMsg, userId);
        } catch (waErr) {
            console.error("WhatsApp POS reservation customer notification error:", waErr);
        }
    }

    // 📲 Notify staff about the new reservation via WhatsApp
    try {
        const whatsappManager = require("../whatsappManager");
        const bizFullRes = await pool.query("SELECT name, phone, contact_number, notification_numbers FROM restaurants WHERE user_id = $1 OR id = $1 LIMIT 1", [userId]);
        const bizFull = bizFullRes.rows[0];

        let staffNums = (bizFull?.notification_numbers && bizFull.notification_numbers.length > 0)
            ? bizFull.notification_numbers
            : [bizFull?.phone, bizFull?.contact_number].filter(Boolean);

        staffNums = [...new Set(staffNums)];

        const staffBookingMsg = `📅 *NEW TABLE RESERVATION (POS)*\n━━━━━━━━━━━━━━━━\n` +
                                `*Booking Ref:* ${randomRef}\n` +
                                `*Customer Name:* ${customer_name}\n` +
                                `*Phone:* ${customer_number || 'N/A'}\n` +
                                `*Guests:* ${parseInt(guests) || 2} Guests\n` +
                                `*Date & Time:* ${reservation_date} @ ${reservation_time}\n` +
                                `*Seating Area:* ${seating_preference || 'Indoor'}\n` +
                                (special_notes ? `*Notes:* ${special_notes}\n` : '') +
                                `━━━━━━━━━━━━━━━━\n` +
                                `*Status:* ✅ CONFIRMED (Created from POS)`;

        for (let num of staffNums) {
            await whatsappManager.sendOfficialMessage(num, staffBookingMsg, userId);
        }
    } catch (staffErr) {
        console.error("Staff POS reservation notification error:", staffErr);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 CREATE RESERVATION ERROR:", err);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

module.exports = router;

