import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../config";
import { 
  Plus, Minus, ShoppingBag, Utensils, Search, 
  X, MapPin, ChevronRight, Clock, Star, 
  RefreshCw, CheckCircle2, Package, History, Activity, MessageCircle, LayoutGrid, BellRing, Sparkles, Gift,
  Globe, Eye, CreditCard, Scan, QrCode, ArrowUpRight, User, ShoppingCart, Award, HelpCircle, LogOut, Percent
} from "lucide-react";
import { countryCodes } from "../countryCodes";

function CustomerMenu() {
  const { bizId, tableId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCategories, setShowCategories] = useState(false);
  const categoryRefs = useRef({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [customerAddress, setCustomerAddress] = useState(""); // 🛵 Delivery address state
  const [fulfillmentMode, setFulfillmentMode] = useState(tableId && tableId !== "0" ? "DINEIN" : "PICKUP"); // 🛍️ Mode selector
  
  const [orderRef, setOrderRef] = useState("");
  const [finalPaidAmount, setFinalPaidAmount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [redemptionToken, setRedemptionToken] = useState(null);
  const [redemptionStatus, setRedemptionStatus] = useState("IDLE"); // IDLE, PENDING, SUCCESS
  
  const [view, setView] = useState("auth"); 
  const [isVerified, setIsVerified] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [orderTab, setOrderTab] = useState("tracking"); // "tracking" or "history"

  const [authStatus, setAuthStatus] = useState("IDLE"); // IDLE, PENDING
  const [authToken, setAuthToken] = useState(null);
  const [tasteProfile, setTasteProfile] = useState([]); // e.g. ["spicy", "veg"]
  const [showVIPKey, setShowVIPKey] = useState(false);
  const [showSidebarDrawer, setShowSidebarDrawer] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);

  const getCategoryImg = (catName) => {
    const map = {
      "Burgers": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
      "Fresh Juice": "https://images.unsplash.com/photo-1579619173026-2a7102e3b2a6?auto=format&fit=crop&q=80&w=600",
      "Fresh Juice, Kuluki & Mojitos": "https://images.unsplash.com/photo-1579619173026-2a7102e3b2a6?auto=format&fit=crop&q=80&w=600",
      "Mojito": "https://images.unsplash.com/photo-1579619173026-2a7102e3b2a6?auto=format&fit=crop&q=80&w=600",
      "Drinks": "https://images.unsplash.com/photo-1579619173026-2a7102e3b2a6?auto=format&fit=crop&q=80&w=600",
      "Beverages": "https://images.unsplash.com/photo-1579619173026-2a7102e3b2a6?auto=format&fit=crop&q=80&w=600",
      "Desserts": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600",
      "Ice Cream": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600",
      "Shakes": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600",
      "Falooda & Smoothie": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600",
      "Smoothies": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600",
      "Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
      "Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600",
      "Breakfast": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600",
      "Sandwiches & Rolls": "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=600",
      "Sandwiches": "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=600",
      "Rolls": "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=600",
      "Wraps": "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=600",
      "Main Course": "https://images.unsplash.com/photo-1545247181-516773cae76d?auto=format&fit=crop&q=80&w=600",
      "Chinese": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600",
      "Noodles": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600",
      "Rice": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600"
    };
    return map[catName] || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600";
  };

  // --- 🔒 SESSION PERSISTENCE ---
  useEffect(() => {
    const savedName = localStorage.getItem(`sasloop_name_${bizId}`);
    const savedPhone = localStorage.getItem(`sasloop_phone_${bizId}`);
    const savedLoginTime = localStorage.getItem(`sasloop_login_time_${bizId}`);

    if (savedPhone && savedLoginTime) {
      const elapsed = Date.now() - parseInt(savedLoginTime);
      if (elapsed < 5 * 60 * 1000) {
        if (savedName) setCustomerName(savedName);
        setCustomerPhone(savedPhone);
        setView("menu");
      } else {
        handleLogout();
      }
    } else {
      setView("auth"); // Force initial WhatsApp OTP login
    }
  }, [bizId]);

  // ⏱️ 5-MINUTE AUTO-LOGOUT TIMER
  useEffect(() => {
    if (view === "menu" || view === "confirmed") {
      const interval = setInterval(() => {
        const savedLoginTime = localStorage.getItem(`sasloop_login_time_${bizId}`);
        if (savedLoginTime) {
          const elapsed = Date.now() - parseInt(savedLoginTime);
          if (elapsed >= 5 * 60 * 1000) {
            handleLogout();
            alert("⏱️ Session Expired: Your 5-minute guest session has ended. Please log in with WhatsApp again.");
          }
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [view, bizId]);

  const saveSession = (name, phone) => {
    localStorage.setItem(`sasloop_name_${bizId}`, name);
    localStorage.setItem(`sasloop_phone_${bizId}`, phone);
    localStorage.setItem(`sasloop_login_time_${bizId}`, Date.now().toString());
  };

  const getStandardPhone = React.useCallback((p) => {
    if (!p) return "";
    if (p.startsWith("+")) return p;
    const cleanP = p.replace(/\D/g, "");
    if (cleanP.startsWith(countryCode)) return "+" + cleanP;
    return `+${countryCode}${cleanP}`;
  }, [countryCode]);

  const biz = data?.business;
  const bizSettings = useMemo(() => {
    if (!biz?.settings) return {};
    return typeof biz.settings === 'string' ? JSON.parse(biz.settings) : biz.settings;
  }, [biz]);
  const openingTime = bizSettings?.openingTime || biz?.opening_time || "10:00 AM";
  const closingTime = bizSettings?.closingTime || biz?.closing_time || "10:00 PM";

  const symbol = biz?.currency_code === 'USD' ? '$' : '₹';
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

  const promoDiscountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'percent') {
      return (subtotal * parseFloat(appliedDiscount.value)) / 100;
    } else {
      return parseFloat(appliedDiscount.value);
    }
  }, [appliedDiscount, subtotal]);

  const finalTotal = Math.max(
    0, 
    (taxData.isIncluded ? subtotal : (subtotal + taxData.totalTax)) 
      - promoDiscountAmount 
      - (pointsToRedeem * (parseFloat(biz?.points_to_amount_ratio) || 0.1))
  );
  
  const filteredItems = useMemo(() => {
    let items = (data?.items || []).filter(i => i.product_name.toLowerCase().includes(search.toLowerCase()));
    
    // 🔥 AI Personalized Re-sorting
    if (tasteProfile.length > 0) {
      items = [...items].sort((a, b) => {
        const scoreA = tasteProfile.filter(tag => a.description?.toLowerCase().includes(tag) || a.category?.toLowerCase().includes(tag) || (tag === 'veg' && a.is_veg)).length;
        const scoreB = tasteProfile.filter(tag => b.description?.toLowerCase().includes(tag) || b.category?.toLowerCase().includes(tag) || (tag === 'veg' && b.is_veg)).length;
        return scoreB - scoreA;
      });
    }
    return items;
  }, [data, search, tasteProfile]);

  const groupedItems = useMemo(() => filteredItems.reduce((acc, current) => { const cat = current.category || "General"; if (!acc[cat]) acc[cat] = []; acc[cat].push(current); return acc; }, {}), [filteredItems]);
  const categories = Object.keys(groupedItems);
  const totalCartItems = cart.reduce((acc, i) => acc + i.qty, 0);

  const fetchActiveOrders = React.useCallback(async () => {
    if (!customerPhone) return;
    try {
      const std = getStandardPhone(customerPhone);
      const res = await fetch(`${API_BASE}/api/public/orders/${bizId}/${encodeURIComponent(std)}`);
      const d = await res.json();
      setActiveOrders(d || []);
    } catch (e) {}
  }, [customerPhone, bizId, getStandardPhone]);

  const checkLoyalty = React.useCallback(async () => {
    if (!customerPhone) return;
    try {
      const std = getStandardPhone(customerPhone);
      const res = await fetch(`${API_BASE}/api/public/loyalty/${bizId}/${encodeURIComponent(std)}`);
      const d = await res.json();
      setLoyaltyPoints(d.points || 0);
    } catch (e) {}
  }, [customerPhone, bizId, getStandardPhone]);

  useEffect(() => {
    const targetMenuType = (tableId && tableId !== "0") ? 'pos' : 'digital';
    fetch(`${API_BASE}/api/public/menu/${bizId}?menuType=${targetMenuType}`).then(r => r.json()).then(d => { 
        const surge = d.business?.current_surge_multiplier || 1.0;
        const optimizedItems = (d.items || []).map(item => ({
          ...item,
          price: (item.ai_pricing && surge > 1) ? Math.ceil(item.price * surge) : item.price
        }));
        setData({ ...d, items: optimizedItems }); 
        setLoading(false); 
        if (optimizedItems.length > 0) setActiveCategory(optimizedItems[0].category || "General"); 
    });

    // ✅ CHECK TABLE AVAILABILITY
    if (tableId && tableId !== "0") {
        fetch(`${API_BASE}/api/public/table-status/${bizId}/${tableId}`)
            .then(r => r.json())
            .then(d => {
                if (d.status === "OCCUPIED" || d.status === "BILLED") {
                    alert(`🛎️ Table ${tableId} is currently occupied. Please contact staff if this is a mistake.`);
                } else if (d.status === "DIRTY") {
                    alert(`🧹 Table ${tableId} is being cleaned. Please wait a moment.`);
                }
            });
    }
  }, [bizId, tableId]);

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
  }, [view, customerPhone, fetchActiveOrders, checkLoyalty]);

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
            
            // Fetch loyalty and orders with the verified phone
            const loyRes = await fetch(`${API_BASE}/api/public/loyalty/${bizId}/${encodeURIComponent(stdPhone)}`);
            const loyData = await loyRes.json();
            setLoyaltyPoints(loyData.points || 0);
            
            const ordRes = await fetch(`${API_BASE}/api/public/orders/${bizId}/${encodeURIComponent(stdPhone)}`);
            const ordData = await ordRes.json();
            setActiveOrders(ordData || []);

            // 🧠 Mock AI Taste Profile Fetch
            setTasteProfile(["spicy", "biryani"]); 
            
            setView("menu");
          }
        } catch (e) {}
      }, 2500);
    }
    return () => clearInterval(itv);
  }, [authStatus, authToken, bizId]);

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
    if ((!customerPhone || customerPhone.length < 5) && (!customerName || !customerPhone)) {
        alert("Please provide your Name and Phone number to place the order.");
        return;
    }
    if (fulfillmentMode === "DELIVERY" && !customerAddress.trim()) {
        alert("Please enter a valid delivery address.");
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
          tableNumber: tableId || "0",
          items: cart,
          subtotal: taxData.isIncluded ? subtotal : subtotal + taxData.totalTax,
          cgst: taxData.cgst,
          sgst: taxData.sgst,
          totalPrice: finalTotal,
          customerName,
          customerPhone: fullPhone,
          pointsToRedeem,
          redemptionToken,
          source: "QR_MENU",
          fulfillmentMode: fulfillmentMode,
          discount_amount: promoDiscountAmount,
          address: fulfillmentMode === "DINEIN" ? `Table ${tableId || '0'}` : (fulfillmentMode === "DELIVERY" ? customerAddress : "Pickup")
        })
      });
      const o = await res.json();
      if (res.ok) { 
        setOrderRef(o.orderRef); 
        setFinalPaidAmount(o.finalPrice || 0); 
        setView("confirmed"); 
        setCart([]); 
        setAppliedDiscount(null);
        fetchActiveOrders(); 
        // ✅ RESET LOYALTY STATE
        setPointsToRedeem(0);
        setRedemptionToken(null);
        setRedemptionStatus("IDLE");
      }
      else alert(o.error || "Failed to place order: " + (o.error || ""));
    } finally { setPlacing(false); }
  };

  const callWaiter = async () => {
    if (!tableId || tableId === "0") return alert("Please scan the QR code on your table to call a waiter.");
    try {
      const res = await fetch(`${API_BASE}/api/public/call-waiter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: bizId, tableNumber: tableId })
      });
      const d = await res.json();
      if (d.success) alert("🛎️ Waiter notified! Someone will be with you shortly.");
      else alert(d.error || "Failed to notify waiter.");
    } catch (e) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`sasloop_name_${bizId}`);
    localStorage.removeItem(`sasloop_phone_${bizId}`);
    setCustomerName("");
    setCustomerPhone("");
    setIsVerified(false);
    setAuthStatus("IDLE");
    setAuthToken(null);
    setLoyaltyPoints(0);
    setPointsToRedeem(0);
    setRedemptionToken(null);
    setRedemptionStatus("IDLE");
    setView("auth");
  };

  // 1. Loading View
  if (loading) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center font-sans tracking-tight">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
          <Utensils className="absolute w-6 h-6 text-emerald-600 animate-pulse" />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 animate-pulse">
          Synchronizing Menu...
        </p>
      </div>
    );
  }

  // 2. Auth View (Zomato Red Theme UI)
  if (view === "auth") {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-slate-100 overflow-hidden font-sans">
        {/* Zomato Top Banner & Background */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-br from-rose-600 via-rose-700 to-red-700 rounded-b-[3rem] shadow-lg" />

        <div className="relative z-10 w-full max-w-[460px] animate-in fade-in zoom-in duration-300">
          <div className="bg-white px-6 sm:px-8 py-8 rounded-[2.5rem] border border-rose-100 shadow-2xl text-center">
            {/* Centered Circular Logo */}
            <div className="w-20 h-20 bg-rose-50 p-2.5 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-rose-200">
              {logoUrl ? (
                <img src={logoUrl} className="w-full h-full object-contain rounded-full" alt="logo" />
              ) : (
                <Utensils className="w-8 h-8 text-rose-600" />
              )}
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1 font-serif italic">
              {biz?.name || "Shahe Tehzeeb Restaurant"}
            </h1>
            
            <p className="text-xs text-slate-500 font-bold mb-2">
              {biz?.address || "Ganderbal, Jammu and Kashmir"}
            </p>

            {/* Open Timing */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-black text-emerald-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Open: {openingTime} - {closingTime}</span>
            </div>

            {/* Fulfillment Options */}
            <div className="flex justify-center flex-wrap gap-2 mb-6 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
              {tableId && tableId !== "0" ? (
                <button 
                  type="button"
                  onClick={() => setFulfillmentMode("DINEIN")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all font-black text-xs ${
                    fulfillmentMode === "DINEIN" 
                      ? "bg-rose-600 text-white shadow-md" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Dine-In (T-{tableId})</span>
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => alert("Please scan a table QR code for Dine-In ordering.")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-slate-400 opacity-60 cursor-not-allowed font-bold text-xs"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Dine-In</span>
                </button>
              )}

              <button 
                type="button"
                onClick={() => setFulfillmentMode("PICKUP")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all font-black text-xs ${
                  fulfillmentMode === "PICKUP" 
                    ? "bg-rose-600 text-white shadow-md" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pickup</span>
              </button>

              <button 
                type="button"
                onClick={() => setFulfillmentMode("DELIVERY")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all font-black text-xs ${
                  fulfillmentMode === "DELIVERY" 
                    ? "bg-rose-600 text-white shadow-md" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Delivery</span>
              </button>
            </div>

            {/* Input Form Details */}
            <div className="space-y-4 text-left">
              <div className="space-y-1 w-full">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Your Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                    placeholder="Enter your name" 
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-5 py-3.5 rounded-2xl text-sm font-extrabold text-slate-900 outline-none focus:border-rose-500 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1 w-full">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  WhatsApp Phone Number
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-rose-500 focus-within:bg-white transition-all">
                  <select 
                    className="bg-transparent pl-3 pr-1 py-3.5 text-xs font-black text-slate-700 outline-none border-r border-slate-200" 
                    value={countryCode} 
                    onChange={e => setCountryCode(e.target.value)}
                  >
                    {countryCodes.map(c => <option key={c.code} value={c.code} className="bg-white text-slate-900">+{c.code}</option>)}
                  </select>
                  <input 
                    type="tel" 
                    value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)} 
                    placeholder="Mobile number" 
                    className="flex-1 bg-transparent px-4 py-3.5 text-sm font-extrabold text-slate-900 outline-none placeholder:text-slate-400" 
                  />
                </div>
              </div>

              {fulfillmentMode === "DELIVERY" && (
                <div className="space-y-1 w-full animate-in slide-in-from-top duration-300">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Delivery Address
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={customerAddress} 
                      onChange={e => setCustomerAddress(e.target.value)} 
                      placeholder="Street, Building, Flat No." 
                      className="w-full bg-slate-50 border border-slate-200 pl-11 pr-5 py-3.5 rounded-2xl text-sm font-extrabold text-slate-900 outline-none focus:border-rose-500 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {authStatus === "PENDING" ? (
                <div className="py-6 text-center animate-pulse bg-rose-50 rounded-2xl border border-rose-200 mt-4">
                  <div className="w-12 h-12 bg-rose-600/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-rose-200">
                    <RefreshCw className="animate-spin w-5 h-5 text-rose-600" />
                  </div>
                  <p className="text-xs font-black text-rose-700 uppercase tracking-widest">
                    Verifying via WhatsApp...
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
                    Please send the generated message in WhatsApp to confirm your number
                  </p>
                  <button 
                    type="button"
                    onClick={() => setAuthStatus("IDLE")} 
                    className="mt-3 text-[10px] font-black text-rose-600 uppercase tracking-widest underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-3">
                  <button 
                    type="button"
                    onClick={() => {
                      if (!customerName.trim() || customerPhone.length < 5) {
                        return alert("Please enter your name and valid phone number");
                      }
                      handleRequestAuth();
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" /> Verify via WhatsApp & Enter Menu
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      if (!customerName.trim() || customerPhone.length < 5) {
                        return alert("Please enter your name and phone number");
                      }
                      saveSession(customerName, customerPhone);
                      setView("menu");
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl text-[11px] uppercase tracking-wider transition-all"
                  >
                    Direct Guest Login &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Order Confirmed View (Light Theme)
  if (view === "confirmed") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700 font-sans">
        <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-md border border-emerald-100">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 uppercase italic font-serif">
          Success!
        </h1>
        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-10">
          We're preparing your food
        </p>

        <div className="bg-white border border-slate-150 rounded-[3rem] p-8 w-full max-w-sm mb-10 text-center shadow-lg">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Order Reference
          </p>
          <p className="text-4xl font-extrabold text-slate-900 tracking-tighter mb-4 font-mono italic">
            {orderRef}
          </p>
          <p className="text-[10px] text-slate-550 uppercase tracking-widest leading-relaxed">
            Amount Paid: {symbol}{parseFloat(finalPaidAmount).toFixed(2)}
          </p>
        </div>

        <button 
          onClick={() => setView("menu")} 
          className="w-full max-w-[280px] bg-slate-900 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  // 4. Main Menu View (LIGHT THEME)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans tracking-tight pb-24 relative">
      {/* Dynamic Header matching Lagoon Restaurant UI */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-150 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Left Section: Logo & Restaurant Name with Caret & Status */}
          <div className="flex items-center gap-3 relative">
            <div className="w-10 h-10 bg-blue-900/90 rounded-full overflow-hidden border border-slate-200 shrink-0 p-1 flex items-center justify-center shadow-sm">
              {logoUrl ? (
                <img src={logoUrl} className="w-full h-full object-contain rounded-full" alt="logo" />
              ) : (
                <Utensils className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <button 
                onClick={() => setShowHeaderDropdown(!showHeaderDropdown)}
                className="flex items-center gap-1 text-sm font-black text-slate-900 uppercase tracking-tight hover:text-slate-700 transition-colors font-serif italic"
              >
                <span>{biz?.name || "The Lagoon Restaurant"}</span>
                <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showHeaderDropdown ? 'rotate-90' : ''}`} />
              </button>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-500">
                  Open {openingTime} - {closingTime}
                </span>
              </div>
            </div>

            {/* Header Dropdown for Store Info */}
            {showHeaderDropdown && (
              <div className="absolute left-0 top-12 w-72 bg-white border border-slate-150 rounded-2xl p-5 shadow-xl z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Store Details</h4>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{biz?.address || "Jammu and Kashmir, India"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{openingTime} - {closingTime}</span>
                  </div>
                  <div className="flex gap-2">
                    <MessageCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{biz?.whatsapp_number || biz?.phone || "WhatsApp Support"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Middle/Right Section: Book a Table, Search box, language icon, cart icon, and hamburger */}
          <div className="flex items-center gap-3">
            {/* Book a Table button for Online Ordering */}
            {(!tableId || tableId === "0") && (
              <button
                type="button"
                onClick={() => setShowReservationModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                <Clock className="w-3.5 h-3.5" /> Book a Table
              </button>
            )}

            {/* Call Waiter button for Table QR */}
            {tableId && tableId !== "0" && (
              <button
                type="button"
                onClick={callWaiter}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md animate-bounce active:scale-95"
              >
                <BellRing className="w-3.5 h-3.5" /> Call Waiter
              </button>
            )}

            {/* Desktop/Tablet Search Input */}
            <div className="hidden md:flex relative w-48 lg:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Search menu..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>

            {/* Language Selection Button */}
            <button 
              onClick={() => alert("Language translation menu (Arabic/English) is loading...")}
              className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
              title="Change Language"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Cart Bag Icon with badge */}
            <button 
              onClick={() => setShowCartDrawer(true)} 
              className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors relative shadow-sm active:scale-95"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[9px] font-black font-mono border-2 border-white shadow-sm animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Hamburger Menu Icon */}
            <button 
              onClick={() => setShowSidebarDrawer(true)}
              className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm active:scale-95"
              title="Open Menu"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* TRACKING & HISTORY HUB DRAWER (LIGHT THEME) */}
      {showOrders && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowOrders(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-[400px] bg-white border-l border-slate-100 shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col font-sans">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-slate-900">
                My Hub <Activity className="w-6 h-6 text-emerald-600" />
              </h2>
              <button 
                onClick={() => setShowOrders(false)} 
                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="flex bg-slate-50 p-2 mx-8 mt-6 rounded-2xl border border-slate-150">
              <button 
                onClick={() => setOrderTab("tracking")} 
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  orderTab === 'tracking' ? 'bg-white text-emerald-600 shadow-sm font-bold' : 'text-slate-400'
                }`}
              >
                Tracking
              </button>
              <button 
                onClick={() => setOrderTab("history")} 
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  orderTab === 'history' ? 'bg-white text-emerald-600 shadow-sm font-bold' : 'text-slate-400'
                }`}
              >
                History
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {/* VIP Key Card Pass (Retained Dark Premium Style for luxury contrast) */}
              <div className="bg-gradient-to-br from-indigo-900 via-slate-950 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group border border-indigo-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-1">
                        Exclusive Member
                      </p>
                      <h4 className="text-2xl font-black tracking-tighter uppercase italic font-serif">
                        {customerName || 'Loyal Guest'}
                      </h4>
                    </div>
                    <Gift className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] font-black uppercase text-slate-500 mb-1">
                        Loyalty Points
                      </p>
                      <p className="text-2xl font-black tracking-tighter text-emerald-400 font-mono">
                        {loyaltyPoints}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowVIPKey(true)}
                      className="px-4 py-2 bg-white text-indigo-950 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all"
                    >
                      Wallet Pass
                    </button>
                  </div>
                </div>
              </div>

              {orderTab === "tracking" ? (
                activeOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center opacity-40">
                    <Package className="w-12 h-12 mb-4 text-slate-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-center text-slate-500">
                      No Active Orders<br/>Start Ordering!
                    </p>
                  </div>
                ) : (
                  activeOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').map(order => (
                    <div key={order.id} className="bg-slate-50 rounded-3xl p-6 border border-slate-150 shadow-sm transition-all hover:bg-slate-100/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black text-slate-450 uppercase">{order.order_reference}</span>
                        <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          order.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-900 uppercase truncate mb-1">
                        {(typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || []).map(i => i.name || i.product_name)).join(", ")}
                      </p>
                      <p className="text-lg font-extrabold text-slate-900 uppercase italic font-serif">
                        {symbol}{parseFloat(order.total_price).toFixed(0)}
                      </p>
                    </div>
                  ))
                )
              ) : (
                activeOrders.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center opacity-40">
                    <History className="w-12 h-12 mb-4 text-slate-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      History is Empty
                    </p>
                  </div>
                ) : (
                  activeOrders.map(order => (
                    <div key={order.id} className="bg-slate-50 rounded-3xl p-6 border border-slate-150 shadow-sm mb-4 opacity-90">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${
                          order.status === 'COMPLETED' ? 'text-emerald-600' : 'text-slate-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 uppercase truncate mb-1">
                        {(typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || []).map(i => i.name || i.product_name)).join(", ")}
                      </p>
                      <p className="text-sm font-black text-emerald-600 mt-1 uppercase italic font-serif">
                        {symbol}{parseFloat(order.total_price).toFixed(0)}
                      </p>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Single Column Layout Container */}
      <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
        
        {/* 1. DYNAMIC TOP BANNERS FROM DIGITAL ORDER SETTINGS */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth mb-8 py-1">
          {((biz?.settings?.banners && biz.settings.banners.length > 0) 
            ? biz.settings.banners.map(b => b.startsWith("http") ? b : `${API_BASE}${b}`)
            : [
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
              ]
          ).map((bannerSrc, bIdx) => (
            <div key={bIdx} className="min-w-[85%] sm:min-w-[48%] md:min-w-[32%] aspect-[16/10] rounded-[2rem] overflow-hidden shadow-md hover:scale-[1.01] transition-transform duration-300 border border-rose-100">
              <img src={bannerSrc} className="w-full h-full object-cover" alt={`Banner ${bIdx + 1}`} />
            </div>
          ))}
        </div>

        {/* 2. PROMOTIONS & OFFERS (Dashed cards shown dynamically only if database has active discounts) */}
        {data?.discounts && data.discounts.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.discounts.map((disc, idx) => {
                const isApplied = appliedDiscount?.id === disc.id;
                return (
                  <button 
                    key={disc.id || idx}
                    onClick={() => {
                      if (isApplied) setAppliedDiscount(null);
                      else setAppliedDiscount(disc);
                    }}
                    className={`w-full text-left bg-white border-2 border-dashed rounded-2xl p-5 flex items-center justify-between shadow-sm relative transition-all active:scale-[0.98] ${
                      isApplied 
                        ? 'border-emerald-500 bg-emerald-50/15' 
                        : 'border-slate-200 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        isApplied ? 'bg-emerald-500 border-transparent text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
                      }`}>
                        <Percent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 tracking-tight truncate">{disc.name}</h4>
                        <p className="text-[10px] font-bold text-slate-500 mt-1 font-mono">
                          {disc.type === 'percent' ? `${disc.value}% OFF` : `${symbol}${disc.value} OFF`}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Click to {isApplied ? 'Remove' : 'Apply'} discount</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-xs font-black text-slate-400 tracking-widest">{idx + 1}/{data.discounts.length}</span>
                      {isApplied && (
                        <span className="text-[8px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Applied</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. CATEGORIES FOLDER GRID (What would you like to order?) */}
        <div className="mb-10 text-left">
          <h3 className="text-xl font-extrabold text-slate-950 tracking-tight mb-5">
            What would you like to order?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => {
                  const el = document.getElementById(`cat-${cat}`);
                  if (el) {
                     const offset = 90;
                     const elementPosition = el.getBoundingClientRect().top;
                     const offsetPosition = elementPosition + window.pageYOffset - offset;
                     window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                  setActiveCategory(cat);
                }}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-150 transition-all hover:scale-[1.02] hover:shadow-md text-left active:scale-[0.98]"
              >
                <img 
                  src={getCategoryImg(cat)} 
                  className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-all duration-500" 
                  alt={cat} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-black text-sm tracking-tight leading-tight uppercase font-serif italic drop-shadow-sm group-hover:text-emerald-300 transition-colors">
                    {cat}
                  </h4>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search bar & Mobile category links */}
        <div className="py-5 border-b border-slate-150 sticky top-16 z-[80] bg-slate-50/90 backdrop-blur-md mb-8">
          <div className="relative group md:hidden">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              placeholder="Search dishes, drinks..." 
              className="w-full bg-white border border-slate-200 rounded-2xl pl-16 pr-8 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 transition-all" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          {/* Sticky categories horizontal list (Mobile/Tablet) */}
          <div className="flex gap-2 mt-3 md:mt-0 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => {
                  const el = document.getElementById(`cat-${cat}`);
                  if (el) {
                     const offset = 90;
                     const elementPosition = el.getBoundingClientRect().top;
                     const offsetPosition = elementPosition + window.pageYOffset - offset;
                     window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                  setActiveCategory(cat);
                }}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-all ${
                  activeCategory === cat 
                    ? 'bg-rose-600 text-white shadow-md font-bold' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-rose-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Item Grid Listing */}
        <div className="space-y-14">
          {categories.map(cat => (
            <div key={cat} id={`cat-${cat}`} className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6 text-left">
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-[0.25em] font-serif italic">
                  {cat}
                </h3>
                <div className="flex-1 h-[1px] bg-slate-200 rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {groupedItems[cat].map(item => {
                  const inCart = cart.find(c => c.id === item.id);
                  return (
                    <div key={item.id} className="group bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
                        {item.image_url ? (
                          <img 
                            src={item.image_url.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" 
                            alt="Item media" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-25">
                            <Utensils className="w-8 h-8 text-slate-400" />
                          </div>
                        )}

                        {/* Zomato Style Veg/Non-Veg Icon Badge */}
                        <div className="absolute top-2 left-2 p-1 rounded bg-white/95 shadow-sm border border-slate-100 flex items-center justify-center">
                          <div className={`w-3.5 h-3.5 border rounded-xs flex items-center justify-center p-0.5 ${item.is_veg !== false ? 'border-emerald-600' : 'border-rose-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.is_veg !== false ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                          </div>
                        </div>

                        {/* Recommended Indicator Badge */}
                        {item.recommended === 1 && (
                          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-rose-600 text-white text-[7px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Star className="w-2.5 h-2.5 fill-white" /> Bestseller
                          </div>
                        )}

                        {/* Float Price Tag */}
                        <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-white/95 border border-slate-150 rounded-xl text-xs font-black text-rose-600 font-mono shadow-sm">
                          {symbol}{item.price}
                        </div>

                        {/* AR PREVIEW BUTTON */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert("✨ Reality Engine Initializing... \n\n This feature allows customers to see a 3D AR model of " + item.product_name + " on their table."); }}
                          className="absolute top-2 left-9 w-7 h-7 bg-white/85 backdrop-blur-md rounded-lg flex items-center justify-center text-slate-800 border border-slate-200 hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-md"
                        >
                          <Scan className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col justify-between text-left">
                        <div>
                          <h4 className="text-[12px] sm:text-[13px] font-black text-slate-900 leading-tight uppercase tracking-tight italic font-serif line-clamp-1 mb-1">
                            {item.product_name}
                          </h4>
                          <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium line-clamp-2 leading-relaxed mb-3">
                            {item.description || "Freshly prepared with handpicked ingredients."}
                          </p>
                        </div>

                        <div className="mt-auto">
                          {inCart ? (
                            <div className="flex items-center justify-between bg-rose-50 text-rose-700 rounded-xl p-1 h-9 border border-rose-200 shadow-sm font-bold">
                              <button 
                                onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0))} 
                                className="w-7 h-full flex items-center justify-center hover:bg-rose-100 rounded-lg transition-all"
                              >
                                <Minus className="w-3.5 h-3.5 text-rose-600" />
                              </button>
                              <span className="text-[12px] font-black font-mono w-6 text-center text-rose-700">{inCart.qty}</span>
                              <button 
                                onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} 
                                className="w-7 h-full flex items-center justify-center hover:bg-rose-100 rounded-lg transition-all"
                              >
                                <Plus className="w-3.5 h-3.5 text-rose-600" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setCart([...cart, { ...item, qty: 1 }])} 
                              className="w-full bg-white text-rose-600 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border border-rose-200 transition-all hover:bg-rose-600 hover:text-white shadow-sm flex items-center justify-center gap-1 active:scale-95"
                            >
                              ADD <Plus className="w-3 h-3 text-rose-600 group-hover:text-white" />
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

        {/* Store Info Footer (Matches screenshot 3 visually) */}
        <div className="border-t border-slate-200 pt-12 pb-10 text-center mt-16">
          <div className="flex justify-center gap-5 mb-8">
            <a href={`tel:${biz?.phone || ''}`} className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-950 flex items-center justify-center shadow-sm transition-colors">
              <MessageCircle className="w-4.5 h-4.5" />
            </a>
            {biz?.social_instagram && (
              <a href={biz.social_instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-pink-600 flex items-center justify-center shadow-sm transition-colors">
                <Globe className="w-4.5 h-4.5" />
              </a>
            )}
            {biz?.social_website && (
              <a href={biz.social_website} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 flex items-center justify-center shadow-sm transition-colors">
                <Globe className="w-4.5 h-4.5" />
              </a>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-left max-w-md mx-auto shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Store Info</h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex gap-3">
                <MapPin className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span>{biz?.address || "Jammu and Kashmir, India"}</span>
              </div>
              <div className="flex gap-3">
                <Clock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span>{openingTime} - {closingTime}</span>
              </div>
              <div className="flex gap-3">
                <MessageCircle className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span>{biz?.whatsapp_number || biz?.phone || "WhatsApp Support"}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-[11px] text-slate-500 font-medium">
            Made With <span className="text-rose-500 mx-0.5">❤️</span> in Saudi Arabia
          </div>
          <div className="text-[10px] text-emerald-600 mt-1.5 uppercase tracking-widest font-black flex items-center justify-center gap-1">
            <span>Powered By</span>
            <span className="font-serif italic font-extrabold text-slate-900">SaSLoop POS</span>
          </div>
        </div>
      </div>

      {/* HAMBURGER SIDEBAR DRAWER (LIGHT THEME) */}
      {showSidebarDrawer && (
        <div className="fixed inset-0 z-[500]">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowSidebarDrawer(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-white border-l border-slate-150 shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col justify-between font-sans">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col relative text-left">
              <button 
                onClick={() => setShowSidebarDrawer(false)} 
                className="absolute top-6 right-6 w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-150"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

              {/* Logo & Name */}
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 p-0.5 bg-blue-900 flex items-center justify-center shrink-0 shadow-sm">
                  {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain rounded-full" alt="logo" /> : <Utensils className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase italic font-serif leading-none mb-1">
                    {biz?.name || "The Lagoon Restaurant"}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 truncate max-w-[160px]">
                    {biz?.address || "Kuwait City"}
                  </p>
                </div>
              </div>

              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(biz?.address || "The Lagoon Restaurant, Kuwait City")}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-fit flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-700 transition-colors shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Direction
              </a>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 py-6 px-4 space-y-2 text-left overflow-y-auto no-scrollbar">
              <button 
                onClick={() => { setShowSidebarDrawer(false); setShowReservationModal(true); }}
                className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-800 transition-all active:scale-[0.98]"
              >
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Table Reservation</span>
              </button>

              <button 
                onClick={() => { setShowSidebarDrawer(false); setShowOrders(true); }}
                className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-800 transition-all active:scale-[0.98]"
              >
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Account & Orders</span>
              </button>

              {tableId && tableId !== "0" && (
                <button 
                  onClick={() => { setShowSidebarDrawer(false); callWaiter(); }}
                  className="w-full px-5 py-4 bg-amber-50 hover:bg-amber-100 border border-amber-100 hover:border-amber-250 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-850 transition-all active:scale-[0.98]"
                >
                  <BellRing className="w-5 h-5 text-amber-600 animate-bounce" />
                  <span>Call Waiter</span>
                </button>
              )}

              {customerPhone ? (
                <button 
                  onClick={() => { setShowSidebarDrawer(false); handleLogout(); }}
                  className="w-full px-5 py-4 bg-rose-50 hover:bg-rose-100 border border-rose-100 hover:border-rose-200 rounded-2xl flex items-center gap-3 text-sm font-bold text-rose-700 transition-all active:scale-[0.98]"
                >
                  <LogOut className="w-5 h-5 text-rose-600" />
                  <span>Logout</span>
                </button>
              ) : (
                <button 
                  onClick={() => { setShowSidebarDrawer(false); setView("auth"); }}
                  className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-800 transition-all active:scale-[0.98]"
                >
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                <span>Powered By</span>
                <span className="font-serif italic font-extrabold text-slate-800">SaSLoop POS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE RESERVATION MODAL */}
      {showReservationModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-150 shadow-2xl p-8 relative animate-in zoom-in-95 duration-300 text-left">
            <button 
              onClick={() => setShowReservationModal(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-50 border border-slate-150 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <h3 className="text-xl font-black text-slate-900 uppercase italic font-serif tracking-tight mb-1">Book a Table</h3>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-6">Select your table preferences</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const name = fd.get('name');
              const phone = fd.get('phone');
              const guests = fd.get('guests');
              const date = fd.get('date');
              const time = fd.get('time');
              
              try {
                const res = await fetch(`${API_BASE}/api/public/reservation`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId: bizId, customer_name: name, customer_number: phone, guests, reservation_date: date, reservation_time: time })
                });
                const r = await res.json();
                if (r.success) {
                  alert("📅 Table reservation requested successfully! We'll confirm via WhatsApp.");
                  setShowReservationModal(false);
                } else {
                  alert(r.error || "Failed to book table.");
                }
              } catch (err) {
                alert("Something went wrong. Please try again.");
              }
            }} className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Name</label>
                <input required defaultValue={customerName} name="name" type="text" className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500" placeholder="Enter name" />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                <input required defaultValue={customerPhone} name="phone" type="tel" className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500" placeholder="Enter phone" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Guests</label>
                  <input required defaultValue="2" name="guests" type="number" min="1" className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Date</label>
                  <input required defaultValue={new Date().toISOString().split('T')[0]} name="date" type="date" className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Time</label>
                <input required defaultValue="19:00" name="time" type="time" className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500" />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95">
                Book Table
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🛒 MOBILE CART SYSTEM BUTTON */}
      {cart.length > 0 && !showCartDrawer && (
        <div className="lg:hidden fixed bottom-8 left-6 right-6 z-[100] animate-in slide-in-from-bottom-12">
          <button 
            onClick={() => setShowCartDrawer(true)}
            className="w-full bg-slate-900 text-white rounded-[2.5rem] p-3.5 flex items-center justify-between shadow-2xl border border-white/5 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3.5 pl-3">
              <div className="relative">
                <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center border-2 border-slate-900">
                  <span className="text-[9px] font-black font-mono">{totalCartItems}</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1 font-sans">
                  View Bag
                </p>
                <p className="text-base font-extrabold font-mono text-emerald-400">
                  {symbol}{finalTotal.toFixed(0)}
                </p>
              </div>
            </div>
            <div className="bg-emerald-500 text-slate-950 px-5 py-3 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 font-sans shadow-lg">
              Next <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* 🎁 CART DRAWER OVERLAY (LIGHT THEME, RESPONSIVE SLIDE-OUT) */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-[300] flex items-end lg:items-stretch lg:justify-end justify-center font-sans">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowCartDrawer(false)} />
          <div className="relative w-full max-w-lg lg:max-w-md bg-white rounded-t-[3rem] lg:rounded-t-none lg:rounded-l-[2rem] border-t lg:border-t-0 lg:border-l border-slate-100 shadow-2xl animate-in slide-in-from-bottom-full lg:slide-in-from-right duration-500 flex flex-col max-h-[90vh] lg:max-h-full lg:h-full">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight italic font-serif">
                  My Order Bag
                </h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  {totalCartItems} Items Selected
                </p>
              </div>
              <button 
                onClick={() => setShowCartDrawer(false)} 
                className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 active:scale-90 transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
              {/* Item List */}
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3.5 py-1.5 animate-in fade-in slide-in-from-right-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-150 overflow-hidden shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`} className="w-full h-full object-cover" alt="p" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20"><Utensils className="w-5 h-5 text-slate-400" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 leading-tight uppercase italic truncate font-serif">
                        {item.product_name}
                      </p>
                      <p className="text-[9px] font-black text-slate-400 uppercase mt-0.5">
                        {symbol}{item.price} per item
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-1 flex items-center gap-2.5 border border-slate-100">
                      <button 
                        onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0))}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-600 active:scale-90 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black text-slate-900 font-mono w-4 text-center">{item.qty}</span>
                      <button 
                        onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-600 active:scale-90 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loyalty & Auth in Drawer */}
              <div className="pt-4 border-t border-slate-100">
                {(!customerPhone || customerPhone.length < 5 || customerPhone === 'undefined') ? (
                  <div className="bg-slate-55 p-5 rounded-3xl border border-slate-100 space-y-4">
                    <p className="text-[9px] font-black text-slate-450 uppercase tracking-widest ml-1">
                      Identify for Rewards
                    </p>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full bg-white border border-slate-200 px-5 py-3.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 transition-all placeholder:text-slate-400"
                      value={customerName || ''}
                      onChange={e => setCustomerName(e.target.value)}
                    />
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-600 transition-all">
                      <select 
                        className="bg-transparent pl-3 pr-1 py-3.5 text-xs font-bold text-slate-800 outline-none border-r border-slate-100" 
                        value={countryCode} 
                        onChange={e => setCountryCode(e.target.value)}
                      >
                        {countryCodes.map(c => <option key={c.code} value={c.code}>+{c.code}</option>)}
                      </select>
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        className="flex-1 bg-transparent px-3 py-3.5 text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400" 
                        value={customerPhone || ''}
                        onChange={e => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-850 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles className="w-10 h-10 text-white" /></div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">
                          Loyalty Profile
                        </p>
                        <p className="text-sm font-black text-white uppercase italic font-serif">
                          {customerName || 'Loyal Guest'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-slate-450 uppercase tracking-widest leading-none mb-1">
                          Balance
                        </p>
                        <p className="text-sm font-extrabold text-emerald-400 font-mono">
                          {loyaltyPoints || 0}
                        </p>
                      </div>
                    </div>
                    
                    {(loyaltyPoints || 0) >= (biz?.min_redeem_points || 300) && pointsToRedeem === 0 && (
                      <button 
                        onClick={handleRedeemRequest}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" /> Redeem Points Now
                      </button>
                    )}

                    {pointsToRedeem > 0 && (
                      <div className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                        <p>Applied Points: {pointsToRedeem}</p>
                        <p>-{symbol}{(pointsToRedeem * (parseFloat(biz?.points_to_amount_ratio) || 0.1)).toFixed(0)}</p>
                      </div>
                    )}

                    {promoDiscountAmount > 0 && (
                      <div className="w-full mt-2.5 py-2.5 px-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                        <p>Applied Promo: {appliedDiscount.name}</p>
                        <p>-{symbol}{promoDiscountAmount.toFixed(0)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Address Mode in Mobile */}
              {fulfillmentMode === "DELIVERY" && (
                <div className="space-y-2 mt-4">
                  <p className="text-[9px] font-black text-slate-450 uppercase tracking-widest ml-1">
                    Delivery Address
                  </p>
                  <input 
                    type="text" 
                    placeholder="Enter street, flat / house no, building name" 
                    className="w-full bg-white border border-slate-200 px-5 py-3.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 transition-all placeholder:text-slate-400"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Footer Summary and Place Order */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 rounded-t-[3rem]">
              <div className="flex justify-between items-center mb-6 px-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Total Payable
                </p>
                <p className="text-3xl font-extrabold text-slate-950 tracking-tighter font-mono text-emerald-600">
                  {symbol}{finalTotal.toFixed(0)}
                </p>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => {
                     if (!customerName || !customerPhone || customerPhone.length < 5) {
                       return alert("Please enter your name and valid phone number");
                     }
                     placeOrder();
                  }} 
                  disabled={placing}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.15em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {placing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Confirm & Place Order <ChevronRight className="w-5 h-5 text-white" /></>}
                </button>
                <button 
                  onClick={() => alert("💎 Premium Instant Pay (Apple/Google/UPI) is being integrated for your region.")}
                  className="w-full bg-white border border-slate-200 text-slate-900 py-3.5 rounded-[1.5rem] font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> One-Tap Pay
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center text-slate-450">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-3">
                  Powered by SaSLoop
                </p>
                <div className="flex justify-center gap-3">
                  {biz?.social_instagram && (
                    <a href={biz.social_instagram} target="_blank" rel="noreferrer" className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-800">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {biz?.social_website && (
                    <a href={biz.social_website} target="_blank" rel="noreferrer" className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-800">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {biz?.settings?.google_review_link && (
                    <a href={biz.settings.google_review_link} target="_blank" rel="noreferrer" className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-800">
                      <Star className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* FLOATING ACTION UTILITY BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[150]">
        <button 
          onClick={() => setShowCategories(true)}
          className="w-14 h-14 bg-white border border-slate-200 text-slate-800 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Categories"
        >
          <LayoutGrid className="w-5 h-5 text-emerald-600" />
        </button>

        {tableId && tableId !== "0" && (
          <button 
            onClick={callWaiter}
            className="w-14 h-14 bg-amber-500 text-slate-950 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            title="Call Waiter"
          >
            <BellRing className="w-6 h-6 animate-pulse" />
          </button>
        )}

        <a 
          href={`https://wa.me/${(biz?.whatsapp_number || biz?.phone || '').replace(/\D/g, '')}`} 
          target="_blank" 
          rel="noreferrer"
          className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Contact Store"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* CATEGORIES NAVIGATION MODAL */}
      {showCategories && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowCategories(false)} />
          <div className="relative w-full max-w-sm bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl p-8 pb-12 animate-in slide-in-from-bottom-full duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 italic font-serif uppercase tracking-tight">
                  Menu Sections
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Jump to any category
                </p>
              </div>
              <button 
                onClick={() => setShowCategories(false)} 
                className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
              >
                <X className="w-5 h-5 text-slate-450" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 max-h-[45vh] overflow-y-auto no-scrollbar pr-1">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => {
                    const el = document.getElementById(`cat-${cat}`);
                    if (el) {
                       const offset = 140;
                       const elementPosition = el.getBoundingClientRect().top;
                       const offsetPosition = elementPosition + window.pageYOffset - offset;
                       window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                    setActiveCategory(cat);
                    setShowCategories(false);
                  }}
                  className="p-4 bg-slate-55 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center transition-all border border-slate-100 hover:border-emerald-100 active:scale-95"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIP PASS KEY MODAL (Retained dark style for luxury contrast) */}
      {showVIPKey && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-sm rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 font-sans">
            <div className="bg-slate-950 p-10 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
              <h3 className="text-2xl font-black tracking-tight uppercase italic mb-1 font-serif">
                Elite VIP
              </h3>
              <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.45em] mb-8">
                Digital Pass Key
              </p>
              
              <div className="w-36 h-36 bg-white rounded-[2rem] mx-auto mb-8 p-4 shadow-2xl flex items-center justify-center border-4 border-indigo-500/20">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
              
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                Scan QR at outlet for instant cashback points
              </p>
              
              <div className="flex flex-col gap-2.5">
                <button className="w-full py-4 bg-white hover:bg-slate-100 text-slate-950 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all">
                  Add to Apple Wallet <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button className="w-full py-4 bg-slate-800 hover:bg-slate-750 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all border border-white/5">
                  Google Pay Wallet <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowVIPKey(false)} 
              className="w-full py-5 text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-widest border-t border-white/5 bg-slate-900 transition-all"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerMenu;
