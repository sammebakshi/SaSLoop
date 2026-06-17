import React, { useState, useEffect } from "react";
import { 
  Package, Box, Trash2, Search, 
  RefreshCw, Filter, Edit3, Boxes,
  AlertTriangle, TrendingUp, DollarSign,
  Plus, History, Truck
} from "lucide-react";
import API_BASE from "../config";

const InventoryMaster = () => {
    const [activeTab, setActiveTab] = useState("RAW");

    return (
        <div className="space-y-3 animate-pro-in">
            {/* Precision Inventory Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter">Inventory Master</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">Control center for raw materials & stock telemetry</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-primary h-7 px-3"><Plus className="w-3 h-3" /> New Raw Material</button>
                </div>
            </div>

            {/* Tactical Navigation */}
            <div className="flex items-center gap-1 bg-white pro-card p-1">
                {[
                    { id: 'RAW', name: 'Raw Materials', icon: Box },
                    { id: 'STOCK', name: 'Stock In/Out', icon: History },
                    { id: 'VENDOR', name: 'Vendor Master', icon: Truck }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <tab.icon className="w-3.5 h-3.5" /> {tab.name}
                    </button>
                ))}
            </div>

            {/* Quick Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                    { label: 'Total Items', val: '0', icon: Boxes, color: 'emerald' },
                    { label: 'Low Stock Alerts', val: '0', icon: AlertTriangle, color: 'rose' },
                    { label: 'Inventory Value', val: '₹0', icon: DollarSign, color: 'indigo' },
                    { label: 'Wastage (MTD)', val: '₹0', icon: TrendingUp, color: 'slate' }
                ].map((stat, i) => (
                    <div key={i} className="pro-card p-3 flex items-center justify-between group hover:border-slate-400 transition-all">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-lg font-black text-slate-900 italic tracking-tighter">{stat.val}</p>
                        </div>
                        <div className={`w-8 h-8 rounded bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500`}>
                            <stat.icon className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Data Matrix Theater */}
            <div className="pro-card min-h-[400px] flex flex-col bg-white">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 max-w-sm">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <input type="text" placeholder="Search by name or category..." className="bg-transparent text-[12px] font-medium outline-none w-full" />
                    </div>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Filter className="w-3.5 h-3.5" /></button>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th>Item Identity</th>
                                <th>Category</th>
                                <th>Unit Scale</th>
                                <th>Current Stock</th>
                                <th>Min Stock</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="6" className="py-20 text-center pro-subheading opacity-30">
                                    <div className="flex flex-col items-center gap-2">
                                        <Package className="w-10 h-10 text-slate-200" />
                                        <span>Inventory Vault Empty</span>
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

export default InventoryMaster;
