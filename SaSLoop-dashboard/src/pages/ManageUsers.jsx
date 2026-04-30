import { useEffect, useState } from "react";
import API_BASE from "../config";
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
    <div className="flex flex-col h-full space-y-4">
      {/* Header Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Manage System Users</h2>
          <p className="text-slate-500 mt-0.5 text-[13px] font-medium">View all registered global users across the platform.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden min-h-0">
        <div className="px-5 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/50/50">
           <h3 className="text-[14px] font-semibold text-slate-700 tracking-tight">Active Directory</h3>
           <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              {users.length} Total Users
           </span>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white sticky top-0 z-10 border-b border-slate-200 shadow-sm">
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-5 py-3">Account Details</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-[13px]">
              {loading ? (
                <tr>
                   <td colSpan="3" className="px-6 py-10 text-center text-slate-500 font-medium">Fetching directory...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                   <td colSpan="3" className="px-6 py-10 text-center text-slate-500 font-medium">No system records found.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-100 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded bg-white flex items-center justify-center text-slate-600 font-bold border border-slate-200 mr-3">
                           {(u.first_name || u.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                           <p className="font-semibold text-slate-700">{u.first_name ? `${u.first_name} ${u.last_name || ''}` : 'Unknown User'}</p>
                           <p className="text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${
                        u.role === 'master_admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : u.role === 'admin' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 pr-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
                        <span className={`font-semibold capitalize text-[11px] tracking-wider ${u.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
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
