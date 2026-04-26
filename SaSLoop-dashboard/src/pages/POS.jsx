import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  ChevronRight, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Utensils,
  Package,
  Truck,
  Printer,
  X,
  Keyboard,
  Maximize2,
  Percent,
  History,
  Save,
  Wallet,
  Receipt,
  RefreshCw,
  PlusCircle,
  Users,
  Grid,
  Zap,
  ArrowRight,
  UserPlus,
  Star
} from "lucide-react";
import API_BASE from "../config";

const POS = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  
  const [runningOrders, setRunningOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeTab, setActiveTab] = useState("DINEIN"); 
  const [subTab, setSubTab] = useState("BILLING"); 

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [discountType, setDiscountType] = useState("NONE");
  const [discountValue, setDiscountValue] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  const fetchRunningOrders = async () => {
    try {
        const token = localStorage.getItem("token");
        const impersonateId = sessionStorage.getItem("impersonate_id");
        const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
        const res = await fetch(`${API_BASE}/api/orders${targetParam}`, { 
          headers: { "Authorization": `Bearer ${token}` } 
        });
        const data = await res.json();
        setRunningOrders(Array.isArray(data) ? data.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED') : []);
    } catch (e) { console.error(e); }
  };

  const lookupCustomer = async (phone) => {
      if (phone.length < 10) return;
      try {
          const res = await fetch(`${API_BASE}/api/public/loyalty/points?phone=${phone}`);
          const data = await res.json();
          if (data.points !== undefined) {
              setLoyaltyPoints(data.points);
              setCustomerName(data.name || "");
          }
      } catch (e) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const impersonateId = sessionStorage.getItem("impersonate_id");
        const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
        
        const [bizRes, itemsRes] = await Promise.all([
          fetch(`${API_BASE}/api/business/status${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${API_BASE}/api/catalog${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        const bizData = await bizRes.json();
        const itemsData = await itemsRes.json();

        setBusiness(bizData.business);
        setItems(Array.isArray(itemsData) ? itemsData : []);
        const cats = ["All", ...new Set(itemsData.map(i => i.category))];
        setCategories(cats);
        await fetchRunningOrders();
      } catch (err) {
        console.error("POS Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

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
        userId: business.user_id,
        tableNumber: String(selectedTable || 0),
        items: cart.map(i => ({ name: i.product_name, qty: i.qty, price: i.price, tax_applicable: i.tax_applicable })),
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
        setDiscountValue(0);
        await fetchRunningOrders();
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
          <div class="row bold"><span>GRAND TOTAL:</span><span>₹${totals.total.toFixed(2)}</span></div>
          <div class="dashed"></div>
          <div class="center"><p>THANK YOU! VISIT AGAIN</p></div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `;
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white font-black uppercase text-xs animate-pulse">Initializing SaSLoop POS Terminal...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 select-none">
      
      {/* 🟠 LEFT: CATEGORIES */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
          <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-950 text-white">
             <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20 animate-pulse">
                <Zap className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Station 01</p>
                <p className="text-sm font-black italic tracking-tighter">SaSLoop POS</p>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-r-4 ${
                   selectedCategory === cat 
                   ? 'bg-orange-50 text-orange-600 border-orange-500' 
                   : 'text-slate-400 border-transparent hover:text-slate-700 hover:bg-slate-50'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
          <div className="p-6 border-t border-slate-100">
             <button onClick={() => window.close()} className="w-full py-3 bg-rose-50 text-rose-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                Close Terminal
             </button>
          </div>
      </div>

      {/* ⚪ MIDDLE: PRODUCTS & TABLES */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* FLOOR LAYOUT */}
        <div className="bg-white border-b border-slate-100 p-4 shrink-0 overflow-x-auto custom-scrollbar-h">
           <div className="flex items-center gap-4">
              <div className="shrink-0 flex items-center gap-3 pr-6 border-r border-slate-100">
                  <Grid className="w-5 h-5 text-slate-300" />
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tables</p>
              </div>
              <div className="flex gap-2 py-1">
                  {Array.from({ length: 24 }, (_, i) => i + 1).map(num => {
                    const order = runningOrders.find(o => o.table_number === String(num));
                    return (
                      <button 
                        key={num}
                        onClick={() => {
                            setSelectedTable(num);
                            if (order) {
                                setCart(Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]'));
                                setCustomerName(order.customer_name);
                                setCustomerPhone(order.customer_number);
                            } else {
                                setCart([]);
                                setCustomerName("");
                                setCustomerPhone("");
                            }
                        }}
                        className={`w-14 h-14 shrink-0 flex flex-col items-center justify-center rounded-[1.25rem] border-2 font-black transition-all ${
                          selectedTable === num ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-110' :
                          order ? 'bg-orange-500 text-white border-orange-500 animate-pulse' :
                          'bg-white text-slate-300 border-slate-100 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <span className="text-[10px]">T{num}</span>
                        {order && <span className="text-[8px] opacity-60">₹{order.total_price}</span>}
                      </button>
                    );
                  })}
              </div>
           </div>
        </div>

        {/* SEARCH & MENU */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
           <div className="p-6 pb-2">
              <div className="relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search by Dish Name or Item Code..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-6 py-5 text-sm font-black outline-none focus:border-orange-500 shadow-xl shadow-slate-200/20 transition-all"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                 {filteredItems.map(item => (
                   <button 
                     key={item.id}
                     onClick={() => addToCart(item)}
                     className="bg-white border-2 border-transparent p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-orange-100 transition-all group relative animate-in zoom-in-95 duration-300"
                   >
                      <div className="aspect-square bg-slate-50 rounded-[2rem] mb-4 overflow-hidden border border-slate-50">
                         {item.image_url ? <img src={`${API_BASE}${item.image_url}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Utensils className="w-10 h-10" /></div>}
                      </div>
                      <div className="text-left px-2">
                          <h4 className="text-[11px] font-black text-slate-900 uppercase italic line-clamp-1 mb-1">{item.product_name}</h4>
                          <div className="flex items-center justify-between">
                              <p className="text-sm font-black text-slate-950 tracking-tighter italic">₹{item.price}</p>
                              <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.is_veg ? '#10b981' : '#f43f5e' }} />
                          </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <Plus className="w-5 h-5" />
                      </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 🧾 RIGHT: SETTLEMENT CONSOLE */}
      <div className="w-[380px] bg-slate-950 flex flex-col shrink-0 shadow-2xl relative z-20">
        
        {/* TABS & MODE */}
        <div className="p-6 pb-2">
            <div className="flex bg-white/5 p-1 rounded-2xl mb-6">
               {['DINEIN', 'TAKEAWAY', 'DELIVERY'].map(val => (
                 <button 
                   key={val} onClick={() => setActiveTab(val)}
                   className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === val ? 'bg-white text-slate-950 shadow-lg' : 'text-white/40 hover:text-white'}`}
                 >
                   {val}
                 </button>
               ))}
            </div>

            {/* CUSTOMER PROFILE */}
            <div className="bg-white/5 rounded-3xl p-4 border border-white/5 space-y-3">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center"><Users className="w-4 h-4" /></div>
                    <h5 className="text-white text-[10px] font-black uppercase italic tracking-widest">Customer Details</h5>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input 
                        type="text" placeholder="Phone..." value={customerPhone} 
                        onChange={e => { setCustomerPhone(e.target.value); lookupCustomer(e.target.value); }}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white outline-none focus:border-indigo-500" 
                    />
                    <input 
                        type="text" placeholder="Name..." value={customerName} 
                        onChange={e => setCustomerName(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white outline-none focus:border-indigo-500" 
                    />
                </div>
                {loyaltyPoints > 0 && (
                    <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
                        <Star className="w-3 h-3" /> Member Points: {loyaltyPoints}
                    </div>
                )}
            </div>
        </div>

        {/* CART LIST */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar-dark space-y-3">
           {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-white/10 italic">
                   <ShoppingBag className="w-16 h-16 mb-4 opacity-10" />
                   <p className="font-black uppercase tracking-widest text-[10px]">Cart Empty</p>
               </div>
           ) : cart.map(item => (
             <div key={item.id} className="bg-white/5 rounded-2xl p-4 flex gap-4 border border-white/5 group relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1 h-full bg-orange-500 opacity-50" />
                <div className="flex-1">
                   <h5 className="text-white font-black text-[11px] uppercase italic line-clamp-1">{item.product_name}</h5>
                   <p className="text-white/40 font-black text-[10px] mt-1 italic">₹{item.price} per unit</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-black/60 rounded-xl border border-white/5 p-1">
                       <button onClick={() => updateQty(item.id, -1)} className="p-1 px-2 text-white/40 hover:text-white"><Minus className="w-4 h-4" /></button>
                       <span className="px-2 text-white font-black text-xs">{item.qty}</span>
                       <button onClick={() => updateQty(item.id, 1)} className="p-1 px-2 text-white/40 hover:text-white"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>
           ))}
        </div>

        {/* SUMMARY & CHECKOUT */}
        <div className="p-6 bg-black/40 border-t border-white/5 space-y-4">
           
           {/* DISCOUNT ENGINE */}
           <div className="flex gap-2">
               <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center"><Percent className="w-3.5 h-3.5" /></div>
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Discount</span>
                  </div>
                  <input 
                    type="number" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} 
                    className="w-16 bg-transparent text-right text-white font-black outline-none text-xs" 
                    placeholder="0"
                  />
               </div>
               <div className="flex bg-white/5 rounded-2xl p-1">
                   <button onClick={() => setDiscountType('PERCENT')} className={`px-3 rounded-xl text-[9px] font-black uppercase transition-all ${discountType === 'PERCENT' ? 'bg-white text-slate-900' : 'text-white/40'}`}>%</button>
                   <button onClick={() => setDiscountType('FIXED')} className={`px-3 rounded-xl text-[9px] font-black uppercase transition-all ${discountType === 'FIXED' ? 'bg-white text-slate-900' : 'text-white/40'}`}>₹</button>
               </div>
           </div>

           {/* TOTALS */}
           <div className="space-y-2 border-b border-white/5 pb-4">
              <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                 <span>Net Subtotal</span>
                 <span className="text-white">₹{totals.subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                 <span>Taxes (GST)</span>
                 <span className="text-white">₹{totals.totalTax.toFixed(0)}</span>
              </div>
           </div>

           <div className="flex justify-between items-end mb-2">
              <div className="text-white">
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-1">Payable Amount</p>
                  <h3 className="text-4xl font-black italic tracking-tighter">₹{Math.floor(totals.total)}</h3>
              </div>
              <button onClick={handlePrint} className="w-14 h-14 bg-white/5 text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 shadow-xl"><Printer className="w-6 h-6" /></button>
           </div>

           {/* PAYMENT MODE */}
           <div className="grid grid-cols-3 gap-2 py-2">
               {[
                   { id: 'CASH', icon: Banknote, color: 'emerald' },
                   { id: 'UPI', icon: Smartphone, color: 'indigo' },
                   { id: 'CARD', icon: CreditCard, color: 'blue' }
               ].map(m => (
                   <button 
                    key={m.id} onClick={() => setPaymentMode(m.id)}
                    className={`py-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${paymentMode === m.id ? `bg-${m.color}-500/10 border-${m.color}-500 text-${m.color}-400` : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
                   >
                       <m.icon className="w-4 h-4" />
                       <span className="text-[8px] font-black uppercase tracking-widest">{m.id}</span>
                   </button>
               ))}
           </div>

           <div className="flex gap-3">
              <button 
                 disabled={isProcessing || cart.length === 0}
                 onClick={() => handleAction('PREPARING')}
                 className="flex-1 h-16 bg-white/5 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] border border-white/5 transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2"
               >
                 <Save className="w-4 h-4" /> Hold
              </button>
              <button 
                 disabled={isProcessing || cart.length === 0}
                 onClick={() => handleAction('COMPLETED')}
                 className="flex-[2] h-16 bg-orange-500 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2"
               >
                 Settle & Print <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

      {/* OVERLAYS */}
      {checkoutResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4">
           <div className="bg-white max-w-[320px] w-full rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce"><CheckCircle2 className="w-10 h-10" /></div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-2 tracking-tighter">ORDER PLACED</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">
                  Transaction {checkoutResult.subType === 'COMPLETED' ? 'Settled' : 'Saved to floor'} successfully.
              </p>
              <button onClick={() => setCheckoutResult(null)} className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl">Complete Terminal</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default POS;
