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
  ArrowRight
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

  const searchRef = useRef(null);

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
    return runningOrders.find(o => o.table_number === String(num)) ? 'occupied' : 'free';
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
        items: cart.map(i => ({ name: i.product_name, qty: i.qty, price: i.price, tax_applicable: i.tax_applicable })),
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const receiptHTML = `
      <html>
        <head>
          <title>Receipt - ${business?.name}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 80mm; padding: 5mm; font-size: 12px; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .total-row { display: flex; justify-content: space-between; border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; font-weight: bold; }
            .footer { text-align: center; margin-top: 10px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>${business?.name}</h3>
            <p>${business?.address || ''}</p>
            <p>Order: POS-${Math.random().toString(36).substring(7).toUpperCase()}</p>
            <p>Table: ${selectedTable || 'Takeaway'}</p>
          </div>
          ${cart.map(i => `<div class="item"><span>${i.qty}x ${i.product_name}</span><span>${(i.price * i.qty).toFixed(2)}</span></div>`).join('')}
          <div class="total-row"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
          <div class="footer"><p>Thank you for visiting!</p></div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `;
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  if (loading) return <div className="flex-1 flex items-center justify-center p-20 text-slate-400 font-black uppercase text-xs animate-pulse italic">Connecting to SaSLoop Central...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] -m-4 lg:-m-6 overflow-hidden bg-slate-50 font-sans text-slate-900 select-none">
      
      {/* 🟠 COMPACT CATEGORY STRIP (Fixed width, Scrollable) */}
      <div className="w-48 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.02)] z-10">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
             <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                <Zap className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">POS <span className="text-orange-500 italic">2.0</span></p>
          </div>
          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-r-2 ${
                   selectedCategory === cat 
                   ? 'bg-orange-50/50 text-orange-600 border-orange-500' 
                   : 'text-slate-400 border-transparent hover:text-slate-700 hover:bg-slate-50'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
          <div className="p-4 bg-slate-50/50 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase italic">
             <span>Syncing</span>
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>
      </div>

      {/* ⚪ MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* 📋 COMPACT TABLE GRID (Row-based) */}
        <div className="bg-white border-b border-slate-100 p-3 shrink-0">
           <div className="flex justify-between items-center px-1 mb-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Floor Layout</p>
              <div className="flex gap-3">
                 <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-300 uppercase"><div className="w-2 h-2 rounded-sm bg-slate-100 border border-slate-200" /> Free</div>
                 <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-300 uppercase"><div className="w-2 h-2 rounded-sm bg-orange-500" /> Active</div>
              </div>
           </div>
           <div className="max-h-[140px] overflow-y-auto grid grid-cols-12 gap-1.5 p-1 custom-scrollbar">
              {Array.from({ length: 48 }, (_, i) => i + 1).map(num => {
                const status = getTableStatus(num);
                return (
                  <button 
                    key={num}
                    onClick={() => selectLayoutTable(num)}
                    className={`h-11 flex items-center justify-center rounded-xl border font-black text-[10px] transition-all ${
                      selectedTable === num ? 'bg-slate-900 text-white border-slate-900 shadow-xl' :
                      status === 'occupied' ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100' :
                      'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    T{num}
                  </button>
                );
              })}
           </div>
        </div>

        {/* 🍔 MENU EXPLORER */}
        <div className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden">
           <div className="p-4 flex gap-3">
              <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 <input 
                   type="text" 
                   placeholder="Dish name..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm"
                 />
              </div>
              <button onClick={fetchRunningOrders} className="p-3 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:text-orange-500 transition-all shadow-sm"><RefreshCw className="w-4 h-4" /></button>
           </div>

           <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
              <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                 {filteredItems.map(item => (
                   <button 
                     key={item.id}
                     onClick={() => addToCart(item)}
                     className="bg-white border border-transparent p-3 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:border-orange-100 transition-all group relative animate-in zoom-in-95"
                   >
                      <div className="aspect-square bg-slate-50 rounded-2xl mb-3 overflow-hidden border border-slate-50 ring-2 ring-transparent group-hover:ring-orange-100 transition-all">
                         {item.image_url ? <img src={`${API_BASE}${item.image_url}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-5"><ShoppingBag className="w-8 h-8" /></div>}
                      </div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase italic line-clamp-1 mb-0.5">{item.product_name}</h4>
                      <p className="text-[11px] font-black text-slate-950 tracking-tighter italic">₹{item.price}</p>
                      <div className="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.is_veg ? '#10b981' : '#f43f5e' }} />
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 🧾 RIGHT: COMPACT CONSOLE (High Density) */}
      <div className="w-80 bg-slate-950 flex flex-col shrink-0 shadow-2xl relative z-20">
        
        {/* TABS (Tiny Style) */}
        <div className="flex bg-white/5 p-1 rounded-2xl m-4 mb-2">
           {['Dine In', 'Takeaway', 'Delivery'].map(txt => {
             const val = txt.toUpperCase().replace(/\s/g, '');
             return (
               <button 
                 key={txt} onClick={() => setActiveTab(val)}
                 className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === val ? 'bg-white text-slate-950' : 'text-white/40 hover:text-white'}`}
               >
                 {txt}
               </button>
             );
           })}
        </div>

        {/* ORDER HEAD */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
           <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                 <Package className="w-4 h-4" />
              </div>
              <h3 className="text-white text-[10px] font-black uppercase italic">{selectedTable ? `Table ${selectedTable}` : 'Select Table'}</h3>
           </div>
           <div className="flex gap-1">
              <button onClick={() => setSubTab('KOT')} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${subTab === 'KOT' ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40'}`}>KOT</button>
              <button onClick={() => setSubTab('BILLING')} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${subTab === 'BILLING' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40'}`}>Bill</button>
           </div>
        </div>

        {/* CART LIST (Compact) */}
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar-dark space-y-2">
           {cart.map(item => (
             <div key={item.id} className="bg-white/5 rounded-xl p-3 flex gap-3 border border-white/5">
                <div className="flex-1">
                   <h5 className="text-white font-bold text-[10px] uppercase italic line-clamp-1">{item.product_name}</h5>
                   <p className="text-emerald-400 font-black text-[11px] mt-0.5">₹{item.price * item.qty}</p>
                </div>
                <div className="flex items-center bg-black/40 rounded-lg border border-white/5 p-0.5">
                   <button onClick={() => updateQty(item.id, -1)} className="p-0.5 px-1.5 text-white/40 hover:text-white"><Minus className="w-3 h-3" /></button>
                   <span className="px-1 text-white font-black text-[10px]">{item.qty}</span>
                   <button onClick={() => updateQty(item.id, 1)} className="p-0.5 px-1.5 text-white/40 hover:text-white"><Plus className="w-3 h-3" /></button>
                </div>
             </div>
           ))}
        </div>

        {/* FOOTER AREA */}
        <div className="p-4 pt-2 bg-black/40 border-t border-white/5 space-y-4">
           <div className="space-y-4">
              <input type="text" placeholder="Guest Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none focus:border-orange-500/50" />
              <div className="flex justify-between items-center text-white/30 text-[9px] font-black uppercase tracking-widest px-1">
                 <span>Subtotal</span>
                 <span className="text-white">₹{totals.subtotal.toFixed(0)}</span>
              </div>
           </div>

           <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black text-white italic tracking-tighter">₹{Math.floor(totals.total)}</h3>
                 <button onClick={handlePrint} className="p-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"><Printer className="w-4 h-4" /></button>
              </div>
           </div>

           <div className="flex gap-2">
              <button 
                 disabled={isProcessing || cart.length === 0}
                 onClick={() => handleAction('PREPARING')}
                 className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest border border-white/5 transition-all active:scale-95 disabled:opacity-50"
              >
                 Hold Order
              </button>
              <button 
                 disabled={isProcessing || cart.length === 0}
                 onClick={() => handleAction('COMPLETED')}
                 className="flex-[1.5] py-4 bg-orange-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-orange-500/10 transition-all active:scale-95 disabled:opacity-50"
              >
                 Settle & Pay
              </button>
           </div>
        </div>
      </div>

      {/* FEEDBACK & RESULTS */}
      {selectedTable && (
        <div className="fixed bottom-6 left-[220px] z-[100] bg-slate-900 border border-white/10 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-300">
           <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
           <p className="text-[9px] font-black uppercase tracking-widest italic leading-none">Table {selectedTable} Selected</p>
        </div>
      )}

      {checkoutResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
           <div className="bg-white max-w-[280px] w-full rounded-[2.5rem] p-8 text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner"><CheckCircle2 className="w-8 h-8" /></div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic mb-1">SUCCESS</h3>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-6">{checkoutResult.subType === 'COMPLETED' ? 'Settled' : 'Parked'}</p>
              <button onClick={() => setCheckoutResult(null)} className="w-full py-4 bg-slate-950 text-white rounded-[1.25rem] font-black text-[9px] uppercase tracking-[0.2em] transition-all">Next</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default POS;
