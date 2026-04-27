const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");
const fs = require("fs");

// Image Upload
router.post("/upload", authMiddleware, async (req, res) => {
    try {
        if (!req.files || !req.files.image) return res.status(400).json({ error: "No image uploaded" });
        
        const file = req.files.image;
        const ext = path.extname(file.name);
        const fileName = `item_${Date.now()}${ext}`;
        
        const uploadDir = path.join(process.cwd(), "uploads");
        const uploadPath = path.join(uploadDir, fileName);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        file.mv(uploadPath, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ url: `/uploads/${fileName}` });
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET all items for the user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM business_items WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new item
router.post("/", authMiddleware, async (req, res) => {
    const { code, product_name, category, sub_category, price, availability, image_url, description, tax_applicable, is_veg, stock_count } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO business_items (user_id, code, product_name, category, sub_category, price, availability, image_url, description, tax_applicable, is_veg, stock_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
            [req.user.id, code, product_name, category, sub_category, price, availability, image_url || null, description || null, tax_applicable !== undefined ? tax_applicable : 1, is_veg || false, stock_count !== undefined && stock_count !== '' && stock_count !== null ? parseInt(stock_count) : null]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE all items for user
router.delete("/clear", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM business_items WHERE user_id = $1", [req.user.id]);
        res.json({ message: "Catalog cleared", count: result.rowCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE item
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await pool.query("DELETE FROM business_items WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Import bulk
router.post("/import", authMiddleware, async (req, res) => {
    const { items } = req.body; 
    console.log(`[IMPORT] User ${req.user.id} attempting bulk import of ${items?.length} items`);
    
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
                "INSERT INTO business_items (user_id, code, product_name, category, sub_category, price, availability, image_url, description, tax_applicable) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                [req.user.id, item.code, item.product_name, item.category, item.sub_category, item.price, item.availability, item.image_url || null, item.description || null, item.tax_applicable !== undefined ? item.tax_applicable : 1]
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
    const { code, product_name, category, sub_category, price, availability, image_url, description, tax_applicable, is_veg, stock_count } = req.body;
    try {
        const result = await pool.query(
            "UPDATE business_items SET code=$1, product_name=$2, category=$3, sub_category=$4, price=$5, availability=$6, image_url=$7, description=$8, tax_applicable=$9, is_veg=$10, stock_count=$11 WHERE id=$12 AND user_id=$13 RETURNING *",
            [code, product_name, category, sub_category, price, availability, image_url, description, tax_applicable !== undefined ? tax_applicable : 1, is_veg || false, stock_count !== undefined && stock_count !== '' && stock_count !== null ? parseInt(stock_count) : null, req.params.id, req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Item not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
