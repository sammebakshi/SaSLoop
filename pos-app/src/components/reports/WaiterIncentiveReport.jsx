import React, { useState, useEffect } from "react";
import { 
  Users, UserCheck, Search, Filter, Download, 
  TrendingUp, IndianRupee, Tag, CheckCircle2, 
  RefreshCw, ChevronDown, Monitor, Truck, Smartphone, 
  Globe, Database, ListTree, Settings2, ShieldCheck, Zap,
  Star, Trophy, Award, Briefcase, ChevronRight, Printer
} from "lucide-react";
import { API_BASE } from "../../services/api";

const WaiterIncentiveReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);

    const [filters, setFilters] = useState({
        outlet_id: "",
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0]
    });

    const fetchData = () => {
        setLoading(true);
        try {
            const localOrdersRaw = localStorage.getItem('pos_local_orders');
            const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : [];

            const fromTime = filters.from_date ? new Date(filters.from_date + " 00:00:00").getTime() : 0;
            const toTime = filters.to_date ? new Date(filters.to_date + " 23:59:59").getTime() : Infinity;

            const waiterMap = new Map();

            if (Array.isArray(localOrders)) {
                localOrders.forEach(order => {
                    if (order.status === 'CANCELLED' || order.status === 'DELETED' || order.status === 'REFUNDED') return;
                    const orderTime = order.created_at ? new Date(order.created_at).getTime() : Date.now();
                    if (orderTime >= fromTime && orderTime <= toTime) {
                        const waiterName = order.waiter_name || 'Staff/Server';
                        const amount = parseFloat(order.total_price || 0);

                        if (waiterMap.has(waiterName)) {
                            const curr = waiterMap.get(waiterName);
                            curr.total_orders += 1;
                            curr.total_sales += amount;
                            curr.total_incentive += (amount * 0.02);
                        } else {
                            waiterMap.set(waiterName, {
                                waiter_name: waiterName,
                                total_orders: 1,
                                total_sales: amount,
                                total_incentive: amount * 0.02
                            });
                        }
                    }
                });
            }

            const list = Array.from(waiterMap.values());
            list.sort((a, b) => b.total_sales - a.total_sales);
            setData(list);
        } catch (e) {
            console.error("Error calculating local waiter incentive report:", e);
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
        const totalSales = data.reduce((a, b) => a + parseFloat(b.total_sales || 0), 0);
        const totalIncentive = data.reduce((a, b) => a + parseFloat(b.total_incentive || 0), 0);

        const waiterRows = data.map(w => `
            <div class="flex-between">
                <span class="bold" style="max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${(w.waiter_name || 'SERVER').toUpperCase()}</span>
                <span>${w.total_orders} bills</span>
                <span class="bold">₹${parseFloat(w.total_incentive || 0).toFixed(2)}</span>
            </div>
        `).join('');

        const printHtml = `
            <html>
            <head>
                <title>Waiter Incentive Report</title>
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
                <div class="center bold" style="font-size: 14px;">WAITER INCENTIVE REPORT</div>
                <div class="center bold" style="font-size: 12px; margin-top: 2px;">${outletName.toUpperCase()}</div>
                <div class="dashed-line"></div>
                <div>FROM: ${filters.from_date}</div>
                <div>TO:   ${filters.to_date}</div>
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>WAITER</span>
                    <span>ORDERS</span>
                    <span>INCENTIVE</span>
                </div>
                <div class="dashed-line"></div>
                ${waiterRows}
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>TOTAL SALES:</span>
                    <span>₹${totalSales.toFixed(2)}</span>
                </div>
                <div class="flex-between bold">
                    <span>TOTAL INCENTIVES:</span>
                    <span>₹${totalIncentive.toFixed(2)}</span>
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
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <Trophy className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Staff Motivation Matrix</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Waiter-wise performance & incentive reconciliation</p>
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
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5" /> Configuration
                    </button>
                </div>
            </div>

            {/* Tactical DSR Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Operational Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-emerald-500 transition-all cursor-pointer" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Start</label>
                        <input type="date" className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-emerald-500 transition-all" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal End</label>
                        <input type="date" className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-emerald-500 transition-all" value={filters.to_date} onChange={e => setFilters({...filters, to_date: e.target.value})} />
                    </div>
                    <button onClick={fetchData} className="h-9 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Performance
                    </button>
                </div>
                <Trophy className="absolute -right-12 -bottom-12 w-48 h-48 text-emerald-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Performance Matrix Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Waiter Performance Manifest
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sr. No.</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Waiter Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Orders</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sales Realization</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Incentive</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Performance Index</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Staff Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Award className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Performance Matrix Clean</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Provisioned</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-6 text-[11px] font-bold text-slate-400 italic">#{idx + 1}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs group-hover:bg-emerald-600 transition-colors shadow-sm">
                                                {row.waiter_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800 uppercase tracking-tight text-[13px]">{row.waiter_name}</span>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Staff ID_{row.waiter_id || idx + 101}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 rounded-md uppercase">{row.total_orders} Bills</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-[14px] font-bold text-slate-800 tracking-tight">₹{parseFloat(row.total_sales).toLocaleString('en-IN')}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[16px] font-bold text-emerald-600 tracking-tight">₹{parseFloat(row.total_incentive).toLocaleString('en-IN')}</span>
                                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-100 self-start">2.0% Payout</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`w-2.5 h-2.5 ${s <= 3 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">A-Class Tier</span>
                                        </div>
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

export default WaiterIncentiveReport;
