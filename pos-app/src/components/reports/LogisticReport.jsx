import React, { useState, useEffect } from "react";
import { 
  Truck, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, Package, Bike, MapPin, Clock, ArrowRight,
  ChevronRight, ChevronUp, Printer
} from "lucide-react";
import { API_BASE } from "../../services/api";

const LogisticReport = () => {
    const [data, setData] = useState({ dunzo: [], shadowfax: [], porter: [], zomato_xtreme: [] });
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);
    const [activeSection, setActiveSection] = useState("dunzo");

    const [filters, setFilters] = useState({
        outlet_id: ""
    });

    const fetchData = async () => {
        if (!filters.outlet_id) return;
        setLoading(true);
        try {
            const q = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE}/api/brand/analytics/logistic-report?${q}`, {
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
        const totalTasks = (data.dunzo?.length || 0) + (data.shadowfax?.length || 0) + (data.porter?.length || 0) + (data.zomato_xtreme?.length || 0);
        if (totalTasks === 0) return;

        const outletName = outlets.find(o => String(o.id) === String(filters.outlet_id))?.name || 'OUTLET';

        const printHtml = `
            <html>
            <head>
                <title>Logistics Multi-Provider Report</title>
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
                <div class="center bold" style="font-size: 14px;">LOGISTICS REPORT</div>
                <div class="center bold" style="font-size: 12px; margin-top: 2px;">${outletName.toUpperCase()}</div>
                <div class="dashed-line"></div>
                
                <div class="flex-between">
                    <span>DUNZO TASKS:</span>
                    <span class="bold">${data.dunzo?.length || 0}</span>
                </div>
                <div class="flex-between">
                    <span>SHADOWFAX TASKS:</span>
                    <span class="bold">${data.shadowfax?.length || 0}</span>
                </div>
                <div class="flex-between">
                    <span>PORTER TASKS:</span>
                    <span class="bold">${data.porter?.length || 0}</span>
                </div>
                <div class="flex-between">
                    <span>ZOMATO XTREME:</span>
                    <span class="bold">${data.zomato_xtreme?.length || 0}</span>
                </div>
                
                <div class="dashed-line"></div>
                <div class="flex-between bold">
                    <span>TOTAL TASKS:</span>
                    <span>${totalTasks}</span>
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

    const ProviderSection = ({ title, id, items, icon: Icon }) => (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden group mb-4">
            <button 
                onClick={() => setActiveSection(activeSection === id ? "" : id)}
                className={`w-full px-6 py-5 flex items-center justify-between transition-all ${activeSection === id ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-md transition-colors ${activeSection === id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[14px] font-bold uppercase tracking-tight">{title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeSection === id ? 'bg-white/10' : 'bg-slate-100 text-slate-500'}`}>{items.length} Artifacts</span>
                    {activeSection === id ? <ChevronUp className="w-4 h-4 opacity-40" /> : <ChevronRight className="w-4 h-4 opacity-40" />}
                </div>
            </button>
            
            {activeSection === id && (
                <div className="p-0 border-t border-slate-200 animate-in slide-in-from-top-2 duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <th className="px-6 py-4">Reference ID</th>
                                    <th className="px-6 py-4">Task Matrix</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Created Temporal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-20">
                                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                    <Package className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zero Logistic Artifacts</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : items.map((row, idx) => (
                                    <tr key={idx} className="group/row hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5 font-bold text-slate-800 uppercase tracking-tight text-[12px]">{row.reference}</td>
                                        <td className="px-6 py-5 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{row.task_id}</td>
                                        <td className="px-6 py-5">
                                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">{row.status}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(row.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Truck className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Logistic Intelligence</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Multi-provider orchestration & task ID monitoring</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handlePrintThermalReport}
                        disabled={((data.dunzo?.length || 0) + (data.shadowfax?.length || 0) + (data.porter?.length || 0) + (data.zomato_xtreme?.length || 0)) === 0}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/10 disabled:opacity-50"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print Thermal (3-inch)
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Download className="w-3.5 h-3.5" /> Export Logistic Audit
                    </button>
                </div>
            </div>

            {/* Tactical Audit Board */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5 md:col-span-3 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-slate-500 transition-all cursor-pointer" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <button onClick={fetchData} className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Execute Logistic Sync
                    </button>
                </div>
                <Truck className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Provider Orchestration Matrix */}
            <div className="space-y-1">
                <ProviderSection title="Dunzo" id="dunzo" items={data.dunzo || []} icon={Bike} />
                <ProviderSection title="ShadowFAX" id="shadowfax" items={data.shadowfax || []} icon={Zap} />
                <ProviderSection title="Porter" id="porter" items={data.porter || []} icon={Truck} />
                <ProviderSection title="Zomato Xtreme" id="zomato_xtreme" items={data.zomato_xtreme || []} icon={Package} />
            </div>

        </div>
    );
};

export default LogisticReport;
