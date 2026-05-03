const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// 1. GET ALL DELIVERY PARTNERS FOR BUSINESS
router.get("/partners", authMiddleware, async (req, res) => {
    try {
        const { target_user_id } = req.query;
        let userId = req.user.id;
        if (target_user_id && (req.user.role === 'master_admin' || req.user.role?.startsWith('admin'))) {
            userId = target_user_id;
        }

        const dbRes = await pool.query(
            "SELECT * FROM delivery_partners WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        res.json(dbRes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// 2. ADD NEW DELIVERY PARTNER (Integrated with App Users)
router.post("/partners", authMiddleware, async (req, res) => {
    try {
        const { name, phone, username, password } = req.body;
        const businessOwnerId = req.user.id;

        if (!name || !phone) return res.status(400).json({ error: "Name and Phone required" });

        // 1. GLOBAL IDENTITY CHECK
        const exists = await pool.query(
            "SELECT id FROM app_users WHERE phone = $1 OR username = $2",
            [phone, username || phone]
        );
        if (exists.rows.length > 0) {
            return res.status(400).json({ error: "This phone or username is already registered in SaSLoop" });
        }

        // 2. Create the Rider Account in app_users
        const riderUser = await pool.query(
            "INSERT INTO app_users (name, phone, username, password, role, parent_user_id, status) VALUES ($1, $2, $3, $4, 'rider', $5, 'active') RETURNING id",
            [name, phone, username || phone, password || 'rider123', businessOwnerId]
        );

        // 3. Create the Rider Profile
        const dbRes = await pool.query(
            "INSERT INTO delivery_partners (user_id, name, phone) VALUES ($1, $2, $3) RETURNING *",
            [riderUser.rows[0].id, name, phone]
        );
        res.json(dbRes.rows[0]);
    } catch (err) {
        console.error("Rider Creation Error:", err.message);
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

// 3. DELETE DELIVERY PARTNER
router.delete("/partners/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await pool.query("DELETE FROM delivery_partners WHERE id = $1 AND user_id = $2", [id, userId]);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// 4. ASSIGN ORDER TO RIDER
router.put("/assign", authMiddleware, async (req, res) => {
    try {
        const { orderId, riderId } = req.body;
        const userId = req.user.id;

        // Verify ownership
        const orderCheck = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [orderId, userId]);
        if (orderCheck.rows.length === 0) return res.status(403).json({ error: "Unauthorized" });

        await pool.query("UPDATE orders SET rider_id = $1, status = 'DISPATCHED' WHERE id = $2", [riderId, orderId]);
        
        // Mark rider as busy (optional, but let's keep it available for now)
        // await pool.query("UPDATE delivery_partners SET status = 'busy' WHERE id = $1", [riderId]);

        res.json({ message: "Rider assigned and order dispatched" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// 5. UPDATE RIDER LOCATION (Public/Rider - will be called from Rider App)
router.post("/location", async (req, res) => {
    try {
        const { riderId, orderId, lat, lng } = req.body;
        
        if (!riderId || !lat || !lng) return res.status(400).json({ error: "Incomplete data" });

        // Update last known location
        await pool.query(
            "UPDATE delivery_partners SET last_lat = $1, last_lng = $2, updated_at = NOW() WHERE id = $3",
            [lat, lng, riderId]
        );

        // Store in location history if orderId is present
        if (orderId) {
            await pool.query(
                "INSERT INTO rider_locations (rider_id, order_id, lat, lng) VALUES ($1, $2, $3, $4)",
                [riderId, orderId, lat, lng]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
