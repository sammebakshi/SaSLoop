import { useEffect, useState } from "react";
import API_BASE from "../config";
import { 
  Activity, Database, AlertTriangle, ShieldCheck, RefreshCw, 
  Users, ShoppingBag, Package, MessageSquare, Cpu, HardDrive, Clock
} from "lucide-react";

function SystemHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flushing, setFlushing] = useState(false);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/master/system-health`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const flushSessions = async () => {
     if (!window.confirm("CRITICAL ACTION: This will erase all active WhatsApp chat states. Users might need to restart their conversation. Continue?")) return;
     setFlushing(true);
     try {
        const res = await fetch(`${API_BASE}/api/master/system/flush-sessions`, {
           method: 'POST',
           headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
           alert("Platform sessions purged successfully.");
           fetchHealth();
        }
     } catch (err) { console.error(err); }
     finally { setFlushing(false); }
  };

  if (loading) return (
     <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <Activity className="w-10 h-10 text-indigo-500 animate-spin" />
     </div>
  );

  const stats = [
    { label: 'Active Sessions', val: data?.stats.active_sessions, icon: MessageSquare, color: 'emerald' },
    { label: 'Total Users', val: data?.stats.total_users, icon: Users, color: 'blue' },
    { label: 'Order Volume', val: data?.stats.total_orders, icon: ShoppingBag, color: 'indigo' },
    { label: 'Catalogue Items', val: data?.stats.total_items, icon: Package, color: 'amber' },
  ];

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-[#14161b] p-6 space-y-8 overflow-y-auto custom-scrollbar transition-colors duration-500">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h2 className="text-[28px] font-black text-slate-800 dark:text-white tracking-tighter flex items-center gap-4 uppercase underline decoration-rose-500 decoration-4 underline-offset-8">
                        <Activity className="w-8 h-8 text-rose-500 animate-pulse" /> Infrastructure Health
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[11px] mt-4 uppercase tracking-[0.2em]">Real-time telemetry & global platform maintenance rails</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Auto-sync every 10s
                    </div>
                </div>
            </div>

            {/* CORE TELEMETRY */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className={`w-10 h-10 bg-${s.color}-50 dark:bg-${s.color}-500/10 text-${s.color}-500 dark:text-${s.color}-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10`}>
                            <s.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-2 relative z-10">{s.label}</p>
                        <h3 className="text-[28px] font-black text-slate-800 dark:text-white tracking-tighter relative z-10">{s.val}</h3>
                        <div className={`absolute -right-4 -bottom-4 w-16 h-16 bg-${s.color}-500/5 rounded-full blur-2xl group-hover:bg-${s.color}-500/10 transition-all`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
                
                {/* DB & SERVER STATUS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-[12px] font-black text-slate-800 dark:text-white tracking-widest uppercase mb-8 flex items-center gap-2">
                           <Cpu className="w-4 h-4 text-indigo-500" /> Service Engine
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Database Engine', val: data?.dbStatus, icon: Database, status: true },
                                { label: 'Server Uptime', val: `${Math.floor(data?.serverUptime / 60)}m`, icon: Clock },
                                { label: 'Platform Restarts', val: data?.restart_count, icon: AlertTriangle, warning: true },
                                { label: 'Memory (RSS)', val: `${data?.memory_usage?.rss} MB`, icon: Activity },
                                { label: 'Audit Density', val: data?.stats.total_logs, icon: HardDrive }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center group/row">
                                    <div className="flex items-center gap-3">
                                        <row.icon className="w-4 h-4 text-slate-400 group-hover/row:text-indigo-500 transition-colors" />
                                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">{row.label}</span>
                                    </div>
                                    <span className={`text-[11px] font-black tracking-tight ${row.status ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded' : row.warning ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded' : 'text-slate-800 dark:text-white'}`}>
                                        {row.val}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 dark:bg-indigo-950 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <h3 className="text-[12px] font-black tracking-widest mb-2 relative z-10 uppercase">Maintenance Zone</h3>
                        <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest mb-8 relative z-10">Critical Cluster Actions</p>
                        
                        <button 
                            disabled={flushing}
                            onClick={flushSessions}
                            className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-950/40 relative z-10 active:scale-95"
                        >
                            {flushing ? 'Purging Matrix...' : 'Flush AI Sessions'}
                        </button>
                        <p className="mt-4 text-[9px] text-white/30 dark:text-white/20 font-medium leading-relaxed italic">Erases active WhatsApp chat states to resolve pattern loops.</p>
                    </div>
                </div>

                {/* LOGS / ERROR STREAM */}
                <div className="lg:col-span-8 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm flex flex-col h-[600px]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-[14px] font-black text-slate-800 dark:text-white tracking-widest uppercase">Anomaly Registry</h3>
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-[9px] mt-1 uppercase tracking-widest">Global platform exception stream</p>
                        </div>
                        <button onClick={() => window.location.href='/audit-logs'} className="px-6 py-2 bg-slate-900 dark:bg-white/5 text-white dark:text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-white/10 transition-all border border-white/5">Full Audit Rails</button>
                    </div>
                    
                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-4">
                        {data?.recentErrors.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-10">
                                <ShieldCheck className="w-16 h-16 text-emerald-500 mb-6" />
                                <p className="font-black uppercase tracking-[0.4em] text-slate-800 dark:text-white">Cluster Clear</p>
                            </div>
                        ) : (
                            data?.recentErrors.map(err => (
                                <div key={err.id} className="p-5 bg-rose-50/30 dark:bg-rose-500/5 border border-rose-100/50 dark:border-rose-500/10 rounded-xl flex gap-5 items-start group hover:bg-rose-50 dark:hover:bg-rose-500/[0.08] transition-all">
                                    <div className="p-2 bg-rose-500 text-white rounded-lg group-hover:scale-110 transition-transform shadow-md shadow-rose-500/20">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">{err.action}</span>
                                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">{new Date(err.created_at).toLocaleTimeString()}</span>
                                        </div>
                                        <pre className="text-[10px] font-mono text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed bg-white/40 dark:bg-black/20 p-3 rounded-lg border border-white/20 dark:border-white/5">
                                            {JSON.stringify(err.details)}
                                        </pre>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

        </div>
    );

}

export default SystemHealth;
