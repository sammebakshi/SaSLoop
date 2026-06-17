import React, { useState, useEffect } from "react";
import { 
  Users, Search, RefreshCw, Filter, 
  Download, Plus, Upload, UserCheck, 
  Database, Smartphone, MapPin, Award,
  ChevronDown, Edit3, Trash2, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const CustomerDirectory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/crm/customers`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredData = data.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.phone.includes(searchTerm) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Identity Directory</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Loyalty points, market-level identities & engagement artifacts</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                        <Download className="w-3.5 h-3.5" /> Manifest Template
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Plus className="w-3.5 h-3.5" /> Add Customer Artifact
                    </button>
                </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm flex items-center gap-4 relative overflow-hidden group">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="FILTER IDENTITIES BY NAME, PHONE OR MATRIX ID..." 
                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="h-10 px-4 bg-slate-50 border border-slate-200 text-slate-600 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" /> Batch Import
                </button>
                <button className="h-10 w-10 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400 rounded-md hover:bg-slate-100 transition-all">
                    <Filter className="w-4 h-4" />
                </button>
                <Users className="absolute -right-12 -bottom-12 w-48 h-48 text-indigo-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Identity Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Identity Matrix Manifest
                    </h3>
                    <RefreshCw className={`w-4 h-4 text-indigo-200 ${loading ? 'animate-spin' : ''}`} onClick={fetchData} />
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity Matrix</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Temporal</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Geography</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Loyalty Assets</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Market Context</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Identity Vaults...</td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <UserCheck className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Identity Matrix Clean</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Provisioned</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 uppercase tracking-tight text-[13px]">{item.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">UID_{item.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-bold text-slate-700 tracking-tight">{item.phone}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.email || 'NO_EMAIL_ARTIFACT'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-slate-500">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.city || 'GLOBAL'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Award className="w-4 h-4 text-amber-500" />
                                            <span className="text-[13px] font-bold text-slate-900 tracking-tight">{item.points || '0'} PTS</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${item.segment === 'VIP' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                            {item.segment || 'STANDARD'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                                            <button className="p-2 hover:bg-rose-50 rounded text-rose-400 hover:text-rose-600 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerDirectory;
