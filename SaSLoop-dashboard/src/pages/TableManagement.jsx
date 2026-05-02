import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRightLeft, 
  Trash2, 
  Plus, 
  MousePointer2,
  Lock,
  Unlock
} from "lucide-react";
import API_BASE from "../config";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 10000); // Poll every 10s for status updates
    return () => clearInterval(interval);
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pos/tables`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setTables(data);
    } catch (e) { console.error("Fetch tables fail:", e); }
    finally { setLoading(false); }
  };

  const syncLayout = async () => {
    setIsSaving(true);
    try {
      await fetch(`${API_BASE}/api/pos/tables/sync`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ tables })
      });
      setIsEditMode(false);
      alert("✅ Floor plan layout saved successfully!");
    } catch (e) { alert("❌ Failed to save layout"); }
    finally { setIsSaving(false); }
  };

  const updateTableStatus = async (tableName, newStatus) => {
    try {
      await fetch(`${API_BASE}/api/pos/tables/${tableName}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTables();
      setSelectedTable(null);
    } catch (e) { alert("Failed to update status"); }
  };

  const addNewTable = () => {
    const name = prompt("Table Name (e.g. T6):");
    if (!name) return;
    const newTable = {
      table_name: name,
      x_pos: 100,
      y_pos: 100,
      capacity: 4,
      status: "AVAILABLE"
    };
    setTables([...tables, newTable]);
    setIsEditMode(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE": return "bg-emerald-500 shadow-emerald-200/50";
      case "OCCUPIED": return "bg-indigo-600 shadow-indigo-200/50";
      case "BILLED": return "bg-amber-500 shadow-amber-200/50";
      case "DIRTY": return "bg-slate-400 shadow-slate-200/50";
      default: return "bg-slate-200";
    }
  };

  const getDuration = (isoString) => {
    if (!isoString) return null;
    const diff = Math.floor((new Date() - new Date(isoString)) / 60000);
    return `${diff}m`;
  };

  const handleDragEnd = (id, info) => {
    if (!isEditMode) return;
    const newTables = tables.map(t => 
      t.id === id ? { ...t, x_pos: t.x_pos + info.offset.x, y_pos: t.y_pos + info.offset.y } : t
    );
    setTables(newTables);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-50 overflow-hidden font-sans">
      {/* Header / Stats */}
      <div className="px-10 py-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase italic">Floor Plan Console</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Real-time Table Orchestration</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-8 px-8 border-r border-slate-100">
            {[
              { label: "Available", count: tables.filter(t => t.status === "AVAILABLE").length, color: "bg-emerald-500" },
              { label: "Occupied", count: tables.filter(t => t.status === "OCCUPIED").length, color: "bg-indigo-600" },
              { label: "Billed", count: tables.filter(t => t.status === "BILLED").length, color: "bg-amber-500" }
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${stat.color} animate-pulse`}></div>
                  <span className="text-xl font-black text-slate-900 leading-none italic">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => isEditMode ? syncLayout() : setIsEditMode(true)}
            disabled={isSaving}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${isEditMode ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-indigo-100'}`}
          >
            {isEditMode ? (isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />) : <Lock className="w-4 h-4" />}
            {isEditMode ? (isSaving ? 'Saving...' : 'Save Layout') : 'Rearrange Floor'}
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px]">
        {loading ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-[200]">
              <RefreshCw className="animate-spin w-10 h-10 text-indigo-600 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Floor Plan...</p>
           </div>
        ) : null}
        
        {/* Floor Map Container */}
        <div className="absolute inset-0 p-10">
          <AnimatePresence>
            {tables.map((table) => (
              <motion.div
                key={table.id || table.table_name}
                drag={isEditMode}
                dragMomentum={false}
                onDragEnd={(e, info) => handleDragEnd(table.id, info)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: table.x_pos,
                    y: table.y_pos 
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !isEditMode && setSelectedTable(table)}
                className={`absolute w-32 h-32 rounded-3xl cursor-pointer flex flex-col items-center justify-center transition-all duration-300 border-4 ${selectedTable?.id === table.id ? 'border-indigo-600 scale-110 shadow-2xl z-50' : 'border-transparent shadow-xl'} bg-white group`}
              >
                {/* Status Dot */}
                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${getStatusColor(table.status)} shadow-lg`}></div>
                
                {/* Table ID */}
                <span className="text-2xl font-black text-slate-900 tracking-tighter mb-1 italic">{table.table_name}</span>
                
                {/* Capacity */}
                <div className="flex items-center gap-1 opacity-40">
                  <Users className="w-3 h-3" />
                  <span className="text-[10px] font-black">{table.capacity}</span>
                </div>

                {/* Info Layer (Only for Occupied/Billed) */}
                {(table.status === "OCCUPIED" || table.status === "BILLED") && (
                  <div className="mt-2 px-3 py-1 bg-slate-50 rounded-lg flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[9px] font-black text-slate-500">{getDuration(table.updated_at)}</span>
                  </div>
                )}

                {/* Interaction Glow */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity ${getStatusColor(table.status)}`}></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Selected Table Side Panel */}
        <AnimatePresence>
          {selectedTable && (
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="absolute top-0 right-0 bottom-0 w-96 bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.05)] border-l border-slate-100 z-[300] flex flex-col"
            >
              <div className="p-10 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Table {selectedTable.table_name}</h2>
                  <button onClick={() => setSelectedTable(null)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <div className={`p-6 rounded-[2rem] mb-10 flex items-center justify-between ${getStatusColor(selectedTable.status).replace('bg-', 'bg-')}/10 border-2 border-dashed ${getStatusColor(selectedTable.status).replace('bg-', 'border-')}`}>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
                    <p className={`text-sm font-black uppercase italic ${getStatusColor(selectedTable.status).replace('bg-', 'text-')}`}>{selectedTable.status}</p>
                  </div>
                  {selectedTable.status === "AVAILABLE" ? (
                    <button 
                      onClick={() => updateTableStatus(selectedTable.table_name, "OCCUPIED")}
                      className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-all"
                    >
                      Seat Guests
                    </button>
                  ) : (
                    <div className="flex flex-col items-end">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Status Duration</p>
                      <p className="text-sm font-black text-slate-900 italic">{getDuration(selectedTable.updated_at)}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Table Actions</p>
                  
                  <button className="w-full p-6 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-[2rem] flex items-center justify-between transition-all group active:scale-95">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white group-hover:bg-indigo-500/50 rounded-2xl shadow-sm"><ArrowRightLeft className="w-5 h-5" /></div>
                      <span className="text-sm font-bold tracking-tight">Transfer Table</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => updateTableStatus(selectedTable.table_name, "BILLED")}
                    className="w-full p-6 bg-slate-50 hover:bg-amber-500 hover:text-white rounded-[2rem] flex items-center justify-between transition-all group active:scale-95"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white group-hover:bg-amber-400/50 rounded-2xl shadow-sm"><CheckCircle2 className="w-5 h-5" /></div>
                      <span className="text-sm font-bold tracking-tight">Request Bill</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => updateTableStatus(selectedTable.table_name, "DIRTY")}
                    className="w-full p-6 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-[2rem] flex items-center justify-between transition-all group active:scale-95"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white group-hover:bg-slate-700/50 rounded-2xl shadow-sm"><AlertCircle className="w-5 h-5" /></div>
                      <span className="text-sm font-bold tracking-tight">Mark as Dirty</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => updateTableStatus(selectedTable.table_name, "AVAILABLE")}
                    className="w-full p-6 bg-slate-50 hover:bg-emerald-500 hover:text-white rounded-[2rem] flex items-center justify-between transition-all group active:scale-95"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white group-hover:bg-emerald-400/50 rounded-2xl shadow-sm"><RefreshCw className="w-5 h-5" /></div>
                      <span className="text-sm font-bold tracking-tight">Mark Available</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4 shrink-0">
                  <button onClick={() => window.open('/pos', '_blank')} className="flex-1 bg-slate-900 text-white h-16 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Open Full Order</button>
                  <button className="w-16 h-16 bg-white border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-95"><Trash2 className="w-5 h-5" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar */}
        <div className="absolute bottom-10 left-10 flex items-center gap-4">
           <div className="flex bg-white/80 backdrop-blur-3xl p-2 rounded-[2rem] shadow-2xl border border-slate-100 gap-2">
              <button onClick={() => setIsEditMode(true)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100"><MousePointer2 className="w-5 h-5" /></button>
              <button onClick={addNewTable} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-colors"><Plus className="w-5 h-5 text-slate-400" /></button>
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-colors"><ArrowRightLeft className="w-5 h-5 text-slate-400" /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TableManagement;
