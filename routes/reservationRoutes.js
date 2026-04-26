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

module.exports = router;
