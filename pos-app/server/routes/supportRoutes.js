const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const { requireAdminOrMaster } = require("../middleware/authMiddleware");

// ✅ CREATE A NEW TICKET (Any User)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user.id;
    
    await pool.query(
      "INSERT INTO support_tickets (user_id, subject, message) VALUES ($1, $2, $3)",
      [userId, subject, message]
    );
    res.json({ message: "Ticket submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET MY TICKETS (Any User)
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const dbRes = await pool.query(
      "SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC", 
      [userId]
    );
    res.json(dbRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET ALL TICKETS (Master/Admin Only)
router.get("/all", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const dbRes = await pool.query(`
      SELECT st.*, u.username, u.email, u.business_name
      FROM support_tickets st
      JOIN app_users u ON st.user_id = u.id
      ORDER BY st.created_at DESC
    `);
    res.json(dbRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ REPLY/CLOSE TICKET (Master/Admin Only)
router.put("/:id/reply", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;
    
    await pool.query(
      "UPDATE support_tickets SET admin_reply = $1, status = $2 WHERE id = $3",
      [reply, status || 'closed', id]
    );
    res.json({ message: "Ticket updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
