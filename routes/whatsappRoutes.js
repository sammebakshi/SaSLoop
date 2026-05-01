const express = require("express");
const router = express.Router();
const whatsappManager = require("../whatsappManager");
const authMiddleware = require("../middleware/authMiddleware");
const { requireWhatsAppAccess } = require("../middleware/authMiddleware");
const pool = require("../db");
const crypto = require("crypto");


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
    // Send to processing manager (Fire and forget to avoid Meta timeout retries)
    whatsappManager.handleMetaWebhook(payload).catch(err => console.error("ASYNC WEBHOOK ERROR:", err));
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

// ✅ Automatic Recharge (For Demo/Instant Flow)
router.post("/recharge-automatic", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    // Add credits to wallet
    const currentBal = await whatsappManager.getWalletCredits(req.user.id);
    const newBal = currentBal + parseInt(amount);

    await pool.query(
      "INSERT INTO app_wallets (user_id, balance) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET balance = app_wallets.balance + EXCLUDED.balance, updated_at = CURRENT_TIMESTAMP",
      [req.user.id, parseInt(amount)]
    );

    // Log the transaction
    await pool.query(
      "INSERT INTO recharge_requests (user_id, plan_amount, credits_requested, transaction_id, status) VALUES ($1, $2, $3, $4, 'APPROVED')",
      [req.user.id, 0, amount, "AUTO_" + Date.now()]
    );

    res.json({ success: true, newCredits: newBal });
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

// ============================================
// 🔐 SECURE WHATSAPP AUTHENTICATION (NEW)
// ============================================

// 1. Request a new login token
router.post("/auth/request", async (req, res) => {
  try {
    const { userId } = req.body; // The business ID
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // Generate a unique 5-character token (e.g., SA-123)
    const token = "SA-" + crypto.randomBytes(3).toString('hex').toUpperCase();
    
    await pool.query(
      "INSERT INTO pending_auths (token, user_id) VALUES ($1, $2)",
      [token, userId]
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("AUTH REQUEST ERROR:", err);
    res.status(500).json({ error: "Failed to initiate login" });
  }
});

// 2. Poll for authentication status
router.get("/auth/status/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const result = await pool.query(
      "SELECT phone, is_verified FROM pending_auths WHERE token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Token not found" });
    }

    const auth = result.rows[0];
    if (auth.is_verified) {
      // Once verified, delete it so it can't be reused
      await pool.query("DELETE FROM pending_auths WHERE token = $1", [token]);
      res.json({ success: true, verified: true, phone: auth.phone });
    } else {
      res.json({ success: true, verified: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Polling error" });
  }
});

// ============================================
// 🎙️ AI VOICE SALESMAN (TTS)
// ============================================
router.post("/voice-salesman", authMiddleware, async (req, res) => {
  try {
    const { text, to } = req.body;
    if (!text || !to) return res.status(400).json({ error: "Text and Recipient required" });

    // In a real app, we'd call ElevenLabs or OpenAI TTS here.
    // Mocking the generation of a high-quality voice note.
    const mockVoiceUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 

    // Send as an audio message via Meta
    await whatsappManager.sendOfficialMessage(to, { audioUrl: mockVoiceUrl }, req.user.id);
    
    res.json({ success: true, voiceUrl: mockVoiceUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
