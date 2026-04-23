import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../config";
import { 
  MessageCircle, Plus, Minus, CheckCircle, Utensils, Search,
  LayoutGrid, X, MapPin, ArrowRight, RefreshCw, ShoppingBag,
  Activity, Bike, Store, User, Globe, Sparkles, ChevronLeft
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
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [view, setView] = useState("auth"); // auth, menu, ordered
  const [placing, setPlacing] = useState(false);
  const [fulfillmentMode] = useState(tableId && tableId !== "0" ? "DINEIN" : "PICKUP");
  
  const [customerPhone, setCustomerPhone] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loyaltyOtp, setLoyaltyOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [checkingLoyalty, setCheckingLoyalty] = useState(false);
  const categoryRefs = useRef({});
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/menu/${bizId}`)
      .then(r => r.json())
      .then(d => { 
        setData(d); 
        setLoading(false); 
        if (d?.items?.length > 0) setActiveCategory(d.items[0].category || "General"); 
        // For Table QR, we always start with auth for lead collection
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
    return (data?.items || []).filter(i => i.product_name.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, current) => { const cat = current.category || "General"; if (!acc[cat]) acc[cat] = []; acc[cat].push(current); return acc; }, {});
  }, [filteredItems]);

  const categories = Object.keys(groupedItems);
  const totalCartItems = cart.reduce((acc, i) => acc + i.qty, 0);

  const scrollToCategory = (cat) => { categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveCategory(cat); };
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

  const finalTotal = Math.max(0, (taxData.isIncluded ? subtotal : (subtotal + taxData.totalTax)) - (ptsEnabled ? (pointsToRedeem / ptsRatio) : 0));

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
  const [isVerifying, setIsVerifying] = useState(false);

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
        else alert(d.error || "Failed to send OTP.");
    } catch (e) { alert("Something went wrong"); }
    finally { setIsVerifying(false); }
  };

  const verifyAuthOtp = async () => {
    if (authOtp.length < 6) return alert("Enter 6-digit code.");
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
            setView("menu");
        } else alert(d.error || "Invalid OTP");
    } catch (e) { alert("Verification failed"); }
    finally { setIsVerifying(false); }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    const fullNumber = countryCode + customerPhone.replace(/\D/g, "");
    try {
      const res = await fetch(`${API_BASE}/api/public/order`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          userId: bizId, 
          tableNumber: tableId, 
          items: cart.map(i => ({ name: i.product_name, qty: i.qty, price: i.price, tax_applicable: i.tax_applicable })), 
          subtotal, 
          cgst: taxData.cgst, 
          sgst: taxData.sgst, 
          totalPrice: finalTotal, 
          customerName: "Guest", // Leads use phone for identification
          customerPhone: fullNumber, 
          pointsToRedeem, 
          loyaltyOtp,
          address: `Table ${tableId}`, 
          fulfillmentMode: "DINEIN", 
          source: "TABLE_QR" 
        }) 
      });
      if (res.ok) { 
        setView("ordered"); 
        setCart([]); 
      } else {
        const err = await res.json();
        alert(err.error || "Failed to place order.");
      }
    } catch (err) { alert("Something went wrong."); }
    finally { setPlacing(false); }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => { 
      entries.forEach(entry => { if (entry.isIntersecting) setActiveCategory(entry.target.dataset.category); }); 
    }, { rootMargin: '-120px 0px -60% 0px', threshold: 0 });
    Object.values(categoryRefs.current).forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [categories.length]);

  if (loading) return (<div className="flex flex-col items-center justify-center h-screen bg-white"><Activity className="w-10 h-10 text-emerald-500 animate-spin" /><p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Store...</p></div>);

  if (view === "auth") return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 scale-110">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070" 
          alt="background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] animate-in fade-in zoom-in duration-700">
        <div className="bg-white/[0.05] backdrop-blur-3xl px-6 py-12 rounded-[3.5rem] border border-white/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-white p-3.5 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
               {logoUrl ? <img src={logoUrl} alt="logo" className="w-full h-full object-contain rounded-xl" /> : <Utensils className="w-10 h-10 text-emerald-600" />}
            </div>
            
            <h1 className="text-3xl font-black text-white tracking-tight mb-1.5 uppercase">Table {tableId}</h1>
            <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Welcome to {biz?.name || 'our store'}</p>

            <div className="space-y-4">
               {!otpMode ? (
                 <div className="flex gap-2">
                    <div className="relative">
                      <select 
                        value={countryCode} 
                        onChange={e => setCountryCode(e.target.value)} 
                        className="w-[75px] bg-white/5 border border-white/10 pl-3 pr-1 py-4.5 rounded-2xl text-xs font-black text-white outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
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
                        placeholder="WhatsApp Number" 
                        className="w-full bg-white/5 border border-white/10 px-6 py-4.5 rounded-2xl text-base font-black text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all tracking-widest" 
                      />
                    </div>
                 </div>
               ) : (
                 <div className="animate-in slide-in-from-bottom-4 duration-500 text-center">
                    <input 
                      type="text" 
                      value={authOtp} 
                      onChange={e => setAuthOtp(e.target.value)} 
                      placeholder="OTP CODE" 
                      maxLength={6}
                      className="w-full bg-white/10 border-2 border-emerald-500/30 px-4 py-5 rounded-[2rem] text-3xl font-black text-white placeholder:text-white/10 outline-none focus:border-emerald-500/60 transition-all tracking-[0.6em] text-center" 
                    />
                    <button onClick={() => setOtpMode(false)} className="mt-4 text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-all underline underline-offset-4">Change Number</button>
                 </div>
               )}

               <button 
                 onClick={otpMode ? verifyAuthOtp : handleVerify} 
                 disabled={isVerifying} 
                 className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-500/20 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-[0.97] mt-2"
               >
                  {isVerifying ? <RefreshCw className="animate-spin w-4 h-4" /> : (
                    <>
                      {otpMode ? "Verify & Order" : "Login with WhatsApp"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
               </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
               <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Safe</span>
               </div>
               <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
               <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">VIP</span>
               </div>
            </div>
        </div>
        <p className="mt-10 text-center text-[9px] font-bold text-white/20 uppercase tracking-[0.5em]">Powered by SaSLoop</p>
      </div>
    </div>
  );

  if (view === "ordered") return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
       <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10 border border-emerald-50 relative">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-20" />
       </div>
       <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 uppercase">Order Sent!</h1>
       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">We're preparing your delicious meal at Table {tableId}</p>
       
       <button onClick={() => setView("menu")} className="w-full max-w-[280px] bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all mb-4">Add More Items</button>
       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">A bill will be generated upon serving</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white lg:bg-slate-50 selection:bg-emerald-500/20 pb-32 lg:pb-10 font-sans">
      <header className="bg-white border-b border-slate-50 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-3 sm:py-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{loyaltyPoints} PTS</p>
              </div>
           </div>
           
           <div className="flex flex-col text-right">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Dinning at</p>
              <p className="text-xs font-black text-slate-800 uppercase tracking-tighter bg-slate-50 px-3 py-1 rounded-lg">Table {tableId}</p>
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto lg:p-6 lg:mt-4">
        <div className="lg:grid lg:grid-cols-[260px_1fr_360px] lg:gap-8 items-start">
          
          <aside className="hidden lg:block sticky top-28 space-y-2 max-h-[75vh] overflow-y-auto no-scrollbar pr-4">
             <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-4 pl-3">Sections</h2>
             {categories.map(cat => (
               <button 
                 key={cat} 
                 onClick={() => scrollToCategory(cat)} 
                 className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 translate-x-1' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
               >
                 {cat}
               </button>
             ))}
          </aside>

          <div className="bg-white lg:rounded-[3rem] lg:shadow-2xl lg:shadow-slate-200/50 lg:border lg:border-white overflow-hidden min-h-screen relative">
             <div className="relative">
                {bannerUrl && (
                  <div className="w-full h-40 sm:h-56 lg:h-64 overflow-hidden bg-slate-100 relative">
                    <img src={bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10" />
                  </div>
                )}
                <div className="px-8 py-4 flex items-center gap-5 relative -mt-10 sm:-mt-12">
                  {logoUrl && <img src={logoUrl} alt="Logo" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-[2rem] object-cover border-4 border-white shadow-2xl bg-white" />}
                  <div className="flex-1 min-w-0 pt-10 sm:pt-12">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter truncate uppercase">{biz?.name}</h1>
                    <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mt-1.5 truncate">
                       <MapPin className="w-3 h-3 text-emerald-500" /> {biz?.address || 'Premium Lounge'}
                    </p>
                  </div>
                </div>
             </div>

             <div className="px-8 py-5 sticky top-[65px] lg:top-0 z-[80] bg-white lg:bg-white/90 lg:backdrop-blur-md">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    placeholder="Search our cuisine..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] pl-12 pr-6 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                  />
                </div>

                <div className="lg:hidden flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
                   {categories.map(cat => (<button key={cat} onClick={() => scrollToCategory(cat)} className={`whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeCategory === cat ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>{cat}</button>))}
                </div>
             </div>

             <div className="px-8 py-6">
                {categories.map(cat => (
                  <div key={cat} ref={el => { categoryRefs.current[cat] = el; if (el) el.dataset.category = cat; }} className="mb-14 scroll-mt-44 lg:scroll-mt-12">
                    <div className="flex items-center gap-4 mb-8">
                       <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.35em]">{cat}</h2>
                       <div className="flex-1 h-[2px] bg-slate-50 rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
                      {groupedItems[cat].map(item => {
                        const inCart = cart.find(c => c.id === item.id);
                        const fullImgUrl = item.image_url?.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`;
                        return (
                          <div key={item.id} className="group flex flex-col bg-white rounded-[2.5rem] p-3 transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 lg:hover:border lg:border-emerald-100">
                             <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 mb-4 cursor-pointer" onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}>
                              {item.image_url ? <img src={fullImgUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={item.product_name} /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Utensils className="w-10 h-10" /></div>}
                              <div className="absolute bottom-3 right-3 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[13px] font-black text-slate-900 shadow-lg">{symbol}{item.price}</div>
                              <div className={`absolute top-4 left-4 w-5 h-5 rounded-md border-2 flex items-center justify-center bg-white/80 ${item.is_veg ? 'border-emerald-500' : 'border-red-500'}`}><div className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-emerald-500' : 'bg-red-500'}`} /></div>
                            </div>

                            <div className="px-3 flex-1 flex flex-col">
                              <h3 className="text-sm sm:text-base font-black text-slate-800 leading-tight mb-2 tracking-tighter group-hover:text-emerald-600 transition-colors uppercase">{item.product_name}</h3>
                              {item.description && <p className="text-[11px] text-slate-400 font-medium mb-5 line-clamp-2 leading-relaxed flex-1">{item.description}</p>}
                              
                              <div className="mt-auto">
                                 {inCart ? (
                                   <div className="flex items-center justify-between bg-slate-900 text-white rounded-2xl p-1 h-12 shadow-xl animate-in zoom-in">
                                     <button onClick={() => removeFromCart(item.id)} className="w-10 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"><Minus className="w-4 h-4" /></button>
                                     <span className="text-sm font-black">{inCart.qty}</span>
                                     <button onClick={() => addToCart(item)} className="w-10 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"><Plus className="w-4 h-4" /></button>
                                   </div>
                                 ) : (
                                   <button 
                                     onClick={() => addToCart(item)} 
                                     className="w-full bg-slate-50 text-slate-400 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all hover:bg-emerald-500 hover:text-white group-active:scale-95 flex items-center justify-center gap-2"
                                   >
                                      Add Item <Plus className="w-4 h-4" />
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
             <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white p-10">
                <div className="flex items-center justify-between mb-10">
                   <h2 className="text-base font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                      <ShoppingBag className="w-6 h-6 text-emerald-500" /> Current Order
                   </h2>
                   <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{totalCartItems} Items</span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-16 text-center opacity-15">
                     <ShoppingBag className="w-16 h-16 mx-auto mb-5" />
                     <p className="text-[11px] font-black uppercase tracking-widest">No delicacies added yet</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                     <div className="max-h-[400px] overflow-y-auto no-scrollbar pr-3 space-y-5">
                        {cart.map(ci => (
                          <div key={ci.id} className="flex items-center gap-4 animate-in fade-in slide-in-from-right-2">
                             <div className="flex-1 text-left">
                                <p className="text-[12px] font-black text-slate-800 leading-tight mb-1 uppercase line-clamp-1">{ci.product_name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{symbol}{ci.price} x {ci.qty}</p>
                             </div>
                             <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-1.5 border border-slate-100 shadow-sm">
                                <button onClick={() => removeFromCart(ci.id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"><Minus className="w-4 h-4" /></button>
                                <span className="text-[11px] font-black text-slate-800 min-w-[12px] text-center">{ci.qty}</span>
                                <button onClick={() => addToCart(ci)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors"><Plus className="w-4 h-4" /></button>
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="border-t-2 border-slate-50 pt-8 space-y-4">
                        <div className="flex justify-between text-[12px] items-center text-slate-400 font-bold uppercase tracking-[0.1em]">
                           <span>Subtotal</span>
                           <span>{symbol}{subtotal.toFixed(2)}</span>
                        </div>
                        {taxData.totalTax > 0 && (
                           <div className="flex justify-between text-[12px] items-center text-slate-400 font-bold uppercase tracking-[0.1em]">
                              <span>Taxes (GST)</span>
                              <span>{symbol}{taxData.totalTax.toFixed(2)}</span>
                           </div>
                        )}
                        <div className="flex justify-between text-2xl items-center text-slate-900 font-black pt-5 tracking-tighter uppercase">
                           <span>Payable</span>
                           <span>{symbol}{finalTotal.toFixed(0)}</span>
                        </div>
                     </div>

                     <button onClick={placeOrder} disabled={placing} className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4 mt-6">
                        {placing ? <RefreshCw className="animate-spin w-5 h-5" /> : <>Send to Kitchen <Utensils className="w-4 h-4 text-emerald-400" /></>}
                     </button>
                  </div>
                )}
             </div>
          </aside>
        </div>
      </main>

      {/* Floating Bottom Cart (Mobile Only) */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-8 left-8 right-8 z-[100] animate-in slide-in-from-bottom-12 duration-700">
           <button 
             onClick={placeOrder} 
             disabled={placing}
             className="w-full bg-slate-900 text-white rounded-[3rem] p-4.5 flex items-center justify-between shadow-2xl shadow-slate-900/50 border border-white/10 active:scale-[0.96] transition-all"
           >
              <div className="flex items-center gap-4 pl-3">
                 <div className="relative">
                   <div className="w-12 h-12 bg-white/10 rounded-[1.2rem] flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-emerald-400" />
                   </div>
                   <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                      <span className="text-[10px] font-black text-white leading-none">{totalCartItems}</span>
                   </div>
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">Bill Estimate</p>
                    <p className="text-lg font-black tracking-tighter">{symbol}{finalTotal.toFixed(0)}</p>
                 </div>
              </div>
              <div className="bg-emerald-500 text-slate-900 px-8 py-4 rounded-[1.8rem] flex items-center gap-2.5 font-black text-[11px] uppercase tracking-widest shadow-xl">
                 Order <Utensils className="w-4 h-4" />
              </div>
           </button>
        </div>
      )}
    </div>
  );
}

export default CustomerMenu;
