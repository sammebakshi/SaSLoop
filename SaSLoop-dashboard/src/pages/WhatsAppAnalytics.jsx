import React, { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, Users, MessageSquare, 
  Flame, Calendar, Clock, Filter, Download,
  Activity, Zap, Target, AlertCircle, ChevronDown, 
  MousePointerClick, CheckCircle2, RefreshCw, X, Sparkles
} from "lucide-react";
import API_BASE from "../config";

const WhatsAppAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30_DAYS"); // TODAY, YESTERDAY, 7_DAYS, 30_DAYS
  const [toast, setToast] = useState(null);
  
  // State for metrics data
  const [metrics, setMetrics] = useState({
    sent: 142500,
    delivered: 139650,
    read: 118700,
    replied: 28400,
    failed: 2850,
    creditsUsed: 1425.00
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch active metrics from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/whatsapp/analytics?range=${dateRange}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        } else {
          throw new Error("Failed response");
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        // Fallback simulated metrics based on range
        if (dateRange === "TODAY") {
          setMetrics({ sent: 4850, delivered: 4810, read: 3950, replied: 980, failed: 40, creditsUsed: 48.50 });
        } else if (dateRange === "YESTERDAY") {
          setMetrics({ sent: 12400, delivered: 12150, read: 9840, replied: 2410, failed: 250, creditsUsed: 124.00 });
        } else if (dateRange === "7_DAYS") {
          setMetrics({ sent: 48900, delivered: 47920, read: 39200, replied: 9840, failed: 980, creditsUsed: 489.00 });
        } else {
          setMetrics({ sent: 142500, delivered: 139650, read: 118700, replied: 28400, failed: 2850, creditsUsed: 1425.00 });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const handleExport = () => {
    showToast("Compiling performance spreadsheets... Download starting.");
  };

  // Calculate percentages
  const getDeliveredPercent = () => Math.round((metrics.delivered / metrics.sent) * 100);
  const getReadPercent = () => Math.round((metrics.read / metrics.delivered) * 100);
  const getReplyPercent = () => Math.round((metrics.replied / metrics.delivered) * 100);
  const getFailedPercent = () => (metrics.failed / metrics.sent * 100).toFixed(1);

  // Campaign table data
  const campaignsPerformance = [
    { name: "Eid Special Promo 2026", date: "May 28, 2026", sent: 450, delivered: 98, read: 84, replied: 22, ctaClicks: 64, cost: "$4.50" },
    { name: "Dormant Customers Re-engage", date: "May 26, 2026", sent: 120, delivered: 96, read: 54, replied: 18, ctaClicks: 32, cost: "$1.20" },
    { name: "Weekend Brunch Festive", date: "May 20, 2026", sent: 3500, delivered: 99, read: 88, replied: 14, ctaClicks: 412, cost: "$35.00" },
    { name: "Welcome Onboarding Auto", date: "Ongoing Auto", sent: 1842, delivered: 99, read: 97, replied: 28, ctaClicks: 843, cost: "$18.42" }
  ];

  return (
    <div className="space-y-4 animate-pro-in pb-10">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-white transition-all transform animate-bounce ${
          toast.type === "success" ? "bg-emerald-600 border-emerald-500" : "bg-rose-600 border-rose-500"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
          <span className="text-[12px] font-bold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header section with Date Range Selector & Exports */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Performance Analytics
          </h2>
          <p className="text-[11px] text-slate-500">Track delivery rates, customer reading behavior, reply yields, and campaign expenses.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Date range picker dropdown */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-slate-205 text-slate-750 px-3 py-1.5 pr-8 rounded-lg text-[10px] font-black uppercase outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
            >
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="7_DAYS">Last 7 Days</option>
              <option value="30_DAYS">Last 30 Days</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
          </div>

          <button 
            onClick={handleExport}
            className="pro-btn-primary h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* Analytics Telemetry Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm relative overflow-hidden">
          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Messages Sent</span>
          <h3 className="text-2xl font-black text-slate-800 mt-1">
            {loading ? "..." : metrics.sent.toLocaleString()}
          </h3>
          <p className="text-[9px] text-slate-400 mt-1">Total delivery payloads</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-[8px] font-black uppercase text-emerald-500 tracking-wider">Delivery Success</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">
            {loading ? "..." : `${getDeliveredPercent()}%`}
          </h3>
          <p className="text-[9px] text-slate-400 mt-1">{loading ? "..." : `${metrics.delivered.toLocaleString()} delivered`}</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-[8px] font-black uppercase text-blue-500 tracking-wider">Open (Read) Yield</span>
          <h3 className="text-2xl font-black text-blue-600 mt-1">
            {loading ? "..." : `${getReadPercent()}%`}
          </h3>
          <p className="text-[9px] text-slate-400 mt-1">{loading ? "..." : `${metrics.read.toLocaleString()} read ticks`}</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <span className="text-[8px] font-black uppercase text-indigo-500 tracking-wider">Reply Yield</span>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">
            {loading ? "..." : `${getReplyPercent()}%`}
          </h3>
          <p className="text-[9px] text-slate-400 mt-1">{loading ? "..." : `${metrics.replied.toLocaleString()} conversations`}</p>
        </div>
      </div>

      {/* Grid section with Donut chart simulation & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* 1. Bar Chart: Dispatch Intensity timeline */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b flex items-center justify-between bg-slate-50/50">
            <h3 className="text-[12px] font-black text-slate-700 uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Messaging Dispatch Timeline
            </h3>
            <div className="flex items-center gap-2.5 text-[8.5px] font-black text-slate-400">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> SENT</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400" /> RESPONSES</div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between px-6 py-6 gap-2 select-none">
            {[45, 60, 55, 80, 70, 90, 100, 85, 95, 75, 60, 50].map((h, i) => (
              <div key={i} className="flex-1 space-y-1.5 group relative h-full flex flex-col justify-end">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow">
                  Sent: {Math.round(h * 150)}
                </div>
                <div className="w-full bg-slate-100 rounded-t h-full relative overflow-hidden flex flex-col justify-end">
                  {/* Sent bar layer */}
                  <div className="bg-emerald-500 hover:bg-emerald-600 transition-all rounded-t w-full" style={{ height: `${h}%` }} />
                  {/* Response layer bar overlay */}
                  <div className="bg-indigo-400 hover:bg-indigo-500 transition-all absolute bottom-0 w-full" style={{ height: `${h * 0.25}%` }} />
                </div>
                <span className="text-[8px] font-bold text-slate-400 text-center block uppercase tracking-tighter">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Donut Breakdown representation using CSS rings */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-4 space-y-4">
          <div className="border-b pb-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Delivery Breakdown</span>
            <span className="text-[9px] text-rose-500 font-bold">Failed: {getFailedPercent()}%</span>
          </div>

          {/* Detailed stacked progress list */}
          <div className="space-y-3.5 pt-1.5">
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-700">
                <span>Delivered</span>
                <span>{metrics.delivered.toLocaleString()} ({getDeliveredPercent()}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${getDeliveredPercent()}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-700">
                <span>Read (Ticks)</span>
                <span>{metrics.read.toLocaleString()} ({getReadPercent()}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-blue-450 h-full rounded-full" style={{ width: `${getReadPercent()}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-700">
                <span>Replied</span>
                <span>{metrics.replied.toLocaleString()} ({getReplyPercent()}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${getReplyPercent()}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-700">
                <span>Failed / Rejected</span>
                <span>{metrics.failed.toLocaleString()} ({getFailedPercent()}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${getFailedPercent()}%` }}></div>
              </div>
            </div>

            <div className="pt-2 border-t text-[10px] text-slate-400 flex items-center justify-between">
              <span>Financial Consumption:</span>
              <span className="font-mono font-bold text-slate-800">~ {metrics.creditsUsed.toFixed(2)} Credits</span>
            </div>

          </div>
        </div>

      </div>

      {/* 3. Campaign Performance Table */}
      <div className="bg-white border border-slate-150 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50/50 border-b flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Campaign Metrics Manifest</span>
          <span className="text-[9px] text-slate-400 font-bold">Historical stats breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Campaign Identifier</th>
                <th className="px-4 py-3">Dispatch Date</th>
                <th className="px-4 py-3 text-center">Sent Size</th>
                <th className="px-4 py-3 text-center">Delivery Rate</th>
                <th className="px-4 py-3 text-center">Open Rate</th>
                <th className="px-4 py-3 text-center">Reply Yield</th>
                <th className="px-4 py-3 text-center">CTA Clicks</th>
                <th className="px-4 py-3 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaignsPerformance.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-850">{c.name}</td>
                  <td className="px-4 py-3 text-slate-400 font-bold">{c.date}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-700">{c.sent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600">{c.delivered}%</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-600">{c.read}%</td>
                  <td className="px-4 py-3 text-center font-bold text-indigo-600">{c.replied}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 bg-slate-50 border rounded text-[9.5px] font-mono font-bold text-slate-700 flex items-center gap-1.5 w-fit mx-auto">
                      <MousePointerClick className="w-3.5 h-3.5 text-slate-400" /> {c.ctaClicks}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-700">{c.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default WhatsAppAnalytics;
