const axios = require('axios');
const pool = require('../db');

async function testSendButtons() {
  try {
    const res = await pool.query("SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = 48");
    const token = res.rows[0]?.meta_access_token?.trim();
    const phoneId = res.rows[0]?.meta_phone_id?.trim();
    
    if (!token || !phoneId) {
      console.log("No credentials found.");
      return;
    }

    const to = "+919469697216"; // Azhar's number
    const welcomeText = `👋 *Hello! Welcome to Shahe Tehzeeb Restaurant* 🍽️\n\nI am your AI assistant. I can help you view our menu, place an order, or answer questions.\n\n🎁 Join our *VIP Club* today and get *100 Free Points* instantly to start tracking your purchases!\n\n*What would you like to do today?*`;
    
    const formattedButtons = [
      { type: "reply", reply: { id: "join_loyalty", title: "🎁 Join (+100 Pts)" } },
      { type: "reply", reply: { id: "view_menu", title: "📜 View Menu" } },
      { type: "reply", reply: { id: "place_order", title: "🛍️ Place Order" } }
    ];

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: welcomeText },
        action: { buttons: formattedButtons }
      }
    };

    console.log("Sending interactive button payload to Meta...");
    const response = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, payload, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    console.log("✅ Success! Message sent:", response.data);

  } catch (err) {
    if (err.response) {
      console.error("❌ Meta API Error:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("❌ Error:", err.message);
    }
  } finally {
    await pool.end();
  }
}

testSendButtons();
