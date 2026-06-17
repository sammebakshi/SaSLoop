const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// GET all reservations for a business
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM reservations WHERE user_id = $1 ORDER BY reservation_date DESC, reservation_time DESC",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// UPDATE reservation status
router.put("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await pool.query(
            "UPDATE reservations SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
            [status, id, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ✅ CREATE RESERVATION
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId || req.user.id;
    const { customer_name, customer_number, guests, reservation_date, reservation_time } = req.body;

    const result = await pool.query(
      `INSERT INTO reservations (user_id, customer_name, customer_number, guests, reservation_date, reservation_time, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', NOW()) RETURNING *`,
      [userId, customer_name, customer_number, guests, reservation_date, reservation_time]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 CREATE RESERVATION ERROR:", err);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

module.exports = router;

