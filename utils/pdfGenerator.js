const PDFDocument = require('pdfkit');

/**
 * Formats a clean, professional WhatsApp text invoice & receipt with ZATCA / GST breakdown.
 */
function generateTextReceipt(order, biz) {
    const symbol = biz?.currency_code === 'USD' ? '$' : '₹';
    const restName = biz?.name || biz?.business_name || 'SaSLoop Restaurant';
    const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);
    
    let itemRows = items.map((item, i) => {
        const qty = item.qty || item.quantity || 1;
        const price = parseFloat(item.price || item.base_price || 0);
        return `${i + 1}. *${item.name || item.product_name}* x${qty} - ${symbol}${(price * qty).toFixed(2)}`;
    }).join('\n');

    const subtotal = parseFloat(order.total_price || 0) - parseFloat(order.delivery_charge || 0) - parseFloat(order.service_charge || 0) + parseFloat(order.discount_amount || 0);
    const taxCgst = parseFloat(order.tax_cgst || 0);
    const taxSgst = parseFloat(order.tax_sgst || 0);
    const delivery = parseFloat(order.delivery_charge || 0);
    const discount = parseFloat(order.discount_amount || 0);
    const total = parseFloat(order.total_price || 0);

    const dateStr = order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString();

    return `🧾 *OFFICIAL TAX INVOICE & RECEIPT*\n` +
           `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
           `🏢 *${restName.toUpperCase()}*\n` +
           `📍 ${biz?.address || 'Restaurant Address'}\n` +
           `📞 ${biz?.phone || biz?.contact_number || ''}\n` +
           `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
           `*Order Ref:* ${order.order_reference || order.bill_no || order.id}\n` +
           `*Date:* ${dateStr}\n` +
           `*Customer:* ${order.customer_name || 'Guest'}\n` +
           `*Payment:* ${order.payment_method || 'CASH'} (${order.payment_status || 'PAID'})\n` +
           `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
           `*ITEMS ORDERED:*\n` +
           `${itemRows}\n` +
           `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
           (discount > 0 ? `*Subtotal:* ${symbol}${subtotal.toFixed(2)}\n*Discount:* -${symbol}${discount.toFixed(2)}\n` : '') +
           (taxCgst > 0 ? `*CGST:* ${symbol}${taxCgst.toFixed(2)}\n` : '') +
           (taxSgst > 0 ? `*SGST:* ${symbol}${taxSgst.toFixed(2)}\n` : '') +
           (delivery > 0 ? `*Delivery Fee:* ${symbol}${delivery.toFixed(2)}\n` : '') +
           `💰 *TOTAL PAID: ${symbol}${total.toFixed(2)}*\n` +
           `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
           `Thank you for dining with us! 🙏✨`;
}

/**
 * Generates an executive PDF Tax Invoice & Receipt document buffer
 */
function generatePdfBuffer(order, biz) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 40 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            const symbol = biz?.currency_code === 'USD' ? '$' : 'Rs ';
            const restName = (biz?.name || biz?.business_name || 'SHAHE TEHZEEB RESTAURANT').toUpperCase();
            const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);
            const dateStr = order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString();

            // Brand Header
            doc.fillColor('#0F172A').fontSize(22).font('Helvetica-Bold').text(restName, 40, 40);
            doc.fillColor('#059669').fontSize(10).font('Helvetica-Bold').text('OFFICIAL TAX INVOICE & RECEIPT', 40, 68);
            
            // Restaurant Address & Info
            doc.fillColor('#475569').fontSize(9).font('Helvetica').text(biz?.address || 'Restaurant Address', 40, 85);
            if (biz?.phone || biz?.contact_number) {
                doc.text(`Phone: ${biz?.phone || biz?.contact_number}`, 40, 98);
            }

            // Divider
            doc.moveTo(40, 115).lineTo(555, 115).strokeColor('#E2E8F0').lineWidth(1.5).stroke();

            // Order & Customer Details (2 columns)
            doc.fillColor('#0F172A').fontSize(9).font('Helvetica-Bold');
            doc.text(`Order Reference: #${order.order_reference || order.bill_no || order.id}`, 40, 125);
            doc.text(`Date & Time: ${dateStr}`, 40, 140);

            doc.text(`Customer Name: ${order.customer_name || 'POS Guest'}`, 320, 125);
            doc.text(`Payment Status: ${(order.payment_method || 'CASH')} (${order.payment_status || 'PAID'})`, 320, 140);

            // Table Header
            let y = 170;
            doc.rect(40, y, 515, 24).fill('#0F172A');
            doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
            doc.text('ITEM DESCRIPTION', 50, y + 7);
            doc.text('QTY', 340, y + 7, { width: 50, align: 'center' });
            doc.text('PRICE', 400, y + 7, { width: 60, align: 'right' });
            doc.text('AMOUNT', 475, y + 7, { width: 70, align: 'right' });

            y += 24;

            // Items Rows
            items.forEach((item, index) => {
                const qty = item.qty || item.quantity || 1;
                const price = parseFloat(item.price || item.base_price || 0);
                const itemTotal = qty * price;

                const bg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
                doc.rect(40, y, 515, 22).fill(bg);

                doc.fillColor('#1E293B').fontSize(9).font('Helvetica-Bold');
                doc.text(item.name || item.product_name || 'Item', 50, y + 6, { width: 280 });
                doc.font('Helvetica');
                doc.text(`${qty}`, 340, y + 6, { width: 50, align: 'center' });
                doc.text(`${symbol}${price.toFixed(2)}`, 400, y + 6, { width: 60, align: 'right' });
                doc.font('Helvetica-Bold');
                doc.text(`${symbol}${itemTotal.toFixed(2)}`, 475, y + 6, { width: 70, align: 'right' });

                y += 22;
            });

            // Divider
            doc.moveTo(40, y + 5).lineTo(555, y + 5).strokeColor('#CBD5E1').lineWidth(1).stroke();
            y += 15;

            // Totals Summary Box
            const subtotal = parseFloat(order.total_price || 0) - parseFloat(order.delivery_charge || 0) - parseFloat(order.service_charge || 0) + parseFloat(order.discount_amount || 0);
            const taxCgst = parseFloat(order.tax_cgst || 0);
            const taxSgst = parseFloat(order.tax_sgst || 0);
            const delivery = parseFloat(order.delivery_charge || 0);
            const discount = parseFloat(order.discount_amount || 0);
            const grandTotal = parseFloat(order.total_price || 0);

            doc.fillColor('#475569').fontSize(9).font('Helvetica');
            
            if (discount > 0) {
                doc.text('Subtotal:', 350, y);
                doc.text(`${symbol}${subtotal.toFixed(2)}`, 475, y, { width: 70, align: 'right' });
                y += 16;

                doc.text('Discount Granted:', 350, y);
                doc.text(`-${symbol}${discount.toFixed(2)}`, 475, y, { width: 70, align: 'right' });
                y += 16;
            }

            if (taxCgst > 0) {
                doc.text('CGST:', 350, y);
                doc.text(`${symbol}${taxCgst.toFixed(2)}`, 475, y, { width: 70, align: 'right' });
                y += 16;
            }

            if (taxSgst > 0) {
                doc.text('SGST:', 350, y);
                doc.text(`${symbol}${taxSgst.toFixed(2)}`, 475, y, { width: 70, align: 'right' });
                y += 16;
            }

            if (delivery > 0) {
                doc.text('Delivery Charges:', 350, y);
                doc.text(`${symbol}${delivery.toFixed(2)}`, 475, y, { width: 70, align: 'right' });
                y += 16;
            }

            // Grand Total Box
            doc.rect(340, y + 4, 215, 26).fill('#0F172A');
            doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold');
            doc.text('GRAND TOTAL PAID', 350, y + 12);
            doc.text(`${symbol}${grandTotal.toFixed(2)}`, 475, y + 12, { width: 70, align: 'right' });

            // Footer
            doc.fillColor('#64748B').fontSize(9).font('Helvetica-Oblique').text('Thank you for dining with us! We appreciate your business. 🙏✨', 40, 750, { align: 'center' });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    generateTextReceipt,
    generatePdfBuffer
};
