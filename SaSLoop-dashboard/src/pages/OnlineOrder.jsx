import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../config";
import { 
  Plus, Minus, ShoppingBag, Utensils, Search, 
  X, MapPin, ChevronRight, Clock, RefreshCw, 
  CheckCircle2, Package, History, Bike, Store, Activity, Sparkles, AlertCircle, MessageCircle, LayoutGrid, Gift
} from "lucide-react";
import { countryCodes } from "../countryCodes";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
});

function MapPicker({ lat, lng, onChange }) {
  const map = useMapEvents({
    click(e) { onChange(e.latlng.lat, e.latlng.lng); },
    dragend() { const center = map.getCenter(); onChange(center.lat, center.lng); }
  });
  return lat && lng ? <Marker position={[lat, lng]} /> : null;
}

function OnlineOrder() {
  const { bizId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const categoryRefs = useRef({});
  const [fulfillmentMode, setFulfillmentMode] = useState("DELIVERY");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [finalPaidAmount, setFinalPaidAmount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [redemptionToken, setRedemptionToken] = useState(null);
  const [redemptionStatus, setRedemptionStatus] = useState("IDLE"); // IDLE, PENDING, SUCCESS
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [deliveryRadiusStatus, setDeliveryRadiusStatus] = useState({ allowed: true, distance: 0, charge: 0 });
  
  const [activeOrders, setActiveOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [orderTab, setOrderTab] = useState("tracking"); // "tracking" or "history"
  const [pollInterval, setPollInterval] = useState(null);
  
  const [view, setView] = useState("auth"); 
  const [isVerified, setIsVerified] = useState(false);
  const [authStatus, setAuthStatus] = useState("IDLE"); 
  const [authToken, setAuthToken] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  
  // --- 🔒 SESSION PERSISTENCE ---
  useEffect(() => {
    const savedName = localStorage.getItem(`sasloop_name_${bizId}`);
    const savedPhone = localStorage.getItem(`sasloop_phone_${bizId}`);
    if (savedName) setCustomerName(savedName);
    if (savedPhone) {
      setCustomerPhone(savedPhone);
      setView("menu"); // Skip auth if already identified
    }
  }, [bizId]);

  const saveSession = (name, phone) => {
    localStorage.setItem(`sasloop_name_${bizId}`, name);
    localStorage.setItem(`sasloop_phone_${bizId}`, phone);
  };

  const getStandardPhone = (p) => {
    if (!p) return "";
    if (p.startsWith("+")) return p;
    // Remove all non-digits from input
    const cleanP = p.replace(/\D/g, "");
    // If it already starts with country code, just add +
    if (cleanP.startsWith(countryCode)) return "+" + cleanP;
    // Otherwise prepend country code
    return `+${countryCode}${cleanP}`;
  };

  const biz = data?.business;
  const symbol = '₹';
  const logoUrl = biz?.logo_url ? (biz.logo_url.startsWith("http") ? biz.logo_url : `${API_BASE}${biz.logo_url}`) : null;
  const bannerUrl = biz?.banner_url ? (biz.banner_url.startsWith("http") ? biz.banner_url : `${API_BASE}${biz.banner_url}`) : null;

  const subtotal = cart.reduce((acc, i) => acc + (i.qty * i.price), 0);
  const taxData = useMemo(() => {
    let cgst = 0, sgst = 0;
    const cgstR = parseFloat(biz?.cgst_percent) || 0;
    const sgstR = parseFloat(biz?.sgst_percent) || 0;
    const isInc = biz?.gst_included === true;
    if (!data) return { cgst: 0, sgst: 0, totalTax: 0, isIncluded: true };
    cart.forEach(item => { if (item.tax_applicable === 1 || item.tax_applicable === true) { const t = item.qty * item.price; if (isInc) { const r = cgstR + sgstR; if (r > 0) { const a = t * (r / (100 + r)); cgst += a * (cgstR / r); sgst += a * (sgstR / r); } } else { cgst += (t * cgstR) / 100; sgst += (t * sgstR) / 100; } } });
    return { cgst, sgst, totalTax: cgst + sgst, isIncluded: isInc };
  }, [cart, data, biz]);

  const finalTotal = Math.max(0, (taxData.isIncluded ? subtotal : (subtotal + taxData.totalTax)) - (pointsToRedeem / (biz?.points_to_amount_ratio || 10)) + (fulfillmentMode === 'DELIVERY' ? (deliveryRadiusStatus.charge || 0) : 0));
  const filteredItems = useMemo(() => (data?.items || []).filter(i => i.product_name.toLowerCase().includes(search.toLowerCase())), [data, search]);
  const groupedItems = useMemo(() => filteredItems.reduce((acc, current) => { const cat = current.category || "General"; if (!acc[cat]) acc[cat] = []; acc[cat].push(current); return acc; }, {}), [filteredItems]);
  const categories = Object.keys(groupedItems);
  const totalCartItems = cart.reduce((acc, i) => acc + i.qty, 0);

  const fetchActiveOrders = async () => {
    if (!customerPhone) return;
    try {
      const std = getStandardPhone(customerPhone);
      const res = await fetch(`${API_BASE}/api/public/orders/${bizId}/${encodeURIComponent(std)}`);
      const d = await res.json();
      setActiveOrders(d || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/public/menu/${bizId}`).then(r => r.json()).then(d => { 
        setData(d); 
        setLoading(false); 
        if (d.items?.length > 0) setActiveCategory(d.items[0].category || "General"); 
        if (d.business?.settings?.accepted_payment_methods) {
            if (!d.business.settings.accepted_payment_methods.cash && d.business.settings.accepted_payment_methods.upi) {
                setPaymentMethod("UPI");
            }
        }
    });
  }, [bizId]);

  useEffect(() => {
    if (view !== "auth") {
      fetchActiveOrders();
      checkLoyalty();
      const itv = setInterval(() => {
        fetchActiveOrders();
        checkLoyalty();
      }, 3000); // ⚡ Live Sync
      return () => clearInterval(itv);
    }
  }, [view, customerPhone]);

  // --- 📍 AUTOMATIC GEOLOCATION ---
  useEffect(() => {
    if (fulfillmentMode === 'DELIVERY' && !deliveryCoords) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          updateMapLocation(pos.coords.latitude, pos.coords.longitude);
        }, (err) => {
          console.warn("Geolocation denied/failed", err);
          // Fallback to business location
          if (biz?.latitude && biz?.longitude) {
            updateMapLocation(biz.latitude, biz.longitude);
          }
        });
      }
    }
  }, [fulfillmentMode, biz]);

  const checkLoyalty = async () => {
    if (!customerPhone) return;
    try {
      const std = getStandardPhone(customerPhone);
      const res = await fetch(`${API_BASE}/api/public/loyalty/${bizId}/${encodeURIComponent(std)}`);
      const d = await res.json();
      setLoyaltyPoints(d.points || 0);
    } catch (e) {}
  };

  const handleRequestAuth = async () => {
    if (!customerName.trim()) return alert("Please enter your name first.");
    setAuthStatus("PENDING");
    try {
        const res = await fetch(`${API_BASE}/api/whatsapp/auth/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: bizId })
        });
        const d = await res.json();
        if (d.success) {
            setAuthToken(d.token);
            const waMsg = `🚀 Verify my number for ${biz?.name}! ✨ [ID: ${d.token}]`;
            const waUrl = `https://wa.me/${(biz?.whatsapp_number || biz?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(waMsg)}`;
            window.open(waUrl, "_blank");
        } else {
            alert(d.error || "Failed to start verification.");
            setAuthStatus("IDLE");
        }
    } catch (e) {
        setAuthStatus("IDLE");
        alert("Something went wrong.");
    }
  };

  useEffect(() => {
    let itv;
    if (authStatus === "PENDING" && authToken) {
      itv = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/whatsapp/auth/status/${authToken}`);
          const d = await res.json();
          if (d.verified) {
            clearInterval(itv);
            const stdPhone = d.phone;
            setCustomerPhone(stdPhone);
            setIsVerified(true);
            setAuthStatus("SUCCESS");
            setView("menu");
            
            // Fetch loyalty and orders
            const std = getStandardPhone(stdPhone);
            const loyRes = await fetch(`${API_BASE}/api/public/loyalty/${bizId}/${encodeURIComponent(std)}`);
            const loyData = await loyRes.json();
            setLoyaltyPoints(loyData.points || 0);

            const ordRes = await fetch(`${API_BASE}/api/public/orders/${bizId}/${encodeURIComponent(std)}`);
            const ordData = await ordRes.json();
            setActiveOrders(ordData || []);

            setView("fulfillment");
          }
        } catch (e) {}
      }, 2500);
    }
    return () => clearInterval(itv);
  }, [authStatus, authToken]);

  const updateMapLocation = async (lat, lng) => {
    setDeliveryCoords({ lat, lng });
    const R = 6371; 
    const dLat = (lat - (biz?.latitude || 0)) * Math.PI / 180;
    const dLon = (lng - (biz?.longitude || 0)) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((biz?.latitude || 0) * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    const radius = parseFloat(biz?.delivery_radius_km) || 10;
    let allowed = dist <= radius;
    let charge = 0;
    const tiersRaw = biz?.delivery_tiers;
    const tiers = typeof tiersRaw === 'string' ? JSON.parse(tiersRaw) : (tiersRaw || []);
    const matchedTier = tiers.find(t => dist >= t.min && dist <= t.max);
    if (matchedTier) charge = parseFloat(matchedTier.charge);
    setDeliveryRadiusStatus({ allowed, charge, distance: dist });
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`).then(r => r.json()).then(g => setCustomerAddress(g.display_name));
  };

  const handleRedeemRequest = async () => {
    if (!isVerified) {
        setView("auth");
        return;
    }
    if (!customerPhone) return alert("Please enter your phone number.");
    const minRedeem = biz?.min_redeem_points || 300;
    const maxRedeem = biz?.max_redeem_per_order || 300;
    
    if (loyaltyPoints < minRedeem) {
        return alert(`Minimum ${minRedeem} points required to redeem.`);
    }

    const pointsToUse = Math.min(loyaltyPoints, maxRedeem);
    
    setRedemptionStatus("PENDING");
    try {
        const res = await fetch(`${API_BASE}/api/public/loyalty/redeem/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: bizId, phone: customerPhone, points: pointsToUse })
        });
        const d = await res.json();
        if (d.success) {
            setRedemptionToken(d.token);
            const waMsg = `🎁 Redeem ${pointsToUse} points for ${biz?.name}! ✨ [ID: ${d.token}]`;
            const waUrl = `https://wa.me/${(biz?.whatsapp_number || biz?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(waMsg)}`;
            window.open(waUrl, "_blank");
            
            // Start polling
            const itv = setInterval(async () => {
                try {
                    const sRes = await fetch(`${API_BASE}/api/public/loyalty/redeem/status/${d.token}`);
                    const sData = await sRes.json();
                    if (sData.verified) {
                        clearInterval(itv);
                        setRedemptionStatus("SUCCESS");
                        setPointsToRedeem(pointsToUse);
                    }
                } catch (e) {}
            }, 2500);
            setTimeout(() => clearInterval(itv), 300000);
        } else {
            alert(d.error || "Failed to start redemption.");
            setRedemptionStatus("IDLE");
        }
    } catch (e) {
        setRedemptionStatus("IDLE");
        alert("Something went wrong.");
    }
  };

  const placeOrder = async () => {
    if (!isVerified && (!customerName || !customerPhone)) {
        alert("Please provide your Name and Phone number to place the order.");
        return;
    }
    setPlacing(true);
    const fullPhone = getStandardPhone(customerPhone);
    try {
      const res = await fetch(`${API_BASE}/api/public/order`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          userId: bizId, 
          tableNumber: "0", 
          items: cart, 
          subtotal: taxData.isIncluded ? subtotal : subtotal + taxData.totalTax, 
          cgst: taxData.cgst, 
          sgst: taxData.sgst, 
          totalPrice: finalTotal, 
          customerName, 
          customerPhone: fullPhone, 
          pointsToRedeem, 
          redemptionToken,
          address: fulfillmentMode === "DELIVERY" ? customerAddress : "Pickup", 
          fulfillmentMode, 
          source: "ONLINE_ORDER",
          paymentMethod: paymentMethod,
          service_charge: fulfillmentMode === "DELIVERY" ? (deliveryRadiusStatus.charge || 0) : 0,
          deliveryCoords: fulfillmentMode === "DELIVERY" ? deliveryCoords : null
        }) 
      });
      const o = await res.json();
      if (res.ok) { setOrderRef(o.orderRef); setFinalPaidAmount(o.finalPrice || 0); setView("confirmed"); setCart([]); fetchActiveOrders(); }
      else alert(o.error || "Failed");
    } finally { setPlacing(false); }
  };

  if (loading) return (<div className="h-screen bg-white flex flex-col items-center justify-center font-sans"><Activity className="w-10 h-10 text-emerald-500 animate-spin" /><p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-300">Loading Flavors...</p></div>);

  if (view === "auth") {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-slate-100 overflow-hidden font-sans">
        {/* VIBRANT GLASS BACKGROUND */}
        <div className="absolute inset-0 z-0 scale-110 opacity-60">
          <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="bg" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-200/80 via-white/20 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[400px] animate-in fade-in zoom-in duration-700">
          <div className="bg-white/30 backdrop-blur-3xl px-6 sm:px-8 py-10 rounded-[2.5rem] border border-white/40 shadow-2xl text-center overflow-hidden">
              <div className="w-16 h-16 bg-white p-3 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-100">
                {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain rounded-xl" alt="logo" /> : <Utensils className="w-8 h-8 text-emerald-600" />}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter mb-1 uppercase italic">{biz?.name}</h1>
              <p className="text-emerald-600 text-[9px] font-black uppercase tracking-[0.3em] mb-10 opacity-60">Online Concierge</p>
              
              <div className="space-y-6 text-left">
                  <div className="space-y-1.5 w-full">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Type name" className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 transition-all" autoFocus />
                  </div>

                  <div className="space-y-1.5 w-full">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden focus-within:border-emerald-500 transition-all">
                       <select 
                         className="bg-transparent pl-4 pr-1 py-4 text-sm font-bold text-slate-800 outline-none border-r border-slate-100" 
                         value={countryCode} 
                         onChange={e => setCountryCode(e.target.value)}
                       >
                          {countryCodes.map(c => <option key={c.code} value={c.code}>+{c.code}</option>)}
                       </select>
                       <input 
                         type="tel" 
                         value={customerPhone} 
                         onChange={e => setCustomerPhone(e.target.value)} 
                         placeholder="Enter mobile" 
                         className="flex-1 bg-transparent px-4 py-4 text-sm font-bold text-slate-800 outline-none" 
                       />
                    </div>
                  </div>

                  {authStatus === "PENDING" ? (
                    <div className="py-6 text-center animate-pulse">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RefreshCw className="animate-spin w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Waiting for Verification...</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Please send the message in WhatsApp</p>
                      <button onClick={() => setAuthStatus("IDLE")} className="mt-4 text-[9px] font-black text-rose-500 uppercase tracking-widest underline">Cancel</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                        <button 
                          onClick={() => {
                             if(!customerName || customerPhone.length < 5) return alert("Please enter your name and valid phone number");
                             saveSession(customerName, customerPhone);
                             setView("menu");
                          }}
                          className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.8rem] text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-95 transition-all mt-4 flex items-center justify-center gap-3"
                        >
                          Continue to Menu <ChevronRight className="w-4 h-4 text-emerald-400" />
                        </button>
                        
                        {loyaltyPoints >= (biz?.min_redeem_points || 300) && !isVerified && (
                           <button 
                             onClick={handleRequestAuth}
                             className="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                           >
                             <MessageCircle className="w-5 h-5" /> Verify via WhatsApp to Redeem
                           </button>
                        )}
                    </div>
                  )}
              </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "confirmed") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700 font-sans">
         <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl"><CheckCircle2 className="w-10 h-10 text-emerald-600" /></div>
         <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase italic">Placed!</h1>
         <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-10">We are on it</p>
         <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 w-full max-w-sm mb-10 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Order ID</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter mb-8 font-mono italic">{orderRef}</p>
            {paymentMethod === 'UPI' && (
               <div className="mb-8 p-6 bg-white rounded-3xl border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 flex flex-col items-center">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Complete Payment</p>
                  
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 inline-block">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${biz?.settings?.upi_id || "restaurant@upi"}&pn=${encodeURIComponent(biz?.name || "Restaurant")}&am=${finalPaidAmount.toFixed(2)}&cu=INR&tn=Order%20${orderRef}`)}`} 
                      alt="UPI QR Code" 
                      className="w-40 h-40 object-contain mx-auto"
                    />
                    <p className="text-[9px] font-black text-slate-400 mt-3 uppercase tracking-widest">Scan with any UPI App</p>
                  </div>

                  <a href={`upi://pay?pa=${biz?.settings?.upi_id || "restaurant@upi"}&pn=${encodeURIComponent(biz?.name || "Restaurant")}&am=${finalPaidAmount.toFixed(2)}&cu=INR&tn=Order%20${orderRef}`} className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 mb-3">Pay ₹{finalPaidAmount.toFixed(0)} on Mobile</a>
                  <p className="text-[8px] font-bold text-slate-400">Or we have sent a payment link to your WhatsApp.</p>
               </div>
            )}
         </div>
         <button onClick={() => setView("menu")} className="w-full max-w-[280px] bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest">Back to Flavors</button>
      </div>
    );
  }

  if (view === "fulfillment") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
         <div className="w-full max-w-[480px] bg-white rounded-[3.5rem] shadow-2xl p-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Method</h2>
            <div className="grid grid-cols-2 gap-4 mb-10 mt-6">
               {[ { id: 'PICKUP', icon: <Store className="w-6 h-6"/> , t: 'Pickup' }, { id: 'DELIVERY', icon: <Bike className="w-6 h-6"/> , t: 'Delivery' } ].map(m => (
                  <button key={m.id} onClick={() => setFulfillmentMode(m.id)} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-4 text-left ${fulfillmentMode === m.id ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-50'}`}>
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${fulfillmentMode === m.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{m.icon}</div>
                     <p className={`font-black uppercase text-xs tracking-widest ${fulfillmentMode === m.id ? 'text-emerald-900' : 'text-slate-500'}`}>{m.t}</p>
                  </button>
               ))}
            </div>
            {fulfillmentMode === 'DELIVERY' && (
               <div className="mb-10 space-y-4">
                  <div className="h-64 rounded-[2.5rem] overflow-hidden border-2 border-white shadow-2xl relative">
                     <MapContainer center={deliveryCoords ? [deliveryCoords.lat, deliveryCoords.lng] : [biz?.latitude || 20, biz?.longitude || 77]} zoom={14} style={{ height: '100%', width: '100%' }}>
                       <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" attribution='&copy; Google' />
                       <MapPicker lat={deliveryCoords?.lat} lng={deliveryCoords?.lng} onChange={updateMapLocation} />
                     </MapContainer>
                  </div>
                   <div className={`p-5 rounded-2xl border-2 transition-all ${deliveryRadiusStatus.allowed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50 border-rose-100 shadow-lg shadow-rose-200 animate-pulse'}`}>
                     <div className="flex items-start gap-3">
                        {deliveryRadiusStatus.allowed ? <MapPin className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                        <div className="flex-1 min-w-0">
                           <p className="text-[10px] font-black uppercase text-slate-900 truncate">{customerAddress || "Detecting location..."}</p>
                           {!deliveryRadiusStatus.allowed && (
                              <p className="text-[9px] font-black text-rose-600 uppercase mt-1 leading-tight">
                                 🚨 Area Not Serviceable. We only deliver within {biz?.delivery_radius_km}km. 
                                 (You are {deliveryRadiusStatus.distance?.toFixed(1)}km away)
                              </p>
                           )}
                           {deliveryRadiusStatus.allowed && deliveryRadiusStatus.distance > 0 && (
                              <p className="text-[9px] font-black text-emerald-600 uppercase mt-1">
                                 ✅ You are in our delivery zone ({deliveryRadiusStatus.distance?.toFixed(1)}km)
                              </p>
                           )}
                        </div>
                     </div>
                   </div>
               </div>
            )}
            <button onClick={() => setView("menu")} disabled={fulfillmentMode === 'DELIVERY' && !deliveryRadiusStatus.allowed} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase text-[12px]">Continue to Menu</button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white lg:bg-slate-50 font-sans tracking-tight">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-50 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
           <div className="flex flex-col">
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter truncate max-w-[150px] italic">{biz?.name}</h1>
              {customerPhone && (
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Available Points: {loyaltyPoints}</p>
              )}
           </div>
           <div className="flex gap-2">
              <button onClick={() => setShowOrders(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl transition-all active:scale-95">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{activeOrders.length > 0 ? `${activeOrders.length} ORDERS` : 'MY HUB'}</span>
              </button>
              <button onClick={() => setView("fulfillment")} className="h-10 bg-slate-100 flex items-center px-4 rounded-2xl text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-widest italic">{fulfillmentMode}</button>
           </div>
        </div>
      </header>

      {/* TRACKING & HISTORY HUB */}
      {showOrders && (
        <div className="fixed inset-0 z-[200]">
           <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowOrders(false)} />
           <div className="absolute right-0 top-0 bottom-0 w-full max-w-[400px] bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col font-sans">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between"><h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">My Hub <Activity className="w-6 h-6 text-emerald-500" /></h2><button onClick={() => setShowOrders(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"><X className="w-5 h-5 text-slate-400" /></button></div>
              
              {/* CUSTOMER PROFILE CARD */}
              <div className="mx-8 mt-6 p-6 bg-slate-900 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><Utensils className="w-16 h-16 text-white" /></div>
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Verified Profile</p>
                 <h3 className="text-xl font-black text-white uppercase italic">{customerName}</h3>
                 <p className="text-[11px] font-bold text-slate-400 mt-1">{getStandardPhone(customerPhone)}</p>
                 {loyaltyPoints >= (biz?.min_redeem_points || 300) && (
                    <div className="mt-6 flex items-center gap-4">
                       <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                          <p className="text-[8px] font-black text-slate-500 uppercase">Loyalty Points</p>
                          <p className="text-lg font-black text-emerald-400">{loyaltyPoints}</p>
                       </div>
                       <div className="bg-white/5 px-4 py-2 rounded-xl">
                          <p className="text-[8px] font-black text-slate-600 uppercase">Status</p>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">{loyaltyPoints > 500 ? '👑 VIP' : '🌟 Member'}</p>
                       </div>
                    </div>
                 )}
              </div>

              <div className="flex bg-slate-50 p-2 mx-8 mt-6 rounded-[1.5rem] border border-slate-100">
                 <button onClick={() => setOrderTab("tracking")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'tracking' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Tracking</button>
                 <button onClick={() => setOrderTab("history")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'history' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>History</button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                 {orderTab === "tracking" ? (
                   activeOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length === 0 ? <div className="h-40 flex flex-col items-center justify-center opacity-20"><Package className="w-12 h-12 mb-4" /><p className="text-[10px] font-black uppercase tracking-widest">No Active Orders</p></div> : 
                   activeOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').map(order => (
                        <div key={order.id} className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-2xl">
                           <div className="flex items-center justify-between mb-2"><span className="text-[9px] font-black text-slate-400 uppercase">{order.order_reference}</span><div className={`px-2 py-1 rounded-full text-[7px] font-black uppercase ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700 animate-pulse'}`}>{order.status}</div></div>
                           <p className="text-xs font-black text-slate-900 uppercase truncate mb-2">{(typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || [])).map(i => i.name).join(", ")}</p>
                           <p className="text-lg font-black text-slate-900">{symbol}{parseFloat(order.total_price).toFixed(0)}</p>
                        </div>
                   ))
                 ) : (
                   activeOrders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED').length === 0 ? <div className="h-40 flex flex-col items-center justify-center opacity-20"><History className="w-12 h-12 mb-4" /><p className="text-[10px] font-black uppercase tracking-widest">No Past Orders</p></div> : 
                   activeOrders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED').map(order => (
                        <div key={order.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm opacity-80">
                           <div className="flex items-center justify-between mb-2"><span className="text-[9px] font-black text-slate-300 uppercase">{new Date(order.created_at).toLocaleDateString()}</span><span className={`text-[8px] font-black uppercase ${order.status === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-400'}`}>{order.status}</span></div>
                           <p className="text-xs font-black text-slate-900 uppercase truncate">{(typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || [])).map(i => i.name).join(", ")}</p>
                           <p className="text-sm font-black text-slate-400 mt-1">{symbol}{parseFloat(order.total_price).toFixed(0)}</p>
                        </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto lg:p-10 lg:grid lg:grid-cols-[260px_1fr_360px] lg:gap-12 items-start">
          <aside className="hidden lg:block sticky top-32 space-y-2 max-h-[70vh] overflow-y-auto no-scrollbar pr-6">
             <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8 pl-4">Menu</h2>
             {categories.map(cat => <button key={cat} onClick={() => categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className={`w-full text-left px-8 py-5 rounded-[2.5rem] text-[11px] font-black uppercase transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-2xl translate-x-2' : 'text-slate-400 hover:text-slate-900'}`}>{cat}</button>)}
          </aside>
          <div className="bg-white lg:rounded-[3.5rem] lg:shadow-2xl lg:border lg:border-white overflow-hidden min-h-screen">
             <div className="relative">
                {bannerUrl && <div className="w-full h-40 overflow-hidden bg-slate-100 relative"><img src={bannerUrl} className="w-full h-full object-cover" alt="b" /><div className="absolute inset-0 bg-gradient-to-t from-white via-white/50" /></div>}
                <div className="px-10 py-4 flex items-center gap-6 relative -mt-10">
                  <div className="w-20 h-20 rounded-[2.5rem] border-4 border-white shadow-2xl bg-white flex items-center justify-center shrink-0">{logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" alt="l" /> : <Utensils className="w-9 h-9 text-emerald-600 opacity-20" />}</div>
                  <div className="flex-1 min-w-0 pt-10"><h1 className="text-2xl font-black text-slate-900 tracking-tighter truncate uppercase italic">{biz?.name}</h1><p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mt-1 truncate"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {biz?.address || 'Fresh Food Daily'}</p></div>
                </div>
             </div>
             <div className="px-10 py-8 lg:sticky lg:top-0 lg:z-[80] lg:bg-white/90 lg:backdrop-blur-xl"><div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" /><input placeholder="What are you craving?" className="w-full bg-slate-50 border border-slate-100 rounded-[2.2rem] pl-16 pr-8 py-5.5 text-sm font-black text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition-all" value={search} onChange={e => setSearch(e.target.value)} /></div></div>
             <div className="px-10 py-4 pb-20">
                {categories.map(cat => (
                  <div key={cat} ref={el => { categoryRefs.current[cat] = el; }} className="mb-20 scroll-mt-6">
                    <div className="flex items-center gap-6 mb-12"><h2 className="text-[14px] font-black text-slate-950 uppercase tracking-[0.3em] italic">{cat}</h2><div className="flex-1 h-[2px] bg-slate-100 rounded-full" /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-10">
                      {groupedItems[cat].map(item => {
                        const inCart = cart.find(c => c.id === item.id);
                        return (
                          <div key={item.id} className="group flex flex-col bg-white rounded-[2rem] sm:rounded-[3rem] p-3 sm:p-5 transition-all hover:shadow-2xl border border-transparent hover:border-slate-50">
                            <div className="relative aspect-square sm:aspect-[16/11] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-50 mb-3 sm:mb-6">{item.image_url ? <img src={item.image_url.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt="p" /> : <div className="w-full h-full flex items-center justify-center opacity-5"><Utensils className="w-12 h-12" /></div>}<div className="absolute bottom-2 right-2 sm:bottom-5 sm:right-5 px-3 py-1.5 sm:px-6 sm:py-3 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl text-xs sm:text-base font-black text-slate-950 shadow-2xl">{symbol}{item.price}</div></div>
                            <h3 className="px-1 sm:px-4 text-[12px] sm:text-[15px] font-black text-slate-900 leading-tight mb-2 sm:mb-3 uppercase italic tracking-tight line-clamp-2">{item.product_name}</h3>
                            <div className="px-1 sm:px-4 mt-auto">{inCart ? <div className="flex items-center justify-between bg-slate-950 text-white rounded-[1.2rem] sm:rounded-[1.8rem] p-1 h-10 sm:h-14 shadow-2xl"><button onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0))} className="w-8 sm:w-12 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"><Minus className="w-3 sm:w-4 h-3 sm:h-4" /></button><span className="text-[11px] sm:text-[13px] font-black w-6 sm:w-8 text-center">{inCart.qty}</span><button onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} className="w-8 sm:w-12 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"><Plus className="w-3 sm:w-4 h-3 sm:h-4" /></button></div> : <button onClick={() => setCart([...cart, { ...item, qty: 1 }])} className="w-full bg-slate-50 text-slate-500 py-3 sm:py-5 rounded-[1.2rem] sm:rounded-[2rem] font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-500 hover:text-white shadow-sm flex items-center justify-center gap-1 sm:gap-2">Add <Plus className="w-3 sm:w-4 h-3 sm:h-4" /></button>}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <aside className="hidden lg:block sticky top-32 space-y-8">
             <div className="bg-white rounded-[3.5rem] shadow-2xl border border-white p-12">
                {(!customerPhone || customerPhone.length < 5) ? (
                   <div className="space-y-4 mb-10 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Order Details</p>
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        className="w-full bg-white border border-slate-200 px-6 py-4.5 rounded-[1.5rem] text-sm font-bold outline-none focus:border-emerald-500 transition-all"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                      />
                      <div className="flex items-center bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden focus-within:border-emerald-500 transition-all">
                         <select 
                           className="bg-transparent pl-4 pr-1 py-4.5 text-sm font-bold outline-none border-r border-slate-100" 
                           value={countryCode} 
                           onChange={e => setCountryCode(e.target.value)}
                         >
                            {countryCodes.map(c => <option key={c.code} value={c.code}>+{c.code}</option>)}
                         </select>
                         <input 
                           type="tel" 
                           placeholder="Phone Number" 
                           className="flex-1 bg-transparent px-4 py-4.5 text-sm font-bold outline-none" 
                           value={customerPhone}
                           onChange={e => setCustomerPhone(e.target.value)}
                         />
                      </div>
                   </div>
                ) : (
                   <div className="mb-10 bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 className="w-12 h-12 text-white" /></div>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Loyalty Account</p>
                      <h3 className="text-xl font-black text-white uppercase italic truncate pr-10">{customerName || 'Guest'}</h3>
                      <div className="mt-4 flex items-center gap-3">
                         <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/5">
                            <p className="text-[8px] font-black text-slate-500 uppercase">Points Balance</p>
                            <p className="text-lg font-black text-emerald-400">{loyaltyPoints}</p>
                         </div>
                         {loyaltyPoints >= (biz?.min_redeem_points || 300) && pointsToRedeem === 0 && (
                            <button 
                              onClick={handleRedeemRequest}
                              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                            >
                              Redeem
                            </button>
                         )}
                      </div>
                   </div>
                )}

                <div className="flex items-center justify-between mb-12"><h2 className="text-xl font-black text-slate-950 uppercase tracking-tighter flex items-center gap-4"><ShoppingBag className="w-7 h-7 text-emerald-500" /> Checkout</h2><span className="bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{totalCartItems}</span></div>
                {cart.length === 0 ? <div className="py-24 text-center opacity-10 flex flex-col items-center"><ShoppingBag className="w-16 h-16 mb-6" /><p className="text-[12px] font-black uppercase tracking-widest italic">Bag is Empty</p></div> : (
                  <div className="space-y-12">
                     <div className="max-h-[400px] overflow-y-auto no-scrollbar pr-3 space-y-8">{cart.map(ci => <div key={ci.id} className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4"><div className="flex-1 text-left"><p className="text-[12px] font-black text-slate-900 leading-tight mb-1 uppercase italic">{ci.product_name}</p><p className="text-[10px] font-black text-slate-400 uppercase">{symbol}{ci.price} x {ci.qty}</p></div><div className="bg-slate-50 rounded-2xl p-1.5 flex items-center gap-2 border border-slate-100"><button onClick={() => setCart(cart.map(i => i.id === ci.id ? {...i, qty: Math.max(0, i.qty - 1)} : i).filter(i => i.qty > 0))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-500"><Minus className="w-3.5 h-3.5" /></button><span className="text-[11px] font-black text-slate-950 px-2">{ci.qty}</span><button onClick={() => setCart(cart.map(i => i.id === ci.id ? {...i, qty: ci.qty + 1} : i))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-500"><Plus className="w-3.5 h-3.5" /></button></div></div>)}</div>
                     <div className="border-t-2 border-slate-50 pt-10 space-y-5">
                        {loyaltyPoints >= (biz?.min_redeem_points || 300) && pointsToRedeem === 0 && (
                           <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100/50 mb-4">
                              <div className="flex items-center justify-between mb-4">
                                 <div>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Loyalty Rewards</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">You have {loyaltyPoints} points</p>
                                 </div>
                                 <Sparkles className="w-5 h-5 text-emerald-500" />
                              </div>
                              {redemptionStatus === 'PENDING' ? (
                                 <div className="text-center py-2 animate-pulse">
                                    <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest flex items-center justify-center gap-2">
                                       <RefreshCw className="animate-spin w-3 h-3" /> Waiting for WhatsApp...
                                    </p>
                                    <button onClick={() => setRedemptionStatus("IDLE")} className="text-[8px] font-bold text-rose-500 uppercase mt-2 underline">Cancel</button>
                                 </div>
                              ) : (
                                 <button 
                                    onClick={handleRedeemRequest}
                                    className="w-full bg-emerald-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                                 >
                                    <MessageCircle className="w-4 h-4" /> Redeem via WhatsApp
                                 </button>
                              )}
                           </div>
                        )}
                        {pointsToRedeem > 0 && (
                           <div className="flex justify-between text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-lg">
                              <span>Points Applied ({pointsToRedeem})</span>
                              <span>-{symbol}{(pointsToRedeem / (biz?.points_to_amount_ratio || 10)).toFixed(0)}</span>
                           </div>
                        )}

                        <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest"><span>Subtotal</span><span>{symbol}{subtotal.toFixed(0)}</span></div>
                        {fulfillmentMode === 'DELIVERY' && (
                           <div className="flex justify-between text-xs font-black text-emerald-600 uppercase tracking-widest"><span>Delivery</span><span>+{symbol}{(deliveryRadiusStatus.charge || 0).toFixed(0)}</span></div>
                        )}
                        {!taxData.isIncluded && taxData.totalTax > 0 && (
                           <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest"><span>Taxes</span><span>+{symbol}{taxData.totalTax.toFixed(0)}</span></div>
                        )}
                        <div className="flex justify-between text-2xl items-center text-slate-950 font-black pt-8 tracking-tighter uppercase italic"><span>Final</span><span>{symbol}{finalTotal.toFixed(0)}</span></div>
                     </div>
                     <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Payment Method</p>
                        <div className="flex gap-2">
                           {(!biz?.settings?.accepted_payment_methods || biz?.settings?.accepted_payment_methods?.cash) && (
                              <button onClick={() => setPaymentMethod('CASH')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${paymentMethod === 'CASH' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 bg-slate-50 hover:bg-slate-100'}`}>COD / Cash</button>
                           )}
                           {biz?.settings?.accepted_payment_methods?.upi && (
                              <button onClick={() => setPaymentMethod('UPI')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${paymentMethod === 'UPI' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 bg-slate-50 hover:bg-slate-100'}`}>Pay Online / UPI</button>
                           )}
                        </div>
                     </div>
                     <button onClick={placeOrder} disabled={placing} className="w-full bg-slate-950 text-white py-6 rounded-[2.2rem] font-black text-[13px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-5">{placing ? <RefreshCw className="animate-spin w-5 h-5" /> : <>Confirm Order <ChevronRight className="w-5 h-5 text-emerald-500" /></>}</button>
                  </div>
                )}
             </div>
          </aside>
      </div>
      {cart.length > 0 && (
         <div className="lg:hidden fixed bottom-10 left-8 right-8 z-[100] animate-in slide-in-from-bottom-12 items-center">
            <div className="bg-slate-950 text-white rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-950/50 border border-white/10">
               {fulfillmentMode === 'DELIVERY' && (
                  <div className="px-10 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
                     <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Delivery Charge Applied</span>
                     <span className="text-[11px] font-black text-emerald-400">+{symbol}{(deliveryRadiusStatus.charge || 0).toFixed(0)}</span>
                  </div>
               )}

               {/* 🛡️ DEFENSIVE LOYALTY SECTION */}
               {(!customerPhone || customerPhone.length < 5 || customerPhone === 'undefined') ? (
                   <div className="px-6 py-5 bg-white/5 border-b border-white/5 space-y-3">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Identify for Rewards</p>
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full bg-white/10 border border-white/10 px-5 py-3 rounded-2xl text-xs font-bold text-white outline-none focus:border-emerald-500"
                        value={customerName || ''}
                        onChange={e => setCustomerName(e.target.value)}
                      />
                      <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl overflow-hidden focus-within:border-emerald-500/50 transition-all">
                        <select 
                          className="bg-transparent pl-3 pr-1 py-3 text-[10px] font-bold text-white outline-none border-r border-white/5" 
                          value={countryCode} 
                          onChange={e => setCountryCode(e.target.value)}
                        >
                            {countryCodes.map(c => <option key={c.code} value={c.code} className="bg-slate-900 text-white">+{c.code}</option>)}
                        </select>
                        <input 
                          type="tel" 
                          placeholder="Phone Number" 
                          className="flex-1 bg-transparent px-3 py-3 text-[10px] font-bold text-white outline-none placeholder:text-white/30" 
                          value={customerPhone || ''}
                          onChange={e => setCustomerPhone(e.target.value)}
                        />
                      </div>
                   </div>
                ) : (
                    <div className="px-6 py-5 bg-white/5 border-b border-white/10 space-y-4">
                       <div className="flex items-center justify-between bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Your Rewards</p>
                                <p className="text-[10px] font-black text-white uppercase italic truncate max-w-[100px]">{customerName || 'Loyal Guest'}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Balance</p>
                             <p className="text-sm font-black text-emerald-400">{(loyaltyPoints || 0)} pts</p>
                          </div>
                       </div>
                       
                       {(loyaltyPoints || 0) >= (biz?.min_redeem_points || 300) && pointsToRedeem === 0 && (
                          <button 
                            onClick={handleRedeemRequest}
                            className="w-full py-4 rounded-[1.5rem] bg-emerald-500 text-slate-950 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <Gift className="w-4 h-4" /> Redeem Points Now
                          </button>
                       )}

                       {pointsToRedeem > 0 && (
                          <div className="w-full py-3 px-4 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex justify-between items-center">
                             <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Points Applied: {pointsToRedeem}</p>
                             <p className="text-[10px] font-black text-white">-{symbol}{(pointsToRedeem / (biz?.points_to_amount_ratio || 10)).toFixed(0)} Off</p>
                          </div>
                       )}
                    </div>
                 )}
               <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar relative">
                  <div className="absolute top-0 right-2 text-[6px] text-white/5 uppercase">v1.2-loyalty-fix</div>
                  {(!biz?.settings?.accepted_payment_methods || biz?.settings?.accepted_payment_methods?.cash) && (
                     <button onClick={() => setPaymentMethod('CASH')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${paymentMethod === 'CASH' ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'}`}>COD / Cash</button>
                  )}
                  {biz?.settings?.accepted_payment_methods?.upi && (
                     <button onClick={() => setPaymentMethod('UPI')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${paymentMethod === 'UPI' ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-white hover:bg-white/20'}`}>Pay Online</button>
                  )}
               </div>
               <button onClick={() => {
                  if(!customerName || customerPhone.length < 5) return alert("Please enter your name and valid phone number");
                  placeOrder();
               }} disabled={placing} className="w-full p-5.5 flex items-center justify-between active:scale-95 transition-all">
                  <div className="flex items-center gap-5 pl-4">
                     <div className="relative">
                        <div className="w-14 h-14 bg-white/10 rounded-[1.8rem] flex items-center justify-center"><ShoppingBag className="w-7 h-7 text-emerald-400" /></div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-950"><span className="text-[10px] font-black text-white">{totalCartItems}</span></div>
                     </div>
                     <div className="text-left">
                        <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-0.5">Payable</p>
                        <p className="text-xl font-black">{symbol}{finalTotal.toFixed(0)}</p>
                     </div>
                  </div>
                  <div className="bg-emerald-500 text-slate-950 px-10 py-5 rounded-[2.5rem] flex items-center gap-4 font-black text-[13px] uppercase tracking-widest shadow-2xl">Confirm <ChevronRight className="w-5 h-5" /></div>
               </button>
            </div>
         </div>
      )}
      
      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-[150] lg:hidden">
         <button 
           onClick={() => setShowCategories(true)}
           className="w-14 h-14 bg-white text-slate-900 rounded-full shadow-2xl flex items-center justify-center border border-slate-100 active:scale-90 transition-all"
         >
           <LayoutGrid className="w-6 h-6" />
         </button>

         <a 
           href={`https://wa.me/${biz?.phone || ''}`} 
           target="_blank" 
           rel="noreferrer"
           className="w-14 h-14 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all"
         >
           <MessageCircle className="w-7 h-7" />
         </a>
      </div>
{/* CATEGORIES MODAL */}
      {showCategories && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCategories(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[3rem] shadow-2xl p-8 pb-12 animate-in slide-in-from-bottom-full duration-500">

             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-black text-slate-900 italic">Menu Sections</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Jump to any category</p>
                </div>
                <button onClick={() => setShowCategories(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center active:scale-90 transition-all"><X className="w-5 h-5 text-slate-400" /></button>
             </div>
             <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => {
                      const el = document.getElementById(`cat-${cat}`);
                      if (el) {
                         const offset = 100;
                         const elementPosition = el.getBoundingClientRect().top;
                         const offsetPosition = elementPosition + window.pageYOffset - offset;
                         window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }
                      setShowCategories(false);
                    }}
                    className="p-5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest text-center transition-all border-2 border-transparent hover:border-emerald-100 active:scale-95"
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnlineOrder;
