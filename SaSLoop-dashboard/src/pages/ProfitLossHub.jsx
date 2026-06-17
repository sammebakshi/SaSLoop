import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, 
  ArrowDownRight, BarChart3, Activity, ShieldCheck, Wallet,
  ShoppingBag, Package, Receipt, Info
} from "lucide-react";
import API_BASE, { isMobileDevice } from "../config";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePie, Pie, Cell
} from "recharts";

const ProfitLossHub = () => {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = isMobileDevice();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";

      const [ordersRes, expensesRes, invRes] = await Promise.all([
        fetch(`${API_BASE}/api/orders${targetParam}`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/business/expenses`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/inventory/raw`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      const [ordersData, expensesData, invData] = await Promise.all([
        ordersRes.json(),
        expensesRes.json(),
        invRes.json()
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setInventory(Array.isArray(invData) ? invData : []);
    } catch (e) {
      console.error("P&L Load Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const plData = useMemo(() => {
    const revenue = orders.filter(o => o.status === 'COMPLETED' || o.status === 'delivered').reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0);
    const discounts = orders.reduce((acc, o) => acc + parseFloat(o.discount_amount || 0), 0);
    const operationalExpenses = expenses.reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);
    
    // Calculate COGS (Cost of Goods Sold) - Simulating based on inventory value and orders
    // In a real system, this would be based on recipe consumption
    const cogs = revenue * 0.35; // Industry standard 35% food cost for simulation
    
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operationalExpenses;
    const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    const expenseCategories = {};
    expenses.forEach(e => {
       expenseCategories[e.category] = (expenseCategories[e.category] || 0) + parseFloat(e.amount);
    });
    
    const pieData = Object.keys(expenseCategories).map(cat => ({
       name: cat,
       value: expenseCategories[cat]
    }));

    return { revenue, discounts, cogs, operationalExpenses, grossProfit, netProfit, margin, pieData };
  }, [orders, expenses]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) return <div className="h-screen flex items-center justify-center p-20 animate-pulse text-slate-400 font-black uppercase text-xs">Generating Financial Intelligence Hub...</div>;

  return (
    <div className={`max-w-[1600px] mx-auto w-full pt-4 pb-20 ${isMobile ? 'px-4' : 'px-8'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-4">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic underline decoration-indigo-500">
             Profit & Loss Hub
          </h2>
          <p className="text-slate-500 text-sm font-bold opacity-50 uppercase tracking-widest mt-1">Unified Financial Intelligence & ROS Health</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-8 py-4 rounded-[2rem] border border-emerald-100 flex items-center gap-4 shadow-xl shadow-emerald-50/50">
           <ShieldCheck className="w-6 h-6" />
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Operating Margin</p>
              <p className="text-xl font-black italic">{plData.margin.toFixed(1)}%</p>
           </div>
        </div>
      </div>

      {/* TOP LEVEL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white border-2 border-slate-50 p-10 rounded-[3.5rem] shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><TrendingUp className="w-16 h-16" /></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{plData.revenue.toLocaleString()}</h3>
             <div className="mt-4 flex items-center gap-1 text-emerald-500 text-[9px] font-black uppercase">
                <ArrowUpRight className="w-3 h-3" /> Net Sales (Post-Discount)
             </div>
          </div>

          <div className="bg-white border-2 border-slate-50 p-10 rounded-[3.5rem] shadow-sm relative overflow-hidden group hover:border-rose-200 transition-all">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><Package className="w-16 h-16" /></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimated COGS</p>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{plData.cogs.toLocaleString()}</h3>
             <div className="mt-4 flex items-center gap-1 text-slate-400 text-[9px] font-black uppercase">
                <Info className="w-3 h-3" /> Cost of Goods Sold
             </div>
          </div>

          <div className="bg-white border-2 border-slate-50 p-10 rounded-[3.5rem] shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><Wallet className="w-16 h-16" /></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">OpEx (Ledger)</p>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{plData.operationalExpenses.toLocaleString()}</h3>
             <div className="mt-4 flex items-center gap-1 text-amber-600 text-[9px] font-black uppercase">
                <TrendingDown className="w-3 h-3" /> Operational Expenses
             </div>
          </div>

          <div className={`${plData.netProfit >= 0 ? 'bg-slate-900' : 'bg-rose-600'} p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group`}>
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Activity className="w-16 h-16" /></div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Bottom Line (NP)</p>
             <h3 className="text-4xl font-black tracking-tighter italic">₹{plData.netProfit.toLocaleString()}</h3>
             <div className="mt-4 flex items-center gap-1 text-white/40 text-[9px] font-black uppercase tracking-widest">
                Real-time Net Profitability
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* EXPENSE BREAKDOWN */}
          <div className="lg:col-span-1 bg-white border-2 border-slate-50 rounded-[3.5rem] p-10 shadow-sm">
             <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase mb-10 flex items-center gap-3">
                <PieChart className="w-6 h-6 text-indigo-500" /> Expense Logic
             </h3>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <RePie>
                      <Pie
                        data={plData.pieData.length > 0 ? plData.pieData : [{name: 'No Expenses', value: 1}]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {plData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                   </RePie>
                </ResponsiveContainer>
             </div>
             <div className="mt-6 space-y-3">
                {plData.pieData.slice(0, 4).map((entry, index) => (
                   <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{entry.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900 italic">₹{entry.value.toLocaleString()}</span>
                   </div>
                ))}
             </div>
          </div>

          {/* PROFIT MARGIN ANALYSIS */}
          <div className="lg:col-span-2 bg-white border-2 border-slate-50 rounded-[3.5rem] p-10 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase flex items-center gap-3">
                      <BarChart3 className="w-6 h-6 text-emerald-500" /> Profitability Velocity
                   </h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">How your net profit evolves with revenue</p>
                </div>
             </div>
             
             <div className="space-y-12">
                <div className="relative pt-1">
                   <div className="flex mb-2 items-center justify-between">
                      <div>
                         <span className="text-[10px] font-black inline-block py-1 px-3 uppercase rounded-full text-indigo-600 bg-indigo-200">
                            Gross Profit Ratio
                         </span>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-black inline-block text-indigo-600 italic">
                            {((plData.grossProfit / (plData.revenue || 1)) * 100).toFixed(1)}%
                         </span>
                      </div>
                   </div>
                   <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-indigo-50 shadow-inner">
                      <div style={{ width: `${(plData.grossProfit / (plData.revenue || 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000"></div>
                   </div>
                </div>

                <div className="relative pt-1">
                   <div className="flex mb-2 items-center justify-between">
                      <div>
                         <span className="text-[10px] font-black inline-block py-1 px-3 uppercase rounded-full text-emerald-600 bg-emerald-200">
                            Net Profit Ratio
                         </span>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-black inline-block text-emerald-600 italic">
                            {plData.margin.toFixed(1)}%
                         </span>
                      </div>
                   </div>
                   <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-emerald-50 shadow-inner">
                      <div style={{ width: `${plData.margin}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-1000"></div>
                   </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400">
                         <Receipt className="w-7 h-7" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue at Risk (Discounts)</p>
                         <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">₹{plData.discounts.toLocaleString()}</h4>
                         <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mt-1 italic animate-pulse">This revenue was sacrificed for marketing</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      </div>

    </div>
  );
};

export default ProfitLossHub;
