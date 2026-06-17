const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\backend\\whatsappManager.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the msgType/msg undefined variables bug
content = content.replace(
    /if \(msgType === 'location'\) \{[\s\S]*?const \{ latitude, longitude \} = msg\.location;/,
    "if (message.type === 'location') {\n            const { latitude, longitude } = message.location;"
);

// 2. Fix the state/updateSession bug in location handler (pass session.state)
content = content.replace(
    /await updateSession\(userId, customerNumber, ctx\);/,
    "await updateSessionState(userId, customerNumber, session.state, ctx);"
);

// 3. Update finalizeConversationalOrder to pass deliveryCharge
content = content.replace(
    /const redeem = session\.context\.redeem_points \|\| 0;[\s\S]*?await finalizeOrder\(userId, customerNumber, customerName, cart, symbol, orderType, address, tableId, redeem\);/,
    "const redeem = session.context.redeem_points || 0;\n    const deliveryCharge = session.context.delivery_charge || 0;\n    await finalizeOrder(userId, customerNumber, customerName, cart, symbol, orderType, address, tableId, redeem, deliveryCharge);"
);

// 4. Update finalizeOrder signature
content = content.replace(
    /const finalizeOrder = async \(userId, customerNumber, customerName, cart, symbol, orderType, address, tableNumber = null, pointsToRedeem = 0\) => \{/,
    "const finalizeOrder = async (userId, customerNumber, customerName, cart, symbol, orderType, address, tableNumber = null, pointsToRedeem = 0, deliveryCharge = 0) => {"
);

// 5. Inject delivery charge calc into finalizeOrder
content = content.replace(
    /if \(ptsEnabled && pointsToRedeem > 0\) \{[\s\S]*?finalGrandTotal = Math\.max\(0, finalGrandTotal - discountAmount\);\n\s+\}/,
    `if (ptsEnabled && pointsToRedeem > 0) {
            discountAmount = pointsToRedeem / ptsRatio;
            finalGrandTotal = Math.max(0, finalGrandTotal - discountAmount);
        }
        if (orderType === 'delivery') {
            finalGrandTotal += parseFloat(deliveryCharge) || 0;
        }`
);

// 6. Update INSERT query in finalizeOrder
content = content.replace(
    /INSERT INTO orders \(user_id, customer_name, customer_number, address, items, total_price, order_reference, status, table_number\)/,
    "INSERT INTO orders (user_id, customer_name, customer_number, address, items, total_price, order_reference, status, table_number, delivery_charge)"
);
content = content.replace(
    /VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9\)/,
    "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
);
content = content.replace(
    /\[userId, customerName, normalizePhone\(customerNumber\), \n\s+orderType === 'delivery' \? \(address \|\| 'Delivery'\) : \(tableNumber \? \`Table \$\{tableNumber\}\` : 'Pickup'\),\n\s+JSON\.stringify\(cart\), finalGrandTotal, orderRef, 'PENDING', tableNumber\]/,
    `[userId, customerName, normalizePhone(customerNumber), 
             orderType === 'delivery' ? (address || 'Delivery') : (tableNumber ? \`Table \${tableNumber}\` : 'Pickup'),
             JSON.stringify(cart), finalGrandTotal, orderRef, 'PENDING', tableNumber, deliveryCharge]`
);

// 7. Add delivery charge to receipt message (confirmMsg)
content = content.replace(
    /if \(discountAmount > 0\) \{[\s\S]*?receiptParts\.push\(\`🎁 Loyalty Discount: -\$\{symbol\}\$\{discountAmount\.toFixed\(2\)\}\`\);\n\s+\}/,
    `if (discountAmount > 0) {
            receiptParts.push(\`🎁 Loyalty Discount: -\${symbol}\${discountAmount.toFixed(2)}\`);
        }
        if (orderType === 'delivery' && deliveryCharge > 0) {
            receiptParts.push(\`🚚 Delivery Charge: +\${symbol}\${parseFloat(deliveryCharge).toFixed(2)}\`);
        }`
);

// 8. Add location prompt to AWAITING_LOCATION state
content = content.replace(
    /🚚 \*Order Summary \(Delivery\)\*\\n\\n\$\{cartLines\.join\("\\n"\)\}\\n\\n\*Address:\* \$\{address\}\\n\*Total:\* \$\{symbol\}\$\{finalGrandDisplay\.toFixed\(2\)\}\$\{discount > 0 \? \` \(after \$\{symbol\}\$\{discount\} loyalty discount\)\` : ''\}\\n\\nFinalizing your delivery\.\.\./,
    `🚚 *Order Summary (Delivery)*\\n\\n\${cartLines.join("\\n")}\\n\\n*Address:* \${address}\${parseFloat(session.context.delivery_charge) > 0 ? \`\\n*Delivery Charge:* \${symbol}\${session.context.delivery_charge}\` : (session.context.order_type === 'delivery' && !session.context.delivery_charge ? \`\\n_(Note: Share your Live Location pin next time for automatic delivery charge detection)_\` : '')}\\n*Total:* \${symbol}\${finalGrandDisplay.toFixed(2)}\${discount > 0 ? \` (after \$\{symbol\}\$\{discount\} loyalty discount)\` : ''}\\n\\nFinalizing your delivery...`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully patched whatsappManager.js");
