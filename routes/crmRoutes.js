const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// Helper function to extract all possible variations of a phone number
function getPhoneVariations(phone) {
  if (!phone) return [];
  const cleanPhone = phone.replace(/\D/g, "");
  const tenDigits = cleanPhone.slice(-10);
  return [
    phone,
    cleanPhone,
    `+${cleanPhone}`,
    tenDigits,
    `+${tenDigits}`,
    `+91${tenDigits}`
  ].filter((v, i, self) => v && self.indexOf(v) === i);
}

// Helper function to find standard customer_number in database
async function findExistingCustomerNumber(userId, phone) {
  if (!phone) return phone;
  const phones = getPhoneVariations(phone);
  const res = await pool.query(
    "SELECT customer_number FROM customer_loyalty WHERE user_id = $1 AND customer_number = ANY($2) LIMIT 1",
    [userId, phones]
  );
  if (res.rows.length > 0) {
    return res.rows[0].customer_number;
  }
  return phone;
}

// ✅ SEARCH CUSTOMERS LIVE
router.get("/customers/search", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.bizId;
    const uid = parseInt(userId);
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }
    const dbRes = await pool.query(
      `SELECT c.id, c.name, c.number, c.address,
              COALESCE(cl.balance, 0.00) as balance,
              COALESCE(cl.points, 0) as points
       FROM customers c
       LEFT JOIN customer_loyalty cl ON cl.user_id = c.user_id AND cl.customer_number = c.number
       WHERE c.user_id = $1 AND (c.number LIKE $2 OR c.name ILIKE $2) 
       LIMIT 10`,
      [uid, `%${query}%`]
    );
    res.json(dbRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ SAVE/UPSERT CUSTOMER
router.post("/customers", authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.query.target_user_id || req.body?.target_user_id || req.user.bizId);
    const { name, number, address, points, balance } = req.body;
    if (!number) {
      return res.status(400).json({ error: "Customer number is required" });
    }
    
    // 1. Upsert into customers table
    const dbRes = await pool.query(
      `INSERT INTO customers (user_id, name, number, address)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, number)
       DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address
       RETURNING *`,
      [userId, name, number, address]
    );

    // 2. Upsert into customer_loyalty table
    const initialPoints = parseInt(points) || 0;
    const initialBalance = parseFloat(balance) || 0.00;
    
    const loyaltyRes = await pool.query(
      `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
       VALUES ($1, $2, $3, $4, $5, 0.00, NOW())
       ON CONFLICT (user_id, customer_number)
       DO UPDATE SET name = EXCLUDED.name,
                     points = COALESCE(customer_loyalty.points, 0) + EXCLUDED.points,
                     balance = COALESCE(customer_loyalty.balance, 0) + EXCLUDED.balance
       RETURNING *`,
      [userId, number, name || 'Customer', initialPoints, initialBalance]
    );

    // 3. Log initial transaction if points/balance is set
    if (initialBalance > 0) {
      await pool.query(
        `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
         VALUES ($1, $2, 'BALANCE_INITIAL', $3, 0, 'Initial Balance during registration', NOW())`,
        [userId, number, initialBalance]
      );
    }
    
    if (initialPoints > 0) {
      await pool.query(
        `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
         VALUES ($1, $2, 'POINTS_INITIAL', 0, $3, 'Initial Points during registration', NOW())`,
        [userId, number, initialPoints]
      );
    }

    res.json({ success: true, customer: dbRes.rows[0], loyalty: loyaltyRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET CUSTOMER LIST (CRM)
router.get("/customers", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.bizId;
    const uid = parseInt(userId);
    const dbRes = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.number as phone,
        c.number as customer_number,
        c.address,
        COALESCE(cl.points, 0) as points,
        COALESCE(cl.balance, 0.00) as balance,
        COALESCE(cl.total_spent, 0.00) as total_spent,
        cl.last_visit,
        COALESCE(c.name, 'Customer') as display_name,
        COALESCE(mc.is_blocked, false) as is_blocked,
        (SELECT COUNT(*) FROM orders o WHERE o.user_id = c.user_id AND o.customer_number = c.number) as orders
      FROM customers c
      LEFT JOIN customer_loyalty cl ON cl.user_id = c.user_id AND cl.customer_number = c.number
      LEFT JOIN marketing_contacts mc ON mc.user_id = c.user_id AND mc.phone_number = c.number
      WHERE c.user_id = $1
      ORDER BY cl.last_visit DESC NULLS LAST
    `, [uid]);
    res.json(dbRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET FEEDBACKS
router.get("/feedbacks", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.bizId;
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
    const userId = req.query.target_user_id || req.user.bizId;
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
    const userId = parseInt(req.query.target_user_id || req.body?.target_user_id || req.user.bizId);
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
    const userId = parseInt(req.query.target_user_id || req.body?.target_user_id || req.user.bizId);
    const phones = getPhoneVariations(phone);
    
    // Delete from all tables for a clean wipe
    await pool.query("DELETE FROM marketing_contacts WHERE user_id = $1 AND phone_number = ANY($2)", [userId, phones]);
    await pool.query("DELETE FROM customer_loyalty WHERE user_id = $1 AND customer_number = ANY($2)", [userId, phones]);
    await pool.query("DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = ANY($2)", [userId, phones]);
    await pool.query("DELETE FROM customer_transactions WHERE user_id = $1 AND customer_number = ANY($2)", [userId, phones]);
    await pool.query("DELETE FROM customer_feedback WHERE user_id = $1 AND customer_number = ANY($2)", [userId, phones]);
    await pool.query("DELETE FROM chat_messages WHERE user_id = $1 AND customer_number = ANY($2)", [userId, phones]);
    await pool.query("DELETE FROM customers WHERE user_id = $1 AND number = ANY($2)", [userId, phones]);
    
    res.json({ success: true });
  } catch (err) {
    console.error("🔥 DELETE CUSTOMER ERROR:", err);
    try {
      require('fs').appendFileSync(require('path').join(__dirname, '../error.log'), `[${new Date().toISOString()}] DELETE CUSTOMER ERROR: ${err.stack}\n`);
    } catch (e) {}
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET SEGMENTED ANALYTICS
router.get("/segments", authMiddleware, async (req, res) => {
  try {
    const userId = req.query.target_user_id || req.user.bizId;
    const uid = parseInt(userId);
    
    const dbRes = await pool.query(`
      WITH customer_data AS (
        SELECT 
          customer_number,
          points,
          total_spent,
          last_visit,
          COALESCE(name, 'Customer') as name,
          EXTRACT(DAY FROM (NOW() - last_visit)) as days_since_visit
        FROM customer_loyalty
        WHERE user_id = $1
      ),
      active_chats AS (
        SELECT COUNT(DISTINCT customer_number) as active_count
        FROM chat_messages
        WHERE user_id = $1 AND role = 'customer' AND created_at >= NOW() - INTERVAL '24 hours'
      )
      SELECT 
        COUNT(*) FILTER (WHERE total_spent > 5000 OR points > 1000) as vip_count,
        COUNT(*) FILTER (WHERE days_since_visit > 14) as at_risk_count,
        COUNT(*) FILTER (WHERE days_since_visit <= 7 AND total_spent < 1000) as new_count,
        COUNT(*) as total_count,
        COALESCE((SELECT active_count FROM active_chats), 0) as active_chat_count
      FROM customer_data
    `, [uid]);
    
    res.json(dbRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET CUSTOMER ORDER HISTORY
router.get("/customer/:phone/orders", authMiddleware, async (req, res) => {
  try {
    const { phone } = req.params;
    const userId = req.query.target_user_id || req.user.bizId;
    const uid = parseInt(userId);
    
    const dbRes = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 AND customer_number = $2 ORDER BY created_at DESC",
      [uid, phone]
    );
    res.json(dbRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADJUST CUSTOMER BALANCE OR POINTS (with reason logging)
router.post("/customers/adjust", authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.query.target_user_id || req.body?.target_user_id || req.user.bizId);
    const { phone, type, amount, points, reason } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: "Customer phone is required" });
    }
    if (!type || !['BALANCE_ADJUSTMENT', 'POINTS_ADJUSTMENT'].includes(type)) {
      return res.status(400).json({ error: "Valid adjustment type is required" });
    }
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "Reason for adjustment is required" });
    }

    const targetPhone = await findExistingCustomerNumber(userId, phone);

    // Check if customer_loyalty record exists, create if not
    const loyaltyRes = await pool.query(
      "SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
      [userId, targetPhone]
    );

    let loyalty;
    if (loyaltyRes.rows.length === 0) {
      const custRes = await pool.query("SELECT name FROM customers WHERE user_id = $1 AND number = $2", [userId, targetPhone]);
      const custName = custRes.rows[0]?.name || "Customer";
      
      const insertLoyalty = await pool.query(
        `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
         VALUES ($1, $2, $3, 0, 0.00, 0.00, NOW()) RETURNING *`,
        [userId, targetPhone, custName]
      );
      loyalty = insertLoyalty.rows[0];
    } else {
      loyalty = loyaltyRes.rows[0];
    }

    let updatedBalance = parseFloat(loyalty.balance || 0);
    let updatedPoints = parseInt(loyalty.points || 0);
    let changeAmount = 0;
    let changePoints = 0;

    if (type === 'BALANCE_ADJUSTMENT') {
      changeAmount = parseFloat(amount);
      if (isNaN(changeAmount) || changeAmount === 0) {
        return res.status(400).json({ error: "Valid adjustment amount is required" });
      }
      updatedBalance = updatedBalance + changeAmount;
    } else if (type === 'POINTS_ADJUSTMENT') {
      changePoints = parseInt(points);
      if (isNaN(changePoints) || changePoints === 0) {
        return res.status(400).json({ error: "Valid adjustment points is required" });
      }
      updatedPoints = Math.max(0, updatedPoints + changePoints);
    }

    // Update customer_loyalty
    const updateRes = await pool.query(
      `UPDATE customer_loyalty 
       SET balance = $1, points = $2, last_visit = NOW() 
       WHERE user_id = $3 AND customer_number = $4 RETURNING *`,
      [updatedBalance, updatedPoints, userId, targetPhone]
    );

    // Insert transaction record
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [userId, targetPhone, type, changeAmount, changePoints, reason]
    );

    res.json({
      success: true,
      loyalty: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PAY CUSTOMER DUE / BALANCE
router.post("/customers/pay-due", authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.query.target_user_id || req.body?.target_user_id || req.user.bizId);
    const { phone, amount, paymentMethod, reason } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: "Customer phone is required" });
    }
    const payAmt = parseFloat(amount);
    if (isNaN(payAmt) || payAmt <= 0) {
      return res.status(400).json({ error: "Valid payment amount is required" });
    }
    
    const targetPhone = await findExistingCustomerNumber(userId, phone);

    // Check if customer_loyalty record exists, create if not
    const loyaltyRes = await pool.query(
      "SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2",
      [userId, targetPhone]
    );

    let loyalty;
    if (loyaltyRes.rows.length === 0) {
      const custRes = await pool.query("SELECT name FROM customers WHERE user_id = $1 AND number = $2", [userId, targetPhone]);
      const custName = custRes.rows[0]?.name || "Customer";
      
      const insertLoyalty = await pool.query(
        `INSERT INTO customer_loyalty (user_id, customer_number, name, points, balance, total_spent, last_visit)
         VALUES ($1, $2, $3, 0, 0.00, 0.00, NOW()) RETURNING *`,
        [userId, targetPhone, custName]
      );
      loyalty = insertLoyalty.rows[0];
    } else {
      loyalty = loyaltyRes.rows[0];
    }

    const updatedBalance = parseFloat(loyalty.balance || 0) + payAmt;

    // Update customer_loyalty balance
    const updateRes = await pool.query(
      `UPDATE customer_loyalty 
       SET balance = $1, last_visit = NOW() 
       WHERE user_id = $2 AND customer_number = $3 RETURNING *`,
      [updatedBalance, userId, targetPhone]
    );

    // Insert transaction record for the payment
    const finalReason = reason || `Due Payment of ₹${payAmt.toFixed(2)} via ${paymentMethod || 'CASH'}`;
    await pool.query(
      `INSERT INTO customer_transactions (user_id, customer_number, type, amount, points, reason, created_at)
       VALUES ($1, $2, 'BILL_PAYMENT', $3, 0, $4, NOW())`,
      [userId, targetPhone, payAmt, finalReason]
    );

    res.json({
      success: true,
      loyalty: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET CUSTOMER HISTORY (Combined Orders and Transactions)
router.get("/customers/:phone/history", authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.query.target_user_id || req.body?.target_user_id || req.user.bizId);
    const { phone } = req.params;
    const phones = getPhoneVariations(phone);
    
    // Fetch orders (purchases)
    const ordersRes = await pool.query(
      `SELECT id, bill_no, order_reference, total_price, payment_method, payment_status, status, items, created_at,
              discount_amount, tax_cgst, tax_sgst, tip_amount, delivery_charge, service_charge, paid_amount, credit_amount
       FROM orders 
       WHERE user_id = $1 AND customer_number = ANY($2) 
       ORDER BY created_at DESC`,
      [userId, phones]
    );

    // Fetch ledger transactions (adjustments, prepayments, points)
    const transactionsRes = await pool.query(
      `SELECT id, type, amount, points, reason, created_at 
       FROM customer_transactions 
       WHERE user_id = $1 AND customer_number = ANY($2) 
       ORDER BY created_at DESC`,
      [userId, phones]
    );

    res.json({
      orders: ordersRes.rows,
      transactions: transactionsRes.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


