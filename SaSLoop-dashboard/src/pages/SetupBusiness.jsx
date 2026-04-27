import { useState, useEffect } from "react";
import API_BASE from "../config";
import { 
  Store, Phone, MapPin, Loader2, Clock, Settings, 
  Truck, Coffee, Car, ShoppingCart, Stethoscope, Scissors,
  CheckCircle2, AlertCircle, Sparkles, Globe, ListPlus, ToggleRight,
  Upload, Image, Link2, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;

function SetupBusiness() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "+91",
    address: "",
    businessType: "restaurant_cafe",
    notification_numbers: [],
    kitchen_number: "",
    track_inventory: false,
    low_stock_threshold: 5,
    currency_code: "INR",
    logo_url: "",
    banner_url: "",
    social_instagram: "",
    social_facebook: "",
    social_twitter: "",
    social_youtube: "",
    social_website: "",
      settings: {
        openingTime: "09:00",
        closingTime: "22:00",
        homeDelivery: false,
        dining: false,
        tableBooking: false,
        appointments: false,
        salonBooking: false,
        statusPrompt: "",
        customCategoryLabel: "Menu",
        upi_id: "",
        accepted_payment_methods: { cash: true, upi: true },
        google_review_link: "",
        custom_payment_link: ""
      }
  });

  const [notifInput, setNotifInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const targetUserId = sessionStorage.getItem("impersonate_id");
      const targetParam = targetUserId ? `?target_user_id=${targetUserId}` : "";
      
      const res = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.hasBusiness && data.business) {
        setFormData({
          name: data.business.name || "",
          phone: data.business.phone || "",
          address: data.business.address || "",
          businessType: data.business.business_type || "restaurant_cafe",
          notification_numbers: data.business.notification_numbers || [],
          kitchen_number: data.business.kitchen_number || "",
          track_inventory: data.business.track_inventory || false,
          low_stock_threshold: data.business.low_stock_threshold || 5,
          currency_code: data.business.currency_code || "INR",
          logo_url: data.business.logo_url || "",
          banner_url: data.business.banner_url || "",
          social_instagram: data.business.social_instagram || "",
          social_facebook: data.business.social_facebook || "",
          social_twitter: data.business.social_twitter || "",
          social_youtube: data.business.social_youtube || "",
          social_website: data.business.social_website || "",
          settings: {
            openingTime: "09:00",
            closingTime: "22:00",
            homeDelivery: false,
            dining: false,
            tableBooking: false,
            appointments: false,
            salonBooking: false,
            statusPrompt: "",
            upi_id: "",
            accepted_payment_methods: { cash: true, upi: true },
            google_review_link: "",
            custom_payment_link: "",
            ...(data.business.settings || {})
          }
        });
      }
    } catch (err) { console.error(err); }
  };

  const handleAddNotif = () => {
     if (!notifInput.trim()) return;
     setFormData(prev => ({
        ...prev,
        notification_numbers: [...prev.notification_numbers, notifInput.trim()]
     }));
     setNotifInput("");
  };

  const removeNotif = (idx) => {
     setFormData(prev => ({
        ...prev,
        notification_numbers: prev.notification_numbers.filter((_, i) => i !== idx)
     }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/catalog/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, logo_url: data.url }));
      }
    } catch (err) {
      console.error("Logo upload failed:", err);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/catalog/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, banner_url: data.url }));
      }
    } catch (err) {
      console.error("Banner upload failed:", err);
    } finally {
      setBannerUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    try {
      const token = localStorage.getItem("token");
      const targetUserId = sessionStorage.getItem("impersonate_id");
      const payload = { ...formData };
      if (targetUserId) {
         payload.target_user_id = targetUserId;
      }
      
      const res = await fetch(`${API_BASE}/api/business/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const logoPreview = formData.logo_url ? (formData.logo_url.startsWith("http") ? formData.logo_url : `${API_BASE}${formData.logo_url}`) : null;
  const bannerPreview = formData.banner_url ? (formData.banner_url.startsWith("http") ? formData.banner_url : `${API_BASE}${formData.banner_url}`) : null;

  return (
    <div className="min-h-full bg-slate-50 flex flex-col items-center py-6 px-4">
      
      <div className="max-w-4xl w-full text-center mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-5xl">Business Setup</h1>
        <p className="mt-2 text-slate-500 font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2">
           <Store className="w-4 h-4 text-emerald-500" /> Configure Your Profile
        </p>
      </div>

      <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl border border-slate-200 flex flex-col md:flex-row h-auto overflow-visible">
         
         <div className="w-full md:w-[320px] bg-slate-900 p-8 flex flex-col justify-between relative overflow-visible rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10">
               <div className="space-y-8">
                  {[
                    { n: 1, t: "Identity", s: "Brand & Logo" },
                    { n: 2, t: "Industry", s: "Catalog Type" },
                    { n: 3, t: "Logic", s: "Operation Rules" },
                    { n: 4, t: "Scaling", s: "Staff & Inventory" },
                    { n: 5, t: "Social", s: "Links & Presence" }
                  ].map((s) => (
                    <div key={s.n} className={`flex items-start gap-5 transition-all cursor-pointer ${step === s.n ? 'opacity-100 translate-x-2' : 'opacity-40'}`} onClick={() => setStep(s.n)}>
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${step === s.n ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/10 text-white/50'}`}>{s.n}</div>
                       <div><p className="text-white font-bold text-sm mb-1">{s.t}</p><p className="text-white/50 text-[9px] uppercase font-bold tracking-widest">{s.s}</p></div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="flex-1 p-6 sm:p-14 bg-white relative h-auto">
            
            {/* Step 1: Identity + Logo */}
            {step === 1 && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Business Identity</h2>
                  <div className="space-y-6">
                     {/* Logo Upload */}
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Business Logo</label>
                        <div className="flex items-center gap-5">
                           <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                              {logoPreview ? (
                                 <>
                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                    <button onClick={() => setFormData(prev => ({...prev, logo_url: ""}))} className="absolute top-1 right-1 w-5 h-5 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3 text-white" /></button>
                                 </>
                              ) : (
                                 <Image className="w-8 h-8 text-slate-300" />
                              )}
                           </div>
                           <div>
                              <label className="cursor-pointer inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-200 active:scale-95">
                                 {logoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                 {logoUploading ? "Uploading..." : "Upload Logo"}
                                 <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                              </label>
                              <p className="text-[9px] text-slate-400 mt-2 font-medium">PNG, JPG up to 2MB. Shows on your digital menu.</p>
                           </div>
                        </div>
                     </div>
                     
                     {/* Banner Upload */}
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Menu Banner</label>
                        <div className="flex flex-col gap-4">
                           <div className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                              {bannerPreview ? (
                                 <>
                                    <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                                    <button onClick={() => setFormData(prev => ({...prev, banner_url: ""}))} className="absolute top-2 right-2 w-7 h-7 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4 text-white" /></button>
                                 </>
                              ) : (
                                 <Image className="w-8 h-8 text-slate-300" />
                              )}
                           </div>
                           <div>
                              <label className="cursor-pointer inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-200 active:scale-95">
                                 {bannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                 {bannerUploading ? "Uploading..." : "Upload Banner"}
                                 <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                              </label>
                              <p className="text-[9px] text-slate-400 mt-2 font-medium">Recommended size: 1200x400px. Appears at the top of your public menus.</p>
                           </div>
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Brand Name</label>
                        <input type="text" className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-emerald-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary WhatsApp</label>
                        <input type="tel" className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-emerald-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                     </div>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 transition-all active:scale-[0.98]">Configure Industry Type</button>
               </div>
            )}

            {/* Step 2: Industry */}
            {step === 2 && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Select Industry</h2>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                        { id: 'restaurant_cafe', t: 'Dining', icon: Coffee, desc: 'Food & Beverage' },
                        { id: 'retail_store', t: 'Retail', icon: ShoppingCart, desc: 'Products & Sales' },
                        { id: 'healthcare_clinic', t: 'Medical', icon: Stethoscope, desc: 'Health & Wellness' },
                        { id: 'salon_spa', t: 'Salon', icon: Scissors, desc: 'Grooming & Style' },
                        { id: 'real_estate', t: 'Property', icon: MapPin, desc: 'Buying & Selling' },
                        { id: 'other', t: 'Other', icon: Sparkles, desc: 'General Service' }
                     ].map((ind) => (
                        <button 
                           key={ind.id}
                           onClick={() => setFormData({...formData, businessType: ind.id})}
                           className={`p-6 rounded-[2rem] border-2 text-left transition-all ${formData.businessType === ind.id ? 'border-emerald-600 bg-emerald-50 shadow-lg' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}
                        >
                           <ind.icon className={`w-8 h-8 mb-4 ${formData.businessType === ind.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                           <p className={`font-black uppercase text-xs tracking-widest ${formData.businessType === ind.id ? 'text-emerald-600' : 'text-slate-800'}`}>{ind.t}</p>
                           <p className="text-[10px] text-slate-400 font-bold mt-1">{ind.desc}</p>
                        </button>
                     ))}
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => setStep(1)} type="button" className="px-8 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest">Back</button>
                     <button onClick={() => setStep(3)} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 transition-all">Define Live Rules</button>
                  </div>
               </div>
            )}

            {/* Step 3: Operation Logic */}
            {step === 3 && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Operation Logic</h2>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Opening Time</label>
                        <input type="time" className="w-full bg-slate-50 border-2 rounded-2xl px-4 py-3 font-bold" value={formData.settings.openingTime} onChange={e => setFormData({...formData, settings: {...formData.settings, openingTime: e.target.value}})} />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Closing Time</label>
                        <input type="time" className="w-full bg-slate-50 border-2 rounded-2xl px-4 py-3 font-bold" value={formData.settings.closingTime} onChange={e => setFormData({...formData, settings: {...formData.settings, closingTime: e.target.value}})} />
                     </div>
                  </div>
                  
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Business UPI ID (For Payments)</label>
                     <input type="text" placeholder="e.g. yourbusiness@upi" className="w-full bg-slate-50 border-2 rounded-2xl px-4 py-3 font-bold" value={formData.settings.upi_id || ''} onChange={e => setFormData({...formData, settings: {...formData.settings, upi_id: e.target.value}})} />
                     <p className="text-[8px] text-slate-400 mt-2 italic font-bold">This UPI ID will be sent to customers to collect payments via WhatsApp.</p>
                  </div>
                  
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Custom Payment Link (Razorpay, Stripe, etc.)</label>
                     <input type="url" placeholder="https://rzp.io/l/..." className="w-full bg-slate-50 border-2 rounded-2xl px-4 py-3 font-bold" value={formData.settings.custom_payment_link || ''} onChange={e => setFormData({...formData, settings: {...formData.settings, custom_payment_link: e.target.value}})} />
                     <p className="text-[8px] text-slate-400 mt-2 italic font-bold">If provided, this link will be used instead of UPI for online payments.</p>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Accepted Payment Methods</p>
                     <button onClick={() => setFormData({...formData, settings: {...formData.settings, accepted_payment_methods: {...(formData.settings.accepted_payment_methods || {}), cash: !(formData.settings.accepted_payment_methods?.cash)}}})} type="button" className={`w-full p-5 rounded-2xl border-2 font-bold text-sm flex justify-between items-center transition-all ${formData.settings.accepted_payment_methods?.cash ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-800'}`}>
                        Cash on Delivery (COD) {formData.settings.accepted_payment_methods?.cash ? <ToggleRight className="w-6 h-6" /> : <Settings className="w-5 h-5 text-slate-300" />}
                     </button>
                     <button onClick={() => setFormData({...formData, settings: {...formData.settings, accepted_payment_methods: {...(formData.settings.accepted_payment_methods || {}), upi: !(formData.settings.accepted_payment_methods?.upi)}}})} type="button" className={`w-full p-5 rounded-2xl border-2 font-bold text-sm flex justify-between items-center transition-all ${formData.settings.accepted_payment_methods?.upi ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-800'}`}>
                        Prepaid / UPI / Online {formData.settings.accepted_payment_methods?.upi ? <ToggleRight className="w-6 h-6" /> : <Settings className="w-5 h-5 text-slate-300" />}
                     </button>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Enable Features</p>
                     {formData.businessType === 'restaurant_cafe' && (
                        <>
                           <button onClick={() => setFormData({...formData, settings: {...formData.settings, homeDelivery: !formData.settings.homeDelivery}})} type="button" className={`w-full p-5 rounded-2xl border-2 font-bold text-sm flex justify-between items-center transition-all ${formData.settings.homeDelivery ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-800'}`}>
                              Home Delivery {formData.settings.homeDelivery ? <ToggleRight className="w-6 h-6" /> : <Settings className="w-5 h-5 text-slate-300" />}
                           </button>
                           <button onClick={() => setFormData({...formData, settings: {...formData.settings, dining: !formData.settings.dining}})} type="button" className={`w-full p-5 rounded-2xl border-2 font-bold text-sm flex justify-between items-center transition-all ${formData.settings.dining ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-800'}`}>
                              Dine-in Support {formData.settings.dining ? <ToggleRight className="w-6 h-6" /> : <Settings className="w-5 h-5 text-slate-300" />}
                           </button>
                        </>
                     )}
                     {formData.businessType === 'healthcare_clinic' && (
                        <button onClick={() => setFormData({...formData, settings: {...formData.settings, appointments: !formData.settings.appointments}})} type="button" className={`w-full p-5 rounded-2xl border-2 font-bold text-sm flex justify-between items-center transition-all ${formData.settings.appointments ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-800'}`}>
                           Book Appointments {formData.settings.appointments ? <ToggleRight className="w-6 h-6" /> : <Settings className="w-5 h-5 text-slate-300" />}
                        </button>
                     )}
                     <p className="text-[9px] text-slate-400 italic">More rule configurations available in Dashboard after setup.</p>
                  </div>

                  <div className="flex gap-4">
                     <button onClick={() => setStep(2)} type="button" className="px-8 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest">Back</button>
                     <button onClick={() => setStep(4)} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 transition-all">Infrastructure Setup</button>
                  </div>
               </div>
            )}

            {/* Step 4: Staff & Inventory */}
            {step === 4 && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Staff & Inventory</h2>
                  
                  <div className="space-y-6">
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Staff Notification Numbers (WhatsApp)</label>
                        <div className="flex gap-2">
                           <input type="tel" placeholder="+91..." className="flex-1 bg-slate-50 border-2 rounded-2xl px-4 py-3 font-bold text-slate-800 outline-none focus:border-emerald-500" value={notifInput} onChange={e => setNotifInput(e.target.value)} />
                           <button onClick={handleAddNotif} type="button" className="p-4 bg-slate-900 text-white rounded-2xl"><ListPlus className="w-5 h-5" /></button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                           {formData.notification_numbers.map((n, i) => (
                              <div key={i} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black flex items-center gap-2">
                                 {n} <button onClick={() => removeNotif(i)} className="text-slate-400 hover:text-rose-500">×</button>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Main Kitchen / KOT Number</label>
                         <input 
                           type="tel" 
                           placeholder="+91..." 
                           className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-emerald-500" 
                           value={formData.kitchen_number} 
                           onChange={e => setFormData({...formData, kitchen_number: e.target.value})} 
                         />
                         <p className="text-[8px] text-slate-400 mt-2 italic font-bold">This number receives full Kitchen Order Tickets (KOT) for every new order.</p>
                      </div>

                     <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100">
                        <div>
                           <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Track Live Inventory</p>
                           <p className="text-[10px] text-slate-400 font-bold">Auto-decrement stock on confirmed orders.</p>
                        </div>
                        <button 
                           type="button"
                           onClick={() => setFormData({...formData, track_inventory: !formData.track_inventory})}
                           className={`w-14 h-8 rounded-full p-1 transition-all ${formData.track_inventory ? 'bg-emerald-600' : 'bg-slate-300'}`}
                        >
                           <div className={`w-6 h-6 bg-white rounded-full transition-all ${formData.track_inventory ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                     </div>

                     {formData.track_inventory && (
                        <div className="bg-emerald-50/50 p-6 rounded-[2rem] border-2 border-emerald-100 flex items-center justify-between animate-in zoom-in-95 duration-200">
                           <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Low Stock Alert Threshold</label>
                           <input type="number" className="w-20 bg-white border-2 border-emerald-200 rounded-xl px-4 py-2 text-center font-black" value={formData.low_stock_threshold} onChange={e => setFormData({...formData, low_stock_threshold: parseInt(e.target.value)})} />
                        </div>
                     )}

                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Operation Currency</label>
                        <select 
                           className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-emerald-500 appearance-none"
                           value={formData.currency_code} 
                           onChange={e => setFormData({...formData, currency_code: e.target.value})}
                        >
                           <option value="INR">Indian Rupee (₹)</option>
                           <option value="AED">UAE Dirham (AED)</option>
                           <option value="USD">US Dollar ($)</option>
                           <option value="GBP">British Pound (£)</option>
                           <option value="SAR">Saudi Riyal (SAR)</option>
                        </select>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <button onClick={() => setStep(3)} type="button" className="px-8 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest">Back</button>
                     <button onClick={() => setStep(5)} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 transition-all">Add Social Links</button>
                  </div>
               </div>
            )}

            {/* Step 5: Social Links */}
            {step === 5 && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Social Presence</h2>
                  <p className="text-sm text-slate-400 font-medium -mt-4">These links will appear on your digital menu for customers to connect with you.</p>
                  
                  <div className="space-y-4">
                     {[
                        { key: 'social_instagram', label: 'Instagram', icon: () => <InstagramIcon />, placeholder: 'https://instagram.com/yourbusiness' },
                        { key: 'social_facebook', label: 'Facebook', icon: Globe, placeholder: 'https://facebook.com/yourbusiness' },
                        { key: 'social_twitter', label: 'X (Twitter)', icon: Globe, placeholder: 'https://x.com/yourbusiness' },
                        { key: 'social_youtube', label: 'YouTube', icon: Globe, placeholder: 'https://youtube.com/@yourbusiness' },
                        { key: 'social_website', label: 'Website', icon: Link2, placeholder: 'https://yourbusiness.com' },
                     ].map(s => (
                        <div key={s.key}>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                              <s.icon className="w-3.5 h-3.5 text-emerald-500" /> {s.label}
                           </label>
                           <input 
                              type="url" 
                              placeholder={s.placeholder}
                              className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-emerald-500 placeholder:text-slate-300 text-sm"
                              value={formData[s.key]}
                              onChange={e => setFormData({...formData, [s.key]: e.target.value})}
                           />
                        </div>
                     ))}
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                           <Globe className="w-3.5 h-3.5 text-emerald-500" /> Google Review Link
                        </label>
                        <input 
                           type="url" 
                           placeholder="https://g.page/r/..." 
                           className="w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-emerald-500 text-sm" 
                           value={formData.settings.google_review_link || ''} 
                           onChange={e => setFormData({...formData, settings: {...formData.settings, google_review_link: e.target.value}})} 
                        />
                        <p className="text-[8px] text-slate-400 mt-2 italic font-bold">This link will be sent to customers when they give you a 4 or 5-star rating on WhatsApp.</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <button onClick={() => setStep(4)} type="button" className="px-8 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest">Back</button>
                     <button onClick={handleSubmit} disabled={loading} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98]">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : "Save & Launch"}
                     </button>
                  </div>
               </div>
            )}

         </div>
      </div>
    </div>
  );
}

export default SetupBusiness;
