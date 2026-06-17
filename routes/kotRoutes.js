const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ CREATE NEW KOT
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId;
    const { table_number, items } = req.body;

    const result = await pool.query(
      `INSERT INTO kots (user_id, table_number, items, status, created_at)
       VALUES ($1, $2, $3, 'PENDING', NOW()) RETURNING *`,
      [userId, table_number, JSON.stringify(items)]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 CREATE KOT ERROR:", err);
    res.status(500).json({ error: "Failed to create KOT" });
  }
});

// ✅ GET ALL KOTS FOR LOGGED-IN BUSINESS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId;
    const result = await pool.query(
      "SELECT * FROM kots WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("🔥 GET KOTS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch KOTs" });
  }
});

// ✅ UPDATE KOT STATUS
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.bizId;

    await pool.query(
      "UPDATE kots SET status = $1 WHERE id = $2 AND user_id = $3",
      [status, id, userId]
    );

    res.json({ success: true, message: "KOT status updated" });
  } catch (err) {
    console.error("🔥 UPDATE KOT STATUS ERROR:", err);
    res.status(500).json({ error: "Failed to update KOT status" });
  }
});

// ✅ UPDATE STATUS OF INDIVIDUAL ITEM IN KOT (KDS Feature)
router.patch("/:id/items/:itemIndex/status", authMiddleware, async (req, res) => {
  try {
    const { id, itemIndex } = req.params;
    const { status } = req.body;
    const userId = req.user.bizId;

    const result = await pool.query("SELECT items FROM kots WHERE id = $1 AND user_id = $2", [id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: "KOT not found" });

    let items = result.rows[0].items;
    const idx = parseInt(itemIndex);
    
    if (items[idx]) {
      items[idx].status = status;
    } else {
      return res.status(400).json({ error: "Item index out of bounds" });
    }

    await pool.query("UPDATE kots SET items = $1 WHERE id = $2 AND user_id = $3", [JSON.stringify(items), id, userId]);

    res.json({ success: true, message: "Item status updated in KDS" });
  } catch (err) {
    console.error("🔥 UPDATE KOT ITEM STATUS ERROR:", err);
    res.status(500).json({ error: "Failed to update item status" });
  }
});

// ✅ DISABLE ITEM FROM KDS (When kitchen runs out of stock)
router.patch("/disable-item", authMiddleware, async (req, res) => {
  try {
    const { item_id } = req.body;
    const userId = req.user.bizId;

    await pool.query(
      "UPDATE business_items SET availability = false WHERE id = $1 AND user_id = $2",
      [item_id, userId]
    );

    res.json({ success: true, message: "Item marked as unavailable from KDS" });
  } catch (err) {
    console.error("🔥 DISABLE ITEM ERROR:", err);
    res.status(500).json({ error: "Failed to disable item" });
  }
});

module.exports = router;

