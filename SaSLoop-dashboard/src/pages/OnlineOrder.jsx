import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../config";
import {
  Plus, Minus, CheckCircle, Utensils, Search,
  X, MapPin, ArrowRight, RefreshCw, ShoppingBag,
  Bike, Store, Clock, Phone, User, Package,
  ChevronLeft, Sparkles, AlertCircle,
  MessageCircle, Activity, Globe
} from "lucide-react";
import { countryCodes } from "../countryCodes";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
});

function MapPicker({ lat, lng, onChange }) {
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
    dragend() {
      const center = map.getCenter();
      onChange(center.lat, center.lng);
    }
  });
  return lat && lng ? <Marker position={[lat, lng]} /> : null;
}

// Inline SVG icons for social platforms not in lucide
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const TwitterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const YoutubeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

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
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loyaltyOtp, setLoyaltyOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [checkingLoyalty, setCheckingLoyalty] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  
  const [view, setView] = useState("auth"); // auth, fulfillment, menu, success, cart (mobile)
  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [deliveryRadiusStatus, setDeliveryRadiusStatus] = useState({ allowed: true, charge: 0 });
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/menu/${bizId}`)
      .then(r => r.json())
      .then(d => { 
        setData(d); 
        setLoading(false); 
        if (d?.items?.length > 0) setActiveCategory(d.items[0].category || "General"); 
        setView("auth");
      })
      .catch(e => { console.error(e); setLoading(false); });
  }, [bizId]);

  const biz = data?.business;
  const symbol = biz?.currency_code === 'INR' ? '₹' : (biz?.currency_code === 'USD' ? '$' : '₹');
  const logoUrl = biz?.logo_url ? (biz.logo_url.startsWith("http") ? biz.logo_url : `${API_BASE}${biz.logo_url}`) : null;
  const bannerUrl = biz?.banner_url ? (biz.banner_url.startsWith("http") ? biz.banner_url : `${API_BASE}${biz.banner_url}`) : null;

  const bizPhone = useMemo(() => {
    const raw = biz?.whatsapp_number || biz?.phone || "";
    return raw.replace(/\D/g, "");
  }, [biz]);

  const socialLinks = useMemo(() => {
    if (!biz) return [];
    const links = [];
    if (biz.social_instagram) links.push({ url: biz.social_instagram, icon: <InstagramIcon />, label: 'Instagram' });
    if (biz.social_facebook) links.push({ url: biz.social_facebook, icon: <FacebookIcon />, label: 'Facebook' });
    if (biz.social_twitter) links.push({ url: biz.social_twitter, icon: <TwitterIcon />, label: 'X' });
    if (biz.social_youtube) links.push({ url: biz.social_youtube, icon: <YoutubeIcon />, label: 'YouTube' });
    if (biz.social_website) links.push({ url: biz.social_website, icon: <Globe className="w-4 h-4" />, label: 'Website' });
    return links;
  }, [biz]);

  const filteredItems = useMemo(() => {
    return (data?.items || []).filter(i => 
      i.product_name.toLowerCase().includes(search.toLowerCase()) || 
      (i.description || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => { 
      const cat = item.category || "General"; 
      if (!acc[cat]) acc[cat] = []; 
      acc[cat].push(item); 
      return acc; 
    }, {});
  }, [filteredItems]);

  const categories = Object.keys(groupedItems);
  const totalCartItems = cart.reduce((acc, i) => acc + i.qty, 0);

  const addToCart = (item) => { setCart(prev => { const existing = prev.find(i => i.id === item.id); if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i); return [...prev, { ...item, qty: 1 }]; }); };
  const removeFromCart = (itemId) => { setCart(prev => { const existing = prev.find(i => i.id === itemId); if (!existing) return prev; if (existing.qty === 1) return prev.filter(i => i.id !== itemId); return prev.map(i => i.id === itemId ? { ...i, qty: i.qty - 1 } : i); }); };

  const subtotal = cart.reduce((acc, i) => acc + (i.qty * i.price), 0);
  const taxData = useMemo(() => {
    let cgst = 0, sgst = 0;
    const cgstRate = parseFloat(biz?.cgst_percent) || 0;
    const sgstRate = parseFloat(biz?.sgst_percent) || 0;
    const isIncluded = biz?.gst_included === true;
    if (!data) return { cgst: 0, sgst: 0, totalTax: 0, isIncluded: true };
    cart.forEach(item => { if (item.tax_applicable === 1 || item.tax_applicable === true) { const t = item.qty * item.price; if (isIncluded) { const r = cgstRate + sgstRate; if (r > 0) { const a = t * (r / (100 + r)); cgst += a * (cgstRate / r); sgst += a * (sgstRate / r); } } else { cgst += (t * cgstRate) / 100; sgst += (t * sgstRate) / 100; } } });
    return { cgst, sgst, totalTax: cgst + sgst, isIncluded };
  }, [cart, data, biz]);

  const ptsRatio = biz?.points_to_amount_ratio || 10;
  const ptsEnabled = biz?.loyalty_enabled !== false;
  const minRedeem = biz?.min_redeem_points || 300;
  const maxRedeem = biz?.max_redeem_per_order || 300;

  const finalTotal = Math.max(0, (taxData.isIncluded ? subtotal : (subtotal + taxData.totalTax)) - (pointsToRedeem / ptsRatio) + (fulfillmentMode === 'DELIVERY' ? deliveryRadiusStatus.charge : 0));

  const checkLoyalty = async () => { 
    if (!customerPhone || customerPhone.length < 5) return; 
    setCheckingLoyalty(true); 
    try { 
      const fullPhone = countryCode + customerPhone.replace(/\D/g, "");
      const res = await fetch(`${API_BASE}/api/public/loyalty/${bizId}/${fullPhone}`); 
      const d = await res.json(); 
      setLoyaltyPoints(d.points || 0); 
    } catch (e) { console.error(e); } 
    finally { setCheckingLoyalty(false); } 
  };

  const [authOtp, setAuthOtp] = useState("");
  const [otpMode, setOtpMode] = useState(false);

  const handleVerify = async () => {
    if (!customerPhone || customerPhone.length < 5) return alert("Valid phone req.");
    setIsVerifying(true);
    try {
        const fullPhone = countryCode + customerPhone.replace(/\D/g, "");
        const res = await fetch(`${API_BASE}/api/public/auth/request-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: bizId, phone: fullPhone })
        });
        const d = await res.json();
        if (d.success) setOtpMode(true);
        else alert(d.error || "Failed to send OTP. Please try again.");
    } catch (e) { alert("Something went wrong"); }
    finally { setIsVerifying(false); }
  };

  const verifyAuthOtp = async () => {
    if (authOtp.length < 6) return alert("Please enter 6-digit code.");
    setIsVerifying(true);
    try {
        const fullPhone = countryCode + customerPhone.replace(/\D/g, "");
        const res = await fetch(`${API_BASE}/api/public/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: bizId, phone: fullPhone, otp: authOtp })
        });
        const d = await res.json();
        if (d.success) {
            await checkLoyalty();
            setView("fulfillment");
        } else alert(d.error || "Invalid OTP");
    } catch (e) { alert("Verification failed"); }
    finally { setIsVerifying(false); }
  };

  const checkServiceability = (lat, lon) => {
    if (!biz?.latitude || !biz?.longitude) return { allowed: true, charge: 0, distance: 0 };
    const R = 6371; 
    const dLat = (lat - biz.latitude) * Math.PI / 180;
    const dLon = (lon - biz.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(biz.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    
    const radius = parseFloat(biz.delivery_radius_km) || 10;
    if (dist > radius) return { allowed: false, charge: 0, distance: dist };
    
    let charge = 0;
    const tiers = biz.delivery_tiers || [];
    const matchedTier = tiers.find(t => dist >= t.min && dist <= t.max);
    if (matchedTier) charge = parseFloat(matchedTier.charge);
    
    return { allowed: true, charge, distance: dist };
  };

  const updateMapLocation = async (lat, lng) => {
    setDeliveryCoords({ lat, lng });
    const res = checkServiceability(lat, lng);
    setDeliveryRadiusStatus(res);
    try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const g = await geoRes.json();
        setCustomerAddress(g.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch (e) { console.error("Geocoding failed"); }
  };

  const handleLocationDetection = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setIsVerifying(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        await updateMapLocation(lat, lng);
        setIsVerifying(false);
    }, (err) => { 
        alert("Please enable location access in your browser settings.");
        setIsVerifying(false); 
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const proceedToMenu = () => {
    if (fulfillmentMode === "DELIVERY") {
        const istTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        const currentStr = `${istTime.getHours().toString().padStart(2, '0')}:${istTime.getMinutes().toString().padStart(2, '0')}`;
        const open = biz?.settings?.openingTime || "00:00";
        const close = biz?.settings?.closingTime || "23:59";
        if (currentStr < open || currentStr > close) {
            return alert(`🕒 Kitchen Closed for Delivery. Delivery hours: ${open} to ${close}.`);
        }
        if (!deliveryCoords) return alert("Please select your location on the map.");
        if (!deliveryRadiusStatus.allowed) return alert("Sorry, we do not deliver to this location.");
    }
    setView("menu");
  };

  const requestLoyaltyOtp = async () => {
    if (!customerPhone || customerPhone.length < 5) return;
    setCheckingLoyalty(true);
    try {
      const fullPhone = countryCode + customerPhone.replace(/\D/g, "");
      const res = await fetch(`${API_BASE}/api/public/loyalty/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: bizId, phone: fullPhone, manual: true })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to generate OTP");
      
      const waLink = `https://wa.me/${bizPhone}?text=${encodeURIComponent('GET OTP')}`;
      window.open(waLink, '_blank');
      setShowOtpInput(true);
    } catch (e) { alert(e.message); }
    finally { setCheckingLoyalty(false); }
  };

  const scrollToCategory = (cat) => { 
    categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
    setActiveCategory(cat); 
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => { 
      entries.forEach(entry => { 
        if (entry.isIntersecting) setActiveCategory(entry.target.dataset.category); 
      }); 
    }, { rootMargin: '-120px 0px -60% 0px', threshold: 0 });
    Object.values(categoryRefs.current).forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [categories.length]);

  const placeOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) return alert("Name and Phone required");
    if (fulfillmentMode === "DELIVERY" && !customerAddress.trim()) return alert("Address required");
    setPlacing(true);
    const fullNumber = countryCode + customerPhone.replace(/\D/g, "");
    try {
      const res = await fetch(`${API_BASE}/api/public/order`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          userId: bizId, 
          tableNumber: "0", 
          items: cart.map(i => ({ name: i.product_name, qty: i.qty, price: i.price, tax_applicable: i.tax_applicable })), 
          subtotal, 
          cgst: taxData.cgst, 
          sgst: taxData.sgst, 
          totalPrice: finalTotal, 
          customerName, 
          customerPhone: fullNumber, 
          pointsToRedeem, 
          loyaltyOtp,
          address: fulfillmentMode === "DELIVERY" ? customerAddress : "Pickup at Store", 
          fulfillmentMode, 
          source: "ONLINE_ORDER" 
        }) 
      });
      const orderData = await res.json();
      if (res.ok) { 
        setOrderRef(orderData.orderRef); 
        setFinalPaidAmount(orderData.finalPrice || 0); 
        setView("confirmed"); 
        setCart([]); 
      } else alert(orderData.error || "Failed to place order.");
    } catch (err) { console.error(err); alert("Something went wrong."); }
    finally { setPlacing(false); }
  };

  const openWhatsApp = () => { 
    if (bizPhone) window.open(`https://wa.me/${bizPhone}?text=Hi!`, "_blank"); 
  };

  if (loading) return (<div className="flex flex-col items-center justify-center h-screen bg-white"><Activity className="w-10 h-10 text-emerald-500 animate-spin" /><p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Menu...</p></div>);

  if (view === "auth") return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 z-0 scale-110">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070" 
          alt="background" 
          className="w-full h-full object-cover opacity-20 grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] animate-in fade-in zoom-in duration-700">
        <div className="bg-white/[0.08] backdrop-blur-2xl px-6 py-10 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-white p-3.5 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl active:scale-95 transition-transform">
               {logoUrl ? <img src={logoUrl} alt="logo" className="w-full h-full object-contain rounded-xl" /> : <Utensils className="w-10 h-10 text-emerald-600" />}
            </div>
            
            <h1 className="text-3xl font-black text-white tracking-tight mb-1.5 px-2 uppercase">Order Online</h1>
            <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-[0.2em] mb-8 truncate px-4">Welcome to {biz?.name || 'our store'}</p>

            <div className="space-y-4">
               {!otpMode ? (
                 <div className="flex gap-2">
                    <div className="relative">
                      <select 
                        value={countryCode} 
                        onChange={e => setCountryCode(e.target.value)} 
                        className="w-[70px] bg-white/5 border border-white/10 pl-3 pr-1 py-4 rounded-2xl text-xs font-black text-white outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                      >
                         {countryCodes.map(c => <option key={`${c.iso}-${c.code}`} value={c.code} className="text-slate-900 font-bold">+{c.code}</option>)}
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <ChevronLeft className="-rotate-90 w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <input 
                        type="tel" 
                        value={customerPhone} 
                        onChange={e => setCustomerPhone(e.target.value)} 
                        placeholder="Mobile Number" 
                        className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-base font-black text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all tracking-widest" 
                      />
                    </div>
                 </div>
               ) : (
                 <div className="animate-in slide-in-from-bottom-4 duration-500 text-center">
                    <input 
                      type="text" 
                      value={authOtp} 
                      onChange={e => setAuthOtp(e.target.value)} 
                      placeholder="CODE" 
                      maxLength={6}
                      className="w-full bg-white/10 border-2 border-emerald-500/20 px-4 py-5 rounded-3xl text-3xl font-black text-white placeholder:text-white/10 outline-none focus:border-emerald-500/50 transition-all tracking-[0.5em] text-center" 
                    />
                    <button onClick={() => setOtpMode(false)} className="mt-4 text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-all underline underline-offset-4 decoration-emerald-500/20">Change Phone Number</button>
                 </div>
               )}

               <button 
                 onClick={otpMode ? verifyAuthOtp : handleVerify} 
                 disabled={isVerifying} 
                 className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black py-4 rounded-[1.5rem] shadow-lg shadow-emerald-500/10 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-[0.97] mt-2 group"
               >
                  {isVerifying ? <RefreshCw className="animate-spin w-4 h-4" /> : (
                    <>
                      {otpMode ? "Verify & Enter" : "Send WhatsApp OTP"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
               </button>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-5 opacity-30">
               <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Safe</span>
               </div>
               <div className="w-1 h-1 bg-white/20 rounded-full" />
               <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">VIP</span>
               </div>
            </div>
        </div>
        <p className="mt-8 text-center text-[8px] font-bold text-white/20 uppercase tracking-[0.4em]">Powered by SaSLoop</p>
      </div>
    </div>
  );

  if (view === "fulfillment") return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-8">
       <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-2xl font-black text-slate-900 mb-1.5 uppercase tracking-tight">Order Type</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8 text-center">How would you like to receive your food?</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
             {[
               { id: 'PICKUP', icon: <Store className="w-5 h-5"/> , label: 'Pickup', sub: 'Takeaway' }, 
               { id: 'DELIVERY', icon: <Bike className="w-5 h-5"/> , label: 'Delivery', sub: 'To home' }
             ].filter(m => (biz?.fulfillment_options ? biz.fulfillment_options[m.id.toLowerCase()] : true)).map(m => (
                <button 
                  key={m.id} 
                  onClick={() => setFulfillmentMode(m.id)} 
                  className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-4 text-left group active:scale-[0.98] ${fulfillmentMode === m.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-slate-50/30'}`}
                >
                   <div className={`p-3 rounded-2xl transition-all duration-300 ${fulfillmentMode === m.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-300 shadow-sm'}`}>{m.icon}</div>
                   <div>
                      <h3 className={`font-black text-xs uppercase tracking-tight ${fulfillmentMode === m.id ? 'text-emerald-900' : 'text-slate-700'}`}>{m.label}</h3>
                      <p className={`text-[8px] font-bold uppercase transition-colors ${fulfillmentMode === m.id ? 'text-emerald-600/60' : 'text-slate-400'}`}>{m.sub}</p>
                   </div>
                </button>
             ))}
          </div>

          {fulfillmentMode === 'DELIVERY' && (
             <div className="mb-8 space-y-4 animate-in slide-in-from-top-4">
                <div className="bg-slate-50/30 rounded-[2rem] p-4 border border-dashed border-slate-200">
                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Pin Your Delivery Spot</h4>
                   
                   <div className="h-[280px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative mb-4">
                      <MapContainer 
                        center={deliveryCoords ? [deliveryCoords.lat, deliveryCoords.lng] : [biz?.latitude || 20, biz?.longitude || 77]} 
                        zoom={14} 
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapPicker lat={deliveryCoords?.lat} lng={deliveryCoords?.lng} onChange={updateMapLocation} />
                        {biz?.latitude && biz?.longitude && (
                          <Circle 
                            center={[biz.latitude, biz.longitude]} 
                            radius={(parseFloat(biz.delivery_radius_km) || 10) * 1000} 
                            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1, weight: 1 }} 
                          />
                        )}
                      </MapContainer>
                      
                      <button 
                        onClick={handleLocationDetection} 
                        className="absolute bottom-4 right-4 z-[1000] p-3 bg-white rounded-xl shadow-lg border border-slate-100 text-emerald-600 active:scale-95 transition-all"
                      >
                        {isVerifying ? <RefreshCw className="animate-spin w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                      </button>
                   </div>

                   <p className="text-[10px] text-slate-500 font-medium px-2 mb-4 text-center line-clamp-2">📍 {customerAddress || "Drop pin on map or use GPS button"}</p>

                   {deliveryCoords && (
                     <div className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${deliveryRadiusStatus.allowed ? 'bg-emerald-100/50 border-emerald-200' : 'bg-red-100/50 border-red-200'}`}>
                        {deliveryRadiusStatus.allowed ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <p className="text-[9px] font-black text-emerald-700 uppercase">Serviceable • {deliveryRadiusStatus.distance?.toFixed(1)}km away</p>
                            {deliveryRadiusStatus.charge > 0 && <span className="ml-auto text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-lg">Delivery: {symbol}{deliveryRadiusStatus.charge}</span>}
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-red-600 shrink-0" />
                            <p className="text-[9px] font-black text-red-700 uppercase">Out of Range ({deliveryRadiusStatus.distance?.toFixed(1)}km)</p>
                          </>
                        )}
                     </div>
                   )}
                </div>
             </div>
          )}

          <button 
            onClick={proceedToMenu} 
            disabled={fulfillmentMode === 'DELIVERY' && !deliveryRadiusStatus.allowed}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-500/20 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30 group"
          >
             Start Ordering <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
       </div>
    </div>
  );

  if (view === "confirmed") return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-5 border border-emerald-100 shadow-xl shadow-emerald-500/10"><CheckCircle className="w-8 h-8 text-emerald-500" /></div>
      <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-0.5 uppercase">Order Placed</h1>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-8">Preparing your delicious meal</p>
      
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full mb-8 shadow-2xl shadow-slate-200/50 border border-white">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-50">Order Reference</p>
        <p className="text-3xl font-black text-emerald-600 tracking-tighter mb-8 bg-emerald-50/50 py-3 rounded-2xl font-mono">{orderRef}</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1"><div className="w-10 h-10 bg-slate-50 mx-auto rounded-xl flex items-center justify-center">{fulfillmentMode === "DELIVERY" ? <Bike className="w-4 h-4 text-slate-400" /> : <Store className="w-4 h-4 text-slate-400" />}</div><p className="text-[7px] font-black text-slate-300 uppercase truncate">Type</p><p className="text-[9px] font-black text-slate-700 uppercase">{fulfillmentMode}</p></div>
          <div className="space-y-1"><div className="w-10 h-10 bg-slate-50 mx-auto rounded-xl flex items-center justify-center"><Clock className="w-4 h-4 text-slate-400" /></div><p className="text-[7px] font-black text-slate-300 uppercase truncate">Time</p><p className="text-[9px] font-black text-slate-700">~20 MIN</p></div>
          <div className="space-y-1"><div className="w-10 h-10 bg-slate-50 mx-auto rounded-xl flex items-center justify-center"><Package className="w-4 h-4 text-slate-400" /></div><p className="text-[7px] font-black text-slate-300 uppercase truncate">Bill</p><p className="text-[9px] font-black text-slate-700">{symbol}{finalPaidAmount.toFixed(0)}</p></div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 w-full max-w-xs px-4">
        <button onClick={openWhatsApp} className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"><MessageCircle className="w-4 h-4 fill-current" /> Updates on WhatsApp</button>
        <button onClick={() => { setView("menu"); setPointsToRedeem(0); setLoyaltyPoints(0); }} className="text-slate-400 font-black text-[9px] uppercase tracking-widest py-2 hover:text-emerald-500">Order More</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white lg:bg-slate-50/50 selection:bg-emerald-500/30 pb-32 lg:pb-10 font-sans">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{loyaltyPoints} LOYALTY PTS</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Mode</p>
                 <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{fulfillmentMode}</p>
              </div>
              <button 
                onClick={() => setView("fulfillment")} 
                className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all active:scale-90"
              >
                 {fulfillmentMode === 'DELIVERY' ? <Bike className="w-5 h-5 text-slate-500" /> : <Store className="w-5 h-5 text-slate-500" />}
              </button>
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto lg:p-6 lg:mt-4">
        <div className="lg:grid lg:grid-cols-[240px_1fr_340px] lg:gap-8 items-start">
          
          <aside className="hidden lg:block sticky top-28 space-y-2 max-h-[70vh] overflow-y-auto no-scrollbar pr-4">
             <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 pl-2">Categories</h2>
             {categories.map(cat => (
               <button 
                 key={cat} 
                 onClick={() => scrollToCategory(cat)} 
                 className={`w-full text-left px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-1 px-6' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
               >
                 {cat}
               </button>
             ))}
          </aside>

          <div className="bg-white lg:rounded-[2.5rem] lg:shadow-2xl lg:shadow-slate-200/50 lg:border lg:border-white overflow-hidden min-h-screen relative">
             <div className="relative">
                {bannerUrl && (
                  <div className="w-full h-36 sm:h-48 lg:h-56 overflow-hidden bg-slate-100 relative">
                    <img src={bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  </div>
                )}
                <div className="px-6 py-4 flex items-center gap-4 relative -mt-8 sm:-mt-10">
                  {logoUrl && <img src={logoUrl} alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-[1.8rem] object-cover border-4 border-white shadow-2xl bg-white" />}
                  <div className="flex-1 min-w-0 pt-6 sm:pt-8 text-left">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight truncate uppercase">{biz?.name}</h1>
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1 truncate">
                       <MapPin className="w-3 h-3 text-emerald-500" /> {biz?.address}
                    </p>
                  </div>
                </div>
             </div>

             <div className="px-6 py-4 sticky top-[65px] lg:top-0 z-[80] bg-white lg:bg-white/90 lg:backdrop-blur-md">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    placeholder="Search your favorite dishes..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-11 pr-5 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                  />
                </div>

                <div className="lg:hidden flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                   {categories.map(cat => (<button key={cat} onClick={() => scrollToCategory(cat)} className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeCategory === cat ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>{cat}</button>))}
                </div>
             </div>

             <div className="px-6 py-4">
                {categories.map(cat => (
                  <div key={cat} ref={el => { categoryRefs.current[cat] = el; if (el) el.dataset.category = cat; }} className="mb-12 scroll-mt-40 lg:scroll-mt-10">
                    <div className="flex items-center gap-3 mb-6">
                       <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">{cat}</h2>
                       <div className="flex-1 h-[2px] bg-slate-50 rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                      {groupedItems[cat].map(item => {
                        const inCart = cart.find(c => c.id === item.id);
                        const fullImgUrl = item.image_url?.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`;
                        return (
                          <div key={item.id} className="group flex flex-col bg-slate-50/50 hover:bg-white rounded-[2rem] border border-slate-100 hover:border-emerald-500 p-3 transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1">
                            <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-200 mb-3 cursor-pointer" onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}>
                              {item.image_url ? <img src={fullImgUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={item.product_name} /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Utensils className="w-8 h-8" /></div>}
                              <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-xs font-black text-slate-900 shadow-sm">{symbol}{item.price}</div>
                              <div className={`absolute top-3 left-3 w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-white/80 ${item.is_veg ? 'border-emerald-500' : 'border-red-500'}`}><div className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? 'bg-emerald-500' : 'bg-red-500'}`} /></div>
                            </div>

                            <div className="px-2 flex-1 flex flex-col">
                              <h3 className="text-sm font-black text-slate-800 leading-tight mb-2 tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{item.product_name}</h3>
                              {item.description && <p className="text-[10px] text-slate-400 font-medium mb-4 line-clamp-2 leading-relaxed flex-1">{item.description}</p>}
                              
                              <div className="mt-auto pt-2">
                                 {inCart ? (
                                   <div className="flex items-center justify-between bg-slate-900 text-white rounded-2xl p-1 h-12 shadow-lg animate-in zoom-in">
                                     <button onClick={() => removeFromCart(item.id)} className="w-10 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"><Minus className="w-4 h-4" /></button>
                                     <span className="text-xs font-black">{inCart.qty}</span>
                                     <button onClick={() => addToCart(item)} className="w-10 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"><Plus className="w-4 h-4" /></button>
                                   </div>
                                 ) : (
                                   <button 
                                     onClick={() => addToCart(item)} 
                                     className="w-full bg-white border border-slate-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-slate-400 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                                   >
                                      Add to Cart <Plus className="w-3 h-3" />
                                   </button>
                                 )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <aside className="hidden lg:block sticky top-28 space-y-6">
             <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-emerald-500" /> Your Tray
                   </h2>
                   <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{totalCartItems} Items</span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-12 text-center opacity-20">
                     <ShoppingBag className="w-14 h-14 mx-auto mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Hungry? Add some food!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                     <div className="max-h-[350px] overflow-y-auto no-scrollbar pr-2 space-y-4">
                        {cart.map(ci => (
                          <div key={ci.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2">
                             <div className="flex-1 text-left">
                                <p className="text-[11px] font-black text-slate-800 leading-tight mb-0.5 uppercase">{ci.product_name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{symbol}{ci.price} x {ci.qty}</p>
                             </div>
                             <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100">
                                <button onClick={() => removeFromCart(ci.id)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500"><Minus className="w-3 h-3" /></button>
                                <span className="text-[10px] font-black text-slate-800">{ci.qty}</span>
                                <button onClick={() => addToCart(ci)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-emerald-500"><Plus className="w-3 h-3" /></button>
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="border-t-2 border-slate-50 pt-6 space-y-3">
                        <div className="flex justify-between text-[11px] items-center text-slate-400 font-bold uppercase tracking-widest">
                           <span>Subtotal</span>
                           <span>{symbol}{subtotal.toFixed(2)}</span>
                        </div>
                        {fulfillmentMode === 'DELIVERY' && (
                           <div className="flex justify-between text-[11px] items-center text-slate-400 font-bold uppercase tracking-widest">
                              <span>Delivery</span>
                              <span className="text-emerald-600">+{symbol}{deliveryRadiusStatus.charge.toFixed(2)}</span>
                           </div>
                        )}
                        {(taxData.cgst + taxData.sgst) > 0 && (
                           <div className="flex justify-between text-[11px] items-center text-slate-400 font-bold uppercase tracking-widest">
                              <span>GST Tax</span>
                              <span>{symbol}{(taxData.cgst + taxData.sgst).toFixed(2)}</span>
                           </div>
                        )}
                        {pointsToRedeem > 0 && (
                           <div className="flex justify-between text-[11px] items-center text-emerald-600 font-black uppercase tracking-widest">
                              <span>Reward Used</span>
                              <span>-{symbol}{(pointsToRedeem/ptsRatio).toFixed(2)}</span>
                           </div>
                        )}
                        <div className="flex justify-between text-xl items-center text-slate-900 font-black pt-4 tracking-tighter uppercase">
                           <span>Total</span>
                           <span>{symbol}{finalTotal.toFixed(2)}</span>
                        </div>
                     </div>

                     <button onClick={placeOrder} className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4">
                        Place Order Now <ArrowRight className="w-4 h-4 text-emerald-400" />
                     </button>
                  </div>
                )}
             </div>
          </aside>
        </div>
      </main>

      {/* Floating Bottom Cart (Mobile Only) */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
           <button 
             onClick={placeOrder} 
             className="w-full bg-slate-900 text-white rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl shadow-slate-900/40 border border-white/10 active:scale-[0.97] transition-all"
           >
              <div className="flex items-center gap-3 pl-2">
                 <div className="relative">
                   <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-emerald-400" />
                   </div>
                   <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                      <span className="text-[9px] font-black text-white leading-none">{totalCartItems}</span>
                   </div>
                 </div>
                 <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-0.5">Total Amount</p>
                    <p className="text-base font-black tracking-tight">{symbol}{finalTotal.toFixed(2)}</p>
                 </div>
              </div>
              <div className="bg-emerald-500 text-slate-900 px-6 py-3 rounded-[1.5rem] flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg">
                 Place Order <ArrowRight className="w-4 h-4" />
              </div>
           </button>
        </div>
      )}
    </div>
  );
}

export default OnlineOrder;
