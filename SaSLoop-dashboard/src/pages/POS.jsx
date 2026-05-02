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
  Star
} from "lucide-react";
import API_BASE from "../config";

import POSDashboard from "./POSDashboard";

const POS = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [posTables, setPosTables] = useState([]);
  
  const [view, setView] = useState("DASHBOARD"); // Default to the new Elite Dashboard
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeTab, setActiveTab] = useState("DINEIN"); 
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [discountType] = useState("NONE");
  const [discountValue] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  useEffect(() => {
    fetchData();
    const tableInterval = setInterval(fetchTables, 10000);
    return () => clearInterval(tableInterval);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";

      const [bizRes, itemsRes, ordersRes, tablesRes] = await Promise.all([
        fetch(`${API_BASE}/api/business/status${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/catalog${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/orders${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/pos/tables`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      const bizData = await bizRes.json();
      const itemsData = await itemsRes.json();
      const ordersData = await ordersRes.json();
      const tablesData = await tablesRes.json();

      setBusiness(bizData.business);
      setItems(Array.isArray(itemsData) ? itemsData : []);
      setRunningOrders(Array.isArray(ordersData) ? ordersData.filter(o => o.status !== 'COMPLETED') : []);
      setPosTables(Array.isArray(tablesData) ? tablesData : []);
      
      const cats = ["All", ...new Set(itemsData.map(i => i.category))];
      setCategories(cats);
    } catch (err) { console.error("POS Load Error:", err); }
    finally { setLoading(false); }
  };

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem("token");
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
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let discountAmt = 0;
    if (discountType === 'PERCENT') discountAmt = (subtotal * discountValue) / 100;
    else if (discountType === 'FIXED') discountAmt = discountValue;
    const netAmount = Math.max(0, subtotal - discountAmt);
    const taxRate = (business?.cgst_percent || 0) + (business?.sgst_percent || 0);
    const totalTax = netAmount * (taxRate / 100);
    return { subtotal, discountAmt, netAmount, totalTax, total: netAmount + totalTax };
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
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <RefreshCw className="w-10 h-10 animate-spin text-orange-500 mb-6" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Syncing SaSLoop POS...</p>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0c10] font-sans text-slate-100 select-none p-4 gap-4">
      
      {/* 🟢 LEFT: ELITE NAVIGATION SIDEBAR */}
      <div className="w-20 flex flex-col gap-4 shrink-0 h-full">
         <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col items-center py-8 gap-8 flex-1 shadow-2xl">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/20 mb-4 cursor-pointer hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col gap-6 w-full items-center">
               {[
                  { id: "DASHBOARD", icon: Grid, label: "Analytics" },
                  { id: "ORDERING", icon: ShoppingBag, label: "Orders" },
                  { icon: Utensils, label: "Kitchen", path: "/kds" },
                  { icon: History, label: "History", path: "/orders" },
                  { icon: Users, label: "CRM", path: "/crm" },
                  { icon: Receipt, label: "Reports", path: "/analytics" }
               ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                       if (item.id) setView(item.id);
                       else if (item.path) window.location.href = item.path;
                    }}
                    className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${view === item.id ? 'bg-white text-slate-950 shadow-xl' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
                  >
                     <item.icon className="w-5 h-5" />
                     <div className="absolute left-16 px-3 py-1 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl">
                        {item.label}
                     </div>
                  </button>
               ))}
            </div>

            <div className="mt-auto flex flex-col gap-4 w-full items-center">
               <button onClick={() => window.location.href = "/floor-plan"} className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all">
                  <LayoutGrid className="w-5 h-5" />
               </button>
            </div>
         </div>
         <button onClick={() => window.close()} className="w-full aspect-square bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[2rem] flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-xl"><X className="w-6 h-6" /></button>
      </div>

      {/* 🟠 CONDITIONAL VIEW RENDER */}
      {view === "DASHBOARD" ? (
         <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden">
            <POSDashboard />
         </div>
      ) : (
         <>
            {/* 🟠 CATEGORY STRIP */}
            <div className="w-20 flex flex-col gap-4 shrink-0 h-full">
               <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-3 flex flex-col items-center gap-4 flex-1 py-8 overflow-y-auto no-scrollbar shadow-xl">
                  {categories.map(cat => (
                     <button 
                       key={cat}
                       onClick={() => setSelectedCategory(cat)}
                       className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${selectedCategory === cat ? 'bg-white text-slate-950 shadow-2xl scale-110' : 'text-white/40 hover:bg-white/5'}`}
                     >
                        <Star className="w-4 h-4" />
                        <span className="text-[7px] font-black uppercase tracking-tighter text-center line-clamp-1 px-1">{cat}</span>
                     </button>
                  ))}
               </div>
            </div>

      {/* ⚪ MIDDLE: PRODUCTS & FLOOR PREVIEW */}
      <div className="flex-1 flex flex-col min-w-0 gap-4">
         
         {/* SMART TOOLBAR: Search & Tables */}
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 px-8 flex items-center justify-between shrink-0 h-24">
            <div className="flex-1 max-w-md relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                <input 
                    type="text" placeholder="Search dish or scan code..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-xs font-black outline-none focus:border-orange-500/50 transition-all text-white placeholder:text-white/20"
                />
            </div>

            <div className="flex items-center gap-3 ml-6 overflow-x-auto no-scrollbar py-2">
                {posTables.map(table => (
                   <button 
                     key={table.id}
                     onClick={() => setSelectedTable(table.table_name)}
                     className={`h-12 px-5 rounded-2xl border-2 flex items-center gap-3 transition-all shrink-0 ${selectedTable === table.table_name ? 'bg-orange-500 border-orange-400 text-white shadow-xl scale-105' : table.status === 'OCCUPIED' ? 'bg-white/10 border-white/20 text-white animate-pulse' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                   >
                      <span className="text-[10px] font-black uppercase italic">{table.table_name}</span>
                      <div className={`w-2 h-2 rounded-full ${table.status === 'OCCUPIED' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                   </button>
                ))}
            </div>
         </div>

         {/* ITEM GRID */}
         <div className="flex-1 overflow-y-auto no-scrollbar p-2">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                <AnimatePresence>
                    {filteredItems.map(item => (
                        <motion.button 
                           key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                           onClick={() => addToCart(item)}
                           className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-[2.5rem] shadow-xl hover:border-orange-500/30 transition-all group relative h-fit"
                        >
                            <div className="aspect-square bg-slate-900 rounded-[1.8rem] mb-4 overflow-hidden relative border border-white/5">
                                {item.image_url ? <img src={`${API_BASE}${item.image_url}`} alt={item.product_name} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Utensils className="w-10 h-10" /></div>}
                                <div className="absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-slate-950" style={{ backgroundColor: item.is_veg ? '#10b981' : '#f43f5e' }} />
                            </div>
                            <div className="text-left px-2">
                                <h4 className="text-[11px] font-black text-white uppercase italic tracking-tighter mb-1 line-clamp-1">{item.product_name}</h4>
                                <p className="text-xl font-black text-white tracking-tighter italic">₹{item.price}</p>
                            </div>
                            <div className="absolute -top-1 -right-1 w-10 h-10 bg-orange-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-2xl scale-75 group-hover:scale-100"><Plus className="w-6 h-6" /></div>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
         </div>
      </div>

      {/* 🧾 RIGHT: ELITE BILLING CONSOLE */}
      <div className="w-[420px] flex flex-col shrink-0 gap-4">
         
         <div className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
            {/* Header & Tabs */}
            <div className="p-8 pb-4">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic italic-shadow">Billing</h2>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-1">Terminal Active</p>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-2xl">
                     {['DINEIN', 'TAKEAWAY'].map(mode => (
                        <button key={mode} onClick={() => setActiveTab(mode)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${activeTab === mode ? 'bg-white text-slate-950' : 'text-white/40'}`}>{mode}</button>
                     ))}
                  </div>
               </div>

               {/* Customer Quick Lookup */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col">
                     <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Customer Mobile</span>
                     <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+91..." className="bg-transparent text-xs font-bold text-white outline-none w-full" />
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col">
                     <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Customer Name</span>
                     <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Guest Name" className="bg-transparent text-xs font-bold text-white outline-none w-full" />
                  </div>
               </div>
            </div>

            {/* Cart List */}
            <div className="flex-1 overflow-y-auto px-8 py-4 no-scrollbar space-y-4">
               {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10">
                     <ShoppingBag className="w-20 h-20 mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em]">Cart Empty</p>
                  </div>
               ) : (
                  <AnimatePresence>
                     {cart.map(item => (
                        <motion.div 
                           key={item.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
                           className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-[2rem] group"
                        >
                           <div className="flex-1">
                              <h5 className="text-[11px] font-black text-white uppercase italic leading-none mb-1">{item.product_name}</h5>
                              <p className="text-[10px] font-bold text-white/30 italic">₹{item.price} × {item.qty}</p>
                           </div>
                           <div className="flex items-center bg-black/40 rounded-xl p-1 gap-3">
                              <button onClick={() => updateQty(item.id, -1)} className="p-1 text-white/40 hover:text-white"><Minus className="w-3.5 h-3.5" /></button>
                              <span className="text-xs font-black text-white w-4 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="p-1 text-white/40 hover:text-white"><Plus className="w-3.5 h-3.5" /></button>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               )}
            </div>

            {/* Footer Summary */}
            <div className="p-10 bg-black/40 border-t border-white/5 space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                     <span>Items Subtotal</span>
                     <span className="text-white">₹{totals.subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                     <span>GST & Service</span>
                     <span className="text-white">₹{totals.totalTax.toFixed(0)}</span>
                  </div>
               </div>

               <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Grand Total</p>
                    <h3 className="text-5xl font-black italic tracking-tighter text-white">₹{Math.floor(totals.total)}</h3>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={handlePrint} className="w-12 h-12 rounded-2xl bg-white/5 text-white/30 border border-white/10 flex items-center justify-center hover:text-white hover:bg-white/10 transition-all"><Printer className="w-5 h-5" /></button>
                     <button onClick={() => setPaymentMode('CASH')} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${paymentMode === 'CASH' ? 'bg-white text-slate-950' : 'bg-white/5 text-white/30 border border-white/5'}`}><Banknote className="w-5 h-5" /></button>
                     <button onClick={() => setPaymentMode('UPI')} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${paymentMode === 'UPI' ? 'bg-white text-slate-950' : 'bg-white/5 text-white/30 border border-white/5'}`}><Smartphone className="w-5 h-5" /></button>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button 
                    disabled={isProcessing || cart.length === 0} onClick={() => handleAction('PREPARING')}
                    className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 active:scale-95 transition-all text-white/60"
                  >
                    Hold Order
                  </button>
                  <button 
                    disabled={isProcessing || cart.length === 0} onClick={() => handleAction('COMPLETED')}
                    className="flex-[1.5] py-6 bg-orange-500 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-orange-500/20 active:scale-95 transition-all text-white flex items-center justify-center gap-3"
                  >
                    Settle & Print <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </div>
         </>
      )}

      {/* OVERLAY: CHECKOUT SUCCESS */}
      <AnimatePresence>
        {checkoutResult && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6">
              <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white max-w-sm w-full rounded-[3.5rem] p-12 text-center shadow-2xl">
                 <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner animate-bounce"><CheckCircle2 className="w-12 h-12" /></div>
                 <h3 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter mb-2">Settled!</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Order has been processed successfully.</p>
                 <button onClick={() => setCheckoutResult(null)} className="w-full py-6 bg-slate-950 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">Next Customer</button>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default POS;
