const axios = require("axios");
const pool = require("../db");
const fs = require("fs");
const path = require("path");

async function testUpload() {
  try {
    // 1. Get credentials for user 48
    const res = await pool.query(
      "SELECT meta_access_token, meta_phone_id FROM app_users WHERE id = 48"
    );
    const { meta_access_token: token, meta_phone_id: phoneId } = res.rows[0];
    
    // Create a dummy 100-byte file representing an image
    const tempFilePath = path.join(__dirname, "dummy.jpg");
    // Just write a small fake JPEG header or random bytes
    const fakeJpg = Buffer.alloc(1024, 0xff); // 1KB of dummy data
    fs.writeFileSync(tempFilePath, fakeJpg);
    
    const fileStats = fs.statSync(tempFilePath);
    console.log(`Dummy file created at ${tempFilePath}, size: ${fileStats.size} bytes`);

    // 2. Fetch App ID
    console.log("Fetching App ID...");
    const appRes = await axios.get("https://graph.facebook.com/v21.0/app", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const appId = appRes.data.id;
    console.log("App ID:", appId);

    // 3. Initialize Upload Session
    console.log("Initializing upload session...");
    // Let's pass parameters as query parameters or form data.
    // Graph API handles both, query params is easiest.
    const initUrl = `https://graph.facebook.com/v21.0/${appId}/uploads`;
    const initRes = await axios.post(initUrl, null, {
      params: {
        file_name: "whatsapp_profile.jpg",
        file_length: fileStats.size,
        file_type: "image/jpeg"
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    const uploadSessionId = initRes.data.id;
    console.log("Upload Session ID:", uploadSessionId);

    // 4. Upload binary data
    console.log("Uploading file data...");
    const sessionPath = uploadSessionId.startsWith("upload:") ? uploadSessionId : `upload:${uploadSessionId}`;
    const uploadUrl = `https://graph.facebook.com/v21.0/${sessionPath}`;
    const fileBuffer = fs.readFileSync(tempFilePath);
    
    const uploadRes = await axios.post(uploadUrl, fileBuffer, {
      headers: {
        Authorization: `Bearer ${token}`,
        "file_offset": 0,
        "Content-Type": "application/octet-stream"
      }
    });
    
    const handle = uploadRes.data.h;
    console.log("Success! Profile Picture Handle:", handle);

    // Clean up
    fs.unlinkSync(tempFilePath);
    console.log("Temp file removed.");

  } catch (err) {
    console.error("Test failed:", err.response?.data || err.message);
  } finally {
    await pool.end();
  }
}

testUpload();
