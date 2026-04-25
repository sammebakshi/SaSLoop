import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../config";
import { 
  Plus, Minus, ShoppingBag, Utensils, Search, 
  X, MapPin, ChevronRight, Clock, Star, 
  RefreshCw, CheckCircle2, Package, History, Activity, MessageCircle, LayoutGrid
} from "lucide-react";
import { countryCodes } from "../countryCodes";

function CustomerMenu() {
  const { bizId, tableId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCategories, setShowCategories] = useState(false);
  const categoryRefs = useRef({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [orderRef, setOrderRef] = useState("");
  const [finalPaidAmount, setFinalPaidAmount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loyaltyOtp, setLoyaltyOtp] = useState("");
  
  const [view, setView] = useState("auth"); 
  const [activeOrders, setActiveOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [orderTab, setOrderTab] = useState("tracking"); // "tracking" or "history"

  const [isVerifying, setIsVerifying] = useState(false);
  const [authOtp, setAuthOtp] = useState("");
  const [otpMode, setOtpMode] = useState(false);

  const getStandardPhone = () => {
    // 1. Strip everything except digits from both parts
    const rawDigits = (customerPhone || "").replace(/\D/g, "");
    const codeDigits = (countryCode || "91").replace(/\D/g, "");
    
    // 2. If the user already typed the country code into the phone box, don't double it
    if (rawDigits.startsWith(codeDigits) && rawDigits.length > codeDigits.length) {
      return "+" + rawDigits;
    }
    
    // 3. Otherwise combine them with a single +
    return "+" + codeDigits + rawDigits;
  };

  const biz = data?.business;
  const symbol = biz?.currency_code === 'INR' ? '₹' : (biz?.currency_code === 'USD' ? '$' : '₹');
  const logoUrl = biz?.logo_url ? (biz.logo_url.startsWith("http") ? biz.logo_url : `${API_BASE}${biz.logo_url}`) : null;
  const bannerUrl = biz?.banner_url ? (biz.banner_url.startsWith("http") ? biz.banner_url : `${API_BASE}${biz.banner_url}`) : null;

  const subtotal = cart.reduce((acc, i) => acc + (i.qty * i.price), 0);
  const taxData = useMemo(() => {
    let cgst = 0, sgst = 0;
    const cgstR = parseFloat(biz?.cgst_percent) || 0;
    const sgstR = parseFloat(biz?.sgst_percent) || 0;
    const isInc = biz?.gst_included === true;
    if (!data) return { cgst: 0, sgst: 0, totalTax: 0, isIncluded: true };
    cart.forEach(item => {
      if (item.tax_applicable === 1 || item.tax_applicable === true) {
        const t = item.qty * item.price;
        if (isInc) {
          const r = cgstR + sgstR;
          if (r > 0) { const a = t * (r / (100 + r)); cgst += a * (cgstR / r); sgst += a * (sgstR / r); }
        } else {
          cgst += (t * cgstR) / 100; sgst += (t * sgstR) / 100;
        }
      }
    });
    return { cgst, sgst, totalTax: cgst + sgst, isIncluded: isInc };
  }, [cart, data, biz]);

  const finalTotal = Math.max(0, (taxData.isIncluded ? subtotal : (subtotal + taxData.totalTax)) - (pointsToRedeem / (biz?.points_to_amount_ratio || 10)));
  const filteredItems = useMemo(() => (data?.items || []).filter(i => i.product_name.toLowerCase().includes(search.toLowerCase())), [data, search]);
  const groupedItems = useMemo(() => filteredItems.reduce((acc, current) => { const cat = current.category || "General"; if (!acc[cat]) acc[cat] = []; acc[cat].push(current); return acc; }, {}), [filteredItems]);
  const categories = Object.keys(groupedItems);
  const totalCartItems = cart.reduce((acc, i) => acc + i.qty, 0);

  const fetchActiveOrders = async () => {
    if (!customerPhone) return;
    try {
      const std = getStandardPhone();
      const res = await fetch(`${API_BASE}/api/public/orders/${bizId}/${encodeURIComponent(std)}`);
      const d = await res.json();
      setActiveOrders(d || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/public/menu/${bizId}`).then(r => r.json()).then(d => { setData(d); setLoading(false); if (d.items?.length > 0) setActiveCategory(d.items[0].category || "General"); });
  }, [bizId]);

  useEffect(() => {
    if (view !== "auth") {
      fetchActiveOrders();
      const itv = setInterval(fetchActiveOrders, 10000);
      return () => clearInterval(itv);
    }
  }, [view, customerPhone]);

  const handleRequestOtp = async () => {
    if (!customerName.trim() || !customerPhone.trim()) return alert("Name and Phone are required.");
    setIsVerifying(true);
    try {
        const fullPhone = getStandardPhone();
        const res = await fetch(`${API_BASE}/api/public/auth/request-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: bizId, phone: fullPhone })
        });
        const d = await res.json();
        if (d.success) setOtpMode(true);
        else alert(d.error || "Failed to send code.");
    } finally { setIsVerifying(false); }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    try {
        const fullPhone = getStandardPhone();
        const res = await fetch(`${API_BASE}/api/public/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: bizId, phone: fullPhone, otp: authOtp })
        });
        const d = await res.json();
        if (d.success) {
            checkLoyalty();
            setView("menu");
            fetchActiveOrders(); // Immediately fetch orders
        } else alert(d.error || "Invalid Code");
    } finally { setIsVerifying(false); }
  };

  const checkLoyalty = async () => {
    try {
      const std = getStandardPhone();
      const res = await fetch(`${API_BASE}/api/public/loyalty/${bizId}/${encodeURIComponent(std)}`);
      const d = await res.json();
      setLoyaltyPoints(d.points || 0);
    } catch (e) {}
  };

  const placeOrder = async () => {
    setPlacing(true);
    const fullPhone = getStandardPhone();
    try {
      const res = await fetch(`${API_BASE}/api/public/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: bizId,
          tableNumber: tableId || "0",
          items: cart,
          subtotal: taxData.isIncluded ? subtotal : subtotal + taxData.totalTax,
          cgst: taxData.cgst,
          sgst: taxData.sgst,
          totalPrice: finalTotal,
          customerName,
          customerPhone: fullPhone,
          pointsToRedeem,
          loyaltyOtp,
          source: "QR_MENU"
        })
      });
      const o = await res.json();
      if (res.ok) { setOrderRef(o.orderRef); setFinalPaidAmount(o.finalPrice || 0); setView("confirmed"); setCart([]); fetchActiveOrders(); }
      else alert(o.error || "Failed");
    } finally { setPlacing(false); }
  };

  if (loading) return (<div className="h-screen bg-white flex flex-col items-center justify-center font-sans tracking-tight"><RefreshCw className="animate-spin w-10 h-10 text-emerald-500" /><p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Synchronizing Menu...</p></div>);

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
              <p className="text-emerald-600 text-[9px] font-black uppercase tracking-[0.3em] mb-10 opacity-60">Digital Concierge</p>
              <div className="space-y-5 text-left">
                 {!otpMode ? (
                   <>
                      <div className="space-y-1.5 w-full">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Name</label>
                        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Type name" className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 transition-all" autoFocus />
                      </div>
                      <div className="space-y-1.5 w-full">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">WhatsApp Contact</label>
                        <div className="grid grid-cols-[85px_1fr] gap-2 w-full max-w-full overflow-hidden">
                          <div className="relative w-full">
                            <select 
                              value={countryCode} 
                              onChange={e => setCountryCode(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-100 px-3 py-4 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-all"
                            >
                              {countryCodes.map(c => <option key={c.iso} value={c.code} className="text-slate-950">+{c.code}</option>)}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">▼</div>
                          </div>
                          <input 
                            type="tel" 
                            value={customerPhone} 
                            onChange={e => setCustomerPhone(e.target.value)} 
                            placeholder="Mobile Number" 
                            className="w-full min-w-0 bg-slate-50 border border-slate-100 px-4 py-4 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 transition-all" 
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 text-center"><p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Verify WhatsApp Code</p><input type="text" value={authOtp} onChange={e => setAuthOtp(e.target.value)} placeholder="000000" maxLength={6} className="w-full bg-white/10 border-2 border-emerald-500/30 px-4 py-5 rounded-[2rem] text-3xl font-black text-white tracking-[0.5em] text-center outline-none" /></div>
                  )}
                  <button 
                    onClick={otpMode ? handleVerifyOtp : handleRequestOtp} 
                    disabled={isVerifying} 
                    className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.8rem] text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-95 transition-all mt-4"
                  >
                    {isVerifying ? <RefreshCw className="animate-spin w-4 h-4 mx-auto" /> : (otpMode ? "Confirm Code" : "Login")}
                  </button>
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
         <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 uppercase italic">Success!</h1>
         <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">We're fulfilling your order</p>
         <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 w-full max-w-sm mb-10 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Reference</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter mb-8 font-mono italic">{orderRef}</p>
         </div>
         <button onClick={() => setView("menu")} className="w-full max-w-[280px] bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest">Back to Flavors</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white lg:bg-slate-50 font-sans tracking-tight">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-50 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
           <div className="flex flex-col"><h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter truncate max-w-[150px] italic">{biz?.name}</h1><p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Rewards: {loyaltyPoints}</p></div>
           <div className="flex gap-2">
              <button onClick={() => setShowOrders(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl transition-all active:scale-95">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{activeOrders.length > 0 ? `${activeOrders.length} ORDERS` : 'MY HUB'}</span>
              </button>
              {tableId && <div className="h-10 bg-slate-100 flex items-center px-4 rounded-2xl text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-widest italic">Table {tableId}</div>}
           </div>
        </div>
      </header>

      {/* TRACKING & HISTORY HUB */}
      {showOrders && (
        <div className="fixed inset-0 z-[200]">
           <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowOrders(false)} />
           <div className="absolute right-0 top-0 bottom-0 w-full max-w-[400px] bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col font-sans">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between"><h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">My Hub <Activity className="w-6 h-6 text-emerald-500" /></h2><button onClick={() => setShowOrders(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"><X className="w-5 h-5 text-slate-400" /></button></div>
              <div className="flex bg-slate-50 p-2 mx-8 mt-6 rounded-[1.5rem] border border-slate-100">
                 <button onClick={() => setOrderTab("tracking")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'tracking' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Tracking</button>
                 <button onClick={() => setOrderTab("history")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'history' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>History</button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                 {orderTab === "tracking" ? (
                   activeOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length === 0 ? <div className="h-44 flex flex-col items-center justify-center opacity-20"><Package className="w-12 h-12 mb-4" /><p className="text-[10px] font-black uppercase tracking-widest text-center">No Active Orders<br/>Start Ordering!</p></div> : 
                   activeOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').map(order => (
                        <div key={order.id} className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-2xl">
                           <div className="flex items-center justify-between mb-2"><span className="text-[9px] font-black text-slate-400 uppercase">{order.order_reference}</span><div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700 animate-pulse'}`}>{order.status}</div></div>
                           <p className="text-xs font-black text-slate-900 uppercase truncate mb-1">{(typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || [])).map(i => i.name).join(", ")}</p>
                           <p className="text-lg font-black text-slate-950 uppercase italic">{symbol}{parseFloat(order.total_price).toFixed(0)}</p>
                        </div>
                   ))
                 ) : (
                   activeOrders.length === 0 ? <div className="h-44 flex flex-col items-center justify-center opacity-20"><History className="w-12 h-12 mb-4" /><p className="text-[10px] font-black uppercase tracking-widest">History is Empty</p></div> : 
                   activeOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm opacity-90 mb-4">
                           <div className="flex items-center justify-between mb-2"><span className="text-[9px] font-black text-slate-300 uppercase">{new Date(order.created_at).toLocaleDateString()}</span><span className={`text-[8px] font-black uppercase tracking-widest ${order.status === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-400'}`}>{order.status}</span></div>
                           <p className="text-xs font-black text-slate-900 uppercase truncate line-clamp-1">{(typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || [])).map(i => i.name).join(", ")}</p>
                           <p className="text-sm font-black text-slate-400 mt-1 uppercase italic">{symbol}{parseFloat(order.total_price).toFixed(0)}</p>
                        </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto lg:p-10 lg:grid lg:grid-cols-[260px_1fr_360px] lg:gap-12 items-start">
          <aside className="hidden lg:block sticky top-32 space-y-2 max-h-[70vh] overflow-y-auto no-scrollbar pr-6">
             <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8 pl-4">Explore Flavors</h2>
             {categories.map(cat => (
               <button key={cat} onClick={() => categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className={`w-full text-left px-8 py-5 rounded-[2.5rem] text-[11px] font-black uppercase transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-2xl translate-x-2' : 'text-slate-400 hover:text-slate-900'}`}>{cat}</button>
             ))}
          </aside>

          <div className="bg-white lg:rounded-[3.5rem] lg:shadow-2xl lg:border lg:border-white overflow-hidden min-h-screen">
             <div className="relative">
                {bannerUrl && <div className="w-full h-40 overflow-hidden bg-slate-100 relative"><img src={bannerUrl} className="w-full h-full object-cover" alt="b" /><div className="absolute inset-0 bg-gradient-to-t from-white via-white/50" /></div>}
                <div className="px-10 py-4 flex items-center gap-6 relative -mt-10">
                  <div className="w-20 h-20 rounded-[2.5rem] border-4 border-white shadow-2xl bg-white flex items-center justify-center shrink-0">
                     {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" alt="l" /> : <Utensils className="w-9 h-9 text-emerald-600 opacity-20" />}
                  </div>
                  <div className="flex-1 min-w-0 pt-10">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter truncate uppercase italic">{biz?.name}</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mt-1 truncate"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {biz?.address || 'Scan QR for Service'}</p>
                  </div>
                </div>
             </div>
             <div className="px-10 py-8 lg:sticky lg:top-0 lg:z-[80] lg:bg-white/90 lg:backdrop-blur-xl">
                <div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" /><input placeholder="What would you like?" className="w-full bg-slate-50 border border-slate-100 rounded-[2.2rem] pl-16 pr-8 py-5.5 text-sm font-black text-slate-800 placeholder:text-slate-200 outline-none focus:bg-white focus:border-emerald-500 transition-all font-sans" value={search} onChange={e => setSearch(e.target.value)} /></div>
             </div>
             <div className="px-10 py-4 pb-32">
                {categories.map(cat => (
                  <div key={cat} id={`cat-${cat}`} ref={el => { categoryRefs.current[cat] = el; }} className="mb-20 scroll-mt-6">
                    <div className="flex items-center gap-6 mb-12"><h2 className="text-[14px] font-black text-slate-950 uppercase tracking-[0.3em] font-sans italic">{cat}</h2><div className="flex-1 h-[2px] bg-slate-100 rounded-full" /></div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-10">
                      {groupedItems[cat].map(item => {
                         const inCart = cart.find(c => c.id === item.id);
                         return (
                          <div key={item.id} className="group flex flex-col bg-white rounded-[2rem] sm:rounded-[3rem] p-3 sm:p-5 transition-all hover:shadow-2xl border border-transparent hover:border-slate-50">
                            <div className="relative aspect-square sm:aspect-[16/11] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-50 mb-3 sm:mb-6">
                              {item.image_url ? <img src={item.image_url.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" alt="p" /> : <div className="w-full h-full flex items-center justify-center opacity-5"><Utensils className="w-12 h-12" /></div>}
                              <div className="absolute bottom-2 right-2 sm:bottom-5 sm:right-5 px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white shadow-2xl rounded-xl sm:rounded-2xl text-xs sm:text-base font-black text-slate-950">{symbol}{item.price}</div>
                            </div>
                            <h3 className="px-1 sm:px-4 text-[12px] sm:text-[15px] font-black text-slate-900 leading-tight mb-2 sm:mb-3 uppercase tracking-tight italic line-clamp-2">{item.product_name}</h3>
                            <p className="px-1 sm:px-4 text-[10px] sm:text-[11px] text-slate-400 font-medium mb-4 sm:mb-8 line-clamp-2 leading-relaxed flex-1">{item.description}</p>
                            <div className="px-1 sm:px-4 mt-auto">
                               {inCart ? (
                                 <div className="flex items-center justify-between bg-slate-950 text-white rounded-[1.2rem] sm:rounded-[2rem] p-1 h-10 sm:h-14 shadow-2xl">
                                   <button onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0))} className="w-8 sm:w-12 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"><Minus className="w-3 sm:w-4 h-3 sm:h-4" /></button>
                                   <span className="text-[11px] sm:text-[13px] font-black w-6 sm:w-8 text-center">{inCart.qty}</span>
                                   <button onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} className="w-8 sm:w-12 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"><Plus className="w-3 sm:w-4 h-3 sm:h-4" /></button>
                                 </div>
                               ) : (
                                 <button onClick={() => setCart([...cart, { ...item, qty: 1 }])} className="w-full bg-slate-50 text-slate-500 py-3 sm:py-5 rounded-[1.2rem] sm:rounded-[2rem] font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-500 hover:text-white shadow-sm flex items-center justify-center gap-1 sm:gap-2 font-sans active:scale-95">Add <Plus className="w-3 sm:w-3.5 h-3 sm:h-3.5" /></button>
                               )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <aside className="hidden lg:block sticky top-32 space-y-8 font-sans">
             <div className="bg-white rounded-[3.5rem] shadow-2xl border border-white p-12">
                <div className="flex items-center justify-between mb-12">
                   <h2 className="text-lg font-black text-slate-950 uppercase tracking-tighter flex items-center gap-4 italic"><ShoppingBag className="w-7 h-7 text-emerald-500" /> My Bag</h2>
                   <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{totalCartItems}</span>
                </div>
                {cart.length === 0 ? <div className="py-24 text-center opacity-10 flex flex-col items-center"><ShoppingBag className="w-16 h-16 mb-6" /><p className="text-[12px] font-black uppercase tracking-widest">Bag is Empty</p></div> : (
                  <div className="space-y-12">
                     <div className="max-h-[400px] overflow-y-auto no-scrollbar pr-3 space-y-8">
                        {cart.map(ci => (
                          <div key={ci.id} className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                             <div className="flex-1 text-left"><p className="text-[12px] font-black text-slate-900 leading-tight mb-1 uppercase italic">{ci.product_name}</p><p className="text-[10px] font-black text-slate-400 uppercase">{symbol}{ci.price} x {ci.qty}</p></div>
                             <div className="bg-slate-50 rounded-2xl p-1.5 flex items-center gap-2 border border-slate-100"><button onClick={() => setCart(cart.map(i => i.id === ci.id ? {...i, qty: Math.max(0, i.qty - 1)} : i).filter(i => i.qty > 0))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"><Minus className="w-3.5 h-3.5" /></button><span className="text-[11px] font-black text-slate-950 px-2">{ci.qty}</span><button onClick={() => setCart(cart.map(i => i.id === ci.id ? {...i, qty: i.qty + 1} : i))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all"><Plus className="w-3.5 h-3.5" /></button></div>
                          </div>
                        ))}
                     </div>
                     <div className="border-t-2 border-slate-50 pt-10 space-y-5">
                        <div className="flex justify-between text-2xl items-center text-slate-950 font-black pt-8 tracking-tighter uppercase italic"><span>Payable</span><span>{symbol}{finalTotal.toFixed(0)}</span></div>
                     </div>
                     <button onClick={placeOrder} disabled={placing} className="w-full bg-slate-950 hover:bg-black text-white py-6 rounded-[2.2rem] font-black text-[13px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-5">{placing ? <RefreshCw className="animate-spin w-5 h-5 font-sans" /> : <>Complete Order <ChevronRight className="w-5 h-5 text-emerald-500" /></>}</button>
                  </div>
                )}
             </div>
          </aside>
      </div>
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-10 left-8 right-8 z-[100] animate-in slide-in-from-bottom-12 font-sans">
           <button onClick={placeOrder} disabled={placing} className="w-full bg-slate-950 text-white rounded-[3.5rem] p-5.5 flex items-center justify-between shadow-2xl shadow-slate-950/50 border border-white/10 active:scale-95 transition-all">
              <div className="flex items-center gap-5 pl-4"><div className="relative"><div className="w-14 h-14 bg-white/10 rounded-[1.8rem] flex items-center justify-center"><ShoppingBag className="w-7 h-7 text-emerald-400" /></div><div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-950"><span className="text-[10px] font-black text-white">{totalCartItems}</span></div></div><div className="text-left"><p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-0.5 font-sans">Final Total</p><p className="text-xl font-black italic">{symbol}{finalTotal.toFixed(0)}</p></div></div>
              <div className="bg-emerald-500 text-slate-950 px-10 py-5 rounded-[2.5rem] flex items-center gap-4 font-black text-[13px] uppercase tracking-widest shadow-2xl">Confirm <ChevronRight className="w-5 h-5" /></div>
           </button>
        </div>
      )}
      
      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-[150]">
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

export default CustomerMenu;
