/**
 * SaSLoop — Auto Ngrok Tunnel Starter
 * Run this BEFORE starting your backend server.
 * It creates a persistent HTTPS tunnel to your local port 5000
 * and prints the Meta Webhook URL ready to paste.
 *
 * Usage: node start-tunnel.js
 */

require("dotenv").config();
const ngrok = require("@ngrok/ngrok");

const PORT = process.env.PORT || 5000;
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN;

if (!NGROK_AUTHTOKEN || NGROK_AUTHTOKEN === "PASTE_YOUR_NGROK_AUTH_TOKEN_HERE") {
  console.error("\n❌ ERROR: NGROK_AUTHTOKEN is missing in your .env file!");
  console.error("   1. Go to: https://dashboard.ngrok.com/get-started/your-authtoken");
  console.error("   2. Copy your auth token");
  console.error("   3. Paste it in .env → NGROK_AUTHTOKEN=your_token_here\n");
  process.exit(1);
}

async function startTunnel() {
  try {
    console.log(`\n🚇 Starting ngrok tunnel on port ${PORT}...`);

    const forwardConfig = {
      addr: PORT,
      authtoken: NGROK_AUTHTOKEN,
    };

    if (process.env.NGROK_DOMAIN) {
      forwardConfig.domain = process.env.NGROK_DOMAIN;
    }

    const listener = await ngrok.forward(forwardConfig);

    const tunnelUrl = listener.url();

    console.log("\n========================================");
    console.log("✅ NGROK TUNNEL ACTIVE");
    console.log("========================================");
    console.log(`🌐 Tunnel URL:     ${tunnelUrl}`);
    console.log(`📡 Webhook URL:    ${tunnelUrl}/api/whatsapp/webhook`);
    console.log("========================================");
    console.log("\n📋 NEXT STEPS:");
    console.log("  1. Copy the Webhook URL above");
    console.log("  2. Go to: https://developers.facebook.com → Your App → WhatsApp → Configuration");
    console.log(`  3. Paste as Callback URL: ${tunnelUrl}/api/whatsapp/webhook`);
    console.log("  4. Set Verify Token:      sasloop_verify_token");
    console.log("  5. Click Verify & Save");
    console.log("\n⚡ Now start your backend in another terminal: node server.js\n");
    console.log("⏳ Tunnel is running. Press Ctrl+C to stop.\n");

    // Keep the process alive
    setInterval(() => {}, 60000);

  } catch (err) {
    console.error("\n❌ Failed to start tunnel:", err.message);
    console.log("   Retrying in 5 seconds...");
    setTimeout(startTunnel, 5000);
  }
}

startTunnel();
