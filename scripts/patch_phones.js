const pool = require("./db");

async function patchPhones() {
    try {
        console.log("🛠️ PATCHING PHONE NUMBERS IN DATABASE...");

        // 1. Patch customer_loyalty
        const loyaltyRes = await pool.query("SELECT id, customer_number FROM customer_loyalty WHERE customer_number NOT LIKE '+%'");
        console.log(`Loyalty records to patch: ${loyaltyRes.rows.length}`);
        for (let row of loyaltyRes.rows) {
            let digits = row.customer_number.replace(/\D/g, "");
            if (digits.length === 10) digits = "91" + digits;
            const newNum = "+" + digits;
            await pool.query("UPDATE customer_loyalty SET customer_number = $1 WHERE id = $2", [newNum, row.id]);
        }

        // 2. Patch marketing_contacts
        const contactRes = await pool.query("SELECT id, phone_number FROM marketing_contacts WHERE phone_number NOT LIKE '+%'");
        console.log(`Contact records to patch: ${contactRes.rows.length}`);
        for (let row of contactRes.rows) {
            let digits = row.phone_number.replace(/\D/g, "");
            if (digits.length === 10) digits = "91" + digits;
            const newNum = "+" + digits;
            await pool.query("UPDATE marketing_contacts SET phone_number = $1 WHERE id = $2", [newNum, row.id]);
        }

        // 3. Patch chat_messages
        const chatRes = await pool.query("SELECT id, customer_number FROM chat_messages WHERE customer_number NOT LIKE '+%'");
        console.log(`Chat messages to patch: ${chatRes.rows.length}`);
        for (let row of chatRes.rows) {
            let digits = row.customer_number.replace(/\D/g, "");
            if (digits.length === 10) digits = "91" + digits;
            const newNum = "+" + digits;
            await pool.query("UPDATE chat_messages SET customer_number = $1 WHERE id = $2", [newNum, row.id]);
        }

        // 4. Patch orders
        const orderRes = await pool.query("SELECT id, customer_number FROM orders WHERE customer_number NOT LIKE '+%' AND customer_number NOT IN ('QR-ORDER', 'POS-MANUAL')");
        console.log(`Orders to patch: ${orderRes.rows.length}`);
        for (let row of orderRes.rows) {
            let digits = row.customer_number.replace(/\D/g, "");
            if (digits.length === 10) digits = "91" + digits;
            const newNum = "+" + digits;
            await pool.query("UPDATE orders SET customer_number = $1 WHERE id = $2", [newNum, row.id]);
        }

        // 5. Patch conversation_sessions
        const sessRes = await pool.query("SELECT id, customer_number FROM conversation_sessions WHERE customer_number NOT LIKE '+%'");
        console.log(`Sessions to patch: ${sessRes.rows.length}`);
        for (let row of sessRes.rows) {
            let digits = row.customer_number.replace(/\D/g, "");
            if (digits.length === 10) digits = "91" + digits;
            const newNum = "+" + digits;
            // Use subquery to avoid conflict if both + and non-+ versions exist (though unlikely)
            try {
                await pool.query("UPDATE conversation_sessions SET customer_number = $1 WHERE id = $2", [newNum, row.id]);
            } catch (e) {
                console.warn(`Could not patch session ID ${row.id}: ${e.message}`);
            }
        }

        console.log("✅ DATABASE PATCH COMPLETED SUCCESSFULLY");
        process.exit(0);
    } catch (err) {
        console.error("❌ PATCH FAILED:", err);
        process.exit(1);
    }
}

patchPhones();
