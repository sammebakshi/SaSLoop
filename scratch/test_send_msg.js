const { sendOfficialMessage } = require('../whatsappManager');

async function testSend() {
  // Let's send a message to Sajad's phone number or the business contact number
  // According to setup_debug.log, the notification_numbers are: "+919469697216"
  // Let's send a test message to '+919469697216' using User ID 48
  const to = '+919469697216';
  const text = 'Testing SaSLoop integration with User ID 48 after fixing webhook mapping! 🚀';
  
  console.log(`Sending message to ${to} using User 48...`);
  const result = await sendOfficialMessage(to, text, 48);
  console.log('Result:', result);
}

testSend();
