import React, { useState, useEffect } from "react";
import { 
  Layers, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, ArrowUpRight, ShoppingBag, Utensils, ChevronRight, Printer
} from "lucide-react";
import { API_BASE } from "../../services/api";

const OrderTypeReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);

    const [filters, setFilters] = useState({
        outlet_id: "",
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
        with_time: false
    });

    const fetchData = () => {
        setLoading(true);
        try {
            const localOrdersRaw = localStorage.getItem('pos_local_orders');
            const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : [];

            const fromTime = filters.from_date ? new Date(filters.from_date + " 00:00:00").getTime() : 0;
            const toTime = filters.to_date ? new Date(filters.to_date + " 23:59:59").getTime() : Infinity;

            const typeMap = new Map();

            if (Array.isArray(localOrders)) {
                localOrders.forEach(order => {
                    if (order.status === 'CANCELLED' || order.status === 'DELETED' || order.status === 'REFUNDED') return;
                    const orderTime = order.created_at ? new Date(order.created_at).getTime() : Date.now();
                    if (orderTime >= fromTime && orderTime <= toTime) {
                        const orderFrom = (order.order_type || 'QUICK').toUpperCase();
                        const amount = parseFloat(order.total_price || 0);

                        if (typeMap.has(orderFrom)) {
                            const curr = typeMap.get(orderFrom);
                            curr.count += 1;
                            curr.amount += amount;
                        } else {
                            typeMap.set(orderFrom, {
                                order_from: orderFrom,
                                amount: amount,
                                count: 1,
                                status: 'COMPLETED'
                            });
                        }
                    }
                });
            }

            const list = Array.from(typeMap.values());
            list.sort((a, b) => b.amount - a.amount);
            setData(list);
        } catch (e) {
            console.error("Error calculating local order type report:", e);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters.from_date, filters.to_date]);

    const handlePrintThermalReport = () => {
        if (data.length === 0) return;
        const outletName = outlets.find(o => String(o.id) === String(filters.outlet_id))?.name || 'OUTLET';
        const totalManifests = data.reduce((a, b) => a + parseInt(b.count || 0), 0);
        const totalAmount = data.reduce((a, b) => a + parseFloat(b.amount || 0), 0);

        const channelRows = data.map(c => `
            <div class="flex-between">
                <span class="bold">${(c.order_from || 'OTHER').toUpperCase()}</span>
                <span>${c.count} bills</span>
                <span class="bold">₹${parseFloat(c.amount || 0).toFixed(2)}</span>
            </div>
        `).join('');

        const printHtml = `
            <html>
            <head>
                <title>Order Type Sales Report</title>
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
                    .flex-between { display: flex; justify-content: space-between; margin-bottom: 3px; }
                    @media print {
                        body { margin: 0; padding: 4px; width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="center bold" style="font-size: 14px;">ORDER TYPE REPORT</div>
                <div class="center bold" style="font-size: 12px; margin-top: 2px;">${outletName.toUpperCase()}</div>
                <div class="dashed-line"></div>
                <div>FROM: ${filters.from_date}</div>
                <div>TO:   ${filters.to_date}</div>
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>CHANNEL</span>
                    <span>BILLS</span>
                    <span>REVENUE</span>
                </div>
                <div class="dashed-line"></div>
                ${channelRows}
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>TOTAL BILLS:</span>
                    <span>${totalManifests}</span>
                </div>
                <div class="flex-between bold">
                    <span>TOTAL REVENUE:</span>
                    <span>₹${totalAmount.toFixed(2)}</span>
                </div>
                
                <div class="dashed-line"></div>
                <div class="center" style="font-size: 9px;">PRINTED AT: ${new Date().toLocaleString()}</div>
                <script>window.onload = () => { window.print(); window.close(); }</script>
            </body>
            </html>
        `;

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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Layers className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Channel Attribution</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenue slicing by Dine-in, Delivery & Aggregators</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handlePrintThermalReport}
                        disabled={data.length === 0}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/10 disabled:opacity-50"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print Thermal (3-inch)
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Download className="w-3.5 h-3.5" /> Export Audit
                    </button>
                </div>
            </div>

            {/* Tactical Audit Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Operating Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Audit Window</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
                            <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" value={filters.to_date} onChange={e => setFilters({...filters, to_date: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between h-9 px-3 bg-slate-50 border border-slate-200 rounded-md group-hover:border-indigo-200 transition-all cursor-pointer" onClick={() => setFilters({...filters, with_time: !filters.with_time})}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precision Audit</span>
                        <div className={`w-8 h-4 rounded-full relative transition-all shadow-inner ${filters.with_time ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${filters.with_time ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                    </div>
                    <button onClick={fetchData} className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Execute Audit
                    </button>
                </div>
                <Layers className="absolute -right-12 -bottom-12 w-48 h-48 text-indigo-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Performance Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Order Type Performance Manifest
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sr. No.</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel Protocol</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Revenue Realized</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bill Count</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Settlement Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Channel Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Layers className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Zero Channel Artifacts</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">No recorded channel data found</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-6 text-[11px] font-bold text-slate-400 italic">#{idx + 1}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                {row.order_from === 'DINE_IN' ? <Utensils className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                            </div>
                                            <span className="font-bold text-slate-800 uppercase tracking-tight text-[13px]">{row.order_from}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-[18px] font-bold text-slate-800 tracking-tight">₹{parseFloat(row.amount).toLocaleString('en-IN')}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-[10px] font-bold uppercase">{row.count} Manifests</span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderTypeReport;
