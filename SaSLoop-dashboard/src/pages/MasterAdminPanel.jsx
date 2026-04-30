import { useEffect, useState } from "react";
import API_BASE from "../config";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Users, LayoutDashboard, Building2, User, Mail, 
  Search, Shield, Coins, Activity, Edit, Trash2, X, 
  HelpCircle, MoreVertical, CheckCircle2, ChevronRight, Eye,
  Lock, Key, Phone, Settings, Activity as ActivityIcon, Loader2,
  DollarSign, Globe, Smartphone, Landmark, QrCode, Link as LinkIcon, Box, MapPin
} from "lucide-react";

function MasterAdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [successDialog, setSuccessDialog] = useState(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditUser, setCreditUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState(100);
  const [viewUser, setViewUser] = useState(null);
  const [formType, setFormType] = useState('admin');
  const [viewMode, setViewMode] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null); 
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [systemPayment, setSystemPayment] = useState({ upi: "", bank: "", ifsc: "", qr_code_url: "", razorpay_link: "" });
  const [rechargeRequests, setRechargeRequests] = useState([]);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    parentage: "",
    dob: "",
    email: "",
    password: "",
    role: "user",
    business_type: "",
    business_name: "",
    gst_number: "",
    phone: "+91",
    address: "",
    security_question: "Favorite color?",
    security_answer: "",
    meta_access_token: "",
    meta_phone_id: "",
    meta_account_id: "",
    subscription_plan: "free",
    subscription_expires_at: "",
    admin_permissions: {
       can_create_accounts: false,
       can_view_only: false,
       can_manage_subscriptions: false,
       full_access: false
    }
  });
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customBusinessType, setCustomBusinessType] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === '#add-admin') {
      setTimeout(() => openAddAdmin(), 100);
      navigate('/master-dashboard', { replace: true });
    } else if (location.hash === '#add-business') {
      setTimeout(() => openAddBusiness(), 100);
      navigate('/master-dashboard', { replace: true });
    } else if (location.hash === '#manage-admins') {
      setTimeout(() => setViewMode('total_admin'), 100);
      navigate('/master-dashboard', { replace: true });
    } else if (location.hash === '#manage-businesses') {
      setTimeout(() => setViewMode('total_biz'), 100);
      navigate('/master-dashboard', { replace: true });
    }
  }, [location.hash, navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/";
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "master_admin") {
      window.location.href = "/";
      return;
    }
    fetchUsers();
    fetchSystemPayment();
    fetchRechargeRequests();
  }, []);

  const fetchSystemPayment = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/master/config/payment`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSystemPayment(data);
      }
    } catch (e) {}
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

  const handleApproveRecharge = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/master/recharge-requests/${id}/approve`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setSuccessDialog("Recharge request approved successfully.");
        fetchRechargeRequests();
        fetchUsers();
      }
    } catch (e) {
      errorNotify("Failed to approve recharge: " + e.message);
    }
  };

  const handleSaveSystemPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/master/config/payment`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(systemPayment)
      });
      if (res.ok) {
        setSuccessDialog("Platform payment settings updated successfully.");
        setIsPaymentModalOpen(false);
        fetchSystemPayment();
      }
    } catch (e) { errorNotify("Failed to update: " + e.message); }
  };

  const handleRejectRecharge = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/master/recharge-requests/${id}/reject`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setSuccessDialog("Recharge request rejected.");
        fetchRechargeRequests();
      }
    } catch (e) {
      errorNotify("Failed to reject recharge: " + e.message);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/master/users`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
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
             setSuccessDialog("User account and related data successfully deleted.");
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
    setConfirmDialog({
      message: "Are you sure you want to reset this user's password?",
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

  const handleTopUp = async () => {
    if (!creditUser || !creditAmount) return;
    try {
      const res = await fetch(`${API_BASE}/api/master/users/${creditUser.id}/credits`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ amount: parseInt(creditAmount) })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessDialog(`Successfully added ${creditAmount} credits to ${creditUser.first_name}'s wallet.`);
        setIsCreditModalOpen(false);
        fetchUsers();
      } else {
        errorNotify(data.error || "Top-up failed.");
      }
    } catch (err) {
      errorNotify("Network Error: " + err.message);
    }
  };

  const openAddAdmin = () => {
    setEditId(null);
    setFormType("admin");
    setShowPassword(false);
    setFormData({
      username: "", first_name: "", last_name: "", parentage: "", dob: "", email: "", password: "", role: "admin_full", business_type: "", business_name: "", gst_number: "",
      phone: "+91", address: "", security_question: "Favorite color?", security_answer: "",
      admin_permissions: { can_create_accounts: true, can_view_only: false, can_manage_subscriptions: false, full_access: true }
    });
    setIsModalOpen(true);
  };

  const openAddBusiness = () => {
    setEditId(null);
    setFormType("business");
    setShowPassword(false);
    setCustomBusinessType("");
    setFormData({
      username: "", first_name: "", last_name: "", parentage: "", dob: "", email: "", password: "", role: "user", business_type: "ecommerce_retail", business_name: "", gst_number: "",
      phone: "+91", address: "", security_question: "Favorite color?", security_answer: "",
      admin_permissions: { can_create_accounts: false, can_view_only: false, can_manage_subscriptions: false, full_access: false }
    });
    setIsModalOpen(true);
  };

  const editAccount = (user) => {
    setEditId(user.id);
    setFormType(user.role === 'user' ? 'business' : 'admin');
    setShowPassword(false);
    
    let defaultBizType = user.business_type || "";
    if (user.role === 'user' && defaultBizType && !['ecommerce_retail', 'restaurant_cafe', 'real_estate', 'healthcare_clinic', 'salon_spa', 'travel_hospitality', 'education_edtech', 'gym_fitness', 'logistics_delivery', 'event_management', 'automobile_dealers', 'finance_insurance', 'home_services', 'b2b_wholesale', 'it_software', 'freelance_consulting'].includes(defaultBizType)) {
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
      role: user.role,
      business_type: defaultBizType,
      business_name: user.business_name || "",
      gst_number: user.gst_number || "",
      phone: user.phone || "",
      address: user.address || "",
      security_question: user.security_question || "Favorite color?",
      security_answer: user.security_answer || "",
      meta_access_token: user.meta_access_token || "",
      meta_phone_id: user.meta_phone_id || "",
      meta_account_id: user.meta_account_id || "",
      subscription_plan: user.subscription_plan || "free",
      subscription_expires_at: user.subscription_expires_at ? user.subscription_expires_at.substring(0, 10) : "",
      admin_permissions: user.admin_permissions || { can_create_accounts: false, can_view_only: false, can_manage_subscriptions: false, full_access: false }
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
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    payload.created_by = storedUser.id;

    if (formType === 'business' && formData.business_type === 'other' && customBusinessType.trim()) {
      payload.business_type = customBusinessType.trim();
    }

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
        setSuccessDialog(editId ? "User profile and settings have been successfully updated!" : "New user successfully registered to the platform!");
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

  const activeBusinesses = users.filter((u) => u.role === "user" && u.status === "active").length;
  const totalBusinesses = users.filter((u) => u.role === "user").length;
  const activeAdmins = users.filter((u) => u.role?.startsWith("admin") && u.status === "active").length;
  const totalAdmins = users.filter((u) => u.role?.startsWith("admin")).length;

  return (
    <div className="flex flex-col h-full space-y-8 p-2">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">Master Control Panel</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest opacity-60 mt-1">Global User, Subscription & System Management</p>
        </div>
        
        <div className="w-full lg:w-auto bg-white border-2 border-slate-100 p-4 lg:p-6 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
           <div className="space-y-2 w-full lg:w-auto">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">System Financial Config</p>
              <div className="flex flex-col sm:flex-row gap-2">
                 <input type="text" placeholder="UPI ID" value={systemPayment.upi} onChange={e => setSystemPayment({...systemPayment, upi: e.target.value})} className="bg-slate-50 border border-slate-100 px-3 py-2 text-[10px] font-bold rounded-xl outline-none w-full sm:w-auto" />
                 <input type="text" placeholder="Account / IFSC" value={systemPayment.bank} onChange={e => setSystemPayment({...systemPayment, bank: e.target.value})} className="bg-slate-50 border border-slate-100 px-3 py-2 text-[10px] font-bold rounded-xl outline-none w-full sm:w-auto" />
                 <input type="text" placeholder="QR Image URL" value={systemPayment.qr_code_url} onChange={e => setSystemPayment({...systemPayment, qr_code_url: e.target.value})} className="bg-slate-50 border border-slate-100 px-3 py-2 text-[10px] font-bold rounded-xl outline-none w-full sm:w-auto" />
                 <input type="text" placeholder="Razorpay Link" value={systemPayment.razorpay_link} onChange={e => setSystemPayment({...systemPayment, razorpay_link: e.target.value})} className="bg-slate-50 border border-slate-100 px-3 py-2 text-[10px] font-bold rounded-xl outline-none w-full sm:w-auto" />
                 <div className="flex gap-2">
                    <button 
                      onClick={async () => {
                         const token = localStorage.getItem("token");
                         await fetch(`${API_BASE}/api/master/config/payment`, {
                            method: 'POST',
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                            body: JSON.stringify(systemPayment)
                         });
                         alert("Payment Config Saved!");
                      }}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all"
                    >Save</button>
                    <button 
                      onClick={() => setIsRechargeModalOpen(true)}
                      className="relative flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2"
                    >
                      Recharge
                      {rechargeRequests.filter(r => r.status === 'PENDING').length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] animate-bounce">{rechargeRequests.filter(r => r.status === 'PENDING').length}</span>
                      )}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <button onClick={openAddAdmin} className="relative overflow-hidden group bg-gradient-to-br from-indigo-900/40 to-[#131A2B] p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/50 transition-all text-left flex items-start justify-between shadow-lg">
            <div>
               <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-400 transition-colors">Add System Admin</h3>
               <p className="text-sm text-slate-400 mt-2">Create a new administrator account with full system access.</p>
            </div>
            <Shield className="w-8 h-8 text-indigo-400 opacity-50" />
         </button>
         <button onClick={openAddBusiness} className="relative overflow-hidden group bg-gradient-to-br from-emerald-900/40 to-[#131A2B] p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all text-left flex items-start justify-between shadow-lg">
            <div>
               <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-400 transition-colors">Add Business</h3>
               <p className="text-sm text-slate-400 mt-2">Register a new business workspace and user account.</p>
            </div>
            <Box className="w-8 h-8 text-emerald-400 opacity-50" />
         </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Businesses', val: activeBusinesses, key: 'active_biz', color: 'emerald', icon: Activity, gradient: 'from-emerald-50/80 to-white hover:from-emerald-100/80', iconColor: 'text-emerald-500' },
          { label: 'Total Businesses', val: totalBusinesses, key: 'total_biz', color: 'blue', icon: Box, gradient: 'from-blue-50/80 to-white hover:from-blue-100/80', iconColor: 'text-blue-500' },
          { label: 'Active Admins', val: activeAdmins, key: 'active_admin', color: 'indigo', icon: Activity, gradient: 'from-indigo-50/80 to-white hover:from-indigo-100/80', iconColor: 'text-indigo-500' },
          { label: 'Total Admins', val: totalAdmins, key: 'total_admin', color: 'purple', icon: Shield, gradient: 'from-purple-50/80 to-white hover:from-purple-100/80', iconColor: 'text-purple-500' }
        ].map(card => (
          <button 
            key={card.key} 
            onClick={() => { setViewMode(viewMode === card.key ? null : card.key); setSearchQuery(""); }} 
            className={`group p-6 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between h-40 ${viewMode === card.key ? `bg-white border-${card.color}-400 ring-4 ring-${card.color}-400/20 shadow-xl scale-105 z-10` : `bg-gradient-to-br ${card.gradient} border-slate-200/60 hover:border-${card.color}-300 hover:shadow-2xl hover:-translate-y-1`} shadow-sm`}
          >
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
            <div className={`absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r from-${card.color}-400 to-${card.color}-600 transform origin-left transition-transform duration-300 ${viewMode === card.key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></div>
          </button>
        ))}
      </div>

      <div className="relative w-full bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[1200px] animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-500" />
              {viewMode ? viewMode.replace('_',' ') : 'Global Platform'} Directory
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-700 focus:border-emerald-500/50 outline-none transition-all"
             />
          </div>
          {viewMode && (
            <button onClick={() => setViewMode(null)} className="text-slate-500 hover:text-slate-900 transition-colors">
              <X className="w-6 h-6 border border-slate-200 rounded-lg p-1 hover:bg-slate-100" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                if (!viewMode) matchCategory = true;
                else if (viewMode === 'active_biz') matchCategory = (u.role === 'user' && u.status === 'active');
                else if (viewMode === 'total_biz') matchCategory = (u.role === 'user');
                else if (viewMode === 'active_admin') matchCategory = (u.role?.startsWith('admin') && u.status === 'active');
                else if (viewMode === 'total_admin') matchCategory = (u.role?.startsWith('admin'));
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
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border inline-block w-fit ${u.role === 'user' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5'}`}>
                          {u.role === 'user' ? 'Business' : 'Admin'}
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
                      <button 
                        onClick={() => { setViewUser(u); setIsViewModalOpen(true); }}
                        className="p-2.5 bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                        title="View Full Profile"
                      >
                         <Eye className="w-4 h-4" />
                      </button>
                      {u.role === 'user' && (
                         <>
                           <button 
                             onClick={() => {
                               sessionStorage.setItem("impersonate_id", u.id);
                               sessionStorage.setItem("impersonate_name", u.business_name || u.username);
                               window.location.href = "/dashboard";
                             }} 
                             className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-400 hover:text-indigo-600 transition-colors" 
                             title="Visit Dashboard"
                           >
                              <LayoutDashboard className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => { setCreditUser(u); setCreditAmount(100); setIsCreditModalOpen(true); }}
                             className="p-2 hover:bg-amber-50 rounded-lg text-amber-400 hover:text-amber-600 transition-colors"
                             title="Add Credits Manually"
                           >
                              <Coins className="w-4 h-4" />
                           </button>
                         </>
                      )}
                      <button onClick={() => editAccount(u)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors" title="Edit Account"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => toggleStatus(u.id)} className={`p-2.5 rounded-xl transition-all ${u.status === 'active' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`} title="Toggle Access"><Activity className="w-4 h-4" /></button>
                      <button onClick={() => deleteUser(u.id)} className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/30 rounded-xl transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
           <span className="text-xs text-slate-500 font-medium tracking-wide">Showing results for {viewMode ? viewMode.replace('_',' ') : 'Global Platform'} category.</span>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {isViewModalOpen && viewUser && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsViewModalOpen(false)} />
          <div className="relative w-[90vw] max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
            <div className="w-full md:w-[35%] bg-white border-r border-slate-200 flex flex-col items-center justify-center py-12 px-6 relative shrink-0">
               <button onClick={() => setIsViewModalOpen(false)} className="md:hidden absolute top-6 right-6 text-slate-500 hover:text-slate-900 p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
               <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-900 mb-6 border-4 border-slate-300">
                  <User className="w-12 h-12" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter text-center">{viewUser.first_name} {viewUser.last_name || ''}</h3>
               <p className="text-emerald-400 font-mono text-sm mt-2 font-medium">@{viewUser.username || 'no-handle'}</p>
               <div className="mt-8 bg-slate-100/50 w-full p-4 rounded-xl border border-slate-200 text-center">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 mt-1">Classification</p>
                   <p className="text-sm font-black uppercase text-slate-900 tracking-widest">{viewUser.role.replace('_',' ')}</p>
               </div>
            </div>
            <div className="w-full md:w-[65%] p-8 lg:p-12 flex flex-col overflow-y-auto relative">
               <button onClick={() => setIsViewModalOpen(false)} className="hidden md:block absolute top-6 right-6 text-slate-400 hover:text-slate-900 p-1 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-6 h-6" /></button>
               <h4 className="text-lg font-extrabold text-slate-800 tracking-tight mb-6 flex items-center gap-2">
                 <Activity className="w-5 h-5 text-emerald-500" /> Identity Details
               </h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Address</p>
                      <p className="text-sm text-slate-800 font-bold truncate">{viewUser.email}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone Number</p>
                      <p className="text-sm text-slate-800 font-bold">{viewUser.phone || 'N/A'}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 truncate sm:col-span-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Address</p>
                      {viewUser.address || 'Not specified'}
                   </div>
                   {viewUser.role === 'user' && (
                     <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200 sm:col-span-2 mt-2">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-white rounded-lg text-indigo-500"><Building2 className="w-5 h-5" /></div>
                           <div className="flex flex-col gap-1 w-full">
                              <p className="text-[10px] text-indigo-500/80 font-bold uppercase tracking-widest">Business Information</p>
                              <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
                                  <div>
                                     <p className="text-[10px] uppercase text-indigo-400 font-bold">Trading As</p>
                                     <p className="text-sm font-black text-indigo-700">{viewUser.business_name || 'Not provided'}</p>
                                  </div>
                                  <div>
                                     <p className="text-[10px] uppercase text-indigo-400 font-bold">Vertical</p>
                                     <p className="text-sm font-black uppercase text-indigo-700">{viewUser.business_type}</p>
                                  </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
               </div>
            </div>
          </div>
        </div>
      , document.body)}

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-[90vw] max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-white text-slate-900 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editId ? 'Edit' : 'Add'} {formType === 'admin' ? 'System Administrator' : 'Business User'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-slate-100 p-1 rounded-lg"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSaveAccount} className="p-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">First Name</label>
                  <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Username</label>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone (with country code)</label>
                  <input required placeholder="+91 XXXX..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 p-3 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Date of Birth</label>
                  <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 p-3 rounded-xl" />
                </div>
                {!editId && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                    <input type="password" required={!editId} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 p-3 rounded-xl" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Role / Vertical</label>
                  <select value={formType === 'admin' ? formData.role : formData.business_type} onChange={e => setFormData({...formData, [formType === 'admin' ? 'role' : 'business_type']: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 p-3 rounded-xl">
                    {formType === 'admin' ? (
                      <>
                        <option value="admin_full">Full Administrator</option>
                        <option value="admin_partner">Regional Partner</option>
                        <option value="admin_support">Support Manager</option>
                      </>
                    ) : (
                      <>
                        <option value="restaurant_cafe">Restaurant & Cafe</option>
                        <option value="retail_store">Retail Store</option>
                        <option value="healthcare">Healthcare / Clinic</option>
                        <option value="real_estate">Real Estate</option>
                      </>
                    )}
                  </select>
                </div>
                {formType === 'user' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Plan Tier</label>
                      <select value={formData.subscription_plan} onChange={e => setFormData({...formData, subscription_plan: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 p-3 rounded-xl">
                        <option value="free">Free Tier</option>
                        <option value="pro">Pro Plan</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Expires At</label>
                        <input type="date" value={formData.subscription_expires_at} onChange={e => setFormData({...formData, subscription_expires_at: e.target.value})} className="border border-slate-200 outline-none focus:border-emerald-500 p-3 rounded-xl" />
                      </div>

                      <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-5 group">
                           <div className="col-span-full flex items-center gap-2 mb-1">
                              <Shield className="w-4 h-4 text-indigo-500" />
                              <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-wider">WhatsApp official API Credentials</h4>
                           </div>
                           <div className="flex flex-col gap-1">
                             <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest pl-1">Meta Phone ID</label>
                             <input placeholder="10459..." value={formData.meta_phone_id} onChange={e => setFormData({...formData, meta_phone_id: e.target.value})} className="border border-indigo-100 outline-none focus:border-indigo-500 p-3 rounded-xl bg-white" />
                           </div>
                           <div className="flex flex-col gap-1">
                             <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest pl-1">Meta Access Token</label>
                             <input placeholder="EAAI..." value={formData.meta_access_token} onChange={e => setFormData({...formData, meta_access_token: e.target.value})} className="border border-indigo-100 outline-none focus:border-indigo-500 p-3 rounded-xl bg-white" />
                           </div>
                        </div>
                      </div>
                    </>
                  )}
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={formLoading} className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg">Save Configuration</button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {isErrorModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-rose-950/20 backdrop-blur-sm" onClick={() => setIsErrorModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 text-center text-slate-900 border border-slate-200">
             <Shield className="w-12 h-12 text-rose-500 mx-auto mb-4" />
             <h3 className="text-xl font-black mb-2">Operation Failed</h3>
             <p className="text-sm text-slate-500 mb-8">{errorMsg}</p>
             <button onClick={() => setIsErrorModalOpen(false)} className="w-full bg-rose-500 text-white font-bold py-4 rounded-2xl">Acknowledge</button>
          </div>
        </div>
      )}

      {successDialog && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm" onClick={() => setSuccessDialog(null)} />
           <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 text-center text-slate-900 border border-slate-200">
              <Activity className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2">Success</h3>
              <p className="text-sm text-slate-500 mb-8">{successDialog}</p>
              <button onClick={() => setSuccessDialog(null)} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl">Awesome</button>
           </div>
         </div>
      , document.body)}

      {confirmDialog && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setConfirmDialog(null)} />
           <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 text-center text-slate-900 border border-slate-200">
              <HelpCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2">Wait a second...</h3>
              <p className="text-sm text-slate-500 mb-8">{confirmDialog.message}</p>
              <div className="flex gap-3">
                 <button onClick={() => setConfirmDialog(null)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-bold">Cancel</button>
                 <button onClick={confirmDialog.onConfirm} className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-bold">{confirmDialog.actionText}</button>
              </div>
           </div>
         </div>
      , document.body)}

      {isCreditModalOpen && creditUser && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsCreditModalOpen(false)} />
           <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
              <div className="p-8 text-center">
                 <div className="w-20 h-20 bg-amber-50 rounded-2.5xl flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-inner">
                    <Coins className="w-10 h-10" />
                 </div>
                 <h3 className="text-2xl font-black tracking-tight mb-2">Recharge Wallet</h3>
                 <p className="text-sm text-slate-500 font-medium mb-8 italic">Recharging {creditUser.first_name}'s broadcast balance.</p>
                 <div className="space-y-4 mb-10">
                    <div className="flex flex-col text-left">
                       <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 ml-4">Credit Amount</label>
                       <input 
                          type="number" 
                          value={creditAmount} 
                          onChange={e => setCreditAmount(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 font-black text-3xl outline-none focus:border-amber-500 transition-all text-center tracking-tighter"
                       />
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => { setSystemPayment(systemPayment); setIsPaymentModalOpen(true); }}
                      className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center gap-2"
                    >
                       <Landmark className="w-4 h-4" /> Platform Payment Config
                    </button>
                    <button onClick={() => setIsRechargeModalOpen(true)} className="px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-amber-500 hover:text-amber-500 transition-all flex items-center gap-2 relative">
                    </button>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setIsCreditModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-5 rounded-3xl transition-all uppercase tracking-widest text-xs">Dismiss</button>
                    <button onClick={handleTopUp} className="flex-1 bg-amber-500 hover:bg-amber-600 shadow-xl shadow-amber-200 text-white font-black py-5 rounded-3xl transition-all uppercase tracking-widest text-xs">Confirm</button>
                 </div>
              </div>
           </div>
         </div>
      , document.body)}

      {isRechargeModalOpen && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsRechargeModalOpen(false)} />
           <div className="relative w-[90vw] max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center z-10 relative">
                 <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                   <Coins className="w-6 h-6 text-amber-500" /> Wallet Recharge Requests
                 </h2>
                 <button onClick={() => setIsRechargeModalOpen(false)} className="hover:bg-slate-200 p-1 rounded-lg text-slate-500"><X className="w-6 h-6"/></button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-slate-100/50">
                 {rechargeRequests.length === 0 ? (
                   <p className="text-center text-slate-400 font-bold py-10">No recharge requests found.</p>
                 ) : rechargeRequests.map(req => (
                   <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col gap-1">
                         <span className="font-black text-slate-800 text-lg tracking-tight">{req.name || req.username} <span className="text-slate-400 text-sm font-bold ml-2">({req.email})</span></span>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">Requested: {req.credits_requested.toLocaleString()} Credits</span>
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">Amount: ₹{req.plan_amount}</span>
                         </div>
                         <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                             Transaction UTR: <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{req.transaction_id}</span>
                         </div>
                         <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">{new Date(req.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         {req.status === 'PENDING' ? (
                           <>
                             <button onClick={() => handleApproveRecharge(req.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all">Approve</button>
                             <button onClick={() => handleRejectRecharge(req.id)} className="bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all">Reject</button>
                           </>
                         ) : (
                           <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                             {req.status}
                           </span>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         </div>
       , document.body)}

      {isPaymentModalOpen && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)} />
           <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Landmark className="w-6 h-6 text-emerald-500" /> Platform Payment Config
                 </h3>
                 <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X /></button>
              </div>
              <form onSubmit={handleSaveSystemPayment} className="p-8 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform UPI ID</label>
                       <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold" value={systemPayment.upi} onChange={e => setSystemPayment({...systemPayment, upi: e.target.value})} placeholder="sasloop@upi" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Razorpay Payment Page</label>
                       <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold" value={systemPayment.razorpay_link} onChange={e => setSystemPayment({...systemPayment, razorpay_link: e.target.value})} placeholder="https://rzp.io/l/..." />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bank Account</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" value={systemPayment.bank} onChange={e => setSystemPayment({...systemPayment, bank: e.target.value})} placeholder="Acc No: 1234..." />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">IFSC Code</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold" value={systemPayment.ifsc} onChange={e => setSystemPayment({...systemPayment, ifsc: e.target.value})} placeholder="SBIN00..." />
                    </div>
                    <div className="col-span-full space-y-1.5">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment QR URL (Direct Image)</label>
                       <div className="relative">
                          <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold" value={systemPayment.qr_code_url} onChange={e => setSystemPayment({...systemPayment, qr_code_url: e.target.value})} placeholder="https://..." />
                       </div>
                    </div>
                 </div>
                 <div className="pt-6">
                    <button type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Apply Global Settings</button>
                 </div>
              </form>
           </div>
         </div>
      , document.body)}
}

    </div>
  );
}

export default MasterAdminPanel;
