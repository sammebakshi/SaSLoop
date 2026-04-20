import { useEffect, useState } from "react";
import API_BASE from "../config";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Users, Building2, Package, Search, Plus, Filter, Edit, Trash2, 
  ChevronRight, MoreHorizontal, User, Shield, HelpCircle, Lock, 
  Mail, X, Coins, Activity, LayoutDashboard, Eye, EyeOff, MapPin,
  Calendar, Phone, UserPlus, Box, Bot
} from "lucide-react";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [successDialog, setSuccessDialog] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [formType, setFormType] = useState('business');
  const [viewMode, setViewMode] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null); 
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    parentage: "",
    dof: "",
    email: "",
    password: "",
    role: "user",
    business_type: "",
    business_name: "",
    gst_number: "",
    phone: "",
    address: "",
    security_question: "Favorite color?",
    security_answer: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customBusinessType, setCustomBusinessType] = useState("");
  const [adminPermissions, setAdminPermissions] = useState({
     can_create_accounts: false,
     can_view_only: false,
     can_manage_subscriptions: false,
     full_access: false
  });
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const adminRole = currentUser.role;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === '#add-business') {
      setTimeout(() => openAddBusiness(), 100);
      navigate('/admin-dashboard', { replace: true });
    } else if (location.hash === '#manage-businesses') {
      setTimeout(() => setViewMode('total_biz'), 100);
      navigate('/admin-dashboard', { replace: true });
    }
  }, [location.hash, navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/";
      return;
    }
    const user = JSON.parse(storedUser);
    if (!user.role || !user.role.startsWith("admin")) {
      window.location.href = "/";
      return;
    }
    setAdminPermissions(user.admin_permissions || {});
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/master/admin/my-users`, {
         headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("Admin Dashboard Clients Fetched:", data);
      if (res.ok) {
         setUsers(data);
      } else {
         console.error("Fetch failed:", data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    if (adminPermissions.can_view_only && !adminPermissions.full_access) {
      return errorNotify("You do not have permission to change status.");
    }
    try {
      const res = await fetch(`${API_BASE}/api/master/users/${id}/toggle`, {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      errorNotify("Status Update Failed: " + err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!adminPermissions.full_access) {
      return errorNotify("You do not have permission to delete users.");
    }
    setConfirmDialog({
      message: "Are you sure you want to permanently delete this account?",
      actionText: "Delete",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const res = await fetch(`${API_BASE}/api/master/users/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
          });
          if (res.ok) {
             setSuccessDialog("Business account and related data successfully deleted.");
             fetchUsers();
          } else {
            const errData = await res.json();
            errorNotify(errData.error || "Deletion failed.");
          }
        } catch (err) {
          errorNotify("Delete Operation Error: " + err.message);
        }
      }
    });
  };

  const resetPassword = async (id) => {
    if (!adminPermissions.full_access) {
      return errorNotify("You do not have permission to reset passwords.");
    }
    setConfirmDialog({
      message: "Are you sure you want to reset this business user's password?",
      actionText: "Reset",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const res = await fetch(`${API_BASE}/api/master/users/${id}/reset-password`, {
            method: 'PUT',
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
          });
          const data = await res.json();
          if (res.ok) {
            setSuccessDialog("Password reset successful. New password: " + data.newPassword);
            fetchUsers();
            if (viewUser && viewUser.id === id) {
              setViewUser({...viewUser, password: data.newPassword});
            }
          } else {
            errorNotify(data.error || "Reset failed.");
          }
        } catch (err) {
          errorNotify("Reset Operation Error: " + err.message);
        }
      }
    });
  };

  const openAddBusiness = () => {
    if (!adminPermissions.can_create_accounts && !adminPermissions.full_access) {
      return errorNotify("You do not have permission to add businesses.");
    }
    setEditId(null);
    setFormType("business");
    setShowPassword(false);
    setCustomBusinessType("");
    setFormData({
      username: "", first_name: "", last_name: "", parentage: "", dob: "", email: "", password: "", role: "user", business_type: "ecommerce_retail", business_name: "", gst_number: "",
      phone: "+91", address: "", security_question: "Favorite color?", security_answer: ""
    });
    setIsModalOpen(true);
  };

  const editAccount = (user) => {
    if (!adminPermissions.full_access && adminPermissions.can_view_only) {
      return errorNotify("You do not have permission to edit business accounts.");
    }
    setEditId(user.id);
    setFormType('business');
    setShowPassword(false);
    
    let defaultBizType = user.business_type || "";
    if (defaultBizType && !['ecommerce_retail', 'restaurant_cafe', 'real_estate', 'healthcare_clinic', 'salon_spa', 'travel_hospitality', 'education_edtech', 'gym_fitness', 'logistics_delivery', 'event_management', 'automobile_dealers', 'finance_insurance', 'home_services', 'b2b_wholesale', 'it_software', 'freelance_consulting'].includes(defaultBizType)) {
      setCustomBusinessType(defaultBizType);
      defaultBizType = 'other';
    } else {
      setCustomBusinessType("");
    }

    setFormData({
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      parentage: user.parentage || "",
      dob: user.dob ? user.dob.substring(0, 10) : "",
      email: user.email || "",
      password: "",
      role: "user",
      business_type: defaultBizType,
      business_name: user.business_name || "",
      gst_number: user.gst_number || "",
      phone: user.phone || "",
      address: user.address || "",
      security_question: user.security_question || "Favorite color?",
      security_answer: user.security_answer || ""
    });
    setIsModalOpen(true);
  };

  const errorNotify = (msg) => {
    setErrorMsg(msg);
    setIsErrorModalOpen(true);
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    const payload = { ...formData };
    if (formType === 'business' && formData.business_type === 'other' && customBusinessType.trim()) {
      payload.business_type = customBusinessType.trim();
    }
    
    payload.role = "user"; // ensure it's always user

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    payload.created_by = storedUser.id;

    try {
      const url = editId 
         ? `${API_BASE}/api/master/users/${editId}/edit` 
         : `${API_BASE}/api/master/create-user`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
        setSuccessDialog(editId ? "Business profile has been successfully updated!" : "New business workspace successfully registered!");
      } else {
        const errData = await res.json();
        errorNotify(errData.error || "Failed to process request.");
      }
    } catch (err) {
      errorNotify("Network or Server Connectivity Error: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const activeBusinesses = users.filter((u) => u.status === "active").length;
  const totalBusinesses = users.length;

  return (
    <div className="flex flex-col h-full space-y-6 md:space-y-8 p-4 md:p-6 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1 text-[11px] md:text-sm font-medium">Business client overview and management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mb-4">
         {(adminPermissions.full_access || adminPermissions.can_create_accounts) && (
           <button onClick={openAddBusiness} className="relative overflow-hidden group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all text-left flex items-start justify-between shadow-sm hover:shadow-xl hover:-translate-y-1">
              <div className="relative z-10">
                 <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors tracking-tight">Add Business</h3>
                 <p className="text-sm text-slate-500 font-medium mt-1">Register a new business workspace.</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors z-10">
                 <Box className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all duration-500"></div>
           </button>
         )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        {[
          { label: 'Active Businesses', val: activeBusinesses, key: 'active_biz', color: 'emerald', icon: Activity, gradient: 'from-emerald-50/80 to-white hover:from-emerald-100/80', iconColor: 'text-emerald-500' },
          { label: 'Total Businesses', val: totalBusinesses, key: 'total_biz', color: 'blue', icon: Box, gradient: 'from-blue-50/80 to-white hover:from-blue-100/80', iconColor: 'text-blue-500' }
        ].map(card => (
          <button 
            key={card.key} 
            onClick={() => { setViewMode(viewMode === card.key ? null : card.key); setSearchQuery(""); }} 
            className={`group p-6 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between h-40 ${viewMode === card.key ? `bg-white border-${card.color}-400 ring-4 ring-${card.color}-400/20 shadow-xl scale-105 z-10` : `bg-gradient-to-br ${card.gradient} border-slate-200/60 hover:border-${card.color}-300 hover:shadow-2xl hover:-translate-y-1`} shadow-sm`}
          >
            {/* Background Blob Effect */}
            <div className={`absolute -right-6 -top-6 w-32 h-32 bg-${card.color}-400/10 rounded-full blur-2xl group-hover:bg-${card.color}-400/20 transition-all duration-500`}></div>
            
            <div className="flex justify-between items-start w-full relative z-10">
               <p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-2 ${viewMode === card.key ? `text-${card.color}-600` : 'text-slate-500 group-hover:text-slate-700'}`}>{card.label}</p>
               <div className={`p-2.5 rounded-2xl bg-white shadow-sm border border-slate-100 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                 <card.icon className="w-5 h-5" />
               </div>
            </div>
            
            <h3 className={`text-5xl font-black relative z-10 tracking-tighter ${viewMode === card.key ? `text-${card.color}-700` : 'text-slate-800'}`}>
               {card.val}
            </h3>
            
            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-${card.color}-400 to-${card.color}-600 transform origin-left transition-transform duration-300 ${viewMode === card.key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></div>
          </button>
        ))}
      </div>

      {viewMode && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setViewMode(null)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  {viewMode.replace('_',' ')} Directory
                </h3>
              </div>
              
              <div className="relative flex-1 max-w-md">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                 </div>
                 <input 
                    type="text"
                    placeholder="Search by name, email or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-700 focus:border-emerald-500/50 outline-none transition-all"
                 />
              </div>

              <button onClick={() => setViewMode(null)} className="text-slate-500 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6 border border-slate-200 rounded-lg p-1 hover:bg-slate-100" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="sticky top-0 bg-slate-50 z-20 shadow-xl">
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold border-b border-slate-200">
                      <th className="px-8 py-5 border-b border-slate-200">Identity Details</th>
                      <th className="px-8 py-5 border-b border-slate-200">Entity Info</th>
                      <th className="px-8 py-5 border-b border-slate-200">Status</th>
                      <th className="px-8 py-5 border-b border-slate-200 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {users.filter(u => {
                      let matchCategory = false;
                      if (viewMode === 'active_biz') matchCategory = (u.status === 'active');
                      else if (viewMode === 'total_biz') matchCategory = true;
                      if (!matchCategory) return false;
                      if (!searchQuery) return true;
                      const searchLower = searchQuery.toLowerCase();
                      return (
                        u.first_name?.toLowerCase().includes(searchLower) ||
                        u.last_name?.toLowerCase().includes(searchLower) ||
                        u.email?.toLowerCase().includes(searchLower) ||
                        u.username?.toLowerCase().includes(searchLower)
                      );
                    }).map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-800 font-bold tracking-tight text-sm">{u.first_name} {u.last_name || ''}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium"><Mail className="w-3 h-3" /> {u.email}</div>
                            <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-mono"><User className="w-3 h-3" /> @{u.username || 'n/a'}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1.5">
                             <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border inline-block w-fit text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                                Business
                             </span>
                             {u.business_type && <span className="text-[10px] text-slate-400 opacity-60 flex items-center gap-1 uppercase tracking-tighter"><Building2 className="w-3 h-3" /> {u.business_type}</span>}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                             <span className={`text-[11px] font-black uppercase tracking-widest ${u.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>{u.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setViewUser(u); setIsViewModalOpen(true); }} className="p-2.5 bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all" title="View Profile"><Users className="w-4 h-4" /></button>
                            {(adminPermissions.full_access) && (
                              <>
                                {u.role === 'user' && (
                                   <button onClick={() => navigate('/bot-config', { state: { targetUser: u } })} className="p-2.5 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 rounded-xl transition-all" title="Bot Config"><Bot className="w-4 h-4" /></button>
                                )}
                                <button onClick={() => editAccount(u)} className="p-2.5 bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all" title="Edit"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => toggleStatus(u.id)} className={`p-2.5 rounded-xl transition-all ${u.status === 'active' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`} title="Status"><Activity className="w-4 h-4" /></button>
                                <button onClick={() => deleteUser(u.id)} className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/30 rounded-xl transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                              </>
                            )}
                            {!adminPermissions.full_access && !adminPermissions.can_view_only && (
                                <button onClick={() => { sessionStorage.setItem("impersonate_id", u.id); sessionStorage.setItem("impersonate_name", u.business_name || u.username); window.location.href = "/dashboard"; }} className="p-2.5 bg-indigo-50 text-indigo-500 hover:bg-indigo-100 rounded-xl transition-all" title="Visit Dashboard"><LayoutDashboard className="w-4 h-4" /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden p-4 space-y-4">
                {users.filter(u => {
                  let matchCategory = (viewMode === 'active_biz' ? u.status === 'active' : true);
                  if (!matchCategory) return false;
                  if (!searchQuery) return true;
                  const searchLower = searchQuery.toLowerCase();
                  return (u.first_name?.toLowerCase().includes(searchLower) || u.business_name?.toLowerCase().includes(searchLower));
                }).map(u => (
                  <div key={u.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-black tracking-tight">{u.business_name || u.username}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{u.first_name} {u.last_name || ''}</span>
                        <span className="text-[10px] text-indigo-500 font-medium lowercase">@{u.username}</span>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {u.status}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                      <button onClick={() => { setViewUser(u); setIsViewModalOpen(true); }} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold">
                        <Users className="w-3.5 h-3.5" /> Profile
                      </button>
                      <button onClick={() => { sessionStorage.setItem("impersonate_id", u.id); sessionStorage.setItem("impersonate_name", u.business_name || u.username); window.location.href = "/dashboard"; }} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-indigo-100">
                        <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                       {adminPermissions.full_access && (
                         <>
                           <button onClick={() => editAccount(u)} className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl"><Edit className="w-4 h-4" /></button>
                           <button onClick={() => toggleStatus(u.id)} className={`p-2.5 border rounded-xl ${u.status === 'active' ? 'border-amber-200 text-amber-500 bg-amber-50' : 'border-emerald-200 text-emerald-500 bg-emerald-50'}`}><Activity className="w-4 h-4" /></button>
                           <button onClick={() => deleteUser(u.id)} className="p-2.5 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                         </>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
               <span className="text-xs text-slate-500 font-medium tracking-wide">Showing results for {viewMode.replace('_',' ')} category.</span>
               <button onClick={() => setViewMode(null)} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all">Close Window</button>
            </div>

          </div>
        </div>
      , document.body)}

      {/* VIEW DETAILS MODAL */}
      {isViewModalOpen && viewUser && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsViewModalOpen(false)} />
          <div className="relative w-[90vw] max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left Column (Identity/Profile Header) */}
            <div className="w-full md:w-[35%] bg-white border-r border-slate-200 flex flex-col items-center justify-center py-12 px-6 relative shrink-0">
               <button onClick={() => setIsViewModalOpen(false)} className="md:hidden absolute top-6 right-6 text-slate-500 hover:text-slate-900 p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
               <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-900 mb-6 border-4 border-slate-300">
                  <User className="w-12 h-12" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter text-center">{viewUser.first_name} {viewUser.last_name || ''}</h3>
               <p className="text-emerald-400 font-mono text-sm mt-2 font-medium">@{viewUser.username || 'no-handle'}</p>
               
               <div className="mt-8 bg-slate-100/50 w-full p-4 rounded-xl border border-slate-200 text-center">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 mt-1">Classification</p>
                   <p className="text-sm font-black uppercase text-slate-900 tracking-widest">Business Client</p>
               </div>
            </div>
            
            {/* Right Column (Data) */}
            <div className="w-full md:w-[65%] p-8 lg:p-12 flex flex-col overflow-y-auto relative">
               <button onClick={() => setIsViewModalOpen(false)} className="hidden md:block absolute top-6 right-6 text-slate-400 hover:text-slate-900 p-1 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-6 h-6" /></button>
               
               <h4 className="text-lg font-extrabold text-slate-800 tracking-tight mb-6 flex items-center gap-2">
                 <Activity className="w-5 h-5 text-emerald-500" /> Identity Details
               </h4>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/30 transition-colors">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Address</p>
                      <p className="text-sm text-slate-800 font-bold truncate">{viewUser.email}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/30 transition-colors">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone Number</p>
                      <p className="text-sm text-slate-800 font-bold">{viewUser.phone || 'N/A'}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/30 transition-colors">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2"><UserPlus className="w-3.5 h-3.5" /> Parentage</p>
                      <p className="text-sm text-slate-800 font-bold truncate">{viewUser.parentage || 'N/A'}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/30 transition-colors">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Date of Birth</p>
                      <p className="text-sm text-slate-800 font-bold">{viewUser.dof ? viewUser.dof.substring(0, 10) : 'N/A'}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 sm:col-span-2 hover:border-emerald-500/30 transition-colors">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Location / Address</p>
                      <p className="text-sm text-slate-800 font-bold truncate">{viewUser.address || 'Not specified'}</p>
                   </div>

                   {viewUser.business_type && (
                     <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200 sm:col-span-2 flex justify-between items-center text-indigo-900 mt-2">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-100 rounded-lg text-indigo-500"><Building2 className="w-5 h-5" /></div>
                           <div className="flex flex-col gap-1 w-full flex-1">
                              <p className="text-[10px] text-indigo-500/80 font-bold uppercase tracking-widest mb-0.5">Business Information</p>
                              <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
                                  <div>
                                     <p className="text-[10px] uppercase text-indigo-400 font-bold tracking-wider">Trading As</p>
                                     <p className="text-sm font-black text-indigo-700">{viewUser.business_name || 'Not provided'}</p>
                                  </div>
                                  <div>
                                     <p className="text-[10px] uppercase text-indigo-400 font-bold tracking-wider">Focus / Vertical</p>
                                     <p className="text-sm font-black uppercase text-indigo-700">{viewUser.business_type}</p>
                                  </div>
                                  <div>
                                     <p className="text-[10px] uppercase text-indigo-400 font-bold tracking-wider">GST STATUS</p>
                                     {viewUser.gst_number ? (
                                        <p className="text-sm font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded w-fit">{viewUser.gst_number}</p>
                                     ) : (
                                        <p className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded w-fit">Not Registered (Evolution API)</p>
                                     )}
                                  </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   <div className="bg-emerald-950/20 p-6 rounded-2xl border border-emerald-900/30 sm:col-span-2 mt-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 pb-5 border-b border-emerald-900/30 gap-4">
                        <div className="flex items-center gap-3 text-emerald-900">
                           <div className="p-2 bg-white rounded-lg text-emerald-400"><Shield className="w-5 h-5" /></div>
                           <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Business Client Guard</p>
                              <p className="text-xs text-slate-700 font-bold tracking-wide mt-0.5">Authentication Tokens</p>
                           </div>
                        </div>
                        {adminRole === 'admin_full' && (
                           <button onClick={() => resetPassword(viewUser.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0">
                              Regenerate Password
                           </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> Security Verify</p>
                          <p className="text-xs text-slate-700 font-medium italic border-l-2 border-emerald-500/50 pl-3 py-1 bg-slate-50 rounded-r-lg">{viewUser.security_question || 'None set'}</p>
                          <p className="text-xs font-bold text-emerald-600 mt-2 pl-3">A: {(adminPermissions.full_access) ? (viewUser.security_answer || '••••••') : '••••••'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Current Password</p>
                          <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 w-full overflow-x-auto custom-scrollbar">
                             <p className="text-sm font-mono text-slate-900 tracking-widest whitespace-nowrap">{(adminPermissions.full_access) ? (viewUser.password || '••••••') : '••••••'}</p>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
            </div>
          </div>
        </div>
      , document.body)}

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-[90vw] max-w-5xl bg-white rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-white text-slate-900 flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight">{editId ? 'Edit' : 'Add'} Business User</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-slate-100 p-1 rounded-lg transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSaveAccount} className="p-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">First Name</label>
                  <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} placeholder="e.g. John" className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Last Name</label>
                  <input value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} placeholder="e.g. Doe" className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Username</label>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="e.g. johndoe99" className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 8900" className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Date of Birth</label>
                  <input type="date" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Parentage / Guardian</label>
                  <input required value={formData.parentage} onChange={e => setFormData({...formData, parentage: e.target.value})} placeholder="Parent/Guardian info" className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Physical Address</label>
                  <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Detailed location address" className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl w-full" />
                </div>
                {formType === 'business' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Business Trading Name</label>
                      <input required value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} placeholder="e.g. The Grand Hotel" className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">GST Number (Optional)</label>
                      <input value={formData.gst_number} onChange={e => setFormData({...formData, gst_number: e.target.value})} placeholder="Leaves blank if unavailable" className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl" />
                    </div>
                  </>
                )}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Business Vertical</label>
                  <select value={formData.business_type} onChange={e => setFormData({...formData, business_type: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl">
                    <option value="ecommerce_retail">E-Commerce & Retail</option>
                    <option value="restaurant_cafe">Restaurants & Cafes</option>
                    <option value="real_estate">Real Estate & Property</option>
                    <option value="healthcare_clinic">Healthcare & Clinics</option>
                    <option value="salon_spa">Salons, Spas & Beauty</option>
                    <option value="travel_hospitality">Travel & Hospitality</option>
                    <option value="education_edtech">Education & Coaching</option>
                    <option value="gym_fitness">Gyms & Fitness Centers</option>
                    <option value="logistics_delivery">Logistics & Delivery</option>
                    <option value="event_management">Event Management</option>
                    <option value="automobile_dealers">Automobile & Dealerships</option>
                    <option value="finance_insurance">Financial Services</option>
                    <option value="home_services">Home Maintenance & Services</option>
                    <option value="b2b_wholesale">B2B Wholesale & Manufacturing</option>
                    <option value="it_software">IT & Software Agencies</option>
                    <option value="freelance_consulting">Freelance & Consulting</option>
                    <option value="other">Other</option>
                  </select>
                  {formData.business_type === 'other' && (
                     <input required autoFocus value={customBusinessType} onChange={e => setCustomBusinessType(e.target.value)} placeholder="Please specify business type" className="mt-2 border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 rounded-xl w-full" />
                  )}
                </div>
                {!editId && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Initial Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Secure password" className="w-full border border-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 p-3 pr-10 rounded-xl" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                         {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={formLoading} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                  {formLoading ? 'Applying...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {/* ERROR NOTIFICATION DIALOG */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-rose-950/20 backdrop-blur-sm" onClick={() => setIsErrorModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="p-8 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                   <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Operation Failed</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{errorMsg}</p>
                <button 
                   onClick={() => setIsErrorModalOpen(false)}
                   className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                >
                   Acknowledge
                </button>
             </div>
          </div>
        </div>
      )}

      {/* SUCCESS NOTIFICATION DIALOG */}
      {successDialog && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm" onClick={() => setSuccessDialog(null)} />
           <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                    <Activity className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Success</h3>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 break-words">{successDialog}</p>
                 <button 
                    onClick={() => setSuccessDialog(null)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                 >
                    Awesome
                 </button>
              </div>
           </div>
         </div>
      , document.body)}

      {/* CONFIRMATION DIALOG */}
      {confirmDialog && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setConfirmDialog(null)} />
           <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                    <HelpCircle className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Wait a second...</h3>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{confirmDialog.message}</p>
                 <div className="flex gap-3">
                    <button 
                       onClick={() => setConfirmDialog(null)}
                       className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
                    >
                       Cancel
                    </button>
                    <button 
                       onClick={confirmDialog.onConfirm}
                       className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                    >
                       {confirmDialog.actionText || 'Confirm'}
                    </button>
                 </div>
              </div>
           </div>
         </div>
      , document.body)}

    </div>
  );
}

export default AdminPanel;