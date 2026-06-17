import React, { useState, useEffect, useCallback } from "react";
import { 
  FileText, Search, RefreshCw, Filter, 
  Download, Calendar, IndianRupee, ShieldCheck, 
  TrendingUp, PieChart, ChevronDown, ListChecks,
  Printer, Share2, Database, ChevronRight
} from "lucide-react";
import { API_BASE } from "../../services/api";
import * as XLSX from 'xlsx';

const DSRReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [outlets, setOutlets] = useState([]);
    const [filters, setFilters] = useState({
        outlet_ids: "",
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
        status: "COMPLETED"
    });

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

    const fetchData = useCallback(async () => {
        if (!filters.outlet_ids) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("outlet_ids", filters.outlet_ids);
            if (filters.from_date) queryParams.append("from_date", filters.from_date + " 00:00:00");
            if (filters.to_date) queryParams.append("to_date", filters.to_date + " 23:59:59");
            if (filters.status) queryParams.append("status", filters.status);

            const res = await fetch(`${API_BASE}/api/brand/analytics/dsr-report?${queryParams.toString()}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            if (res.ok) {
                const d = await res.json();
                setData(d);
            }
        } catch (e) {
            console.error("Error loading DSR report:", e);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadOutlets();
    }, []);

    useEffect(() => {
        if (filters.outlet_ids) {
            fetchData();
        }
    }, [filters.outlet_ids, fetchData]);

    // Summary calculations
    const totalSales = data.reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0);
    const taxCollected = data.reduce((acc, o) => acc + (parseFloat(o.tax_cgst || 0) + parseFloat(o.tax_sgst || 0)), 0);
    const discountAllowed = data.reduce((acc, o) => acc + parseFloat(o.discount || 0), 0);
    // Let's assume net liquidity is total sales - discount or net of something
    const netLiquidity = totalSales - discountAllowed;

    const handleExport = () => {
        if (data.length === 0) return;
        const ws = XLSX.utils.json_to_sheet(data.map(order => ({
            "Order Reference": order.order_reference,
            "Date": new Date(order.created_at).toLocaleString(),
            "Outlet": order.outlet_name || "N/A",
            "Order Type": order.order_type,
            "Gross Sale": parseFloat(order.total_price || 0).toFixed(2),
            "Tax (CGST)": parseFloat(order.tax_cgst || 0).toFixed(2),
            "Tax (SGST)": parseFloat(order.tax_sgst || 0).toFixed(2),
            "Discount": parseFloat(order.discount || 0).toFixed(2),
            "Payment Mode": order.payment_method || "CASH",
            "Status": order.status
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DSR Manifest");
        XLSX.writeFile(wb, `DSR_Report_${filters.from_date}.xlsx`);
    };

    const handlePrintReport = (size) => {
        if (data.length === 0) return;
        
        let printHtml = '';
        if (size === 'A4') {
            printHtml = `
                <html>
                <head>
                    <title>Daily Sales Reconciliation (DSR) Report</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; color: #333; }
                        h1 { font-size: 20px; text-align: center; margin-bottom: 5px; }
                        h2 { font-size: 14px; text-align: center; color: #666; margin-top: 0; margin-bottom: 20px; }
                        .summary-grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
                        .summary-card { border: 1px solid #ccc; padding: 15px; border-radius: 5px; text-align: center; }
                        .summary-card p { margin: 0; font-size: 10px; text-transform: uppercase; color: #666; font-weight: bold; }
                        .summary-card h3 { margin: 5px 0 0 0; font-size: 18px; color: #111; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; font-weight: bold; text-transform: uppercase; }
                        tr:nth-child(even) { background-color: #fafafa; }
                        @media print {
                            body { padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Daily Sales Reconciliation (DSR) Report</h1>
                    <h2>Outlet: ${data[0]?.outlet_name || 'N/A'} | Range: ${filters.from_date} to ${filters.to_date}</h2>
                    
                    <div class="summary-grid">
                        <div class="summary-card">
                            <p>Total Sales</p>
                            <h3>₹${totalSales.toFixed(2)}</h3>
                        </div>
                        <div class="summary-card">
                            <p>Tax Collected</p>
                            <h3>₹${taxCollected.toFixed(2)}</h3>
                        </div>
                        <div class="summary-card">
                            <p>Discounts</p>
                            <h3>₹${discountAllowed.toFixed(2)}</h3>
                        </div>
                        <div class="summary-card">
                            <p>Net Liquidity</p>
                            <h3>₹${netLiquidity.toFixed(2)}</h3>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>Date</th>
                                <th>Order Type</th>
                                <th>Payment Mode</th>
                                <th>Gross Sale</th>
                                <th>Discount</th>
                                <th>Tax Provision</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(row => {
                                const tax = parseFloat(row.tax_cgst || 0) + parseFloat(row.tax_sgst || 0);
                                return `
                                    <tr>
                                        <td>${row.order_reference || `#${row.id}`}</td>
                                        <td>${new Date(row.created_at).toLocaleString()}</td>
                                        <td>${row.order_type}</td>
                                        <td>${row.payment_method || 'CASH'}</td>
                                        <td>₹${parseFloat(row.total_price || 0).toFixed(2)}</td>
                                        <td>₹${parseFloat(row.discount || 0).toFixed(2)}</td>
                                        <td>₹${tax.toFixed(2)}</td>
                                        <td>${row.status}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    <script>window.onload = () => { window.print(); window.close(); }</script>
                </body>
                </html>
            `;
        } else {
            printHtml = `
                <html>
                <head>
                    <title>DSR Report Summary</title>
                    <style>
                        body { 
                            font-family: monospace; 
                            width: ${size === 'thermal58' ? '180px' : '260px'}; 
                            margin: 0 auto; 
                            padding: 10px; 
                            font-size: 10px; 
                            line-height: 1.3;
                        }
                        .center { text-align: center; }
                        .bold { font-weight: bold; }
                        .dashed-line { border-bottom: 1px dashed #000; margin: 8px 0; }
                        .flex-row { display: flex; justify-content: space-between; }
                        @media print {
                            body { margin: 0; padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="center bold">DSR REPORT SUMMARY</div>
                    <div class="center bold">${(data[0]?.outlet_name || 'OUTLET').toUpperCase()}</div>
                    <div class="dashed-line"></div>
                    <div>FROM: ${filters.from_date}</div>
                    <div>TO:   ${filters.to_date}</div>
                    <div class="dashed-line"></div>
                    
                    <div class="flex-row"><span>TOTAL SALES:</span><span class="bold">₹${totalSales.toFixed(2)}</span></div>
                    <div class="flex-row"><span>TAX COLLECTED:</span><span>₹${taxCollected.toFixed(2)}</span></div>
                    <div class="flex-row"><span>DISCOUNTS:</span><span>₹${discountAllowed.toFixed(2)}</span></div>
                    <div class="flex-row"><span>NET LIQUIDITY:</span><span class="bold">₹${netLiquidity.toFixed(2)}</span></div>
                    
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
                    <div class="center">PRINTED AT: ${new Date().toLocaleString()}</div>
                    <script>window.onload = () => { window.print(); window.close(); }</script>
                </body>
                </html>
            `;
        }
        
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.send('print-silent', { html: printHtml.replace(/<script>.*<\/script>/, '') });
                return;
            } catch (err) {
                console.error("Silent report print failed:", err);
            }
        }
        
        const printWindow = window.open('', '_blank', 'width=600,height=800');
        if (printWindow) {
            printWindow.document.write(printHtml);
            printWindow.document.close();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">DSR Intelligence</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daily Sales Reconciliation & physical audit</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handlePrintReport('thermal')}
                        disabled={data.length === 0}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Print Thermal (3-inch)
                    </button>
                    <button 
                        onClick={() => handlePrintReport('A4')}
                        disabled={data.length === 0}
                        className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Print A4
                    </button>
                    <button 
                        onClick={handleExport}
                        disabled={data.length === 0}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10 disabled:opacity-50"
                    >
                        <Download className="w-3.5 h-3.5" /> Export Manifest
                    </button>
                </div>
            </div>

            {/* Tactical DSR Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-1.5 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Select Outlet</label>
                        <select 
                            value={filters.outlet_ids}
                            onChange={e => setFilters(prev => ({ ...prev, outlet_ids: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                            {outlets.map(o => (
                                <option key={o.id} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Audit Date Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input 
                                type="date" 
                                value={filters.from_date}
                                onChange={e => setFilters(prev => ({ ...prev, from_date: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                            />
                            <input 
                                type="date" 
                                value={filters.to_date}
                                onChange={e => setFilters(prev => ({ ...prev, to_date: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                            />
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <button 
                            onClick={fetchData}
                            className="flex-1 h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95"
                        >
                            Apply Audit
                        </button>
                        <button 
                            onClick={fetchData}
                            className="p-2.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <Database className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Daily Telemetry Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Sales', val: `₹${totalSales.toFixed(2)}`, icon: IndianRupee, color: 'emerald' },
                    { label: 'Tax Collected', val: `₹${taxCollected.toFixed(2)}`, icon: ShieldCheck, color: 'rose' },
                    { label: 'Discounts', val: `₹${discountAllowed.toFixed(2)}`, icon: TrendingUp, color: 'amber' },
                    { label: 'Net Liquidity', val: `₹${netLiquidity.toFixed(2)}`, icon: ListChecks, color: 'indigo' }
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

            {/* Reconciliation Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-indigo-500" /> Daily Reconciliation Manifest
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment Mode</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gross Sale</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tax Provision</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="py-20 text-center font-bold uppercase text-[10px] tracking-widest text-slate-400 animate-pulse">
                                        Reconciling Daily Logs...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-20 text-center font-bold uppercase text-[10px] tracking-widest text-slate-300">
                                        No Reconciliation Logs Found
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => {
                                const tax = parseFloat(row.tax_cgst || 0) + parseFloat(row.tax_sgst || 0);
                                return (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-800 uppercase tracking-tight text-[11px]">
                                            {row.order_reference || `#${row.id}`}
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                                            {new Date(row.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase">
                                            {row.order_type}
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase">
                                            {row.payment_method || "CASH"}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-700">
                                            ₹{parseFloat(row.total_price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-rose-500">
                                            ₹{parseFloat(row.discount || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-600">
                                            ₹{tax.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">
                                            <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-widest ${
                                                row.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                                {row.status}
                                            </span>
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
