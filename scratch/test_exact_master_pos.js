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
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const numToWords = (n) => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
        if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
        if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
        return numToWords(Math.floor(n / 10000000)) + ' crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };

    const val = Math.floor(Math.abs(num));
    if (val === 0) return 'zero only';
    return numToWords(val) + ' only';
}

function generateUniformMarginMasterPdfBuffer(order, biz) {
    return new Promise((resolve, reject) => {
        try {
            const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);
            
            const baseHeight = 270;
            const itemHeight = items.reduce((acc, item) => {
                const name = cleanPdfText(item.name || item.product_name || 'Item');
                const opt = cleanPdfText(item.selectedOption?.name || item.variant || item.size || item.option_name || '');
                let h = name.length > 18 ? 24 : 14;
                if (opt) h += 12;
                return acc + h;
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
            const cleanAddress = cleanPdfText(biz?.address || '1st Floor Rather Plaza Kangan J&K-191202');
            const cleanPhone = cleanPdfText(biz?.phone || biz?.contact_number || '9906123989');
            const gstNo = cleanPdfText(biz?.gst_no || '01BNIPB3099J1Z4');
            const fssaiNo = cleanPdfText(biz?.fssai_no || '');

            const d = order.created_at ? new Date(order.created_at) : new Date();
            const dayStr = String(d.getDate()).padStart(2, '0');
            const monthStr = String(d.getMonth() + 1).padStart(2, '0');
            const yearStr = d.getFullYear();
            let hours = d.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const hoursStr = String(hours).padStart(2, '0');
            const minutesStr = String(d.getMinutes()).padStart(2, '0');
            const secondsStr = String(d.getSeconds()).padStart(2, '0');
            const dateStr = `${dayStr}-${monthStr}-${yearStr} ${hoursStr}:${minutesStr}:${secondsStr} ${ampm}`;

            const billNo = cleanPdfText(order.bill_no || order.order_reference || order.id || '1');
            const customerName = cleanPdfText(order.customer_name || 'Walk-in');

            let orderType = cleanPdfText(order.order_type || '').toUpperCase();
            if (!orderType || orderType === 'WHATSAPP' || orderType === 'POS') {
                if (order.table_number && String(order.table_number) !== "0") {
                    orderType = 'DINE IN';
                } else if (order.address && order.address.toLowerCase() === 'pickup') {
                    orderType = 'PICKUP';
                } else if (order.address && order.address.length > 5) {
                    orderType = 'DELIVERY';
                } else {
                    orderType = 'PICKUP';
                }
            }

            // Uniform 12pt margins on all sides (Content width = 202.77 pt)
            const marginX = 12;
            const contentWidth = 202.77;
            const endX = marginX + contentWidth; // 214.77
            let y = 14;

            // Brand Header (Centered)
            doc.fillColor('#000000').fontSize(12.5).font('Helvetica-Bold').text(restName, marginX, y, { width: contentWidth, align: 'center' });
            y += doc.heightOfString(restName, { width: contentWidth }) + 4;

            // Address Lines (Centered, Subdued)
            if (cleanAddress) {
                doc.fontSize(8).font('Helvetica').fillColor('#444444').text(cleanAddress, marginX, y, { width: contentWidth, align: 'center' });
                y += doc.heightOfString(cleanAddress, { width: contentWidth }) + 2;
            }

            if (cleanPhone) {
                doc.fontSize(8).font('Helvetica').fillColor('#444444').text(`Contact No: ${cleanPhone}`, marginX, y, { width: contentWidth, align: 'center' });
                y += 11;
            }

            if (gstNo) {
                doc.fontSize(8).font('Helvetica').fillColor('#444444').text(`GSTIN: ${gstNo}`, marginX, y, { width: contentWidth, align: 'center' });
                y += 11;
            }
            if (fssaiNo) {
                doc.fontSize(8).font('Helvetica').fillColor('#444444').text(`FSSAI Lic No: ${fssaiNo}`, marginX, y, { width: contentWidth, align: 'center' });
                y += 11;
            }

            // Date & Time (Centered)
            doc.fontSize(8).font('Helvetica').fillColor('#444444').text(dateStr, marginX, y, { width: contentWidth, align: 'center' });
            y += 13;

            // Dashed Line
            const drawDashedLine = (currY) => {
                doc.save();
                doc.moveTo(marginX, currY).lineTo(endX, currY).dash(3, { space: 2 }).strokeColor('#444444').lineWidth(0.8).stroke();
                doc.restore();
            };

            drawDashedLine(y);
            y += 6;

            // 2-Column Info Section (Strictly bounded)
            doc.fillColor('#000000').fontSize(8);

            const leftX = marginX;
            const rightX = marginX + 105; // 117
            const rightColWidth = 97.77;  // 117 + 97.77 = 214.77

            let tableLabel = order.table_number && String(order.table_number) !== "0" ? `T${order.table_number}` : customerName;
            if (tableLabel.length > 14) tableLabel = tableLabel.substring(0, 14);

            // Left Col
            doc.font('Helvetica-Bold').text('Table: ', leftX, y, { width: 35 });
            doc.font('Helvetica').text(tableLabel, leftX + 30, y, { width: 72 });

            doc.font('Helvetica-Bold').text('Order: ', leftX, y + 12, { width: 35 });
            doc.font('Helvetica').text(orderType, leftX + 30, y + 12, { width: 72 });

            doc.font('Helvetica-Bold').text('Waiter: ', leftX, y + 24, { width: 38 });
            doc.font('Helvetica').text(order.waiter_name || 'Default', leftX + 35, y + 24, { width: 67 });

            // Right Col
            doc.font('Helvetica-Bold').text('Bill: ', rightX, y, { width: 30 });
            doc.font('Helvetica').text(billNo, rightX + 25, y, { width: rightColWidth - 25, align: 'right' });

            doc.font('Helvetica-Bold').text('Payment: ', rightX, y + 12, { width: 45 });
            doc.font('Helvetica').text(order.payment_method || 'CASH', rightX + 42, y + 12, { width: rightColWidth - 42, align: 'right' });

            doc.font('Helvetica-Bold').text('User: ', rightX, y + 24, { width: 30 });
            doc.font('Helvetica').text(order.cashier || order.user_name || 'adminpos', rightX + 28, y + 24, { width: rightColWidth - 28, align: 'right' });

            y += 38;

            drawDashedLine(y);
            y += 6;

            // FOOD ITEMS Header
            doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#000000').text('FOOD ITEMS', marginX, y, { width: contentWidth, align: 'center' });
            y += 14;

            drawDashedLine(y);
            y += 6;

            // Items Table Header
            doc.fontSize(8).font('Helvetica-Bold');
            doc.text('Item Name', marginX, y, { width: 90, align: 'left' });
            doc.text('Qty.', marginX + 90, y, { width: 30, align: 'center' });
            doc.text('Amount', marginX + 120, y, { width: 40, align: 'right' });
            doc.text('Total', marginX + 160, y, { width: 42.77, align: 'right' });
            y += 12;

            drawDashedLine(y);
            y += 6;

            // Items List
            items.forEach((item, idx) => {
                const qty = parseFloat(item.qty || item.quantity || 1);
                const price = parseFloat(item.price || item.base_price || 0);
                const total = qty * price;
                const itemName = `${idx + 1}.${cleanPdfText(item.name || item.product_name || 'Item').toUpperCase()}`;
                const optionName = cleanPdfText(item.selectedOption?.name || item.variant || item.size || item.option_name || '');

                doc.fontSize(8).font('Helvetica-Bold').text(itemName, marginX, y, { width: 90, align: 'left' });
                doc.font('Helvetica-Bold').text(`${qty}`, marginX + 90, y, { width: 30, align: 'center' });
                doc.text(`${price.toFixed(2)}`, marginX + 120, y, { width: 40, align: 'right' });
                doc.font('Helvetica-Bold').text(`${total.toFixed(2)}`, marginX + 160, y, { width: 42.77, align: 'right' });

                y += 13;

                if (optionName) {
                    doc.fontSize(7.5).font('Helvetica-Bold').text(`  ${optionName.toUpperCase()}`, marginX + 8, y, { width: 82, align: 'left' });
                    y += 11;
                }
            });

            drawDashedLine(y);
            y += 6;

            // Totals Summary
            const subtotal = parseFloat(order.total_price || 0) - parseFloat(order.delivery_charge || 0) - parseFloat(order.service_charge || 0) + parseFloat(order.discount_amount || 0);
            const taxCgst = parseFloat(order.tax_cgst || 0);
            const taxSgst = parseFloat(order.tax_sgst || 0);
            const delivery = parseFloat(order.delivery_charge || 0);
            const discount = parseFloat(order.discount_amount || 0);
            const grandTotal = parseFloat(order.total_price || 0);

            doc.fontSize(8).font('Helvetica-Bold');

            doc.text('Amount:', marginX, y, { width: 115, align: 'right' });
            doc.text(`${symbol}${subtotal.toFixed(2)}`, marginX + 120, y, { width: 82.77, align: 'right' });
            y += 13;

            if (discount > 0) {
                doc.text('Discount:', marginX, y, { width: 115, align: 'right' });
                doc.text(`-${symbol}${discount.toFixed(2)}`, marginX + 120, y, { width: 82.77, align: 'right' });
                y += 13;
            }

            if (taxCgst > 0) {
                doc.text('CGST:', marginX, y, { width: 115, align: 'right' });
                doc.text(`${symbol}${taxCgst.toFixed(2)}`, marginX + 120, y, { width: 82.77, align: 'right' });
                y += 13;
            }

            if (taxSgst > 0) {
                doc.text('SGST:', marginX, y, { width: 115, align: 'right' });
                doc.text(`${symbol}${taxSgst.toFixed(2)}`, marginX + 120, y, { width: 82.77, align: 'right' });
                y += 13;
            }

            if (delivery > 0) {
                doc.text('Delivery Charge:', marginX, y, { width: 115, align: 'right' });
                doc.text(`${symbol}${delivery.toFixed(2)}`, marginX + 120, y, { width: 82.77, align: 'right' });
                y += 13;
            }

            drawDashedLine(y);
            y += 6;

            // Grand Total Row
            doc.fontSize(9.5).font('Helvetica-Bold');
            doc.text('Grand Total:', marginX, y, { width: 110, align: 'right' });
            doc.text(`${symbol}${grandTotal.toFixed(2)}`, marginX + 115, y, { width: 87.77, align: 'right' });
            y += 16;

            // Amount in Words (Italic lowercase)
            doc.fontSize(7.5).font('Helvetica-Oblique').fillColor('#555555');
            const wordsStr = numberToWordsINR(grandTotal);
            doc.text(wordsStr, marginX, y, { width: contentWidth, align: 'left' });
            y += doc.heightOfString(wordsStr, { width: contentWidth }) + 6;

            drawDashedLine(y);
            y += 7;

            // Footer
            doc.fillColor('#000000');
            doc.fontSize(9).font('Helvetica-Bold').text('THANK YOU! VISIT AGAIN', marginX, y, { width: contentWidth, align: 'center' });
            y += 13;
            doc.fontSize(7.5).font('Helvetica').fillColor('#666666').text('SaSLoop Master POS Version: 1.0.1', marginX, y, { width: contentWidth, align: 'center' });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

async function testUniformMargin() {
    const order = {
        bill_no: 'WGUJZUC',
        customer_name: 'Sajad Bakshi',
        order_type: 'PICKUP',
        waiter_name: 'Default',
        payment_method: 'UPI',
        user_name: 'adminpos',
        created_at: new Date('2026-08-02T04:04:54'),
        total_price: 360.00,
        items: [
            { name: 'RISTA', qty: 2, price: 180.00 }
        ]
    };

    const biz = {
        name: 'SHAHE TEHZEEB RESTAURANT',
        address: '1st Floor Rather Plaza Kangan J&K-191202',
        phone: '9906123989',
        gst_no: '01BNIPB3099J1Z4'
    };

    const buf = await generateUniformMarginMasterPdfBuffer(order, biz);
    fs.writeFileSync(path.join(__dirname, 'uniform_margin_master_bill_test.pdf'), buf);
    console.log("Uniform Margin PDF generated successfully! Size:", buf.length, "bytes");
}

testUniformMargin();
