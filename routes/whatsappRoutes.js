const express = require("express");
const router = express.Router();
const whatsappManager = require("../whatsappManager");
const authMiddleware = require("../middleware/authMiddleware");
const { requireWhatsAppAccess } = require("../middleware/authMiddleware");
const pool = require("../db");


// ============================================
// OFFICIAL META WEBHOOK VERIFICATION (GET)
// ============================================
router.get("/webhook", (req, res) => {
  // Meta verification token
  const verify_token = process.env.META_VERIFY_TOKEN || "sasloop_verify_token";

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("META WEBHOOK VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ============================================
// OFFICIAL META WEBHOOK INBOUND (POST)
// ============================================
router.post("/webhook", async (req, res) => {
  console.log("!!! RAW WEBHOOK CALL RECEIVED AT /api/whatsapp/webhook !!!");
  try {
    const payload = req.body;
    console.log("==> WEBHOOK HIT! Payload:", JSON.stringify(payload, null, 2));
    // Send to processing manager
    await whatsappManager.handleMetaWebhook(payload);
    res.status(200).send("EVENT_RECEIVED");
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.status(500).send("Server Error");
  }
});

// ============================================
// WALLET CREDIT SYSTEM (AiSensy Core Logic)
// ============================================
router.get("/wallet", authMiddleware, async (req, res) => {
  try {
     const credits = await whatsappManager.getWalletCredits(req.user.id);
     res.json({ credits });
  } catch(e) {
     res.status(500).json({ error: e.message });
  }
});

// ✅ GET Master Admin Payment Info for Recharge
router.get("/payment-info", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT upi_id as upi, bank_account as bank, ifsc_code as ifsc, qr_code_url FROM payment_settings LIMIT 1");
    res.json(result.rows[0] || { upi: "", bank: "", ifsc: "", qr_code_url: "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Submit Recharge Request
router.post("/recharge", authMiddleware, async (req, res) => {
  try {
    const { planAmount, credits, transactionId } = req.body;
    if (!planAmount || !credits || !transactionId) {
       return res.status(400).json({ error: "Missing required fields" });
    }

    await pool.query(
      "INSERT INTO recharge_requests (user_id, plan_amount, credits_requested, transaction_id, status) VALUES ($1, $2, $3, $4, 'PENDING')",
      [req.user.id, planAmount, credits, transactionId]
    );

    res.json({ success: true, message: "Recharge request submitted successfully. Awaiting approval." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get User's Recharge History
router.get("/recharge-history", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM recharge_requests WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/broadcast", authMiddleware, async (req, res) => {
  try {
     const { contacts, message } = req.body; 
     if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
         return res.status(400).json({ error: "Empty or invalid contact list." });
     }

     const cost = contacts.length; 
     const walletCheck = await whatsappManager.deductWalletCredits(req.user.id, cost);
     
     if (!walletCheck.success) {
         return res.status(400).json({ error: walletCheck.error });
     }

     // Trigger broadcast in background
     const senderId = `BC_${Date.now()}`;
     const { imageUrl, button } = req.body;

     contacts.forEach(async (contact) => {
         const personalizedMsg = message.replace(/\{\{name\}\}/gi, contact.name || "Customer");
         const payload = {
             message: personalizedMsg,
             imageUrl: imageUrl || null,
             button: button || null
         };
         await whatsappManager.sendOfficialMessage(contact.phone, payload, req.user.id, senderId);
     });

     res.json({ 
         message: `${contacts.length} messages queued successfully.`, 
         deducted: cost,
         remainingBal: walletCheck.newBalance
     });

  } catch(e) {
      console.error("BROADCAST ERROR:", e);
      res.status(500).json({ error: e.message });
  }
});

// ============================================
// SAAS PLATFORM CONFIGURATION
// ============================================
router.get("/config", authMiddleware, requireWhatsAppAccess, async (req, res) => {
  try {
    const targetId = req.query.target_user_id || req.user.id;
    const userRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [targetId]);
    res.json(userRes.rows[0] || {});
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/config", authMiddleware, requireWhatsAppAccess, async (req, res) => {
  try {
    const { meta_access_token, meta_phone_id, target_user_id } = req.body;
    const targetId = target_user_id || req.user.id;
    await pool.query(
      "UPDATE app_users SET meta_access_token = $1, meta_phone_id = $2 WHERE id = $3",
      [meta_access_token, meta_phone_id, targetId]
    );
    res.json({ success: true, message: "Configuration saved successfully" });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// 🤖 AI TAKEOVER (PAUSE BOT)
// ============================================
router.post("/chat/pause", authMiddleware, async (req, res) => {
  try {
    const { customerNumber, pause, target_user_id } = req.body;
    const finalUserId = target_user_id || req.user.id;
    await pool.query(
      "UPDATE conversation_sessions SET is_paused = $1 WHERE user_id = $2 AND customer_number = $3",
      [pause, finalUserId, customerNumber]
    );
    res.json({ success: true, is_paused: pause });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// 💬 MANUAL MESSAGE (HUMAN INTERVENTION)
// ============================================
router.post("/chat/send", authMiddleware, async (req, res) => {
  try {
    const { to, text, target_user_id } = req.body;
    const finalUserId = target_user_id || req.user.id;
    // Send the message via Meta API
    await whatsappManager.sendOfficialMessage(to, text, finalUserId);
    // Log it so it appears in the Live Chat history
    await whatsappManager.logChat(finalUserId, to, 'bot', text);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// 📊 LIVE AI INBOX — Chat History & Interface Status
// ============================================
router.get("/status", authMiddleware, async (req, res) => {
  try {
     res.json({ status: "CONNECTED" });
  } catch(e) {
     res.status(500).json({ error: e.message });
  }
});

router.get("/chats", authMiddleware, async (req, res) => {
  try {
    const impersonateId = req.query.target_user_id || req.user.id;
    const chats = await whatsappManager.getRecentChats(impersonateId);
    
    // Also return pause states for all active conversations
    const pauseRes = await pool.query(
      "SELECT customer_number, is_paused FROM conversation_sessions WHERE user_id = $1 AND is_paused = true",
      [impersonateId]
    );
    const pausedNumbers = pauseRes.rows.map(r => r.customer_number);
    
    res.json({ status: "CONNECTED", chats, pausedNumbers });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// 🔔 NOTIFICATION & BADGE COUNTS
// ============================================
router.get("/notif-counts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const chatCount = await pool.query(
      "SELECT COUNT(*) FROM chat_messages WHERE user_id = $1 AND role = 'customer' AND is_read = false",
      [userId]
    );
    const systemCount = await pool.query(
      "SELECT COUNT(*) FROM system_notifications WHERE user_id = $1 AND is_read = false",
      [userId]
    );
    res.json({
      chats: parseInt(chatCount.rows[0].count),
      notifications: parseInt(systemCount.rows[0].count)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/mark-read", authMiddleware, async (req, res) => {
  try {
    const { type, customerNumber } = req.body;
    const userId = req.user.id;
    if (type === 'chats') {
      if (customerNumber) {
        await pool.query("UPDATE chat_messages SET is_read = true WHERE user_id = $1 AND customer_number = $2", [userId, customerNumber]);
      } else {
        await pool.query("UPDATE chat_messages SET is_read = true WHERE user_id = $1", [userId]);
      }
    } else {
      await pool.query("UPDATE system_notifications SET is_read = true WHERE user_id = $1", [userId]);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
