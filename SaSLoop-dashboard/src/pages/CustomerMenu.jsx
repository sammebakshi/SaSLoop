import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../config";
import { 
  MessageCircle, Plus, Minus, CheckCircle, Utensils, Search,
  LayoutGrid, X, MapPin, ArrowRight, RefreshCw, ShoppingBag,
  Activity, Bike, Store, User, Globe, Sparkles
} from "lucide-react";
import { countryCodes } from "../countryCodes";

const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const TwitterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const YoutubeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

function CustomerMenu() {
  const { bizId, tableId } = useParams();
  const [data, setData] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("browsing");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [view, setView] = useState("auth"); // auth, menu, ordered
  const [placing, setPlacing] = useState(false);

  const [fulfillmentMode, setFulfillmentMode] = useState(tableId && tableId !== "0" ? "DINEIN" : "");
  const [manualTableNo, setManualTableNo] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showModeSelector, setShowModeSelector] = useState(tableId === "0");

  const [customerPhone, setCustomerPhone] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loyaltyOtp, setLoyaltyOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [checkingLoyalty, setCheckingLoyalty] = useState(false);
  const categoryRefs = useRef({});

  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/menu/${bizId}`)
      .then(r => {
        if (!r.ok) throw new Error("Business or Menu not found");
        return r.json();
      })
      .then(d => { 
        setData(d); 
        setLoading(false); 
        if (d?.items?.length > 0) setActiveCategory(d.items[0].category || "General"); 
        // If auth is not required by business, skip to menu (or keep mandatory as per user request)
        if (d?.business?.is_auth_required === false && !tableId) setView("menu");
        // For Table QR, user EXPLICITLY asked for mandatory mobile auth first
        if (tableId && tableId !== "0") setView("auth");
      })
      .catch(e => {
        console.error(e);
        setError(e.message);
        setLoading(false);
      });
  }, [bizId, tableId]);

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
    return (data?.items || []).filter(i => i.product_name.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, current) => { const cat = current.category || "General"; if (!acc[cat]) acc[cat] = []; acc[cat].push(current); return acc; }, {});
  }, [filteredItems]);

  const categories = Object.keys(groupedItems);

  const scrollToCategory = (cat) => { categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveCategory(cat); setShowCategoryMenu(false); };
  const addToCart = (item) => { setCart(prev => { const existing = prev.find(i => i.id === item.id); if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i); return [...prev, { ...item, qty: 1 }]; }); };
  const removeFromCart = (itemId) => { setCart(prev => { const existing = prev.find(i => i.id === itemId); if (!existing) return prev; if (existing.qty === 1) return prev.filter(i => i.id !== itemId); return prev.map(i => i.id === itemId ? { ...i, qty: i.qty - 1 } : i); }); };

  const checkLoyalty = async () => { 
    if (!customerPhone || customerPhone.length < 5) return; 
    setCheckingLoyalty(true); 
    try { 
      const fullPhone = countryCode + customerPhone.replace(/\D/g, "");
      const res = await fetch(`${API_BASE}/api/public/loyalty/${bizId}/${fullPhone}`); 
      const d = await res.json(); 
      setLoyaltyPoints(d.points || 0); 
    } catch (e) { console.error(e); } finally { 
      setCheckingLoyalty(false); 
    } 
  };

  const handleVerify = async () => {
    if (!customerPhone || customerPhone.length < 5) return alert("Please enter a valid phone number.");
    setIsVerifying(true);
    await checkLoyalty();
    setIsVerifying(false);
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

  const finalTotal = Math.max(0, (taxData.isIncluded ? subtotal : (subtotal + taxData.totalTax)) - (ptsEnabled ? (pointsToRedeem / ptsRatio) : 0));

  const placeOrder = () => {
    if (!bizPhone) return alert("Business phone not set.");
    setOrderStatus("ordered");
    const tNo = fulfillmentMode === "DINEIN" ? (tableId && tableId !== "0" ? tableId : manualTableNo) : "0";
    const addressStr = fulfillmentMode === "DELIVERY" ? customerAddress : (fulfillmentMode === "PICKUP" ? "Pickup at Store" : `Dine-In (Table ${tNo})`);

    const fullNumber = countryCode + customerPhone.replace(/\D/g, "");
    fetch(`${API_BASE}/api/public/order`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ 
        userId: bizId, 
        tableNumber: tNo, 
        items: cart.map(i => ({ name: i.product_name, qty: i.qty, price: i.price, tax_applicable: i.tax_applicable })), 
        subtotal, 
        cgst: taxData.cgst, 
        sgst: taxData.sgst, 
        totalPrice: finalTotal, 
        customerName: "QR Guest", 
        customerPhone: fullNumber, 
        pointsToRedeem, 
        loyaltyOtp,
        address: addressStr 
      }) 
    })
    .then(async r => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Order failed");
      return d;
    })
    .then(() => {
      const tNo = fulfillmentMode === "DINEIN" ? (tableId && tableId !== "0" ? tableId : manualTableNo) : "0";
      const totalMsg = fulfillmentMode === "DINEIN"
        ? `👋 Hi! I just placed an order from Table ${tNo}.`
        : `👋 Hi! I just placed an online order.`;
      
      setTimeout(() => { window.location.href = `https://wa.me/${bizPhone}?text=${encodeURIComponent(totalMsg)}`; setCart([]); setOrderStatus("browsing"); }, 1500);
    })
    .catch((e) => { alert(e.message); setOrderStatus("browsing"); });
  };

  const openWhatsApp = () => { 
    if (bizPhone) window.location.href = `https://wa.me/${bizPhone}?text=Hi!`; 
  };

  if (loading) return (<div className="flex flex-col items-center justify-center h-screen bg-white"><Activity className="w-10 h-10 text-emerald-500 animate-spin" /><p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Menu...</p></div>);
  if (error) return (<div className="flex flex-col items-center justify-center h-screen bg-white"><X className="w-12 h-12 text-rose-500 mb-4" /><h2 className="text-xl font-black text-slate-900 mb-2">Technical Glitch</h2><p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{error}</p></div>);

  if (view === "auth") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-8">
           {logoUrl ? <img src={logoUrl} alt="logo" className="w-12 h-12 rounded-xl object-contain" /> : <Utensils className="w-10 h-10 text-emerald-600" />}
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome to {biz?.name}</h1>
        {tableId && tableId !== "0" && <p className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">Table No: {tableId}</p>}
        
        <div className="w-full max-w-sm space-y-4">
           <p className="text-slate-400 text-sm font-bold leading-relaxed">To view our menu and access your loyalty rewards, please enter your mobile number.</p>
           
           <div className="flex gap-2">
              <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="w-20 bg-slate-50 border border-slate-100 px-2 py-4 rounded-2xl text-sm font-bold outline-none">
                 {countryCodes.map(c => <option key={c.code} value={c.dial_code}>{c.dial_code}</option>)}
              </select>
              <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="00000 00000" className="flex-1 bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-lg font-black tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-200" />
           </div>

           <button onClick={handleVerify} disabled={isVerifying} className="w-full bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-600/20 uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50">
              {isVerifying ? <RefreshCw className="animate-spin w-5 h-5" /> : <><Sparkles className="w-5 h-5" /> Let's Go</>}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 relative pb-32 selection:bg-emerald-500/30">

      {/* BANNER WITH LOGO + SOCIAL */}
      <div className="bg-white border-b border-slate-200">
        {bannerUrl && (
          <div className="w-full h-32 md:h-48 overflow-hidden bg-slate-100">
            <img src={bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="px-5 py-5 flex items-center gap-4">
          {logoUrl && <img src={logoUrl} alt="Logo" className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" />}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight truncate">{biz?.name}</h1>
            <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5 truncate"><MapPin className="w-3 h-3 text-emerald-500 shrink-0" /> {biz?.address || "Available at store"}</p>
          </div>
          {fulfillmentMode === "DINEIN" && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5 text-center shrink-0">
              <p className="text-[8px] uppercase font-bold text-emerald-600 leading-none mb-0.5">Table</p>
              <p className="text-lg font-black text-emerald-700 leading-none">{tableId && tableId !== "0" ? tableId : (manualTableNo || '?')}</p>
            </div>
          )}
        </div>
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-2 px-5 pb-4">
            {socialLinks.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all" title={s.label}>{s.icon}</a>
            ))}
          </div>
        )}
      </div>

      {/* FULFILLMENT MODE SELECTOR */}
      {showModeSelector && (
        <div className="fixed inset-0 z-[500] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 pb-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Utensils className="w-7 h-7 text-emerald-600" /></div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Welcome!</h2>
              <p className="text-xs font-medium text-slate-400 mt-1">How would you like to order today?</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: 'DINEIN', label: 'Dine-In', sub: 'I am sitting at a table', icon: Utensils },
                { id: 'PICKUP', label: 'Takeaway / Pickup', sub: 'I will collect it myself', icon: ShoppingBag },
                { id: 'DELIVERY', label: 'Home Delivery', sub: 'Bring it to my doorstep', icon: Bike }
              ].map(m => (
                <button key={m.id} onClick={() => setFulfillmentMode(m.id)} className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${fulfillmentMode === m.id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-emerald-200'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fulfillmentMode === m.id ? 'bg-white/20' : 'bg-white shadow-sm border border-slate-100'}`}><m.icon className={`w-5 h-5 ${fulfillmentMode === m.id ? 'text-white' : 'text-emerald-500'}`} /></div>
                  <div><p className="font-black text-sm tracking-tight leading-none mb-0.5">{m.label}</p><p className={`text-[10px] font-medium opacity-60 leading-none ${fulfillmentMode === m.id ? 'text-white' : 'text-slate-400'}`}>{m.sub}</p></div>
                </button>
              ))}
            </div>
            {fulfillmentMode === 'DINEIN' && (<div className="mt-4"><label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1.5 block pl-1">Which Table are you at?</label><input type="text" placeholder="Enter Table Number" value={manualTableNo} onChange={e => setManualTableNo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" /></div>)}
            {fulfillmentMode === 'DELIVERY' && (<div className="mt-4"><label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1.5 block pl-1">Your Delivery Address</label><textarea placeholder="Full address for delivery..." value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all min-h-[80px] resize-none" /></div>)}
            <button disabled={!fulfillmentMode || (fulfillmentMode === 'DINEIN' && !manualTableNo) || (fulfillmentMode === 'DELIVERY' && !customerAddress)} onClick={() => setShowModeSelector(false)} className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all">Explore Menu</button>
          </div>
        </div>
      )}

      {/* SEARCH STICKY */}
      <div className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input placeholder="Search dishes..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* MENU ITEMS */}
      <div className="px-5 mt-4 pb-40">
        {categories.length === 0 ? (<div className="py-20 text-center text-slate-300 font-bold text-xs uppercase tracking-widest">No Items Found</div>) : (
          categories.map(cat => (
            <div key={cat} ref={el => categoryRefs.current[cat] = el} className="mb-8 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4"><h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">{cat}</h2><span className="text-[9px] font-bold text-slate-300">({groupedItems[cat].length})</span></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {groupedItems[cat].map(item => {
                  const inCart = cart.find(c => c.id === item.id);
                  const fullImgUrl = item.image_url?.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`;
                  return (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col p-2.5 transition-all active:scale-[0.98]">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2.5 group">
                        {item.image_url ? <img src={fullImgUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt={item.product_name} /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Utensils className="w-8 h-8" /></div>}
                      </div>
                      <h3 className="text-[11px] font-black text-slate-800 leading-tight mb-auto line-clamp-2 tracking-tight">{item.product_name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-black text-slate-800">{symbol}{item.price}</p>
                        {inCart ? (
                          <div className="flex items-center bg-emerald-500 text-white rounded-lg overflow-hidden shadow-sm h-7">
                            <button onClick={() => removeFromCart(item.id)} className="w-6 h-full flex items-center justify-center hover:bg-emerald-600"><Minus className="w-3 h-3" /></button>
                            <span className="w-5 text-center text-[10px] font-black">{inCart.qty}</span>
                            <button onClick={() => addToCart(item)} className="w-6 h-full flex items-center justify-center hover:bg-emerald-600"><Plus className="w-3 h-3" /></button>
                          </div>
                        ) : (<button onClick={() => addToCart(item)} className="bg-white border border-emerald-500 text-emerald-600 px-3 h-7 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95">ADD</button>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FABs */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-[200]">
        <button onClick={() => setShowCategoryMenu(!showCategoryMenu)} className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all"><LayoutGrid className="w-5 h-5 mb-0.5" /><span className="text-[6px] font-bold uppercase tracking-tight">Menu</span></button>
        <button onClick={openWhatsApp} className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-90 transition-all"><MessageCircle className="w-6 h-6 fill-current" /></button>
      </div>

      {/* CATEGORY MODAL */}
      {showCategoryMenu && (
        <div className="fixed inset-0 z-[210] bg-black/40 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-black text-slate-800 tracking-tight">Categories</h2><button onClick={() => setShowCategoryMenu(false)} className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100"><X className="w-4 h-4 text-slate-400" /></button></div>
            <div className="grid grid-cols-1 gap-2">
              {categories.map(cat => (<button key={cat} onClick={() => scrollToCategory(cat)} className={`flex items-center justify-between p-4 rounded-xl transition-all ${activeCategory === cat ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-700 border border-slate-100'}`}><span className="font-bold text-xs uppercase tracking-widest">{cat}</span><span className="text-[10px] font-bold opacity-60">{groupedItems[cat].length} Dishes</span></button>))}
            </div>
          </div>
        </div>
      )}

      {/* CART & LOYALTY */}
      {cart.length > 0 && orderStatus === "browsing" && (
        <div className="fixed bottom-4 left-4 right-4 z-[200]">
          <div className="bg-white rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100">
            {!pointsToRedeem && (
              <div className="flex items-center gap-2.5 mb-3 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-600 outline-none max-w-[80px]">
                  {countryCodes.map(c => (
                    <option key={`${c.iso}-${c.code}`} value={c.code}>+{c.code} {c.iso}</option>
                  ))}
                </select>
                <input type="tel" placeholder="Mobile" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="flex-1 bg-transparent text-[10px] font-bold outline-none text-slate-900 placeholder:text-slate-300" />
                {loyaltyPoints > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-emerald-600">{loyaltyPoints} pts</span>
                    {ptsEnabled && loyaltyPoints >= minRedeem ? (
                      <button 
                        onClick={requestLoyaltyOtp} 
                        className={`bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest shadow-sm active:scale-95 transition-all`}
                      >
                        Redeem {Math.min(loyaltyPoints, maxRedeem)}
                      </button>
                    ) : <span className="text-[7px] font-bold text-slate-400 uppercase mx-1">(Min {minRedeem})</span>}
                  </div>
                ) : <button onClick={checkLoyalty} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 text-emerald-500 disabled:opacity-50" disabled={checkingLoyalty}><RefreshCw className={`w-3.5 h-3.5 ${checkingLoyalty ? 'animate-spin' : ''}`} /></button>}
              </div>
            )}

            {showOtpInput && !pointsToRedeem && (
              <div className="mb-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-2 pl-1 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" /> Verify WhatsApp OTP
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP" 
                    value={loyaltyOtp} 
                    onChange={e => setLoyaltyOtp(e.target.value)} 
                    className="flex-1 bg-slate-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                  <button 
                    onClick={() => {
                      if (loyaltyOtp.length === 6) {
                        setPointsToRedeem(Math.min(loyaltyPoints, maxRedeem));
                        setShowOtpInput(false);
                      } else {
                        alert("Please enter a valid 6-digit OTP");
                      }
                    }} 
                    className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
            {pointsToRedeem > 0 && (<div className="flex items-center justify-between mb-3 bg-emerald-500 p-3 rounded-xl text-white shadow-lg shadow-emerald-500/20"><div><p className="text-[9px] font-bold uppercase tracking-widest opacity-70 leading-none mb-0.5">Loyalty Redeemed</p><p className="text-base font-black tracking-tight leading-none">-{symbol}{(pointsToRedeem/ptsRatio).toFixed(2)}</p></div><button onClick={() => setPointsToRedeem(0)} className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"><X className="w-3.5 h-3.5" /></button></div>)}
            <div className="flex items-center justify-between pl-3 pr-1">
              <div className="text-left">
                <p className="font-black text-lg text-slate-800 tracking-tight leading-none">{symbol}{finalTotal.toFixed(2)}</p>
                <p className="text-[8px] font-bold uppercase opacity-40 tracking-widest mt-0.5">{cart.reduce((ac, x) => ac + x.qty, 0)} Items • {taxData.isIncluded ? 'GST Included' : `+ GST (${symbol}${taxData.totalTax.toFixed(2)})`}</p>
              </div>
              <button onClick={placeOrder} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg group">
                <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Place Order</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDERING ANIMATION */}
      {orderStatus === "ordered" && (
        <div className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center p-10 text-center">
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6"><CheckCircle className="w-10 h-10 text-emerald-500" /></div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Confirming Order</h2>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Opening WhatsApp to finalize...</p>
        </div>
      )}
    </div>
  );
}

export default CustomerMenu;
