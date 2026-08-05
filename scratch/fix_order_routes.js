const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split(/\r?\n/);
    
    // Find "router.put("/:id""
    let putIdx = lines.findIndex(l => l.includes('router.put("/:id"'));
    if (putIdx === -1) {
        console.error('Could not find router.put("/:id") in ' + filePath);
        return;
    }
    
    // Find checkRes inside put
    let checkResIdx = lines.findIndex((l, idx) => idx > putIdx && l.includes('const checkRes = await pool.query'));
    
    // Find "const result = await pool.query" inside put
    let updateQueryIdx = lines.findIndex((l, idx) => idx > putIdx && l.includes('UPDATE orders SET'));

    console.log(`Found putIdx: ${putIdx}, checkResIdx: ${checkResIdx}, updateQueryIdx: ${updateQueryIdx}`);

    const newCode = `    const existingOrder = checkRes.rows[0];

    const {
      customer_name, customer_number, customer_phone, items, total_price,
      payment_method, status, table_id, order_type,
      address, table_number, discount, discount_amount, tax_cgst, tax_sgst, tip_amount, bill_no,
      delivery_charge, service_charge, subtotal,
      paid_amount, credit_amount, waiter_id, charge_details,
      pre_order_scheduled_date, pre_order_scheduled_time,
      coupon_code, rider_id, points_redeemed
    } = req.body;

    const finalItems = items !== undefined 
      ? JSON.stringify(items) 
      : (typeof existingOrder.items === 'string' ? existingOrder.items : JSON.stringify(existingOrder.items || []));
    const finalCustomerName = customer_name !== undefined ? customer_name : (existingOrder.customer_name || 'Walk-in');
    const cleanCust = customer_number || customer_phone || '';
    const cleanCustomerNumber = cleanCust !== '' ? cleanCust : (existingOrder.customer_number || '');
    const finalCustomerNumber = cleanCustomerNumber;
    const finalTotalPrice = total_price !== undefined ? total_price : existingOrder.total_price;
    const finalStatus = status !== undefined ? status : existingOrder.status;
    const finalOrderType = order_type !== undefined ? order_type : (existingOrder.order_type || 'QUICK');
    const finalAddress = address !== undefined ? address : (existingOrder.address || 'POS');
    const finalTableNumber = table_number !== undefined ? table_number : (table_id ? table_id.toString() : (existingOrder.table_number || '0'));
    const finalWaiterId = waiter_id !== undefined ? (waiter_id || null) : existingOrder.waiter_id;
    const finalRiderId = rider_id !== undefined ? (rider_id || null) : existingOrder.rider_id;
    const finalDeliveryCharge = delivery_charge !== undefined ? parseFloat(delivery_charge) : parseFloat(existingOrder.delivery_charge || 0);
    const finalServiceCharge = service_charge !== undefined ? parseFloat(service_charge) : parseFloat(existingOrder.service_charge || 0);
    const finalDiscount = discount !== undefined ? discount : (discount_amount !== undefined ? discount_amount : (existingOrder.discount_amount || 0));

    let upperMethod = String(payment_method || existingOrder.payment_method || 'CASH').trim().toUpperCase();
    if (upperMethod === 'DUE') {
      upperMethod = 'CREDIT';
    }

    const finalPaidAmount = (upperMethod === 'CREDIT') ? 0 : 
                            ((upperMethod === 'SPLIT') ? (parseFloat(paid_amount) || 0) : 
                             (parseFloat(paid_amount) > parseFloat(finalTotalPrice) ? parseFloat(paid_amount) : parseFloat(finalTotalPrice || 0)));
    const finalCreditAmount = (upperMethod === 'CREDIT') ? parseFloat(finalTotalPrice || 0) : 
                              ((upperMethod === 'SPLIT') ? (parseFloat(credit_amount) || 0) : 0);

    let paymentStatus = existingOrder.payment_status || 'PENDING';
    if (payment_method || status) {
      if (upperMethod === 'CREDIT') {
        paymentStatus = 'UNPAID';
      } else if (upperMethod === 'SPLIT') {
        if (finalCreditAmount > 0 && finalPaidAmount > 0) {
          paymentStatus = 'PARTIALLY_PAID';
        } else if (finalCreditAmount > 0) {
          paymentStatus = 'UNPAID';
        } else {
          paymentStatus = 'PAID';
        }
      } else if (upperMethod === 'CASH' || finalStatus === 'COMPLETED') {
        paymentStatus = 'PAID';
      }
    }`;

    // Start replacing from 3 lines after checkResIdx up to updateQueryIdx - 1
    let startReplaceIdx = checkResIdx + 4; // After checkRes.rows.length === 0 check
    let endReplaceIdx = updateQueryIdx - 2;

    lines.splice(startReplaceIdx, endReplaceIdx - startReplaceIdx + 1, newCode);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Updated ${filePath} successfully!`);
}

fixFile('routes/orderRoutes.js');
fixFile('pos-app/server/routes/orderRoutes.js');
