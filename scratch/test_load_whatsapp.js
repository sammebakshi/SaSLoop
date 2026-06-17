try {
    const whatsappManager = require("../whatsappManager");
    console.log("✅ whatsappManager.js loaded successfully!");
    console.log("Available exports:", Object.keys(whatsappManager));
} catch (e) {
    console.error("❌ Failed to load whatsappManager.js:", e);
}
