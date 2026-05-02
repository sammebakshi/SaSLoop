const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET ALL TABLES FOR POS
router.get("/tables", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            "SELECT * FROM pos_tables WHERE user_id = $1 ORDER BY table_name ASC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tables" });
    }
});

// ✅ SAVE/UPDATE TABLE POSITIONS (BULK)
router.post("/tables/sync", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { tables } = req.body; // Array of { id, x_pos, y_pos, status, table_name }
        console.log(`Syncing ${tables.length} tables for user ${userId}`);
        for (const table of tables) {
            if (table.id) {
                console.log(`Updating table ${table.id}`);
                await pool.query(
                    "UPDATE pos_tables SET x_pos = $1, y_pos = $2, status = $3, table_name = $4, updated_at = NOW() WHERE id = $5 AND user_id = $6",
                    [table.x_pos, table.y_pos, table.status, table.table_name, table.id, userId]
                );
            } else {
                console.log(`Inserting new table ${table.table_name}`);
                await pool.query(
                    "INSERT INTO pos_tables (user_id, table_name, x_pos, y_pos, status) VALUES ($1, $2, $3, $4, $5)",
                    [userId, table.table_name, table.x_pos, table.y_pos, table.status || 'AVAILABLE']
                );
            }
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to sync tables" });
    }
});

// ✅ UPDATE SINGLE TABLE STATUS
router.put("/tables/:tableName/status", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { tableName } = req.params;
        const { status } = req.body;

        await pool.query(
            "UPDATE pos_tables SET status = $1, updated_at = NOW() WHERE user_id = $2 AND table_name = $3",
            [status, userId, tableName]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update table status" });
    }
});

// ✅ DELETE TABLE
router.delete("/tables/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await pool.query("DELETE FROM pos_tables WHERE id = $1 AND user_id = $2", [id, userId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete table" });
    }
});

module.exports = router;
