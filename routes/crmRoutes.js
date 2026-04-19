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
      SELECT cl.*, 
             COALESCE(NULLIF(cl.name, 'Customer'), mc.name, 'Customer') AS display_name
      FROM customer_loyalty cl
      LEFT JOIN marketing_contacts mc 
        ON mc.user_id = cl.user_id AND mc.phone_number = cl.customer_number
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
      SELECT DISTINCT phone_number as phone, name, last_order_at as created_at
      FROM marketing_contacts 
      WHERE user_id = $1 
      ORDER BY last_order_at DESC
    `, [uid]);
    res.json(dbRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
