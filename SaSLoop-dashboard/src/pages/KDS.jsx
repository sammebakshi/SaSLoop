import { useState, useEffect, useCallback } from "react";
import API_BASE from "../config";
import { ChefHat } from "lucide-react";

function KDS() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/api/orders`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setOrders(data.filter(o => !["COMPLETED", "CANCELLED", "delivered", "rejected"].includes(o.status)));
      }
    } catch (err) {} finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const resp = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (resp.ok) setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {}
  };

  const columns = [
    { title: "New Tickets", status: ["CONFIRMED", "PENDING", "pending"], nextStatus: "PROCESSING", nextLabel: "Start Cooking", bg: "bg-rose-500", hover: "hover:bg-rose-400", border: "border-rose-500" },
    { title: "Cooking Now", status: ["PROCESSING", "PREPARING", "preparing"], nextStatus: "DISPATCHED", nextLabel: "Mark Ready", bg: "bg-amber-500", hover: "hover:bg-amber-400", border: "border-amber-500" },
    { title: "Ready for Pickup", status: ["DISPATCHED", "SHIPPED", "out_for_delivery"], nextStatus: "COMPLETED", nextLabel: "Clear Order", bg: "bg-emerald-500", hover: "hover:bg-emerald-400", border: "border-emerald-500" }
  ];

  const getItems = (itemsStr) => {
    try { return JSON.parse(itemsStr || '[]'); } catch { return []; }
  };

  return (
    <div className="flex flex-col bg-slate-900 text-white rounded-[2rem] overflow-hidden p-6 min-h-[calc(100vh-6rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black flex items-center gap-3 tracking-tight"><ChefHat className="text-amber-400 w-10 h-10"/> Kitchen Display System</h1>
        <div className="flex gap-4 items-center">
            {loading && <span className="animate-pulse text-amber-400 font-bold tracking-widest text-sm uppercase">Syncing...</span>}
            <div className="bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest border border-slate-700">Live Board</div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {columns.map(col => (
          <div key={col.title} className="flex flex-col bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
             <div className={`${col.bg} text-white py-4 px-6 font-black flex justify-between items-center text-lg uppercase tracking-widest shadow-md`}>
                <span>{col.title}</span>
                <span className="bg-black/20 px-3 py-1 rounded-lg">{orders.filter(o => col.status.includes(o.status)).length}</span>
             </div>
             <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                {orders.filter(o => col.status.includes(o.status)).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 font-black uppercase tracking-widest opacity-50">Empty</div>
                ) : (
                    orders.filter(o => col.status.includes(o.status)).map(order => (
                      <div key={order.id} className={`bg-slate-700/50 rounded-2xl p-5 shadow-inner border-l-4 ${col.border}`}>
                         <div className="flex justify-between items-start mb-4 border-b border-slate-600/50 pb-3">
                            <div>
                               <div className="text-xs font-bold text-slate-400 tracking-widest">{order.order_reference}</div>
                               <div className="text-xl font-black text-slate-100 mt-1">{order.customer_name}</div>
                            </div>
                            <div className="text-right">
                               <div className="bg-slate-900/50 border border-slate-600 px-3 py-1.5 rounded-xl text-xs font-bold uppercase text-amber-400">{order.table_number ? `Table ${order.table_number}` : 'Delivery/Pickup'}</div>
                            </div>
                         </div>
                         <div className="space-y-3 mb-6">
                            {getItems(order.items).map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center text-lg bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                                  <span className="font-bold text-slate-200">{item.name}</span>
                                  <span className="font-black bg-slate-900 px-3 py-1 rounded-lg text-emerald-400 border border-slate-700">x{item.qty}</span>
                               </div>
                            ))}
                         </div>
                         <button onClick={() => updateStatus(order.id, col.nextStatus)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-[0.98] ${col.bg} ${col.hover} text-white shadow-lg`}>
                            {col.nextLabel}
                         </button>
                      </div>
                    ))
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KDS;
