const fs = require('fs');

function updateWhatsappManager(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix button title length (27 chars -> 14 chars)
    content = content.replaceAll('title: "💳 I Have Completed Payment"', 'title: "💳 I Have Paid"');
    content = content.replaceAll("title: '💳 I Have Completed Payment'", "title: '💳 I Have Paid'");

    // 2. Update pay_charge_cod_ handler to set status = 'NEW' and trigger order.new webhook for POS alert
    const oldCodCode = "await pool.query(\"UPDATE orders SET payment_method = 'COD', status = 'PROCESSING' WHERE id = $1\", [orderId]);";
    const newCodCode = `await pool.query("UPDATE orders SET payment_method = 'COD', status = 'NEW' WHERE id = $1", [orderId]);
                    targetOrder.status = 'NEW';
                    targetOrder.payment_method = 'COD';
                    try {
                        triggerWebhook(biz, 'order.new', targetOrder);
                    } catch (wErr) {
                        console.error("Webhook trigger error on charge confirm:", wErr);
                    }`;

    if (content.includes(oldCodCode)) {
        content = content.replace(oldCodCode, newCodCode);
        console.log(`Updated pay_charge_cod_ in ${filePath}`);
    } else {
        console.log(`oldCodCode not found in ${filePath}`);
    }

    // 3. Update payment_completed_ handler to set status = 'NEW' and trigger order.new webhook
    const oldPaymentCompletedCode = "await pool.query(\n                    \"UPDATE orders SET payment_status = 'CUSTOMER_CONFIRMED' WHERE id = $1\",\n                    [ordToUpdate.id]\n                );";
    const newPaymentCompletedCode = `await pool.query(
                    "UPDATE orders SET payment_status = 'CUSTOMER_CONFIRMED', status = 'NEW' WHERE id = $1",
                    [ordToUpdate.id]
                );
                ordToUpdate.payment_status = 'CUSTOMER_CONFIRMED';
                ordToUpdate.status = 'NEW';
                try {
                    triggerWebhook(biz, 'order.new', ordToUpdate);
                } catch (wErr) {}`;

    if (content.includes(oldPaymentCompletedCode)) {
        content = content.replace(oldPaymentCompletedCode, newPaymentCompletedCode);
        console.log(`Updated payment_completed_ in ${filePath}`);
    } else {
        // Try single line variation if multi-line match differs
        const regex = /await pool\.query\(\s*"UPDATE orders SET payment_status = 'CUSTOMER_CONFIRMED' WHERE id = \$1",\s*\[ordToUpdate\.id\]\s*\);/;
        if (regex.test(content)) {
            content = content.replace(regex, newPaymentCompletedCode);
            console.log(`Updated payment_completed_ via regex in ${filePath}`);
        } else {
            console.log(`oldPaymentCompletedCode not found in ${filePath}`);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Finished processing ${filePath}`);
}

updateWhatsappManager('whatsappManager.js');
updateWhatsappManager('pos-app/server/whatsappManager.js');
