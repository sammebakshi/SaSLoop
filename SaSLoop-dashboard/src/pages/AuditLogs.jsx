import { useEffect, useState } from "react";
import API_BASE from "../config";
import { Shield, Clock, User, Activity, Search, Filter, Database, Hash } from "lucide-react";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/master/audit-logs`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
     log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
     log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
     log.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] p-6 space-y-6 overflow-hidden">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Shield className="w-8 h-8 text-indigo-500" /> Platform Audit Trail
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Non-repudiable ledger of all administrative and security events.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-slate-400">
           Total Events: {logs.length}
        </div>
      </div>

      <div className="flex flex-col bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] flex-1 overflow-hidden relative">
        {/* Search Header */}
        <div className="h-20 px-8 border-b border-slate-200 flex items-center gap-6 bg-slate-50/50">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                 type="text" 
                 placeholder="Search by action, user or email..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-800 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
           </div>
           <button onClick={fetchLogs} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-500 transition-all active:scale-95 shadow-sm">
              <Activity className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
           <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 bg-white z-10">
                 <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b border-slate-100">
                    <th className="px-8 py-5 border-b border-slate-200">Event Signature</th>
                    <th className="px-8 py-5 border-b border-slate-200">Actor Identity</th>
                    <th className="px-8 py-5 border-b border-slate-200">Action Context</th>
                    <th className="px-8 py-5 border-b border-slate-200">Timestamp</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className={`p-2.5 rounded-xl ${log.action === 'LOGIN' ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'} group-hover:scale-110 transition-transform`}>
                                <Hash className="w-4 h-4" />
                             </div>
                             <span className="font-black text-xs text-slate-800 tracking-tight">{log.action}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                             <span className="text-[11px] font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-tighter"><User className="w-3 h-3 text-slate-300" /> {log.username}</span>
                             <span className="text-[10px] font-bold text-slate-400 lowercase">{log.email}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="max-w-xs xl:max-w-md">
                             <pre className="text-[10px] font-mono bg-slate-100/50 p-2.5 rounded-xl border border-slate-200/50 text-slate-600 overflow-x-auto custom-scrollbar">
                                {JSON.stringify(log.details)}
                             </pre>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                             <span className="text-[11px] font-black text-slate-800 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-300" /> {new Date(log.created_at).toLocaleDateString()}</span>
                             <span className="text-[10px] font-bold text-indigo-400">{new Date(log.created_at).toLocaleTimeString()}</span>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           {filteredLogs.length === 0 && !loading && (
             <div className="py-20 flex flex-col items-center justify-center opacity-30">
                <Database className="w-16 h-16 mb-4" />
                <p className="font-black uppercase tracking-widest text-slate-400">No Events Recorded</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;
