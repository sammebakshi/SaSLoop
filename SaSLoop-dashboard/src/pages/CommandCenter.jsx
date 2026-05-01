import React, { useState, useEffect } from "react";
import { 
  Globe, Zap, Users, ShoppingBag, TrendingUp, ArrowUpRight, 
  MapPin, Activity, ShieldCheck, Layers, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE from "../config";

const stores = [
  { id: 1, name: "Downtown Elite", lat: 12.9716, lng: 77.5946, status: "Busy", revenue: "₹45k", orders: 12, growth: "+15%" },
  { id: 2, name: "Sunset Boulevard", lat: 12.9352, lng: 77.6245, status: "Normal", revenue: "₹28k", orders: 8, growth: "+8%" },
  { id: 3, name: "Central Hub", lat: 12.9591, lng: 77.6407, status: "High Demand", revenue: "₹52k", orders: 18, growth: "+22%" }
];

function CommandCenter() {
  const [activeStore, setActiveStore] = useState(stores[0]);
  const [pulses, setPulses] = useState([]);

  // Mock real-time order pulses
  useEffect(() => {
    const interval = setInterval(() => {
      const newPulse = {
        id: Date.now(),
        storeId: Math.floor(Math.random() * 3) + 1,
        amount: Math.floor(Math.random() * 1000) + 100
      };
      setPulses(prev => [...prev.slice(-5), newPulse]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-[#020617] text-white p-8 overflow-hidden flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Live Global Command</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic italic-shadow">Multi-Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500 underline decoration-indigo-500/30">Twin</span></h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[1.5rem] backdrop-blur-xl">
            <div className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-1">Total Network Revenue</div>
            <div className="text-2xl font-black tracking-tighter">₹1,25,000 <span className="text-xs text-emerald-400 font-bold ml-2">↑ 18%</span></div>
          </div>
          <button className="bg-indigo-600 px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20">
            System Settings
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* MAP AREA (MOCKED 3D LOOK) */}
        <div className="flex-[3] bg-white/5 rounded-[3rem] border border-white/10 relative overflow-hidden group">
          {/* MOCK MAP GRID */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          {/* MOCK CONTINENTS / REGIONS */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <Globe className="w-96 h-96 text-white/5 animate-pulse" />
          </div>

          {/* STORE NODES */}
          {stores.map(store => (
            <motion.div 
              key={store.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setActiveStore(store)}
              className={`absolute cursor-pointer p-4 rounded-3xl border-2 transition-all flex items-center gap-3 backdrop-blur-2xl ${activeStore.id === store.id ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_50px_rgba(79,70,229,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              style={{ left: `${(store.lat - 12.9) * 2000}%`, top: `${(store.lng - 77.5) * 2000}%` }}
            >
              <div className={`w-3 h-3 rounded-full ${store.status === 'Busy' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <div className="text-[10px] font-black uppercase tracking-widest">{store.name}</div>
              
              <AnimatePresence>
                {pulses.filter(p => p.storeId === store.id).map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0, opacity: 1, y: 0 }}
                    animate={{ scale: 4, opacity: 0, y: -50 }}
                    className="absolute inset-0 border border-indigo-400 rounded-3xl pointer-events-none"
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* OVERLAYS */}
          <div className="absolute bottom-8 left-8 p-6 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 max-w-xs">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
              <Activity className="w-3 h-3" /> System Health
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/60">Node Latency</span>
                <span className="text-emerald-400 font-black tracking-tighter">12ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/60">AI Sync Rate</span>
                <span className="text-indigo-400 font-black tracking-tighter">99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR INTEL */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pr-2">
          {/* ACTIVE STORE CARD */}
          <motion.div 
            key={activeStore.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-indigo-900/20 to-transparent p-8 rounded-[3rem] border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">{activeStore.name}</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2">{activeStore.status}</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-indigo-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-2xl">
                <div className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Revenue</div>
                <div className="text-xl font-black">{activeStore.revenue}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl">
                <div className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Live Orders</div>
                <div className="text-xl font-black">{activeStore.orders}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Growth Trend</span>
                </div>
                <span className="text-emerald-400 font-black">{activeStore.growth}</span>
              </div>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                Enter Digital Twin
              </button>
            </div>
          </motion.div>

          {/* NETWORK STATS */}
          <div className="grid grid-cols-1 gap-4">
             <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-widest">Processing Speed</div>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "85%" }}
                     className="h-full bg-emerald-500"
                   />
                </div>
                <div className="flex justify-between mt-2">
                   <span className="text-[8px] text-white/40 uppercase">Optimized</span>
                   <span className="text-[10px] font-black tracking-tighter text-emerald-400">85%</span>
                </div>
             </div>

             <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-indigo-500" />
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-widest">Security Mesh</div>
                </div>
                <div className="text-2xl font-black tracking-tighter">L4 ENCRYPTED</div>
                <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Real-time threat detection active</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandCenter;
