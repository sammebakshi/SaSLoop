import React, { useState, useEffect } from "react";
import { 
  ChefHat, Search, RefreshCw, Layers, 
  Plus, Package, Trash2, Edit3, 
  ArrowRight, Beaker, ClipboardList
} from "lucide-react";
import API_BASE from "../config";

const RecipeMaster = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col space-y-3 animate-pro-in">
            {/* Precision Recipe Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter text-slate-900">Recipe Master</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">Link menu items to raw materials for automated inventory depletion</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-secondary h-7 px-2"><ClipboardList className="w-3 h-3" /> Production Logs</button>
                </div>
            </div>

            {/* Dual-Pane Engineering Theater */}
            <div className="flex-1 flex gap-3 overflow-hidden">
                {/* Pane 1: Catalog Selection */}
                <div className="w-1/3 flex flex-col pro-card bg-white overflow-hidden">
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/30">
                        <div className="flex items-center gap-2 px-2 py-1 bg-white border border-slate-200 rounded">
                            <Search className="w-3 h-3 text-slate-400" />
                            <input type="text" placeholder="Search menu catalog..." className="bg-transparent text-[11px] font-medium outline-none w-full uppercase" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                            <button 
                                key={i}
                                onClick={() => setSelectedItem(i)}
                                className={`w-full flex items-center justify-between p-2 rounded transition-all group ${selectedItem === i ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0 text-left">
                                    <div className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${selectedItem === i ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-white group-hover:border-slate-200'}`}>
                                        <ChefHat className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black uppercase truncate tracking-tight">Signature Dish Alpha_{i}</p>
                                        <p className={`text-[8px] font-bold uppercase tracking-widest ${selectedItem === i ? 'text-white/40' : 'text-slate-300'}`}>CAT_MAIN_COURSE</p>
                                    </div>
                                </div>
                                <ArrowRight className={`w-3 h-3 transition-transform ${selectedItem === i ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pane 2: Engineering Canvas */}
                <div className="flex-1 pro-card bg-white overflow-hidden flex flex-col relative">
                    {!selectedItem ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
                            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                                <Beaker className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-[14px] font-black text-slate-900 uppercase italic tracking-tighter">Recipe Engineering</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select a menu item from the left to start linking ingredients</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                                        <Beaker className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-black text-slate-900 uppercase italic tracking-tighter">Dish Engineering Profile</h3>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recipe Configuration for: <span className="text-indigo-600">Alpha_{selectedItem}</span></p>
                                    </div>
                                </div>
                                <button className="pro-btn-primary h-8 px-4 flex items-center gap-2">
                                    <Plus className="w-3.5 h-3.5" /> Add Ingredient
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center opacity-10">
                                <Layers className="w-16 h-16 text-slate-300" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">No ingredients mapped yet</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeMaster;
