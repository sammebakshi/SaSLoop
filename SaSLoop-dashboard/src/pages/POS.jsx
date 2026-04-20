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
  Zap
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
  const [activeTab, setActiveTab] = useState("DINEIN"); // DINEIN, TAKEAWAY, DELIVERY
  const [subTab, setSubTab] = useState("BILLING"); // KOT, BILLING

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
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
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }));
  };

  const getTableStatus = (num) => {
    const order = runningOrders.find(o => o.table_number === String(num));
    if (!order) return 'free';
    if (order.status === 'PREPARING') return 'occupied';
    return 'free';
  };

  const selectLayoutTable = (num) => {
    setSelectedTable(num);
    const existingOrder = runningOrders.find(o => o.table_number === String(num));
    if (existingOrder) {
      setCart(JSON.parse(JSON.stringify(existingOrder.items || [])));
      setCustomerName(existingOrder.customer_name);
      setCustomerPhone(existingOrder.customer_number || "");
    } else {
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
    }
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let discountAmt = 0;
    if (discountType === 'PERCENT') discountAmt = (subtotal * discountValue) / 100;
    else if (discountType === 'FIXED') discountAmt = discountValue;
    const netAmount = Math.max(0, subtotal - discountAmt);
    const cgst = netAmount * ((business?.cgst_percent || 0) / 100);
    const sgst = netAmount * ((business?.sgst_percent || 0) / 100);
    return { subtotal, discountAmt, netAmount, cgst, sgst, total: netAmount + cgst + sgst };
  }, [cart, business, discountType, discountValue]);

  const handleAction = async (status = 'COMPLETED') => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const payload = {
        userId: business.user_id,
        tableNumber: String(selectedTable || 0),
        items: cart,
        totalPrice: totals.total,
        customerName: customerName || "POS Guest",
        customerPhone: customerPhone,
        fulfillmentMode: activeTab,
        source: "POS_MANUAL",
        status: status,
        paymentStatus: status === 'COMPLETED' ? 'PAID' : 'PENDING'
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
        await fetchRunningOrders();
      }
    } catch (e) { console.error(e); }
    setIsProcessing(false);
  };

  if (loading) return <div className="flex-1 flex items-center justify-center p-20 text-slate-400 font-black uppercase text-xs animate-pulse">Initializing SaSLoop POS...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] -m-4 lg:-m-6 overflow-hidden bg-slate-50 font-sans text-slate-900">
      
      {/* 🟠 LEFT: CATEGORIES */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-10">
          <div className="p-6 border-b border-slate-100">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                   <Zap className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-sm font-black flex items-center gap-1">SaSLoop <span className="text-orange-500">POS</span></h2>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Terminal</p>
                </div>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
             <p className="px-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Categories</p>
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-r-4 ${
                   selectedCategory === cat 
                   ? 'bg-slate-50 text-slate-950 border-orange-500' 
                   : 'text-slate-400 border-transparent hover:text-slate-700 hover:bg-slate-50/50'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
             <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Sync Active
             </div>
          </div>
      </div>

      {/* ⚪ CENTER: ACTION AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* 🏢 TOP: TABLE GRID (SaSLoop Styled) */}
        <div className="bg-white border-b border-slate-100 p-4 shrink-0">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black uppercase italic tracking-tighter text-slate-400">Main Floor Layout</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-300">
                    <div className="w-2 h-2 rounded bg-slate-100 border border-slate-200" /> Vacant
                 </div>
                 <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-300">
                    <div className="w-2 h-2 rounded bg-orange-500" /> Occupied
                 </div>
              </div>
           </div>
           
           <div className="max-h-[180px] overflow-y-auto grid grid-cols-10 gap-2 p-1 custom-scrollbar">
              {Array.from({ length: 50 }, (_, i) => i + 1).map(num => {
                const status = getTableStatus(num);
                return (
                  <button 
                    key={num}
                    onClick={() => selectLayoutTable(num)}
                    className={`h-14 flex flex-col items-center justify-center rounded-2xl border-2 text-[11px] font-black transition-all ${
                      selectedTable === num ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 scale-95' :
                      status === 'occupied' ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100' :
                      'bg-white text-slate-400 border-slate-50 hover:border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    T{num}
                  </button>
                );
              })}
           </div>
           
           {/* QUICK TOOLBAR */}
           <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50">
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-[1.25rem] text-[10px] font-black uppercase hover:bg-slate-200 transition-all border border-slate-200/50">
                <PlusCircle className="w-4 h-4" /> Move Table
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-[1.25rem] text-[10px] font-black uppercase hover:bg-slate-200 transition-all border border-slate-200/50">
                 <RefreshCw className="w-4 h-4" /> Refresh Map
              </button>
              <button onClick={() => selectLayoutTable(null)} className="flex items-center gap-2 px-6 py-3 bg-orange-50 text-orange-600 rounded-[1.25rem] text-[10px] font-black uppercase hover:bg-orange-100 transition-all border border-orange-100 ml-auto">
                 <Trash2 className="w-4 h-4" /> Clear Selection
              </button>
           </div>
        </div>

        {/* 🥘 SEARCH & MENU GRID */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/50">
           <div className="p-6 pb-2">
              <div className="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <input 
                   type="text" 
                   placeholder="Quick search dish name or code..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="w-full bg-white border border-slate-100 rounded-[2rem] pl-16 pr-6 py-5 text-sm font-bold shadow-sm focus:border-orange-500/30 transition-all"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
              <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                 {filteredItems.map(item => (
                   <button 
                     key={item.id}
                     onClick={() => addToCart(item)}
                     className="bg-white border border-transparent p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200 hover:border-orange-100 transition-all text-left flex flex-col group active:scale-95"
                   >
                      <div className="aspect-square bg-slate-50 rounded-[2rem] mb-4 overflow-hidden relative border border-slate-50">
                         {item.image_url ? (
                           <img src={`${API_BASE}${item.image_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center opacity-5"><ShoppingBag className="w-12 h-12" /></div>
                         )}
                         <div className={`absolute top-4 right-4 w-3.5 h-3.5 border-2 border-white rounded-md ${item.is_veg ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-rose-500 shadow-lg shadow-rose-500/50'}`} />
                      </div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.category}</p>
                      <h4 className="text-xs font-black text-slate-900 uppercase italic line-clamp-1 mb-2 h-8">{item.product_name}</h4>
                      <div className="mt-auto flex justify-between items-center">
                         <span className="text-sm font-black text-slate-950 tracking-tighter">₹{item.price}</span>
                         <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-all">
                            <Plus className="w-4 h-4" />
                         </div>
                      </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 🧾 RIGHT: CONSOLIDATED CHECKOUT */}
      <div className="w-[420px] bg-slate-950 flex flex-col shrink-0 shadow-2xl relative z-20">
        
        {/* TABS (SaSLoop Dark Style) */}
        <div className="flex bg-white/5 p-1.5 rounded-[2rem] m-6 mb-0">
           {['Dine In', 'Takeaway', 'Delivery'].map(txt => {
             const val = txt.toUpperCase().replace(/\s/g, '');
             return (
               <button 
                 key={txt} 
                 onClick={() => setActiveTab(val)}
                 className={`flex-1 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === val ? 'bg-white text-slate-950 shadow-xl' : 'text-white/40 hover:text-white'}`}
               >
                 {txt}
               </button>
             );
           })}
        </div>

        {/* ORDER HEAD */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                 <Package className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-white text-sm font-black uppercase tracking-widest">{selectedTable ? `Table ${selectedTable}` : 'Pick Table'}</h3>
                 <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Active session</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => setSubTab('KOT')}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${subTab === 'KOT' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}
              >
                KOT
              </button>
              <button 
                onClick={() => setSubTab('BILLING')}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${subTab === 'BILLING' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40'}`}
              >
                Bill
              </button>
           </div>
        </div>

        {/* CART LIST */}
        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar-dark space-y-4">
           {cart.map(item => (
             <div key={item.id} className="bg-white/5 rounded-[2rem] p-5 flex gap-4 border border-white/5 animate-in slide-in-from-right duration-300">
                <div className="w-12 h-12 bg-white/5 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                   {item.image_url ? <img src={`${API_BASE}${item.image_url}`} className="w-full h-full object-cover" /> : <Utensils className="w-5 h-5 text-white/20" />}
                </div>
                <div className="flex-1">
                   <h5 className="text-white font-bold text-xs uppercase italic tracking-tight line-clamp-1">{item.product_name}</h5>
                   <p className="text-emerald-400 font-black text-sm mt-1">₹{item.price * item.qty}</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center bg-black/40 rounded-xl border border-white/10 p-1">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 px-2 text-white/40 hover:text-white"><Minus className="w-4 h-4" /></button>
                      <span className="px-2 text-white font-black text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 px-2 text-white/40 hover:text-white"><Plus className="w-4 h-4" /></button>
                   </div>
                </div>
             </div>
           ))}
           {cart.length === 0 && (
             <div className="h-40 flex flex-col items-center justify-center opacity-10 text-white pt-10">
                <ShoppingBag className="w-16 h-16 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Selection</p>
             </div>
           )}
        </div>

        {/* BILLING FOOTER */}
        <div className="p-8 bg-black/20 border-t border-white/5 space-y-6">
           <div className="space-y-4">
              <div className="flex gap-4">
                 <input type="text" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-orange-500/50" />
                 <input type="text" placeholder="Table #" value={selectedTable || ""} disabled className="w-24 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white text-center opacity-50" />
              </div>
              <div className="flex items-center justify-between text-white/40 text-[10px] font-black uppercase tracking-widest px-1">
                 <span>Taxes & GST Incl.</span>
                 <span className="text-white font-mono">₹{(totals.cgst + totals.sgst).toFixed(2)}</span>
              </div>
           </div>

           <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter italic">₹{Math.floor(totals.total)}</h3>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mt-2">Payable Amount</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 bg-white/10 text-white rounded-2xl hover:bg-white/20"><Printer className="w-5 h-5" /></button>
                 </div>
              </div>
           </div>

           <div className="flex gap-3">
              <button 
                 disabled={isProcessing || cart.length === 0}
                 onClick={() => handleAction('PREPARING')}
                 className="flex-1 py-5 bg-white/5 text-white hover:bg-white/10 rounded-[2.5rem] font-black text-xs uppercase tracking-widest border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                 <Save className="w-4 h-4 text-orange-500" /> Hold
              </button>
              <button 
                 disabled={isProcessing || cart.length === 0}
                 onClick={() => handleAction('COMPLETED')}
                 className="flex-[2] py-5 bg-orange-500 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 transition-all hover:bg-orange-400 active:scale-95 disabled:opacity-50"
              >
                 <CreditCard className="w-4 h-4" /> Final Bill
              </button>
           </div>
        </div>
      </div>

      {/* FEEDBACK OVERLAY */}
      {selectedTable && (
        <div className="fixed bottom-10 left-[260px] z-[100] bg-slate-900 border border-white/10 text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
              <CheckCircle2 className="w-5 h-5" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest italic">On table {selectedTable}</p>
        </div>
      )}

      {/* RESULT MODAL */}
      {checkoutResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
           <div className="bg-white max-w-sm w-full rounded-[4rem] p-12 text-center shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 uppercase italic mb-2 tracking-tighter">SUCCESS</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10 leading-relaxed">
                 {checkoutResult.subType === 'COMPLETED' ? 'Transaction Completed & Table Freed' : 'Order Parked to Kitchen Successfully'}
              </p>
              <button 
                onClick={() => setCheckoutResult(null)}
                className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
              >
                 Next Guest
              </button>
           </div>
        </div>
      )}

    </div>
  );
};

export default POS;
