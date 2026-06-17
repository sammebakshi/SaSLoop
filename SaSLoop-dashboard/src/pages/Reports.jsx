import React, { useState, useEffect } from "react";
import API_BASE from "../config";
import { 
  Clock, CheckCircle2, XCircle, ShoppingBag, Printer,
  Users, ShieldAlert, DollarSign, Award, ChevronRight,
  BarChart3, TrendingUp, Percent, Search
} from "lucide-react";

function Reports() {
  const [staff, setStaff] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bizData, setBizData] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("HISTORY");

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

      const staffResp = await fetch(`${API_BASE}/api/business/staff`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (staffResp.ok) {
        const sData = await staffResp.json();
        setStaff(sData);
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
    totalSales: orders.filter(o => o.status === 'COMPLETED' || o.status === 'delivered').reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0),
    leakage: orders.filter(o => ['CANCELLED', 'cancelled', 'returned'].includes(o.status)).reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0),
    discounts: orders.reduce((acc, o) => acc + parseFloat(o.discount_amount || 0), 0)
  };

  const staffSales = staff.map(s => {
    const sOrders = orders.filter(o => o.user_id === s.id && (o.status === 'COMPLETED' || o.status === 'delivered'));
    const total = sOrders.reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0);
    
    // Calculate best selling items for this staff
    const itemsMap = {};
    sOrders.forEach(o => {
      try {
        const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
        items.forEach(it => {
          itemsMap[it.name] = (itemsMap[it.name] || 0) + it.qty;
        });
      } catch (e) {}
    });
    const topItems = Object.keys(itemsMap).map(name => ({ name, qty: itemsMap[name] })).sort((a,b) => b.qty - a.qty).slice(0, 3);

    return { name: s.name, total, count: sOrders.length, role: s.role, topItems };
  }).sort((a, b) => b.total - a.total);

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 italic uppercase">
              <BarChart3 className="w-8 h-8 text-indigo-500" /> Revenue Hub
           </h2>
           <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest opacity-60">Audit and analyze your store sales performance.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-[2rem] w-full md:w-auto shadow-inner">
           {[
             { id: 'HISTORY', label: 'History', icon: Clock },
             { id: 'STAFF', label: 'Staff Sales', icon: Users },
             { id: 'LEAKAGE', label: 'Leakage Audit', icon: ShieldAlert }
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id)} 
               className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <tab.icon className="w-4 h-4" /> {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Gross Sales", val: `₹${getPrice(stats.totalSales + stats.discounts)}`, icon: DollarSign, color: "indigo" },
           { label: "Net Revenue", val: `₹${getPrice(stats.totalSales)}`, icon: TrendingUp, color: "emerald" },
           { label: "Revenue Leakage", val: `₹${getPrice(stats.leakage)}`, icon: ShieldAlert, color: "rose" },
           { label: "Total Discount", val: `₹${getPrice(stats.discounts)}`, icon: Percent, color: "amber" }
         ].map((s, i) => (
           <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className={`w-14 h-14 bg-${s.color}-50 text-${s.color}-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}><s.icon className="w-7 h-7" /></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{s.label}</p>
              <h3 className={`text-3xl font-black tracking-tighter italic ${s.color === 'rose' ? 'text-rose-500' : 'text-slate-900'}`}>{s.val}</h3>
           </div>
         ))}
      </div>

      {activeTab === 'STAFF' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase mb-8 flex items-center gap-3">
                    <Award className="w-6 h-6 text-amber-500" /> Staff Leaderboard
                 </h3>
                 <div className="space-y-4">
                    {staffSales.map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group hover:bg-slate-900 hover:text-white transition-all cursor-default">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-800 font-black text-lg group-hover:bg-white/10 group-hover:text-white">
                                {i + 1}
                             </div>
                             <div>
                                <h4 className="text-base font-black italic uppercase tracking-tight">{s.name}</h4>
                                <p className="text-[10px] font-black uppercase opacity-40 mb-3">{s.role} • {s.count} Orders</p>
                                <div className="flex gap-2">
                                   {s.topItems.map((it, idx) => (
                                      <span key={idx} className="bg-white/50 border border-slate-200 px-2 py-1 rounded-lg text-[8px] font-black uppercase text-slate-500 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20">
                                         {it.qty}x {it.name}
                                      </span>
                                   ))}
                                </div>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black tracking-tighter">₹{getPrice(s.total)}</p>
                             <p className="text-[9px] font-black uppercase text-emerald-500 group-hover:text-emerald-400">Total Contribution</p>
                          </div>
                       </div>
                    ))}
                    {staffSales.length === 0 && <p className="text-center py-20 text-slate-300 font-black uppercase tracking-widest">No staff data available</p>}
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
                 <div className="relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8">Performance Tip</h4>
                    <p className="text-lg font-black italic leading-tight mb-8">
                       "{staffSales[0]?.name || 'Your top performer'} is currently leading with <span className="text-emerald-400">₹{getPrice(staffSales[0]?.total || 0)}</span>. Consider setting a daily goal to boost team competitive spirit."
                    </p>
                 </div>
                 <button className="relative z-10 w-full py-5 bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                    Generate Team Report
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'LEAKAGE' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xl font-black text-rose-500 tracking-tight italic uppercase flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6" /> Leakage Prevention Audit
                 </h3>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Detailed list of cancelled and returned orders</p>
              </div>
              <div className="bg-rose-50 text-rose-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100">
                 Total Lost: ₹{getPrice(stats.leakage)}
              </div>
           </div>

           <div className="space-y-4">
              {orders.filter(o => ['CANCELLED', 'cancelled', 'returned'].includes(o.status)).map((o, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-rose-50/30 border border-rose-100 rounded-[2rem] group hover:bg-rose-50 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-white border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500">
                          <XCircle className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{o.order_reference}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(o.created_at).toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-rose-600 tracking-tighter italic">₹{getPrice(o.total_price)}</p>
                       <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest italic">Loss Detected</p>
                    </div>
                 </div>
              ))}
              {orders.filter(o => ['CANCELLED', 'cancelled', 'returned'].includes(o.status)).length === 0 && (
                 <div className="py-24 text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Zero leakage detected. Perfect operations!</p>
                 </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in duration-500">
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
      )}

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
