const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'webhook_debug.log');
if (!fs.existsSync(logPath)) {
  console.log("No webhook log found.");
  process.exit(0);
}

const content = fs.readFileSync(logPath, 'utf8');
// Split by "HIT:"
const hits = content.split('HIT:\n');
const senders = new Set();
const phoneIds = new Set();
const displayNumbers = new Set();

hits.forEach(hit => {
  if (!hit.trim()) return;
  // Extract JSON part
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
              if (change.value.metadata) {
                if (change.value.metadata.phone_number_id) phoneIds.add(change.value.metadata.phone_number_id);
                if (change.value.metadata.display_phone_number) displayNumbers.add(change.value.metadata.display_phone_number);
              }
              if (change.value.contacts) {
                change.value.contacts.forEach(contact => {
                  if (contact.wa_id) senders.add(contact.wa_id);
                });
              }
              if (change.value.messages) {
                change.value.messages.forEach(msg => {
                  if (msg.from) senders.add(msg.from);
                });
              }
            }
          });
        }
      });
    }
  } catch (e) {
    // Ignore malformed JSON
  }
});

console.log("Unique Senders:", Array.from(senders));
console.log("Unique Phone IDs:", Array.from(phoneIds));
console.log("Unique Display Numbers:", Array.from(displayNumbers));
