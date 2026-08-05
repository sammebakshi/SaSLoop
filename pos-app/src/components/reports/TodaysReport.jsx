import React, { useState, useEffect, useCallback } from "react";
import { 
  FileText, Search, RefreshCw, Filter, 
  Plus, Database, CheckCircle2, Trash2, 
  Edit3, Tag, ListChecks, Printer,
  Download, History, IndianRupee, 
  Zap, Calendar, Clock, ShieldCheck,
  TrendingUp, Layers, Cpu, MoreVertical, ChevronRight, AlertCircle, Wallet
} from "lucide-react";
import { API_BASE } from "../../services/api";

const TodaysReport = () => {
    const [loading, setLoading] = useState(false);
    const [outlets, setOutlets] = useState([]);
    const todayStr = new Date().toISOString().split('T')[0];
    const [filters, setFilters] = useState({
        outlet_id: "",
        date: todayStr,
        from_time: "00:00",
        to_time: "23:59"
    });

    const [metrics, setMetrics] = useState({
        netSaleAmt: 0,
        totalTax: 0,
        totalSales: 0,
        totalTipsCollected: 0,
        roundOff: 0,
        totalDiscount: 0,
        totalCharges: 0,
        taxOnCharges: 0,
        totalCancelledOrderCharges: 0,
        complimentaryOrder: 0,
        pendingOrder: 0,
        cancelledOrder: 0,
        deletedOrders: 0,
        totalDuePaymentsReceivable: 0,
        totalDuePaymentsReceived: 0,
        walletDebited: 0,
        walletCredited: 0,
        totalBills: 0,
        billRange: "N/A",
        payment_breakdown: []
    });

    const getProfileInfo = () => {
        try {
            const p = localStorage.getItem('pos_profile');
            if (p) return JSON.parse(p);
        } catch (e) {}
        return null;
    };

    const getOutletName = () => {
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

            const targetDate = filters.date || todayStr;
            const fromStr = `${targetDate} ${filters.from_time || "00:00"}:00`;
            const toStr = `${targetDate} ${filters.to_time || "23:59"}:59`;
            const fromTime = new Date(fromStr).getTime();
            const toTime = new Date(toStr).getTime();

            const filtered = localOrders.filter(order => {
                const orderTime = order.created_at ? new Date(order.created_at).getTime() : Date.now();
                return orderTime >= fromTime && orderTime <= toTime;
            });

            // Filter sets
            const validOrders = filtered.filter(o => o.status !== 'CANCELLED' && o.status !== 'DELETED' && o.status !== 'REFUNDED');
            const cancelledOrders = filtered.filter(o => o.status === 'CANCELLED');
            const deletedOrdersList = filtered.filter(o => o.status === 'DELETED');
            const pendingOrdersList = filtered.filter(o => o.status === 'PENDING');
            const complimentaryOrdersList = filtered.filter(o => o.is_complimentary || o.discount_type === 'COMPLIMENTARY' || parseFloat(o.total_price || 0) === 0);

            // Calculation variables
            let totalSales = 0;
            let totalTax = 0;
            let netSaleAmt = 0;
            let totalTipsCollected = 0;
            let roundOff = 0;
            let totalDiscount = 0;
            let totalCharges = 0;
            let taxOnCharges = 0;
            let totalCancelledOrderCharges = 0;
            let totalDuePaymentsReceivable = 0;
            let totalDuePaymentsReceived = 0;
            let walletDebited = 0;
            let walletCredited = 0;

            const modeMap = {};
            const billNos = [];

            validOrders.forEach(o => {
                const totalPrice = parseFloat(o.total_price || 0);
                const subtotal = parseFloat(o.subtotal || o.total_price || 0);
                const tax = parseFloat(o.tax_cgst || 0) + parseFloat(o.tax_sgst || 0);
                const discount = parseFloat(o.discount || 0);
                const tip = parseFloat(o.tip_amount || o.tip || 0);
                const round = parseFloat(o.round_off || 0);
                const charges = parseFloat(o.delivery_charge || o.packaging_charge || o.extra_charges || 0);
                const chargeTax = parseFloat(o.tax_on_charges || 0);

                totalSales += totalPrice;
                totalTax += tax;
                totalDiscount += discount;
                totalTipsCollected += tip;
                roundOff += round;
                totalCharges += charges;
                taxOnCharges += chargeTax;

                const mode = (o.payment_method || o.payment_mode || 'CASH').toUpperCase();
                modeMap[mode] = (modeMap[mode] || 0) + totalPrice;

                if (mode === 'WALLET') {
                    walletDebited += totalPrice;
                }
                if (o.payment_status === 'UNPAID' || mode === 'CREDIT' || mode === 'DUE') {
                    totalDuePaymentsReceivable += totalPrice;
                }

                if (o.bill_no) billNos.push(o.bill_no);
                else if (o.id) billNos.push(o.id);
            });

            cancelledOrders.forEach(o => {
                const cancelCharge = parseFloat(o.cancellation_charge || o.cancellation_fee || 0);
                totalCancelledOrderCharges += cancelCharge;
            });

            netSaleAmt = totalSales - totalTax - totalCharges - taxOnCharges;
            if (netSaleAmt < 0) netSaleAmt = totalSales - totalTax;

            // Bill range format
            let billRange = "N/A";
            if (billNos.length > 0) {
                const first = billNos[billNos.length - 1];
                const last = billNos[0];
                billRange = first === last ? `#${first}` : `#${first} - #${last}`;
            }

            const payment_breakdown = Object.entries(modeMap).map(([mode, total]) => ({ mode, total }));

            setMetrics({
                netSaleAmt,
                totalTax,
                totalSales,
                totalTipsCollected,
                roundOff,
                totalDiscount,
                totalCharges,
                taxOnCharges,
                totalCancelledOrderCharges,
                complimentaryOrder: complimentaryOrdersList.length,
                pendingOrder: pendingOrdersList.length,
                cancelledOrder: cancelledOrders.length,
                deletedOrders: deletedOrdersList.length,
                totalDuePaymentsReceivable,
                totalDuePaymentsReceived,
                walletDebited,
                walletCredited,
                totalBills: filtered.length,
                billRange,
                payment_breakdown
            });

        } catch (e) {
            console.error("Error calculating local Today's Report metrics:", e);
        } finally {
            setLoading(false);
        }
    }, [filters.date, filters.from_time, filters.to_time]);

    useEffect(() => {
        loadOutlets();
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePrintReport = async (size) => {
        const outletName = getOutletName();
        const printDateStr = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

        const rowsList = [
            { label: "Net Sale Amt:", val: `Rs ${metrics.netSaleAmt.toFixed(2)}` },
            { label: "Total Tax:", val: `Rs ${metrics.totalTax.toFixed(2)}` },
            { label: "Total Sales:", val: `Rs ${metrics.totalSales.toFixed(2)}` },
            { label: "Total Tips Collected:", val: `Rs ${metrics.totalTipsCollected.toFixed(2)}` },
            { label: "Round Off:", val: `Rs ${metrics.roundOff.toFixed(2)}` },
            { label: "Total Discount:", val: `Rs ${metrics.totalDiscount.toFixed(2)}` },
            { label: "Total Charges:", val: `Rs ${metrics.totalCharges.toFixed(2)}` },
            { label: "Tax On Charges:", val: `Rs ${metrics.taxOnCharges.toFixed(2)}` },
            { label: "Total Cancelled Order Charges:", val: `Rs ${metrics.totalCancelledOrderCharges.toFixed(2)}` },
            { label: "Complimentary Order:", val: `${metrics.complimentaryOrder}` },
            { label: "Pending Order:", val: `${metrics.pendingOrder}` },
            { label: "Cancelled Order:", val: `${metrics.cancelledOrder}` },
            { label: "Deleted Orders:", val: `${metrics.deletedOrders}` },
            { label: "Total Due Payments Receivable:", val: `Rs ${metrics.totalDuePaymentsReceivable.toFixed(2)}` },
            { label: "Total Due Payments Received:", val: `Rs ${metrics.totalDuePaymentsReceived.toFixed(2)}` },
            { label: "Wallet Debited:", val: `Rs ${metrics.walletDebited.toFixed(2)}` },
            { label: "Wallet Credited:", val: `Rs ${metrics.walletCredited.toFixed(2)}` },
            { label: "Total Bills:", val: `${metrics.totalBills}` },
            { label: "Bill Range:", val: `${metrics.billRange}` },
        ];

        let printHtml = '';
        if (size === 'A4') {
            printHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Today's Sales Report - ${outletName}</title>
                    <style>
                        @page { size: A4 portrait; margin: 12mm; }
                        * { box-sizing: border-box; }
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
                            padding: 0; margin: 0; color: #0f172a; background: #ffffff;
                            -webkit-print-color-adjust: exact; print-color-adjust: exact;
                            font-size: 11px; line-height: 1.5;
                        }
                        .header-container {
                            display: flex; justify-content: space-between; align-items: flex-start;
                            border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;
                        }
                        .brand-title { font-size: 22px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 0; }
                        .subtitle { font-size: 12px; font-weight: 800; color: #059669; text-transform: uppercase; margin-top: 4px; }
                        .meta-box { text-align: right; font-size: 10px; color: #475569; line-height: 1.6; }
                        
                        .report-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
                        .report-table th { background: #0f172a; color: #ffffff; padding: 8px 12px; text-transform: uppercase; font-size: 10px; text-align: left; }
                        .report-table td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; }
                        .report-table tr:nth-child(even) { background: #f8fafc; }
                        .val-col { text-align: right; font-weight: 800; font-family: 'Courier New', Courier, monospace; font-size: 12px; }

                        .footer { margin-top: 30px; border-top: 1.5px solid #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #64748b; font-weight: 700; }
                    </style>
                </head>
                <body>
                    <div class="header-container">
                        <div>
                            <h1 class="brand-title">${outletName}</h1>
                            <div class="subtitle">Official Today's Summary & Audit Report</div>
                        </div>
                        <div class="meta-box">
                            <div><strong>Date & Shift Window:</strong> ${filters.date} (${filters.from_time} - ${filters.to_time})</div>
                            <div><strong>Generated On:</strong> ${printDateStr}</div>
                            <div><strong>Terminal Node:</strong> Master POS Client</div>
                        </div>
                    </div>

                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>Summary Metric Field</th>
                                <th style="text-align: right;">Metric Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsList.map(r => `
                                <tr>
                                    <td>${r.label}</td>
                                    <td class="val-col">${r.val}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    ${metrics.payment_breakdown.length > 0 ? `
                        <div style="margin-top: 20px;">
                            <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">Payment Collection Split</div>
                            <table class="report-table">
                                <thead>
                                    <tr>
                                        <th>Payment Mode</th>
                                        <th style="text-align: right;">Collected Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${metrics.payment_breakdown.map(p => `
                                        <tr>
                                            <td>${p.mode}</td>
                                            <td class="val-col">Rs ${parseFloat(p.total || 0).toFixed(2)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : ''}

                    <div class="footer">
                        <span>Generated via SaSLoop Master POS System &bull; Confidential Document</span>
                        <span>Audited Summary Report</span>
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
                    <title>Today's Report Thermal Slip</title>
                    <style>
                        @page { size: 80mm auto; margin: 0; }
                        body { 
                            font-family: monospace, Courier, monospace; 
                            width: 78mm; margin: 0 auto; padding: 6px; 
                            font-size: 11px; line-height: 1.35; color: #000;
                        }
                        .center { text-align: center; }
                        .bold { font-weight: bold; }
                        .dashed-line { border-bottom: 1px dashed #000; margin: 6px 0; }
                        .flex-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
                        @media print { body { margin: 0; padding: 4px; width: 100%; } }
                    </style>
                </head>
                <body>
                    <div class="center bold" style="font-size: 13px;">TODAY'S SALES REPORT</div>
                    <div class="center bold">${outletName.toUpperCase()}</div>
                    <div class="dashed-line"></div>
                    <div>DATE: ${filters.date}</div>
                    <div>TIME: ${filters.from_time} TO ${filters.to_time}</div>
                    <div class="dashed-line"></div>

                    ${rowsList.map(r => `
                        <div class="flex-row"><span>${r.label}</span><span class="bold">${r.val}</span></div>
                    `).join('')}

                    ${metrics.payment_breakdown.length > 0 ? `
                        <div class="dashed-line"></div>
                        <div class="center bold">PAYMENT COLLECTION</div>
                        ${metrics.payment_breakdown.map(p => `
                            <div class="flex-row"><span>${p.mode}:</span><span class="bold">Rs ${parseFloat(p.total || 0).toFixed(2)}</span></div>
                        `).join('')}
                    ` : ''}

                    <div class="dashed-line"></div>
                    <div class="center" style="font-size: 9px;">PRINTED: ${printDateStr}</div>
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
                        fileName: `Todays_Report_${filters.from_date}.pdf`,
                        isA4: true 
                    });
                    if (result && result.base64) {
                        const link = document.createElement('a');
                        link.href = `data:application/pdf;base64,${result.base64}`;
                        link.download = `Todays_Report_${filters.from_date}.pdf`;
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

    const displayRows = [
        { label: "Net Sale Amt:", val: `Rs ${metrics.netSaleAmt.toFixed(2)}`, highlight: true, color: "emerald" },
        { label: "Total Tax:", val: `Rs ${metrics.totalTax.toFixed(2)}` },
        { label: "Total Sales:", val: `Rs ${metrics.totalSales.toFixed(2)}`, highlight: true, color: "indigo" },
        { label: "Total Tips Collected:", val: `Rs ${metrics.totalTipsCollected.toFixed(2)}` },
        { label: "Round Off:", val: `Rs ${metrics.roundOff.toFixed(2)}` },
        { label: "Total Discount:", val: `Rs ${metrics.totalDiscount.toFixed(2)}` },
        { label: "Total Charges:", val: `Rs ${metrics.totalCharges.toFixed(2)}` },
        { label: "Tax On Charges:", val: `Rs ${metrics.taxOnCharges.toFixed(2)}` },
        { label: "Total Cancelled Order Charges:", val: `Rs ${metrics.totalCancelledOrderCharges.toFixed(2)}` },
        { label: "Complimentary Order:", val: `${metrics.complimentaryOrder}` },
        { label: "Pending Order:", val: `${metrics.pendingOrder}` },
        { label: "Cancelled Order:", val: `${metrics.cancelledOrder}`, highlight: metrics.cancelledOrder > 0, color: "rose" },
        { label: "Deleted Orders:", val: `${metrics.deletedOrders}`, highlight: metrics.deletedOrders > 0, color: "rose" },
        { label: "Total Due Payments Receivable:", val: `Rs ${metrics.totalDuePaymentsReceivable.toFixed(2)}` },
        { label: "Total Due Payments Received:", val: `Rs ${metrics.totalDuePaymentsReceived.toFixed(2)}` },
        { label: "Wallet Debited:", val: `Rs ${metrics.walletDebited.toFixed(2)}` },
        { label: "Wallet Credited:", val: `Rs ${metrics.walletCredited.toFixed(2)}` },
        { label: "Total Bills:", val: `${metrics.totalBills}`, highlight: true, color: "slate" },
        { label: "Bill Range:", val: `${metrics.billRange}` },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-slate-800 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100/50">
                        <Zap className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            Today's Operational Sales Report <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] border border-rose-200 rounded-full font-extrabold">LIVE AUDIT</span>
                        </h2>
                        <p className="text-[11px] text-slate-500 font-semibold">Real-Time Daily Settlement Summary & Metrics Matrix</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handlePrintReport('thermal')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
                    >
                        <Printer className="w-3.5 h-3.5" /> Thermal 3-Inch
                    </button>
                    <button 
                        onClick={() => handlePrintReport('A4')}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
                    >
                        <Printer className="w-3.5 h-3.5" /> Save A4 PDF
                    </button>
                    <button 
                        onClick={fetchData}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                        title="Refresh Report"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filter Box */}
            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Filter className="w-4 h-4 text-rose-500" /> Operational Shift Time Filter
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Outlet: {getOutletName()}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Report Date</label>
                        <input 
                            type="date" 
                            value={filters.date}
                            onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-800 outline-none focus:border-rose-500 transition-all cursor-pointer" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From Time</label>
                        <input 
                            type="time" 
                            value={filters.from_time}
                            onChange={e => setFilters(prev => ({ ...prev, from_time: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-800 outline-none focus:border-rose-500 transition-all cursor-pointer" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">To Time</label>
                        <input 
                            type="time" 
                            value={filters.to_time}
                            onChange={e => setFilters(prev => ({ ...prev, to_time: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-800 outline-none focus:border-rose-500 transition-all cursor-pointer" 
                        />
                    </div>
                    <button 
                        onClick={fetchData}
                        className="h-9 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <Clock className="w-3.5 h-3.5" /> Apply Time Window
                    </button>
                </div>
            </div>

            {/* Structured 19-Field Metrics Matrix Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-4 h-4 text-rose-500" /> Today's Sales Audit Manifest (19 Metrics)
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Live Master POS Audit</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {displayRows.map((row, idx) => (
                        <div key={idx} className={`px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors ${
                            row.highlight ? 'bg-slate-50/60 font-black' : ''
                        }`}>
                            <span className="text-xs font-bold text-slate-700 tracking-tight">{row.label}</span>
                            <span className={`text-xs font-black font-mono ${
                                row.color === 'emerald' ? 'text-emerald-600 text-sm' :
                                row.color === 'indigo' ? 'text-indigo-600 text-sm' :
                                row.color === 'rose' ? 'text-rose-600 font-bold' :
                                'text-slate-900'
                            }`}>
                                {row.val}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Collection Split */}
            {metrics.payment_breakdown.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                        <span>Payment Collection Split</span>
                        <Wallet className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-4 divide-y divide-slate-100">
                        {metrics.payment_breakdown.map((p, i) => (
                            <div key={i} className="py-2.5 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase">{p.mode}</span>
                                <span className="text-xs font-black text-slate-900 font-mono">Rs {parseFloat(p.total || 0).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodaysReport;
