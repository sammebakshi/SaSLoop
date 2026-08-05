import React, { useState, useEffect, useCallback } from "react";
import { 
  FileText, Search, RefreshCw, Filter, 
  Download, Calendar, IndianRupee, ShieldCheck, 
  TrendingUp, PieChart, ChevronDown, ListChecks,
  Printer, Share2, Database, ChevronRight, AlertTriangle,
  Wallet, DollarSign, ArrowUpRight, ArrowDownRight, UserCheck, Users, Clock
} from "lucide-react";
import { API_BASE } from "../../services/api";
import * as XLSX from 'xlsx';

const DSRReport = () => {
    const [data, setData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [outlets, setOutlets] = useState([]);
    
    // Reconciliation cash drawer state
    const [openingCash, setOpeningCash] = useState(() => {
        return localStorage.getItem('dsr_opening_cash') || "0";
    });
    const [actualCashCounted, setActualCashCounted] = useState(() => {
        return localStorage.getItem('dsr_actual_cash') || "";
    });

    const [filters, setFilters] = useState({
        outlet_ids: "",
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
        from_time: "00:00",
        to_time: "23:59",
        status: "ALL",
        order_type: "ALL",
        biller_name: "ALL"
    });

    // Save opening and actual cash inputs locally for convenience
    useEffect(() => {
        localStorage.setItem('dsr_opening_cash', openingCash);
    }, [openingCash]);

    useEffect(() => {
        localStorage.setItem('dsr_actual_cash', actualCashCounted);
    }, [actualCashCounted]);

    const getProfileInfo = () => {
        try {
            const p = localStorage.getItem('pos_profile');
            if (p) return JSON.parse(p);
        } catch (e) {}
        return null;
    };

    const getOutletName = (order = null) => {
        if (order && order.outlet_name) return order.outlet_name;
        const profile = getProfileInfo();
        if (profile) {
            if (profile.restaurant_name) return profile.restaurant_name;
            if (profile.outlet_name) return profile.outlet_name;
            if (profile.brand_name) return profile.brand_name;
        }
        if (outlets && outlets.length > 0) {
            const found = outlets.find(o => String(o.id) === String(filters.outlet_ids));
            if (found && found.name) return found.name;
        }
        return "SHAHE TEHZEEB RESTAURANT";
    };

    const getStaffOrWaiter = (order) => {
        if (!order) return "-";
        if (order.waiter_name) return order.waiter_name;
        if (order.delivery_boy || order.rider_name || order.driver_name) return order.delivery_boy || order.rider_name || order.driver_name;
        if (order.staff_name && order.staff_name !== order.biller_name) return order.staff_name;
        return "-";
    };

    const getBilledBy = (order) => {
        if (!order) return "Shahe Tehzeeb POS";
        if (order.biller_name) return order.biller_name;
        if (order.cashier_name) return order.cashier_name;
        if (order.punched_by) return order.punched_by;
        if (order.generated_by_name) return order.generated_by_name;
        if (order.user_name && order.user_name !== order.waiter_name) return order.user_name;
        
        const profile = getProfileInfo();
        if (profile) {
            if (profile.biller_name) return profile.biller_name;
            if (profile.cashier_name) return profile.cashier_name;
            if (profile.username && profile.username.toLowerCase() !== order.waiter_name?.toLowerCase()) return profile.username;
        }
        return "Shahe Tehzeeb POS";
    };

    const loadOutlets = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/brand/outlets`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            if (res.ok) {
                const d = await res.json();
                setOutlets(d);
                if (d.length > 0) {
                    setFilters(prev => ({ ...prev, outlet_ids: d[0].id }));
                }
            }
        } catch (e) {
            console.error("Error loading outlets:", e);
        }
    };

    const fetchData = useCallback(() => {
        setLoading(true);
        try {
            // Load orders
            const localOrdersRaw = localStorage.getItem('pos_local_orders');
            const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : [];

            const fromStr = `${filters.from_date} ${filters.from_time || "00:00"}:00`;
            const toStr = `${filters.to_date} ${filters.to_time || "23:59"}:59`;
            const fromTime = new Date(fromStr).getTime();
            const toTime = new Date(toStr).getTime();

            const filteredOrders = localOrders.filter(order => {
                const orderTime = order.created_at ? new Date(order.created_at).getTime() : Date.now();
                if (orderTime < fromTime || orderTime > toTime) return false;
                if (filters.status !== "ALL" && order.status !== filters.status) return false;
                if (filters.order_type !== "ALL" && order.order_type !== filters.order_type) return false;
                if (filters.biller_name !== "ALL" && getBilledBy(order).toLowerCase() !== filters.biller_name.toLowerCase()) return false;
                return true;
            });

            filteredOrders.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            setData(filteredOrders);

            // Load local petty cash expenses
            const localExpRaw = localStorage.getItem('pos_expenses');
            const localExpenses = localExpRaw ? JSON.parse(localExpRaw) : [];
            const filteredExp = localExpenses.filter(exp => {
                const expTime = exp.created_at ? new Date(exp.created_at).getTime() : Date.now();
                return expTime >= fromTime && expTime <= toTime;
            });
            setExpensesData(filteredExp);

        } catch (err) {
            console.error("Error calculating local DSR report:", err);
            setData([]);
            setExpensesData([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadOutlets();
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Unique cashiers list for filter dropdown
    const availableCashiers = Array.from(new Set(data.map(o => getBilledBy(o)))).filter(Boolean);

    // Summary Telemetry Calculations
    const validOrders = data.filter(order => order.status !== 'CANCELLED' && order.status !== 'DELETED' && order.status !== 'REFUNDED');
    const cancelledOrders = data.filter(order => order.status === 'CANCELLED' || order.status === 'DELETED');
    
    const totalOrdersCount = validOrders.length;
    const cancelledOrdersCount = cancelledOrders.length;
    
    const grossRevenue = validOrders.reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0);
    const taxCollected = validOrders.reduce((acc, o) => acc + (parseFloat(o.tax_cgst || 0) + parseFloat(o.tax_sgst || 0)), 0);
    const discountAllowed = validOrders.reduce((acc, o) => acc + parseFloat(o.discount || 0), 0);
    const cancelledAmount = cancelledOrders.reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0);
    const totalExpenses = expensesData.reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);

    // Cash Sales for Cash Drawer Reconciliation
    const cashSales = validOrders
        .filter(o => (o.payment_method || 'CASH').toUpperCase() === 'CASH')
        .reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0);

    const openCashVal = parseFloat(openingCash) || 0;
    const expectedCashInDrawer = openCashVal + cashSales - totalExpenses;
    const actualCashVal = actualCashCounted !== "" ? parseFloat(actualCashCounted) : expectedCashInDrawer;
    const cashVariance = actualCashVal - expectedCashInDrawer;

    const netLiquidity = grossRevenue - discountAllowed - totalExpenses;

    // Payment Mode Breakdown
    const paymentSummary = validOrders.reduce((acc, order) => {
        const method = (order.payment_method || 'CASH').toUpperCase();
        acc[method] = (acc[method] || 0) + parseFloat(order.total_price || 0);
        return acc;
    }, {});

    // Order Channel Breakdown
    const channelSummary = validOrders.reduce((acc, order) => {
        const type = (order.order_type || 'QUICK').toUpperCase();
        acc[type] = (acc[type] || 0) + parseFloat(order.total_price || 0);
        return acc;
    }, {});

    // Cashier Revenue Breakdown
    const cashierSummary = validOrders.reduce((acc, order) => {
        const cashier = getBilledBy(order);
        if (!acc[cashier]) acc[cashier] = { count: 0, total: 0 };
        acc[cashier].count += 1;
        acc[cashier].total += parseFloat(order.total_price || 0);
        return acc;
    }, {});

    // Waiter Revenue Breakdown
    const waiterSummary = validOrders.reduce((acc, order) => {
        const waiter = getStaffOrWaiter(order);
        if (waiter === "-") return acc;
        if (!acc[waiter]) acc[waiter] = { count: 0, total: 0 };
        acc[waiter].count += 1;
        acc[waiter].total += parseFloat(order.total_price || 0);
        return acc;
    }, {});

    const handleExport = () => {
        if (data.length === 0) return;
        const mainOutlet = getOutletName();

        const manifestSheet = XLSX.utils.json_to_sheet(data.map(order => ({
            "Order Reference": order.order_reference || order.id || `#${order.bill_no || ''}`,
            "Date & Time": new Date(order.created_at).toLocaleString(),
            "Outlet": getOutletName(order) || mainOutlet,
            "Channel": order.order_type,
            "Payment Method": order.payment_method || "CASH",
            "Subtotal": parseFloat(order.subtotal || order.total_price || 0).toFixed(2),
            "Discount": parseFloat(order.discount || 0).toFixed(2),
            "Tax (CGST)": parseFloat(order.tax_cgst || 0).toFixed(2),
            "Tax (SGST)": parseFloat(order.tax_sgst || 0).toFixed(2),
            "Total Price": parseFloat(order.total_price || 0).toFixed(2),
            "Status": order.status,
            "Waiter / Rider": getStaffOrWaiter(order),
            "Billed By (Cashier)": getBilledBy(order)
        })));

        const reconciliationSheet = XLSX.utils.json_to_sheet([
            { "Metric": "Gross Sales Revenue", "Amount (₹)": grossRevenue.toFixed(2) },
            { "Metric": "Tax Provision (CGST/SGST)", "Amount (₹)": taxCollected.toFixed(2) },
            { "Metric": "Discounts Granted", "Amount (₹)": discountAllowed.toFixed(2) },
            { "Metric": "Local Petty Cash Expenses", "Amount (₹)": totalExpenses.toFixed(2) },
            { "Metric": "Net Revenue / Liquidity", "Amount (₹)": netLiquidity.toFixed(2) },
            { "Metric": "Opening Cash Float", "Amount (₹)": openCashVal.toFixed(2) },
            { "Metric": "Billed Cash Sales", "Amount (₹)": cashSales.toFixed(2) },
            { "Metric": "Expected Cash in Drawer", "Amount (₹)": expectedCashInDrawer.toFixed(2) },
            { "Metric": "Actual Cash Counted", "Amount (₹)": actualCashVal.toFixed(2) },
            { "Metric": "Cash Variance", "Amount (₹)": cashVariance.toFixed(2) },
            { "Metric": "Cancelled Orders Amount", "Amount (₹)": cancelledAmount.toFixed(2) }
        ]);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, reconciliationSheet, "DSR Financial Summary");
        XLSX.utils.book_append_sheet(wb, manifestSheet, "Transaction Orders Manifest");
        XLSX.writeFile(wb, `DSR_Audit_Report_${filters.from_date}_to_${filters.to_date}.xlsx`);
    };

    const handlePrintReport = async (size) => {
        if (data.length === 0) return;
        const mainOutlet = getOutletName();
        const printDateStr = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

        let printHtml = '';
        if (size === 'A4') {
            printHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>DSR Audit Report - ${mainOutlet}</title>
                    <style>
                        @page { size: A4 portrait; margin: 10mm; }
                        * { box-sizing: border-box; }
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
                            padding: 0; margin: 0; color: #0f172a; background: #ffffff;
                            -webkit-print-color-adjust: exact; print-color-adjust: exact;
                            font-size: 11px; line-height: 1.5;
                        }
                        .header-container {
                            display: flex; justify-content: space-between; align-items: flex-start;
                            border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px;
                        }
                        .brand-title { font-size: 22px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 0; }
                        .subtitle { font-size: 12px; font-weight: 800; color: #059669; text-transform: uppercase; margin-top: 4px; }
                        .meta-box { text-align: right; font-size: 10px; color: #475569; line-height: 1.6; }
                        
                        .section-title { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #0f172a; margin-bottom: 8px; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; }
                        
                        .kpi-grid { display: flex; gap: 10px; margin-bottom: 16px; width: 100%; }
                        .kpi-card { flex: 1; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 10px; text-align: center; }
                        .kpi-label { font-size: 8.5px; font-weight: 800; text-transform: uppercase; color: #64748b; }
                        .kpi-value { font-size: 16px; font-weight: 900; color: #0f172a; margin-top: 2px; }

                        .cash-reconcile-card {
                            background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 16px;
                        }
                        .cash-row-grid { display: grid; grid-template-cols: repeat(5, 1fr); gap: 10px; text-align: center; }
                        .cash-cell p { margin: 0; font-size: 8.5px; font-weight: 800; uppercase; color: #475569; }
                        .cash-cell h4 { margin: 2px 0 0 0; font-size: 14px; font-weight: 900; color: #0f172a; }

                        .summary-tables-grid { display: flex; gap: 12px; margin-bottom: 16px; width: 100%; }
                        .summary-subcard { flex: 1; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; }
                        .summary-subheader { background: #0f172a; color: #ffffff; font-size: 9px; font-weight: 800; text-transform: uppercase; padding: 6px 10px; }
                        .summary-row { display: flex; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-size: 9.5px; font-weight: 700; }
                        .summary-row:last-child { border-bottom: none; }
                        
                        table { width: 100%; border-collapse: collapse; font-size: 9.5px; margin-top: 6px; }
                        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
                        th { background-color: #0f172a; color: #ffffff; font-weight: 800; text-transform: uppercase; font-size: 8.5px; }
                        tr:nth-child(even) { background-color: #f8fafc; }
                        tr { page-break-inside: avoid; }
                        
                        .amount { font-weight: 700; font-family: 'Courier New', Courier, monospace; }
                        .text-right { text-align: right; }
                        .text-center { text-align: center; }
                        
                        .status-badge { font-size: 7.5px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 3px; display: inline-block; }
                        .status-completed { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
                        .status-cancelled { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }

                        .footer { margin-top: 20px; border-top: 1.5px solid #cbd5e1; padding-top: 8px; display: flex; justify-content: space-between; font-size: 8.5px; color: #64748b; font-weight: 700; }
                    </style>
                </head>
                <body>
                    <div class="header-container">
                        <div>
                            <h1 class="brand-title">${mainOutlet}</h1>
                            <div class="subtitle">Daily Sales Reconciliation (DSR) Audit Report</div>
                        </div>
                        <div class="meta-box">
                            <div><strong>Audit Range:</strong> ${filters.from_date} ${filters.from_time} to ${filters.to_date} ${filters.to_time}</div>
                            <div><strong>Generated On:</strong> ${printDateStr}</div>
                            <div><strong>Audit Status:</strong> CLOSED & RECONCILED</div>
                        </div>
                    </div>
                    
                    <div class="section-title">1. Physical Cash Drawer Reconciliation</div>
                    <div class="cash-reconcile-card">
                        <div class="cash-row-grid">
                            <div class="cash-cell"><p>Opening Float</p><h4>₹${openCashVal.toFixed(2)}</h4></div>
                            <div class="cash-cell"><p>(+) Billed Cash Sales</p><h4 style="color:#059669;">₹${cashSales.toFixed(2)}</h4></div>
                            <div class="cash-cell"><p>(-) Local Expenses</p><h4 style="color:#dc2626;">₹${totalExpenses.toFixed(2)}</h4></div>
                            <div class="cash-cell"><p>(=) Expected Cash</p><h4 style="color:#2563eb;">₹${expectedCashInDrawer.toFixed(2)}</h4></div>
                            <div class="cash-cell"><p>Cash Variance</p><h4 style="color:${cashVariance < 0 ? '#dc2626' : '#059669'};">${cashVariance >= 0 ? '+' : ''}₹${cashVariance.toFixed(2)}</h4></div>
                        </div>
                    </div>

                    <div class="section-title">2. Executive Financial Telemetry</div>
                    <div class="kpi-grid">
                        <div class="kpi-card"><div class="kpi-label">Gross Billed Sales</div><div class="kpi-value" style="color:#059669;">₹${grossRevenue.toFixed(2)}</div></div>
                        <div class="kpi-card"><div class="kpi-label">Tax Provision</div><div class="kpi-value" style="color:#dc2626;">₹${taxCollected.toFixed(2)}</div></div>
                        <div class="kpi-card"><div class="kpi-label">Discounts Allowed</div><div class="kpi-value" style="color:#d97706;">₹${discountAllowed.toFixed(2)}</div></div>
                        <div class="kpi-card"><div class="kpi-label">Petty Expenses</div><div class="kpi-value" style="color:#e11d48;">₹${totalExpenses.toFixed(2)}</div></div>
                        <div class="kpi-card"><div class="kpi-label">Net Liquidity</div><div class="kpi-value" style="color:#2563eb;">₹${netLiquidity.toFixed(2)}</div></div>
                    </div>

                    <div class="summary-tables-grid">
                        <div class="summary-subcard">
                            <div class="summary-subheader">Payment Collection Breakdown</div>
                            ${Object.entries(paymentSummary).map(([m, v]) => `
                                <div class="summary-row"><span>${m}</span><span class="amount">₹${v.toFixed(2)}</span></div>
                            `).join('')}
                        </div>
                        <div class="summary-subcard">
                            <div class="summary-subheader">Order Channel Breakdown</div>
                            ${Object.entries(channelSummary).map(([c, v]) => `
                                <div class="summary-row"><span>${c}</span><span class="amount">₹${v.toFixed(2)}</span></div>
                            `).join('')}
                        </div>
                        <div class="summary-subcard">
                            <div class="summary-subheader">Cashier Collection Performance</div>
                            ${Object.entries(cashierSummary).map(([cashier, info]) => `
                                <div class="summary-row"><span>${cashier} (${info.count} bills)</span><span class="amount">₹${info.total.toFixed(2)}</span></div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="section-title" style="margin-top:12px;">3. Transaction Orders Audit Manifest (${data.length} Transactions)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Reference #</th>
                                <th>Date & Time</th>
                                <th>Channel</th>
                                <th>Payment</th>
                                <th class="text-right">Subtotal</th>
                                <th class="text-right">Discount</th>
                                <th class="text-right">Tax</th>
                                <th class="text-right">Total Amount</th>
                                <th class="text-center">Status</th>
                                <th>Waiter / Rider</th>
                                <th>Punched By</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(row => {
                                const tax = parseFloat(row.tax_cgst || 0) + parseFloat(row.tax_sgst || 0);
                                const stClass = row.status === 'COMPLETED' ? 'status-completed' : 'status-cancelled';
                                return `
                                    <tr>
                                        <td style="font-weight:800;">${row.order_reference || `#${row.id}`}</td>
                                        <td style="color:#475569;">${new Date(row.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                                        <td style="font-weight:700;">${row.order_type}</td>
                                        <td style="font-weight:600;">${row.payment_method || 'CASH'}</td>
                                        <td class="amount text-right">₹${parseFloat(row.subtotal || row.total_price || 0).toFixed(2)}</td>
                                        <td class="amount text-right" style="color:#dc2626;">₹${parseFloat(row.discount || 0).toFixed(2)}</td>
                                        <td class="amount text-right">₹${tax.toFixed(2)}</td>
                                        <td class="amount text-right" style="font-weight:900; color:#059669;">₹${parseFloat(row.total_price || 0).toFixed(2)}</td>
                                        <td class="text-center"><span class="status-badge ${stClass}">${row.status}</span></td>
                                        <td style="color:#2563eb; font-weight:700;">${getStaffOrWaiter(row)}</td>
                                        <td style="font-weight:700;">${getBilledBy(row)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <div class="footer">
                        <span>Master POS Daily Sales Reconciliation Audit &bull; Confidential Financial Record</span>
                        <span>Signature: ______________________ (Store Manager)</span>
                    </div>
                </body>
                </html>
            `;
        } else {
            // Thermal Receipt Slip (80mm)
            printHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>DSR Thermal Slip</title>
                    <style>
                        @page { size: 80mm auto; margin: 0; }
                        body { 
                            font-family: monospace, Courier, monospace; 
                            width: 78mm; margin: 0 auto; padding: 6px; 
                            font-size: 10px; line-height: 1.3; color: #000;
                        }
                        .center { text-align: center; }
                        .bold { font-weight: bold; }
                        .dashed-line { border-bottom: 1px dashed #000; margin: 6px 0; }
                        .flex-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
                        @media print { body { margin: 0; padding: 4px; width: 100%; } }
                    </style>
                </head>
                <body>
                    <div class="center bold" style="font-size: 13px;">DSR RECONCILIATION SLIP</div>
                    <div class="center bold">${mainOutlet.toUpperCase()}</div>
                    <div class="dashed-line"></div>
                    <div>FROM: ${filters.from_date} ${filters.from_time}</div>
                    <div>TO:   ${filters.to_date} ${filters.to_time}</div>
                    <div class="dashed-line"></div>

                    <div class="center bold">CASH DRAWER RECONCILIATION</div>
                    <div class="flex-row"><span>OPENING FLOAT:</span><span>₹${openCashVal.toFixed(2)}</span></div>
                    <div class="flex-row"><span>(+) CASH SALES:</span><span class="bold">₹${cashSales.toFixed(2)}</span></div>
                    <div class="flex-row"><span>(-) LOCAL EXPENSES:</span><span>₹${totalExpenses.toFixed(2)}</span></div>
                    <div class="dashed-line"></div>
                    <div class="flex-row"><span>(=) EXPECTED CASH:</span><span class="bold">₹${expectedCashInDrawer.toFixed(2)}</span></div>
                    <div class="flex-row"><span>ACTUAL COUNTED:</span><span>₹${actualCashVal.toFixed(2)}</span></div>
                    <div class="flex-row"><span>CASH VARIANCE:</span><span class="bold">${cashVariance >= 0 ? '+' : ''}₹${cashVariance.toFixed(2)}</span></div>

                    <div class="dashed-line"></div>
                    <div class="center bold">FINANCIAL TELEMETRY</div>
                    <div class="flex-row"><span>GROSS SALES:</span><span class="bold">₹${grossRevenue.toFixed(2)}</span></div>
                    <div class="flex-row"><span>TAX PROVISION:</span><span>₹${taxCollected.toFixed(2)}</span></div>
                    <div class="flex-row"><span>DISCOUNTS:</span><span>₹${discountAllowed.toFixed(2)}</span></div>
                    <div class="flex-row"><span>NET LIQUIDITY:</span><span class="bold">₹${netLiquidity.toFixed(2)}</span></div>
                    <div class="flex-row"><span>CANCELLED BLLS (${cancelledOrdersCount}):</span><span>₹${cancelledAmount.toFixed(2)}</span></div>

                    <div class="dashed-line"></div>
                    <div class="center bold">PAYMENT COLLECTION</div>
                    ${Object.entries(paymentSummary).map(([m, v]) => `
                        <div class="flex-row"><span>${m}:</span><span>₹${v.toFixed(2)}</span></div>
                    `).join('')}

                    <div class="dashed-line"></div>
                    <div class="center bold">CASHIER PERFORMANCE</div>
                    ${Object.entries(cashierSummary).map(([c, info]) => `
                        <div class="flex-row"><span>${c} (${info.count}):</span><span>₹${info.total.toFixed(2)}</span></div>
                    `).join('')}

                    <div class="dashed-line"></div>
                    <div class="center">PRINTED: ${printDateStr}</div>
                </body>
                </html>
            `;
        }

        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                if (size === 'A4') {
                    const result = await ipcRenderer.invoke('generate-pdf', { 
                        html: printHtml, 
                        fileName: `DSR_Report_${filters.from_date}.pdf`,
                        isA4: true 
                    });
                    if (result && result.base64) {
                        const link = document.createElement('a');
                        link.href = `data:application/pdf;base64,${result.base64}`;
                        link.download = `DSR_Report_${filters.from_date}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        return;
                    }
                } else {
                    ipcRenderer.send('print-silent', { html: printHtml.replace(/<script>.*<\/script>/, '') });
                    return;
                }
            } catch (err) {
                console.error("Electron print error, falling back to window print:", err);
            }
        }

        const printWindow = window.open('', '_blank', 'width=900,height=1000');
        if (printWindow) {
            printWindow.document.write(printHtml + '<script>window.onload = () => { window.print(); }</script>');
            printWindow.document.close();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-slate-800 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100/50">
                        <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            DSR Intelligence Protocol <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] border border-emerald-200 rounded-full font-extrabold">LIVE RECONCILIATION</span>
                        </h2>
                        <p className="text-[11px] text-slate-500 font-semibold">Daily Sales Reconciliation, Physical Cash Drawer Balancing & Fraud Audit</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => handlePrintReport('thermal')}
                        disabled={data.length === 0}
                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        <Printer className="w-3.5 h-3.5" /> Thermal 3-Inch
                    </button>
                    <button 
                        onClick={() => handlePrintReport('A4')}
                        disabled={data.length === 0}
                        className="flex-1 md:flex-none px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        <FileText className="w-3.5 h-3.5" /> Save A4 PDF
                    </button>
                    <button 
                        onClick={handleExport}
                        disabled={data.length === 0}
                        className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        <Download className="w-3.5 h-3.5" /> Excel Export
                    </button>
                </div>
            </div>

            {/* Filter Protocol Box */}
            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Filter className="w-4 h-4 text-indigo-500" /> Audit Filters & Temporal Range
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Outlet: {getOutletName()}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    {/* Date From & To */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input 
                                type="date" 
                                value={filters.from_date}
                                onChange={e => setFilters(prev => ({ ...prev, from_date: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-[11px] font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all" 
                            />
                            <input 
                                type="date" 
                                value={filters.to_date}
                                onChange={e => setFilters(prev => ({ ...prev, to_date: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-[11px] font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all" 
                            />
                        </div>
                    </div>

                    {/* Time From & To */}
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Shift Time Window</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input 
                                type="time" 
                                value={filters.from_time}
                                onChange={e => setFilters(prev => ({ ...prev, from_time: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-[11px] font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all" 
                            />
                            <input 
                                type="time" 
                                value={filters.to_time}
                                onChange={e => setFilters(prev => ({ ...prev, to_time: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-[11px] font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all" 
                            />
                        </div>
                    </div>

                    {/* Cashier Filter */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Punched / Billed By</label>
                        <select 
                            value={filters.biller_name}
                            onChange={e => setFilters(prev => ({ ...prev, biller_name: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2 text-[11px] font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                            <option value="ALL">ALL CASHIERS</option>
                            {availableCashiers.map((c, i) => (
                                <option key={i} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Order Type & Actions */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel & Action</label>
                        <div className="flex items-center gap-2">
                            <select 
                                value={filters.order_type}
                                onChange={e => setFilters(prev => ({ ...prev, order_type: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2 text-[11px] font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                            >
                                <option value="ALL">ALL CHANNELS</option>
                                <option value="DINE_IN">DINE-IN</option>
                                <option value="DELIVERY">DELIVERY</option>
                                <option value="TAKEAWAY">TAKEAWAY</option>
                                <option value="QUICK">QUICK</option>
                            </select>
                            <button 
                                onClick={fetchData}
                                className="h-9 px-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center"
                                title="Refresh Audit"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cash Drawer Reconciliation Interactive Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-emerald-700/50 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-400">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold tracking-tight text-white uppercase flex items-center gap-2">
                                    Physical Cash Drawer Reconciliation
                                </h3>
                                <p className="text-[11px] text-emerald-200 font-medium">Reconcile starting cash, billed cash sales, local expenses, and actual register count</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800/50">
                            <span className="text-[10px] font-bold text-emerald-300 uppercase">Live Billed Cash Sales:</span>
                            <span className="text-sm font-black text-emerald-400">₹{cashSales.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* 1. Opening Cash Input */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-xl space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-emerald-200">1. Opening Float (₹)</label>
                            <input 
                                type="number" 
                                value={openingCash}
                                onChange={e => setOpeningCash(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-9 bg-slate-900/90 border border-emerald-500/30 rounded-lg px-3 text-sm font-black text-white outline-none focus:border-emerald-400"
                            />
                        </div>

                        {/* 2. Billed Cash Sales */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-200">(+) Billed Cash Sales</span>
                            <div className="text-lg font-black text-emerald-400 pt-1">₹{cashSales.toFixed(2)}</div>
                            <span className="text-[9px] font-semibold text-emerald-300/70">From completed cash orders</span>
                        </div>

                        {/* 3. Local Expenses */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-rose-300">(-) Local Expenses</span>
                            <div className="text-lg font-black text-rose-400 pt-1">₹{totalExpenses.toFixed(2)}</div>
                            <span className="text-[9px] font-semibold text-rose-200/70">{expensesData.length} petty cash entries</span>
                        </div>

                        {/* 4. Expected Cash */}
                        <div className="bg-white/15 backdrop-blur-md border border-emerald-400/30 p-3.5 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">(=) Expected Cash</span>
                            <div className="text-lg font-black text-white pt-1">₹{expectedCashInDrawer.toFixed(2)}</div>
                            <span className="text-[9px] font-semibold text-emerald-200">Float + Sales - Expenses</span>
                        </div>

                        {/* 5. Actual Counted & Variance */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-xl space-y-1.5">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-amber-200">Actual Cash Counted (₹)</label>
                            <input 
                                type="number" 
                                value={actualCashCounted}
                                onChange={e => setActualCashCounted(e.target.value)}
                                placeholder={expectedCashInDrawer.toFixed(2)}
                                className="w-full h-9 bg-slate-900/90 border border-amber-500/40 rounded-lg px-3 text-sm font-black text-amber-300 outline-none focus:border-amber-400"
                            />
                        </div>
                    </div>

                    {/* Cash Variance Display Banner */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between ${
                        cashVariance < 0 ? 'bg-rose-500/20 border-rose-500/40 text-rose-200' :
                        cashVariance > 0 ? 'bg-amber-500/20 border-amber-500/40 text-amber-200' :
                        'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                    }`}>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                Cash Variance Result: {cashVariance === 0 ? 'PERFECT RECONCILIATION (MATCH)' : cashVariance < 0 ? 'CASH SHORTAGE DETECTED' : 'CASH EXCESS DETECTED'}
                            </span>
                        </div>
                        <span className="text-sm font-black tracking-tight">
                            {cashVariance >= 0 ? '+' : ''}₹{cashVariance.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Financial Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                    { label: 'Gross Revenue', val: `₹${grossRevenue.toFixed(2)}`, sub: `${totalOrdersCount} Valid Orders`, color: 'emerald', icon: IndianRupee },
                    { label: 'Tax Provision', val: `₹${taxCollected.toFixed(2)}`, sub: 'CGST + SGST Accumulated', color: 'rose', icon: ShieldCheck },
                    { label: 'Discounts Granted', val: `₹${discountAllowed.toFixed(2)}`, sub: 'Promos & Staff Discounts', color: 'amber', icon: TrendingUp },
                    { label: 'Local Expenses', val: `₹${totalExpenses.toFixed(2)}`, sub: 'Petty Cash Disbursements', color: 'pink', icon: ArrowDownRight },
                    { label: 'Net Liquidity', val: `₹${netLiquidity.toFixed(2)}`, sub: 'Revenue - Discounts - Expenses', color: 'indigo', icon: Wallet }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-300 transition-all space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600">
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-lg font-black text-slate-900 tracking-tight">{stat.val}</p>
                        <p className="text-[10px] font-semibold text-slate-400">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Anti-Fraud Audit Banner */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-tight">Cancelled & Voided Bills Audit</h4>
                        <p className="text-[11px] text-amber-700 font-medium">Verify cancelled orders to prevent unrecorded cash collection</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase block">Cancelled Count</span>
                        <span className="text-sm font-black text-amber-900">{cancelledOrdersCount} Orders</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase block">Cancelled Amount</span>
                        <span className="text-sm font-black text-rose-600">₹{cancelledAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Multi-Dimensional Breakdowns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Payment Collection Summary */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                        <span>Payment Method Breakdown</span>
                        <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="p-4 divide-y divide-slate-100 flex-1">
                        {Object.keys(paymentSummary).length === 0 ? (
                            <p className="text-center text-xs text-slate-400 font-bold py-6">No collection data</p>
                        ) : Object.entries(paymentSummary).map(([method, val]) => (
                            <div key={method} className="py-2.5 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase">{method}</span>
                                <span className="text-xs font-black text-slate-900 font-mono">₹{val.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Channel Breakdown */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                        <span>Order Channel Split</span>
                        <ListChecks className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div className="p-4 divide-y divide-slate-100 flex-1">
                        {Object.keys(channelSummary).length === 0 ? (
                            <p className="text-center text-xs text-slate-400 font-bold py-6">No channel data</p>
                        ) : Object.entries(channelSummary).map(([channel, val]) => (
                            <div key={channel} className="py-2.5 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase">{channel}</span>
                                <span className="text-xs font-black text-slate-900 font-mono">₹{val.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cashier Performance Split */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                        <span>Cashier Performance</span>
                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="p-4 divide-y divide-slate-100 flex-1">
                        {Object.keys(cashierSummary).length === 0 ? (
                            <p className="text-center text-xs text-slate-400 font-bold py-6">No cashier records</p>
                        ) : Object.entries(cashierSummary).map(([cashier, info]) => (
                            <div key={cashier} className="py-2 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold text-slate-800 block uppercase">{cashier}</span>
                                    <span className="text-[10px] font-semibold text-slate-400">{info.count} transactions punched</span>
                                </div>
                                <span className="text-xs font-black text-slate-900 font-mono">₹{info.total.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transaction Orders Audit Manifest Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-4 h-4 text-indigo-500" /> Transaction Audit Manifest ({data.length} Total Records)
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white border-b border-slate-800">
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Reference #</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Date & Time</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Channel</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Payment</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-right">Subtotal</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-right">Discount</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-right">Tax</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-right">Total Amount</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-center">Status</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Waiter / Rider</th>
                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Billed By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan="11" className="py-20 text-center font-bold uppercase text-xs tracking-widest text-slate-400 animate-pulse">
                                        Reconciling Daily Manifest Logs...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="py-20 text-center font-bold uppercase text-xs tracking-widest text-slate-400">
                                        No transactions found for the selected period
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => {
                                const tax = parseFloat(row.tax_cgst || 0) + parseFloat(row.tax_sgst || 0);
                                return (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-5 py-3.5 font-extrabold text-slate-900 uppercase">
                                            {row.order_reference || `#${row.id || row.bill_no}`}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 font-semibold">
                                            {new Date(row.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-slate-700 uppercase">
                                            {row.order_type}
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-slate-700 uppercase">
                                            {row.payment_method || "CASH"}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-right text-slate-700 font-bold">
                                            ₹{parseFloat(row.subtotal || row.total_price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-right text-rose-600 font-bold">
                                            ₹{parseFloat(row.discount || 0).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-right text-slate-700 font-bold">
                                            ₹{tax.toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-right text-emerald-600 font-black">
                                            ₹{parseFloat(row.total_price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                                                row.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                                row.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                                'bg-rose-100 text-rose-800 border border-rose-200'
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-indigo-600 uppercase">
                                            {getStaffOrWaiter(row)}
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-slate-900 uppercase">
                                            {getBilledBy(row)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DSRReport;
