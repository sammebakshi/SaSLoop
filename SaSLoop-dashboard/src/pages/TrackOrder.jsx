import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, ChefHat, CheckCircle2, Bike, Phone, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import API_BASE from '../config';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Rider Icon
const riderIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

// Helper component to auto-center map
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

const TrackOrder = () => {
    const { orderRef } = useParams();
    const [order, setOrder] = useState(null);
    const [riderLocation, setRiderLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/public/order/${orderRef}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                    if (data.status === 'DISPATCHED' || data.status === 'SHIPPED') {
                        fetchRiderLocation();
                    }
                } else {
                    setOrder({ error: "Order not found" });
                }
            } catch (err) {
                setOrder({ error: "Failed to connect" });
            } finally {
                setLoading(false);
            }
        };

        const fetchRiderLocation = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/public/track-rider/${orderRef}`);
                const data = await res.json();
                if (data.lat && data.lng) {
                    setRiderLocation(data);
                }
            } catch (err) {
                console.error("Rider track fail:", err);
            }
        };

        fetchOrder();
        const interval = setInterval(() => {
            fetchOrder();
            if (order?.status === 'DISPATCHED' || order?.status === 'SHIPPED') {
                fetchRiderLocation();
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [orderRef, order?.status]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-black animate-udm-pulse space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <Bike className="w-6 h-6 animate-bounce" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-emerald-400">UDM Radar Scanning Order #{orderRef}...</div>
        </div>
    );
    
    if (order?.error) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="udm-card p-8 rounded-3xl max-w-sm w-full border border-rose-500/30">
                <h1 className="text-4xl font-black mb-2 italic text-rose-500 tracking-tighter">Order Not Found</h1>
                <p className="text-slate-400 font-bold text-xs tracking-widest uppercase mt-2">{order.error}</p>
            </div>
        </div>
    );

    const statusMap = {
        'PENDING': { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/20', text: 'Waiting for Kitchen', step: 1, glow: 'udm-card-glow-amber' },
        'PROCESSING': { icon: ChefHat, color: 'text-cyan-400', bg: 'bg-cyan-500/20', text: 'Cooking in Progress', step: 2, glow: 'udm-card-glow-cyan' },
        'PREPARING': { icon: ChefHat, color: 'text-cyan-400', bg: 'bg-cyan-500/20', text: 'Cooking in Progress', step: 2, glow: 'udm-card-glow-cyan' },
        'DISPATCHED': { icon: Bike, color: 'text-indigo-400', bg: 'bg-indigo-500/20', text: 'Rider on the Way', step: 3, glow: 'udm-card-glow-cyan' },
        'SHIPPED': { icon: Bike, color: 'text-indigo-400', bg: 'bg-indigo-500/20', text: 'Rider on the Way', step: 3, glow: 'udm-card-glow-cyan' },
        'COMPLETED': { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', text: 'Delivered Successfully', step: 4, glow: 'udm-card-glow-emerald' },
        'DELIVERED': { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', text: 'Delivered Successfully', step: 4, glow: 'udm-card-glow-emerald' },
        'CANCELLED': { icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/20', text: 'Order Cancelled', step: 1, glow: '' }
    };

    const currentStatus = statusMap[order.status?.toUpperCase()] || statusMap['PENDING'];
    const StatusIcon = currentStatus.icon;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col max-w-md mx-auto shadow-2xl relative font-sans">
            
            {/* MAP VIEW - ONLY WHEN DISPATCHED */}
            {(order.status === 'DISPATCHED' || order.status === 'SHIPPED') && riderLocation ? (
                <div className="h-96 w-full relative z-0 border-b border-white/10">
                    <MapContainer center={[riderLocation.lat, riderLocation.lng]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[riderLocation.lat, riderLocation.lng]} icon={riderIcon}>
                            <Popup>Rider is here!</Popup>
                        </Marker>
                        <ChangeView center={[riderLocation.lat, riderLocation.lng]} />
                    </MapContainer>
                    <div className="absolute top-4 left-4 z-[1000] udm-card p-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                         <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-black italic border border-indigo-500/30">
                             {riderLocation.rider_name?.[0] || 'R'}
                         </div>
                         <div>
                             <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Your Assigned Rider</p>
                             <h4 className="font-black text-white uppercase italic text-xs">{riderLocation.rider_name}</h4>
                         </div>
                         <a href={`tel:${riderLocation.rider_phone}`} className="ml-4 w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                             <Phone className="w-4 h-4" />
                         </a>
                    </div>
                </div>
            ) : (
                <div className="h-56 bg-gradient-to-b from-slate-900 to-slate-950 rounded-b-[2.5rem] flex flex-col items-center justify-center text-white px-8 border-b border-white/10">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2 flex items-center gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Tracking Radar
                     </p>
                     <h1 className="text-3xl font-black tracking-tighter italic text-white">Order #{orderRef}</h1>
                </div>
            )}

            <div className="relative z-10 px-6 -mt-10 pb-10">
                {/* UDM Status Card */}
                <div className={`udm-card p-6 rounded-[2rem] shadow-2xl mb-6 border border-white/10 ${currentStatus.glow}`}>
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-2xl ${currentStatus.bg} ${currentStatus.color} flex items-center justify-center mb-4 border border-white/10 animate-udm-pulse`}>
                            <StatusIcon className="w-8 h-8" />
                        </div>
                        <h2 className={`text-xl font-black uppercase tracking-tighter italic ${currentStatus.color}`}>
                            {currentStatus.text}
                        </h2>
                        <div className="mt-6 w-full flex items-center justify-between gap-1.5">
                             {[1,2,3,4].map(s => (
                                 <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${currentStatus.step >= s ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' : 'bg-white/10'}`} />
                             ))}
                        </div>
                    </div>
                </div>

                {/* Items Summary Card */}
                <div className="udm-card p-6 rounded-[2rem] shadow-xl border border-white/10 mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-emerald-400" /> Items Summary
                    </h3>
                    <div className="space-y-2.5">
                        {(() => {
                            try {
                                const itemsArray = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
                                return itemsArray.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <span>{item.name}</span>
                                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/30 text-[10px] font-black">x{item.qty}</span>
                                    </div>
                                ));
                            } catch (e) { return null; }
                        })()}
                    </div>
                    <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Paid</span>
                        <span className="text-xl font-black text-emerald-400 tracking-tighter">₹{order.total_price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
