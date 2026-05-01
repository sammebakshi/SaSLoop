import { useEffect, useState } from "react";
import API_BASE from "../config";
import { 
  Users, Star, QrCode, TrendingUp, Search, Filter, 
  MessageSquare, Heart, Crown, Award, ExternalLink, Download, Share2,
  Ban, Trash2, ShieldAlert, CheckCircle2, Sparkles, ArrowRight
} from "lucide-react";

function CRMDashboard() {
  const [customers, setCustomers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("customers");
  const [bizInfo, setBizInfo] = useState({ phone: "", name: "" });
  const [segments, setSegments] = useState({ vip_count: 0, at_risk_count: 0, new_count: 0, total_count: 0 });


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

      const [cusRes, feedRes, segRes] = await Promise.all([
        fetch(`${API_BASE}/api/crm/customers${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/crm/feedbacks${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/crm/segments${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);
      const cusData = await cusRes.json();
      const feedData = await feedRes.json();
      const segData = await segRes.json();
      setCustomers(Array.isArray(cusData) ? cusData : []);
      setFeedbacks(Array.isArray(feedData) ? feedData : []);
      if (segData && !segData.error) setSegments(segData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };


  const handleBlockToggle = async (phone, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'UNBLOCK' : 'BLOCK'} this customer?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/crm/block-customer`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ phone, isBlocked: !currentStatus })
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteCustomer = async (phone) => {
    if (!window.confirm("CRITICAL: This will permanently delete this customer's entire history and loyalty points. Are you absolutely sure?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/crm/customer/${phone}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
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
           <button 
              onClick={() => window.location.href = '/intelligence'}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95"
           >
              <Sparkles className="w-4 h-4 text-emerald-400" /> AI Insights
           </button>
        </div>
      </div>

      {/* INTELLIGENCE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 group relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-rose-50 text-rose-600 px-4 py-2 rounded-2xl text-[9px] font-black uppercase flex items-center gap-2 animate-pulse">
               <ShieldAlert className="w-3 h-3" /> Mystery Shopper Alert: Cold Fries Pattern Detected
            </div>
            <div className="w-40 h-40 relative flex-shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="15" fill="transparent" className="text-slate-100" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="15" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * 88) / 100} className="text-emerald-500 transition-all duration-1000" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">88%</span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Happiness</span>
               </div>
            </div>
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-black text-slate-900 tracking-tighter text-lg uppercase italic">Sentiment Heatmap</h3>
               </div>
               <p className="text-slate-500 text-xs font-medium leading-relaxed">AI has analyzed 150+ customer interactions. Sentiment is <strong className="text-emerald-600">Strongly Positive</strong>. Most customers mention "Fast Delivery".</p>
               <div className="flex gap-4">
                  <div className="flex flex-col"><span className="text-[10px] font-black uppercase text-slate-400">Churn Risk</span><span className="text-sm font-black text-rose-500">12 Users</span></div>
                  <div className="flex flex-col"><span className="text-[10px] font-black uppercase text-slate-400">Growth Score</span><span className="text-sm font-black text-indigo-600">+15%</span></div>
               </div>
            </div>
         </div>
         <div className="bg-indigo-600 p-8 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
            <div className="relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Next Smart Move</h4>
               <p className="text-sm font-bold leading-relaxed">Customers who buy "Butter Chicken" have an 80% higher churn rate if they don't join the VIP club. <span className="underline cursor-pointer">Start a Win-Back campaign?</span></p>
            </div>
            <button onClick={() => window.location.href = '/marketing-studio'} className="mt-6 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
               Launch Campaign <ArrowRight className="w-3 h-3" />
            </button>
         </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
            { label: "VIP Club", count: segments.vip_count, icon: Crown, color: "bg-amber-100 text-amber-600", desc: "Top Spenders" },
            { label: "At-Risk", count: segments.at_risk_count, icon: ShieldAlert, color: "bg-rose-100 text-rose-600", desc: "Need Attention" },
            { label: "New Joins", count: segments.new_count, icon: Heart, color: "bg-emerald-100 text-emerald-600", desc: "Last 7 Days" },
            { label: "Total Tribe", count: segments.total_count, icon: Users, color: "bg-indigo-100 text-indigo-600", desc: "Active Database" },
         ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
               <div className="flex justify-between items-start relative z-10">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                     <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.count}</h3>
                     <p className="text-[10px] font-bold text-slate-400 mt-1">{stat.desc}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg shadow-current/10`}>
                     <stat.icon className="w-6 h-6" />
                  </div>
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-all duration-700" />
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
                               <th className="px-10 py-6 border-b border-slate-100 text-center">Taste Profile</th>
                               <th className="px-10 py-6 border-b border-slate-100 text-center">Last Seen</th>
                               <th className="px-10 py-6 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {customers.map((c) => (
                              <tr key={c.id} className={`hover:bg-slate-50 group transition-colors ${c.is_blocked ? 'bg-red-50/50' : ''}`}>
                                 <td className="px-10 py-6">
                                    <div className="flex items-center gap-3">
                                      <div className="font-black text-sm text-slate-800 leading-tight">
                                        {c.display_name || c.name || 'Customer'}
                                        {c.is_blocked && <span className="ml-2 bg-red-100 text-red-600 text-[8px] px-2 py-0.5 rounded-full uppercase">Blocked</span>}
                                      </div>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 mt-1 tracking-wide">
                                       {c.customer_number ? `+${c.customer_number.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{5})$/, '$1 $2 $3')}` : '—'}
                                    </div>
                                 </td>
                                 <td className="px-10 py-6">
                                    <div className="flex items-center gap-2">
                                       <Award className={`w-4 h-4 ${c.points > 1000 ? 'text-amber-400' : 'text-slate-300'}`} />
                                       <span className="font-black text-xs">{c.points} Points</span>
                                       {c.points > 1000 && <Crown className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />}
                                    </div>
                                 </td>
                                 <td className="px-10 py-6 text-center">
                                    <div className="flex flex-wrap justify-center gap-1">
                                       <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase">Spicy Lover</span>
                                       <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase">Veg Only</span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-6 text-center text-[10px] font-bold text-slate-400 uppercase">{new Date(c.last_visit).toLocaleDateString()}</td>
                                 <td className="px-10 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       <button 
                                          onClick={() => handleBlockToggle(c.customer_number, c.is_blocked)}
                                          title={c.is_blocked ? "Unblock Customer" : "Block Customer"}
                                          className={`p-2 rounded-xl transition-all ${c.is_blocked ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                                       >
                                          {c.is_blocked ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                       </button>
                                       <button 
                                          onClick={() => handleDeleteCustomer(c.customer_number)}
                                          title="Delete Customer Forever"
                                          className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    </div>
                                 </td>
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
