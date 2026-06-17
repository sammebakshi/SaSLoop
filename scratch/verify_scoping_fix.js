const axios = require('axios');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secretkey';
const API_BASE = 'http://localhost:5000';

// Generate token for user id 48 (shahetehzeeb, role user)
const token = jwt.sign(
    { id: 48, bizId: 48, email: 'shahetehzeeb@test.com', role: 'user' },
    JWT_SECRET,
    { expiresIn: '1h' }
);

const headers = {
    'Authorization': `Bearer ${token}`
};

async function runVerify() {
    console.log("=== RUNNING POS CONFIG SCOPING VERIFICATION ===");
    try {
        console.log("\n1. Fetching Designations...");
        const desRes = await axios.get(`${API_BASE}/api/brand/designations`, { headers });
        console.log(`Received ${desRes.data.length} designations:`);
        console.log(desRes.data.map(d => ({ id: d.id, name: d.name, outlet_id: d.outlet_id })));

        console.log("\n2. Fetching Tax Groups...");
        const taxRes = await axios.get(`${API_BASE}/api/brand/tax-groups`, { headers });
        console.log(`Received ${taxRes.data.length} tax groups:`);
        console.log(taxRes.data.map(t => ({ id: t.id, group_name: t.group_name, outlet_id: t.outlet_id })));

        console.log("\n3. Fetching Kitchen Departments...");
        const kitchenRes = await axios.get(`${API_BASE}/api/brand/kitchen-departments`, { headers });
        console.log(`Received ${kitchenRes.data.length} kitchen departments:`);
        console.log(kitchenRes.data.map(k => ({ id: k.id, name: k.name, department_name: k.department_name, outlet_id: k.outlet_id })));

        console.log("\n4. Fetching Table Departments...");
        const tableDeptRes = await axios.get(`${API_BASE}/api/brand/table-departments`, { headers });
        console.log(`Received ${tableDeptRes.data.length} table departments:`);
        console.log(tableDeptRes.data.map(t => ({ id: t.id, department_name: t.department_name, outlet_id: t.outlet_id })));

        console.log("\n5. Fetching Tables List...");
        const tablesRes = await axios.get(`${API_BASE}/api/brand/tables`, { headers });
        console.log(`Received ${tablesRes.data.length} tables:`);
        console.log(tablesRes.data.map(t => ({ id: t.id, name: t.name, outlet_id: t.outlet_id })));

        console.log("\n6. Fetching Discounts...");
        const discRes = await axios.get(`${API_BASE}/api/discounts`, { headers });
        console.log(`Received ${discRes.data.length} discounts:`);

        console.log("\n7. Fetching Additional Charges...");
        const chargesRes = await axios.get(`${API_BASE}/api/additional-charges`, { headers });
        console.log(`Received ${chargesRes.data.length} additional charges:`);

        console.log("\n✅ VERIFICATION COMPLETE SUCCESSFULLY!");
    } catch (err) {
        console.error("❌ VERIFICATION FAILED:", err.response ? err.response.data : err.message);
    }
}

runVerify();
