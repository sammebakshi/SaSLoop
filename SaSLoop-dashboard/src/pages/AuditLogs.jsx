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
        <div className="flex flex-col h-full bg-slate-50 dark:bg-[#14161b] p-6 space-y-6 overflow-hidden transition-colors duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-[28px] font-black text-slate-800 dark:text-white tracking-tighter flex items-center gap-4 uppercase underline decoration-indigo-500 decoration-4 underline-offset-8">
                        <Shield className="w-8 h-8 text-indigo-500" /> Platform Audit Trail
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[11px] mt-4 uppercase tracking-[0.2em]">Non-repudiable ledger of all administrative & security clusters</p>
                </div>
                <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 px-4 py-2 rounded-xl shadow-sm text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Total Events: {logs.length}
                </div>
            </div>

            <div className="flex flex-col bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 shadow-sm rounded-2xl flex-1 overflow-hidden relative">
                {/* Search Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center gap-6 bg-slate-50/50 dark:bg-white/5">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by action, user or email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-[12px] font-bold text-slate-800 dark:text-white focus:border-indigo-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <button onClick={fetchLogs} className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-400 hover:text-indigo-500 transition-all active:scale-95 shadow-sm">
                        <Activity className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Logs Table */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-50 dark:bg-[#1e2129] z-10 border-b border-slate-200 dark:border-white/5">
                            <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                <th className="px-6 py-4">Event Signature</th>
                                <th className="px-6 py-4">Actor Identity</th>
                                <th className="px-6 py-4">Action Context</th>
                                <th className="px-6 py-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${log.action === 'LOGIN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'} group-hover:scale-110 transition-transform`}>
                                                <Hash className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-black text-[11px] text-slate-800 dark:text-slate-200 tracking-tight uppercase">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-black text-slate-900 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-tighter"><User className="w-3 h-3 text-slate-400" /> {log.username}</span>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 lowercase">{log.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="max-w-xs">
                                            <pre className="text-[9px] font-mono bg-slate-50 dark:bg-black/20 p-2.5 rounded-lg border border-slate-200/50 dark:border-white/5 text-slate-600 dark:text-slate-400 overflow-x-auto custom-scrollbar leading-relaxed">
                                                {JSON.stringify(log.details)}
                                            </pre>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(log.created_at).toLocaleDateString()}</span>
                                            <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">{new Date(log.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredLogs.length === 0 && !loading && (
                        <div className="py-20 flex flex-col items-center justify-center opacity-10">
                            <Database className="w-16 h-16 mb-4 text-slate-400" />
                            <p className="font-black uppercase tracking-[0.4em] text-slate-800 dark:text-white">Audit Trail Silent</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default AuditLogs;
