const pool = require('../db');
const whatsappManager = require('../whatsappManager');

async function run() {
  try {
    const chats = await whatsappManager.getRecentChats(48);
    console.log(`Total messages returned for user 48: ${chats.length}`);
    
    // Group by customerNumber
    const grouped = {};
    chats.forEach(msg => {
      const phone = msg.customerNumber;
      if (!grouped[phone]) {
        grouped[phone] = [];
      }
      grouped[phone].push(msg);
    });

    console.log('Grouped customer numbers:');
    console.log(Object.keys(grouped));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
