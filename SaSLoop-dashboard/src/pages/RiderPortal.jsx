import { useState, useEffect, useRef } from "react";
import API_BASE from "../config";
import { useParams } from "react-router-dom";
import { 
  MapPin, Navigation, Package, CheckCircle2, 
  Phone, AlertCircle, Play, Square 
} from "lucide-react";

function RiderPortal() {
    const { riderId } = useParams();
    const [orders, setOrders] = useState([]);
    const [isTracking, setIsTracking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const watchId = useRef(null);

    useEffect(() => {
        fetchAssignedOrders();
        const itv = setInterval(fetchAssignedOrders, 10000);
        return () => {
            clearInterval(itv);
            if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
        };
    }, [riderId, fetchAssignedOrders]);

    const fetchAssignedOrders = React.useCallback(async () => {
        try {
            // We fetch orders where rider_id matches and status is DISPATCHED
            // For now, we'll use a public endpoint or a specialized one
            const res = await fetch(`${API_BASE}/api/public/rider-orders/${riderId}`);
            const data = await res.json();
            setOrders(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const startTracking = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setIsTracking(true);
        watchId.current = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation({ lat: latitude, lng: longitude });
                updateLocationOnServer(latitude, longitude);
            },
            (err) => {
                setError("Please enable location access to continue.");
                setIsTracking(false);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
    };

    const stopTracking = () => {
        if (watchId.current) {
            navigator.geolocation.clearWatch(watchId.current);
            watchId.current = null;
        }
        setIsTracking(false);
    };

    const updateLocationOnServer = async (lat, lng) => {
        try {
            // If there's an active order, send that too
            const activeOrderId = orders.length > 0 ? orders[0].id : null;
            await fetch(`${API_BASE}/api/delivery/location`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ riderId, orderId: activeOrderId, lat, lng })
            });
        } catch (err) {
            console.error("Location sync fail:", err);
        }
    };

    const markDelivered = async (orderId) => {
        if (!window.confirm("Mark as delivered?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/public/order-status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: 'COMPLETED' })
            });
            if (res.ok) fetchAssignedOrders();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400">Booting Radar...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* HEADER */}
            <div className="bg-slate-900 text-white p-8 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-1">Rider Terminal</h1>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isTracking ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        {isTracking ? "Live Location Active" : "Tracking Paused"}
                    </p>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Navigation className="w-20 h-20" />
                </div>
            </div>

            <div className="p-6 -mt-8 relative z-20">
                {/* TRACKING CONTROL */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8 flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-slate-900 uppercase italic text-sm">Duty Status</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{isTracking ? "Customers can see you" : "Go online to start"}</p>
                    </div>
                    <button 
                        onClick={isTracking ? stopTracking : startTracking}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 ${isTracking ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-emerald-500 text-white shadow-emerald-200'}`}
                    >
                        {isTracking ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>
                </div>

                {error && (
                    <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-rose-100">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-xs font-bold">{error}</p>
                    </div>
                )}

                {/* ACTIVE ORDERS */}
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Assignments ({orders.length})</h3>
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
                            <p className="text-slate-300 font-black uppercase italic tracking-widest text-xs">Waiting for new orders...</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-100 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                    <Package className="w-16 h-16" />
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{order.order_reference}</p>
                                        <h4 className="font-black text-slate-900 uppercase italic text-xl">{order.customer_name}</h4>
                                    </div>
                                    <a href={`tel:${order.customer_number}`} className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                                        <Phone className="w-5 h-5" />
                                    </a>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl mb-6 flex items-start gap-3 border border-slate-100">
                                    <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs font-bold text-slate-600 leading-relaxed">{order.address}</p>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`, '_blank')}
                                        className="flex-1 bg-slate-900 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Navigation className="w-4 h-4" /> Navigate
                                    </button>
                                    <button 
                                        onClick={() => markDelivered(order.id)}
                                        className="flex-1 bg-emerald-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Delivered
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default RiderPortal;
