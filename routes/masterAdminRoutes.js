const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");
const { logAudit } = require("../utils/auditLogger");
const { 
  requireMasterAdmin, 
  requireAdminOrMaster, 
  requireCanCreateAccounts 
} = require("../middleware/authMiddleware");

// ✅ TEST ROUTE (VERY IMPORTANT)
router.get("/test", (req, res) => {
  res.send("MASTER ROUTE WORKING ✅");
});

// ✅ GET ALL USERS + ADMINS (with permissions)
router.get("/users", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, first_name, last_name, email, role, status, 
              parentage, dob, phone, address, business_type, security_question, security_answer, password, gst_number, business_name,
              meta_access_token, meta_phone_id, meta_account_id,
              admin_permissions, created_by, assigned_admin_id, subscription_plan, subscription_expires_at
       FROM app_users 
       ORDER BY id DESC`
    );
    res.json(result.rows);
    console.log(`[API] Returning ${result.rows.length} users to Master Dashboard.`);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET STATS (BUSINESSES COUNT)
router.get("/stats", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const businessQuery = await pool.query("SELECT COUNT(*) AS total FROM restaurants");
    res.json({ totalBusinesses: parseInt(businessQuery.rows[0].total) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ CREATE USER / ADMIN
router.post("/create-user", authMiddleware, requireCanCreateAccounts, async (req, res) => {
  console.log("Create user request body:", req.body);
  try {
    const {
      first_name, last_name, username, parentage, dob, email, password, phone, address,
      role, security_question, security_answer, business_type, gst_number, business_name,
      // Admin permissions (only used when role starts with 'admin')
      admin_permissions,
      // Who is creating this account (passed from frontend)
      created_by,
      subscription_plan,
      subscription_expires_at
    } = req.body;

    if (role === "master_admin") {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (username) {
       const userCheck = await pool.query("SELECT id FROM app_users WHERE username = $1", [username]);
       if (userCheck.rows.length > 0) {
          return res.status(400).json({ error: "Username is already taken" });
       }
    }

    if (email) {
       const emailCheck = await pool.query("SELECT id FROM app_users WHERE email = $1", [email]);
       if (emailCheck.rows.length > 0) {
          return res.status(400).json({ error: "Email address is already mapped to an account" });
       }
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    // Build admin_permissions object for admin roles
    const permissionsJson = (role && role.startsWith('admin') && admin_permissions)
      ? JSON.stringify(admin_permissions)
      : JSON.stringify({ can_create_accounts: false, can_view_only: false, can_manage_subscriptions: false, full_access: role === 'admin_full' });

    const newUser = await pool.query(
      `INSERT INTO app_users 
      (first_name, last_name, username, parentage, dob, email, password, phone, address, role, 
       security_question, security_answer, business_type, gst_number, business_name, 
       admin_permissions, created_by, status, subscription_plan, subscription_expires_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'active',$18,$19)
      RETURNING id`,
      [
        first_name, last_name, username || null, parentage || null,
        dob && dob !== "" ? dob : null,
        email, hashedPassword, phone, address, role,
        security_question, security_answer,
        business_type || null, gst_number || null, business_name || null,
        permissionsJson,
        created_by || null,
        subscription_plan || 'free',
        subscription_expires_at || null
      ]
    );

    await logAudit(req.user.id, 'CREATE_USER', { targetUserId: newUser.rows[0].id, role });
    res.json({ message: "User/Admin created successfully" });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ TOGGLE STATUS
router.put("/users/:id/toggle", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      "SELECT status FROM app_users WHERE id = $1",
      [id]
    );

    const newStatus =
      user.rows[0].status === "active" ? "inactive" : "active";

    await pool.query(
      "UPDATE app_users SET status = $1 WHERE id = $2",
      [newStatus, id]
    );

    await logAudit(req.user.id, 'TOGGLE_STATUS', { targetUserId: id, newStatus });
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE USER
router.delete("/users/:id", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Safety check to ensure we don't delete the only master_admin or current user
    const userRoleQuery = await pool.query("SELECT role FROM app_users WHERE id = $1", [id]);
    if (userRoleQuery.rows.length > 0 && userRoleQuery.rows[0].role === 'master_admin') {
       return res.status(403).json({ error: "Cannot delete a master admin" });
    }

    await pool.query("DELETE FROM app_users WHERE id = $1", [id]);
    await logAudit(req.user.id, 'DELETE_USER', { deletedUserId: id });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ EDIT USER / ADMIN
router.put("/users/:id/edit", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      first_name, last_name, username, parentage, dob, email, role, business_type, gst_number, business_name, phone, address,
      meta_access_token, meta_phone_id, meta_account_id,
      subscription_plan, subscription_expires_at,
      admin_permissions
    } = req.body;

    const userRoleQuery = await pool.query("SELECT role FROM app_users WHERE id = $1", [id]);
    if (userRoleQuery.rows.length > 0 && userRoleQuery.rows[0].role === 'master_admin') {
       return res.status(403).json({ error: "Cannot edit a master admin" });
    }

    if (username) {
       const userCheck = await pool.query("SELECT id FROM app_users WHERE username = $1 AND id != $2", [username, id]);
       if (userCheck.rows.length > 0) {
          return res.status(400).json({ error: "Username is already taken by another account" });
       }
    }

    if (email) {
       const emailCheck = await pool.query("SELECT id FROM app_users WHERE email = $1 AND id != $2", [email, id]);
       if (emailCheck.rows.length > 0) {
          return res.status(400).json({ error: "Email address is already mapped to another account" });
       }
    }

    await pool.query(
      `UPDATE app_users SET 
        first_name=$1, last_name=$2, username=$3, parentage=$4, dob=$5, email=$6, role=$7, 
        business_type=$8, gst_number=$9, business_name=$10, phone=$11, address=$12,
        meta_access_token=$13, meta_phone_id=$14, meta_account_id=$15, 
        subscription_plan=$16, subscription_expires_at=$17, admin_permissions=$18
      WHERE id=$19`,
      [
        first_name, last_name, username, parentage, dob, email, role, business_type, gst_number, business_name, phone, address,
        meta_access_token, meta_phone_id, meta_account_id, 
        subscription_plan, subscription_expires_at || null, admin_permissions, id
      ]
    );

    await logAudit(req.user.id, 'EDIT_USER', { targetUserId: id });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ RESET PASSWORD
router.put("/users/:id/reset-password", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Safety check
    const userRoleQuery = await pool.query("SELECT role FROM app_users WHERE id = $1", [id]);
    if (userRoleQuery.rows.length > 0 && userRoleQuery.rows[0].role === 'master_admin') {
       return res.status(403).json({ error: "Cannot reset password of a master admin" });
    }

    // Generate random 8 char password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < 8; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE app_users SET password = $1 WHERE id = $2", [hashed, id]);

    await logAudit(req.user.id, 'RESET_PASSWORD', { targetUserId: id });
    res.json({ message: "Password reset successful", newPassword });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
// ✅ ADMIN-SCOPED ROUTES
// Admins only see users they created (created_by = admin's ID)
// ============================================================

// ✅ TOP-UP CREDITS
router.post("/users/:id/credits", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    await pool.query("UPDATE app_users SET broadcast_credits = COALESCE(broadcast_credits, 0) + $1 WHERE id = $2", [amount, id]);
    
    await logAudit(req.user.id, 'CREDIT_TOPUP', { targetUserId: id, amount });
    res.json({ success: true, message: `Topped up ${amount} credits for user ${id}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ FETCH AUDIT LOGS
router.get("/audit-logs", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const dbRes = await pool.query(`
      SELECT al.*, u.username, u.email 
      FROM audit_logs al
      JOIN app_users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 1000
    `);
    res.json(dbRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/master/admin/my-users — used by AdminPanel
router.get("/admin/my-users", authMiddleware, async (req, res) => {
  try {
    // The admin ID comes from the authenticated token
    const adminId = req.user.id;

    const result = await pool.query(
      `SELECT id, username, first_name, last_name, email, role, status, 
              phone, business_type, business_name, gst_number, created_at,
              meta_phone_id, admin_permissions
       FROM app_users 
       WHERE created_by = $1 AND role = 'user'
       ORDER BY id DESC`,
      [adminId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ SYSTEM HEALTH DATA
router.get("/system-health", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM app_users) as total_users,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM business_items) as total_items,
        (SELECT COUNT(*) FROM conversation_sessions) as active_sessions,
        (SELECT COUNT(*) FROM support_tickets WHERE status='open') as open_tickets,
        (SELECT COUNT(*) FROM audit_logs) as total_logs
    `);
    
    const recentErrors = await pool.query(`
       SELECT * FROM audit_logs WHERE action LIKE '%ERROR%' ORDER BY created_at DESC LIMIT 5
    `);

    res.json({
       stats: stats.rows[0],
       recentErrors: recentErrors.rows,
       serverUptime: process.uptime(),
       dbStatus: 'CONNECTED'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FLUSH ALL SESSIONS (Emergency Maintenance)
router.post("/system/flush-sessions", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
     await pool.query("DELETE FROM conversation_sessions");
     await logAudit(req.user.id, 'SYSTEM_MAINTENANCE', { type: 'FLUSH_SESSIONS' });
     res.json({ message: "All AI sessions have been purged. Bots will restart on next message." });
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
});

// ✅ SYSTEM PAYMENT CONFIG
router.post("/config/payment", authMiddleware, requireMasterAdmin, async (req, res) => {
  try {
    const { upi, bank, ifsc, qr_code_url } = req.body;
    const check = await pool.query("SELECT id FROM payment_settings LIMIT 1");
    if (check.rows.length === 0) {
       await pool.query(
         "INSERT INTO payment_settings (upi_id, bank_account, ifsc_code, qr_code_url) VALUES ($1, $2, $3, $4)",
         [upi, bank, ifsc, qr_code_url]
       );
    } else {
       await pool.query(
         "UPDATE payment_settings SET upi_id = $1, bank_account = $2, ifsc_code = $3, qr_code_url = $4, updated_at = CURRENT_TIMESTAMP",
         [upi, bank, ifsc, qr_code_url]
       );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/config/payment", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT upi_id as upi, bank_account as bank, ifsc_code as ifsc, qr_code_url FROM payment_settings LIMIT 1");
    if (result.rows.length > 0) {
       res.json(result.rows[0]);
    } else {
       res.json({ upi: "", bank: "", ifsc: "", qr_code_url: "" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET RECHARGE REQUESTS (Master Admin & Admin)
router.get("/recharge-requests", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    let query = `
      SELECT rr.*, u.username, u.email, u.name 
      FROM recharge_requests rr
      JOIN app_users u ON rr.user_id = u.id
      ORDER BY rr.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ APPROVE RECHARGE REQUEST
router.post("/recharge-requests/:id/approve", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the request details
    const requestRes = await pool.query("SELECT * FROM recharge_requests WHERE id = $1 AND status = 'PENDING'", [id]);
    if (requestRes.rows.length === 0) {
       return res.status(404).json({ error: "Recharge request not found or already processed" });
    }
    const request = requestRes.rows[0];

    // Add credits to user
    await pool.query(
      "UPDATE app_users SET broadcast_credits = COALESCE(broadcast_credits, 0) + $1 WHERE id = $2",
      [request.credits_requested, request.user_id]
    );

    // Mark as approved
    await pool.query("UPDATE recharge_requests SET status = 'APPROVED', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);

    await logAudit(req.user.id, 'RECHARGE_APPROVED', { requestId: id, targetUserId: request.user_id, amount: request.credits_requested });
    
    res.json({ success: true, message: `Recharge approved. ${request.credits_requested} credits added.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ REJECT RECHARGE REQUEST
router.post("/recharge-requests/:id/reject", authMiddleware, requireAdminOrMaster, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the request details
    const requestRes = await pool.query("SELECT * FROM recharge_requests WHERE id = $1 AND status = 'PENDING'", [id]);
    if (requestRes.rows.length === 0) {
       return res.status(404).json({ error: "Recharge request not found or already processed" });
    }
    const request = requestRes.rows[0];

    // Mark as rejected
    await pool.query("UPDATE recharge_requests SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);

    await logAudit(req.user.id, 'RECHARGE_REJECTED', { requestId: id, targetUserId: request.user_id });
    
    res.json({ success: true, message: "Recharge request rejected." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;