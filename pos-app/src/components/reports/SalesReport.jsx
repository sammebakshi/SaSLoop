import React, { useState, useEffect, useCallback } from "react";
import { 
  BarChart4, Search, RefreshCw, Filter, 
  Download, Calendar, Globe, Database, 
  TrendingUp, IndianRupee, ShieldCheck, 
  PieChart, FileText, ChevronDown, ListChecks, ChevronRight,
  ArrowRight
} from "lucide-react";
import { API_BASE } from "../../services/api";
import * as XLSX from 'xlsx';

const SalesReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [outlets, setOutlets] = useState([]);
    const [filters, setFilters] = useState({
        outlet_id: "",
        from_date: new Date().toISOString().split('T')[0],
        from_time: "00:00",
        to_date: new Date().toISOString().split('T')[0],
        to_time: "23:59",
        status: "",
        order_type: ""
    });

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
            const found = outlets.find(o => String(o.id) === String(filters.outlet_id));
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
                    setFilters(prev => ({ ...prev, outlet_id: d[0].id }));
                }
            }
        } catch (e) {
            console.error("Error loading outlets:", e);
        }
    };

    const fetchData = useCallback(() => {
        setLoading(true);
        try {
            const localOrdersRaw = localStorage.getItem('pos_local_orders');
            const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : [];

            const fromStr = `${filters.from_date} ${filters.from_time || "00:00"}:00`;
            const toStr = `${filters.to_date} ${filters.to_time || "23:59"}:59`;
            const fromTime = new Date(fromStr).getTime();
            const toTime = new Date(toStr).getTime();

            const filtered = localOrders.filter(order => {
                const orderTime = order.created_at ? new Date(order.created_at).getTime() : Date.now();
                if (orderTime < fromTime || orderTime > toTime) return false;
                if (filters.status && order.status !== filters.status) return false;
                if (filters.order_type && order.order_type !== filters.order_type) return false;
                return true;
            });

            filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            setData(filtered);
        } catch (err) {
            console.error("Error loading local sales report:", err);
            setData([]);
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

    // Calculate Summary stats (excluding cancelled / refunded orders)
    const validOrders = data.filter(order => order.status !== 'CANCELLED' && order.status !== 'DELETED' && order.status !== 'REFUNDED');
    const totalOrders = validOrders.length;
    const grossRevenue = validOrders.reduce((acc, order) => acc + parseFloat(order.total_price || 0), 0);
    const totalTax = validOrders.reduce((acc, order) => acc + (parseFloat(order.tax_cgst || 0) + parseFloat(order.tax_sgst || 0)), 0);
    const avgOrderValue = totalOrders > 0 ? (grossRevenue / totalOrders) : 0;

    const handleExportExcel = () => {
        if (data.length === 0) return;
        const mainOutlet = getOutletName();
        const ws = XLSX.utils.json_to_sheet(data.map(order => ({
            "Order ID": order.id,
            "Reference": order.order_reference || order.id || `#${order.bill_no || ''}`,
            "Date": new Date(order.created_at).toLocaleString(),
            "Outlet": getOutletName(order) || mainOutlet,
            "Order Type": order.order_type,
            "Subtotal": parseFloat(order.subtotal || order.total_price || 0).toFixed(2),
            "Discount": parseFloat(order.discount || 0).toFixed(2),
            "Tax (CGST)": parseFloat(order.tax_cgst || 0).toFixed(2),
            "Tax (SGST)": parseFloat(order.tax_sgst || 0).toFixed(2),
            "Total Price": parseFloat(order.total_price || 0).toFixed(2),
            "Payment Method": order.payment_method || "CASH",
            "Status": order.status,
            "Waiter / Rider": getStaffOrWaiter(order),
            "Billed By (Cashier)": getBilledBy(order)
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
        XLSX.writeFile(wb, `Sales_Report_${filters.from_date}_${filters.from_time.replace(':','')}_to_${filters.to_date}_${filters.to_time.replace(':','')}.xlsx`);
    };

    const generateReportHtml = (size) => {
        const mainOutlet = getOutletName();
        if (size === 'A4' || size === 'PDF') {
            const printDateStr = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
            
            // Payment method breakdown
            const paymentSummary = data.reduce((acc, order) => {
                if (order.status === 'CANCELLED' || order.status === 'DELETED') return acc;
                const method = order.payment_method || 'CASH';
                acc[method] = (acc[method] || 0) + parseFloat(order.total_price || 0);
                return acc;
            }, {});

            // Order type breakdown
            const typeSummary = data.reduce((acc, order) => {
                if (order.status === 'CANCELLED' || order.status === 'DELETED') return acc;
                const type = order.order_type || 'QUICK';
                acc[type] = (acc[type] || 0) + parseFloat(order.total_price || 0);
                return acc;
            }, {});

            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Sales Audit Report - ${mainOutlet}</title>
                    <style>
                        @page {
                            size: A4 portrait;
                            margin: 10mm;
                        }
                        * { box-sizing: border-box; }
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                            padding: 0; 
                            margin: 0;
                            color: #0f172a; 
                            background: #ffffff;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            font-size: 11px;
                            line-height: 1.5;
                        }
                        .report-wrapper {
                            width: 100%;
                            max-width: 100%;
                        }
                        .header-container {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            border-bottom: 3px solid #0f172a;
                            padding-bottom: 12px;
                            margin-bottom: 16px;
                        }
                        .brand-title {
                            font-size: 22px;
                            font-weight: 900;
                            color: #0f172a;
                            letter-spacing: -0.5px;
                            text-transform: uppercase;
                            margin: 0;
                        }
                        .subtitle {
                            font-size: 12px;
                            font-weight: 800;
                            color: #059669;
                            letter-spacing: 1px;
                            text-transform: uppercase;
                            margin-top: 4px;
                        }
                        .meta-box {
                            text-align: right;
                            font-size: 10px;
                            color: #475569;
                            line-height: 1.6;
                        }
                        .meta-box strong { color: #0f172a; }
                        
                        .kpi-grid {
                            display: flex;
                            gap: 12px;
                            margin-bottom: 18px;
                            width: 100%;
                        }
                        .kpi-card {
                            flex: 1;
                            background: #f8fafc;
                            border: 1.5px solid #cbd5e1;
                            border-radius: 8px;
                            padding: 12px;
                            text-align: center;
                        }
                        .kpi-label {
                            font-size: 9px;
                            font-weight: 800;
                            text-transform: uppercase;
                            color: #64748b;
                            letter-spacing: 0.5px;
                        }
                        .kpi-value {
                            font-size: 18px;
                            font-weight: 900;
                            color: #0f172a;
                            margin-top: 3px;
                        }
                        
                        .summary-tables-grid {
                            display: flex;
                            gap: 14px;
                            margin-bottom: 18px;
                            width: 100%;
                        }
                        .summary-subcard {
                            flex: 1;
                            border: 1px solid #cbd5e1;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        .summary-subheader {
                            background: #0f172a;
                            color: #ffffff;
                            font-size: 9.5px;
                            font-weight: 800;
                            text-transform: uppercase;
                            padding: 6px 12px;
                            letter-spacing: 0.5px;
                        }
                        .summary-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 6px 12px;
                            border-bottom: 1px solid #f1f5f9;
                            font-size: 10px;
                            font-weight: 700;
                        }
                        .summary-row:last-child { border-bottom: none; }
                        
                        .table-header-title {
                            font-size: 11px;
                            font-weight: 900;
                            text-transform: uppercase;
                            color: #0f172a;
                            margin-bottom: 8px;
                            letter-spacing: 0.5px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        }
                        
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 10px;
                        }
                        th, td {
                            border: 1px solid #cbd5e1;
                            padding: 7px 9px;
                            text-align: left;
                        }
                        th {
                            background-color: #0f172a;
                            color: #ffffff;
                            font-weight: 800;
                            text-transform: uppercase;
                            font-size: 9px;
                            letter-spacing: 0.4px;
                        }
                        tr:nth-child(even) { background-color: #f8fafc; }
                        tr { page-break-inside: avoid; }
                        
                        .amount { font-weight: 700; font-family: 'Courier New', Courier, monospace; }
                        .text-right { text-align: right; }
                        .text-center { text-align: center; }
                        
                        .status-badge {
                            font-size: 8px;
                            font-weight: 800;
                            text-transform: uppercase;
                            padding: 3px 7px;
                            border-radius: 4px;
                            display: inline-block;
                            letter-spacing: 0.3px;
                        }
                        .status-completed { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
                        .status-pending { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
                        .status-cancelled { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
                        
                        .footer {
                            margin-top: 25px;
                            border-top: 1.5px solid #cbd5e1;
                            padding-top: 10px;
                            display: flex;
                            justify-content: space-between;
                            font-size: 9px;
                            color: #64748b;
                            font-weight: 700;
                        }
                        @media print {
                            body { padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="report-wrapper">
                        <div class="header-container">
                            <div>
                                <h1 class="brand-title">${mainOutlet}</h1>
                                <div class="subtitle">Official Sales & Revenue Audit Report</div>
                            </div>
                            <div class="meta-box">
                                <div><strong>Period Range:</strong> ${filters.from_date} ${filters.from_time} to ${filters.to_date} ${filters.to_time}</div>
                                <div><strong>Generated On:</strong> ${printDateStr}</div>
                                <div><strong>Terminal Node:</strong> Master POS Client</div>
                            </div>
                        </div>
                        
                        <div class="kpi-grid">
                            <div class="kpi-card">
                                <div class="kpi-label">Gross Revenue</div>
                                <div class="kpi-value" style="color: #059669;">₹${grossRevenue.toFixed(2)}</div>
                            </div>
                            <div class="kpi-card">
                                <div class="kpi-label">Tax Provision</div>
                                <div class="kpi-value" style="color: #dc2626;">₹${totalTax.toFixed(2)}</div>
                            </div>
                            <div class="kpi-card">
                                <div class="kpi-label">Total Orders</div>
                                <div class="kpi-value" style="color: #2563eb;">${totalOrders}</div>
                            </div>
                            <div class="kpi-card">
                                <div class="kpi-label">Avg Order Value</div>
                                <div class="kpi-value" style="color: #d97706;">₹${avgOrderValue.toFixed(2)}</div>
                            </div>
                        </div>

                        <div class="summary-tables-grid">
                            <div class="summary-subcard">
                                <div class="summary-subheader">Payment Collection Breakdown</div>
                                ${Object.keys(paymentSummary).length === 0 ? '<div class="summary-row"><span>No data</span><span>-</span></div>' : 
                                Object.entries(paymentSummary).map(([method, val]) => `
                                    <div class="summary-row">
                                        <span>${method.toUpperCase()}</span>
                                        <span class="amount">₹${val.toFixed(2)}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="summary-subcard">
                                <div class="summary-subheader">Order Channel Breakdown</div>
                                ${Object.keys(typeSummary).length === 0 ? '<div class="summary-row"><span>No data</span><span>-</span></div>' : 
                                Object.entries(typeSummary).map(([type, val]) => `
                                    <div class="summary-row">
                                        <span>${type.toUpperCase()}</span>
                                        <span class="amount">₹${val.toFixed(2)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="table-header-title">
                            <span>Transaction Orders Manifest</span>
                            <span style="font-size: 9.5px; color: #64748b; font-weight: 700;">Total Transactions: ${data.length}</span>
                        </div>
                        
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
                                    <th>Punched / Billed By</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.length === 0 ? `
                                    <tr><td colSpan="11" class="text-center" style="padding: 24px; font-weight: 700; color: #64748b;">No sales transactions found for the selected period.</td></tr>
                                ` : data.map(row => {
                                    const taxVal = parseFloat(row.tax_cgst || 0) + parseFloat(row.tax_sgst || 0);
                                    const stClass = row.status === 'COMPLETED' ? 'status-completed' : (row.status === 'PENDING' ? 'status-pending' : 'status-cancelled');
                                    return `
                                        <tr>
                                            <td style="font-weight:800; color:#0f172a;">${row.order_reference || `#${row.id || row.bill_no}`}</td>
                                            <td style="color:#334155; font-weight:600;">${new Date(row.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                                            <td style="font-weight:700;">${row.order_type}</td>
                                            <td style="font-weight:600;">${row.payment_method || 'CASH'}</td>
                                            <td class="amount text-right">₹${parseFloat(row.subtotal || row.total_price || 0).toFixed(2)}</td>
                                            <td class="amount text-right" style="color:#dc2626;">₹${parseFloat(row.discount || 0).toFixed(2)}</td>
                                            <td class="amount text-right">₹${taxVal.toFixed(2)}</td>
                                            <td class="amount text-right" style="font-weight:900; color:#059669;">₹${parseFloat(row.total_price || 0).toFixed(2)}</td>
                                            <td class="text-center"><span class="status-badge ${stClass}">${row.status}</span></td>
                                            <td style="color:#2563eb; font-weight:700;">${getStaffOrWaiter(row)}</td>
                                            <td style="font-weight:700; color:#0f172a;">${getBilledBy(row)}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>

                        <div class="footer">
                            <span>Generated via SaSLoop Master POS System &bull; Confidential Financial Document</span>
                            <span>Shahe Tehzeeb Restaurant Audit</span>
                        </div>
                    </div>
                </body>
                </html>
            `;
        } else {
            return `
                <html>
                <head>
                    <title>Sales Report Summary</title>
                    <style>
                        @page { size: 80mm auto; margin: 0; }
                        body { 
                            font-family: monospace, Courier, monospace; 
                            width: 78mm; 
                            margin: 0 auto; 
                            padding: 8px; 
                            font-size: 11px; 
                            line-height: 1.3;
                            color: #000;
                        }
                        .center { text-align: center; }
                        .bold { font-weight: bold; }
                        .dashed-line { border-bottom: 1px dashed #000; margin: 6px 0; }
                        .flex-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
                        @media print {
                            body { margin: 0; padding: 4px; width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="center bold" style="font-size: 14px;">SALES REPORT SUMMARY</div>
                    <div class="center bold" style="font-size: 12px; margin-top: 2px;">${mainOutlet.toUpperCase()}</div>
                    <div class="dashed-line"></div>
                    <div>FROM: ${filters.from_date} ${filters.from_time}</div>
                    <div>TO:   ${filters.to_date} ${filters.to_time}</div>
                    <div class="dashed-line"></div>
                    
                    <div class="flex-row"><span>GROSS REVENUE:</span><span class="bold">₹${grossRevenue.toFixed(2)}</span></div>
                    <div class="flex-row"><span>TAX PROVISION:</span><span>₹${totalTax.toFixed(2)}</span></div>
                    <div class="flex-row"><span>TOTAL ORDERS:</span><span>${totalOrders}</span></div>
                    <div class="flex-row"><span>AVG ORDER VAL:</span><span>₹${avgOrderValue.toFixed(2)}</span></div>
                    
                    <div class="dashed-line"></div>
                    <div class="center bold">PAYMENT SUMMARY</div>
                    ${Object.entries(
                        data.reduce((acc, order) => {
                            const method = order.payment_method || 'CASH';
                            acc[method] = (acc[method] || 0) + parseFloat(order.total_price || 0);
                            return acc;
                        }, {})
                    ).map(([method, val]) => `
                        <div class="flex-row"><span>${method}:</span><span>₹${val.toFixed(2)}</span></div>
                    `).join('')}
                    
                    <div class="dashed-line"></div>
                    <div class="center bold">ORDER TYPE SUMMARY</div>
                    ${Object.entries(
                        data.reduce((acc, order) => {
                            const type = order.order_type || 'QUICK';
                            acc[type] = (acc[type] || 0) + parseFloat(order.total_price || 0);
                            return acc;
                        }, {})
                    ).map(([type, val]) => `
                        <div class="flex-row"><span>${type}:</span><span>₹${val.toFixed(2)}</span></div>
                    `).join('')}
                    
                    <div class="dashed-line"></div>
                    <div class="center" style="font-size: 9px;">PRINTED AT: ${new Date().toLocaleString()}</div>
                </body>
                </html>
            `;
        }
    };

    const handleExportPDF = async () => {
        if (data.length === 0) return;
        const html = generateReportHtml('PDF');
        const fileName = `Sales_Report_${filters.from_date}_${filters.from_time.replace(':','')}_to_${filters.to_date}_${filters.to_time.replace(':','')}.pdf`;

        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                const result = await ipcRenderer.invoke('generate-pdf', { html, fileName, isA4: true });
                if (result && result.base64) {
                    const link = document.createElement('a');
                    link.href = `data:application/pdf;base64,${result.base64}`;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    return;
                }
            } catch (err) {
                console.error("Electron PDF generation error, falling back to window print:", err);
            }
        }

        // Fallback A4 PDF print view
        const printWin = window.open('', '_blank', 'width=900,height=1000');
        if (printWin) {
            printWin.document.write(html + '<script>window.onload = () => { window.print(); }</script>');
            printWin.document.close();
        }
    };

    const handlePrintReport = (size) => {
        if (data.length === 0) return;
        const printHtml = generateReportHtml(size);
        
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.send('print-silent', { html: printHtml });
                return;
            } catch (err) {
                console.error("Silent report print failed:", err);
            }
        }
        
        const printWindow = window.open('', '_blank', 'width=900,height=1000');
        if (printWindow) {
            printWindow.document.write(printHtml + '<script>window.onload = () => { window.print(); window.close(); }</script>');
            printWindow.document.close();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <BarChart4 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Revenue Intelligence</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Financial audit & sales manifest orchestration</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handlePrintReport('thermal')}
                        disabled={data.length === 0}
                        className="px-3.5 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Print Thermal (3-inch)
                    </button>
                    <button 
                        onClick={() => handlePrintReport('A4')}
                        disabled={data.length === 0}
                        className="px-3.5 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-md shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Print A4
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        disabled={data.length === 0}
                        className="px-3.5 py-2 bg-rose-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center gap-1.5 shadow-md shadow-rose-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileText className="w-3.5 h-3.5" /> Save A4 PDF
                    </button>
                    <button 
                        onClick={handleExportExcel}
                        disabled={data.length === 0}
                        className="px-3.5 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-3.5 h-3.5" /> Export Excel
                    </button>
                </div>
            </div>

            {/* Tactical Intelligence Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="space-y-1.5 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Operating Hub</label>
                        <select 
                            value={filters.outlet_id}
                            onChange={e => setFilters(prev => ({ ...prev, outlet_id: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all"
                        >
                            {outlets.map(o => (
                                <option key={o.id} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Order Type</label>
                        <select 
                            value={filters.order_type}
                            onChange={e => setFilters(prev => ({ ...prev, order_type: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                            <option value="">All Order Types</option>
                            <option value="DINE_IN">Dine In</option>
                            <option value="TAKEAWAY">Takeaway</option>
                            <option value="DELIVERY">Delivery</option>
                            <option value="PICKUP">Pickup</option>
                            <option value="QUICK">Quick Bill</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Order Status</label>
                        <select 
                            value={filters.status}
                            onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-3">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal & Time Range Selector</label>
                        <div className="grid grid-cols-4 gap-2">
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase">From Date</span>
                                <input 
                                    type="date" 
                                    value={filters.from_date}
                                    onChange={e => setFilters(prev => ({ ...prev, from_date: e.target.value }))}
                                    className="w-full h-8 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase">From Time</span>
                                <input 
                                    type="time" 
                                    value={filters.from_time}
                                    onChange={e => setFilters(prev => ({ ...prev, from_time: e.target.value }))}
                                    className="w-full h-8 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase">To Date</span>
                                <input 
                                    type="date" 
                                    value={filters.to_date}
                                    onChange={e => setFilters(prev => ({ ...prev, to_date: e.target.value }))}
                                    className="w-full h-8 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase">To Time</span>
                                <input 
                                    type="time" 
                                    value={filters.to_time}
                                    onChange={e => setFilters(prev => ({ ...prev, to_time: e.target.value }))}
                                    className="w-full h-8 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Local Sales Reconciliation Active</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setFilters({
                                outlet_id: outlets[0]?.id || "",
                                from_date: new Date().toISOString().split('T')[0],
                                from_time: "00:00",
                                to_date: new Date().toISOString().split('T')[0],
                                to_time: "23:59",
                                status: "",
                                order_type: ""
                            })}
                            className="px-6 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Reset Range
                        </button>
                        <button 
                            onClick={fetchData}
                            className="px-10 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10"
                        >
                            Apply Intelligence
                        </button>
                    </div>
                </div>
                <IndianRupee className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Financial Telemetry Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Gross Revenue', val: `₹${grossRevenue.toFixed(2)}`, icon: IndianRupee, color: 'emerald' },
                    { label: 'Tax Provision', val: `₹${totalTax.toFixed(2)}`, icon: ShieldCheck, color: 'rose' },
                    { label: 'Total Orders', val: totalOrders.toString(), icon: ListChecks, color: 'indigo' },
                    { label: 'Avg Order Value', val: `₹${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:border-indigo-200 transition-all group cursor-pointer">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-[18px] font-bold text-slate-800 uppercase tracking-tight">{stat.val}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Audit Results Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm min-h-[450px] overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-indigo-500" /> Orders Manifest ({data.length})
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Type</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment Method</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subtotal</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Discount</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tax</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Price</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Waiter / Rider</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Billed By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="11" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                                        Scanning Local Sales Logs...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <PieChart className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">No Local Sales Found</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Adjust date/time filters to view orders</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => {
                                const taxVal = parseFloat(row.tax_cgst || 0) + parseFloat(row.tax_sgst || 0);
                                return (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4 font-bold text-slate-800 uppercase tracking-tight text-[11px]">
                                            {row.order_reference || `#${row.id || row.bill_no}`}
                                        </td>
                                        <td className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase">
                                            {new Date(row.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-5 py-4 text-[10px] font-bold text-slate-600 uppercase">
                                            {row.order_type}
                                        </td>
                                        <td className="px-5 py-4 text-[10px] font-bold text-slate-600 uppercase">
                                            {row.payment_method || "CASH"}
                                        </td>
                                        <td className="px-5 py-4 text-[11px] font-bold text-slate-700">
                                            ₹{parseFloat(row.subtotal || row.total_price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-4 text-[11px] font-bold text-rose-500">
                                            ₹{parseFloat(row.discount || 0).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-4 text-[11px] font-bold text-slate-600">
                                            ₹{taxVal.toFixed(2)}
                                        </td>
                                        <td className="px-5 py-4 text-[11px] font-bold text-emerald-600">
                                            ₹{parseFloat(row.total_price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-widest ${
                                                row.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                row.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-[10px] font-bold text-indigo-600 uppercase">
                                            {getStaffOrWaiter(row)}
                                        </td>
                                        <td className="px-5 py-4 text-[10px] font-bold text-slate-700 uppercase text-right">
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

export default SalesReport;
