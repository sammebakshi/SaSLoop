const pool = require('../db');
const whatsappManager = require('../whatsappManager');

// Mock sending messages so we don't hit the API
whatsappManager.sendOfficialMessage = async (to, content, userId) => {
    console.log(`[MOCK SEND] To: ${to} | Content:`, content);
    return { success: true };
};

whatsappManager.sendButtons = async (to, text, buttons, userId) => {
    console.log(`[MOCK BUTTONS] To: ${to} | Text: ${text} | Buttons:`, buttons);
    return { success: true };
};

whatsappManager.sendList = async (to, header, body, buttonTitle, sections, userId) => {
    console.log(`[MOCK LIST] To: ${to} | Header: ${header} | Body: ${body} | Sections:`, JSON.stringify(sections, null, 2));
    return { success: true };
};

async function run() {
  try {
    const userId = 48;
    const phone = "+917006089744"; // Sajad's phone with +
    const name = "Sajad Bakshi";
    
    // Clear session for this customer first so we start clean!
    await pool.query("DELETE FROM conversation_sessions WHERE customer_number = $1", [phone]);
    console.log("Cleared existing session.");

    // Run processing
    console.log("\n--- SIMULATING INCOMING MESSAGE: Rista x 4, Kabab x 2, Goshtaba x2 ---");
    await whatsappManager.processAiAutomations(userId, phone, "Rista x 4\nKabab x 2\nGoshtaba x2", name);

    // Let's inspect the session in the DB after execution
    const res = await pool.query(
      `SELECT * FROM conversation_sessions WHERE customer_number = $1`,
      [phone]
    );
    console.log("\nSession in DB after simulation:");
    console.log(JSON.stringify(res.rows, null, 2));

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
