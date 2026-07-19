const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ EXPORT TALLY XML
router.get("/export", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.bizId || req.user.id;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    // Fetch orders for the date range
    const result = await pool.query(
      `SELECT * FROM orders 
       WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3
       ORDER BY created_at ASC`,
      [userId, startDate, endDate]
    );

    const orders = result.rows;

    // Generate Tally XML
    let xml = `<?xml version="1.0"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
`;

    for (const order of orders) {
      // Tally expects date in YYYYMMDD format
      const dateStr = order.created_at.toISOString().slice(0, 10).replace(/-/g, '');
      const orderId = order.id;
      const totalAmount = parseFloat(order.total_price);
      
      xml += `        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="Sales" ACTION="Create" OBJVIEW="Accounting Voucher">
            <DATE>${dateStr}</DATE>
            <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
            <PARTYLEDGERNAME>Cash</PARTYLEDGERNAME>
            <NARRATION>Order #${orderId} from SaSLoop POS</NARRATION>
            <EFFECTIVEDATE>${dateStr}</EFFECTIVEDATE>
            
            <!-- Debit Entry (Cash account receives money) -->
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Cash</LEDGERNAME>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <AMOUNT>-${totalAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            
            <!-- Credit Entry (Sales account is credited) -->
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Sales</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${totalAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
`;
    }

    xml += `      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;

    // Set headers for file download
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename=tally_export_${startDate}_to_${endDate}.xml`);
    res.send(xml);

  } catch (err) {
    console.error("🔥 TALLY EXPORT ERROR:", err);
    res.status(500).json({ error: "Failed to export Tally XML" });
  }
});

module.exports = router;
