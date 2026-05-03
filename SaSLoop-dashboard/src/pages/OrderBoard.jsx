import { useState, useEffect, useCallback, useRef } from "react";
import API_BASE, { isMobileDevice } from "../config";
import { Truck, CheckCircle2, Clock, MapPin, ChevronRight, AlertCircle, RefreshCw, Bell, BellOff, XCircle } from "lucide-react";

// ── Web Audio API notification chime ────────
let audioCtx = null;

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playChime() {
  try {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    [523.25, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.35, now + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.18);
      osc.stop(now + i * 0.18 + 0.5);
    });
  } catch (e) {
    console.error("Audio chime error", e);
  }
}

function OrderBoard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("orderBoardSound") === "true");
  const [mobileTab, setMobileTab] = useState("Incoming");
  const [newOrderFlash, setNewOrderFlash] = useState(false);
  const [riders, setRiders] = useState([]);
  const isMobile = isMobileDevice();

  const prevCountRef = useRef(-1);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  const playNotification = useCallback(() => {
    if (!soundRef.current) return;
    playChime();
    setNewOrderFlash(true);
    setTimeout(() => setNewOrderFlash(false), 2000);
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
      const resp = await fetch(`${API_BASE}/api/orders${targetParam}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        const incomingCount = data.filter(o => ["CONFIRMED", "PENDING", "pending"].includes(o.status)).length;
        if (prevCountRef.current !== -1 && incomingCount > prevCountRef.current) {
           playNotification();
        }
        prevCountRef.current = incomingCount;
        setOrders(data);
      }
    } catch (err) {
      console.error("Order Fetch Fail:", err);
    } finally {
      setLoading(false);
    }
  }, [playNotification]);

  useEffect(() => {
    fetchOrders();
    fetchRiders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders, fetchRiders]);

  const fetchRiders = useCallback(async () => {
    try {
        const token = localStorage.getItem("token");
        const targetId = sessionStorage.getItem("impersonate_id");
        const res = await fetch(`${API_BASE}/api/delivery/partners${targetId ? `?target_user_id=${targetId}` : ""}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setRiders(data);
    } catch (err) { console.error(err); }
  }, []);

  const assignRider = async (orderId, riderId) => {
    try {
      const resp = await fetch(`${API_BASE}/api/delivery/assign`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ orderId, riderId })
      });
      if (resp.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'DISPATCHED', rider_id: riderId } : o));
      }
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (orderId, newStatus) => {
    if (newStatus === 'CANCELLED' && !window.confirm("Are you sure you want to REJECT this order? This will notify the customer.")) return;
    try {
      const resp = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (resp.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error("Status Update Fail:", err);
    }
  };

  const togglePaymentStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
    try {
      const resp = await fetch(`${API_BASE}/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ payment_status: newStatus })
      });
      if (resp.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: newStatus } : o));
      }
    } catch (err) {
      console.error("Payment Update Fail:", err);
    }
  };

  const columns = [
    { title: "Incoming", status: ["CONFIRMED", "PENDING", "pending", "AWAITING_PAYMENT", "awaiting_payment"], icon: AlertCircle, color: "rose" },
    { title: "Processing", status: ["PROCESSING", "PREPARING", "preparing"], icon: Clock, color: "amber" },
    { title: "Dispatched", status: ["DISPATCHED", "SHIPPED", "out_for_delivery"], icon: Truck, color: "indigo" },
    { title: "Completed", status: ["COMPLETED", "delivered"], icon: CheckCircle2, color: "emerald" },
    { title: "Cancelled", status: ["CANCELLED", "rejected"], icon: XCircle, color: "slate" }
  ];

  const getPrice = (p) => parseFloat(p || 0).toFixed(2);

  const OrderCard = ({ order, col }) => (
    <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className={`absolute top-0 left-0 w-1.5 h-full bg-${col.color}-500`}></div>
      <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{order.order_reference || `#${order.id.toString().padStart(4, '0')}`}</p>
            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm leading-none truncate max-w-[120px]">{order.customer_name || 'Guest User'}</h4>
            {order.customer_number && <p className="text-[8px] font-bold text-indigo-400 mt-0.5 whitespace-nowrap">📞 {order.customer_number}</p>}
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-900 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg whitespace-nowrap block mb-1">₹{getPrice(order.total_price)}</span>
            <p className="text-[7px] text-slate-400 font-bold uppercase">{new Date(order.created_at).toLocaleDateString([], { day: '2-digit', month: 'short' })} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${order.payment_method === 'UPI' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
              {order.payment_method || 'CASH'}
           </span>
        </div>
        <button 
          onClick={() => togglePaymentStatus(order.id, order.payment_status)}
          className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md transition-all ${order.payment_status === 'PAID' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100'}`}
        >
          {order.payment_status === 'PAID' ? '✓ Paid' : 'Unpaid'}
        </button>
      </div>
      <div className="space-y-1 mb-2 bg-slate-50/50 p-2 rounded-xl">
          {(() => {
            try {
                const itemsArray = typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || []);
                return (Array.isArray(itemsArray) ? itemsArray : []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] text-slate-600">
                      <span className="truncate pr-2 font-bold">{item.name}</span>
                      <span className="shrink-0 font-black bg-white border border-slate-100 px-1.5 py-0 rounded-md text-[8px]">x{item.qty}</span>
                  </div>
                ));
            } catch (e) { return <div className="text-[8px] text-rose-500 font-bold italic">Items error</div>; }
          })()}
      </div>
      <div className="flex items-center gap-2 text-slate-500 text-[8px] font-bold mb-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 truncate max-w-[150px]"><MapPin className="w-3 h-3 text-rose-400" /> {order.address || 'Pick Up'}</div>
          {order.table_number && <div className="ml-auto bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md whitespace-nowrap">Table {order.table_number}</div>}
      </div>
      <div className="flex gap-1.5">
          {col.title === "Incoming" && (
            <div className="flex gap-1.5 w-full">
              <button onClick={() => updateStatus(order.id, 'PROCESSING')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black py-2.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-200">
                  Accept <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="flex-1 bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 text-[9px] font-black py-2.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all">
                  Reject <XCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {col.title === "Processing" && (
            <div className="w-full space-y-2">
              {!order.table_number && order.address !== 'Pickup' && (
                <select 
                  onChange={(e) => assignRider(order.id, e.target.value)}
                  className="w-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black py-2 rounded-xl uppercase tracking-widest outline-none px-2"
                  defaultValue=""
                >
                  <option value="" disabled>Assign Rider</option>
                  {riders.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              )}
              <div className="flex gap-2">
                <button onClick={() => updateStatus(order.id, 'DISPATCHED')} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-[9px] font-black py-2.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-200">
                    {order.table_number ? 'Mark Ready' : (order.address === 'Pickup' ? 'Order Prepared' : 'Dispatch Now')} <Truck className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="p-2.5 bg-rose-50 text-rose-500 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all" title="Cancel Order">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {col.title === "Dispatched" && (
            <div className="flex gap-2 w-full">
                <button onClick={() => updateStatus(order.id, 'COMPLETED')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black py-2.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-200">
                    {order.table_number ? 'Served Successfully' : 'Deliver Case'} <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="p-2.5 bg-rose-50 text-rose-500 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all" title="Cancel Order">
                  <XCircle className="w-4 h-4" />
                </button>
            </div>
          )}
          {col.title === "Completed" && (
            <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="w-full bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 text-[9px] font-black py-2.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all">
                Mark as Cancelled <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {col.title === "Cancelled" && (
             <div className="w-full text-center py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">Rejected / Cancelled</div>
          )}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-[#f8fafc] ${isMobile ? 'p-4' : 'p-6'} space-y-4 overflow-hidden font-sans`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black text-slate-800 tracking-tight flex items-center gap-3`}>
            Order Board <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          </h2>
          {!isMobile && <p className="text-slate-500 font-medium text-sm mt-1">Real-time store operations command center.</p>}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
           <button onClick={() => { ensureAudioContext(); const newVal = !soundEnabled; setSoundEnabled(newVal); localStorage.setItem("orderBoardSound", newVal); if (newVal) playChime(); }} className={`flex items-center gap-2 ${isMobile ? 'px-3 py-2' : 'px-4 py-2.5'} rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${soundEnabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
              {soundEnabled ? <Bell className={`w-3 h-3 ${newOrderFlash ? 'animate-bounce' : ''}`} /> : <BellOff className="w-3 h-3" />}
              {soundEnabled ? 'Chime Active' : 'Board Muted'}
           </button>
           <button onClick={fetchOrders} className={`bg-white border border-slate-200 ${isMobile ? 'px-3 py-2' : 'px-4 py-2.5'} rounded-2xl flex items-center gap-2 shadow-sm text-[9px] font-black uppercase tracking-widest ${loading ? 'text-indigo-500' : 'text-slate-500'}`}>
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              {isMobile ? 'Sync' : 'Refresh Now'}
           </button>
        </div>
      </div>
      {isMobile && (
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] flex-shrink-0 overflow-x-auto no-scrollbar">
          {columns.map(col => (
            <button key={col.title} onClick={() => setMobileTab(col.title)} className={`flex-1 flex flex-col items-center py-2 px-3 rounded-2xl transition-all relative ${mobileTab === col.title ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-500'}`}>
              <div className={`p-1.5 rounded-lg mb-0.5 ${mobileTab === col.title ? `bg-${col.color}-50 text-${col.color}-500` : 'bg-slate-200/50'}`}><col.icon className="w-3.5 h-3.5" /></div>
              <span className="text-[8px] font-black uppercase tracking-tighter">{col.title}</span>
              {orders.filter(o => col.status.includes(o.status)).length > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">{orders.filter(o => col.status.includes(o.status)).length}</span>}
            </button>
          ))}
        </div>
      )}
      {loading && orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-pulse">
           <RefreshCw className="w-12 h-12 animate-spin mb-4 opacity-10" />
           <p className="font-black tracking-widest uppercase text-xs opacity-20">Refreshing Live Board...</p>
        </div>
      ) : (
        <div className={`flex-1 min-h-0 ${isMobile ? 'overflow-y-auto pb-20' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 overflow-y-hidden'}`}>
           {isMobile ? (
            <div className="space-y-4">
              {(() => {
                const activeCol = columns.find(c => c.title === mobileTab);
                const filtered = orders.filter(o => activeCol.status.includes(o.status));
                if (filtered.length === 0) return <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] opacity-30 italic text-[10px] uppercase font-black tracking-widest">No Active {mobileTab}</div>;
                return filtered.map(order => <OrderCard key={order.id} order={order} col={activeCol} />);
              })()}
            </div>
          ) : (
            columns.map((col) => (
              <div key={col.title} className="flex flex-col min-w-[240px] bg-slate-100/30 rounded-[2.5rem] border border-slate-200/60 overflow-hidden">
                <div className={`p-4 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${col.color}-50 text-${col.color}-500 rounded-xl`}><col.icon className="w-4 h-4" /></div>
                      <h3 className="font-black text-slate-800 text-xs tracking-tight uppercase">{col.title}</h3>
                    </div>
                    <span className="bg-slate-200 text-slate-600 text-[9px] font-black px-2.5 py-1 rounded-full">{orders.filter(o => col.status.includes(o.status)).length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
                    {orders.filter(o => col.status.includes(o.status)).length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] opacity-10 italic text-[8px] uppercase font-black">Empty</div>
                    ) : (
                      orders.filter(o => col.status.includes(o.status)).map(order => <OrderCard key={order.id} order={order} col={col} />)
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default OrderBoard;
