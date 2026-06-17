const jwt = require("jsonwebtoken");
const axios = require("axios");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

async function testApi() {
  try {
    // 1. Generate JWT token for user 48 (Shahe Tehzeeb Restaurant)
    const token = jwt.sign(
      { id: 48, email: "shahetehzeeb@test.com", role: "brand_owner" },
      JWT_SECRET
    );
    console.log("Generated token:", token.substring(0, 20) + "...");

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Test GET /api/pos/active-state
    console.log("Fetching POS active state from GET /api/pos/active-state...");
    const getRes = await axios.get("http://localhost:5000/api/pos/active-state", { headers });
    console.log("GET Response:", JSON.stringify(getRes.data, null, 2));

    // Verify properties
    if (getRes.data && getRes.data.tableBills && getRes.data.tableBills["table-5"]) {
      console.log("✅ GET active-state check passed!");
    } else {
      console.log("❌ GET active-state check failed: table-5 not found.");
    }

    // 3. Simulate Settle & Complete Bill (checkout) for table-5
    const itemToSettle = {
      isPosStateTable: true,
      dbId: "table-5",
      type: "DINE_IN",
      title: "Table 5",
      subtitle: "Bill No: B-501",
      total: 620,
      customer_name: "Table Guest",
      customer_number: "",
      items: [
        { product_name: "Chicken Biryani", quantity: 2, price: 250 },
        { product_name: "Garlic Naan", quantity: 3, price: 40 }
      ]
    };

    console.log("Posting settled order to /api/orders...");
    const orderRes = await axios.post("http://localhost:5000/api/orders", {
      customer_name: itemToSettle.customer_name,
      customer_number: itemToSettle.customer_number,
      items: itemToSettle.items,
      total_price: itemToSettle.total,
      payment_method: "CASH",
      status: "COMPLETED",
      table_number: "5",
      order_type: "DINE_IN",
      bill_no: "B-501"
    }, { headers });

    console.log("Order created successfully:", orderRes.data.id, "Bill No:", orderRes.data.bill_no);

    // 4. Update the active POS state by removing table-5
    const updatedPosState = { ...getRes.data };
    delete updatedPosState.tableBills["table-5"];
    updatedPosState.tableStatuses["table-5"] = "AVAILABLE";
    delete updatedPosState.tableBillNumbers["table-5"];
    delete updatedPosState.tableActiveTimestamps["table-5"];

    console.log("Updating active-state on the server...");
    const postSyncRes = await axios.post("http://localhost:5000/api/pos/active-state", {
      activeState: updatedPosState
    }, { headers });

    console.log("Sync response:", postSyncRes.data);

    // 5. Fetch state again to verify table-5 is now AVAILABLE / cleared
    const getRes2 = await axios.get("http://localhost:5000/api/pos/active-state", { headers });
    console.log("GET Response after checkout:", JSON.stringify(getRes2.data, null, 2));

    if (getRes2.data.tableStatuses["table-5"] === "AVAILABLE" && !getRes2.data.tableBills["table-5"]) {
      console.log("✅ Active state updated & cleared successfully after checkout!");
    } else {
      console.log("❌ Active state was not cleared correctly.");
    }
  } catch (err) {
    console.error("API Test Error:", err.response ? err.response.data : err.message);
  }
}

testApi();
