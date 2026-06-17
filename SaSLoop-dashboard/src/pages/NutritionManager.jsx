import React from "react";
import { 
  Apple, Flame, AlertTriangle, Layers, 
  Plus, Search, Filter, Beaker
} from "lucide-react";

const NutritionManager = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                        <Apple className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Nutrition Intel</h2>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Macro tracking & allergen transparency</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Plus className="w-3.5 h-3.5" /> Configure Nutrition
                    </button>
                </div>
            </div>

            {/* Macro Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Tracked Items', val: '0', icon: Apple, color: 'emerald' },
                    { label: 'Avg Calories', val: '0', icon: Flame, color: 'rose' },
                    { label: 'Allergen Alerts', val: '0', icon: AlertTriangle, color: 'amber' },
                    { label: 'Active Menus', val: 'Global', icon: Layers, color: 'indigo' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-lg shadow-sm p-4 flex items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group cursor-pointer">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-[18px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">{stat.val}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:bg-${stat.color}-600 dark:group-hover:bg-${stat.color}-500 group-hover:text-white transition-all`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Macro Matrix Theater */}
            <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/5">
                    <div className="flex items-center gap-3 flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <input type="text" placeholder="Search product macro profiles..." className="bg-transparent text-[11px] font-bold text-slate-600 dark:text-white outline-none w-full uppercase placeholder:text-slate-300 dark:placeholder:text-slate-600" />
                    </div>
                    <button className="p-2 hover:bg-white dark:hover:bg-white/5 rounded-md text-slate-400 dark:text-slate-500 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"><Filter className="w-4 h-4" /></button>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Identity</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Macros (C/P/F/C)</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Allergen Profile</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Serving Scale</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            <tr>
                                <td colSpan="5" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center">
                                            <Beaker className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Macro Vault Empty: No Configurations Provisioned</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NutritionManager;
