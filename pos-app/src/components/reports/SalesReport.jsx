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
        to_date: new Date().toISOString().split('T')[0],
        status: "",
        order_type: ""
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
                    setFilters(prev => ({ ...prev, outlet_id: d[0].id }));
                }
            }
        } catch (e) {
            console.error("Error loading outlets:", e);
        }
    };

    const fetchData = useCallback(async () => {
        if (!filters.outlet_id) return;
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.outlet_id) queryParams.append("outlet_id", filters.outlet_id);
            if (filters.from_date) queryParams.append("from_date", filters.from_date + " 00:00:00");
            if (filters.to_date) queryParams.append("to_date", filters.to_date + " 23:59:59");
            if (filters.status) queryParams.append("status", filters.status);
            if (filters.order_type) queryParams.append("order_type", filters.order_type);

            const res = await fetch(`${API_BASE}/api/brand/analytics/sales-report?${queryParams.toString()}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            if (res.ok) {
                const d = await res.json();
                setData(d);
            }
        } catch (e) {
            console.error("Error loading sales report:", e);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadOutlets();
    }, []);

    useEffect(() => {
        if (filters.outlet_id) {
            fetchData();
        }
    }, [filters.outlet_id, fetchData]);

    // Calculate Summary stats
    const totalOrders = data.length;
    const grossRevenue = data.reduce((acc, order) => acc + parseFloat(order.total_price || 0), 0);
    const totalTax = data.reduce((acc, order) => acc + (parseFloat(order.tax_cgst || 0) + parseFloat(order.tax_sgst || 0)), 0);
    const avgOrderValue = totalOrders > 0 ? (grossRevenue / totalOrders) : 0;

    const handleExport = () => {
        if (data.length === 0) return;
        const ws = XLSX.utils.json_to_sheet(data.map(order => ({
            "Order ID": order.id,
            "Reference": order.order_reference,
            "Date": new Date(order.created_at).toLocaleString(),
            "Outlet": order.outlet_name || "N/A",
            "Order Type": order.order_type,
            "Subtotal": parseFloat(order.subtotal || order.total_price || 0).toFixed(2),
            "Discount": parseFloat(order.discount || 0).toFixed(2),
            "Tax (CGST)": parseFloat(order.tax_cgst || 0).toFixed(2),
            "Tax (SGST)": parseFloat(order.tax_sgst || 0).toFixed(2),
            "Total Price": parseFloat(order.total_price || 0).toFixed(2),
            "Payment Method": order.payment_method,
            "Status": order.status,
            "Billed By": order.generated_by_name || "N/A"
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
        XLSX.writeFile(wb, `Sales_Report_${filters.from_date}_to_${filters.to_date}.xlsx`);
    };

    const handlePrintReport = (size) => {
        if (data.length === 0) return;
        
        let printHtml = '';
        if (size === 'A4') {
            printHtml = `
                <html>
                <head>
                    <title>Sales Report</title>
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
                    <h1>Sales Report</h1>
                    <h2>Outlet: ${data[0]?.outlet_name || 'N/A'} | Range: ${filters.from_date} to ${filters.to_date}</h2>
                    
                    <div class="summary-grid">
                        <div class="summary-card">
                            <p>Gross Revenue</p>
                            <h3>₹${grossRevenue.toFixed(2)}</h3>
                        </div>
                        <div class="summary-card">
                            <p>Tax Provision</p>
                            <h3>₹${totalTax.toFixed(2)}</h3>
                        </div>
                        <div class="summary-card">
                            <p>Total Orders</p>
                            <h3>${totalOrders}</h3>
                        </div>
                        <div class="summary-card">
                            <p>Avg Order Value</p>
                            <h3>₹${avgOrderValue.toFixed(2)}</h3>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>Date</th>
                                <th>Order Type</th>
                                <th>Payment Method</th>
                                <th>Subtotal</th>
                                <th>Discount</th>
                                <th>Tax</th>
                                <th>Total Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(row => {
                                const taxVal = parseFloat(row.tax_cgst || 0) + parseFloat(row.tax_sgst || 0);
                                return `
                                    <tr>
                                        <td>${row.order_reference || `#${row.id}`}</td>
                                        <td>${new Date(row.created_at).toLocaleString()}</td>
                                        <td>${row.order_type}</td>
                                        <td>${row.payment_method || 'CASH'}</td>
                                        <td>₹${parseFloat(row.subtotal || row.total_price || 0).toFixed(2)}</td>
                                        <td>₹${parseFloat(row.discount || 0).toFixed(2)}</td>
                                        <td>₹${taxVal.toFixed(2)}</td>
                                        <td>₹${parseFloat(row.total_price || 0).toFixed(2)}</td>
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
                    <title>Sales Report Summary</title>
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
                    <div class="center bold">SALES REPORT SUMMARY</div>
                    <div class="center bold">${(data[0]?.outlet_name || 'OUTLET').toUpperCase()}</div>
                    <div class="dashed-line"></div>
                    <div>FROM: ${filters.from_date}</div>
                    <div>TO:   ${filters.to_date}</div>
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
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-3.5 h-3.5" /> Export Report
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
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all"
                        >
                            <option value="">All Order Types</option>
                            <option value="DINEIN">Dine In</option>
                            <option value="TAKEAWAY">Takeaway</option>
                            <option value="DELIVERY">Delivery</option>
                            <option value="PICKUP">Pickup</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Order Status</label>
                        <select 
                            value={filters.status}
                            onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all"
                        >
                            <option value="">All Statuses</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input 
                                type="date" 
                                value={filters.from_date}
                                onChange={e => setFilters(prev => ({ ...prev, from_date: e.target.value }))}
                                className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                            />
                            <input 
                                type="date" 
                                value={filters.to_date}
                                onChange={e => setFilters(prev => ({ ...prev, to_date: e.target.value }))}
                                className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                            />
                        </div>
                    </div>
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Live Reconciliation Enabled</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setFilters({
                                outlet_id: outlets[0]?.id || "",
                                from_date: new Date().toISOString().split('T')[0],
                                to_date: new Date().toISOString().split('T')[0],
                                status: "",
                                order_type: ""
                            })}
                            className="px-6 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Reset Matrix
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
                        <Database className="w-3.5 h-3.5 text-indigo-500" /> Orders Manifest
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment Method</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subtotal</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tax</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Price</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Billed By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                                        Scanning Database Vaults...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <PieChart className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">No Sales Found</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Adjust filters or range to fetch data</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => {
                                const taxVal = parseFloat(row.tax_cgst || 0) + parseFloat(row.tax_sgst || 0);
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
                                            ₹{parseFloat(row.subtotal || row.total_price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-rose-500">
                                            ₹{parseFloat(row.discount || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-600">
                                            ₹{taxVal.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-emerald-600">
                                            ₹{parseFloat(row.total_price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-widest ${
                                                row.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                row.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">
                                            {row.generated_by_name || "N/A"}
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
