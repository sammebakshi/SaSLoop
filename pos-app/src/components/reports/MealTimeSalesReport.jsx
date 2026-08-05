import React, { useState, useEffect } from "react";
import { 
  Coffee, Utensils, Pizza, Moon, Clock, Search, Filter, 
  Download, BarChart3, TrendingUp, IndianRupee, Tag,
  CheckCircle2, RefreshCw, ChevronDown, Monitor, Truck, 
  Smartphone, Globe, Database, ListTree, Settings2, ShieldCheck, Zap, X, Printer
} from "lucide-react";
import { API_BASE } from "../../services/api";

const MealTimeSalesReport = () => {
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

            const slots = {
                'Breakfast': { total_orders: 0, total_revenue: 0 },
                'Lunch': { total_orders: 0, total_revenue: 0 },
                'Snacks': { total_orders: 0, total_revenue: 0 },
                'Dinner': { total_orders: 0, total_revenue: 0 },
                'Late Night': { total_orders: 0, total_revenue: 0 }
            };

            if (Array.isArray(localOrders)) {
                localOrders.forEach(order => {
                    if (order.status === 'CANCELLED' || order.status === 'DELETED' || order.status === 'REFUNDED') return;
                    const d = order.created_at ? new Date(order.created_at) : new Date();
                    const orderTime = d.getTime();
                    if (orderTime >= fromTime && orderTime <= toTime) {
                        const hr = d.getHours();
                        let slotName = 'Late Night';
                        if (hr >= 6 && hr <= 10) slotName = 'Breakfast';
                        else if (hr >= 11 && hr <= 15) slotName = 'Lunch';
                        else if (hr >= 16 && hr <= 18) slotName = 'Snacks';
                        else if (hr >= 19 && hr <= 23) slotName = 'Dinner';

                        const amount = parseFloat(order.total_price || 0);
                        slots[slotName].total_orders += 1;
                        slots[slotName].total_revenue += amount;
                    }
                });
            }

            const list = Object.entries(slots)
                .filter(([_, v]) => v.total_orders > 0)
                .map(([meal_slot_name, v]) => ({
                    meal_slot_name,
                    total_orders: v.total_orders,
                    total_revenue: v.total_revenue,
                    avg_order_value: v.total_orders > 0 ? (v.total_revenue / v.total_orders) : 0
                }));

            setData(list);
        } catch (e) {
            console.error("Error calculating local meal-time sales report:", e);
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
        const totalOrders = data.reduce((acc, curr) => acc + parseInt(curr.total_orders || 0), 0);
        const totalRevenue = data.reduce((acc, curr) => acc + parseFloat(curr.total_revenue || 0), 0);

        const slotRows = data.map(s => `
            <div class="flex-between">
                <span class="bold">${(s.meal_slot_name || 'SLOT').toUpperCase()}</span>
                <span>${s.total_orders} orders</span>
                <span class="bold">₹${parseFloat(s.total_revenue || 0).toFixed(2)}</span>
            </div>
        `).join('');

        const printHtml = `
            <html>
            <head>
                <title>Meal-Slot Sales Report</title>
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
                <div class="center bold" style="font-size: 14px;">MEAL-SLOT SALES REPORT</div>
                <div class="center bold" style="font-size: 12px; margin-top: 2px;">${outletName.toUpperCase()}</div>
                <div class="dashed-line"></div>
                <div>FROM: ${filters.from_date}</div>
                <div>TO:   ${filters.to_date}</div>
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>SLOT</span>
                    <span>ORDERS</span>
                    <span>REVENUE</span>
                </div>
                <div class="dashed-line"></div>
                ${slotRows}
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>TOTAL ORDERS:</span>
                    <span>${totalOrders}</span>
                </div>
                <div class="flex-between bold">
                    <span>TOTAL REVENUE:</span>
                    <span>₹${totalRevenue.toFixed(2)}</span>
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
        <div className="space-y-6">
            {/* Header Control */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase">Meal-Slot Intelligence</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Temporal Revenue Attribution</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-1">
                      <div className="flex flex-col px-2 hidden">
                         <span className="text-[8px] font-bold text-slate-400 uppercase">Operating Hub</span>
                         <select className="bg-transparent text-[10px] font-bold text-slate-700 outline-none uppercase" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                         </select>
                      </div>
                      <div className="w-px h-6 bg-slate-200 mx-1 hidden" />
                      <div className="flex flex-col px-2">
                         <span className="text-[8px] font-bold text-slate-400 uppercase">From</span>
                         <input type="date" className="bg-transparent text-[10px] font-bold text-slate-700 outline-none" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
                      </div>
                      <div className="w-px h-6 bg-slate-200 mx-1" />
                      <div className="flex flex-col px-2">
                         <span className="text-[8px] font-bold text-slate-400 uppercase">To</span>
                         <input type="date" className="bg-transparent text-[10px] font-bold text-slate-700 outline-none" value={filters.to_date} onChange={e => setFilters({...filters, to_date: e.target.value})} />
                      </div>
                   </div>
                   <button 
                       onClick={handlePrintThermalReport}
                       disabled={data.length === 0}
                       className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                   >
                       <Printer className="w-3.5 h-3.5" /> Print Thermal
                   </button>
                   <button onClick={fetchData} className="h-9 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm">Sync Matrix</button>
                </div>
            </div>

            {/* Performance Rail */}
            <div className="grid grid-cols-4 gap-4">
               {[
                  { label: 'Total Matrix Yield', val: `₹${data.reduce((acc, r) => acc + parseFloat(r.total_revenue || 0), 0).toLocaleString()}`, icon: IndianRupee, color: 'emerald' },
                  { label: 'Peak Slot Flow', val: data.length > 0 ? data.sort((a,b) => b.total_orders - a.total_orders)[0].meal_slot_name : 'N/A', icon: Zap, color: 'amber' },
                  { label: 'Average Ticket', val: `₹${data.length ? (data.reduce((acc, r) => acc + parseFloat(r.avg_order_value || 0), 0) / data.length).toFixed(0) : 0}`, icon: TrendingUp, color: 'indigo' },
                  { label: 'System Health', val: 'Optimal', icon: ShieldCheck, color: 'blue' }
               ].map(card => (
                  <div key={card.label} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm group">
                     <div className="flex items-center gap-2 mb-2">
                        <card.icon className={`w-3.5 h-3.5 text-${card.color}-500`} />
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{card.label}</span>
                     </div>
                     <h3 className="text-[20px] font-bold text-slate-800 tracking-tighter uppercase">{card.val}</h3>
                  </div>
               ))}
            </div>

            {/* Main Data Matrix */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-amber-500" /> Meal Time-Based Sales Manifest
                    </h3>
                    <div className="flex items-center gap-2">
                       <button className="h-8 px-4 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase hover:bg-slate-50 transition-all flex items-center gap-2">
                          <Download className="w-3 h-3" /> Export CSV
                       </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Slot Identity</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Temporal Window</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Revenue Yield</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Volume</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg Ticket</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-20 text-center font-bold uppercase text-[10px] tracking-widest text-slate-400 animate-pulse">Synchronizing Temporal Data...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="6" className="py-20 text-center font-bold uppercase text-[10px] tracking-widest text-slate-300">No Temporal Artifacts Found</td></tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 rounded text-amber-600">
                                                {row.meal_slot_name === 'Breakfast' && <Coffee className="w-4 h-4" />}
                                                {row.meal_slot_name === 'Lunch' && <Utensils className="w-4 h-4" />}
                                                {row.meal_slot_name === 'Dinner' && <Pizza className="w-4 h-4" />}
                                                {!['Breakfast', 'Lunch', 'Dinner'].includes(row.meal_slot_name) && <Moon className="w-4 h-4" />}
                                            </div>
                                            <span className="font-bold text-slate-800 uppercase text-[12px]">{row.meal_slot_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded">
                                            {row.meal_slot_name === 'Breakfast' ? '06:00 - 10:59' : 
                                             row.meal_slot_name === 'Lunch' ? '11:00 - 15:59' :
                                             row.meal_slot_name === 'Dinner' ? '19:00 - 23:59' : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-bold text-slate-800">₹{parseFloat(row.total_revenue).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-bold uppercase tracking-wider">{row.total_orders} Orders</span>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-emerald-600">₹{parseFloat(row.avg_order_value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Analyser</span>
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

export default MealTimeSalesReport;
