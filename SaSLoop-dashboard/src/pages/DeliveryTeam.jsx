import { useState, useEffect } from "react";
import API_BASE from "../config";
import { UserPlus, Trash2, Phone, User, Loader2, CheckCircle2, MapPin, Globe, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const riderIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
    iconSize: [30, 30],
});

function DeliveryTeam() {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newRider, setNewRider] = useState({ name: "", phone: "" });
    const [view, setView] = useState("list"); // 'list' or 'map'

    useEffect(() => {
        fetchRiders();
        const itv = setInterval(fetchRiders, 10000);
        return () => clearInterval(itv);
    }, []);

    const fetchRiders = async () => {
        try {
            const token = localStorage.getItem("token");
            const targetId = sessionStorage.getItem("impersonate_id");
            const res = await fetch(`${API_BASE}/api/delivery/partners${targetId ? `?target_user_id=${targetId}` : ""}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setRiders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addRider = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/delivery/partners`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newRider)
            });
            if (res.ok) {
                setNewRider({ name: "", phone: "" });
                fetchRiders();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(false);
        }
    };

    const deleteRider = async (id) => {
        if (!window.confirm("Remove this rider?")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_BASE}/api/delivery/partners/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchRiders();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-black uppercase tracking-widest animate-pulse">Loading Team...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Delivery Fleet</h1>
                    <p className="text-slate-500 text-sm font-bold">Manage your riders and track their live locations.</p>
                </div>
                <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
                    <button 
                        onClick={() => setView("list")}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Fleet List
                    </button>
                    <button 
                        onClick={() => setView("map")}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Live Radar
                    </button>
                </div>
            </div>

            {view === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* ADD RIDER FORM */}
                    <div className="md:col-span-1 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 h-fit sticky top-6">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                            <UserPlus className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-slate-900 uppercase italic mb-6">Add New Rider</h3>
                        <form onSubmit={addRider} className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        value={newRider.name}
                                        onChange={(e) => setNewRider({...newRider, name: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="Rider Name"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">WhatsApp Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        value={newRider.phone}
                                        onChange={(e) => setNewRider({...newRider, phone: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="+91..."
                                        required
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={adding}
                                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register Rider"}
                            </button>
                        </form>
                    </div>

                    {/* RIDERS LIST */}
                    <div className="md:col-span-2 space-y-4">
                        {riders.length === 0 ? (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
                                <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-black uppercase italic tracking-widest">Your fleet is empty.</p>
                            </div>
                        ) : (
                            riders.map(rider => (
                                <div key={rider.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 shadow-lg shadow-slate-100/30 flex items-center justify-between group hover:border-indigo-100 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                                            <Navigation className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 uppercase italic text-xl tracking-tight">{rider.name}</h4>
                                            <div className="flex flex-wrap items-center gap-4 mt-1.5">
                                                <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5" /> {rider.phone}
                                                </p>
                                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${rider.last_lat ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {rider.last_lat ? "Live Tracking" : "Offline"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => {
                                                const url = `${window.location.origin}/rider/${rider.id}`;
                                                navigator.clipboard.writeText(url);
                                                alert("Rider Portal link copied to clipboard! Send this to the rider.");
                                            }}
                                            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                        >
                                            Copy Portal Link
                                        </button>
                                        <button 
                                            onClick={() => deleteRider(rider.id)}
                                            className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                /* LIVE RADAR VIEW */
                <div className="bg-white rounded-[3rem] border-4 border-slate-100 shadow-2xl overflow-hidden h-[600px] relative">
                    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {riders.filter(r => r.last_lat).map(rider => (
                            <Marker key={rider.id} position={[rider.last_lat, rider.last_lng]} icon={riderIcon}>
                                <Popup>
                                    <div className="p-2">
                                        <h4 className="font-black uppercase italic text-sm mb-1">{rider.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rider.phone}</p>
                                        <p className="text-[9px] font-black text-emerald-500 mt-2 uppercase">Last seen: {new Date(rider.updated_at).toLocaleTimeString()}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                    <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Fleet Summary</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-black">{riders.filter(r => r.last_lat).length} Online</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                <span className="text-xs font-black">{riders.filter(r => !r.last_lat).length} Offline</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeliveryTeam;
