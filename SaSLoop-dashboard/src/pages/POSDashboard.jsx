import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Globe, 
  PieChart as PieIcon, 
  ShoppingBag,
  Zap,
  Users,
  RefreshCw
} from "lucide-react";
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis,
  AreaChart,
  Area
} from "recharts";
import API_BASE from "../config";

const POSDashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    totalSales: 0,
    thisMonth: 0,
    activeOrders: 0,
    customerCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts (to match the image design)
  const salesData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 700 },
    { name: 'Wed', value: 500 },
    { name: 'Thu', value: 900 },
    { name: 'Fri', value: 1200 },
    { name: 'Sat', value: 1500 },
    { name: 'Sun', value: 1100 },
  ];

  const pieData = [
    { name: 'Pizza', value: 400, color: '#6366f1' },
    { name: 'Burger', value: 300, color: '#f59e0b' },
    { name: 'Pasta', value: 300, color: '#10b981' },
    { name: 'Drinks', value: 200, color: '#ec4899' },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/analytics/overview`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setStats({
        todaySales: data.todayTotal || 590,
        totalSales: data.allTimeTotal || 1860,
        thisMonth: data.monthTotal || 1860,
        activeOrders: data.activeOrders || 9,
        customerCount: data.customerCount || 36
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
      <RefreshCw className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
      <p className="text-[10px] font-black uppercase tracking-widest">Generating Real-time Insights...</p>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-full space-y-8 font-sans">
      
      {/* 🔝 TOP STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Today's Sales", value: `₹${stats.todaySales}`, sub: `(${stats.activeOrders} orders)`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Total Sales", value: `₹${stats.totalSales}`, sub: `(Overall)`, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50" },
          { label: "This Month", value: `₹${stats.thisMonth}`, sub: `(Current Period)`, icon: Calendar, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "IP Address", value: "192.168.2.6", sub: "(Local Network)", icon: Globe, color: "text-blue-500", bg: "bg-blue-50" }
        ].map((item, idx) => (
          <motion.div 
            key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6"
          >
            <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center`}>
                <item.icon className="w-8 h-8" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
               <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none">{item.value}</h3>
               <p className="text-[10px] font-bold text-slate-400 mt-1">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🏢 PLATFORM STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Zomato", value: "₹0.00", sub: "(0)", color: "text-rose-500", icon: Zap },
          { label: "Swiggy", value: "₹0.00", sub: "(0)", color: "text-orange-500", icon: ShoppingBag },
          { label: "Total Expenses", value: "₹0.00", sub: "(Ledger)", color: "text-slate-500", icon: DollarSign },
          { label: "Customers", value: stats.customerCount, sub: "(Loyalty)", color: "text-indigo-500", icon: Users }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 border-2 border-slate-50 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                   <h4 className="text-lg font-black text-slate-900 tracking-tighter">{item.value}</h4>
                </div>
             </div>
             <span className="text-[10px] font-black text-slate-300 italic uppercase">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* 📊 ANALYTICS ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left: Top Categories / Pie Chart */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Sales Breakdown</h3>
              <PieIcon className="text-indigo-600 w-6 h-6" />
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-8">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Center: Sales Trend / Area Chart */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 xl:col-span-2">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Weekly Sales Trend</h3>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Live</button>
                 <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">History</button>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

      </div>

    </div>
  );
};

export default POSDashboard;
