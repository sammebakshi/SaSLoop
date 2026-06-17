const whatsappManager = require("../whatsappManager");
const pool = require("../db");

// Mock send methods in whatsappManager so we don't send actual WhatsApp API requests during test
whatsappManager.sendOfficialMessage = async (to, content, userId) => {
    console.log(`[MOCK SEND] To: ${to} | Content:`, typeof content === 'object' ? JSON.stringify(content, null, 2) : content);
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

async function runTest() {
    try {
        console.log("Starting WhatsApp AI logic simulation...");
        const userId = 48; // Shahe Tehzeeb Restaurant
        const phone = "919469697216";
        const name = "Azhar";

        console.log("\n--- TEST case 1: 'Goshtaba' ---");
        await whatsappManager.processAiAutomations(userId, phone, "Goshtaba", name);

        console.log("\n--- TEST case 2: 'Kabab' ---");
        await whatsappManager.processAiAutomations(userId, phone, "Kabab", name);

    } catch (e) {
        console.error("Test Error:", e);
    } finally {
        await pool.end();
    }
}

runTest();
