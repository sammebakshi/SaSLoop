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

// Inline SVG icons for social platforms not in lucide
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;

// Inline SVG icons for social platforms not in lucide
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
  const [view, setView] = useState("menu");
  const [orderRef, setOrderRef] = useState("");
  const [finalPaidAmount, setFinalPaidAmount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [loyaltyOtp, setLoyaltyOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [checkingLoyalty, setCheckingLoyalty] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/menu/${bizId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); if (d?.items?.length > 0) setActiveCategory(d.items[0].category || "General"); })
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
    return (data?.items || []).filter(i => i.product_name.toLowerCase().includes(search.toLowerCase()) || (i.description || "").toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => { const cat = item.category || "General"; if (!acc[cat]) acc[cat] = []; acc[cat].push(item); return acc; }, {});
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

  const requestLoyaltyOtp = async () => {
    if (!customerPhone || customerPhone.length < 5) return;
    setCheckingLoyalty(true);
    try {
      const fullPhone = countryCode + customerPhone.replace(/\D/g, "");
      // Generate OTP but skip the chargeable message
      const res = await fetch(`${API_BASE}/api/public/loyalty/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: bizId, phone: fullPhone, manual: true })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to generate OTP");
      
      // Open WhatsApp trigger (FREE response)
      const waLink = `https://wa.me/${bizPhone}?text=${encodeURIComponent('GET OTP')}`;
      window.open(waLink, '_blank');
      setShowOtpInput(true);
    } catch (e) { alert(e.message); }
    finally { setCheckingLoyalty(false); }
  };

  const scrollToCategory = (cat) => { categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveCategory(cat); };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActiveCategory(entry.target.dataset.category); }); }, { rootMargin: '-120px 0px -60% 0px', threshold: 0 });
    Object.values(categoryRefs.current).forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [categories.length]);

  const placeOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) return;
    if (fulfillmentMode === "DELIVERY" && !customerAddress.trim()) return;
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
  if (!biz) return (<div className="flex flex-col items-center justify-center h-screen bg-white text-center p-8"><AlertCircle className="w-12 h-12 text-slate-200 mb-4" /><h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Restaurant Not Found</h2></div>);

  // ── Confirmed ──
  if (view === "confirmed") return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100"><CheckCircle className="w-10 h-10 text-emerald-500" /></div>
      <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">Order Confirmed</h1>
      <p className="text-sm text-slate-400 font-medium mb-8">Your food is being prepared</p>
      <div className="bg-slate-50 rounded-2xl p-6 max-w-sm w-full mb-8 border border-slate-100">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order Reference</p>
        <p className="text-2xl font-black text-emerald-600 tracking-tight mb-6">{orderRef}</p>
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3"><div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">{fulfillmentMode === "DELIVERY" ? <Bike className="w-4 h-4 text-emerald-600" /> : <Store className="w-4 h-4 text-emerald-600" />}</div><div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Type</p><p className="text-xs font-black text-slate-800">{fulfillmentMode === "DELIVERY" ? "Home Delivery" : "Pickup"}</p></div></div>
          <div className="flex items-center gap-3"><div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-blue-600" /></div><div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estimated Time</p><p className="text-xs font-black text-slate-800">{fulfillmentMode === "DELIVERY" ? "30-45 minutes" : "15-20 minutes"}</p></div></div>
          <div className="flex items-center gap-3"><div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-indigo-600" /></div><div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p><p className="text-xs font-black text-slate-800">{symbol}{finalPaidAmount.toFixed(2)}</p></div></div>
        </div>
      </div>
      <div className="flex flex-col gap-3 max-w-sm w-full">
        <button onClick={openWhatsApp} className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"><MessageCircle className="w-4 h-4 fill-current" /> Chat with Restaurant</button>
        <button onClick={() => { setView("menu"); setPointsToRedeem(0); setLoyaltyPoints(0); }} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest py-3 hover:text-emerald-500 transition-all">Order Again</button>
      </div>
    </div>
  );

  // ── Main ──
  return (
    <div className="min-h-screen bg-slate-50/50 relative pb-32 selection:bg-emerald-500/30">

      {/* ─── BANNER WITH LOGO + SOCIAL ─── */}
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
            {biz?.address && <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5 truncate"><MapPin className="w-3 h-3 text-emerald-500 shrink-0" /> {biz.address}</p>}
          </div>
        </div>
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-2 px-5 pb-4">
            {socialLinks.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all" title={s.label}>{s.icon}</a>
            ))}
          </div>
        )}
      </div>

      {/* ─── DELIVERY / PICKUP + CATEGORIES ─── */}
      <div className="sticky top-0 z-[90] bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-2.5">
          <button onClick={() => setFulfillmentMode("DELIVERY")} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${fulfillmentMode === "DELIVERY" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-50 text-slate-500 border border-slate-100"}`}><Bike className="w-3.5 h-3.5" /> Delivery</button>
          <button onClick={() => setFulfillmentMode("PICKUP")} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${fulfillmentMode === "PICKUP" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-50 text-slate-500 border border-slate-100"}`}><Store className="w-3.5 h-3.5" /> Pickup</button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 text-slate-400"><Clock className="w-3 h-3" /><span className="text-[9px] font-bold uppercase tracking-widest">{fulfillmentMode === "DELIVERY" ? "30-45 min" : "15-20 min"}</span></div>
        </div>
        <div className="flex items-center gap-2 px-5 py-2 overflow-x-auto no-scrollbar border-t border-slate-50">
          {categories.map(cat => (<button key={cat} onClick={() => scrollToCategory(cat)} className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${activeCategory === cat ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"}`}>{cat}</button>))}
        </div>
      </div>

      {/* ─── SEARCH ─── */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input placeholder="Search for dishes..." className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center"><X className="w-3 h-3 text-slate-400" /></button>}
        </div>
      </div>

      {/* ─── MENU SECTIONS ─── */}
      <div className="px-5 mt-3 pb-40">
        {categories.length === 0 ? (<div className="py-20 text-center text-slate-300 font-bold text-xs uppercase tracking-widest">No Dishes Found</div>) : (
          categories.map(cat => (
            <div key={cat} ref={el => { categoryRefs.current[cat] = el; if (el) el.dataset.category = cat; }} className="mb-8 scroll-mt-32">
              <div className="flex items-center gap-2 mb-4"><h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">{cat}</h2><span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">({groupedItems[cat].length})</span></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {groupedItems[cat].map(item => {
                  const inCart = cart.find(c => c.id === item.id);
                  const fullImgUrl = item.image_url?.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`;
                  const isExpanded = expandedItem === item.id;
                  return (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col p-2.5 transition-all active:scale-[0.98]">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2.5 group cursor-pointer" onClick={() => setExpandedItem(isExpanded ? null : item.id)}>
                        {item.image_url ? <img src={fullImgUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt={item.product_name} loading="lazy" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Utensils className="w-8 h-8" /></div>}
                      </div>
                      <h3 className="text-[11px] font-black text-slate-800 leading-tight mb-0.5 line-clamp-2 tracking-tight">{item.product_name}</h3>
                      {item.description && isExpanded && <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-1.5">{item.description}</p>}
                      <div className="mt-auto" />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-black text-slate-800">{symbol}{item.price}</p>
                        {inCart ? (
                          <div className="flex items-center bg-emerald-500 text-white rounded-lg overflow-hidden shadow-sm h-7">
                            <button onClick={() => removeFromCart(item.id)} className="w-6 h-full flex items-center justify-center hover:bg-emerald-600 active:scale-90 transition-all"><Minus className="w-3 h-3" /></button>
                            <span className="w-5 text-center text-[10px] font-black">{inCart.qty}</span>
                            <button onClick={() => addToCart(item)} className="w-6 h-full flex items-center justify-center hover:bg-emerald-600 active:scale-90 transition-all"><Plus className="w-3 h-3" /></button>
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

      {/* ─── CART BAR ─── */}
      {cart.length > 0 && view === "menu" && (
        <div className="fixed bottom-4 left-4 right-4 z-[200] animate-slide-up">
          <button onClick={() => setView("cart")} className="w-full bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all group">
            <div className="flex items-center gap-3"><div className="relative"><ShoppingBag className="w-5 h-5 text-emerald-400" /><span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full text-[7px] font-black flex items-center justify-center">{totalCartItems}</span></div><div className="text-left"><p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 leading-none mb-0.5">{totalCartItems} Items</p><p className="text-base font-black tracking-tight leading-none">{symbol}{(taxData.isIncluded ? subtotal : subtotal + taxData.totalTax).toFixed(2)}</p></div></div>
            <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold uppercase tracking-widest">View Cart</span><ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></div>
          </button>
        </div>
      )}

      {/* ─── WhatsApp FAB ─── */}
      <button onClick={openWhatsApp} className="fixed bottom-4 right-4 z-[100] w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-90 transition-all" style={{ display: cart.length > 0 ? 'none' : 'flex' }}><MessageCircle className="w-6 h-6 fill-current" /></button>

      {/* ─── CART / CHECKOUT ─── */}
      {view === "cart" && (
        <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 top-8 bg-white rounded-t-[1.5rem] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-5 pt-5 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <button onClick={() => setView("menu")} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-all"><ChevronLeft className="w-4 h-4" /><span className="text-[10px] font-bold uppercase tracking-widest">Menu</span></button>
                <button onClick={() => setView("menu")} className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Your Cart</h2>
            </div>
            <div className="px-5 py-5 space-y-6">
              <div className="space-y-3">
                {cart.map(item => { const img = item.image_url?.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`; return (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-100">{item.image_url ? <img src={img} className="w-full h-full object-cover" alt={item.product_name} /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Utensils className="w-5 h-5" /></div>}</div>
                    <div className="flex-1 min-w-0"><h4 className="text-[11px] font-black text-slate-800 tracking-tight leading-tight line-clamp-2 mb-0.5">{item.product_name}</h4><p className="text-xs font-black text-slate-800">{symbol}{(item.price * item.qty).toFixed(2)}</p></div>
                    <div className="flex items-center bg-emerald-500 text-white rounded-lg overflow-hidden shadow-sm h-8 shrink-0">
                      <button onClick={() => removeFromCart(item.id)} className="w-7 h-full flex items-center justify-center hover:bg-emerald-600"><Minus className="w-3 h-3" /></button>
                      <span className="w-6 text-center text-[10px] font-black">{item.qty}</span>
                      <button onClick={() => addToCart(item)} className="w-7 h-full flex items-center justify-center hover:bg-emerald-600"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                ); })}
              </div>
              <button onClick={() => setView("menu")} className="w-full p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-dashed border-emerald-200 text-center"><span className="text-[10px] font-bold uppercase tracking-widest">+ Add More Items</span></button>

              {/* Bill */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Bill Summary</h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm"><span className="font-medium text-slate-500">Item Total</span><span className="font-black text-slate-800">{symbol}{subtotal.toFixed(2)}</span></div>
                  {!taxData.isIncluded && taxData.totalTax > 0 && (<><div className="flex justify-between text-sm"><span className="font-medium text-slate-500">CGST ({biz?.cgst_percent}%)</span><span className="font-bold text-slate-600">{symbol}{taxData.cgst.toFixed(2)}</span></div><div className="flex justify-between text-sm"><span className="font-medium text-slate-500">SGST ({biz?.sgst_percent}%)</span><span className="font-bold text-slate-600">{symbol}{taxData.sgst.toFixed(2)}</span></div></>)}
                  {fulfillmentMode === "DELIVERY" && <div className="flex justify-between text-sm"><span className="font-medium text-slate-500">Delivery Fee</span><span className="font-bold text-emerald-600">FREE</span></div>}
                  {pointsToRedeem > 0 && <div className="flex justify-between text-sm"><span className="font-medium text-indigo-600">Loyalty Discount</span><span className="font-bold text-indigo-600">-{symbol}{pointsToRedeem}</span></div>}
                  <div className="border-t border-slate-100 pt-2.5 mt-2 flex justify-between"><span className="text-sm font-black text-slate-800">Grand Total</span><span className="text-lg font-black text-slate-800 tracking-tight">{symbol}{finalTotal.toFixed(2)}</span></div>
                  {taxData.isIncluded && taxData.totalTax > 0 && <p className="text-[8px] font-medium text-slate-400 text-right uppercase tracking-widest">Inclusive of all taxes</p>}
                </div>
              </div>

              {/* Loyalty */}
              <div className="bg-slate-800 rounded-2xl p-5 text-white relative overflow-hidden">
                <Sparkles className="absolute -right-3 -top-3 w-20 h-20 opacity-5" />
                <div className="relative">
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-3">🎁 Loyalty Points</p>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="flex-1 flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-2.5 py-2.5 overflow-hidden">
                      <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="bg-slate-800 text-white/60 text-[10px] font-bold outline-none border-none max-w-[60px]">
                        {countryCodes.map(c => (
                          <option key={`${c.iso}-${c.code}`} value={c.code}>+{c.code}</option>
                        ))}
                      </select>
                      <input type="tel" placeholder="Mobile" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="flex-1 bg-transparent outline-none text-xs font-medium text-white placeholder:text-white/40" />
                    </div>
                    {loyaltyPoints > 0 ? <div className="text-right"><p className="text-lg font-black leading-none">{loyaltyPoints}</p><p className="text-[7px] font-bold uppercase opacity-50">pts</p></div>
                    : <button onClick={checkLoyalty} disabled={checkingLoyalty} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${checkingLoyalty ? 'animate-spin' : ''}`} /></button>}
                  </div>
                  {showOtpInput && !pointsToRedeem && (
                    <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                       <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2 pl-1">🔐 Enter WhatsApp OTP</p>
                       <div className="flex gap-2">
                         <input 
                           type="text" 
                           placeholder="6-digit code" 
                           value={loyaltyOtp} 
                           onChange={e => setLoyaltyOtp(e.target.value)} 
                           className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500/50"
                         />
                         <button 
                           onClick={() => {
                             if (loyaltyOtp.length === 6) {
                               setPointsToRedeem(Math.min(loyaltyPoints, maxRedeem));
                               setShowOtpInput(false);
                             } else {
                               alert("Enter a 6-digit OTP");
                             }
                           }}
                           className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase"
                         >
                           Verify
                         </button>
                       </div>
                    </div>
                  )}
                  {ptsEnabled && loyaltyPoints >= minRedeem && !pointsToRedeem && !showOtpInput && <button onClick={requestLoyaltyOtp} className="w-full py-2.5 bg-emerald-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Redeem {Math.min(loyaltyPoints, maxRedeem)} Points</button>}
                  {pointsToRedeem > 0 && <div className="flex items-center justify-between bg-white/10 rounded-lg p-2.5"><span className="text-xs font-bold">-{symbol}{(pointsToRedeem/ptsRatio).toFixed(2)} Applied</span><button onClick={() => { setPointsToRedeem(0); setLoyaltyOtp(""); }} className="w-6 h-6 bg-white/20 rounded flex items-center justify-center"><X className="w-3 h-3" /></button></div>}
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{fulfillmentMode === "DELIVERY" ? "📍 Delivery Details" : "🏪 Pickup Details"}</h3>
                <div className="space-y-3">
                  <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><input type="text" placeholder="Your Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" /></div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <div className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 flex items-center gap-2">
                       <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="bg-slate-50 text-slate-400 text-xs font-bold outline-none border-none max-w-[70px]">
                         {countryCodes.map(c => (
                           <option key={`${c.iso}-${c.code}`} value={c.code}>+{c.code}</option>
                         ))}
                       </select>
                       <input type="tel" placeholder="Mobile Number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none" />
                    </div>
                  </div>
                  {fulfillmentMode === "DELIVERY" && <div className="relative"><MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300" /><textarea placeholder="Full delivery address..." value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none" /></div>}
                </div>
              </div>

              <div className="pb-6">
                <button onClick={placeOrder} disabled={placing || !customerName.trim() || !customerPhone.trim() || (fulfillmentMode === "DELIVERY" && !customerAddress.trim())} className="w-full bg-slate-900 hover:bg-black disabled:opacity-40 disabled:pointer-events-none text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                  {placing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Place Order • {symbol}{finalTotal.toFixed(2)}</span><ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" /></>}
                </button>
                <p className="text-center text-[8px] text-slate-300 font-medium uppercase tracking-widest mt-2">You'll receive order updates on WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnlineOrder;
