import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ShoppingCart, History, Settings, Wifi, WifiOff, 
  User, Search, Plus, Minus, Trash2, CheckCircle, CreditCard, 
  Banknote, ScanBarcode, Calendar, Package, ClipboardList
} from 'lucide-react';
import { posService, authService } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UniversalPOS = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cart, setCart] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic Business State
  const [business, setBusiness] = useState(null);
  const [config, setConfig] = useState({
    features: {
      tables: false,
      inventory: false,
      barcode: false,
      services: false,
      appointments: false
    },
    currency: '₹',
    tax_rate: 0
  });

  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);

  const handlePinLogin = async (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (!phone) {
          toast.error("Please enter staff phone number");
          setPin('');
          return;
        }
        try {
          const res = await authService.posLogin(phone, newPin);
          localStorage.setItem('pos_token', res.data.token);
          localStorage.setItem('pos_user', JSON.stringify(res.data.user));
          setIsAuthenticated(true);
          toast.success("Terminal Unlocked");
        } catch (err) {
          toast.error(err.response?.data?.error || "Authentication Failed");
          setPin('');
        }
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('pos_token');
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    if (isAuthenticated) initPOS();
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, [isAuthenticated]);

  const initPOS = async () => {
    try {
      const profileRes = await authService.getProfile();
      const fullData = profileRes.data;
      const bizData = fullData.business_details || fullData;
      setBusiness(fullData);

      // 🌍 Universal Logic: Detect Business "DNA"
      const type = (fullData.business_type || 'Restaurant').toLowerCase();
      const newConfig = {
        features: {
          tables: type.includes('restaur') || type.includes('cafe') || type.includes('bar'),
          inventory: type.includes('retail') || type.includes('shop') || type.includes('grocery'),
          barcode: type.includes('retail') || type.includes('pharmacy'),
          services: type.includes('salon') || type.includes('spa') || type.includes('service'),
          appointments: type.includes('clinic') || type.includes('salon')
        },
        currency: bizData?.currency_symbol || '₹',
        tax_rate: parseFloat(bizData?.tax_percent) || 0
      };
      setConfig(newConfig);

      // Load specific data based on detected features
      const catRes = await posService.getCatalog();
      setCatalog(catRes.data || []);
      
      if (newConfig.features.tables) {
        const tableRes = await posService.getTables();
        setTables(tableRes.data || []);
      }
    } catch (err) {
      console.error("POS Init Error", err);
      toast.info("Offline: Check Connection");
    }
  };

  // ... Cart logic (remains universal)
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === (item.id || item.product_name));
      if (existing) return prev.map(i => (i.id || i.product_name) === (item.id || item.product_name) ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1, id: item.id || item.product_name }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (config.tax_rate / 100);
  const total = subtotal + tax;

  const handleCheckout = async (method) => {
    if (cart.length === 0) return toast.warning("Cart is empty");
    if (config.features.tables && !selectedTable) return toast.warning("Select a table");

    const orderData = {
      customer_name: "POS Walk-in",
      items: cart.map(i => ({ name: i.product_name, qty: i.quantity, price: i.price })),
      total_price: total,
      payment_method: method,
      status: 'COMPLETED',
      table_id: selectedTable?.id,
      order_type: selectedTable ? 'DINE_IN' : 'PICKUP'
    };

    try {
      await posService.createOrder(orderData);
      toast.success("Order Synced Successfully");
      setCart([]);
      setSelectedTable(null);
    } catch (err) {
      toast.error("Failed to sync order");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-8 font-sans">
        <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-12">
          <LayoutGrid className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">SaSLoop <span className="text-emerald-500">Terminal</span></h1>
        
        <div className="w-full max-w-xs space-y-6">
          <div className="space-y-2">
            <label className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] block text-center">Staff Phone Number</label>
            <input 
              type="text" 
              placeholder="+91..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white text-center font-bold tracking-widest focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] block text-center">Security PIN</label>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length >= i ? 'bg-emerald-500 border-emerald-500 scale-125' : 'border-slate-800'}`}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-xs w-full mt-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num}
              onClick={() => handlePinLogin(num.toString())}
              className="h-16 bg-slate-900/50 border border-slate-800 rounded-3xl text-xl font-black text-slate-300 hover:bg-slate-800 hover:text-white active:scale-90 transition-all flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div className="h-16"></div>
          <button 
            onClick={() => handlePinLogin('0')}
            className="h-16 bg-slate-900/50 border border-slate-800 rounded-3xl text-xl font-black text-slate-300 hover:bg-slate-800 hover:text-white active:scale-90 transition-all flex items-center justify-center"
          >
            0
          </button>
          <button 
            onClick={() => setPin('')}
            className="h-16 bg-slate-900/50 border border-rose-900/30 text-rose-500 rounded-3xl text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white active:scale-90 transition-all flex items-center justify-center"
          >
            Clear
          </button>
        </div>
        <ToastContainer position="bottom-center" theme="dark" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar - Dynamically rendered based on Business DNA */}
      <div className="w-20 border-r border-slate-800 flex flex-col items-center py-8 gap-6 bg-slate-900/50">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 font-black italic">S</div>
        
        <button onClick={() => setActiveTab('menu')} className={`p-3 rounded-xl transition-all ${activeTab === 'menu' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>
          <ShoppingCart size={24} />
        </button>

        {config.features.tables && (
          <button onClick={() => setActiveTab('tables')} className={`p-3 rounded-xl transition-all ${activeTab === 'tables' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>
            <LayoutGrid size={24} />
          </button>
        )}

        {config.features.inventory && (
          <button onClick={() => setActiveTab('inventory')} className={`p-3 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}>
            <Package size={24} />
          </button>
        )}

        {config.features.appointments && (
          <button onClick={() => setActiveTab('booking')} className={`p-3 rounded-xl transition-all ${activeTab === 'booking' ? 'bg-rose-500 text-white' : 'text-slate-500'}`}>
            <Calendar size={24} />
          </button>
        )}

        <button onClick={() => setActiveTab('history')} className={`p-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>
          <History size={24} />
        </button>

        <div className="mt-auto flex flex-col gap-6">
          {isOnline ? <Wifi className="text-emerald-500" size={18} /> : <WifiOff className="text-rose-500" size={18} />}
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"><User size={18} /></div>
        </div>
      </div>

      {/* Main Terminal Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/10">
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-wider">
              {business?.business_name || 'SaSLoop POS'}
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              {business?.business_type || 'Universal Terminal'} • {selectedTable?.table_name || 'Counter'}
            </p>
          </div>

          <div className="flex gap-4">
            {config.features.barcode && (
              <div className="relative group">
                <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input type="text" placeholder="Scan Barcode..." className="bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm w-48 focus:w-64 focus:border-emerald-500 outline-none transition-all" />
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm w-64 focus:border-emerald-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
           {activeTab === 'menu' && (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
               {catalog.filter(i => i.product_name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                 <div key={item.id} onClick={() => addToCart(item)} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 cursor-pointer hover:border-emerald-500/30 active:scale-95 transition-all group">
                   <div className="aspect-square bg-slate-800 rounded-2xl mb-4 flex items-center justify-center font-black text-2xl text-slate-700 uppercase italic">
                     {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover rounded-2xl" /> : item.product_name[0]}
                   </div>
                   <h3 className="font-bold text-slate-200 text-sm line-clamp-1">{item.product_name}</h3>
                   <div className="flex justify-between items-center mt-2">
                     <p className="text-emerald-500 font-black">{config.currency}{item.price}</p>
                     {config.features.inventory && <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500">Stock: {item.stock_count || 0}</span>}
                   </div>
                 </div>
               ))}
             </div>
           )}

           {activeTab === 'tables' && (
             <div className="grid grid-cols-4 lg:grid-cols-6 gap-6">
               {tables.map(t => (
                 <div key={t.id} onClick={() => { setSelectedTable(t); setActiveTab('menu'); }} className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${selectedTable?.id === t.id ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-900 border-slate-800'}`}>
                   <span className="font-black text-xl italic">{t.table_name}</span>
                   <span className="text-[10px] font-black uppercase opacity-50">{t.status}</span>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* Checkout Sidebar */}
      <div className="w-[400px] border-l border-slate-800 flex flex-col bg-slate-900/20">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-black uppercase italic text-lg">Order Detail</h2>
          <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">{activeTab}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.product_name}</h4>
                <p className="text-xs text-emerald-500 font-bold">{config.currency}{item.price * item.quantity}</p>
              </div>
              <div className="flex items-center gap-3 bg-slate-800 rounded-xl p-1">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white"><Minus size={14} /></button>
                <span className="font-mono font-bold text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white"><Plus size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-900/80 border-t border-slate-800">
          <div className="flex justify-between text-2xl font-black mb-6">
            <span>TOTAL</span>
            <span className="text-emerald-500">{config.currency}{total.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => handleCheckout('CASH')}
            className="w-full py-5 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-tight flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <CheckCircle size={20} />
            Place Order
          </button>
        </div>
      </div>

      <ToastContainer position="bottom-center" theme="dark" />
    </div>
  );
};

export default UniversalPOS;
