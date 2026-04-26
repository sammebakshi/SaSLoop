import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, ChefHat, CheckCircle2, Bike, MapPin, Phone, Navigation } from 'lucide-react';
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
        }, 10000);
        return () => clearInterval(interval);
    }, [orderRef, order?.status]);

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse">RADAR SCANNING...</div>;
    
    if (order?.error) return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
            <h1 className="text-4xl font-black mb-2 italic text-rose-500 tracking-tighter">Oops!</h1>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">{order.error}</p>
        </div>
    );

    const statusMap = {
        'PENDING': { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/20', text: 'Waiting for Kitchen', step: 1 },
        'PROCESSING': { icon: ChefHat, color: 'text-blue-500', bg: 'bg-blue-500/20', text: 'Cooking in Progress', step: 2 },
        'PREPARING': { icon: ChefHat, color: 'text-blue-500', bg: 'bg-blue-500/20', text: 'Cooking in Progress', step: 2 },
        'DISPATCHED': { icon: Bike, color: 'text-indigo-500', bg: 'bg-indigo-500/20', text: 'Rider is on the way', step: 3 },
        'SHIPPED': { icon: Bike, color: 'text-indigo-500', bg: 'bg-indigo-500/20', text: 'Rider is on the way', step: 3 },
        'COMPLETED': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/20', text: 'Delivered Successfully', step: 4 },
        'DELIVERED': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/20', text: 'Delivered Successfully', step: 4 },
        'CANCELLED': { icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/20', text: 'Order Cancelled', step: 1 }
    };

    const currentStatus = statusMap[order.status?.toUpperCase()] || statusMap['PENDING'];
    const StatusIcon = currentStatus.icon;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative">
            
            {/* MAP VIEW - ONLY WHEN DISPATCHED */}
            {(order.status === 'DISPATCHED' || order.status === 'SHIPPED') && riderLocation ? (
                <div className="h-96 w-full relative z-0">
                    <MapContainer center={[riderLocation.lat, riderLocation.lng]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[riderLocation.lat, riderLocation.lng]} icon={riderIcon}>
                            <Popup>Rider is here!</Popup>
                        </Marker>
                        <ChangeView center={[riderLocation.lat, riderLocation.lng]} />
                    </MapContainer>
                    <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                         <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black italic">
                             {riderLocation.rider_name?.[0] || 'R'}
                         </div>
                         <div>
                             <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Your Rider</p>
                             <h4 className="font-black text-slate-900 uppercase italic text-xs">{riderLocation.rider_name}</h4>
                         </div>
                         <a href={`tel:${riderLocation.rider_phone}`} className="ml-4 w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
                             <Phone className="w-4 h-4" />
                         </a>
                    </div>
                </div>
            ) : (
                <div className="h-64 bg-slate-900 rounded-b-[3rem] flex flex-col items-center justify-center text-white px-8">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Live Tracking</p>
                     <h1 className="text-4xl font-black tracking-tighter italic">Order {orderRef}</h1>
                </div>
            )}

            <div className="relative z-10 px-6 -mt-10">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 mb-6 border border-slate-100">
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-20 h-20 rounded-full ${currentStatus.bg} ${currentStatus.color} flex items-center justify-center mb-6 animate-pulse`}>
                            <StatusIcon className="w-10 h-10" />
                        </div>
                        <h2 className={`text-2xl font-black uppercase tracking-tighter italic ${currentStatus.color}`}>
                            {currentStatus.text}
                        </h2>
                        <div className="mt-6 w-full flex items-center justify-between gap-1">
                             {[1,2,3,4].map(s => (
                                 <div key={s} className={`h-1.5 flex-1 rounded-full ${currentStatus.step >= s ? currentStatus.bg.replace('/20', '') : 'bg-slate-100'}`} />
                             ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 mb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Items Summary</h3>
                    <div className="space-y-3">
                        {(() => {
                            try {
                                const itemsArray = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
                                return itemsArray.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-xl">
                                        <span>{item.name}</span>
                                        <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-[10px]">x{item.qty}</span>
                                    </div>
                                ));
                            } catch (e) { return null; }
                        })()}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paid Amount</span>
                        <span className="text-xl font-black text-slate-900 tracking-tighter">₹{order.total_price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
