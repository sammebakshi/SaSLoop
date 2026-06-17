const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// --- RAW MATERIALS ---

// Get all raw materials for a business
router.get('/raw', authenticateToken, async (req, res) => {
    try {
        const businessId = req.user.businessId || req.user.id;
        const result = await pool.query(
            'SELECT * FROM inventory_raw WHERE business_id = $1 ORDER BY item_name ASC',
            [businessId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add/Update raw material
router.post('/raw', authenticateToken, async (req, res) => {
    const { id, item_name, unit, current_stock, min_stock, unit_price, category } = req.body;
    const businessId = req.user.businessId || req.user.id;

    try {
        if (id) {
            // Update
            const result = await pool.query(
                `UPDATE inventory_raw 
                 SET item_name=$1, unit=$2, current_stock=$3, min_stock=$4, unit_price=$5, category=$6, updated_at=NOW()
                 WHERE id=$7 AND business_id=$8 RETURNING *`,
                [item_name, unit, current_stock, min_stock, unit_price, category, id, businessId]
            );
            return res.json(result.rows[0]);
        } else {
            // Create
            const result = await pool.query(
                `INSERT INTO inventory_raw (business_id, item_name, unit, current_stock, min_stock, unit_price, category)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [businessId, item_name, unit, current_stock, min_stock, unit_price, category]
            );
            res.status(201).json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RECIPES (BOM) ---

// Get recipe for a menu item
router.get('/recipes/:menuItemId', authenticateToken, async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const result = await pool.query(
            `SELECT r.*, rw.item_name, rw.unit 
             FROM recipes r
             JOIN inventory_raw rw ON r.raw_item_id = rw.id
             WHERE r.menu_item_id = $1`,
            [menuItemId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save recipe (Delete old and insert new)
router.post('/recipes', authenticateToken, async (req, res) => {
    const { menu_item_id, ingredients } = req.body; // ingredients: [{raw_item_id, quantity}]
    const businessId = req.user.businessId || req.user.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Delete existing recipe
        await client.query('DELETE FROM recipes WHERE menu_item_id = $1', [menu_item_id]);

        // Insert new recipe steps
        for (const ing of ingredients) {
            await client.query(
                'INSERT INTO recipes (menu_item_id, raw_item_id, quantity) VALUES ($1, $2, $3)',
                [menu_item_id, ing.raw_item_id, ing.quantity]
            );
        }

        await client.query('COMMIT');
        res.json({ message: "Recipe updated successfully" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// --- VENDORS ---
router.get('/vendors', authenticateToken, async (req, res) => {
    try {
        const businessId = req.user.businessId || req.user.id;
        const result = await pool.query('SELECT * FROM vendors WHERE business_id = $1', [businessId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
