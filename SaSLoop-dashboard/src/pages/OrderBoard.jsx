import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  ShoppingBag, Search, Filter, Clock, CheckCircle2, 
  XCircle, MoreHorizontal, ChefHat, MapPin, Phone,
  RefreshCw, Plus, MoreVertical, Utensils, Truck, 
  Activity, ArrowRight, User, AlertCircle, Trash2, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE from "../config";

const OrderBoard = () => {
    const [orders, setOrders] = useState([]);
    const [kots, setKots] = useState([]);
    const [posState, setPosState] = useState({ tableBills: {}, tableStatuses: {}, tableBillNumbers: {}, tableActiveTimestamps: {}, tables: [] });
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    
    // Cancellation Modal State
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [cancelIsKot, setCancelIsKot] = useState(false);
    const [cancelIsPosTable, setCancelIsPosTable] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const [toastMsg, setToastMsg] = useState(null);
    const seenPaymentConfirmedRef = useRef(new Set());

    const showToast = (type, text) => {
        setToastMsg({ type, text });
        setTimeout(() => setToastMsg(null), 4000);
    };

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };

            const ordersPromise = fetch(`${API_BASE}/api/orders${targetParam}`, { headers });
            const kotsPromise = fetch(`${API_BASE}/api/kots${targetParam}`, { headers });
            const bizPromise = fetch(`${API_BASE}/api/business/status${targetParam}`, { headers });
            const posStatePromise = fetch(`${API_BASE}/api/pos/active-state${targetParam}`, { headers });

            const [ordersRes, kotsRes, bizRes, posStateRes] = await Promise.all([
                ordersPromise, kotsPromise, bizPromise, posStatePromise
            ]);

            if (ordersRes.ok) {
                const data = await ordersRes.json();
                const fetchedOrders = Array.isArray(data) ? data : [];
                setOrders(fetchedOrders);

                // Live toast notification on OrderBoard when customer confirms payment
                fetchedOrders.forEach(o => {
                    const isConfirmed = String(o.payment_status || '').toUpperCase() === 'CUSTOMER_CONFIRMED';
                    if (isConfirmed) {
                        const pKey = `pay_${o.id}`;
                        if (!seenPaymentConfirmedRef.current.has(pKey)) {
                            seenPaymentConfirmedRef.current.add(pKey);
                            showToast("success", `💰 PAYMENT ALERT: Customer reported UPI payment of ₹${o.total_price} for Order #${o.order_reference || o.id}!`);
                        }
                    }
                });
            }
            if (kotsRes.ok) {
                const data = await kotsRes.json();
                setKots(Array.isArray(data) ? data : []);
            }
            if (posStateRes.ok) {
                const data = await posStateRes.json();
                setPosState(data || { tableBills: {}, tableStatuses: {}, tableBillNumbers: {}, tableActiveTimestamps: {}, tables: [] });
            }
            if (bizRes.ok) {
                const data = await bizRes.json();
                if (data.hasBusiness && data.business) {
                    setBusiness(data.business);
                }
            }
        } catch (e) {
            console.error("Error fetching live order matrix telemetry:", e);
            showToast("error", "Error synchronizing active telemetry");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Polling interval: 8 seconds background refresh
        const interval = setInterval(() => {
            fetchData(true);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const currencySymbol = useMemo(() => {
        const code = business?.currency_code || business?.currency || "INR";
        return code === "USD" ? "$" : (code === "SAR" ? "SR" : (code === "AED" ? "AED" : "₹"));
    }, [business]);

    const getOrderType = (o) => {
        if (o.type === 'DINE_IN' || o.order_type === 'DINE_IN' || o.order_type === 'DINEIN' || String(o.address).toLowerCase() === 'dine-in' || (o.table_number && o.table_number !== '0' && o.table_number !== '')) {
            return 'DINE_IN';
        }
        if (o.type === 'PICKUP' || o.order_type === 'PICKUP' || o.order_type === 'TAKEAWAY' || o.order_type === 'QUICK' || String(o.address).toLowerCase() === 'pickup' || String(o.address).toLowerCase() === 'takeaway') {
            return 'PICKUP';
        }
        return 'DELIVERY';
    };

    // process and merge orders
    const { activeDineIn, activePickup, activeDelivery, unifiedActiveList } = useMemo(() => {
        const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && o.status !== 'DELETED');
        const activeKots = kots.filter(k => k.status !== 'COMPLETED' && k.status !== 'CANCELLED' && k.status !== 'DELETED');

        const dineInMap = {};
        const activePickup = [];
        const activeDelivery = [];

        // 1. Process active KOTs from database (if any exist)
        activeKots.forEach(kot => {
            const table = kot.table_number || '0';
            if (!dineInMap[table]) {
                dineInMap[table] = {
                    id: `kot-table-${table}`,
                    dbId: kot.id,
                    isKot: true,
                    type: 'DINE_IN',
                    title: `Table ${table}`,
                    subtitle: `KOT #${kot.id}`,
                    timestamp: new Date(kot.created_at).getTime(),
                    total: 0,
                    items: [],
                    status: kot.status,
                    customer_name: 'Table Guest',
                    customer_number: '',
                    kots: [kot]
                };
            } else {
                dineInMap[table].kots.push(kot);
                if (new Date(kot.created_at).getTime() < dineInMap[table].timestamp) {
                    dineInMap[table].timestamp = new Date(kot.created_at).getTime();
                }
            }
            const itemsList = Array.isArray(kot.items) ? kot.items : (typeof kot.items === 'string' ? JSON.parse(kot.items) : []);
            itemsList.forEach(item => {
                const existingItem = dineInMap[table].items.find(i => i.product_name === item.product_name);
                if (existingItem) {
                    existingItem.quantity = (existingItem.quantity || 0) + (item.quantity || item.qty || 1);
                } else {
                    dineInMap[table].items.push({ ...item, quantity: item.quantity || item.qty || 1 });
                }
                dineInMap[table].total += (parseFloat(item.price) || 0) * (item.quantity || item.qty || 1);
            });
        });

        // 2. Process active POS state (tables & temporary table cards) synced from POS
        const activePosTables = (posState.tables || []).filter(t => {
            const status = posState.tableStatuses?.[t.id] || 'AVAILABLE';
            const cart = posState.tableBills?.[t.id] || [];
            return status !== 'AVAILABLE' || cart.length > 0;
        });

        activePosTables.forEach(t => {
            const carts = posState.tableBills?.[t.id] || [];
            const billNo = posState.tableBillNumbers?.[t.id] || 'Pending';
            const timestamp = posState.tableActiveTimestamps?.[t.id] || Date.now();
            const type = t.original_order_type === 'PICKUP' ? 'PICKUP' : (t.original_order_type === 'DELIVERY' ? 'DELIVERY' : 'DINE_IN');
            
            const total = carts.reduce((acc, item) => acc + (parseFloat(item.price || 0) * (item.quantity || item.qty || 1)), 0);
            const items = carts.map(item => ({
                product_name: item.product_name || item.name,
                quantity: item.quantity || item.qty || 1,
                price: parseFloat(item.price || 0)
            }));

            const mappedItem = {
                id: `pos-table-${t.id}`,
                dbId: t.id,
                isKot: true,
                type: type,
                title: t.table_name,
                subtitle: `Bill No: ${billNo}`,
                timestamp: timestamp,
                total: total,
                items: items,
                status: posState.tableStatuses?.[t.id] || 'SAVED',
                customer_name: t.original_order_type === 'PICKUP' ? 'Walk-in Guest' : (t.original_order_type === 'DELIVERY' ? 'Delivery Guest' : 'Table Guest'),
                customer_number: '',
                isPosStateTable: true
            };

            if (type === 'DINE_IN') {
                const table = t.id.toString();
                if (!dineInMap[table]) {
                    dineInMap[table] = mappedItem;
                } else {
                    dineInMap[table].total = total;
                    dineInMap[table].items = items;
                    dineInMap[table].status = mappedItem.status;
                }
            } else if (type === 'PICKUP') {
                activePickup.push(mappedItem);
            } else {
                activeDelivery.push(mappedItem);
            }
        });

        // 3. Process active orders from the database
        activeOrders.forEach(o => {
            const type = getOrderType(o);
            if (type === 'DINE_IN') {
                const table = o.table_number || '0';
                const oItems = Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items) : []);
                if (!dineInMap[table]) {
                    dineInMap[table] = {
                        id: `order-${o.id}`,
                        dbId: o.id,
                        isKot: false,
                        type: 'DINE_IN',
                        title: `Table ${table}`,
                        subtitle: `Ref: ${o.order_reference || o.bill_no || o.id}`,
                        timestamp: new Date(o.created_at).getTime(),
                        total: parseFloat(o.total_price || 0),
                        items: oItems.map(i => ({ ...i, quantity: i.quantity || i.qty || 1 })),
                        status: o.status,
                        customer_name: o.customer_name || 'Table Guest',
                        customer_number: o.customer_number || '',
                        order: o
                    };
                } else {
                    dineInMap[table].id = `order-${o.id}`;
                    dineInMap[table].dbId = o.id;
                    dineInMap[table].isKot = false; 
                    dineInMap[table].subtitle = `Ref: ${o.order_reference || o.bill_no || o.id}`;
                    dineInMap[table].customer_name = o.customer_name || dineInMap[table].customer_name;
                    dineInMap[table].customer_number = o.customer_number || dineInMap[table].customer_number;
                    dineInMap[table].order = o;
                    dineInMap[table].total = parseFloat(o.total_price || 0);
                }
            } else if (type === 'PICKUP') {
                const oItems = Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items) : []);
                activePickup.push({
                    id: `order-${o.id}`,
                    dbId: o.id,
                    isKot: false,
                    type: 'PICKUP',
                    title: o.customer_name || 'Walk-in Guest',
                    subtitle: `Ref: ${o.order_reference || o.bill_no || o.id}`,
                    timestamp: new Date(o.created_at).getTime(),
                    total: parseFloat(o.total_price || 0),
                    items: oItems.map(i => ({ ...i, quantity: i.quantity || i.qty || 1 })),
                    status: o.status,
                    customer_name: o.customer_name || 'Walk-in Guest',
                    customer_number: o.customer_number || '',
                    order: o
                });
            } else if (type === 'DELIVERY') {
                const oItems = Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items) : []);
                activeDelivery.push({
                    id: `order-${o.id}`,
                    dbId: o.id,
                    isKot: false,
                    type: 'DELIVERY',
                    title: o.customer_name || 'Delivery Guest',
                    subtitle: `Ref: ${o.order_reference || o.bill_no || o.id}`,
                    timestamp: new Date(o.created_at).getTime(),
                    total: parseFloat(o.total_price || 0),
                    items: oItems.map(i => ({ ...i, quantity: i.quantity || i.qty || 1 })),
                    status: o.status,
                    customer_name: o.customer_name || 'Delivery Guest',
                    customer_number: o.customer_number || '',
                    order: o
                });
            }
        });

        const activeDineIn = Object.values(dineInMap);
        const unifiedActiveList = [...activeDineIn, ...activePickup, ...activeDelivery].sort((a, b) => a.timestamp - b.timestamp);

        return { activeDineIn, activePickup, activeDelivery, unifiedActiveList };
    }, [orders, kots, posState]);


    // Totals calculations
    const totals = useMemo(() => {
        const dineInSum = activeDineIn.reduce((sum, item) => sum + item.total, 0);
        const pickupSum = activePickup.reduce((sum, item) => sum + item.total, 0);
        const deliverySum = activeDelivery.reduce((sum, item) => sum + item.total, 0);
        const grandTotal = dineInSum + pickupSum + deliverySum;

        return {
            dineInSum,
            dineInCount: activeDineIn.length,
            pickupSum,
            pickupCount: activePickup.length,
            deliverySum,
            deliveryCount: activeDelivery.length,
            totalActiveCount: activeDineIn.length + activePickup.length + activeDelivery.length
        };
    }, [activeDineIn, activePickup, activeDelivery]);

    // Search and Tab filtering
    const filteredOrders = useMemo(() => {
        return unifiedActiveList.filter(o => {
            if (activeTab !== 'ALL' && o.type !== activeTab) return false;
            const query = searchQuery.trim().toLowerCase();
            if (!query) return true;

            return (
                (o.title || "").toLowerCase().includes(query) ||
                (o.subtitle || "").toLowerCase().includes(query) ||
                (o.customer_name || "").toLowerCase().includes(query) ||
                (o.customer_number || "").includes(query) ||
                (o.status || "").toLowerCase().includes(query)
            );
        });
    }, [unifiedActiveList, activeTab, searchQuery]);

    // Active Selected Order
    const selectedOrder = useMemo(() => {
        if (!selectedOrderId && filteredOrders.length > 0) {
            return filteredOrders[0];
        }
        return filteredOrders.find(o => o.id === selectedOrderId) || filteredOrders[0] || null;
    }, [filteredOrders, selectedOrderId]);

    // Update Status Action
    const handleUpdateStatus = async (item, newStatus) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";

            if (item.isPosStateTable) {
                if (newStatus === 'COMPLETED') {
                    const orderRes = await fetch(`${API_BASE}/api/orders${targetParam}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            customer_name: item.customer_name || 'Table Guest',
                            customer_number: item.customer_number || '',
                            items: item.items,
                            total_price: item.total,
                            payment_method: 'CASH',
                            status: 'COMPLETED',
                            table_number: item.type === 'DINE_IN' ? item.title.replace('Table ', '') : '0',
                            order_type: item.type,
                            bill_no: item.subtitle.includes('Bill No: ') ? item.subtitle.replace('Bill No: ', '') : ''
                        })
                    });

                    if (!orderRes.ok) {
                        showToast("error", "Failed to save completed order in database");
                        setActionLoading(false);
                        return;
                    }

                    const updatedPosState = { ...posState };
                    const tableId = item.dbId;
                    
                    if (updatedPosState.tableBills) delete updatedPosState.tableBills[tableId];
                    if (updatedPosState.tableStatuses) updatedPosState.tableStatuses[tableId] = 'AVAILABLE';
                    if (updatedPosState.tableBillNumbers) delete updatedPosState.tableBillNumbers[tableId];
                    if (updatedPosState.tableActiveTimestamps) delete updatedPosState.tableActiveTimestamps[tableId];
                    if (updatedPosState.tables) {
                        const tableObj = updatedPosState.tables.find(t => t.id === tableId);
                        if (tableObj && tableObj.is_temporary) {
                            updatedPosState.tables = updatedPosState.tables.filter(t => t.id !== tableId);
                        }
                    }

                    const syncRes = await fetch(`${API_BASE}/api/pos/active-state${targetParam}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            target_user_id: impersonateId || undefined,
                            activeState: updatedPosState
                        })
                    });

                    if (syncRes.ok) {
                        showToast("success", "POS Table bill settled and completed successfully");
                        fetchData(true);
                    } else {
                        showToast("error", "Failed to clear POS table status on server");
                    }
                } else {
                    const updatedPosState = { ...posState };
                    const tableId = item.dbId;
                    if (updatedPosState.tableStatuses) updatedPosState.tableStatuses[tableId] = newStatus;

                    const syncRes = await fetch(`${API_BASE}/api/pos/active-state${targetParam}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            target_user_id: impersonateId || undefined,
                            activeState: updatedPosState
                        })
                    });

                    if (syncRes.ok) {
                        showToast("success", `POS Table status updated to ${newStatus}`);
                        fetchData(true);
                    } else {
                        showToast("error", "Failed to update POS table status on server");
                    }
                }
            } else if (item.isKot) {
                const res = await fetch(`${API_BASE}/api/kots/${item.dbId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                });
                if (res.ok) {
                    showToast("success", `KOT Status updated to ${newStatus}`);
                    fetchData(true);
                } else {
                    showToast("error", "Failed to update KOT status");
                }
            } else {
                const res = await fetch(`${API_BASE}/api/orders/${item.dbId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                });
                if (res.ok) {
                    showToast("success", `Order Status updated to ${newStatus}`);
                    fetchData(true);
                } else {
                    showToast("error", "Failed to update Order status");
                }
            }
        } catch (e) {
            console.error(e);
            showToast("error", "Network error updating status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkPaymentPaid = async (item, newPayStatus = 'RECEIVED') => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/orders/${item.dbId}/payment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ payment_status: newPayStatus })
            });
            if (res.ok) {
                showToast("success", `Payment status updated to ${newPayStatus}!`);
                fetchData(true);
            } else {
                showToast("error", "Failed to update payment status");
            }
        } catch (e) {
            console.error(e);
            showToast("error", "Network error updating payment status");
        } finally {
            setActionLoading(false);
        }
    };

    // Cancellation Action
    const handleCancelOrder = async (e) => {
        if (e) e.preventDefault();
        if (!rejectionReason.trim()) {
            showToast("error", "Reason for cancellation is required");
            return;
        }

        setActionLoading(true);
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";

            if (cancelIsPosTable) {
                const item = selectedOrder;

                const orderRes = await fetch(`${API_BASE}/api/orders${targetParam}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        customer_name: item?.customer_name || 'Table Guest',
                        customer_number: item?.customer_number || '',
                        items: item?.items || [],
                        total_price: item?.total || 0,
                        payment_method: 'CASH',
                        status: 'CANCELLED',
                        table_number: item?.type === 'DINE_IN' ? item?.title?.replace('Table ', '') : '0',
                        order_type: item?.type || 'DINE_IN',
                        bill_no: item?.subtitle?.includes('Bill No: ') ? item?.subtitle?.replace('Bill No: ', '') : '',
                        rejection_reason: rejectionReason.trim()
                    })
                });

                if (!orderRes.ok) {
                    showToast("error", "Failed to log cancelled order in database");
                    setActionLoading(false);
                    return;
                }

                const updatedPosState = { ...posState };
                const tableId = cancelOrderId;
                
                if (updatedPosState.tableBills) delete updatedPosState.tableBills[tableId];
                if (updatedPosState.tableStatuses) updatedPosState.tableStatuses[tableId] = 'AVAILABLE';
                if (updatedPosState.tableBillNumbers) delete updatedPosState.tableBillNumbers[tableId];
                if (updatedPosState.tableActiveTimestamps) delete updatedPosState.tableActiveTimestamps[tableId];
                if (updatedPosState.tables) {
                    const tableObj = updatedPosState.tables.find(t => t.id === tableId);
                    if (tableObj && tableObj.is_temporary) {
                        updatedPosState.tables = updatedPosState.tables.filter(t => t.id !== tableId);
                    }
                }

                const syncRes = await fetch(`${API_BASE}/api/pos/active-state${targetParam}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        target_user_id: impersonateId || undefined,
                        activeState: updatedPosState
                    })
                });

                if (syncRes.ok) {
                    showToast("success", "POS Table Cart cancelled and cleared successfully");
                    setIsCancelModalOpen(false);
                    setRejectionReason('');
                    setCancelIsPosTable(false);
                    fetchData(true);
                } else {
                    showToast("error", "Failed to sync cancelled state to POS");
                }
            } else if (cancelIsKot) {
                const res = await fetch(`${API_BASE}/api/kots/${cancelOrderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: 'CANCELLED' })
                });
                if (res.ok) {
                    showToast("success", "KOT successfully cancelled");
                    setIsCancelModalOpen(false);
                    setRejectionReason('');
                    fetchData(true);
                } else {
                    showToast("error", "Failed to cancel KOT");
                }
            } else {
                const res = await fetch(`${API_BASE}/api/orders/${cancelOrderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ 
                        status: 'CANCELLED',
                        rejection_reason: rejectionReason.trim()
                    })
                });
                if (res.ok) {
                    showToast("success", "Order successfully cancelled");
                    setIsCancelModalOpen(false);
                    setRejectionReason('');
                    fetchData(true);
                } else {
                    showToast("error", "Failed to cancel order");
                }
            }
        } catch (err) {
            console.error(err);
            showToast("error", "Network error cancelling order");
        } finally {
            setActionLoading(false);
        }
    };

    // Aggregate items across all active order cards (Top Running KOT Items)
    const runningKOTItems = useMemo(() => {
        const map = {};
        unifiedActiveList.forEach(o => {
            o.items.forEach(item => {
                const name = item.product_name || item.name || 'Unknown Item';
                const qty = parseInt(item.quantity || item.qty || 1);
                if (!map[name]) {
                    map[name] = 0;
                }
                map[name] += qty;
            });
        });
        return Object.entries(map)
            .map(([name, qty]) => ({ name, qty }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 10);
    }, [unifiedActiveList]);

    // Active Customers List
    const activeCustomers = useMemo(() => {
        const map = {};
        unifiedActiveList.forEach(o => {
            const key = o.customer_number || o.id;
            if (!map[key]) {
                map[key] = {
                    id: o.id,
                    name: o.customer_name || 'Table Guest',
                    phone: o.customer_number || 'N/A',
                    type: o.type,
                    subtitle: o.subtitle,
                    total: o.total,
                    status: o.status
                };
            }
        });
        return Object.values(map).slice(0, 10);
    }, [unifiedActiveList]);

    return (
        <div className="space-y-6 animate-pro-in font-sans text-slate-800 dark:text-slate-100 pb-10">
            {/* Status Toast Notification */}
            {toastMsg && (
                <div className={`fixed top-6 right-6 z-[1000] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-black uppercase tracking-wider animate-in slide-in-from-top duration-300 ${
                    toastMsg.type === "success" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50 udm-card-glow-emerald" 
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50"
                }`}>
                    {toastMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                    {toastMsg.text}
                </div>
            )}

            {/* Header Matrix - UDM Glassmorphism */}
            <div className="udm-card flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Activity className="w-6 h-6 animate-udm-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Live Fulfillment Matrix (UDM)</h2>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Real-time telemetry & order tracking center</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search bar */}
                    <div className="relative min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="SEARCH REF, TABLE, CUSTOMER..." 
                            className="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] font-black uppercase outline-none focus:border-emerald-500 transition-all text-slate-800 dark:text-white placeholder-slate-400 tracking-wider w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter tabs */}
                    <div className="flex bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                        {[
                            { id: 'ALL', label: 'All Active' },
                            { id: 'DINE_IN', label: 'Dine-In' },
                            { id: 'PICKUP', label: 'Pick-Up' },
                            { id: 'DELIVERY', label: 'Delivery' }
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSelectedOrderId(null);
                                }}
                                className={`px-4 py-1.5 text-[9px] font-black rounded-lg uppercase tracking-wider transition-all ${
                                    activeTab === tab.id 
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => fetchData()} 
                        className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-350 rounded-xl transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
                    </button>
                </div>
            </div>

            {/* UDM Glass Telemetry Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Dine-In Card */}
                <div className="udm-card p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden transition-all border-l-4 border-l-emerald-500">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Utensils size={22} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Running Dine-In</span>
                        <span className="text-lg font-black italic tracking-tighter text-emerald-600 dark:text-emerald-400">
                            {currencySymbol} {totals.dineInSum.toFixed(0)}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                            {totals.dineInCount} Occupied {totals.dineInCount === 1 ? 'Table' : 'Tables'}
                        </span>
                    </div>
                </div>

                {/* 2. Pick-Up Card */}
                <div className="udm-card p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden transition-all border-l-4 border-l-amber-500">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                        <ShoppingBag size={22} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Running Pick Up</span>
                        <span className="text-lg font-black italic tracking-tighter text-amber-600 dark:text-amber-400">
                            {currencySymbol} {totals.pickupSum.toFixed(0)}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                            {totals.pickupCount} Active Orders
                        </span>
                    </div>
                </div>

                {/* 3. Delivery Card */}
                <div className="udm-card p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden transition-all border-l-4 border-l-blue-500">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <Truck size={22} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Running Delivery</span>
                        <span className="text-lg font-black italic tracking-tighter text-blue-600 dark:text-blue-400">
                            {currencySymbol} {totals.deliverySum.toFixed(0)}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                            {totals.deliveryCount} Active Orders
                        </span>
                    </div>
                </div>

                {/* 4. Total KOTs / Active Card */}
                <div className="udm-card p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden transition-all border-l-4 border-l-purple-500">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                        <Activity size={22} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Fulfillment Load</span>
                        <span className="text-lg font-black italic tracking-tighter text-purple-600 dark:text-purple-400">
                            {totals.totalActiveCount} Running
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                            Unified Telemetry Load
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-h-[500px]">
                {/* Left Area: Active Cards Grid */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="udm-card rounded-2xl p-5 border border-slate-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                <span>Active Grid Monitor</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-black">
                                    {filteredOrders.length} orders
                                </span>
                            </h3>
                        </div>

                        {loading && filteredOrders.length === 0 ? (
                            <div className="py-24 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                                Reconnecting active telemetry streams...
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="py-24 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-3">
                                <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-black/30 flex items-center justify-center text-slate-300 dark:text-slate-700">
                                    <ChefHat size={28} />
                                </div>
                                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider"> Fulfillments Cleared: No Active Orders</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredOrders.map(item => {
                                        const isSelected = selectedOrder?.id === item.id;
                                        const isPending = item.status === 'PENDING';
                                        const isProcessing = item.status === 'PROCESSING' || item.status === 'PREPARING';

                                        // UDM Neon Glow Classes
                                        let glowClass = "udm-card";
                                        if (isPending) glowClass += " udm-card-glow-amber animate-udm-pulse";
                                        else if (isProcessing) glowClass += " udm-card-glow-cyan";
                                        else glowClass += " udm-card-glow-emerald";

                                        let badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
                                        if (item.type === 'PICKUP') badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
                                        if (item.type === 'DELIVERY') badgeStyle = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";

                                        const elapsed = Math.max(1, Math.floor((Date.now() - item.timestamp) / 60000));

                                        return (
                                            <motion.div
                                                layoutId={item.id}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.2 }}
                                                key={item.id}
                                                onClick={() => setSelectedOrderId(item.id)}
                                                className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between min-h-[150px] ${glowClass} ${
                                                    isSelected ? 'ring-2 ring-emerald-500 shadow-xl' : 'hover:scale-[1.01]'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="min-w-0">
                                                        <div className="font-black text-sm uppercase italic truncate tracking-tight text-slate-800 dark:text-white">
                                                            {item.title}
                                                        </div>
                                                        <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 truncate">
                                                            {item.subtitle}
                                                        </div>
                                                    </div>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase shrink-0 tracking-wider ${badgeStyle}`}>
                                                        {item.type === 'DINE_IN' ? 'Dine-In' : (item.type === 'PICKUP' ? 'Pick-Up' : 'Delivery')}
                                                    </span>
                                                </div>

                                                {(item.order?.payment_status === 'CUSTOMER_CONFIRMED' || item.payment_status === 'CUSTOMER_CONFIRMED') && (
                                                    <div className="bg-amber-400 text-amber-950 px-2 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider animate-pulse flex items-center justify-center gap-1 shadow-sm my-1">
                                                        <span>💰 CUSTOMER REPORTED PAID</span>
                                                    </div>
                                                )}

                                                <div className="space-y-1 mt-2 flex-1 overflow-hidden">
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate uppercase font-bold">
                                                        {item.items.map(it => `${it.product_name || it.name} x${it.quantity}`).join(', ')}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-end pt-3 border-t border-dashed border-slate-200 dark:border-white/10 mt-2">
                                                    <div className="text-[9px] font-black uppercase flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                        <Clock size={11} className="animate-pulse" /> {elapsed} {elapsed === 1 ? 'min' : 'mins'} ago
                                                    </div>
                                                    <span className="text-sm font-black tracking-tighter text-emerald-600 dark:text-emerald-400">
                                                        {currencySymbol} {parseFloat(item.total).toFixed(0)}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Area: Selected Order Details Pane */}
                <div className="lg:col-span-4">
                    <div className="udm-card rounded-2xl p-5 border border-slate-200 dark:border-white/10 sticky top-6 shadow-xl">
                        {selectedOrder ? (
                            <div className="space-y-5">
                                {/* Details Header */}
                                <div className="border-b border-dashed border-slate-200 dark:border-white/10 pb-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h3 className="text-md font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
                                                {selectedOrder.title}
                                            </h3>
                                            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                                                {selectedOrder.subtitle}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                            selectedOrder.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                            selectedOrder.status === 'PROCESSING' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' :
                                            selectedOrder.status === 'DISPATCHED' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                                            'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                        }`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                                        <Clock size={11} /> Placed {Math.max(1, Math.floor((Date.now() - selectedOrder.timestamp) / 60000))} mins ago
                                    </div>
                                </div>

                                {/* Items list */}
                                <div className="space-y-3">
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Order Items</h4>
                                    <div className="bg-slate-50 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5 max-h-[220px] overflow-y-auto custom-scrollbar">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="p-3 flex justify-between items-center text-xs">
                                                <div className="font-bold text-slate-800 dark:text-slate-200 uppercase truncate pr-2">
                                                    {item.product_name || item.name} <span className="text-slate-400 pl-1 font-medium">x{item.quantity}</span>
                                                </div>
                                                <span className="font-black text-slate-700 dark:text-slate-350 shrink-0">
                                                    {currencySymbol} {((parseFloat(item.price) || 0) * (item.quantity)).toFixed(0)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total summary */}
                                <div className="border-t border-dashed border-slate-200 dark:border-white/10 pt-4 space-y-2">
                                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                                        <span>Bill Subtotal</span>
                                        <span>{currencySymbol} {selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-md font-black uppercase italic tracking-tighter text-slate-900 dark:text-white pt-1">
                                        <span>Total Amount</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">{currencySymbol} {selectedOrder.total.toFixed(0)}</span>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                {selectedOrder.customer_name && selectedOrder.customer_name !== 'Table Guest' && selectedOrder.customer_name !== 'Walk-in Guest' && (
                                    <div className="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-3 rounded-xl space-y-2 text-xs">
                                        <div className="flex items-center gap-2 font-black uppercase text-[9px] text-slate-400 dark:text-slate-500">
                                            <User size={12} /> Contact Information
                                        </div>
                                        <div className="font-bold text-slate-800 dark:text-slate-200 uppercase">{selectedOrder.customer_name}</div>
                                        {selectedOrder.customer_number && (
                                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                                <Phone size={11} /> {selectedOrder.customer_number}
                                            </div>
                                        )}
                                        {selectedOrder.order?.address && selectedOrder.order?.address !== 'Pickup' && selectedOrder.order?.address !== 'Dine-In' && (
                                            <div className="flex items-start gap-1.5 text-slate-500 dark:text-slate-400 mt-1">
                                                <MapPin size={11} className="shrink-0 mt-0.5" />
                                                <span className="break-all">{selectedOrder.order.address}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Master POS Payment Verification Box */}
                                {(() => {
                                    const pStatus = String(selectedOrder.order?.payment_status || selectedOrder.payment_status || '').toUpperCase();
                                    if (pStatus === 'CUSTOMER_CONFIRMED' || pStatus.includes('CLAIM')) {
                                        return (
                                            <div className="p-3 bg-amber-500/10 border-2 border-amber-500/40 rounded-xl space-y-2 udm-card-glow-amber">
                                                <div className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                                    <span>💰 Customer Claimed Online Paid</span>
                                                </div>
                                                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">
                                                    Customer clicked "I've Paid" on menu / WhatsApp. Verify from your UPI app.
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleMarkPaymentPaid(selectedOrder, 'RECEIVED')}
                                                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-[9px] uppercase tracking-wider shadow-xs transition"
                                                    >
                                                        ✅ PAYMENT RECEIVED
                                                    </button>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleMarkPaymentPaid(selectedOrder, 'NOT_RECEIVED')}
                                                        className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-black text-[9px] uppercase tracking-wider shadow-xs transition"
                                                    >
                                                        ❌ NOT RECEIVED
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                    if (pStatus === 'RECEIVED' || pStatus === 'PAID' || pStatus === 'VERIFIED') {
                                        return (
                                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase">🟢 Payment Verified: Received</span>
                                                <button
                                                    disabled={actionLoading}
                                                    onClick={() => handleMarkPaymentPaid(selectedOrder, 'NOT_RECEIVED')}
                                                    className="text-[9px] font-bold text-rose-600 hover:underline"
                                                >
                                                    Change to Not Received
                                                </button>
                                            </div>
                                        );
                                    }
                                    if (pStatus === 'NOT_RECEIVED' || pStatus === 'UNPAID') {
                                        return (
                                            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between">
                                                <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase">🔴 Payment Alert: Not Received</span>
                                                <button
                                                    disabled={actionLoading}
                                                    onClick={() => handleMarkPaymentPaid(selectedOrder, 'RECEIVED')}
                                                    className="text-[9px] font-bold text-emerald-600 hover:underline"
                                                >
                                                    Mark as Received
                                                </button>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Action Buttons */}
                                <div className="space-y-2.5 pt-2">
                                    {selectedOrder.status === 'PENDING' && (
                                        <button 
                                            disabled={actionLoading}
                                            onClick={() => handleUpdateStatus(selectedOrder, 'PROCESSING')}
                                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            Process Order
                                        </button>
                                    )}

                                    {selectedOrder.status === 'PROCESSING' && (
                                        <button 
                                            disabled={actionLoading}
                                            onClick={() => handleUpdateStatus(selectedOrder, 'DISPATCHED')}
                                            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            Mark Ready / Dispatched
                                        </button>
                                    )}

                                    {(selectedOrder.status === 'DISPATCHED' || selectedOrder.status === 'SERVED' || (selectedOrder.type === 'DINE_IN' && selectedOrder.status === 'PENDING')) && (
                                        <button 
                                            disabled={actionLoading}
                                            onClick={() => handleUpdateStatus(selectedOrder, 'COMPLETED')}
                                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            Settle & Complete Bill
                                        </button>
                                    )}

                                    <button 
                                        disabled={actionLoading}
                                        onClick={() => {
                                            setCancelOrderId(selectedOrder.dbId);
                                            setCancelIsKot(selectedOrder.isKot);
                                            setCancelIsPosTable(selectedOrder.isPosStateTable || false);
                                            setIsCancelModalOpen(true);
                                        }}
                                        className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        Cancel Order / KOT
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
                                <ShoppingBag size={32} className="opacity-25" />
                                <p className="text-[10px] font-black uppercase tracking-wider">Select active order to inspect</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* 1. Top Running KOT Items */}
                <div className="udm-card p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <ChefHat size={14} className="text-emerald-500" /> Top Running KOT Items
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-white/10 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    <th className="pb-3 text-left">Item Name</th>
                                    <th className="pb-3 text-right">Quantity Required</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {runningKOTItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="py-8 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                            No active items in kitchen queue
                                        </td>
                                    </tr>
                                ) : (
                                    runningKOTItems.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-3 font-bold text-slate-800 dark:text-slate-200 uppercase">{item.name}</td>
                                            <td className="py-3 font-black text-slate-900 dark:text-white text-right text-sm italic">
                                                x{item.qty}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. Customers List */}
                <div className="udm-card p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <User size={14} className="text-blue-500" /> Customers Queue
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-white/10 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    <th className="pb-3 text-left">Customer</th>
                                    <th className="pb-3 text-center">Fulfillment Type</th>
                                    <th className="pb-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {activeCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="py-8 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                            No active customer fulfillment
                                        </td>
                                    </tr>
                                ) : (
                                    activeCustomers.map((cust, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-3">
                                                <div className="font-bold text-slate-800 dark:text-slate-200 uppercase">{cust.name}</div>
                                                <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{cust.phone}</div>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                                    cust.type === 'DINE_IN' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    cust.type === 'PICKUP' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                    {cust.type}
                                                </span>
                                            </td>
                                            <td className="py-3 font-black text-emerald-600 dark:text-emerald-400 text-right">
                                                {currencySymbol} {cust.total.toFixed(0)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Cancel Rejection Reason Modal */}
            {isCancelModalOpen && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal-content max-w-md p-6 relative">
                        <h3 className="text-md font-black uppercase italic tracking-tighter text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                            <XCircle className="w-5 h-5 text-rose-500 shrink-0" /> Cancel Fulfillment Order
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                            Provide a reason to reject/cancel this active order for auditing compliance.
                        </p>

                        <form onSubmit={handleCancelOrder} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    Reason Description
                                </label>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white transition-all outline-none focus:border-rose-500 min-h-[80px]"
                                    placeholder="ENTER DETAILED REJECTION REASON..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCancelModalOpen(false);
                                        setRejectionReason('');
                                    }}
                                    className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-wider"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2"
                                >
                                    Confirm Cancellation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderBoard;
