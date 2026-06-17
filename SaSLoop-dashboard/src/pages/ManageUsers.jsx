import { useEffect, useState } from "react";
import API_BASE from "../config";
import { Users, Shield } from "lucide-react";
import Layout from "../components/Layout";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/master/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      {/* Header Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 className="pro-heading">All Users</h2>
          <p className="pro-subheading">Manage all platform user identities</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest flex items-center gap-2 shadow-sm">
               <Users className="w-3.5 h-3.5" /> {users.length} Registered Identities
            </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm min-h-0">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
           <h3 className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">Active Identity Matrix</h3>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <span className="w-2 h-2 rounded-full bg-rose-500" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Suspended</span>
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="pro-table sticky-header">
            <thead>
              <tr>
                <th>Identity Artifact</th>
                <th>Protocol Role</th>
                <th>Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-[13px]">
              {loading ? (
                <tr>
                   <td colSpan="3" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Querying Active Directory...</p>
                      </div>
                   </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                   <td colSpan="3" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                         <Shield className="w-12 h-12 text-slate-400" />
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No identity records found in cluster.</p>
                      </div>
                   </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-lg bg-slate-900 dark:bg-white/10 flex items-center justify-center text-white dark:text-white font-black text-[11px] border border-white/10 shadow-sm mr-4">
                           {(u.first_name || u.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                           <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">{u.first_name ? `${u.first_name} ${u.last_name || ''}` : 'Unknown User'}</p>
                           <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-[9px] font-black tracking-widest uppercase border ${
                        u.role === 'master_admin' 
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 shadow-sm' 
                          : u.role === 'admin' 
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 shadow-sm'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-sm'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 pr-6">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500'}`}></div>
                        <span className={`font-black uppercase text-[10px] tracking-widest ${u.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {u.status || 'inactive'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

}

export default ManageUsers;
