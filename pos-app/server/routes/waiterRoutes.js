const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ CREATE NEW WAITER
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId;
    const { name, phone } = req.body;

    const result = await pool.query(
      `INSERT INTO waiters (user_id, name, phone, is_active, created_at)
       VALUES ($1, $2, $3, true, NOW()) RETURNING *`,
      [userId, name, phone]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 CREATE WAITER ERROR:", err);
    res.status(500).json({ error: "Failed to create waiter" });
  }
});

// ✅ GET ALL WAITERS FOR LOGGED-IN BUSINESS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId;
    const result = await pool.query(
      "SELECT * FROM waiters WHERE user_id = $1 AND is_active = true ORDER BY name ASC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("🔥 GET WAITERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch waiters" });
  }
});

// ✅ UPDATE WAITER DETAILS
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, is_active } = req.body;
    const userId = req.user.bizId;

    await pool.query(
      "UPDATE waiters SET name = $1, phone = $2, is_active = $3 WHERE id = $4 AND user_id = $5",
      [name, phone, is_active, id, userId]
    );

    res.json({ success: true, message: "Waiter details updated" });
  } catch (err) {
    console.error("🔥 UPDATE WAITER ERROR:", err);
    res.status(500).json({ error: "Failed to update waiter" });
  }
});

// ✅ DELETE WAITER (Soft delete by setting is_active = false)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.bizId;

    await pool.query(
      "UPDATE waiters SET is_active = false WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    res.json({ success: true, message: "Waiter deleted" });
  } catch (err) {
    console.error("🔥 DELETE WAITER ERROR:", err);
    res.status(500).json({ error: "Failed to delete waiter" });
  }
});

module.exports = router;
