import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Clock, 
  Package, 
  Navigation,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { riderService } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RiderApp = () => {
  const [riderId, setRiderId] = useState(localStorage.getItem('rider_id'));
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('assigned');

  useEffect(() => {
    if (riderId) {
      fetchOrders();
      startLocationTracking();
    }
  }, [riderId]);

  const fetchOrders = async () => {
    try {
      const res = await riderService.getAssignedOrders(riderId);
      const ordersList = res.data?.length > 0 ? res.data : [
        {
          id: 101,
          order_ref: 'ORD-7721',
          created_at: new Date().toISOString(),
          status: 'READY FOR PICKUP',
          delivery_address: '123 Emerald Street, Downtown',
          customer_phone: '+91 9876543210',
          lat: 12.9716,
          lng: 77.5946,
          items: [
            { quantity: 2, product_name: 'Classic Burger' },
            { quantity: 1, product_name: 'Coca Cola' }
          ]
        }
      ];
      setOrders(ordersList);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      // Demo Data for Testing
      setOrders([
        {
          id: 101,
          order_ref: 'DEMO-001',
          created_at: new Date().toISOString(),
          status: 'READY',
          delivery_address: 'Test Location, Sector 5',
          customer_phone: '1234567890',
          items: [
            { quantity: 1, product_name: 'Test Item' }
          ]
        }
      ]);
    }
  };

  const startLocationTracking = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition((pos) => {
        riderService.updateLocation({
          riderId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      }, (err) => console.error(err), { enableHighAccuracy: true });
    }
  };

  const handleLogin = () => {
    if (phone.length >= 10) {
      // Mock logic: phone as ID for now
      localStorage.setItem('rider_id', phone);
      setRiderId(phone);
      toast.success("Welcome, Rider!");
    } else {
      toast.error("Enter valid phone number");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rider_id');
    setRiderId(null);
  };

  const completeOrder = async (orderId) => {
    try {
      await riderService.markDelivered(orderId);
      toast.success("Order marked as Delivered!");
      fetchOrders();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  if (!riderId) {
    return (
      <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-8 text-white">
        <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center mb-8 backdrop-blur-xl">
          <Bike size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">SaSLoop <span className="opacity-50">Rider</span></h1>
        <p className="text-indigo-100 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">Delivery Partner App</p>
        
        <div className="w-full max-w-sm space-y-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-2 flex border border-white/20">
            <div className="w-12 flex items-center justify-center text-white/50">
              <Phone size={20} />
            </div>
            <input 
              type="tel" 
              placeholder="Enter Phone Number"
              className="flex-1 bg-transparent py-4 outline-none font-bold placeholder:text-white/30 text-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button 
            onClick={handleLogin}
            className="w-full py-5 rounded-3xl bg-white text-indigo-600 font-black uppercase text-lg shadow-2xl shadow-indigo-900/50 active:scale-95 transition-all"
          >
            Start Working
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Rider Header */}
      <div className="bg-white p-6 rounded-b-[3rem] shadow-xl shadow-slate-200/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-indigo-50">
            <User size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Rider</p>
            <h2 className="font-black text-slate-900 italic uppercase">ID: {riderId}</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Bell size={20} />
          </button>
          <button onClick={handleLogout} className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-6 gap-3">
        <button 
          onClick={() => setActiveTab('assigned')}
          className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-tight transition-all ${activeTab === 'assigned' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400'}`}
        >
          Assigned ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-tight transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400'}`}
        >
          History
        </button>
      </div>

      {/* Orders List */}
      <div className="px-6 space-y-6">
        {orders.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <Package size={64} className="mb-4 opacity-20" />
            <p className="font-black uppercase italic">No Orders Assigned</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="rider-card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-2xl italic text-slate-900 uppercase">#{order.order_ref || order.id}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Received {new Date(order.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase italic">
                  {order.status}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Delivery Address</p>
                    <p className="font-bold text-slate-900 leading-tight">{order.delivery_address || 'Customer Address'}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Customer Contact</p>
                    <p className="font-bold text-slate-900 leading-tight">{order.customer_phone}</p>
                  </div>
                  <a href={`tel:${order.customer_phone}`} className="px-4 py-2 bg-emerald-50 text-emerald-600 font-black text-[10px] rounded-xl uppercase">Call</a>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <Package size={12} /> Items to Check ({order.items?.length || 0})
                 </p>
                 <div className="space-y-2">
                   {(order.items || []).map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                       <span className="font-bold text-slate-700 text-xs">{item.quantity}x {item.product_name}</span>
                       <div className="w-5 h-5 rounded border-2 border-slate-200"></div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${order.lat},${order.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs tracking-widest active:scale-95 transition-all"
                >
                  <Navigation size={16} />
                  Navigate
                </a>
                <button 
                  onClick={() => completeOrder(order.id)}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-200 active:scale-95 transition-all"
                >
                  <CheckCircle size={16} />
                  Delivered
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Floating Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-slate-900 rounded-full shadow-2xl flex items-center gap-4 text-white z-40">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <p className="text-[10px] font-black uppercase tracking-widest">Live Tracking Active</p>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default RiderApp;
