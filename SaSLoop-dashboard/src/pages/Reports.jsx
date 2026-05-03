import React, { useState, useEffect } from "react";
import API_BASE from "../config";
import { 
  BarChart3, Search, 
  TrendingUp,
  Clock, CheckCircle2, XCircle, ShoppingBag, Printer
} from "lucide-react";

function Reports() {
  const [orders, setOrders] = useState([]);
  const [, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bizData, setBizData] = useState(null);

  const fetchOrders = async () => {
    try {
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
      const token = localStorage.getItem("token");

      const resp = await fetch(`${API_BASE}/api/orders${targetParam}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setOrders(data);
      }

      const bizResp = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (bizResp.ok) {
         const bData = await bizResp.json();
         setBizData(bData.business);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'COMPLETED' || o.status === 'delivered').length,
    pending: orders.filter(o => ['PENDING', 'pending', 'CONFIRMED', 'PROCESSING', 'PREPARING'].includes(o.status)).length,
    totalSales: orders.filter(o => o.status === 'COMPLETED' || o.status === 'delivered').reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0)
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === "ALL" || 
                         (filter === "NEW" && ['PENDING','pending','CONFIRMED','PROCESSING'].includes(o.status)) || 
                         o.status === filter;
    const matchesSearch = o.customer_name?.toLowerCase().includes(search.toLowerCase()) || 
                         o.order_reference?.toLowerCase().includes(search.toLowerCase()) ||
                         o.customer_number?.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getPrice = (p) => parseFloat(p || 0).toFixed(2);

  const handleBillPrint = (order) => {
    const win = window.open("", "_blank");
    let items = order.items;
    if (typeof items === 'string') items = JSON.parse(items);
    const currency = '₹';
    
    win.document.write(`
      <html>
        <head><style>body { font-family: 'Courier New', Courier, monospace; width: 80mm; padding: 5mm; } .center { text-align: center; } .bold { font-weight: bold; } .row { display: flex; justify-content: space-between; margin-top: 2mm; }</style></head>
        <body onload="window.print(); window.close();">
          <div class="center bold" style="font-size: 1.2em;">${bizData?.name || 'SaSLoop Store'}</div>
          <div class="center" style="font-size: 0.8em;">${bizData?.address || ''}</div>
          <hr/>
          <div class="row"><span>Order: ${order.order_reference}</span><span>${new Date(order.created_at).toLocaleDateString()}</span></div>
          <div class="row bold"><span>Customer</span><span>${order.customer_name}</span></div>
          <hr/>
          <table style="width:100%; font-size: 0.9em;">
            ${items.map(i => `<tr><td>${i.name} x${i.qty}</td><td style="text-align:right;">${currency}${getPrice(i.price * i.qty)}</td></tr>`).join('')}
          </table>
          <hr/>
          <div class="row bold" style="font-size: 1.1em;"><span>Total</span><span>${currency}${getPrice(order.total_price)}</span></div>
          <hr/>
          <div class="center" style="font-size: 0.7em; margin-top: 10px;">Thank you for ordering with us!</div>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="p-6 space-y-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-500" /> History & Reports
           </h2>
           <p className="text-slate-500 font-medium text-sm mt-1">Audit and analyze your store sales performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Total Revenue", val: `₹${getPrice(stats.totalSales)}`, icon: TrendingUp, color: "emerald" },
           { label: "Total Orders", val: stats.total, icon: ShoppingBag, color: "indigo" },
           { label: "Pending", val: stats.pending, icon: Clock, color: "amber" },
           { label: "Completed", val: stats.completed, icon: CheckCircle2, color: "emerald" }
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-500 rounded-2xl flex items-center justify-center mb-4`}><s.icon className="w-6 h-6" /></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{s.val}</h3>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96 group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
               <input placeholder="Search orders, names, phone..." className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-4 py-4 text-xs font-bold outline-none focus:bg-white focus:border-indigo-100 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
               {["ALL", "NEW", "PROCESSING", "COMPLETED", "CANCELLED"].map(t => (
                 <button key={t} onClick={() => setFilter(t)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === t ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}>
                    {t}
                 </button>
               ))}
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredOrders.map(o => (
                    <tr key={o.id} onClick={() => setSelectedOrder(o)} className="hover:bg-slate-50 transition-all group cursor-pointer active:scale-[0.99]">
                       <td className="px-10 py-6"><span className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase">{o.order_reference || `#${o.id}`}</span></td>
                       <td className="px-8 py-6">
                          <h4 className="font-black text-slate-900 text-sm italic uppercase">{o.customer_name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">📞 {o.customer_number}</p>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-[11px] font-black text-slate-700 mb-1">{new Date(o.created_at).toLocaleDateString()}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase">{new Date(o.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                       </td>
                       <td className="px-8 py-6 font-black text-slate-900 text-base">₹{getPrice(o.total_price)}</td>
                       <td className="px-8 py-6">
                          <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${
                             o.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                             ['PENDING', 'pending', 'CONFIRMED', 'PROCESSING'].includes(o.status) ? 'bg-amber-100 text-amber-600' :
                             o.status === 'CANCELLED' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                             {o.status}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {selectedOrder && (
          <div className="fixed inset-0 z-[500] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                  <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
                      <div><h3 className="text-3xl font-black italic uppercase tracking-tighter">{selectedOrder.order_reference}</h3><p className="text-[10px] font-black uppercase opacity-40">Payment Status: Success</p></div>
                      <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><XCircle className="w-6 h-6" /></button>
                  </div>
                  <div className="p-10 space-y-8">
                      <div className="grid grid-cols-2 gap-4 border-b-2 border-dashed border-slate-100 pb-8">
                          <div><p className="text-[9px] font-black text-slate-300 uppercase">Customer</p><p className="text-sm font-black text-slate-800">{selectedOrder.customer_name}</p></div>
                          <div><p className="text-[9px] font-black text-slate-300 uppercase">Phone</p><p className="text-sm font-black text-slate-800">{selectedOrder.customer_number}</p></div>
                          <div className="col-span-2"><p className="text-[9px] font-black text-slate-300 uppercase">Address / Table</p><p className="text-sm font-black text-slate-800">{selectedOrder.address}</p></div>
                      </div>
                      <div className="max-h-60 overflow-y-auto pr-2 no-scrollbar">
                          {JSON.parse(selectedOrder.items || '[]').map((it, idx) => (
                             <div key={idx} className="flex justify-between py-3 border-b border-slate-50"><span className="text-xs font-black text-slate-600 uppercase">{it.qty}x {it.name}</span><span className="text-xs font-black text-slate-950">₹{getPrice(it.price * it.qty)}</span></div>
                          ))}
                      </div>
                      <div className="flex justify-between items-center pt-8 border-t-2 border-slate-50"><div className="text-3xl font-black text-slate-950 tracking-tighter">₹{getPrice(selectedOrder.total_price)}</div><button onClick={() => handleBillPrint(selectedOrder)} className="bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Printer className="w-4 h-4" /> Print Copy</button></div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default Reports;
