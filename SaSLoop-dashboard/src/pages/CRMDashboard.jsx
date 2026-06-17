import { useEffect, useState } from "react";
import API_BASE from "../config";
import { 
  Users, Star, QrCode, TrendingUp, Search, Filter, 
  MessageSquare, Heart, Crown, Award, ExternalLink, Download, Share2,
  Ban, Trash2, ShieldAlert, CheckCircle2, Sparkles, ArrowRight, ChevronRight, MoreVertical, Database
} from "lucide-react";
import { generateStandee } from "../utils/standeeGenerator";

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

    // Silent background polling for CRM metrics/analytics (every 10 seconds)
    const pollInterval = setInterval(() => {
      fetchData(true);
    }, 10000);

    return () => clearInterval(pollInterval);
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

  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
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
    finally { 
      if (!isSilent) setLoading(false); 
    }
  };


  const handleBlockToggle = async (phone, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'UNBLOCK' : 'BLOCK'} this customer?`)) return;
    try {
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
      const res = await fetch(`${API_BASE}/api/crm/block-customer${targetParam}`, {
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
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
      const res = await fetch(`${API_BASE}/api/crm/customer/${encodeURIComponent(phone)}${targetParam}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
  };

  const cleanPhone = (bizInfo.phone || "").replace(/\D/g, "");
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Join Updates")}`)}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Matrix */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
             <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Customer Growth Matrix</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CRM & Loyalty Orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
              onClick={() => setActiveTab('qr')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'qr' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
           >
              <QrCode className="w-4 h-4" /> Growth QR
           </button>
           <button 
              onClick={() => window.location.href = '/intelligence'}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm"
           >
              <Sparkles className="w-4 h-4 text-emerald-400" /> AI Insights
           </button>
        </div>
      </div>

      {/* Intelligence & Sentiment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 group relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-md text-[9px] font-bold uppercase flex items-center gap-2">
               <ShieldAlert className="w-3 h-3" /> Mystery Shopper Pattern Alert
            </div>
            <div className="w-32 h-32 relative flex-shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351} strokeDashoffset={351 - (351 * 88) / 100} className="text-emerald-500 transition-all duration-1000" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900 tracking-tighter">88%</span>
                  <span className="text-[7px] font-bold uppercase text-slate-400 tracking-widest">Happiness</span>
               </div>
            </div>
            <div className="flex-1 space-y-3">
               <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <h3 className="font-bold text-slate-800 tracking-tight text-[13px] uppercase">Sentiment Heatmap</h3>
               </div>
               <p className="text-slate-500 text-[11px] font-medium leading-relaxed">AI analysis indicates a <strong className="text-emerald-600">Strongly Positive</strong> sentiment across 150+ interactions. "Fast Delivery" remains the top performance driver.</p>
               <div className="flex gap-6 pt-1">
                  <div className="flex flex-col"><span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Churn Risk</span><span className="text-[13px] font-bold text-rose-500 uppercase">12 Users</span></div>
                  <div className="flex flex-col"><span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Growth Score</span><span className="text-[13px] font-bold text-indigo-600 uppercase">+15%</span></div>
               </div>
            </div>
         </div>
         <div className="bg-indigo-600 p-6 rounded-lg text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
            <div className="relative z-10">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Next Smart Move</h4>
               <p className="text-[11px] font-bold leading-relaxed">Butter Chicken loyalists have an 80% higher churn rate without VIP status. <span className="underline cursor-pointer decoration-white/30 hover:decoration-white transition-all">Launch Win-Back?</span></p>
            </div>
            <button onClick={() => window.location.href = '/marketing-studio'} className="mt-6 w-full py-2.5 bg-white text-indigo-600 rounded-md font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
               Launch Campaign <ArrowRight className="w-3 h-3" />
            </button>
         </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
            { label: "VIP Club", count: segments.vip_count, icon: Crown, color: "bg-amber-50 text-amber-600", desc: "Top Spenders" },
            { label: "At-Risk", count: segments.at_risk_count, icon: ShieldAlert, color: "bg-rose-50 text-rose-600", desc: "Need Attention" },
            { label: "New Joins", count: segments.new_count, icon: Heart, color: "bg-emerald-50 text-emerald-600", desc: "Last 7 Days" },
            { label: "Total Tribe", count: segments.total_count, icon: Users, color: "bg-indigo-50 text-indigo-600", desc: "Active Database" },
         ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all group overflow-hidden relative">
               <div className="flex justify-between items-start relative z-10">
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                     <h3 className="text-2xl font-bold text-slate-800 tracking-tighter uppercase">{stat.count}</h3>
                     <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{stat.desc}</p>
                  </div>
                  <div className={`w-10 h-10 ${stat.color} rounded flex items-center justify-center`}>
                     <stat.icon className="w-5 h-5" />
                  </div>
               </div>
            </div>
         ))}
      </div>

      <div className="flex flex-col">
         
         {activeTab === 'qr' ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="w-48 h-48 bg-slate-50 border border-slate-200 rounded-lg p-6 flex items-center justify-center relative group">
                  <img src={qrUrl} alt="Growth QR" className="w-full h-full object-contain mix-blend-multiply" />
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all rounded-lg flex items-center justify-center">
                     <Download className="w-8 h-8 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
               </div>
               <div className="flex-1 space-y-4">
                  <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100">Automated Enrollment</div>
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight uppercase leading-none">The Viral QR Protocol</h3>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed max-w-sm">Deploy this QR on tables or packaging. Scans trigger instant WhatsApp enrollment and award <strong className="text-indigo-600 font-bold">50 Loyalty Credits</strong> automatically.</p>
                  
                  <div className="flex gap-3 pt-2">
                     <button onClick={() => generateStandee(qrUrl, bizInfo, "CRM")} className="h-9 px-6 bg-slate-900 text-white rounded-md font-bold uppercase text-[10px] tracking-widest shadow-md flex items-center gap-2 active:scale-95 transition-all">
                        Download Standee <Download className="w-3.5 h-3.5" />
                     </button>
                     <button className="h-9 px-6 bg-white border border-slate-200 text-slate-600 rounded-md font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
                        Share Link <Share2 className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </div>
            </div>
         ) : (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
               <div className="h-14 px-6 border-b border-slate-100 flex items-center gap-6 shrink-0 bg-slate-50/50">
                  <button onClick={() => setActiveTab('customers')} className={`text-[10px] font-bold uppercase tracking-widest h-full px-2 transition-all border-b-2 ${activeTab === 'customers' ? 'border-indigo-600 text-slate-800' : 'border-transparent text-slate-400'}`}>Top Loyalists</button>
                  <button onClick={() => setActiveTab('feedback')} className={`text-[10px] font-bold uppercase tracking-widest h-full px-2 transition-all border-b-2 ${activeTab === 'feedback' ? 'border-indigo-600 text-slate-800' : 'border-transparent text-slate-400'}`}>Customer Feedback</button>
                  <button onClick={() => setActiveTab('nurture')} className={`text-[10px] font-bold uppercase tracking-widest h-full px-2 transition-all border-b-2 ${activeTab === 'nurture' ? 'border-indigo-600 text-slate-800' : 'border-transparent text-slate-400'}`}>Auto-Nurture</button>
               </div>

               <div className="overflow-auto custom-scrollbar">
                  {activeTab === 'customers' ? (
                     <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/30 border-b border-slate-100">
                               <th className="px-6 py-4">Customer Identity</th>
                               <th className="px-6 py-4">Loyalty Matrix</th>
                               <th className="px-6 py-4 text-center">Taste Profile</th>
                               <th className="px-6 py-4 text-center">Last Encounter</th>
                               <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {customers.map((c) => (
                              <tr key={c.id} className={`hover:bg-slate-50 group transition-colors ${c.is_blocked ? 'bg-red-50/30' : ''}`}>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="font-bold text-[12px] text-slate-800 uppercase leading-tight">
                                        {c.display_name || c.name || 'Anonymous Guest'}
                                        {c.is_blocked && <span className="ml-2 bg-red-100 text-red-600 text-[8px] px-2 py-0.5 rounded-full uppercase font-black">Blocked</span>}
                                      </div>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-400 mt-0.5 tracking-wider uppercase">
                                       {c.customer_number ? `+${c.customer_number.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{5})$/, '$1 $2 $3')}` : 'Contact Unavailable'}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <Award className={`w-3.5 h-3.5 ${c.points > 1000 ? 'text-amber-400' : 'text-slate-300'}`} />
                                       <span className="font-bold text-[11px] text-slate-700 uppercase">{c.points} Points</span>
                                       {c.points > 1000 && <Crown className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                    <div className="flex flex-wrap justify-center gap-1">
                                       <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter">Spicy Lover</span>
                                       <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter">Veg Only</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(c.last_visit).toLocaleDateString()}</td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       <button 
                                          onClick={() => handleBlockToggle(c.customer_number, c.is_blocked)}
                                          title={c.is_blocked ? "Unblock Customer" : "Block Customer"}
                                          className={`p-1.5 rounded transition-all ${c.is_blocked ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                                       >
                                          {c.is_blocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                       </button>
                                       <button 
                                          onClick={() => handleDeleteCustomer(c.customer_number)}
                                          title="Delete Customer Forever"
                                          className="p-1.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
                                       >
                                          <Trash2 className="w-3.5 h-3.5" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                           {customers.length === 0 && (
                             <tr>
                               <td colSpan="5" className="py-24 text-center">
                                 <Database className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Customer Database Empty</p>
                               </td>
                             </tr>
                           )}
                        </tbody>
                     </table>
                  ) : activeTab === 'nurture' ? (
                    <div className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-500">
                       {[
                         { title: 'Win-Back Sequence', desc: 'Sends a "We miss you" discount message to customers who haven\'t ordered in 7 days.', status: 'Active', delay: '7 Days' },
                         { title: 'Post-Purchase Feedback', desc: 'Automatically asks for a rating 2 hours after an order is marked as Completed.', status: 'Active', delay: '2 Hours' },
                         { title: 'Abandoned Cart Recovery', desc: 'Follows up with customers who left items in their cart without checking out.', status: 'Active', delay: '15 Mins' },
                       ].map((rule, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between hover:border-indigo-300 transition-all group">
                             <div className="flex gap-4 items-center">
                                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-lg">
                                   <MessageSquare className="w-4 h-4" />
                                </div>
                                <div>
                                   <h4 className="font-bold text-slate-800 uppercase text-[12px]">{rule.title}</h4>
                                   <p className="text-[10px] font-medium text-slate-400 max-w-sm mt-0.5">{rule.desc}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100">{rule.status}</span>
                                <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">Delay: {rule.delay}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                  ) : (
                     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedbacks.map(f => (
                           <div key={f.id} className="bg-white rounded-lg p-5 border border-slate-200 hover:border-indigo-300 transition-all">
                              <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                       <Star key={i} className={`w-3 h-3 ${i < f.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                    ))}
                                 </div>
                                 <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(f.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 font-medium mb-4 leading-relaxed underline decoration-slate-100 underline-offset-4 decoration-2">{f.comment || 'Performance metric only: No textual payload provided.'}</p>
                              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                 <MessageSquare className="w-3 h-3 text-indigo-400" /> {f.customer_number}
                              </div>
                           </div>
                        ))}
                        {feedbacks.length === 0 && (
                           <div className="col-span-full py-20 text-center opacity-30">
                              <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-[10px] font-bold uppercase tracking-widest">Zero Feedback Artifacts Logged</p>
                           </div>
                        )}
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
