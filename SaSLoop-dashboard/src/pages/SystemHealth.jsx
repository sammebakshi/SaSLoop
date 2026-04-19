import { useEffect, useState } from "react";
import API_BASE from "../config";
import { 
  Activity, Database, AlertTriangle, ShieldCheck, Server, RefreshCw, 
  Users, ShoppingBag, Package, MessageSquare, LifeBuoy, Hash, Cpu, HardDrive
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
    <div className="flex flex-col h-full bg-[#f8fafc] p-6 space-y-8 overflow-y-auto custom-scrollbar">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Activity className="w-8 h-8 text-rose-500" /> Infrastructure Health
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Real-time telemetry and platform maintenance controls.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm text-[10px] font-black uppercase text-slate-400">
              <RefreshCw className="w-3 h-3" /> Auto-sync every 10s
           </div>
        </div>
      </div>

      {/* CORE TELEMETRY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
               <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-6 h-6" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{s.label}</p>
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{s.val}</h3>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
         
         {/* DB & SERVER STATUS */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="text-lg font-black text-slate-800 tracking-tight mb-8">Service Engine</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">Database Engine</span>
                     </div>
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">{data?.dbStatus}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">Server Uptime</span>
                     </div>
                     <span className="text-xs font-black text-slate-800">{Math.floor(data?.serverUptime / 60)} Minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <HardDrive className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">Audit Density</span>
                     </div>
                     <span className="text-xs font-black text-slate-800">{data?.stats.total_logs} Events</span>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-sm text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
               <h3 className="text-lg font-black tracking-tight mb-2 relative z-10">Maintenance Zone</h3>
               <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-8 relative z-10">Disaster Recovery Actions</p>
               
               <button 
                  disabled={flushing}
                  onClick={flushSessions}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40 relative z-10 active:scale-95"
               >
                  {flushing ? 'Purging Sessions...' : 'Flush AI Sessions'}
               </button>
               <p className="mt-4 text-[9px] text-white/30 font-medium leading-relaxed italic">Use this if bots are looping or session context is corrupted across the platform.</p>
            </div>
         </div>

         {/* LOGS / ERROR STREAM */}
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[3.5rem] p-10 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Anomalies</h3>
                  <p className="text-slate-400 font-medium text-xs mt-1 uppercase tracking-widest">Global platform errors and warnings</p>
               </div>
               <button onClick={() => window.location.href='/audit-logs'} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Full Audit</button>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
               {data?.recentErrors.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20">
                     <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
                     <p className="font-black uppercase tracking-widest text-slate-800">No Errors Detected</p>
                  </div>
               ) : (
                  data?.recentErrors.map(err => (
                     <div key={err.id} className="p-5 bg-rose-50/50 border border-rose-100 rounded-2xl flex gap-4 items-start group hover:bg-rose-50 transition-all">
                        <div className="p-2 bg-rose-500 text-white rounded-lg group-hover:scale-110 transition-transform">
                           <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest">{err.action}</span>
                              <span className="text-[9px] font-bold text-slate-400">{new Date(err.created_at).toLocaleTimeString()}</span>
                           </div>
                           <pre className="text-[10px] font-mono text-slate-600 overflow-x-auto whitespace-pre-wrap leading-relaxed">
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
