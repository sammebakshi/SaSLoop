const axios = require('axios');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function runTest() {
  try {
    const testPhone = "+917006089744"; // Test phone
    const userId = 48; // Shahe Tehzeeb Restaurant owner ID

    // 1. Clean up existing customer profile and loyalty records
    console.log('Cleaning up existing lead and loyalty records...');
    await pool.query('DELETE FROM customers WHERE user_id = $1 AND number = $2', [userId, testPhone]);
    await pool.query('DELETE FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2', [userId, testPhone]);
    await pool.query('DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2', [userId, testPhone]);

    // 2. Mock incoming "Hi" message to trigger lead capture
    console.log('Sending mock "Hi" webhook from new customer...');
    const welcomeRes = await axios.post('http://localhost:5000/api/whatsapp/webhook', {
      object: "whatsapp_business_account",
      entry: [{
        id: "1116613731527246",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: { display_phone_number: "919906123989", phone_number_id: "1081456295056156" },
            contacts: [{ profile: { name: "Test Lead Sajad" }, wa_id: testPhone.replace('+', '') }],
            messages: [{
              from: testPhone.replace('+', ''),
              id: "wamid.mockGreetingTest" + Date.now(),
              timestamp: Math.floor(Date.now() / 1000).toString(),
              text: { body: "Hi" },
              type: "text"
            }]
          },
          field: "messages"
        }]
      }]
    });

    console.log('Welcome Webhook Status:', welcomeRes.status);

    // Sleep to allow processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify lead was created in customers table
    const leadCheck = await pool.query('SELECT * FROM customers WHERE user_id = $1 AND number = $2', [userId, testPhone]);
    console.log('\n--- LEAD CAPTURE VERIFICATION ---');
    if (leadCheck.rows.length > 0) {
      console.log(`✅ SUCCESS: New lead captured! Name: ${leadCheck.rows[0].name}, Phone: ${leadCheck.rows[0].number}`);
    } else {
      console.log('❌ FAILED: No record found in general customers table.');
    }

    // Verify customer is NOT in loyalty yet
    const loyaltyCheck = await pool.query('SELECT * FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2', [userId, testPhone]);
    if (loyaltyCheck.rows.length === 0) {
      console.log('✅ SUCCESS: Customer not in customer_loyalty yet (no premature rewards).');
    } else {
      console.log('❌ FAILED: loyalty record was created prematurely.');
    }

    // 3. Mock clicking "Join VIP" (sends join_loyalty payload)
    console.log('\nSending mock "join_loyalty" button click...');
    const joinRes = await axios.post('http://localhost:5000/api/whatsapp/webhook', {
      object: "whatsapp_business_account",
      entry: [{
        id: "1116613731527246",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: { display_phone_number: "919906123989", phone_number_id: "1081456295056156" },
            contacts: [{ profile: { name: "Test Lead Sajad" }, wa_id: testPhone.replace('+', '') }],
            messages: [{
              from: testPhone.replace('+', ''),
              id: "wamid.mockJoinTest" + Date.now(),
              timestamp: Math.floor(Date.now() / 1000).toString(),
              interactive: {
                type: "button_reply",
                button_reply: { id: "join_loyalty", title: "🎁 Join VIP Club" }
              },
              type: "interactive"
            }]
          },
          field: "messages"
        }]
      }]
    });

    console.log('Join Webhook Status:', joinRes.status);

    // Sleep to allow processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Verify loyalty points is 0
    const finalLoyaltyCheck = await pool.query(
      'SELECT points FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2',
      [userId, testPhone]
    );

    console.log('\n--- VIP LOYALTY JOIN VERIFICATION ---');
    if (finalLoyaltyCheck.rows.length > 0) {
      const pts = finalLoyaltyCheck.rows[0].points;
      console.log(`Customer joined loyalty program successfully.`);
      if (pts === 0) {
        console.log(`✅ SUCCESS: Customer initialized with 0 points (No temporary/joining points)!`);
      } else {
        console.log(`❌ FAILED: Customer has ${pts} points instead of 0.`);
      }
    } else {
      console.log('❌ FAILED: Customer was not enrolled in loyalty table.');
    }

  } catch (err) {
    console.error('❌ Test Execution Failed:', err.message);
  } finally {
    await pool.end();
  }
}

runTest();
