const fs = require('fs');

const target = `    const tempOrder = {
      id: \`PREVIEW-\${Date.now()}\`,
      customer_name: customerName || "POS Guest",
      customer_phone: customerPhone,
      customer_number: customerPhone,
      items: activeCart.map(i => ({
        id: i.id,
        name: i.priceLabel ? \`\${i.product_name || i.name} (\${i.priceLabel})\` : (i.product_name || i.name),
        qty: i.quantity || i.qty || 1,
        price: i.price,
        modifiers: i.modifiers || [],
        kot_category: i.kot_category || "Main Kitchen"
      })),
      subtotal,
      discount: discountAmt,
      tax_cgst: cgst,
      tax_sgst: sgst,
      delivery_charge: extraFixed,
      charge_details: appliedAdditionalCharges.map(c => ({ name: c.name, type: c.type, value: parseFloat(c.value || 0), amount: c.type === 'percent' || c.type === 'PERCENT' ? (subtotal - discountAmt) * (parseFloat(c.value || 0) / 100) : parseFloat(c.value || 0) })),
      service_charge: serviceCharge,
      total_price: total,
      payment_method: 'CASH',
      reference_no: '',
      tip_amount: 0,
      status: 'PREVIEW',
      table_id: orderType === 'DINE_IN' ? selectedTable?.id : null,
      order_type: orderType === 'PICKUP' ? subOrderType : orderType,
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      bill_no: bNo,
      waiter_id: 'Default',
      waiter_name: 'Default'
    };`;

const normalizeCR = str => str.replace(/\r\n/g, '\n');
const normTarget = normalizeCR(target);

const checkFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const normFile = normalizeCR(content);
  console.log(`Checking ${filePath}...`);
  console.log(`  Target exists: ${normFile.includes(normTarget)}`);
  
  // Let's also check if it contains parts of the target
  const subtarget = `waiter_id: 'Default',`;
  console.log(`  Contains "waiter_id: 'Default',": ${normFile.includes(subtarget)}`);
};

checkFile('C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\App_reconstructed.jsx');
checkFile('C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\App_working_backup.jsx');
