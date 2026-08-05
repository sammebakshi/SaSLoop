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

// ✅ GET ONLY WAITERS / CAPTAINS FOR LOGGED-IN BUSINESS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId || req.user.id;
    const result = await pool.query(
      `SELECT id, name, phone, 'Waiter' as role FROM waiters WHERE (user_id = $1 OR user_id = (SELECT parent_user_id FROM app_users WHERE id = $1)) AND (is_active IS NULL OR is_active = true)
       UNION ALL
       SELECT u.id, COALESCE(u.name, u.first_name, u.username) as name, u.phone, COALESCE(u.user_type, u.role, 'Waiter') as role 
       FROM app_users u
       LEFT JOIN outlet_designations d ON u.designation_id = d.id
       WHERE (u.parent_user_id = $1 OR u.id = $1) 
         AND (u.status IS NULL OR u.status = 'active')
         AND (
           LOWER(COALESCE(u.user_type, '')) LIKE '%waiter%' OR 
           LOWER(COALESCE(u.user_type, '')) LIKE '%captain%' OR 
           LOWER(COALESCE(u.user_type, '')) LIKE '%server%' OR 
           LOWER(COALESCE(u.role, '')) LIKE '%waiter%' OR 
           LOWER(COALESCE(u.role, '')) LIKE '%captain%' OR 
           LOWER(COALESCE(u.role, '')) LIKE '%server%' OR 
           LOWER(COALESCE(d.name, '')) LIKE '%waiter%' OR 
           LOWER(COALESCE(d.name, '')) LIKE '%captain%' OR 
           LOWER(COALESCE(d.name, '')) LIKE '%server%'
         )
       ORDER BY name ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("🔥 GET WAITERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch waiters" });
  }
});

// ✅ GET ONLY DELIVERY BOYS / RIDERS FOR LOGGED-IN BUSINESS
router.get("/riders", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId || req.user.id;
    const result = await pool.query(
      `SELECT dp.id, dp.name, dp.phone, 'Delivery Boy' as role 
       FROM delivery_partners dp 
       JOIN app_users u ON dp.user_id = u.id 
       WHERE u.parent_user_id = $1 OR dp.user_id = $1
       UNION ALL
       SELECT u.id, COALESCE(u.name, u.first_name, u.username) as name, u.phone, COALESCE(u.user_type, u.role, 'Delivery Boy') as role 
       FROM app_users u
       LEFT JOIN outlet_designations d ON u.designation_id = d.id
       WHERE (u.parent_user_id = $1 OR u.id = $1) 
         AND (u.status IS NULL OR u.status = 'active')
         AND (
           LOWER(COALESCE(u.user_type, '')) LIKE '%delivery%' OR 
           LOWER(COALESCE(u.user_type, '')) LIKE '%rider%' OR 
           LOWER(COALESCE(u.user_type, '')) LIKE '%driver%' OR 
           LOWER(COALESCE(u.role, '')) LIKE '%delivery%' OR 
           LOWER(COALESCE(u.role, '')) LIKE '%rider%' OR 
           LOWER(COALESCE(u.role, '')) LIKE '%driver%' OR 
           LOWER(COALESCE(d.name, '')) LIKE '%delivery%' OR 
           LOWER(COALESCE(d.name, '')) LIKE '%rider%' OR 
           LOWER(COALESCE(d.name, '')) LIKE '%driver%'
         )
       ORDER BY name ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("🔥 GET RIDERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch riders" });
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
