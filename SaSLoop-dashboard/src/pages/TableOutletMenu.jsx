import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingBag, Plus, Minus, X, Check, Phone, MapPin,
  Clock, AlertTriangle, CheckCircle2, ChevronRight, User, LogOut, ArrowRight,
  Sparkles, RefreshCw, Flame, ShieldCheck, Tag, Leaf, Utensils, Menu, MessageCircle, FileText, Award, CreditCard
} from "lucide-react";
import API_BASE from "../config";

const WhatsAppIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.55 4.108 1.516 5.843L0 24l6.335-1.482C8.01 23.473 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm.006 22c-1.802 0-3.568-.475-5.114-1.378l-.367-.215-3.766.881.896-3.666-.239-.379A9.948 9.948 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-9.994 10z" />
  </svg>
);

const TableOutletMenu = () => {
  const { userId, tableId } = useParams();
  const activeTable = tableId ? decodeURIComponent(tableId).replace(/^Table\s+/i, '') : "1";
  const activeOutletId = userId || "3";

  // Data States
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // Table Status
  const [tableStatus, setTableStatus] = useState(null);
  const [showOccupiedNotice, setShowOccupiedNotice] = useState(false);

  // Cart & Verification Modal
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(`table_cart_${activeOutletId}_${activeTable}`);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isVerifyingOrder, setIsVerifyingOrder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Option Groups Modal
  const [customizingItem, setCustomizingItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  // WhatsApp OTP Login State
  const [userSession, setUserSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("customer_user_session")) || null;
    } catch { return null; }
  });
  const isUserLoggedIn = Boolean(userSession && (userSession.isLoggedIn || userSession.phone));

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPhone, setAuthPhone] = useState("");
  const [authName, setAuthName] = useState("");
  const [otpStep, setOtpStep] = useState(1);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [pendingDishToAdd, setPendingDishToAdd] = useState(null);

  // Profile Drawer State (Matching Online Menu)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState("orders"); // "orders" | "ledger" | "loyalty"
  const [customerOrdersList, setCustomerOrdersList] = useState([]);
  const [customerLedgerData, setCustomerLedgerData] = useState({ points: 0, transactions: [] });
  const [isLoadingProfileData, setIsLoadingProfileData] = useState(false);

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`table_cart_${activeOutletId}_${activeTable}`, JSON.stringify(cart));
    } catch (e) { }
  }, [cart, activeOutletId, activeTable]);

  // Fast Instant Parallel Data Loading
  useEffect(() => {
    let isMounted = true;

    const loadParallelData = async () => {
      try {
        const [tableRes, menuRes] = await Promise.allSettled([
          fetch(`${API_BASE}/api/public/table-status/${activeOutletId}/${encodeURIComponent(activeTable)}`).then(r => r.json()),
          fetch(`${API_BASE}/api/public/menu/${activeOutletId}?mode=table&table=${encodeURIComponent(activeTable)}`).then(r => r.json())
        ]);

        if (!isMounted) return;

        // Process Table Status
        if (tableRes.status === "fulfilled" && tableRes.value) {
          setTableStatus(tableRes.value.status);
          const activePhone = (tableRes.value.customer_number || "").replace(/\D/g, "").slice(-10);
          const currentPhone = (userSession?.phone || "").replace(/\D/g, "").slice(-10);

          if (tableRes.value.status === "OCCUPIED" && activePhone && currentPhone && activePhone !== currentPhone) {
            setShowOccupiedNotice(true);
          }
        }

        // Process Menu & Restaurant Data
        if (menuRes.status === "fulfilled" && menuRes.value && !menuRes.value.error) {
          const data = menuRes.value;
          if (data.business) setRestaurant(data.business);

          const loadedItems = (data.items || []).map((item) => {
            const pName = item.product_name || item.name || item.item_name || "Menu Item";
            const cat = (item.category && item.category.trim() !== "") ? item.category.trim() : (item.category_name || "General");

            let resolvedImage = item.image_url || "";
            if (resolvedImage && !resolvedImage.startsWith("http")) {
              resolvedImage = `${API_BASE}${resolvedImage.startsWith('/') ? '' : '/'}${resolvedImage}`;
            }

            return {
              id: item.id || `item-${Math.random()}`,
              product_name: pName,
              category: cat,
              price: parseFloat(item.price || item.base_price || 0),
              description: item.description || `Delicious ${pName} prepared fresh for your table.`,
              image_url: resolvedImage,
              is_veg: item.is_veg !== undefined ? Boolean(item.is_veg) : item.food_type === "Veg",
              short_code: item.short_code || "",
              option_groups: item.option_groups || []
            };
          });

          setDishes(loadedItems);
          const cats = Array.from(new Set(loadedItems.map(i => i.category).filter(Boolean)));
          setCategories(cats);
        }
      } catch (err) {
        console.error("Instant load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadParallelData();
  }, [activeOutletId, activeTable, userSession?.phone]);

  // Fetch Customer Profile Data on Drawer Open
  useEffect(() => {
    if (!isProfileOpen || !userSession?.phone) return;
    setIsLoadingProfileData(true);
    const cleanPhone = encodeURIComponent(userSession.phone.trim());

    Promise.allSettled([
      fetch(`${API_BASE}/api/public/orders/${activeOutletId}/${cleanPhone}`).then(r => r.json()),
      fetch(`${API_BASE}/api/public/transactions/${activeOutletId}/${cleanPhone}`).then(r => r.json())
    ]).then(([ordersRes, ledgerRes]) => {
      if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)) {
        setCustomerOrdersList(ordersRes.value);
      }
      if (ledgerRes.status === "fulfilled" && ledgerRes.value && !ledgerRes.value.error) {
        setCustomerLedgerData(ledgerRes.value);
      }
    }).finally(() => setIsLoadingProfileData(false));
  }, [isProfileOpen, userSession?.phone, activeOutletId]);

  // Real WhatsApp OTP Login Handlers
  const handleSendWhatsAppOtp = async (e) => {
    e.preventDefault();
    if (!authPhone || authPhone.trim().length < 10) {
      alert("Please enter a valid 10-digit phone number!");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${API_BASE}/api/public/send-whatsapp-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: activeOutletId, phone: authPhone })
      });
      const data = await res.json();
      if (data && data.success) {
        setOtpStep(2);
      } else {
        alert(data.error || "Failed to send WhatsApp OTP.");
      }
    } catch (err) {
      console.error("WhatsApp OTP error:", err);
      setOtpStep(2);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyWhatsAppOtp = async (e) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length < 4) {
      alert("Please enter a valid 4-digit OTP!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/public/verify-whatsapp-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: activeOutletId, phone: authPhone, otp: enteredOtp })
      });
      const data = await res.json();
      if (data && data.success) {
        const sessionObj = {
          phone: authPhone,
          name: authName || "WhatsApp Customer",
          authMethod: "WHATSAPP",
          isLoggedIn: true
        };
        localStorage.setItem("customer_user_session", JSON.stringify(sessionObj));
        setUserSession(sessionObj);
        setIsAuthModalOpen(false);
        setOtpStep(1);
        setEnteredOtp("");

        if (pendingDishToAdd) {
          handleAddToCart(pendingDishToAdd);
          setPendingDishToAdd(null);
        }
      } else {
        alert(data.error || "Invalid OTP code.");
      }
    } catch (err) {
      console.error("OTP error:", err);
      alert("Verification failed.");
    }
  };

  // Add Item to Cart
  const handleAddToCart = (dish) => {
    if (!isUserLoggedIn) {
      setPendingDishToAdd(dish);
      setIsAuthModalOpen(true);
      return;
    }

    if (dish.option_groups && dish.option_groups.length > 0) {
      setCustomizingItem(dish);
      const initOpts = {};
      dish.option_groups.forEach(g => {
        if (g.options && g.options.length > 0) initOpts[g.id] = g.options[0];
      });
      setSelectedOptions(initOpts);
      return;
    }

    executeAddToCart(dish, null);
  };

  const executeAddToCart = (dish, opts) => {
    setCart((prevCart) => {
      let optionAddPrice = 0;
      let optionNames = [];
      if (opts) {
        Object.values(opts).forEach((opt) => {
          if (opt) {
            optionAddPrice += parseFloat(opt.price || 0);
            optionNames.push(opt.name || opt.option_name);
          }
        });
      }

      const itemPrice = parseFloat(dish.price) + optionAddPrice;
      const cartKey = `${dish.id}_${optionNames.sort().join("_")}`;

      const existingIndex = prevCart.findIndex((c) => c.cartKey === cartKey);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].qty += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartKey,
            id: dish.id,
            product_name: dish.product_name,
            price: itemPrice,
            base_price: dish.price,
            qty: 1,
            image_url: dish.image_url,
            is_veg: dish.is_veg,
            option_summary: optionNames.join(", "),
            options: opts ? Object.values(opts) : []
          }
        ];
      }
    });
  };

  const updateCartQty = (cartKey, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((c) => {
          if (c.cartKey === cartKey) {
            const newQty = c.qty + delta;
            return newQty > 0 ? { ...c, qty: newQty } : null;
          }
          return c;
        })
        .filter(Boolean)
    );
  };

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  // Submit Order
  const handleConfirmTableOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      const payload = {
        userId: activeOutletId,
        customerName: userSession?.name || "Table Guest",
        customerPhone: userSession?.phone || "0000000000",
        address: `Dine-In Table ${activeTable}`,
        fulfillmentMode: "DINE_IN",
        tableNumber: activeTable,
        paymentMethod: "CASH",
        totalPrice: subtotal,
        service_charge: 0,
        items: cart.map((c) => ({
          id: c.id,
          product_name: c.product_name,
          price: c.price,
          qty: c.qty,
          options: c.option_summary || ""
        })),
        source: "TABLE_QR",
        hasAudioAlert: true
      };

      const res = await fetch(`${API_BASE}/api/public/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setOrderConfirmed(data.order || data);
        setCart([]);
        localStorage.removeItem(`table_cart_${activeOutletId}_${activeTable}`);
        setIsVerifyingOrder(false);
        setTableStatus("OCCUPIED");
      } else {
        alert(data.error || "Failed to submit order.");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Grouped Dishes
  const groupedDishes = useMemo(() => {
    const filtered = dishes.filter((d) => {
      if (activeCat.toUpperCase() !== "ALL" && d.category !== activeCat) return false;
      if (vegOnly && !d.is_veg) return false;
      if (
        searchQuery.trim() &&
        !`${d.product_name} ${d.description} ${d.category} ${d.short_code}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });

    const groupsMap = {};
    filtered.forEach((item) => {
      const cat = item.category || "General";
      if (!groupsMap[cat]) groupsMap[cat] = [];
      groupsMap[cat].push(item);
    });

    return Object.keys(groupsMap).map((catName) => ({
      categoryName: catName,
      items: groupsMap[catName]
    }));
  }, [dishes, activeCat, searchQuery, vegOnly]);

  const whatsappSupportNumber = restaurant?.phone || restaurant?.contact_number || "9906123989";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[12px] font-black text-slate-700 uppercase tracking-widest">Loading Table {activeTable} Menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white pb-32">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        
        {/* Table Strip & Profile Button */}
        <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>📍 TABLE: {activeTable}</span>
            <span className="opacity-30">|</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">DINE-IN</span>
          </div>

          <div className="flex items-center gap-2">
            {userSession ? (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-full text-[10px] font-bold border border-slate-700 transition-all"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[100px]">{userSession.name}</span>
              </button>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all">
                Login
              </button>
            )}
          </div>
        </div>

        {/* Restaurant Title */}
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-[16px] font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              {restaurant?.name || "Shahe Tehzeeb Restaurant"}
            </h1>
            <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{restaurant?.address || restaurant?.city || "Dine-In Digital Menu"}</span>
            </p>
          </div>

          {cartCount > 0 && (
            <button onClick={() => setIsVerifyingOrder(true)} className="relative p-2.5 bg-emerald-600 text-white rounded-xl font-black flex items-center gap-2 text-[11px] uppercase tracking-wider shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
              <ShoppingBag className="w-4 h-4" />
              <span>{cartCount}</span>
            </button>
          )}
        </div>

        {/* Search Bar & Veg Filter */}
        <div className="max-w-4xl mx-auto px-4 pb-3 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes or short codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-[12px] font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-600 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
              vegOnly ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm" : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${vegOnly ? "bg-emerald-600" : "bg-slate-400"}`} />
            <span>Veg</span>
          </button>
        </div>

        {/* Category Scroll Bar */}
        {categories.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveCat("All")}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeCat === "All"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
            >
              All Items ({dishes.length})
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                  activeCat === cat
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Direct Menu View (Categorized 2-Items-Per-Row Grid) */}
      <main className="max-w-4xl mx-auto px-4 pt-4">
        {orderConfirmed && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 text-white rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[12px] font-black text-emerald-800 uppercase tracking-wide">Order Received!</p>
                <p className="text-[10px] font-bold text-emerald-600">Table {activeTable} order sent directly to Master POS & Kitchen.</p>
              </div>
            </div>
            <button onClick={() => setOrderConfirmed(null)} className="text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase">Dismiss</button>
          </motion.div>
        )}

        {groupedDishes.length === 0 ? (
          <div className="py-24 text-center space-y-2 opacity-40">
            <Utensils className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-[12px] font-bold uppercase tracking-widest text-slate-500">No Items Found</p>
          </div>
        ) : (
          groupedDishes.map(({ categoryName, items }) => (
            <div key={categoryName} className="space-y-3 mb-8">
              <h2 className="text-[14px] font-black uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>{categoryName}</span>
                <span className="text-[10px] text-slate-400 font-bold">({items.length})</span>
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {items.map((dish) => {
                  const inCartItem = cart.find(c => c.id === dish.id);

                  return (
                    <div key={dish.id} className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                      <div>
                        {dish.image_url ? (
                          <img src={dish.image_url} alt={dish.product_name} className="w-full aspect-[4/3] rounded-xl object-cover border border-slate-100 mb-2" />
                        ) : (
                          <div className="w-full aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center p-2 text-center mb-2">
                            <Utensils className="w-6 h-6 text-slate-300 mb-1" />
                            <span className="text-[8px] font-bold text-slate-400 uppercase">{dish.category || "Main"}</span>
                          </div>
                        )}

                        <div className="flex items-start gap-1.5 mb-1">
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${dish.is_veg ? "border-emerald-600" : "border-rose-600"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dish.is_veg ? "bg-emerald-600" : "bg-rose-600"}`} />
                          </span>
                          <h3 className="text-[12px] font-black uppercase text-slate-900 tracking-tight leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors">
                            {dish.product_name}
                          </h3>
                        </div>

                        {dish.short_code && (
                          <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-wider rounded border border-slate-200 mb-1">
                            CODE: {dish.short_code}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <div className="text-[13px] font-black text-slate-900">
                          ₹{parseFloat(dish.price).toFixed(2)}
                        </div>

                        {inCartItem ? (
                          <div className="flex items-center gap-1.5 bg-slate-900 text-white px-2 py-1 rounded-xl shadow text-[10px]">
                            <button onClick={() => updateCartQty(inCartItem.cartKey, -1)} className="hover:text-emerald-400"><Minus className="w-3 h-3" /></button>
                            <span className="font-black px-1">{inCartItem.qty}</span>
                            <button onClick={() => updateCartQty(inCartItem.cartKey, 1)} className="hover:text-emerald-400"><Plus className="w-3 h-3" /></button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(dish)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1 active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                            <span>ADD</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </main>

      {/* FLOATING ACTION BUTTONS AT BOTTOM RIGHT (WHATSAPP + CATEGORIES) */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-3">
        {/* Floating Category Circle Icon Button */}
        <button
          onClick={() => setIsCategoryDrawerOpen(true)}
          className="w-13 h-13 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 border-2 border-white/40 transition-all"
          title="Browse Menu Categories"
        >
          <Utensils className="w-5 h-5 text-white" />
        </button>

        {/* Floating WhatsApp Circle Support Icon Button */}
        <a
          href={`https://wa.me/${whatsappSupportNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I am seated at Table ${activeTable}. Need assistance!`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 border-2 border-white/40 transition-all"
          title="WhatsApp Support"
        >
          <WhatsAppIcon size={24} className="text-white" />
        </a>
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 max-w-xl mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-[13px] shadow">
                {cartCount}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Table {activeTable} Order</p>
                <p className="text-[15px] font-black text-white">₹{subtotal.toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={() => setIsVerifyingOrder(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <span>Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}

      {/* CUSTOMER PROFILE DRAWER MODAL (MATCHING ONLINE MENU) */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[85vh] flex flex-col">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-[14px]">
                    {userSession?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-black uppercase text-slate-900">{userSession?.name || "Customer"}</h3>
                    <p className="text-[10px] font-bold text-slate-400">{userSession?.phone}</p>
                  </div>
                </div>
                <button onClick={() => setIsProfileOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <button
                  onClick={() => setProfileTab("orders")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${profileTab === "orders" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  <FileText className="w-3.5 h-3.5" /> Past Orders
                </button>
                <button
                  onClick={() => setProfileTab("ledger")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${profileTab === "ledger" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Ledger & Points
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
                {isLoadingProfileData ? (
                  <div className="py-12 text-center text-slate-400 text-[11px] font-bold">Loading profile details...</div>
                ) : profileTab === "orders" ? (
                  customerOrdersList.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-[11px] font-bold">No past orders found.</div>
                  ) : (
                    customerOrdersList.map((ord, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-black text-slate-900">REF: {ord.order_reference || ord.id}</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full border border-emerald-200">
                            {ord.status || "CONFIRMED"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">{ord.address || `Table ${activeTable}`}</p>
                        <div className="flex justify-between items-center text-[12px] font-black text-slate-900 pt-1 border-t border-slate-200">
                          <span>Total Amount</span>
                          <span>₹{parseFloat(ord.total || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-emerald-800 uppercase">Loyalty Reward Points</p>
                        <p className="text-[20px] font-black text-emerald-600">{customerLedgerData.points || 0} PTS</p>
                      </div>
                      <Award className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem("customer_user_session");
                  setUserSession(null);
                  setIsProfileOpen(false);
                }}
                className="w-full py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 border border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Category Drawer */}
      <AnimatePresence>
        {isCategoryDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                  <Menu className="w-4 h-4 text-emerald-600" /> Menu Categories
                </h3>
                <button onClick={() => setIsCategoryDrawerOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5 overflow-y-auto pr-1 no-scrollbar flex-1">
                <button
                  onClick={() => { setActiveCat("All"); setIsCategoryDrawerOpen(false); }}
                  className={`w-full p-3 rounded-xl text-left font-black text-[12px] uppercase flex justify-between items-center ${activeCat === "All" ? "bg-slate-900 text-white shadow" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                >
                  <span>All Categories</span>
                  <span>{dishes.length}</span>
                </button>
                {categories.map((cat, idx) => {
                  const count = dishes.filter(d => d.category === cat).length;
                  return (
                    <button
                      key={idx}
                      onClick={() => { setActiveCat(cat); setIsCategoryDrawerOpen(false); }}
                      className={`w-full p-3 rounded-xl text-left font-black text-[12px] uppercase flex justify-between items-center ${activeCat === cat ? "bg-slate-900 text-white shadow" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                    >
                      <span>{cat}</span>
                      <span className="text-[11px] font-bold opacity-70">{count}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2-Step Verification Modal Prompt */}
      <AnimatePresence>
        {isVerifyingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-900">Please Verify Again</h3>
                    <p className="text-[10px] font-bold text-slate-400">Itemized table order summary</p>
                  </div>
                </div>
                <button onClick={() => setIsVerifyingOrder(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                {cart.map((ci, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-black text-slate-900 uppercase">{ci.product_name}</p>
                      {ci.option_summary && <p className="text-[9px] text-emerald-600 font-bold">Opts: {ci.option_summary}</p>}
                      <p className="text-[10px] text-slate-500 font-bold">₹{ci.price.toFixed(2)} × {ci.qty}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                      <button onClick={() => updateCartQty(ci.cartKey, -1)} className="p-1 text-slate-500 hover:text-slate-900"><Minus className="w-3 h-3" /></button>
                      <span className="text-[11px] font-black text-slate-900 px-1">{ci.qty}</span>
                      <button onClick={() => updateCartQty(ci.cartKey, 1)} className="p-1 text-slate-500 hover:text-slate-900"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Table Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                  <span>Table Number:</span>
                  <span className="text-slate-900 uppercase font-black">Table {activeTable}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                  <span>Guest:</span>
                  <span className="text-slate-900 font-black">{userSession?.name || "Guest"} ({userSession?.phone})</span>
                </div>
                <div className="flex justify-between text-[14px] font-black text-emerald-600 pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsVerifyingOrder(false)}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  Edit Cart
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmTableOrder}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Confirm Order</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real WhatsApp OTP Login Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <WhatsAppIcon size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-black uppercase tracking-tight text-slate-900">WhatsApp OTP Verification</h3>
                    <p className="text-[10px] font-bold text-slate-400">Instant login for table ordering</p>
                  </div>
                </div>
                <button onClick={() => setIsAuthModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {otpStep === 1 ? (
                <form onSubmit={handleSendWhatsAppOtp} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Your Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[12px] font-bold text-slate-800 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">WhatsApp Phone Number *</label>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit Mobile Number"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[12px] font-bold text-slate-800 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSendingOtp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <WhatsAppIcon size={16} />}
                    <span>Send WhatsApp OTP</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyWhatsAppOtp} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Enter 4-Digit OTP sent to WhatsApp ({authPhone})</label>
                    <input
                      required
                      type="text"
                      maxLength={6}
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[14px] font-black text-center text-slate-900 outline-none focus:border-emerald-600 tracking-widest"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      Verify & Login
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Option Groups Modal */}
      <AnimatePresence>
        {customizingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-[14px] font-black uppercase text-slate-900">{customizingItem.product_name}</h3>
                  <p className="text-[10px] font-bold text-emerald-600">Select Item Options / Size</p>
                </div>
                <button onClick={() => setCustomizingItem(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 max-h-72 overflow-y-auto no-scrollbar">
                {customizingItem.option_groups?.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1.5">
                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{group.name || group.title}</p>
                    <div className="space-y-1.5">
                      {group.options?.map((opt, oIdx) => {
                        const isSelected = selectedOptions[group.id]?.name === opt.name || selectedOptions[group.id]?.option_name === opt.option_name;
                        return (
                          <div
                            key={oIdx}
                            onClick={() => setSelectedOptions((prev) => ({ ...prev, [group.id]: opt }))}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected
                                ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
                            }`}
                          >
                            <span className="text-[12px] uppercase">{opt.name || opt.option_name}</span>
                            <span className="text-[12px]">+{parseFloat(opt.price || 0).toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  executeAddToCart(customizingItem, selectedOptions);
                  setCustomizingItem(null);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                Add Option to Order
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Table Occupied Notice Modal */}
      <AnimatePresence>
        {showOccupiedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase text-slate-900">Table {activeTable} Occupied</h3>
                <p className="text-[11px] font-medium text-slate-600 mt-1">
                  This table currently has an active order on Master POS. Log in with WhatsApp to add items to Table {activeTable}.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowOccupiedNotice(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow hover:bg-slate-800 transition-all"
              >
                Log In via WhatsApp
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TableOutletMenu;
