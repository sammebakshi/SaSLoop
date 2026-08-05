const fs = require('fs');
const path = require('path');
const { generateThermalPdfBuffer } = require('../utils/pdfGenerator');

async function testPdf() {
    try {
        const order = {
            order_reference: 'WFZDM6S',
            bill_no: 'WFZDM6S',
            customer_name: 'Sajad Bakshi',
            created_at: new Date(),
            payment_method: 'UPI',
            payment_status: 'PAID',
            order_type: 'PICKUP',
            total_price: 1020.00,
            items: [
                { name: 'RISTA', qty: 3, price: 180.00 },
                { name: 'KABAB (HALF)', qty: 1, price: 130.00 },
                { name: 'AFGHANI CHICKEN (HALF)', qty: 1, price: 350.00 }
            ]
        };

        const biz = {
            name: 'Shahe Tehzeeb Restaurant',
            address: 'NH1, Nizjipur, Wussan, کنگن تحصیل, ضلع گاندربل, Jammu and Kashmir, 191201, India',
            phone: '9906123989',
            currency_code: 'INR'
        };

        const buf = await generateThermalPdfBuffer(order, biz);
        fs.writeFileSync(path.join(__dirname, 'test_bill.pdf'), buf);
        console.log("PDF generated successfully! Size:", buf.length, "bytes");

    } catch (e) {
        console.error(e);
    }
}

testPdf();
