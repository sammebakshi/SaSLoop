import { useEffect, useState } from "react";
import API_BASE from "../config";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Users, LayoutDashboard, Building2, User, Mail, 
  Search, Shield, Coins, Activity, Edit, Trash2, X, 
  HelpCircle, MoreVertical, CheckCircle2, ChevronRight, Eye,
  Lock, Key, Phone, Settings, Activity as ActivityIcon, Loader2,
  DollarSign, Globe, Smartphone, Landmark, QrCode, Link as LinkIcon, Box, MapPin, Filter, Package, Zap, Link2, Link2Off, UserPlus
} from "lucide-react";

function MasterAdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successDialog, setSuccessDialog] = useState(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditUser, setCreditUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [editId, setEditId] = useState(null); 
  const [rechargeRequests, setRechargeRequests] = useState([]);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "", first_name: "", last_name: "", brand_name: "", email: "", password: "",
    role: "user", business_type: "qsr_fast_food", business_name: "", gst_number: "",
    phone: "", country_code: "+91", address: "", security_question: "Favorite color?",
    security_answer: "Blue", subscription_plan: "free"
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === '#add-admin') openAddAdmin();
    else if (location.hash === '#add-business') openAddBusiness();
  }, [location.hash]);

  useEffect(() => {
    fetchUsers();
    fetchRechargeRequests();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/master/users`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchRechargeRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/master/recharge-requests`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRechargeRequests(data);
      }
    } catch (e) {}
  };

  const openAddAdmin = () => { setEditId(null); setOnboardingStep(1); setFormData({...formData, role: 'admin_level_1'}); setIsModalOpen(true); };
  const openAddBusiness = () => { setEditId(null); setOnboardingStep(1); setFormData({...formData, role: 'user'}); setIsModalOpen(true); };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    const maxSteps = (formData.role.startsWith('admin') || formData.role === 'brand_owner') ? 3 : 6;
    if (onboardingStep < maxSteps) { setOnboardingStep(s => s + 1); return; }
    setFormLoading(true);
    try {
      const url = editId ? `${API_BASE}/api/master/users/${editId}/edit` : `${API_BASE}/api/master/create-user`;
      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccessDialog(editId ? "Node Synchronized." : "New Tenant Deployed.");
        setIsModalOpen(false);
        fetchUsers();
      } else {
        const d = await res.json();
        errorNotify(d.error || "Operation failed.");
      }
    } catch (err) { errorNotify("Network Error"); }
    finally { setFormLoading(false); }
  };

  const editAccount = (u) => {
    setEditId(u.id);
    setFormData({
      username: u.username || "", first_name: u.first_name || "", last_name: u.last_name || "",
      brand_name: u.brand_name || "", email: u.email || "", password: "", role: u.role,
      business_type: u.business_type || "qsr_fast_food", business_name: u.business_name || "",
      gst_number: u.gst_number || "", phone: u.phone || "", country_code: u.country_code || "+91",
      address: u.address || "", security_question: u.security_question || "Favorite color?",
      security_answer: u.security_answer || "Blue", subscription_plan: u.subscription_plan || "free",
      owner_id: u.owner_id || "", ownership_model: u.owner_id ? "linked" : "standalone"
    });
    setOnboardingStep(1);
    setIsModalOpen(true);
  };

  const handleUnlink = async (id) => {
    if (!window.confirm("Decouple this node from its parent owner? It will become a Standalone Brand.")) return;
    try {
      const res = await fetch(`${API_BASE}/api/master/users/${id}/ownership`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ owner_id: null })
      });
      if (res.ok) { setSuccessDialog("Node decoupled successfully."); fetchUsers(); }
      else { errorNotify("Unlink failed."); }
    } catch (err) { errorNotify("Network Error"); }
  };

  const handleTopUp = async () => {
    if (!creditUser || !creditAmount) return;
    try {
      const res = await fetch(`${API_BASE}/api/master/users/${creditUser.id}/credits`, {
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ amount: parseInt(creditAmount) })
      });
      if (res.ok) {
        setSuccessDialog(`Added ${creditAmount} credits.`);
        setIsCreditModalOpen(false);
        fetchUsers();
      } else { errorNotify("Top-up failed."); }
    } catch (err) { errorNotify("Network Error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this entity from the cluster?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/master/users/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) { setSuccessDialog("Entity purged."); fetchUsers(); }
      else { errorNotify("Deletion failed."); }
    } catch (err) { errorNotify("Network Error"); }
  };

  const handleApproveRecharge = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/master/recharge-requests/${id}/approve`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) { setSuccessDialog("Approved."); fetchRechargeRequests(); fetchUsers(); }
      else { errorNotify("Approval failed."); }
    } catch (err) { errorNotify("Network Error"); }
  };

  const handleRejectRecharge = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/master/recharge-requests/${id}/reject`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) { setSuccessDialog("Rejected."); fetchRechargeRequests(); }
      else { errorNotify("Rejection failed."); }
    } catch (err) { errorNotify("Network Error"); }
  };

  const errorNotify = (msg) => { setErrorMsg(msg); setIsErrorModalOpen(true); };

  const totalBusinesses = users.filter(u => u.role === 'user').length;
  const activeBusinesses = users.filter(u => u.role === 'user' && u.status === 'active').length;
  const totalAdmins = users.filter(u => u.role.startsWith('admin')).length;

  const countryCodes = [{ code: "+91" }, { code: "+971" }, { code: "+1" }, { code: "+44" }, { code: "+966" }];
  const brands = [...new Set(users.map(u => u.brand_name).filter(Boolean))];

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#14161b] text-slate-600 dark:text-slate-400 font-sans overflow-hidden transition-colors duration-500">
      {/* Header Area */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#1e2129]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <Shield className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-slate-800 dark:text-white leading-none uppercase tracking-tight">SaSLoop ERP | AI</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-bold">Master Orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsRechargeModalOpen(true)} className="h-8 px-3 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-md text-[11px] font-bold transition-all flex items-center gap-2 text-slate-600 dark:text-slate-300 relative group">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            Queue
            {rechargeRequests.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 shadow-sm" />
            )}
          </button>
          <button onClick={openAddAdmin} className="h-8 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[11px] font-bold transition-all flex items-center gap-2 shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            Provision Admin
          </button>
          <button onClick={openAddBusiness} className="h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[11px] font-bold transition-all flex items-center gap-2 shadow-sm">
            <Building2 className="w-3.5 h-3.5" />
            Deploy Tenant
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto no-scrollbar p-3 space-y-3">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Cloud Entities', val: totalBusinesses, icon: Box, color: 'emerald' },
            { label: 'Active Clusters', val: activeBusinesses, icon: Activity, color: 'indigo' },
            { label: 'Orchestrators', val: totalAdmins, icon: Shield, color: 'amber' },
            { label: 'Global Traffic', val: 'Online', icon: Globe, color: 'blue' }
          ].map(card => (
            <div key={card.label} className="bg-white dark:bg-[#1e2129] p-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group transition-all hover:border-indigo-500/30">
               <div className="flex items-center gap-2 mb-2 relative z-10">
                  <card.icon className={`w-3.5 h-3.5 text-${card.color}-500 dark:text-${card.color}-400`} />
                  <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">{card.label}</span>
               </div>
               <h3 className="text-[20px] font-bold text-slate-800 dark:text-white tracking-tighter relative z-10">{card.val}</h3>
               <div className={`absolute -right-4 -bottom-4 w-12 h-12 bg-${card.color}-500/5 rounded-full blur-xl group-hover:bg-${card.color}-500/10 transition-all`} />
            </div>
          ))}
        </div>

        {/* Directory Matrix */}
        <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-lg overflow-hidden shadow-sm flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e2129]">
            <div className="flex items-center gap-3">
               <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Global Directory</h3>
               <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-md">
                  <button onClick={() => setBrandFilter("")} className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${!brandFilter ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}>All Tiers</button>
                  <button onClick={() => setBrandFilter("admin")} className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${brandFilter === 'admin' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}>Admins Only</button>
               </div>
            </div>
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
               <input type="text" placeholder="Query identity matrix..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full sm:w-64 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-md pl-8 pr-4 py-1.5 text-[11px] font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500/50 transition-all" />
            </div>
          </div>

          <div className="overflow-auto flex-1 custom-scrollbar">
             <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-white/5 sticky top-0 z-10">
                   <tr className="border-b border-slate-200 dark:border-white/5">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Identity Artifact</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Protocol Tier</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {users.filter(u => {
                      const ms = !searchQuery || [u.business_name, u.brand_name, u.email, u.first_name, u.username].some(v => v?.toLowerCase().includes(searchQuery.toLowerCase()));
                      const mb = !brandFilter || (brandFilter === 'admin' ? u.role.startsWith('admin') : u.brand_name === brandFilter);
                      return ms && mb;
                   }).map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] group transition-all">
                         <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white/10 flex items-center justify-center text-white font-black text-[11px] shadow-sm uppercase">{(u.brand_name || u.first_name || 'U')[0]}</div>
                               <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                     <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{u.business_name || `${u.first_name} ${u.last_name || ''}`}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{u.email}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                               u.role === 'master_admin' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                               u.role.startsWith('admin') ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' :
                               'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            }`}>
                               {u.role.replace('_', ' ')}
                            </span>
                         </td>
                         <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">{u.status}</span>
                            </div>
                         </td>
                         <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => { setCreditUser(u); setIsCreditModalOpen(true); }} className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-500 rounded transition-all" title="Credits">
                                  <Coins className="w-3.5 h-3.5" />
                               </button>
                               <button onClick={() => editAccount(u)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded transition-all">
                                  <Edit className="w-3.5 h-3.5"/>
                               </button>
                               <button onClick={() => handleDelete(u.id)} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 rounded transition-all">
                                  <Trash2 className="w-3.5 h-3.5"/>
                               </button>
                               <button onClick={() => { sessionStorage.setItem("impersonate_id", u.id); window.location.href = "/dashboard"; }} className="h-7 px-3 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all">Impersonate</button>
                               {u.owner_id && (
                                  <button onClick={() => handleUnlink(u.id)} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-400 hover:text-rose-600 rounded transition-all" title="Unlink/Sold">
                                     <Link2Off className="w-3.5 h-3.5" />
                                  </button>
                               )}
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>

             {loading && (
               <div className="py-20 flex flex-col items-center justify-center">
                 <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-3" />
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Syncing Orchestrator...</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* High-Density 6-Phase Onboarding Concierge */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1e2129] w-full max-w-4xl border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-300">
             {/* Left Rail: Progress Architecture */}
             <div className="w-56 bg-slate-50 dark:bg-[#14161b] p-6 border-r border-slate-200 dark:border-white/5 flex flex-col">
                <div className="mb-10">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-600/20">
                      {formData.role.startsWith('admin') || formData.role === 'brand_owner' ? <Shield className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                   </div>
                   <h3 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                      {formData.role.startsWith('admin') || formData.role === 'brand_owner' ? 'Admin\nProvisioning' : 'Business\nDeployment'}
                   </h3>
                </div>
                
                <div className="flex-1 space-y-1">
                   {(formData.role.startsWith('admin') || formData.role === 'brand_owner' 
                      ? [
                          { id: 1, label: 'Identity', sub: 'Brand Core' },
                          { id: 2, label: 'Access', sub: 'Authentication' },
                          { id: 3, label: 'Deploy', sub: 'Provisioning' }
                        ]
                      : [
                          { id: 1, label: 'Identity', sub: 'Node Core' },
                          { id: 2, label: 'Vertical', sub: 'Market Type' },
                          { id: 3, label: 'Access', sub: 'Authentication' },
                          { id: 4, label: 'Compliance', sub: 'Ruleset' },
                          { id: 5, label: 'Security', sub: 'Master Key' },
                          { id: 6, label: 'Deploy', sub: 'Provisioning' }
                        ]
                   ).map(s => (
                      <div key={s.id} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${onboardingStep === s.id ? 'bg-white dark:bg-white/5 shadow-sm' : 'opacity-30'}`}>
                         <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${onboardingStep === s.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>{s.id}</div>
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">{s.label}</span>
                            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{s.sub}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Right Content: Phase Theater */}
             <form onSubmit={handleSaveAccount} className="flex-1 p-10 flex flex-col justify-between relative bg-white dark:bg-[#1e2129]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                
                <div className="min-h-[320px] animate-in fade-in slide-in-from-bottom-2 duration-500">
                   {onboardingStep === 1 && (
                      <div className="space-y-6">
                         <div className="space-y-1">
                            <h4 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                               Phase 01: {(formData.role.startsWith('admin') || formData.role === 'brand_owner') ? 'Brand Identity DNA' : 'Cluster Node DNA'}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Establish the core identity of the enterprise node</p>
                         </div>
                          <div className="space-y-4">
                             {(formData.role.startsWith('admin') || formData.role === 'brand_owner') ? (
                                <div className="space-y-4">
                                   <div className="space-y-1.5">
                                      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Target Administrative Tier</label>
                                      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
                                         {['admin_level_1', 'brand_owner'].map(r => (
                                            <button key={r} type="button" onClick={() => setFormData({...formData, role: r})} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formData.role === r ? 'bg-white dark:bg-white/10 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{r.replace('_', ' ')}</button>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="space-y-1.5">
                                      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Brand Identity Name</label>
                                      <input required value={formData.brand_name} onChange={e => setFormData({...formData, brand_name: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="e.g. KFC Global" />
                                   </div>
                                </div>
                             ) : (
                                <div className="space-y-4">
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1.5">
                                         <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Ownership Model</label>
                                         <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
                                            {['standalone', 'linked'].map(m => (
                                               <button key={m} type="button" onClick={() => setFormData({...formData, ownership_model: m, owner_id: m === 'standalone' ? '' : formData.owner_id})} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formData.ownership_model === m ? 'bg-white dark:bg-white/10 text-emerald-600 shadow-sm' : 'text-slate-400'}`}>{m}</button>
                                            ))}
                                         </div>
                                      </div>
                                      <div className="space-y-1.5">
                                         <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Parent Brand</label>
                                         <input required value={formData.brand_name} onChange={e => setFormData({...formData, brand_name: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="e.g. KFC" />
                                      </div>
                                   </div>
                                   {formData.ownership_model === 'linked' && (
                                      <div className="space-y-1.5 animate-in slide-in-from-top-2">
                                         <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Link to Brand Owner</label>
                                         <select value={formData.owner_id} onChange={e => setFormData({...formData, owner_id: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none">
                                            <option value="">Select Existing Owner...</option>
                                            {users.filter(u => u.role === 'brand_owner').map(o => (
                                               <option key={o.id} value={o.id}>{o.brand_name || o.first_name} ({o.email})</option>
                                            ))}
                                         </select>
                                      </div>
                                   )}
                                   <div className="space-y-1.5">
                                      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Specific Node Name</label>
                                      <input required value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="e.g. Downtown Mall" />
                                   </div>
                                </div>
                             )}
                          </div>
                      </div>
                   )}

                   {onboardingStep === 2 && (
                      <div className="space-y-6">
                         {(formData.role.startsWith('admin') || formData.role === 'brand_owner') ? (
                            <div className="space-y-6">
                               <div className="space-y-1">
                                  <h4 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Phase 02: Administrative Credentials</h4>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Provision owner authentication and identifiers</p>
                               </div>
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-1.5">
                                     <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Owner Name</label>
                                     <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="Admin Name" />
                                  </div>
                                  <div className="space-y-1.5">
                                     <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Username</label>
                                     <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="unique_id" />
                                  </div>
                                  <div className="space-y-1.5 col-span-2">
                                     <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Email</label>
                                     <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="admin@enterprise.com" />
                                  </div>
                                  {!editId && (
                                     <div className="space-y-1.5 col-span-2">
                                        <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Master Key (Password)</label>
                                        <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-11 bg-slate-900 text-white border-none rounded-xl px-4 text-[14px] font-black tracking-widest outline-none" placeholder="••••••••" />
                                     </div>
                                  )}
                               </div>
                            </div>
                         ) : (
                            <div className="space-y-6">
                               <div className="space-y-1">
                                  <h4 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Phase 02: Market Verticals</h4>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select the operational engine for this cluster</p>
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  {['qsr_fast_food', 'fine_dining', 'retail_enterprise', 'service_provider'].map(type => (
                                     <button key={type} type="button" onClick={() => setFormData({...formData, business_type: type})} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${formData.business_type === type ? 'border-indigo-600 bg-indigo-600/5' : 'border-slate-100 dark:border-white/5'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.business_type === type ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                                           {type === 'qsr_fast_food' ? <Zap className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                                        </div>
                                        <div>
                                           <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{type.replace(/_/g, ' ')}</p>
                                           <p className="text-[8px] font-bold text-slate-400 uppercase">Engine Selected</p>
                                        </div>
                                     </button>
                                  ))}
                               </div>
                            </div>
                         )}
                      </div>
                   )}

                   {onboardingStep === 3 && (
                      <div className="space-y-6">
                         {(formData.role.startsWith('admin') || formData.role === 'brand_owner') ? (
                            <div className="space-y-6">
                               <div className="space-y-1">
                                  <h4 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Phase 03: Summary & Deployment</h4>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Final verification of the administrative manifest</p>
                               </div>
                               <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/5 space-y-4">
                                  <div className="grid grid-cols-2 gap-y-4 text-[11px]">
                                     <div><p className="text-slate-400 font-black uppercase text-[8px] mb-1">Target Brand</p><p className="font-bold text-slate-800 dark:text-white">{formData.brand_name}</p></div>
                                     <div><p className="text-slate-400 font-black uppercase text-[8px] mb-1">Identity Tier</p><p className="font-bold text-slate-800 dark:text-white uppercase">{formData.role.replace('_',' ')}</p></div>
                                     <div><p className="text-slate-400 font-black uppercase text-[8px] mb-1">Primary Admin</p><p className="font-bold text-slate-800 dark:text-white">{formData.first_name} ({formData.username})</p></div>
                                     <div><p className="text-slate-400 font-black uppercase text-[8px] mb-1">Status</p><p className="font-bold text-emerald-600 uppercase tracking-widest">Ready for Deployment</p></div>
                                  </div>
                               </div>
                            </div>
                         ) : (
                            <div className="space-y-6">
                               <div className="space-y-1">
                                  <h4 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Phase 03: Administrative Access</h4>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Configure security protocols and owner identity</p>
                               </div>
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-1.5">
                                     <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Primary Orchestrator Name</label>
                                     <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value, last_name: ''})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="Full Name" />
                                  </div>
                                  <div className="space-y-1.5">
                                     <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Security Identifier (Username)</label>
                                     <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="unique_id" />
                                  </div>
                                  <div className="space-y-1.5 col-span-2">
                                     <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Administrative Email Tunnel</label>
                                     <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="admin@enterprise.com" />
                                  </div>
                               </div>
                            </div>
                         )}
                      </div>
                   )}

                   {onboardingStep === 4 && (
                      <div className="space-y-6">
                         <div className="space-y-1">
                            <h4 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Phase 04: Compliance & Rules</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Define fiscal boundaries and regional compliance</p>
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Tax ID / GST Portal</label>
                               <input value={formData.gst_number} onChange={e => setFormData({...formData, gst_number: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all" placeholder="Tax Identification" />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Currency/Phone Cluster</label>
                               <div className="flex gap-2">
                                  <select value={formData.country_code} onChange={e => setFormData({...formData, country_code: e.target.value})} className="h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-[12px] font-black text-slate-600 dark:text-slate-400 outline-none w-24">
                                     {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                  </select>
                                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="flex-1 h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none" placeholder="Emergency Phone" />
                               </div>
                            </div>
                            <div className="col-span-2 space-y-1.5">
                               <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Assigned Support Tier</label>
                               <select value={formData.subscription_plan} onChange={e => setFormData({...formData, subscription_plan: e.target.value})} className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-[12px] font-bold text-slate-800 dark:text-white outline-none">
                                  <option value="free">Standard Trial Tier</option>
                                  <option value="pro">Enterprise Pro Tier</option>
                                  <option value="ultimate">Ultimate Cluster</option>
                               </select>
                            </div>
                         </div>
                      </div>
                   )}

                   {onboardingStep === 5 && (
                      <div className="space-y-6 text-center py-10">
                         <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-indigo-600" />
                         </div>
                         <div className="space-y-2 max-w-sm mx-auto">
                            <h4 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Phase 05: Master Credentials</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Establish the final security barrier for this tenant. This password will be the root key for the dashboard.</p>
                         </div>
                         {!editId && (
                           <div className="max-w-xs mx-auto mt-8">
                              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-14 bg-slate-900 text-white border-none rounded-2xl px-6 text-[18px] font-black text-center tracking-[0.5em] outline-none shadow-2xl" placeholder="••••••••" />
                           </div>
                         )}
                      </div>
                   )}

                   {onboardingStep === 6 && (
                      <div className="space-y-6">
                         <div className="space-y-1">
                            <h4 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Phase 06: Review & Deployment</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Final verification of the enterprise manifest</p>
                         </div>
                         <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/5 space-y-4">
                            <div className="grid grid-cols-2 gap-y-4 text-[11px]">
                               <div><p className="text-slate-400 font-black uppercase text-[8px] mb-1">Target Cluster</p><p className="font-bold text-slate-800 dark:text-white">{formData.brand_name} / {formData.business_name}</p></div>
                               <div><p className="text-slate-400 font-black uppercase text-[8px] mb-1">Identity Tier</p><p className="font-bold text-slate-800 dark:text-white uppercase">{formData.role.replace('_',' ')}</p></div>
                               <div><p className="text-slate-400 font-black uppercase text-[8px] mb-1">Admin Identity</p><p className="font-bold text-slate-800 dark:text-white">{formData.first_name} ({formData.username})</p></div>
                               <div><p className="text-slate-400 font-black uppercase text-[8px] mb-1">Tunnel Status</p><p className="font-bold text-emerald-600 uppercase tracking-widest">Ready for Provisioning</p></div>
                            </div>
                         </div>
                      </div>
                   )}
                </div>

                <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                   <button type="button" onClick={() => onboardingStep > 1 ? setOnboardingStep(prev => prev - 1) : setIsModalOpen(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all">Abort Deployment</button>
                   <div className="flex items-center gap-4">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                         Phase {onboardingStep} / {(formData.role.startsWith('admin') || formData.role === 'brand_owner') ? 3 : 6}
                      </p>
                      <button type="submit" disabled={formLoading} className="h-12 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/20 disabled:opacity-50">
                         {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : onboardingStep === ((formData.role.startsWith('admin') || formData.role === 'brand_owner') ? 3 : 6) ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                         {onboardingStep === ((formData.role.startsWith('admin') || formData.role === 'brand_owner') ? 3 : 6) ? (editId ? 'Sync Node' : 'Initialize Cluster') : 'Proceed Phase'}
                      </button>
                   </div>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Utility Modals */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xs bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-center">
             <Shield className="w-8 h-8 text-rose-500 mx-auto mb-3" />
             <h3 className="text-[14px] font-bold text-slate-800 uppercase">Execution Failed</h3>
             <p className="text-[11px] text-slate-500 mt-2 font-bold">{errorMsg}</p>
             <button onClick={() => setIsErrorModalOpen(false)} className="w-full mt-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-md text-[10px] uppercase tracking-wider transition-all shadow-sm">Dismiss</button>
          </div>
        </div>
      )}

      {successDialog && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="relative w-full max-w-xs bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-[14px] font-bold text-slate-800 uppercase">Execution Success</h3>
              <p className="text-[11px] text-slate-500 mt-2 font-bold">{successDialog}</p>
              <button onClick={() => setSuccessDialog(null)} className="w-full mt-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md text-[10px] uppercase tracking-wider transition-all shadow-sm">Proceed</button>
           </div>
         </div>
      )}

      {isCreditModalOpen && creditUser && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="relative w-full max-w-xs bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-center">
              <Coins className="w-10 h-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-[16px] font-bold text-slate-800 uppercase mb-2">Recharge Wallet</h3>
              <input type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 font-black text-3xl text-center text-slate-800 mb-6 focus:border-amber-500/50 outline-none" />
              <div className="flex gap-2">
                 <button onClick={() => setIsCreditModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 font-bold py-2 rounded text-[10px] uppercase tracking-wider transition-all">Back</button>
                 <button onClick={handleTopUp} className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 rounded text-[10px] uppercase tracking-wider transition-all shadow-md">Confirm</button>
              </div>
           </div>
         </div>
      )}

      {isRechargeModalOpen && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-[14px] font-bold text-slate-800 uppercase flex items-center gap-2">
                   <Coins className="w-4 h-4 text-amber-500" /> Recharge Queue
                 </h2>
                 <button onClick={() => setIsRechargeModalOpen(false)} className="hover:bg-slate-200 p-1 rounded-md transition-all"><X className="w-5 h-5"/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                 {rechargeRequests.length === 0 && (
                    <div className="py-20 text-center opacity-30">
                       <Package className="w-10 h-10 mx-auto mb-3" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Queue Clear</p>
                    </div>
                 )}
                 {rechargeRequests.map(req => (
                    <div key={req.id} className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex items-center justify-between group">
                       <div>
                          <span className="font-bold text-slate-800 text-[13px] tracking-tight uppercase">{req.name || req.username}</span>
                          <div className="flex gap-3 mt-0.5 text-[10px] font-black uppercase text-emerald-600">₹{req.plan_amount} • {req.credits_requested} Credits</div>
                       </div>
                       <div className="flex gap-2">
                          {req.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleApproveRecharge(req.id)} className="h-7 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-bold uppercase tracking-wider transition-all">Approve</button>
                              <button onClick={() => handleRejectRecharge(req.id)} className="h-7 px-4 bg-rose-500 hover:bg-rose-400 text-white rounded text-[9px] font-bold uppercase tracking-wider transition-all">Reject</button>
                            </>
                          )}
                          <span className={`text-[9px] font-black uppercase tracking-widest ${req.status === 'PENDING' ? 'text-amber-500' : req.status === 'APPROVED' ? 'text-emerald-500' : 'text-rose-500'}`}>{req.status}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
         </div>
       )}
    </div>
  );
}

export default MasterAdminPanel;
