const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// Helper: normalize DB row to frontend-expected shape
function normalizeDiscount(row) {
    if (!row) return row;
    return {
        ...row,
        value: row.rate !== undefined ? parseFloat(row.rate) : row.value,
        type: row.discount_type || row.type || 'percent'
    };
}

// GET all discounts
router.get("/", authMiddleware, async (req, res) => {
    let rawOutletId = req.query.outlet_id || req.query.target_user_id;
    const ownerId = req.user.bizId || req.user.id;
    
    if ((!rawOutletId || rawOutletId === 'null' || rawOutletId === 'undefined' || rawOutletId === 'global') && req.user.role === "user") {
        rawOutletId = req.user.id;
    }
    
    let outletId = null;
    if (rawOutletId && rawOutletId !== "global" && rawOutletId !== "null" && rawOutletId !== "undefined") {
        outletId = parseInt(rawOutletId);
    }

    try {
        let query = `
            SELECT d.*, u.business_name as outlet_name 
            FROM discounts d
            LEFT JOIN app_users u ON d.outlet_id = u.id
            WHERE (d.user_id = $1 OR d.user_id = (SELECT parent_user_id FROM app_users WHERE id = $1) OR d.user_id IN (SELECT id FROM app_users WHERE parent_user_id = $1))
        `;
        const params = [ownerId];
        
        if (outletId) {
            query += " AND (d.outlet_id = $2 OR d.outlet_id IS NULL)";
            params.push(outletId);
        }
        
        query += " ORDER BY d.name ASC";
        const result = await pool.query(query, params);
        res.json(result.rows.map(normalizeDiscount));
    } catch (err) {
        console.error("🔥 GET DISCOUNTS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch discounts" });
    }
});

// CREATE discount
router.post("/", authMiddleware, async (req, res) => {
    let { name, value, type, outlet_id, is_active } = req.body;
    const ownerId = req.user.bizId || req.user.id;
    if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
        outlet_id = req.user.id;
    }

    try {
        const result = await pool.query(
            `INSERT INTO discounts (user_id, name, rate, discount_type, outlet_id, is_active)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [ownerId, name, parseFloat(value) || 0, type || 'percent', outlet_id || null, is_active !== undefined ? !!is_active : true]
        );
        res.json(normalizeDiscount(result.rows[0]));
    } catch (err) {
        console.error("🔥 CREATE DISCOUNT ERROR:", err);
        res.status(500).json({ error: "Failed to create discount" });
    }
});

// UPDATE discount
router.put("/:id", authMiddleware, async (req, res) => {
    let { name, value, type, outlet_id, is_active } = req.body;
    const ownerId = req.user.bizId || req.user.id;
    if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
        outlet_id = req.user.id;
    }

    try {
        const result = await pool.query(
            `UPDATE discounts 
             SET name = $1, rate = $2, discount_type = $3, outlet_id = $4, is_active = $5 
             WHERE id = $6 AND user_id = $7 RETURNING *`,
            [name, parseFloat(value) || 0, type || 'percent', outlet_id || null, is_active !== undefined ? !!is_active : true, req.params.id, ownerId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Discount protocol not found" });
        }
        res.json(normalizeDiscount(result.rows[0]));
    } catch (err) {
        console.error("🔥 UPDATE DISCOUNT ERROR:", err);
        res.status(500).json({ error: "Failed to update discount" });
    }
});

// DELETE discount
router.delete("/:id", authMiddleware, async (req, res) => {
    const ownerId = req.user.bizId || req.user.id;

    try {
        const result = await pool.query(
            `DELETE FROM discounts WHERE id = $1 AND user_id = $2 RETURNING *`,
            [req.params.id, ownerId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Discount protocol not found" });
        }
        res.json({ success: true, message: "Discount protocol purged successfully" });
    } catch (err) {
        console.error("🔥 DELETE DISCOUNT ERROR:", err);
        res.status(500).json({ error: "Failed to delete discount" });
    }
});

module.exports = router;
