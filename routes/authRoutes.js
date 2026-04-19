const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "10h" }
    );

    await logAudit(user.id, 'LOGIN', { ip: req.ip, userAgent: req.get('user-agent') });

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
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

module.exports = router;