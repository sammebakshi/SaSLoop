import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE, { isMobileDevice } from "../config";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { 
  TrendingUp, Users, ShoppingBag, CreditCard, ArrowUpRight, ArrowDownRight, Package, Clock, Activity, Megaphone, BellRing, Check,
  Mic, MicOff, Brain, Sparkles, X
} from "lucide-react";

function Dashboard() {
  const [business, setBusiness] = useState(null);
  const [orders, setOrders] = useState([]);
  const [waiterRequests, setWaiterRequests] = useState([]);
  const [credits, setCredits] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [lastWaiterCount, setLastWaiterCount] = useState(0);
  const isMobile = isMobileDevice();

  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceIntel, setVoiceIntel] = useState(null);

  const playNotification = (type) => {
    if (type === 'order') {
       setNewOrderAlert(true);
       setTimeout(() => setNewOrderAlert(false), 8000);
    }
    try {
      const audio = new Audio(type === 'order' ? 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3' : 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
      audio.play().catch(e => console.warn("Audio blocked by browser"));
    } catch (e) {}
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }

    const fetchData = async () => {
      try {
        const impersonateId = sessionStorage.getItem("impersonate_id");
        const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
        const statusRes = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const statusData = await statusRes.json();
        if (statusData.hasBusiness === false) {
           if (!impersonateId) window.location.href = "/setup-business";
           return;
        }
        setBusiness(statusData.business);
        const ordersRes = await fetch(`${API_BASE}/api/orders${targetParam}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const ordersData = await ordersRes.json();
        const ordersList = Array.isArray(ordersData) ? ordersData : [];
        
        // 🔔 Sound trigger for new orders
        setOrders(prev => {
           if (prev.length > 0 && ordersList.length > prev.length) playNotification('order');
           return ordersList;
        });

        const adminUser = JSON.parse(localStorage.getItem("user") || "{}");
        setCredits(impersonateId ? 0 : (adminUser.broadcast_credits || 0));

        // Fetch Waiter Requests
        const waiterRes = await fetch(`${API_BASE}/api/business/waiter-requests${targetParam}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const waiterData = await waiterRes.json();
        const waitersList = Array.isArray(waiterData) ? waiterData : [];

        // 🔔 Sound trigger for waiter calls
        setWaiterRequests(prev => {
           if (prev.length > 0 && waitersList.length > prev.length) playNotification('waiter');
           return waitersList;
        });

        // Fetch AI Suggestions
        const suggestRes = await fetch(`${API_BASE}/api/analytics/suggestions${targetParam}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const suggestData = await suggestRes.json();
        if (suggestData.suggestions) setSuggestions(suggestData.suggestions);

      } catch (err) {

        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const itv = setInterval(fetchData, 3000); // ⚡ High-speed sync
    return () => clearInterval(itv);
  }, []);

  const handleVoiceCommand = () => {
    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        processCommand(transcript);
      };
      recognition.start();
    }
  };

  const processCommand = (cmd) => {
    if (cmd.includes("revenue")) setVoiceIntel("Today's revenue is ₹45,200. Up 12% from yesterday.");
    else if (cmd.includes("orders")) setVoiceIntel(`There are ${orders.length} active orders in the kitchen.`);
    else if (cmd.includes("waiter")) setVoiceIntel(`There are ${waiterRequests.length} customers calling for a waiter.`);
    else setVoiceIntel("I didn't quite catch that. Try asking about revenue or orders.");
    
    setTimeout(() => setVoiceIntel(null), 6000);
  };

  const resolveWaiter = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/api/business/waiter-requests/resolve`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: requestId })
      });
      setWaiterRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      console.error("Resolve error:", err);
    }
  };

  const analytics = useMemo(() => {
    if (!Array.isArray(orders)) return { totalRevenue: 0, avgOrder: 0, chartData: [] };
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const avgOrder = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0;
    const grouped = {};
    orders.forEach(o => {
      const date = new Date(o.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      grouped[date] = (grouped[date] || 0) + parseFloat(o.total_price || 0);
    });
    const chartData = Object.keys(grouped).map(date => ({ date, sales: grouped[date] })).reverse().slice(-7);
    return { totalRevenue, avgOrder, chartData };
  }, [orders]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-white">
       <Activity className="w-10 h-10 text-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-white ${isMobile ? 'p-4 space-y-4' : 'p-6 space-y-8'} overflow-y-auto no-scrollbar`}>
      
      {/* GREETING */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black text-slate-800 tracking-tight`}>{business?.name || 'Business Intel'}</h2>
          {!isMobile && <p className="text-slate-500 font-medium text-sm mt-1">Real-time performance metrics.</p>}
        </div>
        {newOrderAlert && (
           <div className="bg-emerald-500 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-bounce shadow-lg shadow-emerald-200">
              New Order Received! 🔔
           </div>
        )}
        {!isMobile && (
          <div className="flex items-center gap-4">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-slate-400">
               Refreshed: {new Date().toLocaleTimeString()}
            </div>
            <button 
              onClick={() => window.location.href = '/intelligence'}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" /> Executive Brain
            </button>
          </div>
        )}
      </div>

      {/* AI PREMIUM TIP */}
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
         <div className="w-16 h-16 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
         </div>
         <div className="flex-1 space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">AI Intelligence Pulse</h4>
            <p className="text-sm font-bold text-slate-200 leading-relaxed max-w-2xl">
               "Revenue is up 12% this week! <strong className="text-white">Pro Tip:</strong> Your 'Latte' sales peak between 8 AM and 10 AM. Automate a WhatsApp discount for early birds to boost morning traffic."
            </p>
         </div>
         <button 
           onClick={() => window.location.href = '/intelligence'}
           className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-50 transition-all flex items-center gap-2 whitespace-nowrap"
         >
            Consult Brain <ArrowUpRight className="w-4 h-4" />
         </button>
      </div>

      {/* STATS GRID */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-3 md:gap-6`}>
        {[
          { label: 'Revenue', val: `₹${analytics.totalRevenue.toLocaleString()}`, trend: '+12%', icon: CreditCard, color: 'emerald' },
          { label: 'Orders', val: orders.length, trend: '+4%', icon: ShoppingBag, color: 'blue' },
          { label: 'Avg Sale', val: `₹${analytics.avgOrder}`, trend: '-1%', icon: TrendingUp, color: 'indigo' },
          { label: 'Wallet', val: credits, trend: 'Credits', icon: Megaphone, color: 'amber' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white border border-slate-100 ${isMobile ? 'p-3' : 'p-6'} rounded-3xl shadow-sm group`}>
             <div className="flex justify-between items-start mb-2">
                <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-500 rounded-xl`}>
                   <stat.icon className={`${isMobile ? 'w-3.5 h-3.5' : 'w-5 h-5'}`} />
                </div>
                {!isMobile && (
                  <div className={`flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {stat.trend}
                  </div>
                )}
             </div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
             <h3 className={`${isMobile ? 'text-lg' : 'text-3xl'} font-black text-slate-800 tracking-tighter mt-0.5`}>{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 🧠 AI MARKETING BRAIN */}
      {suggestions.length > 0 && (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-2 mb-4">
               <Sparkles className="w-5 h-5 text-indigo-500" />
               <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Smart Growth Suggestions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {suggestions.map((s, i) => (
                  <div key={i} className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-[2rem] shadow-xl shadow-indigo-100 flex flex-col justify-between relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700" />
                     <div className="relative z-10">
                        <h4 className="text-white font-black text-lg mb-2 tracking-tight">{s.title}</h4>
                        <p className="text-indigo-100 text-xs font-bold leading-relaxed mb-6">{s.desc}</p>
                     </div>
                     <button className="relative z-10 w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg">
                        {s.action}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      )}

      <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3 gap-8'} gap-4 pb-10`}>

        
        {/* REVENUE CHART */}
        <div className={`lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] ${isMobile ? 'p-4' : 'p-8'} shadow-sm`}>
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Sales Velocity</h3>
           </div>
           <div className={`${isMobile ? 'h-[180px]' : 'h-[300px]'} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={analytics.chartData}>
                    <defs>
                       <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 700, fill: '#cbd5e1'}} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 700, fill: '#cbd5e1'}} />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={isMobile ? 2 : 4} fillOpacity={1} fill="url(#colorSales)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* RECENT ORDERS MINI TABLE */}
        <div className={`bg-white border border-slate-100 rounded-[2rem] ${isMobile ? 'p-4' : 'p-8'} shadow-sm flex flex-col`}>
           <h3 className="text-sm font-black text-slate-800 tracking-tight mb-4 uppercase">Recent Arrivals</h3>
           <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 border border-transparent rounded-2xl active:bg-slate-100 transition-all cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-slate-800">
                         <Package className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                         <p className="text-[11px] font-black text-slate-800 tracking-tight truncate">{order.customer_name || 'Guest'}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[11px] font-black text-emerald-600">₹{Math.floor(order.total_price)}</p>
                   </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="py-10 flex flex-col items-center justify-center text-slate-300 opacity-50">
                   <ShoppingBag className="w-8 h-8 mb-2" />
                   <p className="text-[9px] font-black uppercase">Empty</p>
                </div>
              )}
           </div>
        </div>

        {/* WAITER REQUESTS MINI TABLE */}
        <div className={`bg-white border-2 border-amber-100 rounded-[2rem] ${isMobile ? 'p-4' : 'p-8'} shadow-xl shadow-amber-50/50 flex flex-col`}>
           <div className="flex items-center gap-2 mb-4">
              <BellRing className="w-5 h-5 text-amber-500 animate-bounce" />
              <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Waiter Calls</h3>
              {waiterRequests.length > 0 && <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{waiterRequests.length}</span>}
           </div>
           <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
              {waiterRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                   <div className="min-w-0">
                      <p className="text-[12px] font-black text-slate-900 tracking-tight">Table {req.table_number}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                   </div>
                   <button 
                    onClick={() => resolveWaiter(req.id)}
                    className="w-10 h-10 bg-white border border-amber-200 rounded-xl flex items-center justify-center text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                   >
                      <Check className="w-5 h-5" />
                   </button>
                </div>
              ))}
              {waiterRequests.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-300 opacity-50">
                   <Clock className="w-8 h-8 mb-2" />
                   <p className="text-[9px] font-black uppercase tracking-widest">Quiet Zone</p>
                </div>
              )}
           </div>
        </div>

      </div>

      {/* 🎙️ AI VOICE ASSISTANT */}
      <div className="fixed bottom-10 right-10 z-[500] flex flex-col items-end gap-4">
         <AnimatePresence>
            {voiceIntel && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 max-w-xs mb-4"
              >
                 <div className="flex items-center gap-2 mb-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                    <Brain className="w-4 h-4" /> Executive Intel
                 </div>
                 <p className="text-sm font-bold leading-relaxed tracking-tight italic">"{voiceIntel}"</p>
              </motion.div>
            )}
         </AnimatePresence>
         
         <button 
           onClick={handleVoiceCommand}
           className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-slate-900 hover:bg-black'}`}
         >
            {isListening ? <Mic className="w-8 h-8 text-white" /> : <Brain className="w-8 h-8 text-indigo-400" />}
         </button>
      </div>

    </div>
  );
}

export default Dashboard;
