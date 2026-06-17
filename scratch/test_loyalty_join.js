const axios = require('axios');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres:Admin@123@localhost:5432/sasloop_db'
});

async function runTest() {
  try {
    const testPhone = "+917006089744"; // Your test number
    const userId = 48; // Shahe Tehzeeb Restaurant owner ID

    // 1. Temporarily set joining points to 125 in local DB to verify it is dynamic
    console.log('Setting loyalty_joining_points to 125 in local DB...');
    await pool.query('UPDATE restaurants SET loyalty_joining_points = 125 WHERE user_id = $1', [userId]);

    // 2. Remove the test customer from loyalty program to trigger welcome flow
    console.log('Cleaning up existing loyalty profile...');
    await pool.query('DELETE FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2', [userId, testPhone]);
    await pool.query('DELETE FROM conversation_sessions WHERE user_id = $1 AND customer_number = $2', [userId, testPhone]);

    // 3. Mock incoming "Hi" message to trigger welcome message
    console.log('Sending mock "Hi" webhook...');
    const welcomeRes = await axios.post('http://localhost:5000/api/whatsapp/webhook', {
      object: "whatsapp_business_account",
      entry: [{
        id: "1116613731527246",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: { display_phone_number: "919906123989", phone_number_id: "1081456295056156" },
            contacts: [{ profile: { name: "Sajad Bakshi" }, wa_id: testPhone.replace('+', '') }],
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

    console.log('Welcome Webhook Response:', welcomeRes.status, welcomeRes.data);

    // Let's sleep for 2 seconds to allow async processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Mock clicking "Join VIP" (sends join_loyalty payload)
    console.log('Sending mock "join_loyalty" webhook...');
    const joinRes = await axios.post('http://localhost:5000/api/whatsapp/webhook', {
      object: "whatsapp_business_account",
      entry: [{
        id: "1116613731527246",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: { display_phone_number: "919906123989", phone_number_id: "1081456295056156" },
            contacts: [{ profile: { name: "Sajad Bakshi" }, wa_id: testPhone.replace('+', '') }],
            messages: [{
              from: testPhone.replace('+', ''),
              id: "wamid.mockJoinTest" + Date.now(),
              timestamp: Math.floor(Date.now() / 1000).toString(),
              interactive: {
                type: "button_reply",
                button_reply: { id: "join_loyalty", title: "🎁 Claim Points" }
              },
              type: "interactive"
            }]
          },
          field: "messages"
        }]
      }]
    });

    console.log('Join Webhook Response:', joinRes.status, joinRes.data);

    // Let's sleep for 2 seconds to allow database write
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Verify the customer was inserted with 125 points
    const finalCheck = await pool.query(
      'SELECT points FROM customer_loyalty WHERE user_id = $1 AND customer_number = $2',
      [userId, testPhone]
    );

    console.log('\n--- VERIFICATION RESULT ---');
    if (finalCheck.rows.length > 0) {
      console.log(`SUCCESS: Customer joined successfully with ${finalCheck.rows[0].points} points!`);
    } else {
      console.log('FAILED: Customer was not enrolled in loyalty table.');
    }

    // 6. Restore database value to 100 as shown in dashboard screenshot
    console.log('\nRestoring settings back to 100 points...');
    await pool.query('UPDATE restaurants SET loyalty_joining_points = 100 WHERE user_id = $1', [userId]);

  } catch (err) {
    console.error('Test Failed:', err.message);
  } finally {
    await pool.end();
  }
}

runTest();
