import React, { useState, useEffect, useCallback } from "react";
import { 
  FileText, Search, RefreshCw, Filter, 
  Plus, Database, CheckCircle2, Trash2, 
  Edit3, Tag, ListChecks, Printer,
  Download, History, IndianRupee, 
  Zap, Calendar, Clock, ShieldCheck,
  TrendingUp, Layers, Cpu, MoreVertical, ChevronRight
} from "lucide-react";
import { API_BASE } from "../../services/api";

const TodaysReport = () => {
    const [data, setData] = useState({
        total_orders: 0,
        total_sales: 0,
        total_tax: 0,
        cancelled_orders: 0,
        pending_orders: 0,
        fulfilled_orders: 0
    });
    const [loading, setLoading] = useState(false);
    const [outlets, setOutlets] = useState([]);
    const [filters, setFilters] = useState({
        outlet_id: "",
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0]
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
            queryParams.append("outlet_id", filters.outlet_id);
            queryParams.append("from_date", filters.from_date + " 00:00:00");
            queryParams.append("to_date", filters.to_date + " 23:59:59");

            const res = await fetch(`${API_BASE}/api/brand/analytics/z-report?${queryParams.toString()}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            if (res.ok) {
                const d = await res.json();
                setData(d || {
                    total_orders: 0,
                    total_sales: 0,
                    total_tax: 0,
                    cancelled_orders: 0,
                    pending_orders: 0,
                    fulfilled_orders: 0
                });
            }
        } catch (e) {
            console.error("Error loading Z-report:", e);
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

    const handlePrintReport = (size) => {
        let printHtml = '';
        if (size === 'A4') {
            printHtml = `
                <html>
                <head>
                    <title>Z-Report (Settlement)</title>
                    <style>
                        body { font-family: sans-serif; padding: 30px; color: #333; }
                        h1 { font-size: 22px; text-align: center; margin-bottom: 5px; }
                        h2 { font-size: 14px; text-align: center; color: #666; margin-top: 0; margin-bottom: 30px; }
                        .summary-grid { display: grid; grid-template-cols: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
                        .summary-card { border: 1px solid #ccc; padding: 20px; border-radius: 5px; text-align: center; }
                        .summary-card p { margin: 0; font-size: 10px; text-transform: uppercase; color: #666; font-weight: bold; }
                        .summary-card h3 { margin: 5px 0 0 0; font-size: 20px; color: #111; }
                        .details-grid { display: grid; grid-template-cols: repeat(3, 1fr); gap: 20px; margin-top: 20px; }
                        .details-card { background: #f9f9f9; border: 1px solid #eee; padding: 20px; border-radius: 5px; text-align: center; }
                        .details-card span { font-size: 10px; font-weight: bold; color: #666; text-transform: uppercase; }
                        .details-card h4 { margin: 5px 0 0 0; font-size: 24px; }
                        .text-emerald { color: #2e7d32; }
                        .text-amber { color: #f57c00; }
                        .text-rose { color: #d32f2f; }
                    </style>
                </head>
                <body>
                    <h1>Z-Report (Settlement Summary)</h1>
                    <h2>Outlet: ${outlets.find(o => String(o.id) === String(filters.outlet_id))?.name || 'N/A'} | Range: ${filters.from_date} to ${filters.to_date}</h2>
                    
                    <div class="summary-grid">
                        <div class="summary-card">
                            <p>Settled Sales</p>
                            <h3>₹${parseFloat(data.total_sales || 0).toFixed(2)}</h3>
                        </div>
                        <div class="summary-card">
                            <p>Tax Provision</p>
                            <h3>₹${parseFloat(data.total_tax || 0).toFixed(2)}</h3>
                        </div>
                        <div class="summary-card">
                            <p>Total Orders</p>
                            <h3>${data.total_orders || 0}</h3>
                        </div>
                    </div>
                    
                    <div class="details-grid">
                        <div class="details-card">
                            <span>Fulfilled Orders</span>
                            <h4 class="text-emerald">${data.fulfilled_orders || 0}</h4>
                        </div>
                        <div class="details-card">
                            <span>Pending Orders</span>
                            <h4 class="text-amber">${data.pending_orders || 0}</h4>
                        </div>
                        <div class="details-card">
                            <span>Cancelled Orders</span>
                            <h4 class="text-rose">${data.cancelled_orders || 0}</h4>
                        </div>
                    </div>
                    <script>window.onload = () => { window.print(); window.close(); }</script>
                </body>
                </html>
            `;
        } else {
            printHtml = `
                <html>
                <head>
                    <title>Z-Report Summary</title>
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
                    <div class="center bold">Z-REPORT (SETTLEMENT)</div>
                    <div class="center bold">${(outlets.find(o => String(o.id) === String(filters.outlet_id))?.name || 'OUTLET').toUpperCase()}</div>
                    <div class="dashed-line"></div>
                    <div>FROM: ${filters.from_date}</div>
                    <div>TO:   ${filters.to_date}</div>
                    <div class="dashed-line"></div>
                    
                    <div class="flex-row"><span>SETTLED SALES:</span><span class="bold">₹${parseFloat(data.total_sales || 0).toFixed(2)}</span></div>
                    <div class="flex-row"><span>TAX PROVISION:</span><span>₹${parseFloat(data.total_tax || 0).toFixed(2)}</span></div>
                    <div class="flex-row"><span>TOTAL ORDERS:</span><span>${data.total_orders || 0}</span></div>
                    
                    <div class="dashed-line"></div>
                    <div class="flex-row"><span>FULFILLED:</span><span class="bold">${data.fulfilled_orders || 0}</span></div>
                    <div class="flex-row"><span>PENDING:</span><span>${data.pending_orders || 0}</span></div>
                    <div class="flex-row"><span>CANCELLED:</span><span>${data.cancelled_orders || 0}</span></div>
                    
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
                    <div className="p-2 bg-rose-50 rounded-lg">
                        <Zap className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Real-Time Settlement (Z-Report)</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">End-of-day operational closure & reconciliation</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchData}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Report
                    </button>
                </div>
            </div>

            {/* Tactical Settlement Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-1.5 hidden">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>
                            <select 
                                value={filters.outlet_id}
                                onChange={e => setFilters(prev => ({ ...prev, outlet_id: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-rose-500 transition-all cursor-pointer"
                            >
                                {outlets.map(o => (
                                    <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Start</label>
                            <input 
                                type="date" 
                                value={filters.from_date}
                                onChange={e => setFilters(prev => ({ ...prev, from_date: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-rose-500 transition-all" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal End</label>
                            <input 
                                type="date" 
                                value={filters.to_date}
                                onChange={e => setFilters(prev => ({ ...prev, to_date: e.target.value }))}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-rose-500 transition-all" 
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500/50" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Z-Audit Mode Active</span>
                    </div>
                </div>
                <Cpu className="absolute -right-12 -bottom-12 w-48 h-48 text-rose-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Daily Telemetry Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Settled Sales', val: `₹${parseFloat(data.total_sales || 0).toFixed(2)}`, icon: IndianRupee, color: 'emerald' },
                    { label: 'Tax Provision', val: `₹${parseFloat(data.total_tax || 0).toFixed(2)}`, icon: ShieldCheck, color: 'rose' },
                    { label: 'Total Orders', val: (data.total_orders || 0).toString(), icon: ListChecks, color: 'indigo' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex items-center justify-between hover:border-indigo-200 transition-all group cursor-pointer animate-in zoom-in duration-300">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-[20px] font-bold text-slate-800 uppercase tracking-tight">{stat.val}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Settlement Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm min-h-[350px] overflow-hidden flex flex-col p-8">
                <div className="border-b border-slate-100 pb-4 mb-6">
                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <History className="w-4 h-4 text-rose-500" /> Settlement Reconciliation Manifest
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fulfilled Orders</span>
                        <span className="text-[32px] font-bold text-emerald-600">{data.fulfilled_orders || 0}</span>
                        <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">Successfully Settled</p>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pending Orders</span>
                        <span className="text-[32px] font-bold text-amber-500">{data.pending_orders || 0}</span>
                        <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">Requires Action</p>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cancelled Orders</span>
                        <span className="text-[32px] font-bold text-rose-500">{data.cancelled_orders || 0}</span>
                        <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">Audit Leakage Logged</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
                    <button 
                        onClick={() => handlePrintReport('thermal')}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print Thermal (3-inch)
                    </button>
                    <button 
                        onClick={() => handlePrintReport('A4')}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print A4 Paper
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TodaysReport;
