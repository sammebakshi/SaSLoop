import React, { useState, useEffect } from "react";
import { 
  Upload, FileSpreadsheet, Download, RefreshCw, 
  CheckCircle2, AlertCircle, ArrowLeft, 
  FileText, Database, ShieldCheck, Zap, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";

const BulkUploadManager = () => {
    const navigate = useNavigate();

    const downloadTemplate = () => {
        const headers = [
            "Short Code", "Title", "Tax Product Group", "Food Type", "Category", 
            "Sub Category", "Kitchen Dept", "Description", "Stock", "Base Item Price", 
            "IsActive", "Item Type", "Crm Title", "Preparation Time", "Item Sort", 
            "Is Recommended", "HSN Code", "Discounted Tags", "Unit", "Is Furnished", 
            "Platform Status", "Sync to Aggregators", "Alternative Meat Type", 
            "Exclude Platforms", "ONDC Category", "Alternative Serve"
        ];
        
        const sampleData = [
            "DG1", "PLAIN OMELETTE", "FOOD", "Other", "BREAKFAST", "BREAKFAST", "Food Kitchen", "", "40", "60", "0", "0", "", "30", "0", "0", "", "0 services", "", "0", "1", "0", "0", "0", "0", "0",
            "DG2", "MASALA OMELETTE", "FOOD", "Other", "BREAKFAST", "BREAKFAST", "Food Kitchen", "", "40", "70", "0", "1", "", "30", "0", "0", "", "0 services", "", "0", "1", "0", "0", "0", "0", "0"
        ];

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + sampleData.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "SaSLoop_Standard_Menu_Template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-md text-slate-400 border border-slate-200 transition-all"><ArrowLeft className="w-4 h-4" /></button>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Bulk Catalog Deployment</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deploy massive menus via professional excel mapping</p>
                    </div>
                </div>
                <button 
                    onClick={downloadTemplate}
                    className="px-4 py-2 bg-indigo-600 border border-indigo-500 rounded-md text-[10px] font-bold text-white uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20"
                >
                    <Download className="w-3.5 h-3.5" /> Download Standard Template
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Configuration Hub */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Menu Catalog</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 text-[11px] font-bold uppercase tracking-tight outline-none focus:border-indigo-500 transition-all">
                                <option>Select Target Menu...</option>
                                <option>Main Store Menu</option>
                                <option>Ramadan Special</option>
                            </select>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-indigo-500" />
                                <h4 className="text-[11px] font-bold uppercase tracking-tight text-slate-800">Hierarchical Logic</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Item Type [0]</span>
                                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded font-bold uppercase">Main Item</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase">Creates a primary product node in the registry.</p>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Item Type [1]</span>
                                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded font-bold uppercase">Option Node</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase">Binds as a mandatory option to the preceding main item.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5 relative overflow-hidden group">
                        <div className="relative z-10 space-y-2">
                            <h4 className="text-[12px] font-bold uppercase tracking-tight flex items-center gap-2 text-indigo-900"><ShieldCheck className="w-4 h-4 text-indigo-600" /> SaSLoop Standard</h4>
                            <p className="text-[10px] font-medium text-indigo-600/80 uppercase leading-relaxed">This module uses the standardized 26-column enterprise mapping for hierarchical menu deployment.</p>
                        </div>
                    </div>
                </div>

                {/* Dropzone Theater */}
                <div className="lg:col-span-8">
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-lg shadow-sm h-full min-h-[450px] flex flex-col items-center justify-center p-12 text-center group hover:border-indigo-400 transition-all cursor-pointer relative">
                        <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-500">
                            <FileSpreadsheet className="w-12 h-12 text-emerald-500 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <h3 className="text-[18px] font-bold text-slate-800 uppercase tracking-tight mb-2">Drop Excel File Here</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">or click to browse your physical filesystem</p>
                        
                        <div className="mt-12 flex items-center gap-8 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700">
                            <div className="flex flex-col items-center gap-2">
                                <FileText className="w-6 h-6 text-indigo-500" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Validate</span>
                            </div>
                            <div className="w-10 h-[2px] bg-slate-100" />
                            <div className="flex flex-col items-center gap-2">
                                <Database className="w-6 h-6 text-amber-500" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Merge</span>
                            </div>
                            <div className="w-10 h-[2px] bg-slate-100" />
                            <div className="flex flex-col items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Deploy</span>
                            </div>
                        </div>

                        <button className="mt-12 px-10 py-3 bg-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all cursor-not-allowed border border-slate-200 shadow-sm">
                            Initiate Catalog Merge
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkUploadManager;
