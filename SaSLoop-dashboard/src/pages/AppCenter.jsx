import React from "react";
import { Smartphone, Download, ShieldCheck, Zap, Globe, MessageSquare } from "lucide-react";

function AppCenter() {
  const dashboardUrl = window.location.origin;

  const steps = [
    {
      title: "Open Dashboard on Phone",
      desc: `Open your mobile browser and navigate to your dashboard URL.`,
      icon: Globe
    },
    {
      title: "Add to Home Screen",
      desc: "Tap the browser menu (⋮ or share icon) and select 'Add to Home Screen' or 'Install App'.",
      icon: Download
    },
    {
      title: "Launch SaSLoop AI",
      desc: "A native-looking SaSLoop icon will appear on your phone. Open it to manage chats and orders on the go!",
      icon: Zap
    }
  ];

  return (
    <div className="max-w-[1000px] mx-auto w-full pt-10 pb-20 px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2.5rem] mb-6 shadow-xl shadow-indigo-100">
          <Smartphone className="w-10 h-10" />
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Mobile App Hub</h2>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] opacity-60">Install SaSLoop AI on your Android or iOS Device</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500" /> Professional PWA Tech
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              We use <strong>Progressive Web App (PWA)</strong> technology. This means you don't need to download a heavy APK from untrusted sources. Our app installs directly from the browser, stays updated automatically, and takes up minimal space.
            </p>
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0 font-black text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-1">{step.title}</h4>
                    <p className="text-xs text-slate-400 font-bold leading-normal">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

         <div className="flex flex-col items-center">
            <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-4 border-indigo-50 flex flex-col items-center gap-8 group transition-all hover:scale-[1.02] w-full max-w-sm">
               <div className="relative">
                  <div className="w-56 h-56 bg-white border-8 border-slate-50 rounded-[3rem] p-6 flex items-center justify-center shadow-inner">
                     <img 
                       src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(dashboardUrl)}`} 
                       alt="Scan to Open" 
                       className="w-full h-full object-contain"
                     />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
                     <Smartphone className="w-8 h-8" />
                  </div>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.3em] mb-2">Scan with Phone</p>
                  <h4 className="text-xl font-black text-slate-800">Instant Web Panel</h4>
               </div>
            </div>
            
            <div className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] mt-8 w-full max-w-sm">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" /> Native Source Ready
                </h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-4">
                   I have pre-configured the **Capacitor** native bridge for you. Your Android source code is generated and ready in the <span className="text-indigo-600 font-mono">/android</span> folder.
                </p>
                <div className="space-y-3">
                   <div className="text-[10px] text-slate-500 flex gap-2">
                      <span className="text-emerald-500 font-black">✓</span> Capacitor Bridge Initialized
                   </div>
                   <div className="text-[10px] text-slate-500 flex gap-2">
                      <span className="text-emerald-500 font-black">✓</span> Web Bundle Synchronized
                   </div>
                   <div className="text-[10px] text-slate-500 flex gap-2">
                       <span className="text-emerald-500 font-black">✓</span> Full Panel & Live Chat Support
                   </div>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-slate-950 p-14 rounded-[4rem] text-white flex flex-col lg:flex-row items-center gap-12 shadow-2xl overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
         <div className="relative z-10 space-y-6 max-w-xl">
            <div className="inline-flex px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">Native Distribution</div>
            <h4 className="text-4xl font-black tracking-tight leading-none uppercase">Generate Your .APK</h4>
            <p className="text-sm text-slate-400 font-bold leading-relaxed">
               I have prepared the raw Android project for you. Since your system has the proper SDKs locally, follow these 3 steps to get your **.apk** on your phone:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Step 1</p>
                   <p className="text-xs font-bold">Open **Android Studio**</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Step 2</p>
                   <p className="text-xs font-bold">Import the <span className="text-white">/android</span> folder</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Step 3</p>
                   <p className="text-xs font-bold">Build &gt; Build Bundle/APK</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Step 4</p>
                   <p className="text-xs font-bold">Transfer .apk to Phone & Install</p>
                </div>
            </div>
         </div>
         <div className="relative z-10 p-2 bg-white/5 rounded-[3rem] border border-white/10">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
                <Smartphone className="w-20 h-20 text-indigo-400 mb-4 animate-bounce" />
                <h5 className="font-black text-xs uppercase tracking-widest text-center">Ready to Sync</h5>
            </div>
         </div>
      </div>
    </div>
  );
}

export default AppCenter;
