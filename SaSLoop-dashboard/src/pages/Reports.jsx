import React, { useState, useEffect } from "react";
import API_BASE from "../config";
import { 
  BarChart3, 
  Calendar, 
  Search, 
  Download, 
  Filter, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag
} from "lucide-react";

function Reports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bizData, setBizData] = useState(null);

  useEffect(() => {
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
    fetchOrders();
  }, []);

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'COMPLETED' || o.status === 'delivered').length,
    pending: orders.filter(o => ['PENDING', 'pending', 'CONFIRMED'].includes(o.status)).length,
    totalSales: orders.filter(o => o.status === 'COMPLETED' || o.status === 'delivered').reduce((acc, o) => acc + parseFloat(o.total_price), 0)
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === "ALL" || (filter === "NEW" && ['PENDING','pending','CONFIRMED'].includes(o.status)) || o.status === filter;
    const matchesSearch = o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.order_reference?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPrice = (p) => parseFloat(p).toFixed(2);

  const handlePrint = (order, type = 'BILL') => {
    const win = window.open("", "_blank");
    let items = order.items;
    if (typeof items === 'string') items = JSON.parse(items);
    
    const currency = bizData?.currency_code === 'INR' ? '₹' : (bizData?.currency_code === 'USD' ? '$' : '₹');
    
    const html = `
      <html>
        <head>
          <style>
             @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
             body { font-family: 'Courier Prime', monospace; width: 80mm; padding: 5mm; margin: 0 auto; line-height: 1.2; font-size: 13px; color: #000; }
             .center { text-align: center; }
             .bold { font-weight: bold; }
             .header { margin-bottom: 5mm; border-bottom: 1px dashed #000; padding-bottom: 3mm; }
             .title { font-size: 18px; margin-bottom: 2px; }
             .items { width: 100%; border-collapse: collapse; margin-bottom: 5mm; }
             .items td { padding: 1mm 0; }
             .footer { border-top: 1px dashed #000; padding-top: 3mm; margin-top: 3mm; }
             .row { display: flex; justify-content: space-between; }
             @media print { body { padding: 0; } }
          </style>
        </head>
        <body onload="window.print(); window.close();">
           <div class="header center">
              <div class="title bold">${bizData?.name || 'SaSLoop Store'}</div>
              <div>${bizData?.address || ''}</div>
              <div class="bold" style="margin-top: 5px;">${type === 'BILL' ? 'TAX INVOICE' : 'KOT (Kitchen Order)'}</div>
              <div class="row" style="margin-top: 8px; font-size: 11px;">
                 <span>Ref: ${order.order_reference}</span>
                 <span>${new Date(order.created_at).toLocaleDateString()}</span>
              </div>
           </div>
           <div class="details" style="margin-bottom: 3mm; font-size: 11px;">
              <div>Customer: ${order.customer_name}</div>
              <div>Table: ${order.table_number || 'N/A'}</div>
           </div>
           <table class="items">
              <tr class="bold" style="border-bottom: 1px solid #000;">
                 <td>Item</td>
                 <td class="center">Qty</td>
                 <td style="text-align: right;">Total</td>
              </tr>
              ${items.map(i => `
                <tr>
                   <td>${i.name}</td>
                   <td class="center">${i.qty}</td>
                   <td style="text-align: right;">${currency}${getPrice(i.price * i.qty)}</td>
                </tr>
              `).join('')}
           </table>
           <div class="totals">
              <div class="row bold">
                 <span>Grand Total</span>
                 <span>${currency}${getPrice(order.total_price)}</span>
              </div>
           </div>
           <div class="footer center">
              <p>Thank you for visiting!<br>Join our loyalty program with: ${order.customer_number}</p>
              <div style="font-size: 9px; margin-top: 8px;">Generated via SaSLoop AI</div>
           </div>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="p-6 space-y-8 bg-[#f8fafc] min-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-500" /> Sales Reports
           </h2>
           <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest text-[10px] opacity-60">Order history & Analytics</p>
        </div>
        <button className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-200 active:scale-95 transition-all">
           <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Total Revenue", val: `₹${getPrice(stats.totalSales)}`, icon: TrendingUp, color: "emerald", trend: "+12%" },
           { label: "Total Orders", val: stats.total, icon: ShoppingBag, color: "indigo", trend: "+5%" },
           { label: "Completed", val: stats.completed, icon: CheckCircle2, color: "emerald", trend: "100%" },
           { label: "Active Orders", val: stats.pending, icon: Clock, color: "amber", trend: "Realtime" }
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-500 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <s.icon className="w-6 h-6" />
                 </div>
                 <span className={`text-[10px] font-black text-${s.color}-600 bg-${s.color}-50 px-2 py-1 rounded-full uppercase tracking-widest`}>{s.trend}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{s.label}</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{s.val}</h3>
           </div>
         ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-2xl overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-72 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    placeholder="Search records..." 
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-4 py-4 text-xs font-bold outline-none focus:bg-white focus:border-indigo-100 transition-all shadow-inner"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
               </div>
               <button className="w-14 h-14 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-white hover:text-indigo-500 transition-all">
                  <Filter className="w-5 h-5" />
               </button>
            </div>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
               {["ALL", "NEW", "COMPLETED", "CANCELLED"].map(t => (
                 <button
                   key={t}
                   onClick={() => setFilter(t)}
                   className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === t ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}
                 >
                    {t}
                 </button>
               ))}
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                       <td colSpan="6" className="py-20 text-center">
                          <Package className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                          <p className="text-[10px] font-black text-slate-300 uppercase">No orders found</p>
                       </td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => (
                      <tr 
                        key={o.id} 
                        onClick={() => setSelectedOrder(o)}
                        className="hover:bg-slate-50 transition-all group cursor-pointer active:scale-[0.99]"
                      >
                         <td className="px-10 py-6">
                            <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-2 rounded-xl uppercase tracking-widest leading-none group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               {o.order_reference || `#${o.id}`}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <h4 className="font-black text-slate-900 text-sm leading-none mb-1 uppercase tracking-tight italic decoration-indigo-200 underline">{o.customer_name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold">📞 {o.customer_number}</p>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-[11px] font-black text-slate-700 leading-none mb-1">{new Date(o.created_at).toLocaleDateString()}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(o.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                         </td>
                         <td className="px-8 py-6 font-black text-slate-900 tracking-tighter text-base">₹{getPrice(o.total_price)}</td>
                         <td className="px-8 py-6">
                            <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${
                               o.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                               ['PENDING', 'pending', 'CONFIRMED'].includes(o.status) ? 'bg-amber-100 text-amber-600' :
                               'bg-slate-100 text-slate-400'
                            }`}>
                               {o.status}
                            </span>
                         </td>
                         <td className="px-10 py-6">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic decoration-slate-200 underline">
                               {o.table_number ? `🍽️ Table ${o.table_number}` : (o.address?.includes('Pickup') ? '🏪 Pickup' : '🚚 Delivery')}
                            </span>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
          <div className="fixed inset-0 z-[500] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="bg-slate-900 p-10 text-white relative">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Receipt</span>
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase underline decoration-indigo-500">{selectedOrder.order_reference}</h3>
                         </div>
                         <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 bg-white/10 rounded-[1.2rem] flex items-center justify-center hover:bg-white/20 transition-all"><XCircle className="w-6 h-6" /></button>
                      </div>
                      <div className="flex gap-4">
                          <div className="bg-white/10 px-4 py-2 rounded-xl">
                              <p className="text-[8px] font-black uppercase opacity-40">Status</p>
                              <p className="text-xs font-black uppercase tracking-widest">{selectedOrder.status}</p>
                          </div>
                          <div className="bg-white/10 px-4 py-2 rounded-xl">
                              <p className="text-[8px] font-black uppercase opacity-40">Total</p>
                              <p className="text-xs font-black uppercase tracking-widest italic">₹{getPrice(selectedOrder.total_price)}</p>
                          </div>
                      </div>
                  </div>

                  <div className="p-10">
                      <div className="mb-8 border-b-2 border-dashed border-slate-100 pb-8">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Customer Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[9px] font-black text-slate-300 uppercase">Name</p>
                                 <p className="text-sm font-black text-slate-800">{selectedOrder.customer_name}</p>
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-300 uppercase">Phone</p>
                                 <p className="text-sm font-black text-slate-800">{selectedOrder.customer_number}</p>
                              </div>
                              <div className="col-span-2">
                                 <p className="text-[9px] font-black text-slate-300 uppercase">Fulfillment / Address</p>
                                 <p className="text-sm font-black text-slate-800">{selectedOrder.address}</p>
                              </div>
                          </div>
                      </div>

                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Ordered Items</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                          {(() => {
                              try {
                                  let items = selectedOrder.items;
                                  if (typeof items === 'string') items = JSON.parse(items);
                                  return items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-[1.5rem]">
                                          <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center font-black text-[10px] text-indigo-600 shadow-sm">{item.qty}x</div>
                                              <p className="text-xs font-black text-slate-700 uppercase italic tracking-tighter">{item.name}</p>
                                          </div>
                                          <p className="text-xs font-black text-slate-900">₹{getPrice(item.price * item.qty)}</p>
                                      </div>
                                  ));
                              } catch (e) { return <p className="text-xs font-bold text-rose-400 italic">Error loading items</p>; }
                          })()}
                      </div>

                      <div className="mt-10 pt-8 border-t-2 border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="text-center sm:text-left">
                              <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Placed On</p>
                              <p className="text-[10px] font-black text-slate-500 uppercase">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                              <button 
                                onClick={() => handlePrint(selectedOrder, 'KOT')}
                                className="flex-1 sm:flex-none bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                              >
                                 Print KOT
                              </button>
                              <button 
                                onClick={() => handlePrint(selectedOrder, 'BILL')}
                                className="flex-1 sm:flex-none bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 active:scale-95 transition-all"
                              >
                                 Print Bill
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default Reports;
