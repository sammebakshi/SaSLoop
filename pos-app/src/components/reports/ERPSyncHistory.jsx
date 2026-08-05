import React, { useState, useEffect } from "react";
import { 
  Database, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, ListTree, Settings2, 
  ShieldCheck, ArrowRight, Activity, CloudSync, Clock, Link2,
  Terminal, Share2, ChevronRight, Printer
} from "lucide-react";
import { API_BASE } from "../../services/api";

const ERPSyncHistory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);

    const [filters, setFilters] = useState({
        outlet_id: ""
    });

    const fetchData = async () => {
        if (!filters.outlet_id) return;
        setLoading(true);
        try {
            const q = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE}/api/brand/analytics/erp-sync-history?${q}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            setData(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const loadOutlets = async () => {
            const res = await fetch(`${API_BASE}/api/brand/outlets`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            const d = await res.json();
            setOutlets(d);
            if (d.length > 0) setFilters(prev => ({ ...prev, outlet_id: d[0].id }));
        };
        loadOutlets();
    }, []);

    useEffect(() => { fetchData(); }, [filters.outlet_id]);

    const handlePrintThermalReport = () => {
        if (data.length === 0) return;
        const outletName = outlets.find(o => String(o.id) === String(filters.outlet_id))?.name || 'OUTLET';

        const erpRows = data.map(e => `
            <div class="flex-between">
                <span class="bold">ORD#${e.order_id}</span>
                <span class="bold">${(e.status || 'SYNCED').toUpperCase()}</span>
            </div>
        `).join('');

        const printHtml = `
            <html>
            <head>
                <title>ERP Sync Report</title>
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
                <div class="center bold" style="font-size: 14px;">ERP SYNC HISTORY</div>
                <div class="center bold" style="font-size: 12px; margin-top: 2px;">${outletName.toUpperCase()}</div>
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>ORDER ID</span>
                    <span>STATUS</span>
                </div>
                <div class="dashed-line"></div>
                ${erpRows}
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>TOTAL SYNC EVENTS:</span>
                    <span>${data.length}</span>
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
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <CloudSync className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">ERP Synchronization</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hostbook status monitoring & event-driven sync history</p>
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
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2 shadow-md shadow-blue-600/10">
                        <Download className="w-3.5 h-3.5" /> Export ERP Audit
                    </button>
                </div>
            </div>

            {/* Tactical Audit Board */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5 md:col-span-3 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-blue-500 transition-all cursor-pointer" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <button onClick={fetchData} className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Execute ERP Sync Audit
                    </button>
                </div>
                <Database className="absolute -right-12 -bottom-12 w-48 h-48 text-blue-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Sync History Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> ERP Sync History Manifest
                    </h3>
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-300" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Event Stream Stable</span>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">#</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operating Hub</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Context</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Sync Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Update Temporal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning ERP Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Database className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">ERP Sync Matrix Clean</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Provisioned</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-6 text-center text-[11px] font-bold text-slate-400 italic">#{idx + 1}</td>
                                    <td className="px-6 py-6">
                                        <span className="font-bold text-slate-800 uppercase tracking-tight text-[12px]">{row.outlet_name}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[13px] font-bold text-slate-800 tracking-tight">ORD#{row.order_id}</span>
                                            <div className="flex items-center gap-1.5 mt-1 opacity-60">
                                                <Share2 className="w-2.5 h-2.5 text-blue-500" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">{row.events} Events</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-bold uppercase tracking-widest">{row.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[11px] font-bold text-slate-700 uppercase">{new Date(row.updated_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sync Finalized</span>
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

export default ERPSyncHistory;
