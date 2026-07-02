const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ CREATE PRE-ORDER
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId;
    const {
      customer_name, customer_number, customer_address,
      items, total_price, advance_paid,
      scheduled_date, scheduled_time,
      order_type, table_number, notes,
      discount, coupon_code, coupon_discount, points_redeemed, points_discount
    } = req.body;

    const advancePaid = parseFloat(advance_paid) || 0;
    const totalPrice = parseFloat(total_price) || 0;
    const balanceDue = totalPrice - advancePaid;

    const result = await pool.query(
      `INSERT INTO pre_orders (
        user_id, customer_name, customer_number, customer_address,
        items, total_price, advance_paid, balance_due,
        scheduled_date, scheduled_time,
        order_type, table_number, status, notes,
        discount, coupon_code, coupon_discount, points_redeemed, points_discount,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW()) RETURNING *`,
      [
        userId,
        customer_name || 'Walk-in',
        customer_number || '',
        customer_address || '',
        JSON.stringify(items),
        totalPrice,
        advancePaid,
        balanceDue,
        scheduled_date,
        scheduled_time,
        order_type || 'PICKUP',
        table_number || '',
        'SCHEDULED',
        notes || '',
        parseFloat(discount) || 0,
        coupon_code || null,
        parseFloat(coupon_discount) || 0,
        parseInt(points_redeemed) || 0,
        parseFloat(points_discount) || 0
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 PRE-ORDER CREATE ERROR:", err);
    res.status(500).json({ error: "Failed to create pre-order" });
  }
});

// ✅ GET ALL PRE-ORDERS FOR BUSINESS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId;
    const dbRes = await pool.query(
      "SELECT * FROM pre_orders WHERE user_id = $1 ORDER BY scheduled_date ASC, scheduled_time ASC",
      [userId]
    );
    res.json(dbRes.rows);
  } catch (err) {
    console.error("🔥 PRE-ORDERS FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch pre-orders" });
  }
});

// ✅ UPDATE PRE-ORDER
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.bizId;

    const checkRes = await pool.query("SELECT * FROM pre_orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (checkRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized or pre-order not found" });
    }

    const {
      customer_name, customer_number, customer_address,
      items, total_price, advance_paid,
      scheduled_date, scheduled_time,
      order_type, table_number, notes,
      discount, coupon_code, coupon_discount, points_redeemed, points_discount
    } = req.body;

    const advancePaid = parseFloat(advance_paid) || 0;
    const totalPrice = parseFloat(total_price) || 0;
    const balanceDue = totalPrice - advancePaid;

    const result = await pool.query(
      `UPDATE pre_orders SET
        customer_name = $1, customer_number = $2, customer_address = $3,
        items = $4, total_price = $5, advance_paid = $6, balance_due = $7,
        scheduled_date = $8, scheduled_time = $9,
        order_type = $10, table_number = $11, notes = $12,
        discount = $13, coupon_code = $14, coupon_discount = $15,
        points_redeemed = $16, points_discount = $17
      WHERE id = $18 AND user_id = $19 RETURNING *`,
      [
        customer_name || 'Walk-in',
        customer_number || '',
        customer_address || '',
        JSON.stringify(items),
        totalPrice, advancePaid, balanceDue,
        scheduled_date, scheduled_time,
        order_type || 'PICKUP',
        table_number || '',
        notes || '',
        parseFloat(discount) || 0,
        coupon_code || null,
        parseFloat(coupon_discount) || 0,
        parseInt(points_redeemed) || 0,
        parseFloat(points_discount) || 0,
        id, userId
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 PRE-ORDER UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update pre-order" });
  }
});

// ✅ UPDATE PRE-ORDER STATUS
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.bizId;

    const checkRes = await pool.query("SELECT * FROM pre_orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (checkRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (status === 'COMPLETED') {
      await pool.query("UPDATE pre_orders SET status = $1, advance_paid = total_price, balance_due = 0 WHERE id = $2", [status, id]);
    } else {
      await pool.query("UPDATE pre_orders SET status = $1 WHERE id = $2", [status, id]);
    }
    res.json({ message: "Pre-order status updated", status });
  } catch (err) {
    console.error("🔥 PRE-ORDER STATUS ERROR:", err);
    res.status(500).json({ error: "Failed to update pre-order status" });
  }
});

// ✅ DELETE PRE-ORDER
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.bizId;

    const checkRes = await pool.query("SELECT * FROM pre_orders WHERE id = $1 AND user_id = $2", [id, userId]);
    if (checkRes.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await pool.query("DELETE FROM pre_orders WHERE id = $1", [id]);
    res.json({ message: "Pre-order deleted" });
  } catch (err) {
    console.error("🔥 PRE-ORDER DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete pre-order" });
  }
});

module.exports = router;
