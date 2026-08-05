import React, { useState, useEffect } from "react";
import { 
  QrCode, Copy, Printer, Save, 
  Plus, Search, RefreshCw, ExternalLink, 
  Download, Check, Trash2, Globe, LayoutGrid
} from "lucide-react";
import API_BASE from "../config";

const QRManager = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [provisionName, setProvisionName] = useState("");
    const [maxPersons, setMaxPersons] = useState("4");
    const [copiedId, setCopiedId] = useState(null);
    const [customDomain, setCustomDomain] = useState(
      window.location.hostname.includes("localhost") ? window.location.origin : "https://menu.sasloop.in"
    );
    const [showDomainInput, setShowDomainInput] = useState(false);
    
    // Retrieve business info
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const bizId = user.bizId || user.id || 48;

    const fetchTables = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            const queryParams = targetId ? `?target_user_id=${targetId}` : "";
            
            const res = await fetch(`${API_BASE}/api/brand/tables${queryParams}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setTables(data);
            }
        } catch (e) {
            console.error("Failed to load tables:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleProvisionTable = async (e) => {
        e.preventDefault();
        if (!provisionName.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            
            const res = await fetch(`${API_BASE}/api/brand/tables`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: provisionName.toUpperCase(),
                    max_persons: parseInt(maxPersons) || 4,
                    is_active: true,
                    target_user_id: targetId
                })
            });

            if (res.ok) {
                setProvisionName("");
                fetchTables();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to provision table");
            }
        } catch (e) {
            console.error(e);
            alert("Connection error provisioning table");
        }
    };

    const handleDeleteTable = async (id) => {
        if (!window.confirm("Are you sure you want to delete this table?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/tables/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchTables();
            }
        } catch (e) {
            console.error("Failed to delete table:", e);
        }
    };

    const triggerPrint = (qrUrl, title) => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code - ${title}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            text-align: center;
                        }
                        .container {
                            border: 2px solid #ccc;
                            padding: 30px;
                            border-radius: 15px;
                            background: white;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        h1 {
                            font-size: 28px;
                            margin-bottom: 5px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                        }
                        p {
                            font-size: 14px;
                            color: #666;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            margin-bottom: 25px;
                        }
                        img {
                            width: 250px;
                            height: 250px;
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    <div class="container">
                        <h1>${title}</h1>
                        <p>Scan to view Menu & Place Order</p>
                        <img src="${qrUrl}" alt="QR Code" />
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Download helper
    const triggerDownload = (qrUrl, filename) => {
        const link = document.createElement("a");
        link.href = qrUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredTables = tables.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onlineOrderUrl = `${customDomain}/menu/${bizId}`;

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Control Hub */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                        <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="pro-heading">QR Orchestration Hub</h2>
                        <p className="pro-subheading">Generate and manage scan-to-order QR codes for tables and digital ordering</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {showDomainInput ? (
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-black/20 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <input 
                                type="text" 
                                value={customDomain} 
                                onChange={e => setCustomDomain(e.target.value)} 
                                className="bg-transparent text-[11px] font-bold text-slate-700 dark:text-white outline-none border-none max-w-[160px]"
                                placeholder="https://domain.com"
                            />
                            <button 
                                onClick={() => setShowDomainInput(false)}
                                className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold uppercase"
                            >
                                Set
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowDomainInput(true)}
                            className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all text-[11px] font-bold shadow-sm"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="max-w-[140px] truncate">{customDomain}</span>
                        </button>
                    )}
                    <button 
                        onClick={fetchTables}
                        className="h-9 w-9 flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/5 transition-all shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="SEARCH PROVISIONED TABLES..." 
                        className="bg-transparent text-[11px] font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-300 outline-none w-full uppercase"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Industrial Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                
                {/* Global Online Order QR Card */}
                <div className="pro-card p-5 bg-slate-900 text-white flex flex-col items-center gap-4 group relative overflow-hidden rounded-xl shadow-md border border-slate-800">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div className="text-center space-y-0.5">
                        <h3 className="text-[13px] font-black uppercase tracking-tight text-white">Online Order QR</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Global flyer/bag scan protocol</p>
                    </div>
                    <div className="w-full aspect-square bg-white rounded-lg p-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(onlineOrderUrl)}`} 
                            alt="Online Order QR"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="w-full space-y-2 mt-auto">
                        <button 
                            onClick={() => handleCopy(onlineOrderUrl, 'global')}
                            className="w-full py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            {copiedId === 'global' ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy URL</span>
                                </>
                            )}
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => triggerPrint(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(onlineOrderUrl)}`, "Online Order QR")}
                                className="py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                            >
                                <Printer className="w-3 h-3" /> Print
                            </button>
                            <button 
                                onClick={() => triggerDownload(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(onlineOrderUrl)}`, "online_order_qr.png")}
                                className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
                            >
                                <Download className="w-3 h-3" /> Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Provisioned Tables QR Codes */}
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="pro-card p-6 flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm animate-pulse h-[340px]">
                            <div className="w-24 h-6 bg-slate-100 dark:bg-white/5 rounded" />
                            <div className="w-full aspect-square bg-slate-50 dark:bg-black/20 rounded-lg" />
                            <div className="w-full h-8 bg-slate-100 dark:bg-white/5 rounded-lg" />
                        </div>
                    ))
                ) : filteredTables.length === 0 ? (
                    <div className="col-span-full py-16 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl text-center opacity-30">
                        <QrCode className="w-12 h-12 mx-auto mb-3" />
                        <p className="text-[11px] font-bold uppercase tracking-widest">No Tables Found to Generate QRs</p>
                    </div>
                ) : (
                    filteredTables.map(table => {
                        const tableUrl = `${customDomain}/table/${bizId}/${encodeURIComponent(table.name)}`;
                        return (
                            <div key={table.id} className="pro-card p-5 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm flex flex-col items-center gap-3.5 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all group relative">
                                <button 
                                    onClick={() => handleDeleteTable(table.id)}
                                    className="absolute top-3.5 right-3.5 p-1 bg-slate-50 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 rounded transition-all opacity-0 group-hover:opacity-100 border border-slate-200/50 dark:border-white/5"
                                    title="Delete Table"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="text-center space-y-0.5">
                                    <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">TABLE ACCESS NODE</p>
                                    <h3 className="text-[14px] font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{table.name}</h3>
                                </div>
                                <div className="w-full aspect-square bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-lg p-3 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-[#15171c] transition-colors shadow-inner">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableUrl)}`} 
                                        alt={`QR Code ${table.name}`}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="w-full space-y-2 mt-auto">
                                    <button 
                                        onClick={() => handleCopy(tableUrl, table.id)}
                                        className="w-full py-1 text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                                    >
                                        {copiedId === table.id ? (
                                            <>
                                                <Check className="w-3 h-3 text-emerald-500" />
                                                <span className="text-emerald-500">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" />
                                                <span>Copy Access Link</span>
                                            </>
                                        )}
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => triggerPrint(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(tableUrl)}`, table.name)}
                                            className="py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <Printer className="w-3 h-3" /> Print
                                        </button>
                                        <button 
                                            onClick={() => triggerDownload(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(tableUrl)}`, `${table.name.replace(/\s+/g, '_')}_qr.png`)}
                                            className="py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
                                        >
                                            <Save className="w-3 h-3" /> Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Provision New Seating Node Card */}
                <div className="pro-card p-5 border-dashed border-slate-300 dark:border-white/15 flex flex-col items-center justify-center gap-4 bg-slate-50/30 dark:bg-white/[0.01] hover:bg-white dark:hover:bg-[#1e2129] hover:border-indigo-400 transition-all rounded-xl shadow-sm group">
                    <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-105 transition-all">
                        <Plus className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                        <p className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Provision Seating Node</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Create table & compile QR protocol</p>
                    </div>
                    <form onSubmit={handleProvisionTable} className="w-full space-y-3">
                        <div className="space-y-1">
                            <input 
                                required
                                type="text" 
                                placeholder="E.G. TABLE 21" 
                                className="w-full p-2 bg-white dark:bg-black/25 border border-slate-200 dark:border-white/10 rounded-lg text-[11px] font-bold outline-none text-center uppercase text-slate-900 dark:text-white focus:border-indigo-500"
                                value={provisionName}
                                onChange={e => setProvisionName(e.target.value)}
                            />
                            <div className="flex items-center gap-2 bg-white dark:bg-black/25 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">SEATS:</span>
                                <input 
                                    type="number" 
                                    className="bg-transparent text-[11px] font-bold text-slate-900 dark:text-white outline-none w-full text-right"
                                    value={maxPersons}
                                    onChange={e => setMaxPersons(e.target.value)}
                                    min="1"
                                    max="50"
                                />
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="w-full h-8 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" /> Compile QR
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default QRManager;
