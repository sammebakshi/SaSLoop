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
    
    // Log to file for debugging
    const fs = require("fs");
    const path = require("path");
    const logDir = path.join(__dirname, "..", "scratch");
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    const logPath = path.join(logDir, "webhook_debug.log");
    const logLine = `[${new Date().toISOString()}] HIT:\n${JSON.stringify(payload, null, 2)}\n\n`;
    fs.appendFileSync(logPath, logLine, "utf8");

    // Send to processing manager (Fire and forget to avoid Meta timeout retries)
    whatsappManager.handleMetaWebhook(payload).catch(err => {
      console.error("ASYNC WEBHOOK ERROR:", err);
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] ERROR: ${err.message}\n\n`, "utf8");
    });
    res.status(200).send("EVENT_RECEIVED");
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    try {
      const fs = require("fs");
      const path = require("path");
      fs.appendFileSync(path.join(__dirname, "..", "scratch", "webhook_debug.log"), `[${new Date().toISOString()}] SYNC ERROR: ${err.message}\n\n`, "utf8");
    } catch(e){}
    res.status(500).send("Server Error");
  }
});

// ============================================
// WALLET CREDIT SYSTEM (AiSensy Core Logic)
// ============================================
router.get("/wallet", authMiddleware, async (req, res) => {
  try {
     const finalUserId = req.user.bizId || req.user.id;
     const credits = await whatsappManager.getWalletCredits(finalUserId);
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

    const finalUserId = req.user.bizId || req.user.id;
    await pool.query(
      "INSERT INTO recharge_requests (user_id, plan_amount, credits_requested, transaction_id, status) VALUES ($1, $2, $3, $4, 'PENDING')",
      [finalUserId, planAmount, credits, transactionId]
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

    const finalUserId = req.user.bizId || req.user.id;
    // Add credits to wallet
    const currentBal = await whatsappManager.getWalletCredits(finalUserId);
    const newBal = currentBal + parseInt(amount);

    // Update broadcast_credits in app_users
    await pool.query(
      "UPDATE app_users SET broadcast_credits = COALESCE(broadcast_credits, 0) + $1 WHERE id = $2",
      [parseInt(amount), finalUserId]
    );

    // Log the transaction
    await pool.query(
      "INSERT INTO recharge_requests (user_id, plan_amount, credits_requested, transaction_id, status) VALUES ($1, $2, $3, $4, 'APPROVED')",
      [finalUserId, 0, amount, "AUTO_" + Date.now()]
    );

    res.json({ success: true, newCredits: newBal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get User's Recharge History
router.get("/recharge-history", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const result = await pool.query(
      "SELECT * FROM recharge_requests WHERE user_id = $1 ORDER BY created_at DESC",
      [finalUserId]
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

     const finalUserId = req.user.bizId || req.user.id;
     const cost = contacts.length; 
     const walletCheck = await whatsappManager.deductWalletCredits(finalUserId, cost);
     
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
         await whatsappManager.sendOfficialMessage(contact.phone, payload, finalUserId, senderId);
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
    const targetId = req.query.target_user_id || req.user.bizId || req.user.id;
    const userRes = await pool.query("SELECT meta_access_token, meta_phone_id, meta_account_id FROM app_users WHERE id = $1", [targetId]);
    res.json(userRes.rows[0] || {});
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/config", authMiddleware, requireWhatsAppAccess, async (req, res) => {
  try {
    const { meta_access_token, meta_phone_id, meta_account_id, target_user_id } = req.body;
    const targetId = target_user_id || req.user.bizId || req.user.id;
    await pool.query(
      "UPDATE app_users SET meta_access_token = $1, meta_phone_id = $2, meta_account_id = $3 WHERE id = $4",
      [meta_access_token, meta_phone_id, meta_account_id || null, targetId]
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
    const finalUserId = target_user_id || req.user.bizId || req.user.id;
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
    const finalUserId = target_user_id || req.user.bizId || req.user.id;
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
     const axios = require("axios");
     const targetId = req.query.target_user_id || req.user.bizId || req.user.id;
     const userRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [targetId]);
     let { meta_access_token: token, meta_phone_id: phoneId } = userRes.rows[0] || {};
     
     if (!token || !phoneId) {
        return res.json({ connected: false, status: "NOT_CONFIGURED" });
     }
     
     // Test with Meta Graph API
     try {
        const testRes = await axios.get(`https://graph.facebook.com/v21.0/${phoneId.trim()}`, {
           headers: { "Authorization": `Bearer ${token.trim()}` }
        });
        if (testRes.status === 200) {
            return res.json({ 
               connected: true, 
               status: "CONNECTED", 
               verified_name: testRes.data.verified_name,
               display_phone_number: testRes.data.display_phone_number
            });
        }
     } catch (metaErr) {
        console.error("Meta API Verification Failed:", metaErr.response?.data || metaErr.message);
        return res.json({ 
           connected: false, 
           status: "DISCONNECTED", 
           error: metaErr.response?.data?.error?.message || metaErr.message 
        });
     }
     
     res.json({ connected: false, status: "DISCONNECTED" });
  } catch(e) {
     res.status(500).json({ error: e.message });
  }
});

