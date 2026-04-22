import { Store, Clock, Settings, CheckCircle2, Sparkles, MapPin, Navigation, ShoppingBag, X, Bike, Utensils, ArrowRight, MousePointer2 } from "lucide-react";
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
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return lat && lng ? <Marker position={[lat, lng]} /> : null;
}

function OperationalRules() {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const fetchStatus = async () => {
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
             kitchen_number: b.kitchen_number || "",
             notification_numbers: b.notification_numbers || [],
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
                homeDelivery: !!b.settings?.homeDelivery,
                dining: !!b.settings?.dining,
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
    };
    fetchStatus();
  }, []);

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
      const body = { 
          ...formData,
          business_type: formData.businessType // sync for safety
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
         const saveResult = await res.json();
         if (saveResult.business) {
            const b = saveResult.business;
            setFormData({
                name: b.name || "",
                phone: b.phone || "",
                address: b.address || "",
                kitchen_number: b.kitchen_number || "",
                notification_numbers: b.notification_numbers || [],
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
                bot_knowledge: b.bot_knowledge || formData.bot_knowledge,
                settings: b.settings || formData.settings
            });
         }
         setIsSaved(true);
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
                       <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Shahe Tehzeeb" className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Primary Type</label>
                        <select className="w-full bg-slate-55 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl focus:bg-white outline-none" value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})}>
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
                    <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Full location for pickup..." className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl focus:bg-white outline-none resize-none" />
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter italic">"Train your AI bot on your unique logic"</p>
                 </div>
              </div>
              <textarea value={formData.bot_knowledge} onChange={e => setFormData({...formData, bot_knowledge: e.target.value})} placeholder="Example: We provide free extra sauce. No delivery for orders under Rs 500. Special discounts on Fridays..." className="w-full h-40 bg-slate-800/50 border border-slate-700 p-6 text-sm font-medium text-slate-200 rounded-3xl focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all relative z-10" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl" />
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
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Locate your business on map</p>
                    </div>
                </div>

                <div className="h-64 bg-slate-100 rounded-[2rem] overflow-hidden mb-6 border border-slate-200 relative">
                   <MapContainer center={[formData.latitude || 34.0837, formData.longitude || 74.7973]} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationPicker lat={formData.latitude} lng={formData.longitude} onChange={(lat, lng) => setFormData(prev => ({...prev, latitude: lat, longitude: lng}))} />
                   </MapContainer>
                   <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-200 shadow-lg pointer-events-none">
                       <p className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-2">
                           <MousePointer2 className="w-3 h-3 text-emerald-600" /> Click Map to Set Location
                       </p>
                   </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-sm">Latitude</label>
                           <input type="number" step="any" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} placeholder="Detecting..." className="w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold text-slate-700 rounded-xl" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-sm">Longitude</label>
                           <input type="number" step="any" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} placeholder="Detecting..." className="w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold text-slate-700 rounded-xl" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ">Service Radius (KM)</label>
                            <span className="text-[10px] font-black text-emerald-600">{formData.delivery_radius_km} KM</span>
                        </div>
                        <input type="range" min="1" max="50" value={formData.delivery_radius_km} onChange={e => setFormData({...formData, delivery_radius_km: e.target.value})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-50 pt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Pricing Tiers</h4>
                            <p className="text-[9px] text-slate-400 font-bold">Charge based on distance from shop</p>
                        </div>
                        <button type="button" onClick={() => setFormData(prev => ({...prev, delivery_tiers: [...prev.delivery_tiers, {min: 0, max: 0, charge: 0}]}))} className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-black text-[9px] uppercase hover:bg-emerald-100 transition-colors flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" /> Add Tier
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {formData.delivery_tiers.map((tier, idx) => (
                            <div key={idx} className="group relative flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100/50 hover:border-emerald-200 transition-all">
                                <div className="flex-1 grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase">Min km</label>
                                        <input type="number" placeholder="0" value={tier.min} onChange={e => {
                                            const newTiers = [...formData.delivery_tiers];
                                            newTiers[idx].min = parseFloat(e.target.value);
                                            setFormData({...formData, delivery_tiers: newTiers});
                                        }} className="w-full bg-white border border-slate-100 px-2 py-1.5 text-xs font-bold rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase">Max km</label>
                                        <input type="number" placeholder="5" value={tier.max} onChange={e => {
                                            const newTiers = [...formData.delivery_tiers];
                                            newTiers[idx].max = parseFloat(e.target.value);
                                            setFormData({...formData, delivery_tiers: newTiers});
                                        }} className="w-full bg-white border border-slate-100 px-2 py-1.5 text-xs font-bold rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase">Charge</label>
                                        <input type="number" placeholder="0" value={tier.charge} onChange={e => {
                                            const newTiers = [...formData.delivery_tiers];
                                            newTiers[idx].charge = parseFloat(e.target.value);
                                            setFormData({...formData, delivery_tiers: newTiers});
                                        }} className="w-full bg-white border border-emerald-100 px-2 py-1.5 text-xs font-bold rounded-lg text-emerald-600" />
                                    </div>
                                </div>
                                <button type="button" onClick={() => {
                                    const newTiers = formData.delivery_tiers.filter((_, i) => i !== idx);
                                    setFormData({...formData, delivery_tiers: newTiers});
                                }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                        ))}
                        {formData.delivery_tiers.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center shadow-none">No custom tiers set</p>
                                <p className="text-[8px] text-slate-400 mt-1">Default flat delivery rules will apply</p>
                            </div>
                        )}
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
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-sm">Kitchen WhatsApp (KOT)</label>
                        <input type="text" value={formData.kitchen_number} onChange={e => setFormData({...formData, kitchen_number: e.target.value})} placeholder="91..." className="w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold text-slate-700 rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-sm">Staff Alerts (Comma Separated)</label>
                        <input type="text" value={formData.notification_numbers.join(", ")} onChange={e => setFormData({...formData, notification_numbers: e.target.value.split(",").map(n => n.trim())})} placeholder="91..., 91..." className="w-full bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-bold text-slate-700 rounded-xl" />
                    </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Active Fulfillment Modes</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {[{id: 'dinein', label: 'Dine-In', icon: <Utensils className="w-3.5 h-3.5" />}, {id: 'pickup', label: 'Pickup', icon: <Store className="w-3.5 h-3.5" />}, {id: 'delivery', label: 'Delivery', icon: <Bike className="w-3.5 h-3.5" />}].map(mode => (
                             <button key={mode.id} onClick={() => setFormData(prev => ({...prev, fulfillment_options: {...prev.fulfillment_options, [mode.id]: !prev.fulfillment_options[mode.id]} }))} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2 ${formData.fulfillment_options[mode.id] ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-50 bg-white text-slate-400'}`}>
                                 {mode.icon}
                                 <span className="text-[9px] font-black uppercase tracking-tight">{mode.label}</span>
                             </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900">Taxation (GST) Settings <span className="text-[10px] text-rose-500 font-mono ml-2">v1.0.5-DEBUG-ID: {user?.id}</span></h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Configure your tax rules</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 shadow-sm pl-1">CGST (%)</label>
                    <input type="number" step="0.01" value={formData.cgst_percent} onChange={e => setFormData({...formData, cgst_percent: parseFloat(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 shadow-sm pl-1">SGST (%)</label>
                    <input type="number" step="0.01" value={formData.sgst_percent} onChange={e => setFormData({...formData, sgst_percent: parseFloat(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent">
                        <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-slate-300" checked={formData.gst_included} onChange={e => { setFormData({...formData, gst_included: e.target.checked}); }} />
                        <span className="text-xs font-black text-slate-700 uppercase">GST Included in Price</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent">
                        <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-slate-300" checked={formData.show_gst_on_receipt} onChange={e => { setFormData({...formData, show_gst_on_receipt: e.target.checked}); }} />
                        <span className="text-xs font-black text-slate-700 uppercase">Show GST on WhatsApp Bill</span>
                    </label>
                </div>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900">Loyalty Rewards Program</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Automated point accumulation & redemption</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.loyalty_enabled} onChange={e => setFormData({...formData, loyalty_enabled: e.target.checked})} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 transition-all duration-500 ${formData.loyalty_enabled ? 'opacity-100 pointer-events-auto' : 'opacity-30 pointer-events-none grayscale'}`}>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Earn (Points per Rs 100)</label>
                    <input type="number" value={formData.points_per_100} onChange={e => setFormData({...formData, points_per_100: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Redeem (Pts : Rs 1)</label>
                    <div className="flex items-center gap-2">
                        <input type="number" value={formData.points_to_amount_ratio} onChange={e => setFormData({...formData, points_to_amount_ratio: parseFloat(e.target.value) || 1})} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Pts = Rs 1</span>
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Min Pts to Redeem</label>
                    <input type="number" value={formData.min_redeem_points} onChange={e => setFormData({...formData, min_redeem_points: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Max Redeem per Order</label>
                    <input type="number" value={formData.max_redeem_per_order} onChange={e => setFormData({...formData, max_redeem_per_order: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                </div>
            </div>
            {!formData.loyalty_enabled && <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100"><p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Program Disabled: Customers will not earn or redeem points until enabled.</p></div>}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                 <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-slate-900">Timing & Toggles</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Availability & Service Modes</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 shadow-sm pl-1">Opening</label>
                       <input type="time" value={formData.settings.openingTime} onChange={e => handleSettingChange('openingTime', e.target.value)} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 shadow-sm pl-1">Closing</label>
                       <input type="time" value={formData.settings.closingTime} onChange={e => handleSettingChange('closingTime', e.target.value)} className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 rounded-xl" />
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Commerce Features</label>
                 <label className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl cursor-pointer hover:bg-indigo-100 transition-colors border border-transparent active:scale-98">
                     <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300" checked={formData.is_auth_required} onChange={e => setFormData({...formData, is_auth_required: e.target.checked})} />
                     <span className="text-xs font-black text-indigo-700 uppercase">Mandatory Mobile Login First</span>
                  </label>
                 {[
                    { key: 'dining', label: 'Dine-In / Table QR' },
                    { key: 'tableBooking', label: 'Table Booking' },
                    { key: 'pickupOnly', label: 'Takeaway / Pickup only' },
                    { key: 'homeDelivery', label: 'Home Delivery Service' },
                    { key: 'botTakeover', label: 'Manual Bot Takeover' }
                 ].map(service => (
                    <label key={service.key} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent active:scale-98">
                       <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-slate-300" 
                          checked={service.key === 'homeDelivery' ? formData.settings.homeDelivery : formData.settings[service.key]} 
                          onChange={e => service.key === 'homeDelivery' ? handleSettingChange('homeDelivery', e.target.checked) : handleSettingChange(service.key, e.target.checked)} />
                       <span className="text-xs font-black text-slate-700 uppercase">{service.label}</span>
                    </label>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default OperationalRules;
