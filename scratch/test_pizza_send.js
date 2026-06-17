const whatsappManager = require('../whatsappManager');

async function testSend() {
  const payload = {
    templateName: 'pizza_offer',
    lang: 'en',
    params: []
  };

  console.log("Sending template pizza_offer to +919906123989...");
  const res1 = await whatsappManager.sendOfficialMessage('+919906123989', payload, 48);
  console.log("Result +919906123989:", JSON.stringify(res1, null, 2));

  console.log("Sending template pizza_offer to +917006089744...");
  const res2 = await whatsappManager.sendOfficialMessage('+917006089744', payload, 48);
  console.log("Result +917006089744:", JSON.stringify(res2, null, 2));
}

testSend();
