const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET CUSTOMER LIST (CRM)
router.get("/customers", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.id;
    const uid = parseInt(userId);
    const dbRes = await pool.query(`
      SELECT 
        REGEXP_REPLACE(cl.customer_number, '\D', '', 'g') as customer_number,
        cl.points,
        cl.total_spent,
        cl.last_visit,
        COALESCE(NULLIF(cl.name, 'Customer'), mc.name, 'Customer') AS display_name,
        mc.is_blocked
      FROM customer_loyalty cl
      LEFT JOIN marketing_contacts mc 
        ON REGEXP_REPLACE(mc.phone_number, '\D', '', 'g') = REGEXP_REPLACE(cl.customer_number, '\D', '', 'g')
        AND mc.user_id = cl.user_id
      WHERE cl.user_id = $1 
      ORDER BY cl.last_visit DESC
    `, [uid]);
    res.json(dbRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET FEEDBACKS
router.get("/feedbacks", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.id;
    const uid = parseInt(userId);
    const dbRes = await pool.query("SELECT * FROM customer_feedback WHERE user_id = $1 ORDER BY created_at DESC", [uid]);
    res.json(dbRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET MARKETING CONTACTS
router.get("/marketing-contacts", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.id;
    const uid = parseInt(userId);
    const dbRes = await pool.query(`
      SELECT DISTINCT phone_number as phone, name, last_order_at as created_at, is_blocked
      FROM marketing_contacts 
      WHERE user_id = $1 
      ORDER BY last_order_at DESC
    `, [uid]);
    res.json(dbRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ BLOCK/UNBLOCK CUSTOMER
router.put("/block-customer", authMiddleware, async (req, res) => {
  try {
    const { phone, isBlocked } = req.body;
    const userId = req.user.id;
    await pool.query(
      "UPDATE marketing_contacts SET is_blocked = $1 WHERE user_id = $2 AND phone_number = $3",
      [isBlocked, userId, phone]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE CUSTOMER
router.delete("/customer/:phone", authMiddleware, async (req, res) => {
  try {
    const { phone } = req.params;
    const userId = req.user.id;
    
    // Delete from both marketing and loyalty for a clean wipe
    await pool.query("DELETE FROM marketing_contacts WHERE user_id = $1 AND phone_number = $2", [userId, phone]);
    await pool.query("DELETE FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2", [userId, phone]);
    await pool.query("DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2", [userId, phone]);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
