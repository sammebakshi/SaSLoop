const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

// Helper to determine business ID from token or query impersonation
const getBizId = (req) => {
    if (req.query.target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin') || req.user.role === 'brand_owner')) {
        return parseInt(req.query.target_user_id);
    }
    return req.user.businessId || req.user.bizId || req.user.id;
};

// ============================================================
// 1. SUMMARY & ANALYTICS OVERVIEW
// ============================================================
router.get('/summary', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        const [rawRes, alertRes, valRes, logRes] = await Promise.all([
            pool.query('SELECT COUNT(*) as total_items FROM inventory_raw WHERE biz_id = $1', [bizId]),
            pool.query('SELECT COUNT(*) as low_stock_count FROM inventory_raw WHERE biz_id = $1 AND current_stock <= min_stock', [bizId]),
            pool.query('SELECT COALESCE(SUM(current_stock * COALESCE(unit_cost, last_purchase_price, 0)), 0) as total_valuation FROM inventory_raw WHERE biz_id = $1', [bizId]),
            pool.query('SELECT COUNT(*) as log_count FROM inventory_logs WHERE biz_id = $1', [bizId])
        ]);

        res.json({
            total_items: parseInt(rawRes.rows[0]?.total_items || 0),
            low_stock_count: parseInt(alertRes.rows[0]?.low_stock_count || 0),
            total_valuation: parseFloat(valRes.rows[0]?.total_valuation || 0),
            log_count: parseInt(logRes.rows[0]?.log_count || 0)
        });
    } catch (err) {
        console.error("Inventory summary error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// 2. RAW MATERIALS CRUD & SEARCH
// ============================================================
router.get(['/raw', '/raw-materials'], authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        const result = await pool.query(
            `SELECT r.*, c.name as category_name, l.name as location_name, v.name as vendor_name
             FROM inventory_raw r
             LEFT JOIN inventory_rm_categories c ON r.category_id = c.id
             LEFT JOIN inventory_locations l ON r.location_id = l.id
             LEFT JOIN vendors v ON r.vendor_id = v.id
             WHERE r.biz_id = $1 ORDER BY r.item_name ASC`,
            [bizId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch raw materials error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post(['/raw', '/raw-materials'], authenticateToken, async (req, res) => {
    const { 
        id, item_name, sku_code, unit, current_stock, min_stock, 
        last_purchase_price, unit_cost, category, category_id, 
        location_id, vendor_id, hsn_code, gst_percent, yield_percent 
    } = req.body;
    const bizId = getBizId(req);

    try {
        if (id) {
            // Update
            const result = await pool.query(
                `UPDATE inventory_raw 
                 SET item_name=$1, sku_code=$2, unit=$3, current_stock=$4, min_stock=$5, 
                     last_purchase_price=$6, unit_cost=$7, category=$8, category_id=$9, 
                     location_id=$10, vendor_id=$11, hsn_code=$12, gst_percent=$13, 
                     yield_percent=$14, updated_at=NOW()
                 WHERE id=$15 AND biz_id=$16 RETURNING *`,
                [
                    item_name, sku_code || '', unit || 'Kg', parseFloat(current_stock || 0), parseFloat(min_stock || 0),
                    parseFloat(last_purchase_price || 0), parseFloat(unit_cost || last_purchase_price || 0), category || 'General',
                    category_id || null, location_id || null, vendor_id || null, hsn_code || '', parseFloat(gst_percent || 0),
                    parseFloat(yield_percent || 100), id, bizId
                ]
            );
            return res.json(result.rows[0]);
        } else {
            // Create
            const result = await pool.query(
                `INSERT INTO inventory_raw 
                 (biz_id, item_name, sku_code, unit, current_stock, min_stock, last_purchase_price, unit_cost, category, category_id, location_id, vendor_id, hsn_code, gst_percent, yield_percent)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
                [
                    bizId, item_name, sku_code || '', unit || 'Kg', parseFloat(current_stock || 0), parseFloat(min_stock || 0),
                    parseFloat(last_purchase_price || 0), parseFloat(unit_cost || last_purchase_price || 0), category || 'General',
                    category_id || null, location_id || null, vendor_id || null, hsn_code || '', parseFloat(gst_percent || 0),
                    parseFloat(yield_percent || 100)
                ]
            );
            res.status(201).json(result.rows[0]);
        }
    } catch (err) {
        console.error("Save raw material error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.delete(['/raw/:id', '/raw-materials/:id'], authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        await pool.query('DELETE FROM inventory_raw WHERE id = $1 AND biz_id = $2', [req.params.id, bizId]);
        res.json({ success: true, message: "Raw material deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// 3. RAW MATERIAL CATEGORIES
// ============================================================
router.get('/rm-categories', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        const result = await pool.query(
            `SELECT c.*, COUNT(r.id) as item_count 
             FROM inventory_rm_categories c 
             LEFT JOIN inventory_raw r ON r.category_id = c.id 
             WHERE c.biz_id = $1 
             GROUP BY c.id ORDER BY c.name ASC`,
            [bizId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/rm-categories', authenticateToken, async (req, res) => {
    const { id, name, description, is_active } = req.body;
    const bizId = getBizId(req);
    try {
        if (id) {
            const result = await pool.query(
                'UPDATE inventory_rm_categories SET name=$1, description=$2, is_active=$3 WHERE id=$4 AND biz_id=$5 RETURNING *',
                [name, description || '', is_active !== false, id, bizId]
            );
            return res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                'INSERT INTO inventory_rm_categories (biz_id, name, description, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
                [bizId, name, description || '', is_active !== false]
            );
            res.status(201).json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/rm-categories/:id', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        await pool.query('DELETE FROM inventory_rm_categories WHERE id = $1 AND biz_id = $2', [req.params.id, bizId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// 4. MEASUREMENT UNITS
// ============================================================
router.get('/rm-units', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        const result = await pool.query(
            'SELECT * FROM inventory_units WHERE biz_id = $1 ORDER BY name ASC',
            [bizId]
        );
        if (result.rows.length === 0) {
            // Default preset units
            const defaults = [
                { name: 'Kilogram', symbol: 'Kg', base_unit: 'Gram', conversion_factor: 1000 },
                { name: 'Gram', symbol: 'g', base_unit: 'Gram', conversion_factor: 1 },
                { name: 'Liter', symbol: 'L', base_unit: 'Ml', conversion_factor: 1000 },
                { name: 'Milliliter', symbol: 'ml', base_unit: 'Ml', conversion_factor: 1 },
                { name: 'Pieces', symbol: 'Pcs', base_unit: 'Pcs', conversion_factor: 1 },
                { name: 'Packet', symbol: 'Pkt', base_unit: 'Pcs', conversion_factor: 1 }
            ];
            for (const d of defaults) {
                await pool.query(
                    'INSERT INTO inventory_units (biz_id, name, symbol, base_unit, conversion_factor) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
                    [bizId, d.name, d.symbol, d.base_unit, d.conversion_factor]
                );
            }
            const newRes = await pool.query('SELECT * FROM inventory_units WHERE biz_id = $1 ORDER BY name ASC', [bizId]);
            return res.json(newRes.rows);
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/rm-units', authenticateToken, async (req, res) => {
    const { id, name, symbol, base_unit, conversion_factor } = req.body;
    const bizId = getBizId(req);
    try {
        if (id) {
            const result = await pool.query(
                'UPDATE inventory_units SET name=$1, symbol=$2, base_unit=$3, conversion_factor=$4 WHERE id=$5 AND biz_id=$6 RETURNING *',
                [name, symbol || name, base_unit || name, parseFloat(conversion_factor || 1), id, bizId]
            );
            return res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                'INSERT INTO inventory_units (biz_id, name, symbol, base_unit, conversion_factor) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [bizId, name, symbol || name, base_unit || name, parseFloat(conversion_factor || 1)]
            );
            res.status(201).json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/rm-units/:id', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        await pool.query('DELETE FROM inventory_units WHERE id = $1 AND biz_id = $2', [req.params.id, bizId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// 5. STORAGE LOCATIONS / WAREHOUSES
// ============================================================
router.get('/locations', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        const result = await pool.query('SELECT * FROM inventory_locations WHERE biz_id = $1 ORDER BY name ASC', [bizId]);
        if (result.rows.length === 0) {
            const defaults = ['Main Kitchen Store', 'Cold Storage Room', 'Dry Ingredients Vault', 'Bar & Beverage Pantry'];
            for (const d of defaults) {
                await pool.query('INSERT INTO inventory_locations (biz_id, name) VALUES ($1, $2)', [bizId, d]);
            }
            const updatedRes = await pool.query('SELECT * FROM inventory_locations WHERE biz_id = $1 ORDER BY name ASC', [bizId]);
            return res.json(updatedRes.rows);
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/locations', authenticateToken, async (req, res) => {
    const { id, name, code, description, is_active } = req.body;
    const bizId = getBizId(req);
    try {
        if (id) {
            const result = await pool.query(
                'UPDATE inventory_locations SET name=$1, code=$2, description=$3, is_active=$4 WHERE id=$5 AND biz_id=$6 RETURNING *',
                [name, code || '', description || '', is_active !== false, id, bizId]
            );
            return res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                'INSERT INTO inventory_locations (biz_id, name, code, description, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [bizId, name, code || '', description || '', is_active !== false]
            );
            res.status(201).json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/locations/:id', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        await pool.query('DELETE FROM inventory_locations WHERE id = $1 AND biz_id = $2', [req.params.id, bizId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// 6. VENDORS & SUPPLIERS
// ============================================================
router.get('/vendors', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        const result = await pool.query('SELECT * FROM vendors WHERE biz_id = $1 ORDER BY name ASC', [bizId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/vendors', authenticateToken, async (req, res) => {
    const { id, name, contact_person, phone, email, address, gst_number, opening_balance, payment_terms } = req.body;
    const bizId = getBizId(req);

    try {
        if (id) {
            const result = await pool.query(
                `UPDATE vendors 
                 SET name=$1, contact_person=$2, phone=$3, email=$4, address=$5, 
                     gst_number=$6, opening_balance=$7, payment_terms=$8 
                 WHERE id=$9 AND biz_id=$10 RETURNING *`,
                [name, contact_person || '', phone || '', email || '', address || '', gst_number || '', parseFloat(opening_balance || 0), payment_terms || 'Immediate', id, bizId]
            );
            return res.json(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO vendors (biz_id, name, contact_person, phone, email, address, gst_number, opening_balance, payment_terms) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [bizId, name, contact_person || '', phone || '', email || '', address || '', gst_number || '', parseFloat(opening_balance || 0), payment_terms || 'Immediate']
            );
            res.status(201).json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/vendors/:id', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        await pool.query('DELETE FROM vendors WHERE id = $1 AND biz_id = $2', [req.params.id, bizId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// 7. STOCK IN / PURCHASE ENTRY
// ============================================================
router.post(['/manual-stock-entry', '/manual-stock-in', '/stock-in'], authenticateToken, async (req, res) => {
    const { raw_item_id, quantity, unit, unit_price, vendor_id, reference_no, note } = req.body;
    const bizId = getBizId(req);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const qtyNum = parseFloat(quantity || 0);
        const priceNum = parseFloat(unit_price || 0);
        const totalCost = qtyNum * priceNum;

        // 1. Update Raw Material Stock & Last Purchase Price
        const updateRes = await client.query(
            `UPDATE inventory_raw 
             SET current_stock = current_stock + $1, 
                 last_purchase_price = $2, 
                 unit_cost = CASE WHEN $2 > 0 THEN $2 ELSE unit_cost END,
                 updated_at = NOW() 
             WHERE id = $3 AND biz_id = $4 RETURNING *`,
            [qtyNum, priceNum, raw_item_id, bizId]
        );

        if (updateRes.rows.length === 0) {
            throw new Error("Target raw material not found or unauthorized.");
        }

        // 2. Add Stock In Log
        const logRes = await client.query(
            `INSERT INTO inventory_logs 
             (biz_id, raw_item_id, type, quantity, unit, unit_price, total_cost, vendor_id, reference_no, note, created_by)
             VALUES ($1, $2, 'STOCK_IN', $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [bizId, raw_item_id, qtyNum, unit || updateRes.rows[0].unit, priceNum, totalCost, vendor_id || null, reference_no || '', note || 'Purchase stock inward', req.user.id]
        );

        await client.query('COMMIT');
        res.status(201).json({ success: true, item: updateRes.rows[0], log: logRes.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Stock in error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// ============================================================
// 8. STOCK OUT / WASTAGE / SPOILAGE ENTRY
// ============================================================
router.post(['/manual-stock-out', '/stock-out'], authenticateToken, async (req, res) => {
    const { raw_item_id, quantity, unit, reason, note } = req.body;
    const bizId = getBizId(req);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const qtyNum = parseFloat(quantity || 0);

        // 1. Deduct Stock
        const updateRes = await client.query(
            `UPDATE inventory_raw 
             SET current_stock = GREATEST(0, current_stock - $1), updated_at = NOW() 
             WHERE id = $2 AND biz_id = $3 RETURNING *`,
            [qtyNum, raw_item_id, bizId]
        );

        if (updateRes.rows.length === 0) {
            throw new Error("Target raw material not found.");
        }

        const logType = reason === 'Wastage' ? 'WASTAGE' : (reason === 'Damage' ? 'DAMAGE' : 'STOCK_OUT');

        // 2. Record Log
        const logRes = await client.query(
            `INSERT INTO inventory_logs 
             (biz_id, raw_item_id, type, quantity, unit, unit_price, total_cost, note, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                bizId, raw_item_id, logType, qtyNum, unit || updateRes.rows[0].unit, 
                parseFloat(updateRes.rows[0].unit_cost || 0), 
                qtyNum * parseFloat(updateRes.rows[0].unit_cost || 0), 
                note || reason || 'Manual stock deduction', req.user.id
            ]
        );

        await client.query('COMMIT');
        res.status(201).json({ success: true, item: updateRes.rows[0], log: logRes.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Stock out error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// ============================================================
// 9. INVENTORY LOGS & AUDIT TRAIL
// ============================================================
router.get('/logs', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        const result = await pool.query(
            `SELECT l.*, r.item_name, v.name as vendor_name, u.name as user_name
             FROM inventory_logs l
             LEFT JOIN inventory_raw r ON l.raw_item_id = r.id
             LEFT JOIN vendors v ON l.vendor_id = v.id
             LEFT JOIN app_users u ON l.created_by = u.id
             WHERE l.biz_id = $1 ORDER BY l.created_at DESC LIMIT 100`,
            [bizId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// 10. RECIPES (BILL OF MATERIALS - BOM)
// ============================================================
router.get('/recipes/:menuItemId', authenticateToken, async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const result = await pool.query(
            `SELECT r.*, rw.item_name, rw.unit, rw.unit_cost, rw.last_purchase_price
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

router.post('/recipes', authenticateToken, async (req, res) => {
    const { menu_item_id, ingredients } = req.body; // ingredients: [{raw_item_id, quantity, unit}]
    const bizId = getBizId(req);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Delete existing recipe
        await client.query('DELETE FROM recipes WHERE menu_item_id = $1', [menu_item_id]);

        // Insert new recipe steps
        if (Array.isArray(ingredients)) {
            for (const ing of ingredients) {
                if (!ing.raw_item_id || !ing.quantity) continue;
                await client.query(
                    'INSERT INTO recipes (menu_item_id, raw_item_id, quantity, unit) VALUES ($1, $2, $3, $4)',
                    [menu_item_id, ing.raw_item_id, parseFloat(ing.quantity), ing.unit || 'Kg']
                );
            }
        }

        await client.query('COMMIT');
        res.json({ success: true, message: "Recipe updated successfully" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// ============================================================
// 9. INVENTORY TRACKING CHANNEL SETTINGS
// ============================================================
router.get('/settings', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        const result = await pool.query('SELECT track_inventory, settings FROM restaurants WHERE user_id = $1 OR id = $1', [bizId]);
        if (result.rows.length === 0) {
            return res.json({
                track_inventory: true,
                track_inventory_pos: true,
                track_inventory_online: true,
                track_inventory_whatsapp: true
            });
        }
        const biz = result.rows[0];
        let settings = {};
        if (typeof biz.settings === 'string') {
            try { settings = JSON.parse(biz.settings); } catch (e) {}
        } else if (biz.settings) {
            settings = biz.settings;
        }

        const globalTrack = biz.track_inventory !== false;

        res.json({
            track_inventory: globalTrack,
            track_inventory_pos: settings.track_inventory_pos !== undefined ? !!settings.track_inventory_pos : globalTrack,
            track_inventory_online: settings.track_inventory_online !== undefined ? !!settings.track_inventory_online : globalTrack,
            track_inventory_whatsapp: settings.track_inventory_whatsapp !== undefined ? !!settings.track_inventory_whatsapp : globalTrack
        });
    } catch (err) {
        console.error("Fetch inventory settings error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/settings', authenticateToken, async (req, res) => {
    try {
        const bizId = getBizId(req);
        const { track_inventory, track_inventory_pos, track_inventory_online, track_inventory_whatsapp } = req.body;

        const currentRes = await pool.query('SELECT track_inventory, settings FROM restaurants WHERE user_id = $1 OR id = $1', [bizId]);
        if (currentRes.rows.length === 0) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        const currentBiz = currentRes.rows[0];
        let currentSettings = {};
        if (typeof currentBiz.settings === 'string') {
            try { currentSettings = JSON.parse(currentBiz.settings); } catch (e) {}
        } else if (currentBiz.settings) {
            currentSettings = currentBiz.settings;
        }

        const updatedSettings = {
            ...currentSettings,
            track_inventory_pos: !!track_inventory_pos,
            track_inventory_online: !!track_inventory_online,
            track_inventory_whatsapp: !!track_inventory_whatsapp
        };

        await pool.query(
            `UPDATE restaurants 
             SET track_inventory = $1, settings = $2 
             WHERE user_id = $3 OR id = $3`,
            [!!track_inventory, JSON.stringify(updatedSettings), bizId]
        );

        res.json({
            success: true,
            track_inventory: !!track_inventory,
            track_inventory_pos: !!track_inventory_pos,
            track_inventory_online: !!track_inventory_online,
            track_inventory_whatsapp: !!track_inventory_whatsapp
        });
    } catch (err) {
        console.error("Save inventory settings error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
