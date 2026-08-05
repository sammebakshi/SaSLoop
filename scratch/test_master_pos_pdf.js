const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function cleanPdfText(str) {
    if (!str) return '';
    return String(str)
        .replace(/[^\x20-\x7E\n\r\t]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function numberToWordsINR(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const numToWords = (n) => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
        if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
        if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
        return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };

    const val = Math.floor(Math.abs(num));
    if (val === 0) return 'Rupees Zero Only';
    return 'Rupees ' + numToWords(val) + ' Only';
}

function generateThermalPdfBufferMaster(order, biz) {
    return new Promise((resolve, reject) => {
        try {
            const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);
            
            const baseHeight = 260;
            const itemHeight = items.reduce((acc, item) => {
                const name = cleanPdfText(item.name || item.product_name || 'Item');
                return acc + (name.length > 20 ? 28 : 18);
            }, 0);
            const summaryHeight = 150;
            const totalHeight = Math.max(400, baseHeight + itemHeight + summaryHeight);

            const doc = new PDFDocument({
                size: [226.77, totalHeight],
                margin: 0
            });

            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            const symbol = biz?.currency_code === 'USD' ? '$' : 'Rs ';
            const restName = cleanPdfText(biz?.name || biz?.business_name || 'SHAHE TEHZEEB RESTAURANT').toUpperCase();
            const cleanAddress = cleanPdfText(biz?.address);
            const cleanPhone = cleanPdfText(biz?.phone || biz?.contact_number);
            const dateStr = order.created_at ? new Date(order.created_at).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
            }) : new Date().toLocaleString();
            const orderRef = cleanPdfText(order.order_reference || order.bill_no || order.id || 'ORDER');
            const customerName = cleanPdfText(order.customer_name || 'Walk-in Customer');
            const customerPhone = cleanPdfText(order.customer_number || '');

            const marginX = 10;
            const contentWidth = 206.77;
            let y = 12;

            // Brand Header
            doc.fillColor('#000000').fontSize(11).font('Helvetica-Bold').text(restName, marginX, y, { width: contentWidth, align: 'center' });
            y += doc.heightOfString(restName, { width: contentWidth }) + 3;

            if (cleanAddress) {
                doc.fontSize(7.5).font('Helvetica').text(cleanAddress, marginX, y, { width: contentWidth, align: 'center' });
                y += doc.heightOfString(cleanAddress, { width: contentWidth }) + 2;
            }

            if (cleanPhone) {
                doc.fontSize(7.5).font('Helvetica').text(`Ph: ${cleanPhone}`, marginX, y, { width: contentWidth, align: 'center' });
                y += 10;
            }

            if (biz?.gst_no) {
                doc.fontSize(7.5).font('Helvetica').text(`GSTIN: ${cleanPdfText(biz.gst_no)}`, marginX, y, { width: contentWidth, align: 'center' });
                y += 10;
            }
            if (biz?.fssai_no) {
                doc.fontSize(7.5).font('Helvetica').text(`FSSAI Lic No: ${cleanPdfText(biz.fssai_no)}`, marginX, y, { width: contentWidth, align: 'center' });
                y += 10;
            }

            // Dashed Line
            const drawDashedLine = (currY) => {
                doc.save();
                doc.moveTo(marginX, currY).lineTo(marginX + contentWidth, currY).dash(3, { space: 2 }).strokeColor('#000000').lineWidth(0.8).stroke();
                doc.restore();
            };

            drawDashedLine(y);
            y += 5;

            // Receipt Type Header
            const billType = cleanPdfText(order.order_type || 'PICKUP INVOICE').toUpperCase();
            doc.fontSize(9).font('Helvetica-Bold').text(billType.includes('INVOICE') ? billType : `TAX INVOICE (${billType})`, marginX, y, { width: contentWidth, align: 'center' });
            y += 12;

            drawDashedLine(y);
            y += 5;

            // Order & Customer Details (Master POS Fields)
            doc.fontSize(7.5).font('Helvetica-Bold');
            doc.text(`Bill / Ref No: ${orderRef}`, marginX, y);
            doc.text(`Date & Time: ${dateStr}`, marginX, y + 10);
            doc.text(`Customer: ${customerName}`, marginX, y + 20);
            if (customerPhone) {
                doc.text(`Phone: ${customerPhone}`, marginX, y + 30);
                y += 10;
            }
            doc.text(`Order Type: ${(order.order_type || 'PICKUP').toUpperCase()}`, marginX, y + 30);
            doc.text(`Payment: ${order.payment_method || 'CASH'} (${order.payment_status || 'PAID'})`, marginX, y + 40);
            y += 52;

            drawDashedLine(y);
            y += 5;

            // Table Header
            doc.fontSize(7.5).font('Helvetica-Bold');
            doc.text('Item Description', marginX, y, { width: 105, align: 'left' });
            doc.text('Qty', marginX + 105, y, { width: 25, align: 'center' });
            doc.text('Rate', marginX + 130, y, { width: 35, align: 'right' });
            doc.text('Total', marginX + 165, y, { width: 41, align: 'right' });
            y += 11;

            drawDashedLine(y);
            y += 5;

            // Items List
            items.forEach((item, idx) => {
                const qty = parseFloat(item.qty || item.quantity || 1);
                const price = parseFloat(item.price || item.base_price || 0);
                const total = qty * price;
                const itemName = `${idx + 1}. ${cleanPdfText(item.name || item.product_name || 'Item').toUpperCase()}`;

                doc.fontSize(7.5).font('Helvetica-Bold').text(itemName, marginX, y, { width: 105, align: 'left' });
                doc.font('Helvetica').text(`${qty}`, marginX + 105, y, { width: 25, align: 'center' });
                doc.text(`${price.toFixed(2)}`, marginX + 130, y, { width: 35, align: 'right' });
                doc.font('Helvetica-Bold').text(`${total.toFixed(2)}`, marginX + 165, y, { width: 41, align: 'right' });

                const textH = doc.heightOfString(itemName, { width: 105 });
                y += Math.max(14, textH + 3);
            });

            drawDashedLine(y);
            y += 5;

            // Calculations & Summary
            const subtotal = parseFloat(order.total_price || 0) - parseFloat(order.delivery_charge || 0) - parseFloat(order.service_charge || 0) + parseFloat(order.discount_amount || 0);
            const taxCgst = parseFloat(order.tax_cgst || 0);
            const taxSgst = parseFloat(order.tax_sgst || 0);
            const delivery = parseFloat(order.delivery_charge || 0);
            const discount = parseFloat(order.discount_amount || 0);
            const grandTotal = parseFloat(order.total_price || 0);

            doc.fontSize(7.5).font('Helvetica');

            doc.text('Subtotal:', marginX, y);
            doc.text(`${symbol}${subtotal.toFixed(2)}`, marginX + 130, y, { width: 76, align: 'right' });
            y += 11;

            if (discount > 0) {
                doc.text('Discount Granted:', marginX, y);
                doc.text(`-${symbol}${discount.toFixed(2)}`, marginX + 130, y, { width: 76, align: 'right' });
                y += 11;
            }

            if (taxCgst > 0) {
                doc.text('CGST:', marginX, y);
                doc.text(`${symbol}${taxCgst.toFixed(2)}`, marginX + 130, y, { width: 76, align: 'right' });
                y += 11;
            }

            if (taxSgst > 0) {
                doc.text('SGST:', marginX, y);
                doc.text(`${symbol}${taxSgst.toFixed(2)}`, marginX + 130, y, { width: 76, align: 'right' });
                y += 11;
            }

            if (delivery > 0) {
                doc.text('Delivery Charge:', marginX, y);
                doc.text(`${symbol}${delivery.toFixed(2)}`, marginX + 130, y, { width: 76, align: 'right' });
                y += 11;
            }

            // Grand Total Highlight Box
            y += 3;
            doc.rect(marginX, y, contentWidth, 20).fill('#000000');
            doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
            doc.text('GRAND TOTAL:', marginX + 6, y + 5);
            doc.text(`${symbol}${grandTotal.toFixed(2)}`, marginX + 110, y + 5, { width: 90, align: 'right' });
            y += 24;

            // Amount in Words
            doc.fillColor('#000000').fontSize(7).font('Helvetica-BoldOblique');
            const wordsStr = numberToWordsINR(grandTotal);
            doc.text(`In Words: ${wordsStr}`, marginX, y, { width: contentWidth, align: 'center' });
            y += doc.heightOfString(`In Words: ${wordsStr}`, { width: contentWidth }) + 4;

            // Footer
            drawDashedLine(y);
            y += 5;

            doc.fontSize(8).font('Helvetica-Bold').text('THANK YOU FOR DINING WITH US!', marginX, y, { width: contentWidth, align: 'center' });
            y += 11;
            doc.fontSize(7).font('Helvetica').text('Powered by SaSLoop ERP | AI', marginX, y, { width: contentWidth, align: 'center' });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

async function testMaster() {
    const order = {
        order_reference: 'WR3L87F',
        bill_no: 'WR3L87F',
        customer_name: 'Sajad Bakshi',
        customer_number: '917006089744',
        created_at: new Date(),
        payment_method: 'Prepaid UPI',
        payment_status: 'PAID',
        order_type: 'PICKUP',
        total_price: 1350.00,
        items: [
            { name: 'RISTA', qty: 5, price: 180.00 },
            { name: 'GOSHTABA', qty: 2, price: 150.00 },
            { name: 'DANIYA KORMA', qty: 1, price: 150.00 }
        ]
    };

    const biz = {
        name: 'Shahe Tehzeeb Restaurant',
        address: '1st Floor Rather Plaza, Kangan, Jammu and Kashmir 191202',
        phone: '9906123989',
        currency_code: 'INR'
    };

    const buf = await generateThermalPdfBufferMaster(order, biz);
    fs.writeFileSync(path.join(__dirname, 'master_bill_test.pdf'), buf);
    console.log("Master PDF bill generated! Size:", buf.length, "bytes");
}

testMaster();
