package com.example.sasloopmanager.data

import java.io.OutputStream
import java.net.Socket
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object PrinterHelper {
    private val ESC_ALIGN_LEFT = byteArrayOf(0x1B, 0x61, 0x00)
    private val ESC_ALIGN_CENTER = byteArrayOf(0x1B, 0x61, 0x01)
    private val ESC_ALIGN_RIGHT = byteArrayOf(0x1B, 0x61, 0x02)
    private val ESC_BOLD_ON = byteArrayOf(0x1B, 0x45, 0x01)
    private val ESC_BOLD_OFF = byteArrayOf(0x1B, 0x45, 0x00)
    private val ESC_INIT = byteArrayOf(0x1B, 0x40)
    private val ESC_CUT = byteArrayOf(0x1D, 0x56, 0x41, 0x00)
    private val GS_TEXT_DOUBLE = byteArrayOf(0x1D, 0x21, 0x11)
    private val GS_TEXT_NORMAL = byteArrayOf(0x1D, 0x21, 0x00)

    suspend fun printToSocket(ip: String, port: Int = 9100, bytes: ByteArray): Boolean {
        return withContext(Dispatchers.IO) {
            var socket: Socket? = null
            var out: OutputStream? = null
            try {
                socket = Socket(ip, port)
                socket.soTimeout = 4000 // 4 seconds timeout
                out = socket.getOutputStream()
                out.write(bytes)
                out.flush()
                true
            } catch (e: Exception) {
                e.printStackTrace()
                false
            } finally {
                try {
                    out?.close()
                } catch (e: Exception) {}
                try {
                    socket?.close()
                } catch (e: Exception) {}
            }
        }
    }

    fun numberToWords(number: Double): String {
        val amount = number.toLong()
        if (amount == 0L) return "Zero Rupees"
        
        val units = arrayOf(
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        )
        val tens = arrayOf(
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        )
        
        fun convertLessThanThousand(n: Int): String {
            var res = ""
            if (n >= 100) {
                res += units[n / 100] + " Hundred"
                val rem = n % 100
                if (rem > 0) {
                    res += " and " + convertLessThanThousand(rem)
                }
            } else if (n >= 20) {
                res += tens[n / 10]
                val rem = n % 10
                if (rem > 0) {
                    res += " " + units[rem]
                }
            } else if (n > 0) {
                res += units[n]
            }
            return res.trim()
        }
        
        var temp = amount
        var words = ""
        
        val lakh = (temp / 100000).toInt()
        if (lakh > 0) {
            words += convertLessThanThousand(lakh) + " Lakh "
            temp %= 100000
        }
        
        val thousand = (temp / 1000).toInt()
        if (thousand > 0) {
            words += convertLessThanThousand(thousand) + " Thousand "
            temp %= 1000
        }
        
        if (temp > 0) {
            words += convertLessThanThousand(temp.toInt())
        }
        
        words = words.trim() + " Rupees"
        
        val paise = Math.round((number - amount) * 100).toInt()
        if (paise > 0) {
            words += " and " + convertLessThanThousand(paise) + " Paise"
        }
        
        return words.trim() + " Only"
    }

    private fun formatSummaryRow(label: String, value: String, widthChars: Int): String {
        val valueWidth = if (widthChars == 32) 12 else 18
        val labelWidth = widthChars - valueWidth
        return String.format(Locale.US, "%${labelWidth}s%${valueWidth}s\n", label, value)
    }

    private fun formatGridRow(left: String, right: String, widthChars: Int): String {
        val half = widthChars / 2
        val l = if (left.length > half) left.take(half) else left.padEnd(half)
        val r = if (right.length > half) right.take(half) else right.padStart(half)
        return l + r + "\n"
    }

    private fun formatItemRow(name: String, qty: String, price: String, total: String, widthChars: Int): String {
        val itemW = if (widthChars == 32) 12 else 20
        val qtyW = if (widthChars == 32) 4 else 6
        val priceW = if (widthChars == 32) 8 else 11
        val totalW = if (widthChars == 32) 8 else 11

        val namePart = if (name.length > itemW) name.take(itemW) else name.padEnd(itemW)
        
        // Center qty
        val qtyPaddingLeft = Math.max(0, (qtyW - qty.length) / 2)
        val qtyPart = " ".repeat(qtyPaddingLeft) + qty + " ".repeat(Math.max(0, qtyW - qty.length - qtyPaddingLeft))
        
        // Right align price and total
        val pricePart = price.padStart(priceW)
        val totalPart = total.padStart(totalW)

        var result = namePart + qtyPart + pricePart + totalPart + "\n"
        
        if (name.length > itemW) {
            result += name.substring(itemW) + "\n"
        }
        return result
    }

    private fun getQrCodeBytes(data: String): ByteArray {
        val list = mutableListOf<Byte>()
        val dataBytes = data.toByteArray(Charsets.UTF_8)
        val len = dataBytes.size + 3
        val lenL = (len % 256).toByte()
        val lenH = (len / 256).toByte()

        // 1. Set size of module (width of QR) to 6 (default is 3, 6-8 is good size)
        list.addAll(listOf(0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, 0x06).map { it.toByte() })

        // 2. Set error correction level to 'M' (49)
        list.addAll(listOf(0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x49).map { it.toByte() })

        // 3. Store QR data
        list.addAll(listOf(0x1D, 0x28, 0x6B, lenL, lenH, 0x31, 0x50, 0x30).map { it.toByte() })
        list.addAll(dataBytes.toList())

        // 4. Print QR
        list.addAll(listOf(0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30).map { it.toByte() })

        return list.toByteArray()
    }

    fun generateKOTBytes(
        tableName: String,
        kotId: String,
        items: Map<MenuItem, Int>,
        notes: String,
        waiterName: String?,
        settings: PosSettings
    ): ByteArray {
        val list = mutableListOf<Byte>()
        val widthChars = if (settings.printerType == "THERMAL_58MM") 32 else 48

        // Init
        list.addAll(ESC_INIT.toList())
        
        // Business Header Center Bold
        list.addAll(ESC_ALIGN_CENTER.toList())
        list.addAll(ESC_BOLD_ON.toList())
        val businessName = (settings.businessName.takeIf { it.isNotBlank() }
            ?: settings.receiptHeader.takeIf { it.isNotBlank() }
            ?: "SHAHE TEHZEEB RESTAURANT").uppercase(Locale.US)
        list.addAll("$businessName\n".toByteArray(Charsets.US_ASCII).toList())
        list.addAll(ESC_BOLD_OFF.toList())
        
        // Date/Time
        val sdf = SimpleDateFormat("dd-MM-yyyy HH:mm:ss", Locale.US)
        list.addAll("${sdf.format(Date())}\n".toByteArray(Charsets.US_ASCII).toList())
        
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Table Name and KOT ID (Double Size Center)
        list.addAll(ESC_ALIGN_LEFT.toList())
        list.addAll(ESC_BOLD_ON.toList())
        list.addAll(GS_TEXT_DOUBLE.toList())
        val nameLabel = if (tableName.isBlank() || tableName == "0") "Takeaway Order" else tableName
        val doubleWidth = widthChars / 2
        val kotLabel = "KOT: $kotId"
        val spaceNeeded = doubleWidth - nameLabel.length - kotLabel.length
        val rowStr = if (spaceNeeded > 0) {
            nameLabel + " ".repeat(spaceNeeded) + kotLabel
        } else {
            "$nameLabel\n$kotLabel"
        }
        list.addAll("$rowStr\n".toByteArray(Charsets.US_ASCII).toList())
        list.addAll(GS_TEXT_NORMAL.toList())
        list.addAll(ESC_BOLD_OFF.toList())
        
        // Waiter Name
        list.addAll("Waiter: ${waiterName ?: "Default"}\n".toByteArray(Charsets.US_ASCII).toList())
        
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Columns header
        list.addAll(ESC_BOLD_ON.toList())
        val colWidth = widthChars - 6
        list.addAll(String.format(Locale.US, "%-${colWidth}s%6s\n", "Item Name", "Qty.").toByteArray().toList())
        list.addAll(ESC_BOLD_OFF.toList())
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Items List
        var idx = 1
        items.forEach { (item, qty) ->
            val name = "$idx.${item.displayName.uppercase(Locale.US)}"
            val qtyStr = qty.toString()
            idx++
            
            val maxNameWidth = widthChars - 7
            if (name.length > maxNameWidth) {
                list.addAll(String.format(Locale.US, "%-${maxNameWidth}s %5s\n", name.take(maxNameWidth), qtyStr).toByteArray().toList())
                list.addAll(String.format(Locale.US, "  %s\n", name.substring(maxNameWidth)).toByteArray().toList())
            } else {
                list.addAll(String.format(Locale.US, "%-${maxNameWidth}s %5s\n", name, qtyStr).toByteArray().toList())
            }
            
            if (item.selectedModifiers?.isNotEmpty() == true) {
                item.selectedModifiers.forEach { mod ->
                    list.addAll("  + ${mod.name.uppercase(Locale.US)}\n".toByteArray().toList())
                }
            }
            if (!item.kitchenNote.isNullOrBlank()) {
                list.addAll("  * NOTE: ${item.kitchenNote.uppercase(Locale.US)}\n".toByteArray().toList())
            }
        }
        
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        if (notes.isNotBlank()) {
            list.addAll(ESC_BOLD_ON.toList())
            list.addAll("KOT NOTE:\n".toByteArray().toList())
            list.addAll(ESC_BOLD_OFF.toList())
            list.addAll("$notes\n".toByteArray().toList())
            list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        }
        
        // Feed and cut
        list.addAll("\n\n\n\n".toByteArray().toList())
        list.addAll(ESC_CUT.toList())
        
        return list.toByteArray()
    }

    fun generateBillBytes(
        billNo: String,
        customerName: String,
        customerPhone: String,
        customerAddress: String,
        orderType: String,
        items: Map<MenuItem, Int>,
        subtotal: Double,
        discount: Double,
        cgst: Double,
        sgst: Double,
        serviceCharge: Double,
        deliveryCharge: Double,
        finalTotal: Double,
        tableName: String,
        waiterName: String?,
        settings: PosSettings,
        preOrderAdvance: Double = 0.0,
        preOrderBalance: Double = 0.0,
        paymentMethod: String = "CASH",
        userName: String = "admin",
        referenceNo: String = "",
        tipAmount: Double = 0.0
    ): ByteArray {
        val list = mutableListOf<Byte>()
        val widthChars = if (settings.printerType == "THERMAL_58MM") 32 else 48

        // Init
        list.addAll(ESC_INIT.toList())
        
        // Business Header Center Bold
        list.addAll(ESC_ALIGN_CENTER.toList())
        list.addAll(ESC_BOLD_ON.toList())
        val businessName = (settings.businessName.takeIf { it.isNotBlank() }
            ?: settings.receiptHeader.takeIf { it.isNotBlank() }
            ?: "SHAHE TEHZEEB RESTAURANT").uppercase(Locale.US)
        list.addAll("$businessName\n".toByteArray(Charsets.US_ASCII).toList())
        list.addAll(ESC_BOLD_OFF.toList())
        
        // Address Lines
        val displayAddress = settings.address.ifBlank { "Ist Floor Rather Plaza Kangan\nJ&K-191202" }
        displayAddress.split("\n").forEach { line ->
            list.addAll("${line.trim()}\n".toByteArray(Charsets.US_ASCII).toList())
        }
        
        // Contact No
        val displayPhone = settings.phone.ifBlank { "9906123989" }
        list.addAll("Contact No: ${displayPhone.trim()}\n".toByteArray(Charsets.US_ASCII).toList())
        
        // GSTIN
        val displayGstin = settings.gstin.ifBlank { "01BNIPB3099J1Z4" }
        list.addAll("GSTIN : ${displayGstin.trim()}\n".toByteArray(Charsets.US_ASCII).toList())
        
        // Date/Time
        val d = Date()
        val day = SimpleDateFormat("dd-MM-yyyy", Locale.US).format(d)
        val time24 = SimpleDateFormat("HH:mm:ss", Locale.US).format(d)
        val ampm = SimpleDateFormat("a", Locale.US).format(d).uppercase(Locale.US)
        val dateStr = "$day $time24 $ampm"
        list.addAll("$dateStr\n".toByteArray(Charsets.US_ASCII).toList())
        
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Section Title: RETAIL INVOICE
        list.addAll(ESC_BOLD_ON.toList())
        val isPreOrder = orderType.equals("PRE-ORDER", ignoreCase = true)
        val sectionTitle = if (isPreOrder) "PRE-ORDER BOOKING RECEIPT" else "RETAIL INVOICE"
        list.addAll("$sectionTitle\n".toByteArray(Charsets.US_ASCII).toList())
        list.addAll(ESC_BOLD_OFF.toList())
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Details Grid (2-column side-by-side)
        list.addAll(ESC_ALIGN_LEFT.toList())
        val tblName = if (tableName.isBlank() || tableName == "0") "Direct" else tableName
        
        val payMethodStr = paymentMethod + (if (referenceNo.isNotBlank()) " ($referenceNo)" else "")
        list.addAll(formatGridRow("Table: $tblName", "Bill: $billNo", widthChars).toByteArray(Charsets.US_ASCII).toList())
        list.addAll(formatGridRow("Order: $orderType", "Payment: $payMethodStr", widthChars).toByteArray(Charsets.US_ASCII).toList())
        list.addAll(formatGridRow("Waiter: ${waiterName ?: "Default"}", "User: $userName", widthChars).toByteArray(Charsets.US_ASCII).toList())
        
        // Customer Info if present
        val ignoredNames = listOf("pos guest", "table guest", "walk-in", "")
        val isTableName = customerName.trim().lowercase(Locale.US) == tableName.trim().lowercase(Locale.US)
        val hasValidCustName = customerName.trim().lowercase(Locale.US) !in ignoredNames && !isTableName
        val hasValidCustPhone = customerPhone.isNotBlank()
        val ignoredAddresses = listOf("dine-in", "dine in", "pickup", "takeaway", "")
        val hasValidCustAddress = customerAddress.trim().lowercase(Locale.US) !in ignoredAddresses

        if (hasValidCustName || hasValidCustPhone || hasValidCustAddress) {
            list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
            if (hasValidCustName) {
                list.addAll("Cust Name: $customerName\n".toByteArray(Charsets.US_ASCII).toList())
            }
            if (hasValidCustPhone) {
                list.addAll("Cust Mobile: $customerPhone\n".toByteArray(Charsets.US_ASCII).toList())
            }
            if (hasValidCustAddress) {
                list.addAll("Delivery Address:\n$customerAddress\n".toByteArray(Charsets.US_ASCII).toList())
            }
        }
        
        // Table Title: Food items
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        list.addAll(ESC_ALIGN_CENTER.toList())
        list.addAll(ESC_BOLD_ON.toList())
        list.addAll("Food items\n".toByteArray(Charsets.US_ASCII).toList())
        list.addAll(ESC_BOLD_OFF.toList())
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Columns header
        list.addAll(ESC_ALIGN_LEFT.toList())
        list.addAll(ESC_BOLD_ON.toList())
        val header = formatItemRow("Item Name", "Qty.", "Amount", "Total", widthChars)
        list.addAll(header.toByteArray(Charsets.US_ASCII).toList())
        list.addAll(ESC_BOLD_OFF.toList())
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Items list
        var idx = 1
        items.forEach { (item, qty) ->
            val name = "$idx.${item.displayName.uppercase(Locale.US)}"
            val priceStr = String.format(Locale.US, "%.2f", item.price)
            val amtStr = String.format(Locale.US, "%.2f", item.price * qty)
            val qtyStr = qty.toString()
            idx++
            
            val itemLine = formatItemRow(name, qtyStr, priceStr, amtStr, widthChars)
            list.addAll(itemLine.toByteArray(Charsets.US_ASCII).toList())
            
            if (item.selectedModifiers?.isNotEmpty() == true) {
                item.selectedModifiers.forEach { mod ->
                    val modPriceStr = if (mod.price > 0) " (${settings.currency} ${String.format(Locale.US, "%.2f", mod.price)})" else ""
                    list.addAll("  + ${mod.name.uppercase(Locale.US)}$modPriceStr\n".toByteArray(Charsets.US_ASCII).toList())
                }
            }
        }
        
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Summary Block (Right Aligned using spaces)
        list.addAll(ESC_ALIGN_LEFT.toList())
        list.addAll(formatSummaryRow("Amount:", "${settings.currency} ${String.format(Locale.US, "%.2f", subtotal)}", widthChars).toByteArray().toList())
        if (discount > 0) {
            list.addAll(formatSummaryRow("Discount:", "-${String.format(Locale.US, "%.2f", discount)}", widthChars).toByteArray().toList())
        }
        if (deliveryCharge > 0) {
            list.addAll(formatSummaryRow("Additional Charges:", "${settings.currency} ${String.format(Locale.US, "%.2f", deliveryCharge)}", widthChars).toByteArray().toList())
        }
        if (serviceCharge > 0) {
            list.addAll(formatSummaryRow("Service Charge:", "${settings.currency} ${String.format(Locale.US, "%.2f", serviceCharge)}", widthChars).toByteArray().toList())
        }
        if (tipAmount > 0) {
            list.addAll(formatSummaryRow("Tip Amount:", "${settings.currency} ${String.format(Locale.US, "%.2f", tipAmount)}", widthChars).toByteArray().toList())
        }
        
        if (!settings.hideTaxOnBill) {
            val taxName = settings.taxName.ifBlank { "GST" }
            list.addAll(formatSummaryRow("$taxName:", "(${String.format(Locale.US, "%.1f", settings.taxRate)}%)", widthChars).toByteArray().toList())
            
            val taxRateHalf = settings.taxRate / 2.0
            list.addAll(formatSummaryRow("CGST (${String.format(Locale.US, "%.1f", taxRateHalf)}%):", "${settings.currency} ${String.format(Locale.US, "%.2f", cgst)}", widthChars).toByteArray().toList())
            list.addAll(formatSummaryRow("SGST (${String.format(Locale.US, "%.1f", taxRateHalf)}%):", "${settings.currency} ${String.format(Locale.US, "%.2f", sgst)}", widthChars).toByteArray().toList())
        }
        
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        if (isPreOrder) {
            // Pre-Order booking receipt format
            list.addAll(ESC_BOLD_ON.toList())
            list.addAll(formatSummaryRow("Grand Total:", "${settings.currency} ${String.format(Locale.US, "%.2f", finalTotal)}", widthChars).toByteArray().toList())
            list.addAll(ESC_BOLD_OFF.toList())
            
            list.addAll(formatSummaryRow("Less Advance Paid:", "-${settings.currency} ${String.format(Locale.US, "%.2f", preOrderAdvance)}", widthChars).toByteArray().toList())
            
            list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
            list.addAll(ESC_BOLD_ON.toList())
            list.addAll(formatSummaryRow("Remaining Balance Due:", "${settings.currency} ${String.format(Locale.US, "%.2f", preOrderBalance)}", widthChars).toByteArray().toList())
            list.addAll(ESC_BOLD_OFF.toList())
            
            val words = ("Balance Due: " + numberToWords(preOrderBalance))
            list.addAll(ESC_ALIGN_LEFT.toList())
            list.addAll("$words\n".toByteArray().toList())
        } else {
            // Regular retail invoice format
            list.addAll(ESC_BOLD_ON.toList())
            list.addAll(formatSummaryRow("Grand Total:", "${settings.currency} ${String.format(Locale.US, "%.2f", finalTotal)}", widthChars).toByteArray().toList())
            list.addAll(ESC_BOLD_OFF.toList())
            
            val words = numberToWords(finalTotal)
            list.addAll(ESC_ALIGN_LEFT.toList())
            list.addAll("$words\n".toByteArray().toList())
        }
        
        // Print scannable Google Review QR code or UPI QR code if enabled
        if (settings.printReviewQr && settings.googleReviewUrl.isNotBlank()) {
            list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
            list.addAll(ESC_ALIGN_CENTER.toList())
            list.addAll(ESC_BOLD_ON.toList())
            list.addAll("RATE YOUR EXPERIENCE\n".toByteArray().toList())
            list.addAll(ESC_BOLD_OFF.toList())
            
            list.addAll(getQrCodeBytes(settings.googleReviewUrl).toList())
            list.addAll("\n".toByteArray().toList())
        } else if (settings.printUpiQr && settings.upiId.isNotBlank()) {
            val payeeName = businessName
            val isUrl = settings.upiId.startsWith("http://", ignoreCase = true) || 
                        settings.upiId.startsWith("https://", ignoreCase = true) || 
                        settings.upiId.startsWith("upi://", ignoreCase = true)
            val upiUri = if (isUrl) {
                settings.upiId
            } else if (settings.qrMode == "dynamic") {
                val upiAmount = if (isPreOrder) preOrderAdvance else finalTotal
                "upi://pay?pa=${settings.upiId}&pn=${java.net.URLEncoder.encode(payeeName, "UTF-8")}&am=${String.format(Locale.US, "%.2f", upiAmount)}&cu=INR"
            } else {
                "upi://pay?pa=${settings.upiId}&pn=${java.net.URLEncoder.encode(payeeName, "UTF-8")}&cu=INR"
            }
            
            list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
            list.addAll(ESC_ALIGN_CENTER.toList())
            list.addAll(ESC_BOLD_ON.toList())
            list.addAll("SCAN TO PAY\n".toByteArray().toList())
            list.addAll(ESC_BOLD_OFF.toList())
            
            list.addAll(getQrCodeBytes(upiUri).toList())
            list.addAll("\n".toByteArray().toList())
        }
        
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Footer message
        list.addAll(ESC_ALIGN_CENTER.toList())
        val greeting = settings.greetingMessage.ifBlank { "THANK YOU! VISIT AGAIN" }.uppercase(Locale.US)
        list.addAll(ESC_BOLD_ON.toList())
        list.addAll("$greeting\n".toByteArray(Charsets.US_ASCII).toList())
        list.addAll(ESC_BOLD_OFF.toList())

        val appVersion = settings.appVersion.ifBlank { "SaSLoop POS Version: 19.02" }
        list.addAll("$appVersion\n".toByteArray(Charsets.US_ASCII).toList())
        
        list.addAll("------------------------------------------------\n".take(widthChars).toByteArray().toList())
        
        // Feed and cut
        list.addAll("\n\n\n\n".toByteArray().toList())
        list.addAll(ESC_CUT.toList())
        
        return list.toByteArray()
    }

    fun generateBillText(
        billNo: String,
        customerName: String,
        customerPhone: String,
        customerAddress: String,
        orderType: String,
        items: Map<MenuItem, Int>,
        subtotal: Double,
        discount: Double,
        cgst: Double,
        sgst: Double,
        serviceCharge: Double,
        deliveryCharge: Double,
        finalTotal: Double,
        tableName: String,
        waiterName: String?,
        settings: PosSettings,
        preOrderAdvance: Double = 0.0,
        preOrderBalance: Double = 0.0,
        paymentMethod: String = "CASH",
        userName: String = "admin",
        referenceNo: String = "",
        tipAmount: Double = 0.0
    ): String {
        val sb = StringBuilder()
        val widthChars = if (settings.printerType == "THERMAL_58MM") 32 else 48

        fun center(text: String): String {
            val lines = text.split("\n")
            return lines.joinToString("\n") { line ->
                val trimmed = line.trim()
                if (trimmed.length >= widthChars) {
                    trimmed.take(widthChars)
                } else {
                    val padding = (widthChars - trimmed.length) / 2
                    " ".repeat(padding) + trimmed
                }
            }
        }

        val businessName = (settings.businessName.takeIf { it.isNotBlank() }
            ?: settings.receiptHeader.takeIf { it.isNotBlank() }
            ?: "SHAHE TEHZEEB RESTAURANT").uppercase(Locale.US)
        sb.append(center(businessName)).append("\n")

        val displayAddress = settings.address.ifBlank { "Ist Floor Rather Plaza Kangan\nJ&K-191202" }
        sb.append(center(displayAddress)).append("\n")

        val displayPhone = settings.phone.ifBlank { "9906123989" }
        sb.append(center("Contact No: ${displayPhone.trim()}")).append("\n")

        val displayGstin = settings.gstin.ifBlank { "01BNIPB3099J1Z4" }
        sb.append(center("GSTIN : ${displayGstin.trim()}")).append("\n")

        val d = Date()
        val day = SimpleDateFormat("dd-MM-yyyy", Locale.US).format(d)
        val time24 = SimpleDateFormat("HH:mm:ss", Locale.US).format(d)
        val ampm = SimpleDateFormat("a", Locale.US).format(d).uppercase(Locale.US)
        val dateStr = "$day $time24 $ampm"
        sb.append(center(dateStr)).append("\n")

        val dashes = "------------------------------------------------".take(widthChars)
        sb.append(dashes).append("\n")

        val isPreOrder = orderType.equals("PRE-ORDER", ignoreCase = true)
        val sectionTitle = if (isPreOrder) "PRE-ORDER BOOKING RECEIPT" else "RETAIL INVOICE"
        sb.append(center(sectionTitle)).append("\n")
        sb.append(dashes).append("\n")

        val tblName = if (tableName.isBlank() || tableName == "0") "Direct" else tableName
        val payMethodStr = paymentMethod + (if (referenceNo.isNotBlank()) " ($referenceNo)" else "")
        sb.append(formatGridRow("Table: $tblName", "Bill: $billNo", widthChars))
        sb.append(formatGridRow("Order: $orderType", "Payment: $payMethodStr", widthChars))
        sb.append(formatGridRow("Waiter: ${waiterName ?: "Default"}", "User: $userName", widthChars))

        val ignoredNames = listOf("pos guest", "table guest", "walk-in", "")
        val isTableName = customerName.trim().lowercase(Locale.US) == tableName.trim().lowercase(Locale.US)
        val hasValidCustName = customerName.trim().lowercase(Locale.US) !in ignoredNames && !isTableName
        val hasValidCustPhone = customerPhone.isNotBlank()
        val ignoredAddresses = listOf("dine-in", "dine in", "pickup", "takeaway", "")
        val hasValidCustAddress = customerAddress.trim().lowercase(Locale.US) !in ignoredAddresses

        if (hasValidCustName || hasValidCustPhone || hasValidCustAddress) {
            sb.append(dashes).append("\n")
            if (hasValidCustName) {
                sb.append("Cust Name: $customerName\n")
            }
            if (hasValidCustPhone) {
                sb.append("Cust Mobile: $customerPhone\n")
            }
            if (hasValidCustAddress) {
                sb.append("Delivery Address:\n$customerAddress\n")
            }
        }

        sb.append(dashes).append("\n")
        sb.append(center("Food items")).append("\n")
        sb.append(dashes).append("\n")

        val header = formatItemRow("Item Name", "Qty.", "Amount", "Total", widthChars)
        sb.append(header)
        sb.append(dashes).append("\n")

        var idx = 1
        items.forEach { (item, qty) ->
            val name = "$idx.${item.displayName.uppercase(Locale.US)}"
            val priceStr = String.format(Locale.US, "%.2f", item.price)
            val amtStr = String.format(Locale.US, "%.2f", item.price * qty)
            val qtyStr = qty.toString()
            idx++

            sb.append(formatItemRow(name, qtyStr, priceStr, amtStr, widthChars))
            if (item.selectedModifiers?.isNotEmpty() == true) {
                item.selectedModifiers.forEach { mod ->
                    val modPriceStr = if (mod.price > 0) " (${settings.currency} ${String.format(Locale.US, "%.2f", mod.price)})" else ""
                    sb.append("  + ${mod.name.uppercase(Locale.US)}$modPriceStr\n")
                }
            }
        }

        sb.append(dashes).append("\n")

        sb.append(formatSummaryRow("Amount:", "${settings.currency} ${String.format(Locale.US, "%.2f", subtotal)}", widthChars))
        if (discount > 0) {
            sb.append(formatSummaryRow("Discount:", "-${String.format(Locale.US, "%.2f", discount)}", widthChars))
        }
        if (deliveryCharge > 0) {
            sb.append(formatSummaryRow("Additional Charges:", "${settings.currency} ${String.format(Locale.US, "%.2f", deliveryCharge)}", widthChars))
        }
        if (serviceCharge > 0) {
            sb.append(formatSummaryRow("Service Charge:", "${settings.currency} ${String.format(Locale.US, "%.2f", serviceCharge)}", widthChars))
        }
        if (tipAmount > 0) {
            sb.append(formatSummaryRow("Tip Amount:", "${settings.currency} ${String.format(Locale.US, "%.2f", tipAmount)}", widthChars))
        }

        if (!settings.hideTaxOnBill) {
            val taxName = settings.taxName.ifBlank { "GST" }
            sb.append(formatSummaryRow("$taxName:", "(${String.format(Locale.US, "%.1f", settings.taxRate)}%)", widthChars))

            val taxRateHalf = settings.taxRate / 2.0
            sb.append(formatSummaryRow("CGST (${String.format(Locale.US, "%.1f", taxRateHalf)}%):", "${settings.currency} ${String.format(Locale.US, "%.2f", cgst)}", widthChars))
            sb.append(formatSummaryRow("SGST (${String.format(Locale.US, "%.1f", taxRateHalf)}%):", "${settings.currency} ${String.format(Locale.US, "%.2f", sgst)}", widthChars))
        }

        sb.append(dashes).append("\n")

        if (isPreOrder) {
            sb.append(formatSummaryRow("Grand Total:", "${settings.currency} ${String.format(Locale.US, "%.2f", finalTotal)}", widthChars))
            sb.append(formatSummaryRow("Less Advance Paid:", "-${settings.currency} ${String.format(Locale.US, "%.2f", preOrderAdvance)}", widthChars))
            sb.append(dashes).append("\n")
            sb.append(formatSummaryRow("Remaining Balance Due:", "${settings.currency} ${String.format(Locale.US, "%.2f", preOrderBalance)}", widthChars))

            val words = ("Balance Due: " + numberToWords(preOrderBalance))
            sb.append(words).append("\n")
        } else {
            sb.append(formatSummaryRow("Grand Total:", "${settings.currency} ${String.format(Locale.US, "%.2f", finalTotal)}", widthChars))

            val words = numberToWords(finalTotal)
            sb.append(words).append("\n")
        }

        if (settings.printReviewQr && settings.googleReviewUrl.isNotBlank()) {
            sb.append(dashes).append("\n")
            sb.append(center("RATE YOUR EXPERIENCE")).append("\n")
            sb.append(center("[REVIEW QR CODE]")).append("\n")
        } else if (settings.printUpiQr && settings.upiId.isNotBlank()) {
            sb.append(dashes).append("\n")
            sb.append(center("SCAN TO PAY")).append("\n")
            sb.append(center("[UPI QR CODE]")).append("\n")
        }

        sb.append(dashes).append("\n")

        val greeting = settings.greetingMessage.ifBlank { "THANK YOU! VISIT AGAIN" }.uppercase(Locale.US)
        sb.append(center(greeting)).append("\n")

        val appVersion = settings.appVersion.ifBlank { "SaSLoop POS Version: 19.02" }
        sb.append(center(appVersion)).append("\n")
        sb.append(dashes).append("\n")

        return sb.toString()
    }
}
