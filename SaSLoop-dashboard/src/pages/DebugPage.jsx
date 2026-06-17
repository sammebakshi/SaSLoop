import React from "react";

function DebugPage() {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  
  return (
    <div className="p-20 font-mono">
      <h1 className="text-2xl font-black mb-10">SaSLoop Diagnostic Hub</h1>
      
      <div className="space-y-10">
        <section>
          <h2 className="text-emerald-500 font-bold uppercase mb-2">User Object</h2>
          <pre className="bg-slate-900 text-emerald-400 p-6 rounded-2xl overflow-auto">
            {JSON.stringify(JSON.parse(user || "{}"), null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-emerald-500 font-bold uppercase mb-2">Auth Token</h2>
          <pre className="bg-slate-900 text-slate-400 p-6 rounded-2xl overflow-auto break-all">
            {token || "MISSING"}
          </pre>
        </section>

        <section>
          <h2 className="text-emerald-500 font-bold uppercase mb-2">Browser Info</h2>
          <pre className="bg-slate-50 p-6 rounded-2xl text-xs">
            {navigator.userAgent}
          </pre>
        </section>
        
        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          className="bg-rose-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest"
        >
          Clear Storage & Reset
        </button>
      </div>
    </div>
  );
}

export default DebugPage;
