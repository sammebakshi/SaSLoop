const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const { logAudit } = require("../utils/auditLogger");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("👉 LOGIN HIT");
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: "Email/Username and password are required" });
    }

    let queryStr = "SELECT * FROM app_users WHERE email = $1";
    
    try {
      // Check if username column exists dynamically to support email/username login
      const colCheck = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='app_users' AND column_name='username'");
      if (colCheck.rows.length > 0) {
        queryStr = "SELECT * FROM app_users WHERE email = $1 OR username = $1";
      } else {
        // Fallback to first_name if the username column isn't created yet
        queryStr = "SELECT * FROM app_users WHERE email = $1 OR first_name = $1";
      }
    } catch (e) {
      console.warn("Could not check for username column schema.");
    }

    const result = await pool.query(queryStr, [identifier]);

    console.log("DB RESULT:", result.rows);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    
    // 🛡️ DASHBOARD ACCESS GATING: Prevent POS/Staff users from accessing the SaSLoop Dashboard
    const restrictedRoles = ['staff', 'cashier', 'waiter', 'delivery_boy', 'POS Billing', 'OrderHub', 'terminal'];
    const isStaff = restrictedRoles.includes(user.role) || restrictedRoles.includes(user.user_type);
    
    if (user.web_access === false || (isStaff && user.web_access !== true)) {
        console.warn(`🚨 [DASHBOARD BLOCKED] User ${user.identifier || user.email} (Role: ${user.role}) attempted login without web_access permissions.`);
        return res.status(401).json({ error: "User not found" });
    }

    if (user.status && user.status !== 'active') {
        return res.status(403).json({ error: "Your account is inactive. Please contact the administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const bizId = user.parent_user_id || user.id;
    const token = jwt.sign(
      { id: user.id, bizId, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "10h" }
    );

    await logAudit(user.id, 'LOGIN', { ip: req.ip, userAgent: req.get('user-agent') });

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      username: user.username,
      business_name: user.business_name,
      brand_name: user.brand_name,
      admin_permissions: user.admin_permissions || {},
      token
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    // Return specific message for database connection issues
    if (err.message && (err.message.includes("ECONNREFUSED") || err.message.includes("password authentication failed"))) {
        return res.status(500).json({ error: "Database Connection Error: Please check your .env settings and ensure Postgres is running on your server." });
    }
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// CHANGE PASSWORD
router.post("/change-password", authMiddleware, async (req, res) => {
  console.log("👉 CHANGE PWD HIT", req.body, "User:", req.user);
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // from authMiddleware

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Please provide old and new password" });
    }

    // Get current user password
    const result = await pool.query("SELECT password FROM app_users WHERE id = $1", [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentPwd = result.rows[0].password;

    // Plain text comparison as per the existing login logic
    // Verify current (hashed) password
    const isMatch = await bcrypt.compare(oldPassword, currentPwd);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    // Hash and update new password
    const hashedNew = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE app_users SET password = $1 WHERE id = $2", [hashedNew, userId]);
    
    await logAudit(userId, 'CHANGE_PASSWORD', { userId });

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("🔥 CHANGE PWD ERROR:", err);
    res.status(500).json({ error: "Server error updating password" });
  }
});

// 1️⃣ RECOVERY: GET SECURITY QUESTION
router.post("/get-recovery-question", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query("SELECT security_question FROM app_users WHERE email = $1", [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    res.json({ question: result.rows[0].security_question || "What is your secret code?" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 2️⃣ RECOVERY: VERIFY ANSWER & RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    const result = await pool.query("SELECT id, security_answer FROM app_users WHERE email = $1", [email]);

    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = result.rows[0];
    if (user.security_answer?.toLowerCase() !== answer.toLowerCase()) {
      return res.status(400).json({ error: "Incorrect security answer." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE app_users SET password = $1 WHERE id = $2", [hashed, user.id]);

    await logAudit(user.id, 'RECOVERY_RESET', { email });

    res.json({ message: "Password reset successful. You can now login." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔐 POS LOGIN (Staff with PIN or Password fallback)
router.post("/pos-login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`尝试 POS 登录: ${username}`);
        
        if (!username || !password) return res.status(400).json({ error: "Username and PIN/Password are required" });

        // 1. Find user by username
        const result = await pool.query(
            "SELECT id, email, role, password as hashed_password, pos_pin, parent_user_id, name, business_name, status FROM app_users WHERE username = $1 OR email = $1",
            [username]
        );

        if (result.rows.length === 0) {
            console.log(`❌ POS 登录失败: 用户 ${username} 未找到`);
            return res.status(401).json({ error: "User not found" });
        }

        const user = result.rows[0];
        console.log(`👤 用户发现: ${user.email}, Role: ${user.role}`);

        if (user.status !== 'active') {
            console.log(`🚫 用户状态非活跃: ${user.status}`);
            return res.status(403).json({ error: "Account is inactive" });
        }

        // Restrict POS login to non-backoffice accounts
        const backofficeRoles = ['user', 'brand_owner', 'master_admin'];
        if (backofficeRoles.includes(user.role) || (user.role && user.role.startsWith('admin'))) {
            console.log(`🚫 POS 登录拒绝: 角色 ${user.role} 仅限后台访问`);
            return res.status(403).json({ error: "Access denied. Backoffice accounts cannot access the POS." });
        }

        // 2. Check PIN (fast literal match) or Hashed Password (secure fallback)
        let isMatch = false;
        
        // Priority 1: Match against pos_pin
        if (user.pos_pin && password === user.pos_pin) {
            console.log("✅ PIN 匹配成功");
            isMatch = true;
        } 
        // Priority 2: Fallback to main password check
        else {
            console.log("🔄 正在尝试主密码匹配...");
            isMatch = await bcrypt.compare(password, user.hashed_password);
            console.log(`🔐 密码匹配结果: ${isMatch}`);
        }

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid PIN or Password" });
        }

        const bizId = user.parent_user_id || user.id;

        const token = jwt.sign(
            { id: user.id, bizId, role: user.role, isPOS: true },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "7d" }
        );

        console.log("✨ POS 登录成功，正在生成 Token");
        res.json({ token, user: { ...user, bizId, hashed_password: undefined } });
    } catch (err) {
        console.error("🔥 POS LOGIN ERROR:", err);
        res.status(500).json({ error: "Server error during POS login: " + err.message });
    }
});

// GET PROFILE (Includes Business DNA for Universal POS)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        let userId = req.user.id;
        const { target_user_id } = req.query;

        // Impersonation support: fetch requested outlet profile if role permits
        if (target_user_id && target_user_id !== "global" && target_user_id !== "undefined") {
            if (req.user.role === 'master_admin' || req.user.role === 'brand_owner' || req.user.role?.startsWith('admin')) {
                userId = parseInt(target_user_id);
            }
        }

        const userResult = await pool.query(
            "SELECT id, name, email, role, phone, whatsapp_number, address, username, business_name, business_type, created_at, parent_user_id, staff_permissions FROM app_users WHERE id = $1",
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const user = userResult.rows[0];
        const parentId = user.parent_user_id || userId;

        let parentUser = null;
        if (user.parent_user_id) {
            const parentResult = await pool.query(
                "SELECT phone, whatsapp_number, address, business_name FROM app_users WHERE id = $1",
                [user.parent_user_id]
            );
            if (parentResult.rows.length > 0) {
                parentUser = parentResult.rows[0];
            }
        }
        
        const bizResult = await pool.query(
            "SELECT * FROM restaurants WHERE user_id = $1",
            [parentId]
        );

        let businessDetails = bizResult.rows[0] || null;
        let businessName = user.business_name || parentUser?.business_name || businessDetails?.name || null;
        let address = user.address || parentUser?.address || businessDetails?.address || null;
        
        // Prioritize parent user's business contact info if this is a sub-account/staff user
        let phone = user.phone;
        let whatsappNumber = user.whatsapp_number;
        if (user.parent_user_id && parentUser) {
            if (parentUser.phone) phone = parentUser.phone;
            if (parentUser.whatsapp_number) whatsappNumber = parentUser.whatsapp_number;
        }

        // If it's a staff/child user and we still don't have a business name, fetch from parent
        if (!businessName && req.user.bizId && req.user.bizId !== userId) {
            const parentResult = await pool.query("SELECT business_name FROM app_users WHERE id = $1", [req.user.bizId]);
            businessName = parentResult.rows[0]?.business_name;
        }

        const profileData = {
            ...user,
            phone: phone,
            whatsapp_number: whatsappNumber,
            address: address,
            business_name: businessName,
            business_details: businessDetails,
            business_type: businessDetails?.business_type || user.business_type || 'Restaurant'
        };
        console.log("👤 [PROFILE REQUEST] User profile fetched:", {
            id: profileData.id,
            email: profileData.email,
            role: profileData.role,
            business_name: profileData.business_name,
            phone: profileData.phone,
            whatsapp_number: profileData.whatsapp_number
        });
        res.json(profileData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// PUT/UPDATE PROFILE
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        let userId = req.user.id;
        const { target_user_id, name, email, address, password, phone, whatsapp_number, logo_url, settings } = req.body;

        // Impersonation support: update requested outlet profile if role permits
        if (target_user_id && target_user_id !== "global" && target_user_id !== "undefined") {
            if (req.user.role === 'master_admin' || req.user.role === 'brand_owner' || req.user.role?.startsWith('admin')) {
                userId = parseInt(target_user_id);
            }
        }

        // 1. Update app_users details
        let updateQuery = `
            UPDATE app_users 
            SET name = COALESCE($1, name), 
                business_name = COALESCE($1, business_name),
                email = COALESCE($2, email),
                address = COALESCE($3, address),
                phone = COALESCE($4, phone),
                whatsapp_number = COALESCE($5, whatsapp_number)
        `;
        let params = [name, email, address, phone, whatsapp_number];

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery += `, password = $6 WHERE id = $7 RETURNING id, name, email, role, phone, whatsapp_number, address, username, business_name`;
            params.push(hashedPassword, userId);
        } else {
            updateQuery += ` WHERE id = $6 RETURNING id, name, email, role, phone, whatsapp_number, address, username, business_name`;
            params.push(userId);
        }

        const userResult = await pool.query(updateQuery, params);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found to update" });
        }

        const updatedUser = userResult.rows[0];

        // 2. Keep the restaurants table in sync
        const bizCheck = await pool.query("SELECT id FROM restaurants WHERE user_id = $1", [userId]);
        if (bizCheck.rows.length > 0) {
            let bizUpdateQuery = `
                UPDATE restaurants 
                SET name = COALESCE($1, name),
                    address = COALESCE($2, address),
                    phone = COALESCE($3, phone),
                    notification_email = COALESCE($4, notification_email)
            `;
            let bizParams = [name, address, phone, email];
            let paramIndex = 5;

            if (logo_url !== undefined) {
                bizUpdateQuery += `, logo_url = $${paramIndex}`;
                bizParams.push(logo_url);
                paramIndex++;
            }
            if (settings !== undefined) {
                const settingsJson = typeof settings === 'string' ? settings : JSON.stringify(settings);
                bizUpdateQuery += `, settings = $${paramIndex}`;
                bizParams.push(settingsJson);
                paramIndex++;
            }
            bizUpdateQuery += ` WHERE user_id = $${paramIndex}`;
            bizParams.push(userId);
            await pool.query(bizUpdateQuery, bizParams);
        } else {
            // If they don't have a restaurants row yet, create one!
            const settingsJson = settings !== undefined ? (typeof settings === 'string' ? settings : JSON.stringify(settings)) : '{}';
            await pool.query(
                "INSERT INTO restaurants (user_id, name, address, phone, notification_email, logo_url, settings) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [userId, name, address, phone, email, logo_url || '', settingsJson]
            );
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update profile: " + err.message });
    }
});


// GET MY OUTLETS (For Context Switcher)
router.get("/my-outlets", authMiddleware, async (req, res) => {
    try {
        const { id, role } = req.user;
        let query = "";
        let params = [];

        if (role === 'master_admin') {
            query = "SELECT id, business_name, name, brand_name, username, owner_id FROM app_users WHERE role = 'user' ORDER BY business_name ASC";
        } else if (role === 'brand_owner') {
            query = "SELECT id, business_name, name, brand_name, username, owner_id FROM app_users WHERE (owner_id = $1 OR parent_user_id = $1) AND role = 'user' ORDER BY business_name ASC";
            params = [id];
        } else if (role === 'admin') {
            query = "SELECT id, business_name, name, brand_name, username, owner_id FROM app_users WHERE (created_by = $1 OR parent_user_id = $1) AND role = 'user' ORDER BY business_name ASC";
            params = [id];
        } else if (role === 'user') {
            query = "SELECT id, business_name, name, brand_name, username, owner_id FROM app_users WHERE id = $1";
            params = [id];
        } else {
            return res.json([]);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch outlets" });
    }
});

module.exports = router;