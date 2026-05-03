import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Shield, User,
  Users
} from "lucide-react";
import API_BASE, { isMobileDevice } from "../config";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const isMobile = isMobileDevice();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
    permissions: {
      can_view_orders: true,
      can_view_waiter_calls: true,
      can_view_inventory: false,
      can_view_reports: false
    }
  });

  const roles = [
    { id: 'manager', label: 'Manager', desc: 'Full operational control' },
    { id: 'cashier', label: 'Cashier', desc: 'Billing & POS checkout' },
    { id: 'waiter', label: 'Waiter', desc: 'Table orders & service' },
    { id: 'rider', label: 'Rider', desc: 'Delivery partner app access' },
    { id: 'sasloop_admin', label: 'SaSLoop Admin', desc: 'Platform god mode access' },
    { id: 'sasloop_support', label: 'SaSLoop Support', desc: 'Read-only platform support' }
  ];

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/business/staff`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/business/staff`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddForm(false);
        setFormData({ ...formData, name: "", email: "", password: "", phone: "", pos_pin: "" });
        fetchStaff();
      } else {
        window.alert(data.error || "Failed to add staff");
      }
    } catch (e) { 
      console.error(e);
      window.alert("Connection error. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this staff member?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/api/business/staff/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchStaff();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="h-full flex items-center justify-center p-20 animate-pulse text-slate-400 font-black uppercase text-xs">Loading Staff Records...</div>;

  return (
    <div className={`max-w-[1280px] mx-auto w-full pt-4 pb-20 ${isMobile ? 'px-4' : 'px-6'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic underline decoration-indigo-500">
             Team & Staff
          </h2>
          <p className="text-slate-500 text-sm font-bold opacity-50 uppercase tracking-widest mt-1">Manage sub-accounts and permissions</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${showAddForm ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white shadow-indigo-200'}`}
        >
          {showAddForm ? 'Cancel' : <><Plus className="w-4 h-4 inline mr-2" /> Create Staff Account</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* STAFF LIST */}
          <div className="lg:col-span-2 space-y-6">
              {staff.map(s => (
                <div key={s.id} className="bg-white rounded-[2.5rem] border-2 border-slate-50 p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                   <div className="absolute left-0 top-0 w-2 h-full bg-indigo-500 opacity-20" />
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                            <User className="w-8 h-8" />
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{s.name}</h3>
                            <div className="flex items-center gap-4">
                               <p className="text-xs font-bold text-slate-400">{s.email}</p>
                               <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{s.role.replace('staff_', '')}</span>
                               {s.pos_pin && (
                                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 ml-2">PIN: {s.pos_pin}</span>
                               )}
                            </div>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => handleDelete(s.id)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                      </div>
                   </div>
                </div>
              ))}
              {staff.length === 0 && (
                <div className="py-24 flex flex-col items-center justify-center text-slate-200 opacity-50 border-2 border-dashed border-slate-100 rounded-[3rem]">
                   <Users className="w-20 h-20 mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">No staff accounts created yet</p>
                </div>
              )}
          </div>

          {/* ADD FORM (SIDEBAR STYLE) */}
          {showAddForm && (
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-right duration-300 h-fit sticky top-6">
               <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-8 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-indigo-400" /> New Account
               </h3>
               <form onSubmit={handleAdd} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                     <input 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-indigo-500" 
                        placeholder="e.g. John Waiter" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Staff Email</label>
                     <input 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-indigo-500" 
                        placeholder="staff@restaurant.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Staff Password</label>
                     <input 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-indigo-500" 
                        type="password" placeholder="Dashboard password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">POS Phone</label>
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-indigo-500" 
                            placeholder="+91..." value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">POS 4-Digit PIN</label>
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-indigo-500" 
                            placeholder="1234" maxLength="4" value={formData.pos_pin || ""} onChange={e => setFormData({...formData, pos_pin: e.target.value})} required
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Access Role</label>
                     <div className="grid grid-cols-1 gap-3">
                        {roles.map(r => (
                           <button 
                             key={r.id} type="button" onClick={() => setFormData({...formData, role: r.id})}
                             className={`p-5 rounded-[1.8rem] border-2 text-left transition-all relative overflow-hidden group/role ${formData.role === r.id ? 'bg-[#1e293b] border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-[#0f172a] border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'}`}
                           >
                              {formData.role === r.id && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                              )}
                              <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${formData.role === r.id ? 'text-white' : 'text-slate-400'}`}>{r.label}</p>
                              <p className={`text-[9px] font-medium ${formData.role === r.id ? 'text-slate-400' : 'text-slate-500'}`}>{r.desc}</p>
                           </button>
                        ))}
                     </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_10px_25px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_35px_rgba(79,70,229,0.4)] active:scale-[0.98] transition-all mt-6 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Generate Account
                  </button>
               </form>
            </div>
          )}

      </div>
    </div>
  );
};

export default StaffManagement;
