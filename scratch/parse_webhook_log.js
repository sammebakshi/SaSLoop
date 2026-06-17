const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "../scratch/webhook_debug.log");
if (!fs.existsSync(logPath)) {
    console.log("No webhook debug log file found.");
    process.exit(0);
}

const content = fs.readFileSync(logPath, "utf8");
// Webhook log separates hits by "[timestamp] HIT:\n{json}\n\n"
const hits = content.split("HIT:\n");

console.log(`Total hits logged: ${hits.length}`);
console.log("=== RECENT WEBHOOK INBOUND MESSAGES ===");

hits.reverse().slice(0, 15).forEach(hit => {
    try {
        // Find JSON block
        const jsonStart = hit.indexOf("{");
        if (jsonStart === -1) return;
        const jsonStr = hit.substring(jsonStart).trim();
        const data = JSON.parse(jsonStr);
        
        if (data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
            const msg = data.entry[0].changes[0].value.messages[0];
            const meta = data.entry[0].changes[0].value.metadata;
            console.log(`Time: ${new Date(parseInt(msg.timestamp) * 1000).toLocaleString()} | From: ${msg.from} | Text: "${msg.text?.body || '[Non-text]'}" | Display Num: ${meta?.display_phone_number}`);
        } else if (data.entry?.[0]?.changes?.[0]?.value?.statuses?.[0]) {
            const status = data.entry[0].changes[0].value.statuses[0];
            console.log(`Status Event | Time: ${new Date(parseInt(status.timestamp) * 1000).toLocaleString()} | Recipient: ${status.recipient_id} | Status: ${status.status}`);
        }
    } catch (e) {
        // Skip malformed
    }
});
