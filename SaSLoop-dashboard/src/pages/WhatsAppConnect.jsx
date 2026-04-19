import React, { useState, useEffect } from "react";
import API_BASE from "../config";
import { Shield, Save, Key, Phone, CheckCircle2, Building2, User } from "lucide-react";

function WhatsAppConnect() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  
  const [config, setConfig] = useState({
    meta_access_token: "",
    meta_phone_id: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setSelectedUserId(u.id); // default to self
      if (u.role === 'master_admin' || u.role?.startsWith('admin')) {
         fetchBusinesses(u.id, u.role);
      }
    }
    fetchConfig();
  }, []);

  // When selected user changes, reload config
  useEffect(() => {
     if (selectedUserId) {
        fetchConfig(selectedUserId);
     }
  }, [selectedUserId]);

  const fetchBusinesses = async (adminId, role) => {
    try {
      const token = localStorage.getItem("token");
      // If master admin, fetch ALL, else fetch only OWN
      const endpoint = role === 'master_admin' 
        ? `${API_BASE}/api/master/users` 
        : `${API_BASE}/api/master/admin/my-users?admin_id=${adminId}`;
      
      const res = await fetch(endpoint, {
         headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
         const data = await res.json();
         // Filter only 'user' role businesses
         const filtered = data.filter(b => b.role === 'user');
         setBusinesses(filtered);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const fetchConfig = async (targetId) => {
    try {
      const token = localStorage.getItem("token");
      if(!token) return;
      const id = targetId || JSON.parse(localStorage.getItem("user")).id;
      const res = await fetch(`${API_BASE}/api/whatsapp/config?target_user_id=${id}`, {
         headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
         const data = await res.json();
         setConfig({
            meta_access_token: data.meta_access_token || "",
            meta_phone_id: data.meta_phone_id || ""
         });
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/whatsapp/config`, {
         method: "POST",
         headers: { 
             "Authorization": `Bearer ${token}`,
             "Content-Type": "application/json"
         },
         body: JSON.stringify({
            ...config,
            target_user_id: selectedUserId
         })
      });
      
      if (res.ok) {
         setSaved(true);
         setTimeout(() => setSaved(false), 3000);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'master_admin' || user?.role?.startsWith('admin');

  return (
    <div className="flex flex-col space-y-8 p-4 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-500" /> WhatsApp API Hub
          </h2>
          <p className="text-slate-500 mt-2 text-base font-medium">
            Centrally manage Meta developer keys for your infrastructure and business clients.
          </p>
        </div>

        {isAdmin && (
           <div className="w-full md:w-72">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Configuration Target</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building2 className="w-4 h-4 text-slate-400" />
                 </div>
                 <select 
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-sm text-slate-700 shadow-sm transition-all"
                 >
                    <option value={user.id}>Principal Admin Bot</option>
                    <optgroup label="Managed Businesses">
                       {businesses.map(b => (
                          <option key={b.id} value={b.id}>{b.business_name || b.username || b.email}</option>
                       ))}
                    </optgroup>
                 </select>
              </div>
           </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative">
        {/* Visual context indicator */}
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <Building2 className="w-32 h-32" />
        </div>

        <form onSubmit={handleSave} className="space-y-6 relative z-10">
            <div className="flex items-center gap-3 mb-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
               <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                  <User className="w-4 h-4" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Editing Credentials For</p>
                  <p className="text-sm font-black text-slate-700">
                     {selectedUserId === user?.id ? "Principal Admin Instance" : (businesses.find(b => b.id.toString() === selectedUserId.toString())?.business_name || "Business Workspace")}
                  </p>
               </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                 <Key className="w-4 h-4 text-indigo-500" /> Meta User Access Token
              </label>
              <textarea 
                required
                rows={3}
                placeholder="EAAI..."
                value={config.meta_access_token}
                onChange={(e) => setConfig({...config, meta_access_token: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm text-slate-700 custom-scrollbar shadow-inner"
              />
              <p className="text-xs text-slate-500 mt-2">Required to authorize API calls. We recommend using a Permanent System User token.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                 <Phone className="w-4 h-4 text-indigo-500" /> Phone Number ID
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. 104598273618392"
                value={config.meta_phone_id}
                onChange={(e) => setConfig({...config, meta_phone_id: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm text-slate-700 shadow-inner"
              />
              <p className="text-xs text-slate-500 mt-2">Target ID for the WhatsApp number used by this specific business.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-500">
                    {saved && <span className="flex items-center gap-2 text-emerald-600 animate-bounce"><CheckCircle2 className="w-5 h-5" /> Config Synced</span>}
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-slate-900 hover:bg-black text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center gap-2 disabled:opacity-70 group"
                >
                  <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {loading ? 'Processing...' : 'Deploy Credentials'}
                </button>
            </div>
        </form>
      </div>
      
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-emerald-800">
         <h4 className="font-bold flex items-center gap-2 mb-2"><CheckCircle2 className="w-5 h-5" /> Secure Storage</h4>
         <p className="text-sm font-medium">
             Your access tokens are encrypted and securely stored in your dedicated database instance. We use these keys solely to handle inbound/outbound official WhatsApp traffic.
         </p>
      </div>

    </div>
  );
}

export default WhatsAppConnect;
