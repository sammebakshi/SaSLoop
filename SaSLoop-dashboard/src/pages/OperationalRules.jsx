import React, { useState, useEffect } from "react";
import API_BASE from "../config";
import { Store, Clock, Settings, CheckCircle2, Sparkles, MapPin, Navigation, ShoppingBag, X, Bike, Utensils, Plus } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
});

function LocationPicker({ lat, lng, onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return lat && lng ? <Marker position={[lat, lng]} /> : null;
}

function OperationalRules() {
  const [formData, setFormData] = useState({
     name: "",
     phone: "",
     address: "",
     businessType: "other",
     bot_knowledge: "",
     kitchen_number: "",
     notification_numbers: [],
     latitude: "",
     longitude: "",
     delivery_radius_km: 10,
     cgst_percent: 0,
     sgst_percent: 0,
     gst_included: false,
     show_gst_on_receipt: true,
     loyalty_enabled: true,
     points_per_100: 5,
     points_to_amount_ratio: 10,
     min_redeem_points: 300,
     max_redeem_per_order: 300,
     is_auth_required: false,
     delivery_tiers: [],
     fulfillment_options: { dinein: true, pickup: true, delivery: true },
     settings: {
        openingTime: "09:00",
        closingTime: "22:00",
        homeDelivery: false,
        dining: false,
        tableBooking: false,
        appointments: false,
        salonBooking: false,
        menuLink: "",
        customerSupport: ""
     }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fetchStatus = React.useCallback(async () => {
    try {
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.business) {
        const b = data.business;
        setFormData({
           name: b.name || "",
           phone: b.phone || "",
           address: b.address || "",
           kitchen_number: Array.isArray(b.kitchen_number) ? b.kitchen_number[0] : (b.kitchen_number || ""),
           notification_numbers: Array.isArray(b.notification_numbers) ? b.notification_numbers : (b.notification_numbers ? [b.notification_numbers] : []),
           latitude: b.latitude || "",
           longitude: b.longitude || "",
           delivery_radius_km: b.delivery_radius_km || 10,
           businessType: b.business_type || "other",
           cgst_percent: parseFloat(b.cgst_percent) || 0,
           sgst_percent: parseFloat(b.sgst_percent) || 0,
           gst_included: !!b.gst_included,
           show_gst_on_receipt: !!b.show_gst_on_receipt,
           loyalty_enabled: b.loyalty_enabled !== undefined ? !!b.loyalty_enabled : true,
           points_per_100: b.points_per_100 || 5,
           points_to_amount_ratio: b.points_to_amount_ratio || 10,
           min_redeem_points: b.min_redeem_points || 300,
           max_redeem_per_order: b.max_redeem_per_order || 300,
           is_auth_required: !!b.is_auth_required,
           delivery_tiers: b.delivery_tiers || [],
           fulfillment_options: b.fulfillment_options || { dinein: true, pickup: true, delivery: true },
           bot_knowledge: data.bot_knowledge || "",
           settings: {
              openingTime: b.settings?.openingTime || "09:00",
              closingTime: b.settings?.closingTime || "22:00",
              homeDelivery: !!b.settings?.homeDelivery || !!(b.fulfillment_options?.delivery),
              dining: !!b.settings?.dining || !!(b.fulfillment_options?.dinein),
              tableBooking: !!b.settings?.tableBooking,
              appointments: !!b.settings?.appointments,
              salonBooking: !!b.settings?.salonBooking,
              menuLink: b.settings?.menuLink || "",
              customerSupport: b.settings?.customerSupport || ""
           }
        });
      }
    } catch (err) {
      console.error("Failed to load business details", err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSettingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }));
  };

  const handleSave = async (e) => {
    if(e) e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const impersonateId = sessionStorage.getItem("impersonate_id");
      
      // Ensure settings and fulfillment options are synced
      const finalFulfillment = {
          dinein: !!formData.fulfillment_options.dinein,
          pickup: !!formData.fulfillment_options.pickup,
          delivery: !!formData.fulfillment_options.delivery
      };

      const body = { 
          ...formData,
          business_type: formData.businessType,
          fulfillment_options: finalFulfillment,
          settings: {
              ...formData.settings,
              dining: finalFulfillment.dinein,
              homeDelivery: finalFulfillment.delivery
          }
      };

      if (impersonateId) {
          body.target_user_id = impersonateId;
      }
      
      const res = await fetch(`${API_BASE}/api/business/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
         setIsSaved(true);
         await fetchStatus(); // Refresh data to confirm save
         setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8 font-sans pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Settings className="w-8 h-8 text-emerald-600" /> Operational Rules
            </h1>
            <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest pl-1">Configure your AI & Delivery logic</p>
          </div>
          <button onClick={handleSave} disabled={isSaving} className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl ${isSaved ? 'bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 active:scale-95'}`}>
            {isSaving ? <Clock className="w-4 h-4 animate-spin" /> : isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {isSaving ? "Saving..." : isSaved ? "Rules Saved" : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-emerald-600" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900">Business Profile</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Your public identity on WhatsApp</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Display Name</label>
                       <input type="text" value={formData.name} onChange={e => setFormData(prev => ({...prev, name: e.target.value}))} placeholder="e.g. Shahe Tehzeeb" className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl focus:bg-white outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Primary Type</label>
                        <select className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl focus:bg-white outline-none" value={formData.businessType} onChange={(e) => setFormData(prev => ({...prev, businessType: e.target.value}))}>
                            <option value="restaurant_cafe">Restaurant / Cafe</option>
                            <option value="healthcare_clinic">Health / Clinic</option>
                            <option value="salon_spa">Beauty / Salon</option>
                            <option value="retail_store">Retail Store</option>
                            <option value="other">General Service</option>
                        </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Physical Address (Shown to customer)</label>
                    <textarea rows="2" value={formData.address} onChange={e => setFormData(prev => ({...prev, address: e.target.value}))} placeholder="Full location for pickup..." className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl focus:bg-white outline-none resize-none" />
                 </div>
              </div>
           </div>

           <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6 relative z-10">
                 <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-white">AI Knowledge Base</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter italic">Train your AI with store specific rules</p>
                 </div>
              </div>
              <textarea value={formData.bot_knowledge} onChange={e => setFormData(prev => ({...prev, bot_knowledge: e.target.value}))} placeholder="Tell the bot about your discounts, menu rules..." className="w-full h-40 bg-slate-800/50 border border-slate-700 p-6 text-sm font-medium text-slate-200 rounded-3xl outline-none" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900">Delivery Geofencing</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Set your delivery radius</p>
                    </div>
                </div>

                <div className="h-64 bg-slate-100 rounded-[2rem] overflow-hidden mb-6 border border-slate-200 relative">
                   <MapContainer center={[formData.latitude || 34.0837, formData.longitude || 74.7973]} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" attribution='&copy; Google' />
                      <LocationPicker lat={formData.latitude} lng={formData.longitude} onChange={(lat, lng) => setFormData(prev => ({...prev, latitude: lat, longitude: lng}))} />
                   </MapContainer>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latitude</label>
                           <input type="number" step="any" value={formData.latitude} onChange={e => setFormData(prev => ({...prev, latitude: e.target.value}))} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold text-slate-700 rounded-xl" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Longitude</label>
                           <input type="number" step="any" value={formData.longitude} onChange={e => setFormData(prev => ({...prev, longitude: e.target.value}))} className="w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold text-slate-700 rounded-xl" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ">Max Radius (KM)</label>
                            <span className="text-[10px] font-black text-emerald-600">{formData.delivery_radius_km} KM</span>
                        </div>
                        <input type="range" min="1" max="50" value={formData.delivery_radius_km} onChange={e => setFormData(prev => ({...prev, delivery_radius_km: e.target.value}))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-emerald-600" />
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-50">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Delivery Charges (Tiers)</h4>
                            <button 
                                onClick={() => setFormData(prev => ({ ...prev, delivery_tiers: [...prev.delivery_tiers, { min: 0, max: 0, charge: 0 }] }))}
                                className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1 hover:underline"
                            >
                                <Plus className="w-3 h-3" /> Add Tier
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.delivery_tiers.map((tier, index) => (
                                <div key={index} className="grid grid-cols-4 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div>
                                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Min (KM)</label>
                                        <input type="number" value={tier.min} onChange={e => {
                                            const newTiers = [...formData.delivery_tiers];
                                            newTiers[index].min = parseFloat(e.target.value) || 0;
                                            setFormData(prev => ({ ...prev, delivery_tiers: newTiers }));
                                        }} className="w-full bg-white border border-slate-200 px-2 py-1.5 text-[10px] font-bold rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Max (KM)</label>
                                        <input type="number" value={tier.max} onChange={e => {
                                            const newTiers = [...formData.delivery_tiers];
                                            newTiers[index].max = parseFloat(e.target.value) || 0;
                                            setFormData(prev => ({ ...prev, delivery_tiers: newTiers }));
                                        }} className="w-full bg-white border border-slate-200 px-2 py-1.5 text-[10px] font-bold rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Charge</label>
                                        <input type="number" value={tier.charge} onChange={e => {
                                            const newTiers = [...formData.delivery_tiers];
                                            newTiers[index].charge = parseFloat(e.target.value) || 0;
                                            setFormData(prev => ({ ...prev, delivery_tiers: newTiers }));
                                        }} className="w-full bg-white border border-slate-200 px-2 py-1.5 text-[10px] font-bold rounded-lg" />
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button onClick={() => setFormData(prev => ({ ...prev, delivery_tiers: prev.delivery_tiers.filter((_, i) => i !== index) }))} className="text-rose-500 hover:text-rose-700">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {formData.delivery_tiers.length === 0 && <p className="text-[9px] text-slate-400 italic">No custom tiers. Radius based cutoff only.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <Navigation className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900">Order Routing</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Kitchen & Notification Roles</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1 italic">Kitchen WhatsApp (KOT)</label>
                        <input type="text" value={formData.kitchen_number} onChange={e => setFormData(prev => ({...prev, kitchen_number: e.target.value}))} placeholder="+91..." className="w-full bg-slate-50 border border-slate-100 px-4 py-4 text-sm font-black text-indigo-600 rounded-2xl outline-none focus:bg-white transition-all shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1 italic">Staff Alerts (Comma Separated)</label>
                        <input type="text" value={formData.notification_numbers.join(", ")} onChange={e => setFormData(prev => ({...prev, notification_numbers: e.target.value.split(",").map(n => n.trim()).filter(n => n.length > 5)}))} placeholder="+91..., +91..." className="w-full bg-slate-50 border border-slate-100 px-4 py-4 text-sm font-black text-indigo-600 rounded-2xl outline-none focus:bg-white transition-all shadow-sm" />
                    </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Active Fulfillment Modes</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {[{id: 'dinein', label: 'Dine-In', icon: <Utensils className="w-4 h-4" />}, {id: 'pickup', label: 'Pickup', icon: <Store className="w-4 h-4" />}, {id: 'delivery', label: 'Delivery', icon: <Bike className="w-4 h-4" />}].map(mode => (
                             <button key={mode.id} onClick={() => setFormData(prev => ({...prev, fulfillment_options: {...prev.fulfillment_options, [mode.id]: !prev.fulfillment_options[mode.id]} }))} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${formData.fulfillment_options[mode.id] ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-lg scale-105' : 'border-slate-50 bg-white text-slate-300'}`}>
                                 {mode.icon}
                                 <span className="text-[10px] font-black uppercase tracking-tight">{mode.label}</span>
                             </button>
                        ))}
                    </div>
                    <p className="mt-4 text-[9px] text-slate-400 font-bold uppercase italic">* Notifications always relayed to kitchen regardless of mode.</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-900">Taxation (GST)</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Automatic tax calculations on bills</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">CGST (%)</label>
                    <input type="number" step="0.01" value={formData.cgst_percent} onChange={e => setFormData({...formData, cgst_percent: parseFloat(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">SGST (%)</label>
                    <input type="number" step="0.01" value={formData.sgst_percent} onChange={e => setFormData(prev => ({...prev, sgst_percent: parseFloat(e.target.value) || 0}))} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" checked={formData.gst_included} onChange={e => setFormData(prev => ({...prev, gst_included: e.target.checked}))} />
                        <span className="text-xs font-black text-slate-700 uppercase">GST Included</span>
                    </label>
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" checked={formData.show_gst_on_receipt} onChange={e => setFormData(prev => ({...prev, show_gst_on_receipt: e.target.checked}))} />
                        <span className="text-xs font-black text-slate-700 uppercase">Show GST on Receipt</span>
                    </label>
                </div>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                 <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-slate-900">Timings & Security</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Manage store availability</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Opening</label>
                       <input type="time" value={formData.settings.openingTime} onChange={e => handleSettingChange('openingTime', e.target.value)} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Closing</label>
                       <input type="time" value={formData.settings.closingTime} onChange={e => handleSettingChange('closingTime', e.target.value)} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Security & Access</label>
                 <label className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl cursor-pointer shadow-sm">
                     <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" checked={formData.is_auth_required} onChange={e => setFormData(prev => ({...prev, is_auth_required: e.target.checked}))} />
                     <span className="text-xs font-black text-indigo-700 uppercase">WhatsApp Login Required</span>
                  </label>
              </div>
           </div>

           <div className="mt-12 pt-12 border-t border-slate-50">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-amber-500" /> Digital Presence & Support
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1 italic">Digital Menu URL (Catalog)</label>
                    <input type="url" value={formData.settings.menuLink} onChange={e => handleSettingChange('menuLink', e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border border-slate-100 px-4 py-4 text-sm font-bold text-slate-700 rounded-2xl outline-none focus:bg-white transition-all shadow-sm" />
                    <p className="mt-2 text-[8px] text-slate-400 uppercase font-black tracking-widest">* Shown when customers select 'View Digital Menu'</p>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1 italic">Support WhatsApp/Number</label>
                    <input type="text" value={formData.settings.customerSupport} onChange={e => handleSettingChange('customerSupport', e.target.value)} placeholder="+91..." className="w-full bg-slate-50 border border-slate-100 px-4 py-4 text-sm font-bold text-slate-700 rounded-2xl outline-none focus:bg-white transition-all shadow-sm" />
                    <p className="mt-2 text-[8px] text-slate-400 uppercase font-black tracking-widest">* Contact given when customers select 'Contact Support'</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default OperationalRules;
