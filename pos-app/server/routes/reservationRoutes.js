const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// GET all reservations for a business
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.bizId || req.user.id;
        const parentId = req.user.parent_user_id || req.user.owner_id || userId;
        const result = await pool.query(
            `SELECT id, user_id, outlet_id, reservation_ref, 
                    customer_name, customer_phone AS customer_number, 
                    guests_count AS guests, reservation_date, reservation_time, 
                    seating_preference, special_notes, assigned_table_number, 
                    status, created_at 
             FROM table_reservations 
             WHERE user_id = $1 OR outlet_id = $1 OR user_id = $2 OR outlet_id = $2
             ORDER BY created_at DESC`,
            [userId, parentId]
        );
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
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
                 WHERE (id = $2 OR reservation_ref = $5) AND (user_id = $3 OR outlet_id = $3 OR user_id = $6 OR outlet_id = $6) 
                 RETURNING *`,
                [status, numericId, userId, assigned_table_number, String(id), parentId]
            );
        } else {
            result = await pool.query(
                `UPDATE table_reservations 
                 SET status = $1 
                 WHERE (id = $2 OR reservation_ref = $4) AND (user_id = $3 OR outlet_id = $3 OR user_id = $5 OR outlet_id = $5) 
                 RETURNING *`,
                [status, numericId, userId, String(id), parentId]
            );
        }

        const reservation = result.rows[0];

        // Trigger WhatsApp notification to customer on Accept or Reject
        if (reservation && (reservation.customer_phone || reservation.customer_number)) {
            try {
                const whatsappManager = require("../whatsappManager");
                const targetPhone = reservation.customer_phone || reservation.customer_number;
                let restName = "Our Restaurant";
                try {
                    const bizRes = await pool.query("SELECT name FROM restaurants WHERE user_id = $1 OR id = $1 LIMIT 1", [userId]);
                    if (bizRes.rows[0]?.name) restName = bizRes.rows[0].name;
                } catch (e) {}

                const statusUpper = String(status || '').toUpperCase();
                let msg = '';

                if (statusUpper === 'CONFIRMED') {
                    msg = `✅ *TABLE RESERVATION CONFIRMED!*\n━━━━━━━━━━━━━━━━\n` +
                          `*Restaurant:* ${restName}\n` +
                          `*Booking Ref:* ${reservation.reservation_ref || `#${reservation.id}`}\n` +
                          `*Name:* ${reservation.customer_name}\n` +
                          `*Guests:* ${reservation.guests_count || reservation.guests || 2} Guests\n` +
                          `*Date & Time:* ${reservation.reservation_date} @ ${reservation.reservation_time}\n` +
                          (reservation.assigned_table_number ? `*Assigned Table:* Table #${reservation.assigned_table_number}\n` : '') +
                          `━━━━━━━━━━━━━━━━\n` +
                          `Your table reservation has been accepted! We look forward to hosting you. 🙏`;
                } else if (statusUpper === 'REJECTED' || statusUpper === 'CANCELLED') {
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
                    await whatsappManager.sendOfficialMessage(targetPhone, msg, userId, `RES_STATUS_${reservation.id}_${statusUpper}`);
                }
            } catch (waErr) {
                console.error("WhatsApp status update send error:", waErr);
            }
        }

        res.json(reservation);
    } catch (e) { res.status(500).json({ error: e.message }); }
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

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 CREATE RESERVATION ERROR:", err);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

module.exports = router;

