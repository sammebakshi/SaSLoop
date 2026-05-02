import React, { useState, useEffect } from "react";
import { 
  Brain, Sparkles, TrendingUp, TrendingDown, Target, Zap, 
  MessageSquare, Activity, ArrowUpRight, 
  Clock, Users, Wallet, ChefHat, ShoppingBag, Plus
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import API_BASE from "../config";

function IntelligenceHub() {
  const [strategy, setStrategy] = useState("");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    today_revenue: 0,
    active_customers: 0,
    peak_hour: "2 PM",
    top_dish: "Loading...",
    surge_multiplier: 1.0,
    hourly_data: [],
    category_data: []
  });

  useEffect(() => {
    fetchIntelligence();
  }, []);

  const fetchIntelligence = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/analytics/business-intelligence`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (data && data.metrics) {
        setStrategy(data.strategy || "");
        setMetrics({
          today_revenue: data.metrics.today_revenue || 0,
          active_customers: data.metrics.active_customers || 0,
          peak_hour: data.metrics.peak_hour || "N/A",
          top_dish: data.metrics.top_dish || "N/A",
          surge_multiplier: data.metrics.surge_multiplier || 1.0,
          hourly_data: data.metrics.hourly_data || [],
          category_data: data.metrics.category_data || []
        });
      }
    } catch (err) {
      console.error("Intelligence Fetch Error:", err);
      setStrategy("AI Consultant: Focus on upselling high-margin items during your lunch rush.");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color, subtext }) => (
    <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-xl shadow-slate-200/20 group hover:border-indigo-100 transition-all duration-500 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-8 -mt-8 rounded-full ${color}`} />
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-4 rounded-2xl ${color.replace('bg-', 'bg-').replace('-500', '-50')} ${color.replace('bg-', 'text-')}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-6 relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight italic">{value}</h3>
        <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{subtext}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">AI Intelligence Active</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-orange-500">Global Command</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs opacity-60">Real-time Strategic Autopilot for your Empire</p>
        </div>
        
        <div className="flex gap-3">
           <button onClick={fetchIntelligence} className="px-6 py-4 bg-white border-2 border-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-100 hover:bg-slate-50 transition-all flex items-center gap-2">
             <Activity className="w-4 h-4" /> Recalibrate
           </button>
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-300 hover:scale-105 transition-all flex items-center gap-2 italic">
             <Target className="w-4 h-4" /> Deploy Ads
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Real-time Revenue" 
          value={`₹${(metrics?.today_revenue || 0).toLocaleString()}`} 
          icon={Wallet} 
          trend={12} 
          color="bg-indigo-500" 
          subtext="Live order stream" 
        />
        <StatCard 
          title="Active Traffic" 
          value={metrics?.active_customers || 0} 
          icon={Users} 
          trend={-4} 
          color="bg-emerald-500" 
          subtext="Current store density" 
        />
        <StatCard 
          title="Surge Multiplier" 
          value={`${metrics?.surge_multiplier || 1.0}x`} 
          icon={Zap} 
          color="bg-orange-500" 
          subtext="Automatic revenue boost" 
        />
        <StatCard 
          title="Peak Demand" 
          value={metrics?.peak_hour || "N/A"} 
          icon={Clock} 
          color="bg-rose-500" 
          subtext="Predicted rush window" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI STRATEGY BOX */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-400/20 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center border border-white/10">
                  <Brain className="w-8 h-8 text-indigo-400" />
               </div>
               <div>
                  <h3 className="text-2xl font-black tracking-tight uppercase italic underline decoration-indigo-500">Executive Briefing</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Generated by SaSLoop Core AI</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                  <p className="text-lg font-bold leading-relaxed italic text-slate-200">
                    "{strategy || 'Analyzing your business patterns...'}"
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                     <ChefHat className="w-5 h-5 text-orange-400" />
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Target Menu Item</p>
                        <p className="text-sm font-black text-white italic uppercase tracking-tighter">{metrics?.top_dish || "N/A"}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                     <ShoppingBag className="w-5 h-5 text-emerald-400" />
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inventory Health</p>
                        <p className="text-sm font-black text-white italic uppercase tracking-tighter">94% Optimally Stocked</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-wrap gap-3">
               <button className="px-6 py-3.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2">
                 Accept Strategy
               </button>
               <button className="px-6 py-3.5 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                 Modify Plan
               </button>
            </div>
          </div>
        </div>

        {/* PREDICTION CHART */}
        <div className="bg-white rounded-[3.5rem] p-10 border-2 border-slate-50 shadow-2xl shadow-slate-200/30 flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">Profit Velocity</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prediction Mode</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Score</span>
                    <span className="text-xl font-black text-indigo-600 italic">92%</span>
                 </div>
                 <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-indigo-600" />
                 </div>
              </div>
           </div>

           <div className="h-48 mt-8">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={metrics.hourly_data?.length > 0 ? metrics.hourly_data : [{time: '00:00', revenue: 0}]}>
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} dot={false} />
                 </LineChart>
              </ResponsiveContainer>
           </div>

           <div className="pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Daily Net</p>
                 <p className="text-2xl font-black text-slate-900 italic tracking-tighter">₹42,800</p>
              </div>
              <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                 <ArrowUpRight className="w-3 h-3" /> +18% from last week
              </p>
           </div>
        </div>

      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-200">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-xl">
               <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
               <h4 className="text-xl font-black tracking-tight uppercase italic">Smart Pricing Engine</h4>
               <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-[0.2em] opacity-80 mt-1">Automatic surge detection active</p>
            </div>
         </div>
         <button className="px-10 py-5 bg-white text-indigo-600 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2">
            Configure Logic <Plus className="w-4 h-4" />
         </button>
      </div>

    </div>
  );
}

export default IntelligenceHub;
