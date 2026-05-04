import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ShoppingCart, History, Settings, Wifi, WifiOff, 
  User, Search, Plus, Minus, Trash2, CheckCircle, CreditCard, 
  Banknote, ScanBarcode, Package, ClipboardList
} from 'lucide-react';
import { posService, authService } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UniversalPOS = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cart, setCart] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const [business, setBusiness] = useState(null);
  const [config, setConfig] = useState({
    features: { tables: false, inventory: false, barcode: false },
    currency: '₹',
    tax_rate: 0
  });

  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Enter username and password");
      return;
    }
    try {
      const res = await authService.posLogin(username, password);
      localStorage.setItem('pos_token', res.data.token);
      localStorage.setItem('pos_user', JSON.stringify(res.data.user));
      setIsAuthenticated(true);
      toast.success("Terminal Unlocked");
    } catch (err) {
      toast.error(err.response?.data?.error || "Authentication Failed");
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

      const type = (fullData.business_type || 'Restaurant').toLowerCase();
      const newConfig = {
        features: {
          tables: type.includes('restaur') || type.includes('cafe'),
          inventory: type.includes('retail') || type.includes('shop'),
          barcode: type.includes('retail')
        },
        currency: bizData?.currency_symbol || '₹',
        tax_rate: parseFloat(bizData?.tax_percent) || 0
      };
      setConfig(newConfig);

      const catRes = await posService.getCatalog();
      setCatalog(catRes.data || []);

      if (newConfig.features.tables) {
        const tableRes = await posService.getTables();
        setTables(tableRes.data || []);
      }

      // Fetch initial orders
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Check Connection");
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      // We assume there's an endpoint for fetching recent orders
      const res = await api.get('/api/orders/recent'); 
      setOrders(res.data || []);
    } catch (err) {
      console.error("Orders Fetch Error:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
    setIsAuthenticated(false);
    setCart([]);
  };

  async function handleCheckout(method) {
    const subtotal = cart.reduce((a,b) => a+(b.price*b.quantity), 0);
    const tax = subtotal * (config.tax_rate/100);
    const total = subtotal + tax;

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
      toast.success("Order Synced Successfully!");
      setCart([]);
      setSelectedTable(null);
      fetchOrders(); // Refresh history
    } catch (err) {
      toast.error("Failed to sync order.");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
        <ToastContainer position="top-center" theme="dark" />
        <div className="w-full max-w-md bg-[#1e293b] rounded-[3rem] border-2 border-white/5 p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
              <ShoppingCart className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">SaSLoop POS</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Terminal Authentication</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Username / Email</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 text-sm font-bold text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <div className="relative">
                <CheckCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 text-sm font-bold text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs mt-4">Unlock Terminal</button>
          </form>
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
            <div className="flex items-center gap-2"><Wifi className="w-3 h-3 text-emerald-500" /><span className="text-[9px] font-bold text-white uppercase tracking-tighter">System Online</span></div>
            <span className="text-[9px] font-bold text-white uppercase tracking-tighter">v2.4.0 Stable</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans overflow-hidden">
      <ToastContainer position="top-right" theme="colored" />
      <div className="w-24 bg-slate-900 flex flex-col items-center py-10 gap-8 border-r border-slate-800 shrink-0">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-4"><ShoppingCart className="text-white w-6 h-6" /></div>
        <div className="flex flex-col gap-4 flex-1">
          <SidebarIcon icon={<LayoutGrid size={24} />} active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} label="Menu" />
          <SidebarIcon icon={<History size={24} />} active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="Orders" />
          {config.features.tables && (
            <SidebarIcon icon={<ClipboardList size={24} />} active={activeTab === 'tables'} onClick={() => setActiveTab('tables')} label="Tables" />
          )}
        </div>
        <button onClick={handleLogout} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white transition-all"><Settings size={24} /></button>
      </div>
      <div className="flex-1 flex flex-col h-screen relative bg-slate-50">
        <div className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{business?.name || 'SaSLoop Terminal'}</h2>
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
              {isOnline ? <Wifi className="w-4 h-4 text-emerald-500" /> : <WifiOff className="w-4 h-4 text-rose-500" />}
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isOnline ? 'Network Stable' : 'Offline Mode'}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search items..." className="bg-slate-100 border-none rounded-2xl pl-12 pr-6 py-3 text-sm font-bold text-slate-600 w-80 focus:ring-2 ring-indigo-500/20 transition-all outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'menu' ? (
            <>
              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
                  {catalog.filter(i => i.product_name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                    <ProductCard key={item.id} item={item} currency={config.currency} onAdd={() => setCart(prev => {
                      const ex = prev.find(i => i.id === item.id);
                      return ex ? prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i) : [...prev, {...item, quantity: 1}];
                    })} />
                  ))}
                </div>
              </div>
              <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shrink-0 h-full shadow-[-20px_0_40px_rgba(0,0,0,0.02)]">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Your Order</h3>
                  {selectedTable && (
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Table {selectedTable.table_name}</span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50">
                      <ShoppingCart size={48} className="mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest">Cart is Empty</p>
                    </div>
                  ) : cart.map(item => (
                    <CartItem key={item.id} item={item} currency={config.currency} onUpdate={(q) => q <= 0 ? setCart(prev => prev.filter(i => i.id !== item.id)) : setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: q} : i))} onRemove={() => setCart(prev => prev.filter(i => i.id !== item.id))} />
                  ))}
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100">
                   <div className="flex justify-between text-2xl font-black text-slate-900 mb-6 uppercase italic"><span>Total</span><span>{config.currency}{(cart.reduce((a,b) => a+(b.price*b.quantity), 0) * (1 + config.tax_rate/100)).toFixed(2)}</span></div>
                   <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => handleCheckout('CASH')} disabled={cart.length === 0} className="bg-white border-2 border-slate-200 py-4 rounded-2xl font-black uppercase text-xs disabled:opacity-50 hover:bg-slate-50 transition-colors">Cash</button>
                      <button onClick={() => handleCheckout('CARD')} disabled={cart.length === 0} className="bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg shadow-indigo-600/20 disabled:opacity-50 hover:bg-indigo-500 transition-colors">Card</button>
                   </div>
                </div>
              </div>
            </>
          ) : activeTab === 'history' ? (
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Recent Transactions</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Live sales data from this terminal</p>
                  </div>
                  <button onClick={fetchOrders} className="bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                    <History size={14} className={loadingOrders ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order ID</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Items</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-20 text-center text-slate-400 font-bold italic uppercase tracking-widest opacity-30">No orders found</td>
                        </tr>
                      ) : orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="p-8">
                            <span className="text-xs font-black text-slate-900">#{order.id.toString().slice(-6).toUpperCase()}</span>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">{new Date(order.created_at).toLocaleTimeString()}</p>
                          </td>
                          <td className="p-8 text-xs font-black text-slate-700">{order.customer_name || 'Guest'}</td>
                          <td className="p-8 text-xs font-bold text-slate-500">{JSON.parse(order.items || '[]').length} Items</td>
                          <td className="p-8 text-sm font-black text-slate-900">{config.currency}{parseFloat(order.total_price).toFixed(2)}</td>
                          <td className="p-8">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 
                              order.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-8 text-xs font-black text-slate-500 uppercase tracking-widest">{order.payment_method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'tables' ? (
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
               <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Floor Plan</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Live table availability & occupancy</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Available
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-lg text-rose-600 text-[10px] font-black uppercase tracking-widest">
                        <div className="w-2 h-2 bg-rose-500 rounded-full" />
                        Occupied
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                  {tables.map(table => (
                    <div 
                      key={table.id} 
                      onClick={() => {
                        setSelectedTable(table);
                        setActiveTab('menu');
                        toast.info(`Ordering for Table ${table.table_name}`);
                      }}
                      className={`aspect-square rounded-[2rem] border-2 transition-all cursor-pointer p-6 flex flex-col items-center justify-center gap-4 group relative overflow-hidden ${
                        selectedTable?.id === table.id ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-105' : 
                        table.status === 'OCCUPIED' ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 bg-white hover:border-indigo-200'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        table.status === 'OCCUPIED' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                      } transition-all`}>
                        <LayoutGrid size={32} />
                      </div>
                      <div className="text-center">
                        <h4 className="text-sm font-black text-slate-900 uppercase">T-{table.table_name}</h4>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${
                          table.status === 'OCCUPIED' ? 'text-rose-500' : 'text-slate-400'
                        }`}>{table.status}</p>
                      </div>
                      {selectedTable?.id === table.id && (
                        <div className="absolute top-4 right-4 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <CheckCircle size={14} />
                        </div>
                      )}
                    </div>
                  ))}
                  {tables.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-30 italic font-bold uppercase tracking-widest text-slate-500">No tables configured</div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const SidebarIcon = ({ icon, active, onClick, label }) => (
  <div className="flex flex-col items-center gap-1">
    <button onClick={onClick} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative group ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>{icon}</button>
    <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-indigo-400' : 'text-slate-600'}`}>{label}</span>
  </div>
);

const ProductCard = ({ item, currency, onAdd }) => (
  <div onClick={onAdd} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group active:scale-95">
    <div className="w-full aspect-square bg-slate-50 rounded-[1.5rem] mb-6 flex items-center justify-center overflow-hidden">
      {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all" /> : <Package className="w-10 h-10 text-slate-200" />}
    </div>
    <h4 className="text-md font-black text-slate-900 tracking-tight leading-tight mb-2 uppercase">{item.product_name}</h4>
    <div className="flex justify-between items-center"><span className="text-xl font-black text-slate-900 tracking-tighter">{currency}{parseFloat(item.price).toFixed(2)}</span><div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white"><Plus size={16} /></div></div>
  </div>
);

const CartItem = ({ item, currency, onUpdate, onRemove }) => (
  <div className="flex gap-4">
    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">{item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-slate-300" />}</div>
    <div className="flex-1">
      <div className="flex justify-between mb-1"><h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.product_name}</h4><button onClick={onRemove} className="text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button></div>
      <div className="flex items-center justify-between"><div className="flex items-center bg-slate-100 rounded-lg"><button onClick={() => onUpdate(item.quantity - 1)} className="w-6 h-6 flex items-center justify-center">-</button><span className="w-6 text-center text-xs font-black">{item.quantity}</span><button onClick={() => onUpdate(item.quantity + 1)} className="w-6 h-6 flex items-center justify-center">+</button></div><span className="text-xs font-black text-slate-900">{currency}{(item.price * item.quantity).toFixed(2)}</span></div>
    </div>
  </div>
);

export default UniversalPOS;
