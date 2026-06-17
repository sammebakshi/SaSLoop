const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'webhook_debug.log');
if (!fs.existsSync(logPath)) {
  console.log("No webhook log found.");
  process.exit(0);
}

const content = fs.readFileSync(logPath, 'utf8');
const hits = content.split('HIT:\n');
const senderLastHit = {};

hits.forEach(hit => {
  if (!hit.trim()) return;
  // Get timestamp line
  const match = hit.match(/\[(.*?)\]/);
  const logTime = match ? match[1] : 'Unknown';

  const jsonStartIndex = hit.indexOf('{');
  if (jsonStartIndex === -1) return;
  const jsonEndIndex = hit.lastIndexOf('}');
  if (jsonEndIndex === -1) return;
  
  try {
    const payload = JSON.parse(hit.substring(jsonStartIndex, jsonEndIndex + 1));
    if (payload.entry) {
      payload.entry.forEach(entry => {
        if (entry.changes) {
          entry.changes.forEach(change => {
            if (change.value) {
              let sender = null;
              if (change.value.messages) {
                change.value.messages.forEach(msg => {
                  sender = msg.from;
                });
              } else if (change.value.contacts) {
                change.value.contacts.forEach(contact => {
                  sender = contact.wa_id;
                });
              }
              if (sender) {
                senderLastHit[sender] = {
                  time: logTime,
                  snippet: hit.trim().substring(0, 400)
                };
              }
            }
          });
        }
      });
    }
  } catch (e) {}
});

console.log("=== SENDER LAST WEBHOOK HITS ===");
Object.keys(senderLastHit).forEach(sender => {
  console.log(`\nSender: ${sender}`);
  console.log(`Last Hit Time: ${senderLastHit[sender].time}`);
  console.log(`Snippet:\n${senderLastHit[sender].snippet}`);
  console.log("-----------------------------------------");
});
