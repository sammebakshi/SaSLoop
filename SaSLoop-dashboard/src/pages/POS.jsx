import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Banknote, 
  Smartphone,
  Utensils,
  RefreshCw,
  Zap,
  LayoutGrid,
  X,
  Printer,
  ChevronRight,
  Grid,
  History,
  Receipt,
  Users,
  Star,
  Settings,
  LogOut,
  Bell,
  Box,
  Layers,
  ChevronDown
} from "lucide-react";
import API_BASE from "../config";
import { useNavigate } from "react-router-dom";

import POSDashboard from "./POSDashboard";
import POSSettings from "./POSSettings";
import KDS from "./KDS";
import OrderBoard from "./OrderBoard";

const POS = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [posTables, setPosTables] = useState([]);
  const [user, setUser] = useState(null);
  
  const [view, setView] = useState("ORDERING"); // Default to ordering for professional speed
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeTab, setActiveTab] = useState("DINEIN"); 
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [discountType] = useState("NONE");
  const [discountValue] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [notificationSound] = useState(new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3")); // iPhone-like tone

  useEffect(() => {
    const token = localStorage.getItem("pos_token");
    const storedUser = localStorage.getItem("pos_user");
    if (!token) {
        navigate("/pos/login");
        return;
    }
    if (storedUser) setUser(JSON.parse(storedUser));
    
    fetchData();
    const tableInterval = setInterval(fetchTables, 10000);
    const orderInterval = setInterval(checkForNewOrders, 5000);

    const handleThemeUpdate = () => {
      setTheme(localStorage.getItem("pos_theme") || "dark");
    };
    window.addEventListener("storage", handleThemeUpdate);
    return () => {
      clearInterval(tableInterval);
      clearInterval(orderInterval);
      window.removeEventListener("storage", handleThemeUpdate);
    };
  }, []);

  const checkForNewOrders = async () => {
    try {
        const token = localStorage.getItem("pos_token");
        const res = await fetch(`${API_BASE}/api/orders`, { headers: { "Authorization": `Bearer ${token}` } });
        const orders = await res.json();
        if (Array.isArray(orders)) {
            if (lastOrderCount > 0 && orders.length > lastOrderCount) {
                notificationSound.play().catch(e => console.log("Sound play blocked:", e));
                // Optional: Show a small toast or notification
            }
            setLastOrderCount(orders.length);
        }
    } catch (e) {}
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("pos_token");
      const [bizRes, itemsRes, tablesRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/api/business/status`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/catalog`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/pos/tables`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/orders`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      const bizData = await bizRes.json();
      const itemsData = await itemsRes.json();
      const tablesData = await tablesRes.json();
      const ordersData = await ordersRes.json();

      setBusiness(bizData.business);
      setItems(Array.isArray(itemsData) ? itemsData : []);
      setPosTables(Array.isArray(tablesData) ? tablesData : []);
      setLastOrderCount(Array.isArray(ordersData) ? ordersData.length : 0);
      
      const cats = ["All", ...new Set(itemsData.map(i => i.category))];
      setCategories(cats);
    } catch (err) { console.error("POS Load Error:", err); }
    finally { setLoading(false); }
  };

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem("pos_token");
      const res = await fetch(`${API_BASE}/api/pos/tables`, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      setPosTables(data);
    } catch (e) {}
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.code?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory && item.availability;
    });
  }, [items, searchQuery, selectedCategory]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) return { ...i, qty: Math.max(1, i.qty + delta) };
      return i;
    }));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => {
      const p = parseFloat(item.price) || 0;
      const q = parseInt(item.qty) || 0;
      return acc + (p * q);
    }, 0);

    let discountAmt = 0;
    const dVal = parseFloat(discountValue) || 0;
    if (discountType === 'PERCENT') discountAmt = (subtotal * dVal) / 100;
    else if (discountType === 'FIXED') discountAmt = dVal;

    const netAmount = Math.max(0, subtotal - discountAmt);
    const cgst = parseFloat(business?.cgst_percent) || 0;
    const sgst = parseFloat(business?.sgst_percent) || 0;
    const taxRate = cgst + sgst;
    
    const totalTax = netAmount * (taxRate / 100);
    return { 
      subtotal, 
      discountAmt, 
      netAmount, 
      totalTax: isNaN(totalTax) ? 0 : totalTax, 
      total: isNaN(netAmount + totalTax) ? subtotal : (netAmount + totalTax) 
    };
  }, [cart, business, discountType, discountValue]);

  const handleAction = async (status = 'COMPLETED') => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const payload = {
        userId: business?.user_id,
        tableNumber: String(selectedTable || 0),
        items: cart,
        totalPrice: totals.total,
        customerName: customerName || "POS Guest",
        customerPhone: customerPhone,
        fulfillmentMode: activeTab,
        source: "POS_MANUAL",
        status: status,
        paymentStatus: status === 'COMPLETED' ? 'PAID' : 'PENDING',
        paymentMethod: paymentMode
      };
      const res = await fetch(`${API_BASE}/api/public/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setCheckoutResult({ type: 'success', subType: status });
        setCart([]);
        setSelectedTable(null);
        setCustomerName("");
        setCustomerPhone("");
        fetchData();
      }
    } catch (e) { console.error(e); }
    setIsProcessing(false);
  };

  const handleLogout = () => {
      localStorage.removeItem("pos_token");
      localStorage.removeItem("pos_user");
      navigate("/pos/login");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const receiptHTML = `
      <html>
        <head>
          <title>Bill - ${business?.name}</title>
          <style>
            body { font-family: 'monospace'; width: 80mm; padding: 2mm; font-size: 11px; line-height: 1.2; }
            .center { text-align: center; }
            .dashed { border-bottom: 1px dashed #000; margin: 2mm 0; }
            .row { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2 style="margin:0">${business?.name}</h2>
            <p style="margin:0">${business?.address || ''}</p>
            <p style="margin:0">Ph: ${business?.phone}</p>
          </div>
          <div class="dashed"></div>
          <div class="row"><span>Date: ${new Date().toLocaleDateString()}</span><span>Time: ${new Date().toLocaleTimeString()}</span></div>
          <div class="row"><span>Table: ${selectedTable || 'N/A'}</span><span>Mode: ${activeTab}</span></div>
          <div class="dashed"></div>
          ${cart.map(i => `<div class="row"><span>${i.qty} x ${i.product_name}</span><span>${(i.price * i.qty).toFixed(2)}</span></div>`).join('')}
          <div class="dashed"></div>
          <div class="row"><span>Subtotal:</span><span>${totals.subtotal.toFixed(2)}</span></div>
          ${totals.discountAmt > 0 ? `<div class="row"><span>Discount:</span><span>-${totals.discountAmt.toFixed(2)}</span></div>` : ''}
          <div class="row"><span>Tax:</span><span>${totals.totalTax.toFixed(2)}</span></div>
          <div class="row bold"><span>GRAND TOTAL:</span><span>\u20B9${totals.total.toFixed(2)}</span></div>
          <div class="dashed"></div>
          <div class="center"><p>THANK YOU! VISIT AGAIN</p></div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `;
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0c10] text-white">
      <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Initializing Terminal...</p>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden font-sans select-none p-2 gap-2 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0c10] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 🛠️ MINI SIDEBAR */}
      <div className="w-16 flex flex-col gap-2 shrink-0 h-full">
         <div className={`border rounded-2xl flex flex-col items-center py-6 gap-6 flex-1 shadow-2xl transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
                <Box className="w-5 h-5 text-white" />
            </div>

            <div className="flex flex-col gap-4 w-full items-center">
               {[
                  { id: "ORDERING", icon: Zap, label: "POS" },
                  { id: "KDS", icon: Utensils, label: "KDS" },
                  { id: "HISTORY", icon: History, label: "Orders" },
                  { id: "DASHBOARD", icon: Grid, label: "Stats" },
                  { id: "SETTINGS", icon: Settings, label: "Setup" }
               ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setView(item.id)}
                    className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${view === item.id ? (theme === 'dark' ? 'bg-white text-slate-950 shadow-lg' : 'bg-slate-950 text-white shadow-lg') : (theme === 'dark' ? 'text-white/20 hover:bg-white/5 hover:text-white' : 'text-slate-300 hover:bg-slate-50 hover:text-slate-900')}`}
                  >
                     <item.icon className="w-4 h-4" />
                     <div className={`absolute left-14 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 ${theme === 'dark' ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}>
                        {item.label}
                     </div>
                  </button>
               ))}
            </div>

            <div className="mt-auto flex flex-col gap-4 w-full items-center">
               <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                  <LogOut className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      {/* 🖥️ MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR: Business Info & Search */}
        <header className={`h-14 flex items-center justify-between px-6 border rounded-2xl mb-2 shrink-0 transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <h1 className="text-xs font-black uppercase tracking-widest text-emerald-500 leading-none">{business?.name || "Terminal Active"}</h1>
                    <p className={`text-[8px] font-bold uppercase mt-1 tracking-tighter ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                        Logged in: <span className={theme === 'dark' ? 'text-white/60' : 'text-slate-900'}>{user?.name}</span> • Terminal ID: <span className={theme === 'dark' ? 'text-white/60' : 'text-slate-900'}>POS-01</span>
                    </p>
                </div>
            </div>

            {view === "ORDERING" && (
                <div className="flex-1 max-w-sm mx-8 relative group">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${theme === 'dark' ? 'text-white/20 group-focus-within:text-emerald-400' : 'text-slate-300 group-focus-within:text-emerald-500'}`} />
                    <input 
                        type="text" placeholder="Search menu..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className={`w-full border rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold outline-none transition-all placeholder:opacity-20 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'}`}
                    />
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">System Live</span>
                </div>
                <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white"><Bell className="w-4 h-4" /></button>
            </div>
        </header>

        {/* View Switcher */}
        <div className="flex-1 overflow-hidden">
            {view === "DASHBOARD" && <div className="h-full overflow-y-auto no-scrollbar bg-slate-50 rounded-2xl"><POSDashboard /></div>}
            {view === "SETTINGS" && <div className="h-full overflow-y-auto no-scrollbar bg-slate-50 rounded-2xl"><POSSettings business={business} posTables={posTables} /></div>}
            {view === "KDS" && <div className="h-full overflow-y-auto no-scrollbar bg-slate-900 rounded-2xl"><KDS /></div>}
            {view === "HISTORY" && <div className="h-full overflow-y-auto no-scrollbar bg-slate-50 rounded-2xl"><OrderBoard /></div>}

            {view === "ORDERING" && (
                <div className="h-full flex gap-2 overflow-hidden">
                    {/* Compact Categories */}
                    <div className="w-16 flex flex-col gap-2 shrink-0 h-full overflow-y-auto no-scrollbar">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all border ${selectedCategory === cat ? 'bg-white text-slate-950 border-white shadow-lg' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'}`}
                            >
                                <Layers className="w-3.5 h-3.5" />
                                <span className="text-[6px] font-black uppercase tracking-tighter text-center line-clamp-1 px-1">{cat}</span>
                            </button>
                        ))}
                    </div>

                    {/* Middle: Grid & Tables */}
                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                        {/* Table Strip */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0">
                            {posTables.map(table => (
                                <button 
                                    key={table.id}
                                    onClick={() => setSelectedTable(table.table_name)}
                                    className={`h-10 px-4 rounded-xl border flex items-center gap-2 transition-all shrink-0 ${selectedTable === table.table_name ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' : table.status === 'OCCUPIED' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-white/5 border-white/5 text-white/30 hover:border-white/10'}`}
                                >
                                    <span className="text-[9px] font-black uppercase italic">{table.table_name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Professional Item Grid */}
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                <AnimatePresence>
                                    {filteredItems.map(item => (
                                        <motion.button 
                                            key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            onClick={() => addToCart(item)}
                                            className="bg-white/5 border border-white/5 p-3 rounded-2xl hover:border-emerald-500/40 transition-all group flex flex-col text-left h-fit"
                                        >
                                            <div className="aspect-square bg-black/40 rounded-xl mb-3 overflow-hidden relative border border-white/5">
                                                {item.image_url ? <img src={`${API_BASE}${item.image_url}`} alt={item.product_name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Utensils className="w-6 h-6" /></div>}
                                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: item.is_veg ? '#10b981' : '#f43f5e' }} />
                                            </div>
                                            <h4 className="text-[9px] font-black text-white/90 uppercase tracking-tight line-clamp-1 mb-1">{item.product_name}</h4>
                                            <div className="flex items-center justify-between mt-auto">
                                                <p className="text-sm font-black text-emerald-400 tracking-tighter italic">₹{item.price}</p>
                                                <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center text-white/20 group-hover:bg-emerald-500 group-hover:text-white transition-all"><Plus className="w-3.5 h-3.5" /></div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Right: Cart Console */}
                    <div className={`w-[340px] border rounded-2xl flex flex-col shrink-0 shadow-2xl transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                        <div className={`p-5 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className={`text-sm font-black uppercase tracking-widest italic italic-shadow ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Cart</h2>
                                <div className={`flex p-1 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    {['DINEIN', 'PICKUP'].map(m => (
                                        <button key={m} onClick={() => setActiveTab(m)} className={`px-3 py-1.5 rounded-md text-[7px] font-black uppercase transition-all ${activeTab === m ? (theme === 'dark' ? 'bg-white text-slate-950' : 'bg-slate-950 text-white') : (theme === 'dark' ? 'text-white/30' : 'text-slate-400')}`}>{m}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className={`flex items-center border rounded-lg p-2.5 ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <Smartphone className={`w-3 h-3 mr-3 ${theme === 'dark' ? 'text-white/20' : 'text-slate-300'}`} />
                                    <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Customer Phone" className={`bg-transparent text-[10px] font-bold outline-none w-full placeholder:opacity-20 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} />
                                </div>
                            </div>
                        </div>

                        {/* Cart List */}
                        <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-2">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-5">
                                    <ShoppingBag className="w-12 h-12 mb-2" />
                                    <p className="text-[8px] font-black uppercase tracking-[0.4em]">Empty</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {cart.map(item => (
                                        <motion.div 
                                            key={item.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                                            className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl"
                                        >
                                            <div className="flex-1">
                                                <h5 className="text-[9px] font-black text-white/80 uppercase line-clamp-1 mb-0.5">{item.product_name}</h5>
                                                <p className="text-[8px] font-bold text-emerald-500/60 tracking-wider italic">₹{item.price}</p>
                                            </div>
                                            <div className="flex items-center bg-black/40 rounded-lg p-0.5 gap-2">
                                                <button onClick={() => updateQty(item.id, -1)} className="p-1 text-white/20 hover:text-white"><Minus className="w-2.5 h-2.5" /></button>
                                                <span className="text-[10px] font-black text-white w-3 text-center">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="p-1 text-white/20 hover:text-white"><Plus className="w-2.5 h-2.5" /></button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer Summary */}
                        <div className="p-5 bg-black/20 border-t border-white/5">
                            <div className="space-y-1 mb-4">
                                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase">
                                    <span>Subtotal</span>
                                    <span className="text-white/60">₹{totals.subtotal.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase">
                                    <span>Tax ({((parseFloat(business?.cgst_percent) || 0) + (parseFloat(business?.sgst_percent) || 0)).toFixed(1)}%)</span>
                                    <span className="text-white/60">₹{totals.totalTax.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-end pt-2">
                                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Grand Total</p>
                                    <h3 className="text-3xl font-black italic tracking-tighter text-emerald-400">₹{Math.floor(totals.total)}</h3>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <button onClick={() => setPaymentMode('CASH')} className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-[8px] font-black uppercase transition-all ${paymentMode === 'CASH' ? 'bg-white text-slate-950' : 'bg-white/5 text-white/20 border border-white/5'}`}><Banknote className="w-3.5 h-3.5" /> Cash</button>
                                <button onClick={() => setPaymentMode('UPI')} className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-[8px] font-black uppercase transition-all ${paymentMode === 'UPI' ? 'bg-white text-slate-950' : 'bg-white/5 text-white/20 border border-white/5'}`}><Smartphone className="w-3.5 h-3.5" /> Digital</button>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={handlePrint} className="w-12 h-12 rounded-xl bg-white/5 text-white/20 border border-white/5 flex items-center justify-center hover:text-white transition-all"><Printer className="w-4 h-4" /></button>
                                <button 
                                    disabled={isProcessing || cart.length === 0} onClick={() => handleAction('COMPLETED')}
                                    className="flex-1 py-4 bg-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10 active:scale-95 transition-all text-white flex items-center justify-center gap-2"
                                >
                                    Settle Bill <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* 🧾 OVERLAY: SUCCESS */}
      <AnimatePresence>
        {checkoutResult && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-xs w-full rounded-[2.5rem] p-8 text-center shadow-2xl">
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-8 h-8" /></div>
                 <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tighter mb-1">Payment Successful</h3>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-8">Order has been settled successfully.</p>
                 <button onClick={() => setCheckoutResult(null)} className="w-full py-4 bg-slate-950 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Next Customer</button>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default POS;