// ✅ SEND TEST WHATSAPP MESSAGE
router.post("/test-send", authMiddleware, async (req, res) => {
  try {
     const { phone, target_user_id } = req.body;
     if (!phone) return res.status(400).json({ error: "Phone number is required" });
     
     const finalUserId = target_user_id || req.user.bizId || req.user.id;
     
     // Send test message
     const text = `🚀 *SaSLoop WhatsApp API Test!* \n━━━━━━━━━━━━━━\nYour WhatsApp API integration is connected and working perfectly. \n\nTimestamp: ${new Date().toLocaleString()} 📅`;
     const result = await whatsappManager.sendOfficialMessage(phone, text, finalUserId);
     
     if (result.success) {
         res.json({ success: true, message: "Test message sent successfully!" });
     } else {
         res.status(400).json({ error: result.error || "Failed to send message" });
     }
  } catch (e) {
     res.status(500).json({ error: e.message });
  }
});

router.get("/chats", authMiddleware, async (req, res) => {
  try {
    const impersonateId = req.query.target_user_id || req.user.bizId || req.user.id;
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
    const bizId = req.user.bizId || req.user.id;
    const chatCount = await pool.query(
      "SELECT COUNT(*) FROM chat_messages WHERE user_id = $1 AND role = 'customer' AND is_read = false",
      [bizId]
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
    const bizId = req.user.bizId || req.user.id;
    if (type === 'chats') {
      if (customerNumber) {
        await pool.query("UPDATE chat_messages SET is_read = true WHERE user_id = $1 AND customer_number = $2", [bizId, customerNumber]);
      } else {
        await pool.query("UPDATE chat_messages SET is_read = true WHERE user_id = $1", [bizId]);
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

    const finalUserId = req.user.bizId || req.user.id;
    // Send as an audio message via Meta
    await whatsappManager.sendOfficialMessage(to, { audioUrl: mockVoiceUrl }, finalUserId);
    
    res.json({ success: true, voiceUrl: mockVoiceUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// 📝 WHATSAPP TEMPLATES CRUD (LIVE DATA)
// ============================================
router.get("/templates", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const result = await pool.query(
      `SELECT id, name, category, language, header_type as "headerType", 
              header_text as "headerText", body, footer as "footerText", 
              buttons, status, to_char(created_at, 'Mon DD, YYYY, HH:MI AM') as date 
       FROM whatsapp_templates 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [finalUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync templates from Meta to local database
router.post("/templates/sync-from-meta", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const userRes = await pool.query("SELECT meta_access_token, meta_account_id FROM app_users WHERE id = $1", [finalUserId]);
    const { meta_access_token: token, meta_account_id: wabaId } = userRes.rows[0] || {};

    if (!token || !wabaId) {
      return res.status(400).json({ error: "WhatsApp Business Account ID (WABA ID) is not configured. Go to WhatsApp Connect settings and add your WABA ID." });
    }

    const axios = require("axios");
    const response = await axios.get(
      `https://graph.facebook.com/v21.0/${wabaId}/message_templates`,
      { headers: { Authorization: `Bearer ${token.trim()}` } }
    );

    const metaTemplates = response.data.data || [];

    for (const tpl of metaTemplates) {
      let headerType = "NONE";
      let headerText = null;
      let bodyText = "";
      let footerText = null;
      const buttons = [];

      if (tpl.components) {
        for (const comp of tpl.components) {
          if (comp.type === "HEADER") {
            headerType = comp.format === "IMAGE" ? "IMAGE" : "TEXT";
            headerText = comp.text || null;
          } else if (comp.type === "BODY") {
            bodyText = comp.text || "";
          } else if (comp.type === "FOOTER") {
            footerText = comp.text || null;
          } else if (comp.type === "BUTTONS" && comp.buttons) {
            for (const btn of comp.buttons) {
              if (btn.type === "URL") {
                buttons.push({ type: "URL", text: btn.text, url: btn.url });
              } else if (btn.type === "PHONE_NUMBER") {
                buttons.push({ type: "PHONE", text: btn.text, phone: btn.phone_number });
              } else {
                buttons.push({ type: "QUICK_REPLY", text: btn.text });
              }
            }
          }
        }
      }

      // Check if template exists locally
      const checkRes = await pool.query(
        "SELECT id FROM whatsapp_templates WHERE user_id = $1 AND name = $2",
        [finalUserId, tpl.name]
      );

      if (checkRes.rows.length > 0) {
        await pool.query(
          `UPDATE whatsapp_templates 
           SET category = $1, language = $2, header_type = $3, header_text = $4, 
               body = $5, footer = $6, buttons = $7, status = $8
           WHERE id = $9`,
          [
            tpl.category,
            tpl.language,
            headerType,
            headerText,
            bodyText,
            footerText,
            JSON.stringify(buttons),
            tpl.status,
            checkRes.rows[0].id
          ]
        );
      } else {
        await pool.query(
          `INSERT INTO whatsapp_templates 
             (user_id, name, category, language, header_type, header_text, body, footer, buttons, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            finalUserId,
            tpl.name,
            tpl.category,
            tpl.language,
            headerType,
            headerText,
            bodyText,
            footerText,
            JSON.stringify(buttons),
            tpl.status
          ]
        );
      }
    }

    // Return the updated template list
    const result = await pool.query(
      `SELECT id, name, category, language, header_type as "headerType", 
              header_text as "headerText", body, footer as "footerText", 
              buttons, status, to_char(created_at, 'Mon DD, YYYY, HH:MI AM') as date 
       FROM whatsapp_templates 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [finalUserId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Template sync error:", err.response?.data?.error?.message || err.message);
    res.status(500).json({ error: err.response?.data?.error?.message || err.message });
  }
});

router.post("/templates", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const { name, category, language, headerType, headerText, bodyText, footerText, buttons } = req.body;
    
    // Save to local database first
    const result = await pool.query(
      `INSERT INTO whatsapp_templates (user_id, name, category, language, header_type, header_text, body, footer, buttons, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING')
       ON CONFLICT (user_id, name)
       DO UPDATE SET category = EXCLUDED.category, language = EXCLUDED.language, header_type = EXCLUDED.header_type,
                     header_text = EXCLUDED.header_text, body = EXCLUDED.body, footer = EXCLUDED.footer, buttons = EXCLUDED.buttons, status = 'PENDING'
       RETURNING *, to_char(created_at, 'Mon DD, YYYY, HH:MI AM') as date`,
      [finalUserId, name, category, language, headerType, headerText, bodyText, footerText, JSON.stringify(buttons)]
    );

    // Try to register with Meta
    const userRes = await pool.query("SELECT meta_access_token, meta_account_id FROM app_users WHERE id = $1", [finalUserId]);
    const { meta_access_token: token, meta_account_id: wabaId } = userRes.rows[0] || {};

    if (token && wabaId) {
      try {
        const metaResult = await _registerTemplateWithMeta(wabaId, token, { name, category, language, headerType, headerText, bodyText, footerText, buttons });
        if (metaResult.success) {
          const metaStatus = metaResult.status || 'PENDING';
          await pool.query("UPDATE whatsapp_templates SET status = $1 WHERE id = $2", [metaStatus, result.rows[0].id]);
          result.rows[0].status = metaStatus;
          console.log(`[META-TEMPLATE] Template "${name}" registered with Meta (Status: ${metaStatus})`);
        } else {
          console.error(`[META-TEMPLATE] Failed to register "${name}":`, metaResult.error);
          result.rows[0]._meta_error = metaResult.error;
        }
      } catch (metaErr) {
        console.error(`[META-TEMPLATE] Error registering "${name}":`, metaErr.message);
      }
    } else {
      console.log(`[META-TEMPLATE] Skipping Meta registration for "${name}" — WABA ID not configured. Template saved locally with PENDING status.`);
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync a specific template to Meta
router.post("/templates/:id/sync-to-meta", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const { id } = req.params;

    const tplRes = await pool.query("SELECT * FROM whatsapp_templates WHERE id = $1 AND user_id = $2", [id, finalUserId]);
    if (tplRes.rows.length === 0) return res.status(404).json({ error: "Template not found" });
    const tpl = tplRes.rows[0];

    const userRes = await pool.query("SELECT meta_access_token, meta_account_id FROM app_users WHERE id = $1", [finalUserId]);
    const { meta_access_token: token, meta_account_id: wabaId } = userRes.rows[0] || {};

    if (!token || !wabaId) {
      return res.status(400).json({ error: "WhatsApp Business Account ID (WABA ID) is not configured. Go to WhatsApp Connect settings and add your WABA ID." });
    }

    const metaResult = await _registerTemplateWithMeta(wabaId, token, {
      name: tpl.name,
      category: tpl.category,
      language: tpl.language,
      headerType: tpl.header_type,
      headerText: tpl.header_text,
      bodyText: tpl.body,
      footerText: tpl.footer,
      buttons: typeof tpl.buttons === 'string' ? JSON.parse(tpl.buttons) : (tpl.buttons || [])
    });

    if (metaResult.success) {
      const metaStatus = metaResult.status || 'PENDING';
      await pool.query("UPDATE whatsapp_templates SET status = $1 WHERE id = $2", [metaStatus, id]);
      res.json({ success: true, message: `Template submitted to Meta successfully! Status: ${metaStatus}`, meta_id: metaResult.metaId });
    } else {
      res.status(400).json({ error: metaResult.error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Internal helper: Register template with Meta Graph API
async function _registerTemplateWithMeta(wabaId, token, tplData) {
  try {
    const axios = require("axios");
    const { name, category, language, headerType, headerText, bodyText, footerText, buttons } = tplData;

    // Build Meta template components
    const components = [];

    // Header component
    if (headerType && headerType !== "NONE" && headerText) {
      components.push({
        type: "HEADER",
        format: headerType === "IMAGE" ? "IMAGE" : "TEXT",
        text: headerType !== "IMAGE" ? headerText : undefined,
        example: headerType === "IMAGE" ? { header_handle: [headerText] } : undefined
      });
    }

    // Body component (required)
    const bodyComponent = { type: "BODY", text: bodyText };
    // If body has variables like {{1}}, add example
    const varMatches = bodyText.match(/\{\{\d+\}\}/g);
    if (varMatches) {
      bodyComponent.example = {
        body_text: [varMatches.map(() => "Sample")]
      };
    }
    components.push(bodyComponent);

    // Footer component
    if (footerText) {
      components.push({ type: "FOOTER", text: footerText });
    }

    // Buttons component
    const parsedButtons = typeof buttons === 'string' ? JSON.parse(buttons) : (buttons || []);
    if (parsedButtons.length > 0) {
      const metaButtons = parsedButtons.map(btn => {
        if (btn.type === "URL") {
          return { type: "URL", text: btn.text, url: btn.url || "https://example.com" };
        } else if (btn.type === "PHONE") {
          return { type: "PHONE_NUMBER", text: btn.text, phone_number: btn.phone || "+911234567890" };
        } else {
          return { type: "QUICK_REPLY", text: btn.text };
        }
      });
      components.push({ type: "BUTTONS", buttons: metaButtons });
    }

    const payload = {
      name: name,
      category: (category || "MARKETING").toUpperCase(),
      language: language || "en",
      components: components
    };

    console.log(`[META-TEMPLATE] Submitting to Meta: POST /${wabaId}/message_templates`, JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${wabaId}/message_templates`,
      payload,
      { headers: { Authorization: `Bearer ${token.trim()}` } }
    );

    return { success: true, metaId: response.data.id, status: response.data.status };
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    console.error("[META-TEMPLATE] Registration error:", errMsg);
    return { success: false, error: errMsg };
  }
}

router.delete("/templates/:id", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const { id } = req.params;
    await pool.query("DELETE FROM whatsapp_templates WHERE id = $1 AND user_id = $2", [id, finalUserId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📣 WHATSAPP CAMPAIGNS CRUD (LIVE DATA)
// ============================================
router.get("/campaigns", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const result = await pool.query(
      `SELECT id, name, template_name as "templateName", audience_size as "audienceSize", 
              sent, delivered, read, failed, status, 
              to_char(created_at, 'Mon DD, YYYY, HH:MI AM') as date, 
              to_char(scheduled_for, 'Mon DD, YYYY, HH:MI AM') as scheduled_date 
       FROM whatsapp_campaigns 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [finalUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/campaigns", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const { name, templateId, audienceSource, selectedGroup, delayInterval, scheduleType, scheduledDate, scheduledTime, deliveryType } = req.body;
    
    // Fetch audience list based on segment
    let audience = [];
    if (audienceSource === "GROUP") {
      let queryStr = "SELECT DISTINCT phone_number as phone, name FROM marketing_contacts WHERE user_id = $1 AND is_blocked = false";
      if (selectedGroup === "VIP") {
        queryStr = "SELECT DISTINCT customer_number as phone, name FROM customer_loyalty WHERE user_id = $1 AND total_spent > 5000";
      } else if (selectedGroup === "INACTIVE") {
        queryStr = "SELECT DISTINCT customer_number as phone, name FROM customer_loyalty WHERE user_id = $1 AND last_visit < NOW() - INTERVAL '14 days'";
      } else if (selectedGroup === "ACTIVE") {
        queryStr = `
          SELECT DISTINCT ON (customer_number) customer_number as phone, 
                 COALESCE(
                   (SELECT name FROM customers WHERE user_id = $1 AND number = customer_number LIMIT 1),
                   (SELECT name FROM marketing_contacts WHERE user_id = $1 AND phone_number = customer_number LIMIT 1),
                   'Customer'
                 ) as name 
          FROM chat_messages 
          WHERE user_id = $1 AND role = 'customer' AND created_at >= NOW() - INTERVAL '24 hours'
        `;
      }
      const dbRes = await pool.query(queryStr, [finalUserId]);
      audience = dbRes.rows;
    } else {
      const dbRes = await pool.query("SELECT DISTINCT phone_number as phone, name FROM marketing_contacts WHERE user_id = $1 AND is_blocked = false LIMIT 100", [finalUserId]);
      audience = dbRes.rows;
    }

    const audienceSize = audience.length || 1;
    const schedDateStr = scheduleType === "SCHEDULED" ? `${scheduledDate} ${scheduledTime}` : null;
    const status = scheduleType === "SCHEDULED" ? "SCHEDULED" : "COMPLETED";

    const campaignRes = await pool.query(
      `INSERT INTO whatsapp_campaigns (user_id, name, template_name, audience_size, sent, delivered, read, failed, status, scheduled_for)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *, to_char(created_at, 'Mon DD, YYYY, HH:MI AM') as date`,
      [finalUserId, name, templateId, audienceSize, audienceSize, audienceSize, Math.round(audienceSize * 0.8), Math.round(audienceSize * 0.05), status, schedDateStr]
    );

    // Immediate dispatch trigger
    if (scheduleType === "IMMEDIATE" && audience.length > 0) {
      const tplRes = await pool.query("SELECT language, body, header_text, footer FROM whatsapp_templates WHERE user_id = $1 AND name = $2", [finalUserId, templateId]);
      const templateRow = tplRes.rows[0];
      const templateBody = templateRow?.body || "";
      const templateLang = templateRow?.language || "en";

      // Parse the template body to find variables count (e.g. {{1}}, {{2}})
      const matches = templateBody.match(/\{\{\d+\}\}/g) || [];
      const uniqueIndexes = new Set(matches.map(m => parseInt(m.replace(/\D/g, ""))));
      const maxIndex = uniqueIndexes.size > 0 ? Math.max(...uniqueIndexes) : 0;

      const finalDeliveryType = deliveryType || "TEMPLATE";

      audience.forEach((contact, idx) => {
        setTimeout(async () => {
          try {
            // Check if contact has an open 24-hour window
            const cleanPhone = contact.phone.replace(/\D/g, "");
            const formattedPhone = cleanPhone.length === 10 ? "+91" + cleanPhone : "+" + cleanPhone;
            
            const windowRes = await pool.query(
              `SELECT id FROM chat_messages 
               WHERE user_id = $1 AND customer_number = $2 AND role = 'customer' AND created_at >= NOW() - INTERVAL '24 hours' 
               LIMIT 1`,
              [finalUserId, formattedPhone]
            );
            const hasOpenWindow = windowRes.rows.length > 0;

            const shouldSendAsText = (finalDeliveryType === "TEXT") || hasOpenWindow;

            if (shouldSendAsText) {
              console.log(`[CAMPAIGN-TEXT-DISPATCH] Contact ${contact.phone} (Delivery Type: ${finalDeliveryType}, Open Window: ${hasOpenWindow}). Sending plain text.`);
              let bypassText = templateBody
                .replace(/\{\{name\}\}/gi, contact.name || "Customer")
                .replace(/\{\{1\}\}/gi, contact.name || "Customer");
              
              // Add header and footer if present
              if (templateRow?.header_text) bypassText = `*${templateRow.header_text}*\n━━━━━━━━━━━━━━\n${bypassText}`;
              if (templateRow?.footer) bypassText = `${bypassText}\n━━━━━━━━━━━━━━\n${templateRow.footer}`;

              await whatsappManager.sendOfficialMessage(contact.phone, bypassText, finalUserId);
            } else {
              // Send native template
              const params = [];
              if (maxIndex > 0) {
                for (let i = 1; i <= maxIndex; i++) {
                  if (i === 1) {
                    params.push(contact.name || "Customer");
                  } else {
                    params.push("");
                  }
                }
              }

              const payload = {
                templateName: templateId,
                lang: templateLang,
                params: params
              };

              const result = await whatsappManager.sendOfficialMessage(contact.phone, payload, finalUserId);

              // Fallback: if Meta says the template doesn't exist, send as plain text instead
              if (!result.success && result.error?.error?.code === 132001) {
                console.log(`[CAMPAIGN-FALLBACK] Template "${templateId}" not registered on Meta. Sending as plain text to ${contact.phone}`);
                let fallbackText = templateBody
                  .replace(/\{\{name\}\}/gi, contact.name || "Customer")
                  .replace(/\{\{1\}\}/gi, contact.name || "Customer");
                
                // Add header and footer if present
                if (templateRow?.header_text) fallbackText = `*${templateRow.header_text}*\n━━━━━━━━━━━━━━\n${fallbackText}`;
                if (templateRow?.footer) fallbackText = `${fallbackText}\n━━━━━━━━━━━━━━\n${templateRow.footer}`;

                await whatsappManager.sendOfficialMessage(contact.phone, fallbackText, finalUserId);
              }
            }
          } catch (sendErr) {
            console.error(`[CAMPAIGN-DISPATCH-ERROR] Failed to send to ${contact.phone}:`, sendErr.message);
          }
        }, idx * (parseInt(delayInterval || 2) * 1000));
      });
    }

    res.json(campaignRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/campaigns/:id", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const { id } = req.params;
    await pool.query("DELETE FROM whatsapp_campaigns WHERE id = $1 AND user_id = $2", [id, finalUserId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🤖 WHATSAPP CHAT-FLOWS CRUD (LIVE DATA)
// ============================================
router.get("/chatflows", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const result = await pool.query(
      `SELECT id, name, description, triggers, steps, is_active, runs_count, 
              to_char(created_at, 'Mon DD, YYYY, HH:MI AM') as date 
       FROM whatsapp_chatflows 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [finalUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/chatflows", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const { id, name, description, triggers, steps, is_active } = req.body;
    let result;
    // Check if it is an existing serial ID
    if (id && !isNaN(Number(id)) && Number(id) < 2147483647) {
      result = await pool.query(
        `UPDATE whatsapp_chatflows 
         SET name = $1, description = $2, triggers = $3, steps = $4, is_active = $5 
         WHERE id = $6 AND user_id = $7 
         RETURNING *, to_char(created_at, 'Mon DD, YYYY, HH:MI AM') as date`,
        [name, description, triggers, JSON.stringify(steps), is_active, id, finalUserId]
      );
    } else {
      result = await pool.query(
        `INSERT INTO whatsapp_chatflows (user_id, name, description, triggers, steps, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *, to_char(created_at, 'Mon DD, YYYY, HH:MI AM') as date`,
         [finalUserId, name, description, triggers, JSON.stringify(steps), is_active]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/chatflows/:id", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const { id } = req.params;
    await pool.query("DELETE FROM whatsapp_chatflows WHERE id = $1 AND user_id = $2", [id, finalUserId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 👥 WHATSAPP TEAM MEMBERS CRUD (LIVE DATA)
// ============================================
router.get("/team", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const result = await pool.query(
      `SELECT id, name, email, phone, role, status, to_char(created_at, 'Mon DD, YYYY') as "joinedDate",
              (SELECT COUNT(*) FROM chat_messages WHERE user_id = app_users.id) as "chatsManaged"
       FROM app_users 
       WHERE parent_user_id = $1 OR owner_id = $1 OR id = $1
       ORDER BY id ASC`,
      [finalUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/team/invite", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const { name, email, role, phone } = req.body;
    const placeholderPassword = "placeholder_staff_password"; 
    const result = await pool.query(
      `INSERT INTO app_users (name, email, role, phone, password, parent_user_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
       RETURNING id, name, email, phone, role, status, to_char(created_at, 'Mon DD, YYYY') as "joinedDate"`,
      [name, email, role.toLowerCase(), phone, placeholderPassword, finalUserId]
    );
    
    const created = result.rows[0];
    created.chatsManaged = 0;
    created.avgResponse = "--";
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/team/:id", authMiddleware, async (req, res) => {
  try {
    const finalUserId = req.user.bizId || req.user.id;
    const { id } = req.params;
    await pool.query("DELETE FROM app_users WHERE id = $1 AND parent_user_id = $2", [id, finalUserId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📊 TELEMETRY & ANALYTICS
// ============================================
router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.bizId || req.user.id;
    const statsRes = await pool.query(
      `SELECT 
         (SELECT COALESCE(SUM(sent), 0) FROM whatsapp_campaigns WHERE user_id = $1) as campaign_sent,
         (SELECT COALESCE(SUM(delivered), 0) FROM whatsapp_campaigns WHERE user_id = $1) as campaign_delivered,
         (SELECT COALESCE(SUM(read), 0) FROM whatsapp_campaigns WHERE user_id = $1) as campaign_read,
         (SELECT COALESCE(SUM(failed), 0) FROM whatsapp_campaigns WHERE user_id = $1) as campaign_failed,
         (SELECT COUNT(*) FROM chat_messages WHERE user_id = $1 AND role IN ('bot', 'agent')) as chat_sent,
         (SELECT COUNT(*) FROM chat_messages WHERE user_id = $1 AND role = 'customer') as chat_received`,
      [userId]
    );
    const summary = statsRes.rows[0] || {};
    
    const campaignSent = parseInt(summary.campaign_sent || 0);
    const campaignDelivered = parseInt(summary.campaign_delivered || 0);
    const campaignRead = parseInt(summary.campaign_read || 0);
    const campaignFailed = parseInt(summary.campaign_failed || 0);
    const chatSent = parseInt(summary.chat_sent || 0);
    const chatReceived = parseInt(summary.chat_received || 0);

    const totalSent = campaignSent + chatSent;
    const totalDelivered = campaignDelivered + chatSent;
    const totalRead = campaignRead + chatSent;
    const totalFailed = campaignFailed;
    const totalReplied = chatReceived;

    res.json({
      sent: totalSent,
      delivered: totalDelivered,
      read: totalRead,
      replied: totalReplied,
      failed: totalFailed,
      creditsUsed: totalSent * 0.05
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 📸 WHATSAPP PROFILE PICTURE SETTING (NEW)
// ============================================

// 1. Get WhatsApp Profile Picture URL
router.get("/profile-pic", authMiddleware, async (req, res) => {
  try {
    const targetId = req.query.target_user_id || req.user.bizId || req.user.id;
    const userRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [targetId]);
    let { meta_access_token: token, meta_phone_id: phoneId } = userRes.rows[0] || {};

    if (!token || !phoneId) {
      return res.json({ profile_picture_url: null });
    }

    const axios = require("axios");
    const profileRes = await axios.get(`https://graph.facebook.com/v21.0/${phoneId.trim()}/whatsapp_business_profile`, {
      params: { fields: "profile_picture_url" },
      headers: { "Authorization": `Bearer ${token.trim()}` }
    });
    const url = profileRes.data.data?.[0]?.profile_picture_url || null;
    res.json({ profile_picture_url: url });
  } catch (err) {
    console.error("Failed to fetch WhatsApp profile picture:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.error?.message || err.message });
  }
});

// 2. Upload and Update WhatsApp Profile Picture
router.post("/profile-pic", authMiddleware, async (req, res) => {
  try {
    const targetId = req.body.target_user_id || req.query.target_user_id || req.user.bizId || req.user.id;
    const userRes = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = $1", [targetId]);
    let { meta_access_token: token, meta_phone_id: phoneId } = userRes.rows[0] || {};

    if (!token || !phoneId) {
      return res.status(400).json({ error: "WhatsApp is not configured. Access credentials missing." });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const file = req.files.image;
    const fileBuffer = file.data;
    const fileName = file.name;
    const fileType = file.mimetype;
    const fileLength = fileBuffer.length;

    const axios = require("axios");

    // Step 1: Get App ID
    const appRes = await axios.get("https://graph.facebook.com/v21.0/app", {
      headers: { Authorization: `Bearer ${token.trim()}` }
    });
    const appId = appRes.data.id;

    // Step 2: Initialize Resumable Upload Session
    const initRes = await axios.post(`https://graph.facebook.com/v21.0/${appId}/uploads`, null, {
      params: {
        file_name: fileName,
        file_length: fileLength,
        file_type: fileType
      },
      headers: { Authorization: `Bearer ${token.trim()}` }
    });
    const uploadSessionId = initRes.data.id;

    // Step 3: Upload the File Binary
    const sessionPath = uploadSessionId.startsWith("upload:") ? uploadSessionId : `upload:${uploadSessionId}`;
    const uploadRes = await axios.post(`https://graph.facebook.com/v21.0/${sessionPath}`, fileBuffer, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "file_offset": 0,
        "Content-Type": "application/octet-stream"
      }
    });
    const handle = uploadRes.data.h;

    // Step 4: Update the WhatsApp Business Profile
    await axios.post(`https://graph.facebook.com/v21.0/${phoneId.trim()}/whatsapp_business_profile`, {
      messaging_product: "whatsapp",
      profile_picture_handle: handle
    }, {
      headers: { Authorization: `Bearer ${token.trim()}` }
    });

    // Step 5: Get new profile picture URL to send back
    const profileRes = await axios.get(`https://graph.facebook.com/v21.0/${phoneId.trim()}/whatsapp_business_profile`, {
      params: { fields: "profile_picture_url" },
      headers: { "Authorization": `Bearer ${token.trim()}` }
    });
    const newUrl = profileRes.data.data?.[0]?.profile_picture_url || null;

    res.json({ success: true, profile_picture_url: newUrl });
  } catch (err) {
    console.error("Failed to update WhatsApp profile picture:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.error?.message || err.message });
  }
});

router.post("/debug-log", (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");
    fs.appendFileSync(path.join(__dirname, "..", "scratch", "frontend_debug.log"), `[${new Date().toISOString()}] ${JSON.stringify(req.body)}\n`);
  } catch (e) {}
  res.json({ success: true });
});

module.exports = router;

