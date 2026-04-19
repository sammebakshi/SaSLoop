const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/menu
router.get("/", authMiddleware, async (req, res) => {
  try {
    // get user's restaurant first
    const restRes = await pool.query("SELECT id FROM restaurants WHERE user_id = $1", [req.user.id]);
    if (restRes.rows.length === 0) {
      return res.status(404).json({ error: "Business not found" });
    }
    
    const restaurantId = restRes.rows[0].id;
    const result = await pool.query("SELECT * FROM menu WHERE restaurant_id = $1 ORDER BY id DESC", [restaurantId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error("MENU ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/menu
router.post("/", authMiddleware, async (req, res) => {
  const { name, price, category } = req.body;

  try {
    // get user's restaurant
    const restRes = await pool.query("SELECT id FROM restaurants WHERE user_id = $1", [req.user.id]);
    if (restRes.rows.length === 0) {
      return res.status(404).json({ error: "Business not found" });
    }
    
    const restaurantId = restRes.rows[0].id;

    // ensure category column exists
    try {
        await pool.query("ALTER TABLE menu ADD COLUMN IF NOT EXISTS category VARCHAR(100)");
        await pool.query("ALTER TABLE menu ADD COLUMN IF NOT EXISTS item_name VARCHAR(255)"); 
        // Note: frontend uses item_name but DB might use name. We'll standardise to item_name.
    } catch(e) {}
    
    // Check if table uses item_name or name
    let queryField = 'name';
    try {
       await pool.query("SELECT item_name FROM menu LIMIT 1");
       queryField = 'item_name';
    } catch(e) {}

    const result = await pool.query(
      `INSERT INTO menu (${queryField}, price, category, restaurant_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, price, category || 'Uncategorized', restaurantId]
    );

    // Map DB column to API output if needed
    const finalResult = result.rows[0];
    if(finalResult.name && !finalResult.item_name) {
       finalResult.item_name = finalResult.name;
    }

    res.json(finalResult);

  } catch (err) {
    console.error("MENU ADD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
