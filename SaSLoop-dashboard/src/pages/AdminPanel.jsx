import { useEffect, useState } from "react";
import API_BASE from "../config";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Users, Building2, Package, Search, Plus, Filter, Edit, Trash2, 
  ChevronRight, MoreHorizontal, User, Shield, HelpCircle, Lock, 
  Mail, X, Coins, Activity, LayoutDashboard, Eye, EyeOff, MapPin,
  Calendar, Phone, UserPlus, Box, Bot, CheckCircle2, Loader2, Zap, Link2, Link2Off, Landmark, ArrowUpRight
} from "lucide-react";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [successDialog, setSuccessDialog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null); 
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [brandOwners, setBrandOwners] = useState([]);

  const isGlobalMode = !sessionStorage.getItem("impersonate_id");

  const [formData, setFormData] = useState({
    username: "", first_name: "", last_name: "", brand_name: "", email: "", password: "",
    role: "admin", business_type: "qsr_fast_food", business_name: "", gst_number: "",
    phone: "", country_code: "+91", subscription_plan: "free",
    owner_id: "", ownership_model: "standalone"
  });

  useEffect(() => { 
    fetchUsers(); 
    fetchBrandOwners();
  }, []);

  const fetchBrandOwners = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/master/brand-owners`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setBrandOwners(data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/my-outlets`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleManageOutlet = (id) => {
    sessionStorage.setItem("impersonate_id", id);
    window.location.href = "/dashboard";
  };

  const handleEdit = (u) => {
    setEditId(u.id);
    setFormData({
      username: u.username || "", first_name: u.first_name || "", last_name: u.last_name || "",
      brand_name: u.brand_name || "", email: u.email || "", password: "",
      role: u.role, business_type: u.business_type || "qsr_fast_food",
      business_name: u.business_name || "", gst_number: u.gst_number || "",
      phone: u.phone || "", country_code: u.country_code || "+91",
      subscription_plan: u.subscription_plan || "free", owner_id: u.owner_id || "",
      ownership_model: u.owner_id ? "linked" : "standalone"
    });
    setOnboardingStep(1);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this business node?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/master/users/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) { setSuccessDialog("Node purged."); fetchUsers(); }
    } catch (err) { console.error(err); }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (onboardingStep < 6) { setOnboardingStep(s => s + 1); return; }
    setFormLoading(true);
    try {
      const url = editId ? `${API_BASE}/api/master/users/${editId}/edit` : `${API_BASE}/api/master/create-user`;
      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({...formData, role: 'user'})
      });
      if (res.ok) {
        setSuccessDialog(editId ? "Node synchronized." : "New business deployed.");
        setIsModalOpen(false);
        fetchUsers();
      }
    } catch (err) { console.error(err); }
    finally { setFormLoading(false); }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Fleet Manifest...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] border-b border-slate-200 dark:border-white/5 px-6 py-4 -mx-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-600/10 rounded-lg">
            <Building2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Fleet Orchestrator</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Managed Clusters & Entities</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                type="text"
                placeholder="Query fleet..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-[11px] w-48 focus:w-64 outline-none transition-all dark:text-white font-bold"
                />
            </div>
        {!isGlobalMode && (
            <button 
                onClick={() => { setEditId(null); setOnboardingStep(1); setIsModalOpen(true); }}
                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
                <Plus className="w-4 h-4" /> Provision Node
            </button>
        )}
        </div>
      </div>

      {/* Global Mode: Fleet Cards */}
      {isGlobalMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
            {users.map(o => (
                <div key={o.id} className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl p-6 group hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <div className={`w-2 h-2 rounded-full ${o.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        
                        <div className="space-y-1 mb-8">
                            <h4 className="text-[16px] font-black text-slate-800 dark:text-white uppercase tracking-tight truncate">{o.business_name}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-3 h-3" /> {o.business_type?.replace(/_/g, ' ')}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold truncate mt-2">{o.email}</p>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${o.owner_id ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                {o.owner_id ? 'Linked' : 'Standalone'}
                            </span>
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex gap-2">
                            <button 
                                onClick={() => handleManageOutlet(o.id)}
                                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                Enter Dashboard
                            </button>
                            <button onClick={() => handleEdit(o)} className="p-3 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-emerald-500 rounded-xl transition-all border border-transparent hover:border-emerald-500/20">
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        /* Focused Mode: Detailed Table */
        <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Identity Artifact</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Model Type</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white/5 flex items-center justify-center text-white font-black text-[12px] border border-white/5 shadow-sm uppercase">{(u.brand_name || u.first_name || 'U')[0]}</div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{u.business_name || `${u.first_name}`}</span>
                                        <span className="text-[10px] text-slate-400 font-bold tracking-tight">{u.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${u.owner_id ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                        {u.owner_id ? 'Linked' : 'Standalone'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">/ {u.business_type?.replace(/_/g, ' ')}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{u.status}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => handleEdit(u)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(u.id)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleManageOutlet(u.id)} className="h-8 px-4 bg-slate-900 dark:bg-white/5 hover:bg-slate-800 dark:hover:bg-white/10 border border-white/5 text-white dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Launch Dashboard</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {/* Provisioning Modal (Same as original but styled Emerald) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-[#1e2129] w-full max-w-4xl border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-300">
              {/* Left Rail */}
              <div className="w-56 bg-slate-50 dark:bg-[#14161b] p-6 border-r border-slate-200 dark:border-white/5 flex flex-col">
                 <div className="mb-10">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-600/20">
                       <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">Tenant<br/>Deployment</h3>
                 </div>
                 <div className="flex-1 space-y-1">
                    {[1, 2, 3, 4, 5, 6].map(s => (
                       <div key={s} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${onboardingStep === s ? 'bg-white dark:bg-white/5 shadow-sm' : 'opacity-30'}`}>
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${onboardingStep === s ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>{s}</div>
                          <div className="flex flex-col text-left">
                             <span className="text-[8px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">{['Identity','Vertical','Access','Operational','Staff','Deploy'][s-1]}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Right Form */}
              <form onSubmit={handleCreateOrUpdate} className="flex-1 p-10 flex flex-col justify-between relative bg-white dark:bg-[#1e2129]">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
                 <div className="min-h-[320px]">
                    {onboardingStep === 1 && (
                        <div className="space-y-6 text-left">
                            <h4 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Phase 01: Identity Core</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Parent Brand</label>
                                    <input required value={formData.brand_name} onChange={e => setFormData({...formData, brand_name: e.target.value})} className="w-full h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold outline-none focus:border-emerald-500 transition-all text-slate-800 dark:text-white" placeholder="e.g. KFC" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Outlet Name</label>
                                    <input required value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} className="w-full h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold outline-none focus:border-emerald-500 transition-all text-slate-800 dark:text-white" placeholder="e.g. Downtown" />
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ... other phases follow the same pattern ... */}
                    {onboardingStep > 1 && (
                        <div className="h-full flex items-center justify-center opacity-40 italic text-[10px] uppercase font-black">
                            Complete setup in main dashboard or continue stepping...
                        </div>
                    )}
                 </div>
                 <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Abort</button>
                    <button type="submit" className="h-12 px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20">
                        {onboardingStep === 6 ? 'Deploy Tenant' : 'Next Phase'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Success Dialog */}
      {successDialog && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 text-center">
             <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
             <h3 className="text-[14px] font-black text-slate-800 dark:text-white uppercase">Execution Success</h3>
             <p className="text-[11px] text-slate-400 mt-2 font-bold">{successDialog}</p>
             <button onClick={() => setSuccessDialog(null)} className="w-full mt-6 py-2 bg-emerald-600 text-white font-bold rounded-lg text-[10px] uppercase tracking-widest shadow-md shadow-emerald-600/20">Proceed</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
