const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");
const fs = require("fs");
const { scanMenuWithAI } = require("../utils/aiCatalogUtils");

// Helper to recursively resolve the root brand owner (parent_user_id)
const getBrandOwnerAndOutlet = async (userId) => {
    const userRes = await pool.query("SELECT parent_user_id, role FROM app_users WHERE id = $1", [userId]);
    if (userRes.rows.length === 0) {
        return { brandOwnerId: userId, outletId: userId };
    }
    const user = userRes.rows[0];
    
    if (!user.parent_user_id) {
        return { brandOwnerId: userId, outletId: userId };
    }
    
    const parentRes = await pool.query("SELECT parent_user_id, role FROM app_users WHERE id = $1", [user.parent_user_id]);
    if (parentRes.rows.length === 0) {
        return { brandOwnerId: user.parent_user_id, outletId: userId };
    }
    const parent = parentRes.rows[0];
    
    if (!parent.parent_user_id) {
        return { brandOwnerId: user.parent_user_id, outletId: userId };
    }
    
    return { brandOwnerId: parent.parent_user_id, outletId: user.parent_user_id };
};

// Image Upload
router.post("/upload", authMiddleware, async (req, res) => {
    try {
        console.log(`[UPLOAD] Starting upload for User ${req.user.id}`);
        if (!req.files || !req.files.image) {
            console.error(`[UPLOAD-FAIL] No files in request for User ${req.user.id}`);
            return res.status(400).json({ error: "No image uploaded" });
        }
        
        const file = req.files.image;
        console.log(`[UPLOAD] Received file: ${file.name} (${file.size} bytes)`);

        const ext = path.extname(file.name);
        const fileName = `item_${Date.now()}${ext}`;
        
        const uploadDir = path.join(process.cwd(), "uploads");
        const uploadPath = path.join(uploadDir, fileName);

        console.log(`[UPLOAD] Target path: ${uploadPath}`);

        if (!fs.existsSync(uploadDir)) {
            console.log(`[UPLOAD] Creating uploads directory...`);
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        file.mv(uploadPath, (err) => {
            if (err) {
                console.error(`[UPLOAD-MV-FAIL] Error moving file:`, err);
                return res.status(500).json({ error: err.message });
            }
            console.log(`[UPLOAD-SUCCESS] File saved at: ${uploadPath}`);
            res.json({ url: `/uploads/${fileName}` });
        });
    } catch (e) { 
        console.error(`[UPLOAD-CRASH]`, e);
        res.status(500).json({ error: e.message }); 
    }
});

// AI Menu Scanner
router.post("/ai-scan", authMiddleware, async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: "No image uploaded" });
        }
        
        const file = req.files.image;
        const uploadDir = path.join(process.cwd(), "uploads");
        const tmpPath = path.join(uploadDir, `tmp_scan_${Date.now()}.jpg`);
        
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        file.mv(tmpPath, async (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            try {
                const items = await scanMenuWithAI(tmpPath);
                fs.unlinkSync(tmpPath); // Cleanup
                res.json(items);
            } catch (aiErr) {
                if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
                res.status(500).json({ error: "AI Scan failed: " + aiErr.message });
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// GET all items for the user from the business items catalog
// Excludes option/variant items (item_type = '1' in outlet_menu_items)
// so they only appear inside option group dialogs, not as standalone menu tiles.
router.get("/", authMiddleware, async (req, res) => {
    try {
        const ownerId = req.user.bizId;
        const { brandOwnerId, outletId } = await getBrandOwnerAndOutlet(ownerId);

        // Check if there are any outlet menus defined for this user/outlet
        const activeMenuCheck = await pool.query(
            `SELECT id FROM outlet_menus WHERE outlet_id = $1 OR user_id = $2`,
            [outletId, brandOwnerId]
        );

        if (activeMenuCheck.rows.length === 0) {
            // Legacy / Fallback mode: No menus configured, return all business items
            const result = await pool.query(
                `SELECT bi.id, 
                        bi.user_id,
                        bi.code, 
                        bi.product_name, 
                        bi.product_name as name, 
                        bi.price, 
                        bi.availability, 
                        bi.image_url, 
                        bi.description, 
                        bi.tax_applicable,
                        bi.is_veg,
                        CASE WHEN bi.is_veg = true THEN 'veg' ELSE 'non-veg' END as food_type,
                        bi.stock_count,
                        bi.tax_percent,
                        bi.variants,
                        bi.modifiers,
                        bi.kot_category,
                        bi.hsn_code,
                        bi.barcode,
                        bi.cost_price,
                        bi.category,
                        bi.sub_category,
                        bi.sale_price_2,
                        bi.sale_price_3,
                        (
                          SELECT jsonb_object_agg(order_type, price)
                          FROM item_multiple_pricing
                          WHERE item_id = bi.id
                        ) as multiple_pricing
                 FROM business_items bi
                 WHERE bi.user_id = $1
                   AND NOT EXISTS (
                     SELECT 1 FROM outlet_menu_items omi
                     WHERE omi.short_code = bi.code
                       AND bi.code IS NOT NULL AND bi.code != ''
                       AND omi.item_type = '1'
                   )
                 ORDER BY bi.id ASC`,
                [brandOwnerId]
            );
            return res.json(result.rows);
        }

        // Menus exist, resolve all POS-default menus
        const posMenuRes = await pool.query(
            `SELECT id FROM outlet_menus 
             WHERE (outlet_id = $1 OR user_id = $2) AND is_pos_default = true`,
            [outletId, brandOwnerId]
        );

        if (posMenuRes.rows.length === 0) {
            // Menus exist but none is marked as POS default -> return empty catalog
            return res.json([]);
        }

        const menuIds = posMenuRes.rows.map(row => row.id);

        // Fetch items matching any of these menus
        // Prioritize joins on:
        // 1. omi.item_id = bi.id
        // 2. omi.short_code = bi.code
        // 3. omi.item_name = bi.product_name
        // Use DISTINCT ON (bi.id) to prevent duplicate items if shared across multiple active menus
        const result = await pool.query(
            `SELECT DISTINCT ON (bi.id)
                    bi.id, 
                    bi.user_id,
                    COALESCE(omi.short_code, bi.code) as code, 
                    omi.item_name as product_name, 
                    omi.item_name as name, 
                    omi.base_price as price, 
                    omi.is_active as availability, 
                    COALESCE(omi.image_url, bi.image_url) as image_url, 
                    COALESCE(omi.description, bi.description) as description, 
                    bi.tax_applicable,
                    CASE WHEN omi.food_type = 'veg' THEN true ELSE false END as is_veg,
                    omi.food_type,
                    omi.stock_qty as stock_count,
                    bi.tax_percent,
                    bi.variants,
                    bi.modifiers,
                    bi.kot_category,
                    COALESCE(omi.hsn_code, bi.hsn_code) as hsn_code,
                    bi.barcode,
                    bi.cost_price,
                    COALESCE(c.name, bi.category) as category,
                    bi.sub_category,
                    omi.sale_price_2,
                    omi.sale_price_3,
                    (
                      SELECT jsonb_object_agg(order_type, price)
                      FROM item_multiple_pricing
                      WHERE item_id = bi.id
                    ) as multiple_pricing
             FROM business_items bi
             JOIN outlet_menu_items omi ON omi.menu_id = ANY($2) AND (
               (omi.item_id = bi.id)
               OR (omi.item_id IS NULL AND omi.short_code IS NOT NULL AND omi.short_code != '' AND omi.short_code = bi.code)
               OR (omi.item_id IS NULL AND (omi.short_code IS NULL OR omi.short_code = '') AND omi.item_name = bi.product_name)
             )
             LEFT JOIN categories c ON omi.category_id = c.id
             WHERE bi.user_id = $1
               AND omi.item_type = '0'
             ORDER BY bi.id ASC, omi.id ASC`,
            [brandOwnerId, menuIds]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET categories for the business
router.get("/categories", authMiddleware, async (req, res) => {
    try {
        const ownerId = req.user.bizId;
        const { brandOwnerId, outletId } = await getBrandOwnerAndOutlet(ownerId);

        // Check if there are any outlet menus defined for this user/outlet
        const activeMenuCheck = await pool.query(
            `SELECT id FROM outlet_menus WHERE outlet_id = $1 OR user_id = $2`,
            [outletId, brandOwnerId]
        );

        if (activeMenuCheck.rows.length === 0) {
            // Legacy / Fallback mode: No menus configured, return all categories
            const result = await pool.query(
                `SELECT * FROM categories 
                 WHERE user_id = $1 
                 ORDER BY sorting_order ASC, name ASC`,
                [brandOwnerId]
            );
            return res.json(result.rows);
        }

        // Menus exist, resolve all POS-default menus
        const posMenuRes = await pool.query(
            `SELECT id FROM outlet_menus 
             WHERE (outlet_id = $1 OR user_id = $2) AND is_pos_default = true`,
            [outletId, brandOwnerId]
        );

        if (posMenuRes.rows.length === 0) {
            // Menus exist but none is marked as POS default -> return empty categories list
            return res.json([]);
        }

        const menuIds = posMenuRes.rows.map(row => row.id);

        // Fetch categories that are associated with the active items in any of the POS-default menus
        const result = await pool.query(
            `SELECT DISTINCT c.* 
             FROM categories c
             JOIN outlet_menu_items omi ON omi.category_id = c.id
             WHERE omi.menu_id = ANY($1) AND omi.item_type = '0' AND omi.is_active = true
             ORDER BY c.sorting_order ASC, c.name ASC`,
            [menuIds]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new item
router.post("/", authMiddleware, async (req, res) => {
    const { 
        code, product_name, category, sub_category, price, 
        availability, image_url, description, tax_applicable, 
        is_veg, stock_count, tax_percent, variants, modifiers, 
        kot_category, hsn_code, barcode, cost_price 
    } = req.body;
    try {
        const ownerId = req.user.bizId;
        const { brandOwnerId } = await getBrandOwnerAndOutlet(ownerId);
        const result = await pool.query(
            `INSERT INTO business_items (
                user_id, code, product_name, category, sub_category, 
                price, availability, image_url, description, tax_applicable, 
                is_veg, stock_count, tax_percent, variants, modifiers, 
                kot_category, hsn_code, barcode, cost_price
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
            [
                brandOwnerId, code, product_name, category, sub_category, 
                price, availability, image_url || null, description || null, 
                tax_applicable !== undefined ? tax_applicable : 1, is_veg || false, 
                stock_count !== undefined && stock_count !== '' && stock_count !== null ? parseInt(stock_count) : null,
                tax_percent || 0.00, 
                JSON.stringify(variants || []), 
                JSON.stringify(modifiers || []),
                kot_category || 'Main Kitchen',
                hsn_code || null,
                barcode || null,
                cost_price || 0.00
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE all items for user
router.delete("/clear", authMiddleware, async (req, res) => {
    try {
        const ownerId = req.user.bizId;
        const { brandOwnerId } = await getBrandOwnerAndOutlet(ownerId);
        const result = await pool.query("DELETE FROM business_items WHERE user_id = $1", [brandOwnerId]);
        res.json({ message: "Catalog cleared", count: result.rowCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE item
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const ownerId = req.user.bizId;
        const { brandOwnerId } = await getBrandOwnerAndOutlet(ownerId);
        await pool.query("DELETE FROM business_items WHERE id = $1 AND user_id = $2", [req.params.id, brandOwnerId]);
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Import bulk
router.post("/import", authMiddleware, async (req, res) => {
    const { items } = req.body; 
    const ownerId = req.user.bizId;
    const { brandOwnerId } = await getBrandOwnerAndOutlet(ownerId);
    console.log(`[IMPORT] User ${req.user.id} (BrandOwner: ${brandOwnerId}) attempting bulk import of ${items?.length} items`);
    
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid items format" });
    }

    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');
        let successCount = 0;
        for (const item of items) {
            if (!item.product_name) continue;
            await client.query(
                `INSERT INTO business_items (
                    user_id, code, product_name, category, sub_category, 
                    price, availability, image_url, description, tax_applicable,
                    tax_percent, kot_category, hsn_code
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [
                    brandOwnerId, item.code, item.product_name, item.category, 
                    item.sub_category, item.price, item.availability, 
                    item.image_url || null, item.description || null, 
                    item.tax_applicable !== undefined ? item.tax_applicable : 1,
                    item.tax_percent || 0.00,
                    item.kot_category || 'Main Kitchen',
                    item.hsn_code || null
                ]
            );
            successCount++;
        }
        await client.query('COMMIT');
        console.log(`[IMPORT] Success: ${successCount} items imported for User ${req.user.id}`);
        res.json({ message: "Import successful", count: successCount });
    } catch (err) {
        if (client) await client.query('ROLLBACK');
        console.error("[IMPORT] Error during bulk import:", err);
        res.status(500).json({ error: "Database error: " + err.message });
    } finally {
        if (client) client.release();
    }
});

// UPDATE item
router.put("/:id", authMiddleware, async (req, res) => {
    const { 
        code, product_name, category, sub_category, price, 
        availability, image_url, description, tax_applicable, 
        is_veg, stock_count, tax_percent, variants, modifiers, 
        kot_category, hsn_code, barcode, cost_price 
    } = req.body;
    try {
        const ownerId = req.user.bizId;
        const { brandOwnerId } = await getBrandOwnerAndOutlet(ownerId);
        const result = await pool.query(
            `UPDATE business_items SET 
                code=$1, product_name=$2, category=$3, sub_category=$4, 
                price=$5, availability=$6, image_url=$7, description=$8, 
                tax_applicable=$9, is_veg=$10, stock_count=$11,
                tax_percent=$12, variants=$13, modifiers=$14,
                kot_category=$15, hsn_code=$16, barcode=$17, cost_price=$18
            WHERE id=$19 AND user_id=$20 RETURNING *`,
            [
                code, product_name, category, sub_category, price, 
                availability, image_url, description, tax_applicable !== undefined ? tax_applicable : 1, 
                is_veg || false, stock_count !== undefined && stock_count !== '' && stock_count !== null ? parseInt(stock_count) : null,
                tax_percent || 0.00, 
                JSON.stringify(variants || []), 
                JSON.stringify(modifiers || []),
                kot_category || 'Main Kitchen',
                hsn_code || null,
                barcode || null,
                cost_price || 0.00,
                req.params.id, 
                brandOwnerId
            ]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Item not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

