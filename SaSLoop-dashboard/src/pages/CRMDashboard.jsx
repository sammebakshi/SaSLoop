import { useEffect, useState } from "react";
import API_BASE from "../config";
import { 
  Users, Star, QrCode, TrendingUp, Search, Filter, 
  MessageSquare, Heart, Crown, Award, ExternalLink, Download, Share2
} from "lucide-react";

function CRMDashboard() {
  const [customers, setCustomers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("customers");
  const [bizInfo, setBizInfo] = useState({ phone: "", name: "" });

  useEffect(() => {
    fetchData();
    fetchBizInfo();
  }, []);

  const fetchBizInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/business/status`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (data.business) setBizInfo(data.business);
    } catch (e) { console.error(e); }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";

      const [cusRes, feedRes] = await Promise.all([
        fetch(`${API_BASE}/api/crm/customers${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/crm/feedbacks${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);
      const cusData = await cusRes.json();
      const feedData = await feedRes.json();
      setCustomers(Array.isArray(cusData) ? cusData : []);
      setFeedbacks(Array.isArray(feedData) ? feedData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const cleanPhone = (bizInfo.phone || "").replace(/\D/g, "");
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Join Updates")}`)}`;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] p-6 space-y-8 overflow-y-auto custom-scrollbar">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Users className="w-8 h-8 text-indigo-500" /> Customer Growth (CRM)
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage loyalty, collect feedback, and grow your WhatsApp tribe.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
              onClick={() => setActiveTab('qr')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'qr' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'}`}
           >
              <QrCode className="w-4 h-4" /> Growth QR
           </button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Tribe', val: customers.length, icon: Users, color: 'blue' },
           { label: 'Avg Feedback', val: feedbacks.length > 0 ? (feedbacks.reduce((a,b)=>a+b.rating,0)/feedbacks.length).toFixed(1) : '5.0', icon: Heart, color: 'rose' },
           { label: 'Loyalty Issued', val: customers.reduce((a,b)=>a+(parseInt(b.points)||0),0), icon: Award, color: 'amber' },
           { label: 'Revenue/Head', val: customers.length > 0 ? `₹${(customers.reduce((a,b)=>a+parseFloat(b.total_spent),0)/customers.length).toFixed(0)}` : '0', icon: TrendingUp, color: 'emerald' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
               <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-500 rounded-2xl flex items-center justify-center mb-6`}>
                  <stat.icon className="w-6 h-6" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.val}</h3>
            </div>
         ))}
      </div>

      <div className="flex-1 min-h-[500px] flex flex-col">
         
         {activeTab === 'qr' ? (
            <div className="bg-white border border-slate-200 rounded-[3.5rem] p-12 shadow-sm flex flex-col md:flex-row gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="w-64 h-64 bg-slate-50 border-4 border-slate-100 rounded-[3rem] p-8 flex items-center justify-center relative group">
                  <img src={qrUrl} alt="Growth QR" className="w-full h-full object-contain mix-multiply" />
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-all rounded-[3rem] flex items-center justify-center">
                     <Download className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
               </div>
               <div className="flex-1 space-y-6">
                  <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 mb-2">Automated Enrollment</div>
                  <h3 className="text-4xl font-black text-slate-800 tracking-tight leading-none">The Viral QR</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-sm">Place this QR on your physical tables, packaging, or store front. When customers scan it, they instantly subscribe to your WhatsApp updates and earn <strong className="text-indigo-600">50 Bonus Points</strong>.</p>
                  
                  <div className="flex gap-4 pt-4">
                     <button onClick={() => window.open(qrUrl, '_blank')} className="px-8 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all">
                        Download Print File <Download className="w-4 h-4" />
                     </button>
                     <button className="px-8 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
                        Share Link <Share2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
         ) : (
            <div className="bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm flex flex-col flex-1">
               <div className="h-20 px-10 border-b border-slate-100 flex items-center gap-8 shrink-0 bg-slate-50/30">
                  <button onClick={() => setActiveTab('customers')} className={`text-xs font-black uppercase tracking-widest transition-all pb-8 mt-8 border-b-2 ${activeTab === 'customers' ? 'border-indigo-600 text-slate-800' : 'border-transparent text-slate-400'}`}>Top Loyalists</button>
                  <button onClick={() => setActiveTab('feedback')} className={`text-xs font-black uppercase tracking-widest transition-all pb-8 mt-8 border-b-2 ${activeTab === 'feedback' ? 'border-indigo-600 text-slate-800' : 'border-transparent text-slate-400'}`}>Customer Feedback</button>
                  <button onClick={() => setActiveTab('nurture')} className={`text-xs font-black uppercase tracking-widest transition-all pb-8 mt-8 border-b-2 ${activeTab === 'nurture' ? 'border-indigo-600 text-slate-800' : 'border-transparent text-slate-400'}`}>Auto-Nurture</button>
                  {sessionStorage.getItem("impersonate_id") && (
                     <span className="ml-auto text-[8px] font-black text-slate-300 uppercase tracking-widest pb-8 mt-8">
                       Viewing ID: {sessionStorage.getItem("impersonate_id")}
                     </span>
                   )}
               </div>

               <div className="flex-1 overflow-auto custom-scrollbar">
                  {activeTab === 'customers' ? (
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-white">
                              <th className="px-10 py-6 border-b border-slate-100">Customer</th>
                              <th className="px-10 py-6 border-b border-slate-100">Loyalty Level</th>
                              <th className="px-10 py-6 border-b border-slate-100">Total Contribution</th>
                              <th className="px-10 py-6 border-b border-slate-100">Last Seen</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {customers.map((c) => (
                              <tr key={c.id} className="hover:bg-slate-50 group transition-colors">
                                 <td className="px-10 py-6">
                                    <div className="font-black text-sm text-slate-800 leading-tight">{c.display_name || c.name || 'Customer'}</div>
                                    <div className="text-[10px] font-bold text-slate-400 mt-1 tracking-wide">
                                       {c.customer_number ? `+${c.customer_number.replace(/^(\d{2})(\d{5})(\d{5})$/, '$1 $2 $3')}` : '—'}
                                    </div>
                                 </td>
                                 <td className="px-10 py-6">
                                    <div className="flex items-center gap-2">
                                       <Award className={`w-4 h-4 ${c.points > 1000 ? 'text-amber-400' : 'text-slate-300'}`} />
                                       <span className="font-black text-xs">{c.points} Points</span>
                                       {c.points > 1000 && <Crown className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />}
                                    </div>
                                 </td>
                                 <td className="px-10 py-6 font-black text-xs text-emerald-600">₹{parseFloat(c.total_spent).toLocaleString()}</td>
                                 <td className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase">{new Date(c.last_visit).toLocaleDateString()}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  ) : activeTab === 'nurture' ? (
                    <div className="p-10 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                       {[
                         { title: 'Win-Back Sequence', desc: 'Sends a "We miss you" discount message to customers who haven\'t ordered in 7 days.', status: 'Active', delay: '7 Days' },
                         { title: 'Post-Purchase Feedback', desc: 'Automatically asks for a rating 2 hours after an order is marked as Completed.', status: 'Active', delay: '2 Hours' },
                         { title: 'Abandoned Cart Recovery', desc: 'Follows up with customers who left items in their cart without checking out.', status: 'Active', delay: '15 Mins' },
                       ].map((rule, idx) => (
                         <div key={idx} className="bg-white border-2 border-slate-50 p-6 rounded-[2rem] flex items-center justify-between hover:border-indigo-100 transition-all group">
                            <div className="flex gap-5 items-center">
                               <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                                  <MessageSquare className="w-5 h-5" />
                               </div>
                               <div>
                                  <h4 className="font-black text-slate-800 uppercase italic text-sm">{rule.title}</h4>
                                  <p className="text-[11px] font-medium text-slate-400 max-w-sm mt-0.5">{rule.desc}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{rule.status}</span>
                               <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Delay: {rule.delay}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                     <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {feedbacks.map(f => (
                           <div key={f.id} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-indigo-200 transition-all">
                              <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                       <Star key={i} className={`w-3.5 h-3.5 ${i < f.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                    ))}
                                 </div>
                                 <span className="text-[9px] text-slate-400 font-black uppercase">{new Date(f.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-slate-600 font-medium mb-4 italic leading-relaxed">"{f.comment || 'No comment provided.'}"</p>
                              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                 <MessageSquare className="w-3 h-3" /> {f.customer_number}
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         )}

      </div>

    </div>
  );
}

export default CRMDashboard;
