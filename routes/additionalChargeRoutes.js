const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// Helper: normalize DB row to frontend-expected shape
function normalizeCharge(row) {
    if (!row) return row;
    return {
        ...row,
        // Frontend expects 'value' and 'type'; DB stores 'amount' and 'charge_type'
        value: row.amount !== undefined ? row.amount : row.value,
        type: row.charge_type || row.type || 'percent',
        apply_on_order_types: row.applicable_on || row.apply_on_order_types || 'All Channels',
    };
}

// GET all additional charges
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
            SELECT ac.*, u.business_name as outlet_name 
            FROM additional_charges ac
            LEFT JOIN app_users u ON ac.outlet_id = u.id
            WHERE ac.user_id = $1
        `;
        const params = [ownerId];
        
        if (outletId) {
            query += " AND (ac.outlet_id = $2 OR ac.outlet_id IS NULL)";
            params.push(outletId);
        } else {
            query += " AND ac.outlet_id IS NULL";
        }
        
        query += " ORDER BY ac.name ASC";
        const result = await pool.query(query, params);
        res.json(result.rows.map(normalizeCharge));
    } catch (err) {
        console.error("🔥 GET ADDITIONAL CHARGES ERROR:", err);
        res.status(500).json({ error: "Failed to fetch additional charges" });
    }
});

// CREATE additional charge
router.post("/", authMiddleware, async (req, res) => {
    let { name, value, amount, type, charge_type, apply_on_order_types, applicable_on, outlet_id, is_active } = req.body;
    const ownerId = req.user.bizId || req.user.id;
    if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
        outlet_id = req.user.id;
    }

    // Accept both frontend names (value/type) and DB names (amount/charge_type)
    const finalAmount = parseFloat(amount || value) || 0;
    const finalChargeType = charge_type || type || 'percent';
    const finalApplicableOn = applicable_on || apply_on_order_types || 'All Channels';

    try {
        const result = await pool.query(
            `INSERT INTO additional_charges (user_id, name, amount, charge_type, applicable_on, outlet_id, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [ownerId, name, finalAmount, finalChargeType, finalApplicableOn, outlet_id || null, is_active !== undefined ? !!is_active : true]
        );
        res.json(normalizeCharge(result.rows[0]));
    } catch (err) {
        console.error("🔥 CREATE ADDITIONAL CHARGE ERROR:", err);
        res.status(500).json({ error: "Failed to create additional charge" });
    }
});

// UPDATE additional charge
router.put("/:id", authMiddleware, async (req, res) => {
    let { name, value, amount, type, charge_type, apply_on_order_types, applicable_on, outlet_id, is_active } = req.body;
    const ownerId = req.user.bizId || req.user.id;
    if ((!outlet_id || outlet_id === 'null' || outlet_id === 'undefined' || outlet_id === 'global') && req.user.role === "user") {
        outlet_id = req.user.id;
    }

    const finalAmount = parseFloat(amount || value) || 0;
    const finalChargeType = charge_type || type || 'percent';
    const finalApplicableOn = applicable_on || apply_on_order_types || 'All Channels';

    try {
        const result = await pool.query(
            `UPDATE additional_charges 
             SET name = $1, amount = $2, charge_type = $3, applicable_on = $4, outlet_id = $5, is_active = $6 
             WHERE id = $7 AND user_id = $8 RETURNING *`,
            [name, finalAmount, finalChargeType, finalApplicableOn, outlet_id || null, is_active !== undefined ? !!is_active : true, req.params.id, ownerId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Additional charge not found" });
        }
        res.json(normalizeCharge(result.rows[0]));
    } catch (err) {
        console.error("🔥 UPDATE ADDITIONAL CHARGE ERROR:", err);
        res.status(500).json({ error: "Failed to update additional charge" });
    }
});

// DELETE additional charge
router.delete("/:id", authMiddleware, async (req, res) => {
    const ownerId = req.user.bizId || req.user.id;

    try {
        const result = await pool.query(
            `DELETE FROM additional_charges WHERE id = $1 AND user_id = $2 RETURNING *`,
            [req.params.id, ownerId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Additional charge not found" });
        }
        res.json({ success: true, message: "Additional charge purged successfully" });
    } catch (err) {
        console.error("🔥 DELETE ADDITIONAL CHARGE ERROR:", err);
        res.status(500).json({ error: "Failed to delete additional charge" });
    }
});

module.exports = router;
