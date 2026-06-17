import React, { useState, useEffect } from "react";
import { 
  BarChart4, Search, RefreshCw, Filter, 
  Download, Calendar, Globe, Database, 
  TrendingUp, IndianRupee, ShieldCheck, 
  PieChart, FileText, ChevronDown, ListChecks, 
  ChevronRight, CalendarDays, CheckCircle2, 
  XCircle, AlertCircle, FileSpreadsheet,
  Eye, MessageSquare, Trash2, Pencil, Printer, X
} from "lucide-react";
import API_BASE from "../config";

const ExcelFileIcon = (props) => (
    <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <rect x="7" y="11" width="5" height="5" rx="0.5" fill="#107c41" stroke="#107c41" strokeWidth="1" />
        <path d="M8.2 12.2l2.6 2.6" stroke="white" strokeWidth="0.8" />
        <path d="M10.8 12.2l-2.6 2.6" stroke="white" strokeWidth="0.8" />
    </svg>
);

const PdfFileIcon = (props) => (
    <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <rect x="7" y="11" width="10" height="6" rx="0.5" fill="#d9381e" stroke="#d9381e" strokeWidth="1" />
        <path d="M8.5 12.5v3" stroke="white" strokeWidth="0.8" />
        <path d="M8.5 12.5h1a0.8 0.8 0 0 1 0.8 0.8v0.4a0.8 0.8 0 0 1-0.8 0.8h-1" stroke="white" strokeWidth="0.8" />
        <path d="M11.5 12.5v3" stroke="white" strokeWidth="0.8" />
        <path d="M11.5 12.5h0.8a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-0.8" stroke="white" strokeWidth="0.8" />
        <path d="M14.5 12.5v3" stroke="white" strokeWidth="0.8" />
        <path d="M14.5 12.5h1.2" stroke="white" strokeWidth="0.8" />
        <path d="M14.5 13.7h0.9" stroke="white" strokeWidth="0.8" />
    </svg>
);

const SalesReport = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // Helper to get local YYYY-MM-DD
    const getTodayDateString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const toLocalDateStr = (dateInput) => {
        if (!dateInput) return "";
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // Orders states
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Menus mapping states
    const [menusList, setMenusList] = useState([]);
    const [menuItemsMap, setMenuItemsMap] = useState({});

    // Collapsable states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isGenerationStatusOpen, setIsGenerationStatusOpen] = useState(false);
    const [outlets, setOutlets] = useState([]);

    // Filter fields states (Default start and end dates to today)
    const getTodayStartDateTime = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    };

    const getTodayEndDateTime = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    };

    const [startDateTime, setStartDateTime] = useState(getTodayStartDateTime());
    const [endDateTime, setEndDateTime] = useState(getTodayEndDateTime());
    const [dateRangeText, setDateRangeText] = useState("");

    // Custom Date Picker Dropdown State
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(getTodayStartDateTime());
    const [tempEndDate, setTempEndDate] = useState(getTodayEndDateTime());
    const [tempStartHour, setTempStartHour] = useState("12");
    const [tempStartMinute, setTempStartMinute] = useState("00");
    const [tempStartAMPM, setTempStartAMPM] = useState("AM");
    const [tempEndHour, setTempEndHour] = useState("11");
    const [tempEndMinute, setTempEndMinute] = useState("59");
    const [tempEndAMPM, setTempEndAMPM] = useState("PM");
    const [currentLeftMonth, setCurrentLeftMonth] = useState(new Date());

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfWeekIndex = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const formatDateString = (date, timeStr) => {
        if (!date) return "";
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dd = String(date.getDate()).padStart(2, '0');
        const mmm = months[date.getMonth()];
        const yyyy = date.getFullYear();
        return `${dd} ${mmm} ${yyyy} ${timeStr}`;
    };

    const formatTime = (date) => {
        let h = date.getHours();
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        const hStr = String(h).padStart(2, '0');
        return `${hStr}:${m}:${s} ${ampm}`;
    };

    const getDateTimeFromParts = (date, hour, minute, second, ampm) => {
        if (!date) return null;
        let h = parseInt(hour);
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, parseInt(minute), parseInt(second));
    };

    const commitRange = (start, end, sh, sm, sampm, eh, em, eampm) => {
        const sDate = getDateTimeFromParts(start, sh, sm, 0, sampm);
        const eDate = getDateTimeFromParts(end || start, eh, em, 59, eampm);
        setStartDateTime(sDate);
        setEndDateTime(eDate);
    };

    const confirmCustomRange = () => {
        if (!tempStartDate) return;
        const end = tempEndDate || tempStartDate;
        commitRange(tempStartDate, end, tempStartHour, tempStartMinute, tempStartAMPM, tempEndHour, tempEndMinute, tempEndAMPM);
        setIsDatePickerOpen(false);
    };

    const applyPreset = (presetType) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        if (presetType === "today") {
            start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        } else if (presetType === "yesterday") {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
            end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        } else if (presetType === "thisWeek") {
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(today);
            monday.setDate(diff);
            start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
            end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        } else if (presetType === "thisMonth") {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        } else if (presetType === "lastMonth") {
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
            end = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate());
        }

        setTempStartDate(start);
        setTempEndDate(end);
        setTempStartHour("12");
        setTempStartMinute("00");
        setTempStartAMPM("AM");
        setTempEndHour("11");
        setTempEndMinute("59");
        setTempEndAMPM("PM");

        commitRange(start, end, "12", "00", "AM", "11", "59", "PM");
        setIsDatePickerOpen(false);
    };

    const handleDayClick = (clickedDate) => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (clickedDate > today) return; // Block selecting future dates

        if (!tempStartDate || (tempStartDate && tempEndDate)) {
            setTempStartDate(clickedDate);
            setTempEndDate(null);
        } else {
            if (clickedDate < tempStartDate) {
                setTempStartDate(clickedDate);
            } else {
                setTempEndDate(clickedDate);
            }
        }
    };

    const navigateMonth = (direction) => {
        setCurrentLeftMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    };

    const renderCalendar = (monthDate, isRight = false) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = monthsNames[month];

        const daysInMonth = getDaysInMonth(year, month);
        const firstDayIdx = getFirstDayOfWeekIndex(year, month);

        const cells = [];
        // Leading empty cells
        for (let i = 0; i < firstDayIdx; i++) {
            cells.push(<div key={`empty-${i}`} className="w-6 h-6" />);
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isFuture = currentDate > today;
            
            let isSelectedStart = !isFuture && tempStartDate && (
                currentDate.getDate() === tempStartDate.getDate() &&
                currentDate.getMonth() === tempStartDate.getMonth() &&
                currentDate.getFullYear() === tempStartDate.getFullYear()
            );
            let isSelectedEnd = !isFuture && tempEndDate && (
                currentDate.getDate() === tempEndDate.getDate() &&
                currentDate.getMonth() === tempEndDate.getMonth() &&
                currentDate.getFullYear() === tempEndDate.getFullYear()
            );
            let isBetween = !isFuture && tempStartDate && tempEndDate && currentDate > tempStartDate && currentDate < tempEndDate;

            const cellClass = `w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-md transition-all select-none
                ${isFuture ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed pointer-events-none opacity-40' : 'cursor-pointer'}
                ${isSelectedStart || isSelectedEnd ? 'bg-emerald-600 text-white font-black scale-110 shadow-sm' : ''}
                ${isBetween ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' : ''}
                ${!isFuture && !isSelectedStart && !isSelectedEnd && !isBetween ? 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-350' : ''}
            `;

            cells.push(
                <div 
                    key={`day-${day}`} 
                    onClick={() => handleDayClick(currentDate)}
                    className={cellClass}
                >
                    {day}
                </div>
            );
        }

        const nextLeftMonth = new Date(currentLeftMonth.getFullYear(), currentLeftMonth.getMonth() + 1, 1);
        const nextRightMonth = new Date(nextLeftMonth.getFullYear(), nextLeftMonth.getMonth() + 1, 1);
        const isNextMonthFuture = nextRightMonth > new Date(today.getFullYear(), today.getMonth() + 1, 1);

        return (
            <div className="w-[180px] flex flex-col gap-2 shrink-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-1.5">
                    {/* Left arrow on Left Calendar, right arrow on Right Calendar */}
                    {!isRight ? (
                        <button 
                            type="button" 
                            onClick={() => navigateMonth(-1)}
                            className="p-1 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-slate-400"
                        >
                            &lt;
                        </button>
                    ) : <div className="w-5" />}
                    
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        {monthName} {year}
                    </span>

                    {isRight ? (
                        <button 
                            type="button" 
                            onClick={() => navigateMonth(1)}
                            disabled={isNextMonthFuture}
                            className="p-1 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            &gt;
                        </button>
                    ) : <div className="w-5" />}
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 text-center gap-y-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 text-center gap-y-1">
                    {cells}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (startDateTime && endDateTime) {
            const formattedStart = formatDateString(startDateTime, formatTime(startDateTime));
            const formattedEnd = formatDateString(endDateTime, formatTime(endDateTime));
            setDateRangeText(`${formattedStart} - ${formattedEnd}`);
        }
    }, [startDateTime, endDateTime]);

    const formatGenerateDate = (date) => {
        const day = date.getDate();
        let suffix = "th";
        if (day === 1 || day === 21 || day === 31) suffix = "st";
        else if (day === 2 || day === 22) suffix = "nd";
        else if (day === 3 || day === 23) suffix = "rd";
        
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        let h = date.getHours();
        const m = String(date.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        
        return `${day}${suffix} ${month} ${year} ${h}:${m} ${ampm}`;
    };

    const formatDateTimeStr = (d) => {
        if (!d) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    };

    const handleDownloadReport = (reportType, filename, mode) => {
        const logId = `RPT-${Math.floor(1000 + Math.random() * 9000)}`;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const generateByStr = user.name || user.username || "ShaheT";
        
        let reportLabel = "Sales Report";
        if (mode === "with_items") reportLabel = "Sales Report with items";
        else if (mode === "group_details") reportLabel = "Sales Report with Product Group Details";
        else if (mode === "eod") reportLabel = "EOD Report";

        const startStr = formatDateTimeStr(startDateTime);
        const endStr = formatDateTimeStr(endDateTime);
        const dateRangeStr = `${startStr} - ${endStr}`;

        const newLog = {
            id: logId,
            tmposId: sessionStorage.getItem("impersonate_id") || "757810",
            generateDate: formatGenerateDate(new Date()),
            generateBy: generateByStr,
            reportType: reportLabel,
            generationStatus: "PENDING",
            showDetails: false,
            dataSnapshot: [...safeFilteredOrders],
            filename: filename,
            mode: mode,
            dateRangeStr: dateRangeStr
        };

        setReportLogs(prev => [newLog, ...prev]);

        // Simulated processing progress: PENDING -> PROCESSING (1.5s) -> COMPLETED (1.5s)
        setTimeout(() => {
            setReportLogs(prev => prev.map(log => log.id === logId ? { ...log, generationStatus: "PROCESSING" } : log));
            
            setTimeout(() => {
                setReportLogs(prev => prev.map(log => log.id === logId ? { ...log, generationStatus: "COMPLETED" } : log));
            }, 1500);
        }, 1500);
    };

    const toggleLogDetails = (id) => {
        setReportLogs(prev => prev.map(log => log.id === id ? { ...log, showDetails: !log.showDetails } : log));
    };

    const [platformStore, setPlatformStore] = useState("All");
    const [selectMenu, setSelectMenu] = useState("All");
    const [paymentMode, setPaymentMode] = useState("All");
    const [kitchenDept, setKitchenDept] = useState("All");
    const [userType, setUserType] = useState("All");
    const [userName, setUserName] = useState("All");
    const [orderType, setOrderType] = useState("All");
    const [orderStatus, setOrderStatus] = useState("All");
    const [deliveryType, setDeliveryType] = useState("All");
    const [tableDept, setTableDept] = useState("All");
    const [orderSource, setOrderSource] = useState("All");
    const [taxGroup, setTaxGroup] = useState("All");
    const [searchCustomer, setSearchCustomer] = useState("");
    const [showTransferOrders, setShowTransferOrders] = useState(false);

    // Selected rows in table
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);

    // Report generation log states
    const [reportLogs, setReportLogs] = useState([]);
    const [additionalCharges, setAdditionalCharges] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    // Modal and edit states
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [selectedOrderForPaymentEdit, setSelectedOrderForPaymentEdit] = useState(null);
    const [editPaymentMethod, setEditPaymentMethod] = useState("");
    const [editPaymentAmount, setEditPaymentAmount] = useState("");
    const [isAmountEditable, setIsAmountEditable] = useState(false);
    const [outletPaymentModes, setOutletPaymentModes] = useState([]);

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const order = safeOrders.find(o => o.id === orderId);
            if (!order) return;
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";

            const resp = await fetch(`${API_BASE}/api/orders/${orderId}${targetParam}`, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...order,
                    status: newStatus
                })
            });
            if (resp.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                setFilteredOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert("Failed to update order status");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating order status");
        }
    };

    const handleUpdateOrderPayment = async (orderId, newPaymentMethod, newAmount) => {
        try {
            const token = localStorage.getItem("token");
            const order = safeOrders.find(o => o.id === orderId);
            if (!order) return;
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";

            const amountVal = parseFloat(newAmount);
            if (isNaN(amountVal) || amountVal < 0) {
                alert("Please enter a valid amount");
                return;
            }

            const resp = await fetch(`${API_BASE}/api/orders/${orderId}${targetParam}`, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...order,
                    payment_method: newPaymentMethod,
                    total_price: amountVal
                })
            });
            if (resp.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_method: newPaymentMethod, total_price: amountVal } : o));
                setFilteredOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_method: newPaymentMethod, total_price: amountVal } : o));
                setSelectedOrderForPaymentEdit(null);
            } else {
                alert("Failed to update order payment details");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating order payment details");
        }
    };

    const handleBulkDeleteOrders = async () => {
        if (selectedOrderIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedOrderIds.length} selected orders?`)) return;

        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";

            const resp = await fetch(`${API_BASE}/api/orders/bulk-delete${targetParam}`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ids: selectedOrderIds
                })
            });
            if (resp.ok) {
                setOrders(prev => prev.filter(o => !selectedOrderIds.includes(o.id)));
                setFilteredOrders(prev => prev.filter(o => !selectedOrderIds.includes(o.id)));
                setSelectedOrderIds([]);
                alert("Selected orders deleted successfully");
            } else {
                alert("Failed to delete orders");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting orders");
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const outletParam = impersonateId ? `?outlet_id=${impersonateId}` : "";
            const token = localStorage.getItem("token");

            // Fetch orders
            const resp = await fetch(`${API_BASE}/api/orders${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (resp.ok) {
                const data = await resp.json();
                const safeData = data || [];
                setOrders(safeData);

                // Initial load: filter by today's date range
                const sDate = getTodayStartDateTime();
                const eDate = getTodayEndDateTime();
                const initialFiltered = safeData.filter(o => {
                    const oDate = new Date(o.created_at);
                    return oDate >= sDate && oDate <= eDate;
                });
                setFilteredOrders(initialFiltered);
            }

            // Fetch menus
            try {
                const menuResp = await fetch(`${API_BASE}/api/brand/outlet-menus${outletParam}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (menuResp.ok) {
                    const menusData = await menuResp.json();
                    setMenusList(Array.isArray(menusData) ? menusData : []);
                }
            } catch (menuErr) {
                console.error("Failed to fetch menus:", menuErr);
            }

            // Fetch all items mapping to menus
            try {
                const itemsResp = await fetch(`${API_BASE}/api/brand/outlet-all-items${outletParam}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (itemsResp.ok) {
                    const itemsData = await itemsResp.json();
                    const mapping = {};
                    if (Array.isArray(itemsData)) {
                        itemsData.forEach(item => {
                            if (item.product_name && item.menu_name) {
                                mapping[item.product_name.toUpperCase()] = item.menu_name.toUpperCase();
                            }
                        });
                    }
                    setMenuItemsMap(mapping);
                }
            } catch (itemsErr) {
                console.error("Failed to fetch items mapping:", itemsErr);
            }

            // Fetch additional charges
            try {
                const chargesResp = await fetch(`${API_BASE}/api/additional-charges${outletParam}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (chargesResp.ok) {
                    const chargesData = await chargesResp.json();
                    setAdditionalCharges(Array.isArray(chargesData) ? chargesData : []);
                }
            } catch (chargesErr) {
                console.error("Failed to fetch additional charges:", chargesErr);
            }

            // Fetch active outlet payment modes
            try {
                const pmResp = await fetch(`${API_BASE}/api/pos/payment-modes${targetParam}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (pmResp.ok) {
                    const pmData = await pmResp.json();
                    setOutletPaymentModes(Array.isArray(pmData) ? pmData : []);
                }
            } catch (pmErr) {
                console.error("Failed to fetch payment modes:", pmErr);
            }

            // Fetch outlets
            try {
                const res = await fetch(`${API_BASE}/api/auth/my-outlets`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const outletsData = await res.json();
                    setOutlets(Array.isArray(outletsData) ? outletsData : []);
                }
            } catch (outletsErr) {
                console.error("Failed to fetch outlets:", outletsErr);
            }

        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const currentOutletId = sessionStorage.getItem("impersonate_id") || "global";
    const currentOutlet = outlets.find(o => String(o.id) === String(currentOutletId)) || (currentOutletId === "global" ? { outlet_name: "Global Overview" } : null);
    
    const getOutletDisplayName = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const brand = currentOutlet?.brand_name || currentOutlet?.business_name || currentOutlet?.name || user.business_name || user.brand_name || "Shahe Tehzeeb Restaurant";
        const outlet = currentOutlet?.outlet_name || currentOutlet?.name || user.business_name || "Shahe Tehzeeb Restaurant";
        return `${brand} - ${outlet}`;
    };

    // Filter Logic
    const handleApplyFilters = () => {
        let temp = [...safeOrders];

        // 1. Date & Time Range
        if (startDateTime) {
            temp = temp.filter(o => new Date(o.created_at) >= startDateTime);
        }
        if (endDateTime) {
            temp = temp.filter(o => new Date(o.created_at) <= endDateTime);
        }

        // 2. Platform Store
        if (platformStore !== "All") {
            temp = temp.filter(o => String(o.platform || '').toUpperCase() === platformStore.toUpperCase());
        }

        // 3. Payment Mode (Pay Mode)
        if (paymentMode !== "All") {
            temp = temp.filter(o => String(o.payment_method || '').toUpperCase() === paymentMode.toUpperCase());
        }

        // 4. User Name
        if (userName !== "All") {
            temp = temp.filter(o => String(o.waiter_name || o.created_by_name || 'Cashier admin').toUpperCase() === userName.toUpperCase());
        }

        // 5. Order Type
        if (orderType !== "All") {
            temp = temp.filter(o => String(o.order_type || '').toUpperCase() === orderType.toUpperCase());
        }

        // 6. Order Status
        if (orderStatus !== "All") {
            temp = temp.filter(o => String(o.status || '').toUpperCase() === orderStatus.toUpperCase());
        }

        // 7. Order Source
        if (orderSource !== "All") {
            temp = temp.filter(o => String(o.source || '').toUpperCase() === orderSource.toUpperCase());
        }

        // 8. Select Menu (Menu Name filter)
        if (selectMenu !== "All") {
            temp = temp.filter(o => {
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                } catch (e) {}
                if (!Array.isArray(itemsList)) return false;
                return itemsList.some(item => {
                    if (!item || !item.name) return false;
                    const itemMenuName = menuItemsMap[item.name.toUpperCase()];
                    return itemMenuName === selectMenu.toUpperCase();
                });
            });
        }

        // 9. Kitchen Department
        if (kitchenDept !== "All") {
            temp = temp.filter(o => {
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                } catch (e) {}
                if (!Array.isArray(itemsList)) return false;
                return itemsList.some(item => item && (item.kitchen_department === kitchenDept || item.kitchen_dept === kitchenDept));
            });
        }

        // 10. Delivery Type
        if (deliveryType !== "All") {
            temp = temp.filter(o => String(o.order_type || '').toUpperCase().includes(deliveryType.toUpperCase()) || String(o.address || '').toUpperCase().includes(deliveryType.toUpperCase()));
        }

        // 11. Table Department (Table Number)
        if (tableDept !== "All") {
            temp = temp.filter(o => o.table_number === tableDept);
        }

        // 12. Tax Product Group
        if (taxGroup !== "All") {
            temp = temp.filter(o => {
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                } catch (e) {}
                if (!Array.isArray(itemsList)) return false;
                return itemsList.some(item => item && item.tax_group === taxGroup);
            });
        }

        // 13. Customer Search
        if (searchCustomer.trim()) {
            const sc = searchCustomer.toLowerCase();
            temp = temp.filter(o => 
                String(o.customer_name || '').toLowerCase().includes(sc) ||
                String(o.customer_number || '').includes(sc)
            );
        }

        setFilteredOrders(temp);
        setCurrentPage(1);
        setSelectedOrderIds([]);
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        const sDate = getTodayStartDateTime();
        const eDate = getTodayEndDateTime();
        setStartDateTime(sDate);
        setEndDateTime(eDate);
        setTempStartDate(sDate);
        setTempEndDate(eDate);
        setTempStartHour("12");
        setTempStartMinute("00");
        setTempStartAMPM("AM");
        setTempEndHour("11");
        setTempEndMinute("59");
        setTempEndAMPM("PM");
        setPlatformStore("All");
        setSelectMenu("All");
        setPaymentMode("All");
        setKitchenDept("All");
        setUserType("All");
        setUserName("All");
        setOrderType("All");
        setOrderStatus("All");
        setDeliveryType("All");
        setTableDept("All");
        setOrderSource("All");
        setTaxGroup("All");
        setSearchCustomer("");
        setShowTransferOrders(false);

        // Reset to today's date range filter on reset
        const initialFiltered = safeOrders.filter(o => {
            const oDate = new Date(o.created_at);
            return oDate >= sDate && oDate <= eDate;
        });
        setFilteredOrders(initialFiltered);
        setCurrentPage(1);
        setSelectedOrderIds([]);
    };

    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeFilteredOrders = Array.isArray(filteredOrders) ? filteredOrders : [];

    // Calculate dynamic stats using safe arrays
    const totalSaleAmount = safeFilteredOrders.reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0);
    const totalTaxAmount = safeFilteredOrders.reduce((acc, curr) => acc + (parseFloat(curr.tax_cgst) || 0) + (parseFloat(curr.tax_sgst) || 0), 0);

    // Get unique values from orders to populate filters
    const uniquePlatforms = ["All", ...new Set(safeOrders.map(o => String(o.platform || 'DIRECT').toUpperCase()))];
    const uniquePaymentModes = ["All", ...new Set(safeOrders.map(o => String(o.payment_method || 'CASH').toUpperCase()))];
    const uniqueUserNames = ["All", ...new Set(safeOrders.map(o => String(o.waiter_name || o.created_by_name || 'Cashier admin')))];
    const uniqueOrderTypes = ["All", ...new Set(safeOrders.map(o => String(o.order_type || 'QUICK').toUpperCase()))];
    const uniqueOrderSources = ["All", ...new Set(safeOrders.map(o => String(o.source || 'POS_TERMINAL').toUpperCase()))];

    // Menu options from fetched outlet menus
    const menuOptions = ["All", ...new Set(menusList.map(m => m.menu_name).filter(Boolean))];

    // Dynamic Table Numbers
    const uniqueTables = ["All", ...new Set(safeOrders.map(o => o.table_number).filter(Boolean))];

    // Dynamic Kitchen Departments from items
    const uniqueKitchens = ["All"];
    safeOrders.forEach(o => {
        let itemsList = [];
        try {
            itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
        } catch (e) {}
        if (Array.isArray(itemsList)) {
            itemsList.forEach(item => {
                const kDept = item && (item.kitchen_department || item.kitchen_dept);
                if (kDept && !uniqueKitchens.includes(kDept)) {
                    uniqueKitchens.push(kDept);
                }
            });
        }
    });

    // Dynamic Tax Groups from items
    const taxGroupOptions = ["All"];
    safeOrders.forEach(o => {
        let itemsList = [];
        try {
            itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
        } catch (e) {}
        if (Array.isArray(itemsList)) {
            itemsList.forEach(item => {
                const tg = item && item.tax_group;
                if (tg && !taxGroupOptions.includes(tg)) {
                    taxGroupOptions.push(tg);
                }
            });
        }
    });

    // Checkbox selections
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrderIds(currentItems.map(o => o.id));
        } else {
            setSelectedOrderIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedOrderIds(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const computeEODData = (dataList) => {
        let dineInSales = 0, dineInTickets = 0;
        let pickupSales = 0, pickupTickets = 0;
        let digitalSales = 0, digitalTickets = 0;
        let deliverySales = 0, deliveryTickets = 0;

        let totalTaxSum = 0;
        let totalDiscountSum = 0;

        const chargeSums = {};
        additionalCharges.forEach(c => {
            chargeSums[c.name.toUpperCase()] = 0;
        });

        dataList.forEach(o => {
            const grandTotal = parseFloat(o.total_price || 0);
            const cgst = parseFloat(o.tax_cgst || 0);
            const sgst = parseFloat(o.tax_sgst || 0);
            const tax = cgst + sgst;
            const discount = parseFloat(o.discount_amount || 0);

            totalTaxSum += tax;
            totalDiscountSum += discount;

            let itemsList = [];
            try {
                itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                if (!Array.isArray(itemsList)) itemsList = [];
            } catch (e) {}

            itemsList.forEach(item => {
                if (item && item.is_charge) {
                    const price = parseFloat(item.price || 0);
                    const nameUpper = String(item.name).toUpperCase();
                    if (chargeSums[nameUpper] !== undefined) {
                        chargeSums[nameUpper] += price;
                    } else {
                        chargeSums[nameUpper] = price;
                    }
                }
            });

            const type = String(o.order_type || '').toUpperCase();
            const isDigital = o.is_digital_order;
            if (type === "DINE IN" || type === "DINE_IN" || type === "DINEIN") {
                dineInSales += grandTotal;
                dineInTickets += 1;
            } else if (type === "PICKUP" || type === "TAKEAWAY" || type === "TAKE_AWAY") {
                pickupSales += grandTotal;
                pickupTickets += 1;
            } else if (isDigital || type === "DIGITAL" || type === "DIGITAL ORDER" || type === "DIGITAL_ORDER") {
                digitalSales += grandTotal;
                digitalTickets += 1;
            } else {
                deliverySales += grandTotal;
                deliveryTickets += 1;
            }
        });

        const totalTickets = dataList.length;
        const totalSales = dataList.reduce((acc, o) => acc + parseFloat(o.total_price || 0), 0);
        const chargesTotal = Object.values(chargeSums).reduce((a, b) => a + b, 0);

        return {
            dineInSales, dineInTickets,
            pickupSales, pickupTickets,
            digitalSales, digitalTickets,
            deliverySales, deliveryTickets,
            netSalesSum: totalSales - totalTaxSum - chargesTotal,
            totalTaxSum,
            totalDiscountSum,
            chargeSums,
            totalTickets,
            totalSales
        };
    };

    const triggerEODPDFDownload = () => {
        const eod = computeEODData(safeFilteredOrders);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const outletName = currentOutlet?.outlet_name || currentOutlet?.name || user.business_name || user.brand_name || "Shahe Tehzeeb Restaurant";
        const fromDateStr = formatDateString(startDateTime, "").trim();
        const toDateStr = formatDateString(endDateTime, "").trim();
        const genDateStr = formatGenerateDate(new Date());

        const pmSales = {};
        const pmTickets = {};
        safeFilteredOrders.forEach(o => {
            const pm = o.payment_method || "Cash";
            pmSales[pm] = (pmSales[pm] || 0) + parseFloat(o.total_price || 0);
            pmTickets[pm] = (pmTickets[pm] || 0) + 1;
        });
        const paymentModesCount = Object.keys(pmSales).length;

        const kitchenSales = {};
        safeFilteredOrders.forEach(o => {
            let itemsList = [];
            try {
                itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                if (!Array.isArray(itemsList)) itemsList = [];
            } catch (e) {}
            itemsList.forEach(item => {
                if (item && !item.is_charge && !item.is_discount) {
                    const dept = item.kitchen_department || item.kitchen_dept || "Food Kitchen";
                    const itemTotal = (parseFloat(item.price || 0) * (parseFloat(item.qty || item.quantity) || 1));
                    kitchenSales[dept] = (kitchenSales[dept] || 0) + itemTotal;
                }
            });
        });
        if (Object.keys(kitchenSales).length === 0) {
            kitchenSales["Food Kitchen"] = eod.totalSales;
        }
        const kitchenTotal = Object.values(kitchenSales).reduce((a, b) => a + b, 0) || 1;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>End of Day Report</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        color: #1e293b;
                        margin: 0;
                        padding: 40px;
                        font-size: 11px;
                        background: #fff;
                    }
                    .header-container {
                        background-color: #1e3a8a;
                        color: white;
                        padding: 20px 24px;
                        border-radius: 4px;
                        margin-bottom: 20px;
                        position: relative;
                    }
                    .header-top {
                        display: flex;
                        justify-content: space-between;
                        font-size: 10px;
                        font-weight: 800;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        opacity: 0.9;
                    }
                    .header-title {
                        font-size: 20px;
                        font-weight: 900;
                        margin: 8px 0 2px 0;
                        text-transform: uppercase;
                        letter-spacing: -0.02em;
                    }
                    .header-subtitle {
                        font-size: 11px;
                        font-weight: 600;
                        opacity: 0.9;
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 12px;
                        margin-bottom: 24px;
                    }
                    .stat-card {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        padding: 12px;
                        text-align: center;
                        border-radius: 4px;
                    }
                    .stat-label {
                        font-size: 9px;
                        font-weight: 800;
                        color: #64748b;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .stat-val {
                        font-size: 16px;
                        font-weight: 900;
                        color: #0f172a;
                        margin-top: 4px;
                    }
                    .section-title {
                        background-color: #1e3a8a;
                        color: white;
                        font-size: 10px;
                        font-weight: 850;
                        padding: 6px 10px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-top: 20px;
                        margin-bottom: 8px;
                        border-radius: 2px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 16px;
                    }
                    th {
                        font-size: 9px;
                        font-weight: 800;
                        color: #475569;
                        text-transform: uppercase;
                        border-bottom: 2px solid #cbd5e1;
                        padding: 6px 8px;
                        text-align: left;
                    }
                    td {
                        padding: 6px 8px;
                        border-bottom: 1px solid #e2e8f0;
                        color: #334155;
                    }
                    .text-right {
                        text-align: right;
                    }
                    .font-bold {
                        font-weight: 700;
                    }
                    .footer {
                        margin-top: 40px;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 8px;
                        display: flex;
                        justify-content: space-between;
                        font-size: 9px;
                        color: #94a3b8;
                        font-weight: 600;
                    }
                    @media print {
                        body {
                            padding: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div class="header-top">
                        <span>SASLOOP POS &mdash; BACK OFFICE</span>
                        <span>PERIOD: ${fromDateStr} - ${toDateStr}</span>
                    </div>
                    <h2 class="header-title">End of Day Report</h2>
                    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <span class="header-subtitle">${outletName}</span>
                        <span style="font-size: 10px; font-weight: 600; opacity: 0.9;">GENERATED: ${genDateStr}</span>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Total Sales</div>
                        <div class="stat-val">&#8377;${eod.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Total Tickets</div>
                        <div class="stat-val">${eod.totalTickets}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Avg / Ticket</div>
                        <div class="stat-val">&#8377;${(eod.totalTickets > 0 ? eod.totalSales / eod.totalTickets : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Payment Modes</div>
                        <div class="stat-val">${paymentModesCount}</div>
                    </div>
                </div>

                <div class="section-title">Sale Type Summary</div>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th class="text-right">Net Sale</th>
                            <th class="text-right">Tickets</th>
                            <th class="text-right">Avg / Ticket</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Dine In</td>
                            <td class="text-right">&#8377;${eod.dineInSales.toFixed(2)}</td>
                            <td class="text-right">${eod.dineInTickets}</td>
                            <td class="text-right">&#8377;${(eod.dineInTickets > 0 ? eod.dineInSales / eod.dineInTickets : 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Pickup</td>
                            <td class="text-right">&#8377;${eod.pickupSales.toFixed(2)}</td>
                            <td class="text-right">${eod.pickupTickets}</td>
                            <td class="text-right">&#8377;${(eod.pickupTickets > 0 ? eod.pickupSales / eod.pickupTickets : 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Digital Order</td>
                            <td class="text-right">&#8377;${eod.digitalSales.toFixed(2)}</td>
                            <td class="text-right">${eod.digitalTickets}</td>
                            <td class="text-right">&#8377;${(eod.digitalTickets > 0 ? eod.digitalSales / eod.digitalTickets : 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Delivery</td>
                            <td class="text-right">&#8377;${eod.deliverySales.toFixed(2)}</td>
                            <td class="text-right">${eod.deliveryTickets}</td>
                            <td class="text-right">&#8377;${(eod.deliveryTickets > 0 ? eod.deliverySales / eod.deliveryTickets : 0).toFixed(2)}</td>
                        </tr>
                        <tr class="font-bold" style="background-color: #f8fafc;">
                            <td>Total</td>
                            <td class="text-right">&#8377;${eod.totalSales.toFixed(2)}</td>
                            <td class="text-right">${eod.totalTickets}</td>
                            <td class="text-right">&#8377;${(eod.totalTickets > 0 ? eod.totalSales / eod.totalTickets : 0).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="section-title">Payment Summary</div>
                <table>
                    <thead>
                        <tr>
                            <th>Mode</th>
                            <th class="text-right">Amount</th>
                            <th class="text-right">Tickets</th>
                            <th class="text-right">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(pmSales).map(([pm, amt]) =>
                            '<tr>' +
                                '<td>' + pm + '</td>' +
                                '<td class="text-right">&#8377;' + amt.toFixed(2) + '</td>' +
                                '<td class="text-right">' + pmTickets[pm] + '</td>' +
                                '<td class="text-right">' + (eod.totalTickets > 0 ? (pmTickets[pm] / eod.totalTickets) * 100 : 0).toFixed(2) + '%</td>' +
                            '</tr>'
                        ).join("")}
                    </tbody>
                </table>

                <div class="section-title">Kitchen Sales</div>
                <table>
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th class="text-right">Amount</th>
                            <th class="text-right">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(kitchenSales).map(([dept, amt]) =>
                            '<tr>' +
                                '<td>' + dept + '</td>' +
                                '<td class="text-right">&#8377;' + amt.toFixed(2) + '</td>' +
                                '<td class="text-right">' + ((amt / kitchenTotal) * 100).toFixed(2) + '%</td>' +
                            '</tr>'
                        ).join("")}
                        <tr class="font-bold" style="background-color: #f8fafc;">
                            <td>Total</td>
                            <td class="text-right">&#8377;${kitchenTotal.toFixed(2)}</td>
                            <td class="text-right">100.00%</td>
                        </tr>
                    </tbody>
                </table>

                <div class="section-title">Sales & Tax Summary</div>
                <table>
                    <tbody>
                        <tr>
                            <td>Net Sales</td>
                            <td class="text-right">&#8377;${eod.netSalesSum.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Total Tax on Charges</td>
                            <td class="text-right">&#8377;${eod.totalTaxSum.toFixed(2)}</td>
                        </tr>
                        ${Object.entries(eod.chargeSums).map(([name, sum]) =>
                            '<tr>' +
                                '<td>' + name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' ') + '</td>' +
                                '<td class="text-right">&#8377;' + sum.toFixed(2) + '</td>' +
                            '</tr>'
                        ).join("")}
                        <tr class="font-bold" style="background-color: #f8fafc;">
                            <td>Net Sales + Additional Charges + Tax</td>
                            <td class="text-right">&#8377;${(eod.netSalesSum + Object.values(eod.chargeSums).reduce((a, b) => a + b, 0) + eod.totalTaxSum).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Rounded Amount</td>
                            <td class="text-right">&#8377;0.00</td>
                        </tr>
                        <tr class="font-bold" style="font-size: 12px; background-color: #f1f5f9;">
                            <td>Total Sales</td>
                            <td class="text-right">&#8377;${eod.totalSales.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="section-title">Discount Details:</div>
                <table>
                    <tbody>
                        <tr>
                            <td>Discount</td>
                            <td class="text-right">&#8377;0.00</td>
                        </tr>
                        <tr>
                            <td>Total Discount</td>
                            <td class="text-right">&#8377;${eod.totalDiscountSum.toFixed(2)}</td>
                        </tr>
                        <tr class="font-bold" style="background-color: #f8fafc;">
                            <td>Sub Total After Discount</td>
                            <td class="text-right">&#8377;${(eod.totalSales - eod.totalDiscountSum).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <span>SaSLoop POS Back Office &mdash; Confidential</span>
                    <span>${genDateStr}</span>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = safeFilteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(safeFilteredOrders.length / itemsPerPage) || 1;

    // CSV Download engine
    const triggerCSVDownload = (dataList, filename, mode = "standard") => {
        if (!dataList || dataList.length === 0) {
            alert("No records to export.");
            return;
        }

        let headers = [];
        let rows = [];

        if (mode === "standard") {
            const chargeHeaders = additionalCharges.map(c => c.name);

            headers = [
                "Order Id", "Custom Order Id", "Bill No", "E Comm bill number", "Bar Bill Number", 
                "Order Date", "Order Time Placed Time", "Settlement Time", "No. Of Items", 
                "Sub Total", "Discount", "Total", "Discount Reason", "Discount Reason", "Coupon Discount",
                ...chargeHeaders,
                "Item Level Total Charge", "Tax On Charge", "Total", "Rounded Amount", 
                "Status", "Outlet Name", "User", "Type", "Customer Name", "Phone", 
                "Customer Address", "Delivery Boy", "Delivery Boy Phone", "Payment Mode", 
                "Payment Ref. No.", "Instructions", "Reason", "Order Source", "Cover/Guest", 
                "OrderHub (Captian User)", "Transfer Order", "Table Name", "Waiter"
            ];

            rows = dataList.map((o, idx) => {
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                    if (!Array.isArray(itemsList)) itemsList = [];
                } catch (e) {
                    itemsList = [];
                }

                // Date and Time formatting
                const createdDate = new Date(o.created_at);
                
                // DD-MM-YYYY format
                const orderDateStr = (() => {
                    if (isNaN(createdDate.getTime())) return "";
                    const dd = String(createdDate.getDate()).padStart(2, '0');
                    const mm = String(createdDate.getMonth() + 1).padStart(2, '0');
                    const yyyy = createdDate.getFullYear();
                    return `${dd}-${mm}-${yyyy}`;
                })();

                // Placed Time (hh:mm AM/PM)
                const placedTimeStr = (() => {
                    if (isNaN(createdDate.getTime())) return "";
                    let h = createdDate.getHours();
                    const m = String(createdDate.getMinutes()).padStart(2, '0');
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12;
                    h = h ? h : 12;
                    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
                })();

                // Settlement Time (YYYY-MM-DD hh:mm AM/PM)
                const settlementTimeStr = (() => {
                    if (isNaN(createdDate.getTime())) return "";
                    const yyyy = createdDate.getFullYear();
                    const mm = String(createdDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(createdDate.getDate()).padStart(2, '0');
                    return `${yyyy}-${mm}-${dd} ${placedTimeStr}`;
                })();

                // Count actual food items, excluding charges/discounts
                const foodItems = itemsList.filter(item => !item.is_charge && !item.is_discount);
                const noOfItems = foodItems.reduce((acc, item) => acc + (parseFloat(item.qty || item.quantity) || 1), 0);

                const discountAmt = parseFloat(o.discount_amount || 0);
                const cgst = parseFloat(o.tax_cgst || 0);
                const sgst = parseFloat(o.tax_sgst || 0);
                const totalTax = cgst + sgst;
                const grandTotal = parseFloat(o.total_price || 0);
                const subTotal = grandTotal - totalTax + discountAmt;

                // Dynamic charges columns mapping
                const chargeValues = additionalCharges.map(charge => {
                    const chargeItem = itemsList.find(item => item.is_charge && String(item.name).toUpperCase() === String(charge.name).toUpperCase());
                    return chargeItem ? parseFloat(chargeItem.price || 0).toFixed(2) : "0.00";
                });

                // Item Level Total Charge
                const itemLevelCharges = itemsList.filter(item => item.is_charge);
                const itemLevelTotalCharge = itemLevelCharges.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);

                const statusLabel = o.status === 'COMPLETED' ? 'Fulfilled' : 
                                    o.status === 'CANCELLED' ? 'Cancelled' : 
                                    o.status || 'Pending';

                const creatorName = o.waiter_name || o.created_by_name || "admin143";

                return [
                    o.id,
                    o.order_reference || "",
                    o.bill_no || "",
                    "", // E Comm bill number
                    "", // Bar Bill Number
                    orderDateStr,
                    placedTimeStr,
                    settlementTimeStr,
                    noOfItems,
                    subTotal.toFixed(2),
                    discountAmt.toFixed(2),
                    grandTotal.toFixed(2), // Total (subtotal - discount)
                    "", // Discount Reason
                    "", // Discount Reason (column N)
                    "0.00", // Coupon Discount
                    ...chargeValues,
                    itemLevelTotalCharge.toFixed(2),
                    "0.00", // Tax On Charge
                    grandTotal.toFixed(2), // Total
                    "0.00", // Rounded Amount
                    statusLabel,
                    "Shahe Tehzeeb Restaurant",
                    creatorName,
                    o.order_type || "Dine In",
                    o.customer_name || "",
                    o.customer_number || "",
                    o.address || "",
                    "", // Delivery Boy
                    "", // Delivery Boy Phone
                    o.payment_method || "Cash",
                    "", // Payment Ref. No.
                    "", // Instructions
                    "", // Reason
                    o.source || "atlantic_pos",
                    "1.00", // Cover/Guest
                    creatorName, // OrderHub (Captain User)
                    "No", // Transfer Order
                    o.table_number && o.table_number !== "0" ? `${o.table_number}` : "",
                    o.waiter_name || ""
                ];
            });
        } else if (mode === "with_items") {
            headers = [
                "Order Id", "Bill No", "Order Date", "Order Time", "No. Of Items", 
                "Sub Total", "Discount", "Total Discount", "Coupon Discount", "Item Level Charges", 
                "Total Charges", "Tax On Charges", "Total", "Rounded Amount", "Status", 
                "Outlet Name", "User", "Type", "Customer Name", "Phone", 
                "Waiter", "Delivery Boy", "Delivery Boy Phone", "Payment Mode", "Reason", 
                "HSN Code", "Item Name", "Price", "Qty", "Total", 
                "Product Group", "Category Name", "Return Item"
            ];

            rows = [];
            dataList.forEach((o) => {
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                    if (!Array.isArray(itemsList)) itemsList = [];
                } catch (e) {
                    itemsList = [];
                }

                // Date and Time formatting
                const createdDate = new Date(o.created_at);
                
                // DD-MM-YYYY format
                const orderDateStr = (() => {
                    if (isNaN(createdDate.getTime())) return "";
                    const dd = String(createdDate.getDate()).padStart(2, '0');
                    const mm = String(createdDate.getMonth() + 1).padStart(2, '0');
                    const yyyy = createdDate.getFullYear();
                    return `${dd}-${mm}-${yyyy}`;
                })();

                // Placed Time (hh:mm AM/PM)
                const placedTimeStr = (() => {
                    if (isNaN(createdDate.getTime())) return "";
                    let h = createdDate.getHours();
                    const m = String(createdDate.getMinutes()).padStart(2, '0');
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12;
                    h = h ? h : 12;
                    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
                })();

                // Count actual food items, excluding charges/discounts
                const foodItems = itemsList.filter(item => !item.is_charge && !item.is_discount);
                const noOfItems = foodItems.reduce((acc, item) => acc + (parseFloat(item.qty || item.quantity) || 1), 0);

                const discountAmt = parseFloat(o.discount_amount || 0);
                const cgst = parseFloat(o.tax_cgst || 0);
                const sgst = parseFloat(o.tax_sgst || 0);
                const totalTax = cgst + sgst;
                const grandTotal = parseFloat(o.total_price || 0);
                const subTotal = grandTotal - totalTax + discountAmt;

                // Item Level Total Charge
                const itemLevelCharges = itemsList.filter(item => item.is_charge);
                const itemLevelTotalCharge = itemLevelCharges.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);

                const statusLabel = o.status === 'COMPLETED' ? 'Fulfilled' : 
                                    o.status === 'CANCELLED' ? 'Cancelled' : 
                                    o.status || 'Pending';

                const creatorName = o.waiter_name || o.created_by_name || "admin143";

                // Outlet name lookup from restaurant_id or currentOutlet
                const orderOutlet = outlets.find(ot => String(ot.id) === String(o.restaurant_id));
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const outletName = orderOutlet?.outlet_name || orderOutlet?.name || currentOutlet?.outlet_name || currentOutlet?.name || user.business_name || user.brand_name || "Shahe Tehzeeb Restaurant";

                if (foodItems.length === 0) {
                    // If no food items, write a single row with empty item details
                    rows.push([
                        o.id,
                        o.bill_no || "",
                        orderDateStr,
                        placedTimeStr,
                        noOfItems,
                        subTotal.toFixed(2),
                        discountAmt.toFixed(2),
                        discountAmt.toFixed(2),
                        "0.00",
                        itemLevelTotalCharge.toFixed(2),
                        itemLevelTotalCharge.toFixed(2),
                        "0.00",
                        grandTotal.toFixed(2),
                        "0.00",
                        statusLabel,
                        outletName,
                        creatorName,
                        o.order_type || "Dine In",
                        o.customer_name || "",
                        o.customer_number || "",
                        o.waiter_name || "",
                        "", // Delivery Boy
                        "", // Delivery Boy Phone
                        o.payment_method || "Cash",
                        "", // Reason
                        "", // HSN Code
                        "", // Item Name
                        "", // Price
                        "", // Qty
                        "", // Total
                        "", // Product Group
                        "", // Category Name
                        ""  // Return Item
                    ]);
                } else {
                    foodItems.forEach((item, itemIdx) => {
                        const itemPrice = parseFloat(item.price || 0);
                        const itemQty = parseFloat(item.qty || item.quantity || 1);
                        const itemTotal = itemPrice * itemQty;
                        const itemProductGroup = item.product_group || item.group || "FOOD";
                        const itemCategoryName = item.category_name || item.category || (item.name ? menuItemsMap[item.name.toUpperCase()] : "") || "";

                        if (itemIdx === 0) {
                            // First row has both order-level and item-level details
                            rows.push([
                                o.id,
                                o.bill_no || "",
                                orderDateStr,
                                placedTimeStr,
                                noOfItems,
                                subTotal.toFixed(2),
                                discountAmt.toFixed(2),
                                discountAmt.toFixed(2),
                                "0.00",
                                itemLevelTotalCharge.toFixed(2),
                                itemLevelTotalCharge.toFixed(2),
                                "0.00",
                                grandTotal.toFixed(2),
                                "0.00",
                                statusLabel,
                                outletName,
                                creatorName,
                                o.order_type || "Dine In",
                                o.customer_name || "",
                                o.customer_number || "",
                                o.waiter_name || "",
                                "", // Delivery Boy
                                "", // Delivery Boy Phone
                                o.payment_method || "Cash",
                                "", // Reason
                                "", // HSN Code
                                item.name || "",
                                itemPrice.toFixed(2),
                                itemQty.toString(),
                                itemTotal.toFixed(2),
                                itemProductGroup,
                                itemCategoryName,
                                ""  // Return Item
                            ]);
                        } else {
                            // Subsequent rows have empty order-level columns (indices 0 to 25)
                            rows.push([
                                "", "", "", "", "", "", "", "", "", "",
                                "", "", "", "", "", "", "", "", "", "",
                                "", "", "", "", "", "", // Columns A to Z are empty
                                item.name || "",
                                itemPrice.toFixed(2),
                                itemQty.toString(),
                                itemTotal.toFixed(2),
                                itemProductGroup,
                                itemCategoryName,
                                ""  // Return Item
                            ]);
                        }
                    });
                }

                // Add two empty rows after each order
                const emptyRow = Array(33).fill("");
                rows.push(emptyRow);
                rows.push(emptyRow);
            });
        } else if (mode === "group_details") {
            const chargeHeaders = additionalCharges.map(c => c.name);
            
            // Collect unique tax groups dynamically from items
            const taxGroups = [];
            dataList.forEach(o => {
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                } catch (e) {}
                if (Array.isArray(itemsList)) {
                    itemsList.forEach(item => {
                        const tg = item && item.tax_group;
                        if (tg && !taxGroups.includes(tg)) {
                            taxGroups.push(tg);
                        }
                    });
                }
            });
            if (taxGroups.length === 0) {
                taxGroups.push("0%");
            }
            taxGroups.sort((a, b) => parseFloat(a) - parseFloat(b));

            headers = [
                "Bill Date", "Order Id", "Bill No", "Qty", "Taxable Amount", 
                "Discount", ...chargeHeaders, "Round Off", "Total Amount", 
                ...taxGroups, "Status"
            ];

            rows = dataList.map((o) => {
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                    if (!Array.isArray(itemsList)) itemsList = [];
                } catch (e) {
                    itemsList = [];
                }

                // Date formatting as YYYY-MM-DD
                const createdDate = new Date(o.created_at);
                const billDateStr = (() => {
                    if (isNaN(createdDate.getTime())) return "";
                    const yyyy = createdDate.getFullYear();
                    const mm = String(createdDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(createdDate.getDate()).padStart(2, '0');
                    return `${yyyy}-${mm}-${dd}`;
                })();

                // Count food items quantity sum
                const foodItems = itemsList.filter(item => !item.is_charge && !item.is_discount);
                const qtySum = foodItems.reduce((acc, item) => acc + (parseFloat(item.qty || item.quantity) || 1), 0);

                const cgst = parseFloat(o.tax_cgst || 0);
                const sgst = parseFloat(o.tax_sgst || 0);
                const totalTax = cgst + sgst;
                const grandTotal = parseFloat(o.total_price || 0);
                const taxableAmount = grandTotal - totalTax;

                // Dynamic charges columns mapping
                const chargeValues = additionalCharges.map(charge => {
                    const chargeItem = itemsList.find(item => item.is_charge && String(item.name).toUpperCase() === String(charge.name).toUpperCase());
                    return chargeItem ? parseFloat(chargeItem.price || 0).toFixed(2) : "0.00";
                });

                // Dynamic tax rates columns mapping
                const taxValues = taxGroups.map(tg => {
                    let groupTaxSum = 0;
                    let hasItemInGroup = false;
                    itemsList.forEach(item => {
                        if (item && item.tax_group === tg) {
                            hasItemInGroup = true;
                            if (item.tax_amount !== undefined) {
                                groupTaxSum += parseFloat(item.tax_amount) || 0;
                            } else {
                                const rate = parseFloat(tg) / 100;
                                if (!isNaN(rate) && rate > 0) {
                                    const itemPrice = parseFloat(item.price || 0);
                                    const itemQty = parseFloat(item.qty || item.quantity || 1);
                                    groupTaxSum += itemPrice * itemQty * rate;
                                }
                            }
                        }
                    });
                    if (!hasItemInGroup && taxGroups.length === 1 && totalTax > 0) {
                        groupTaxSum = totalTax;
                    }
                    return groupTaxSum.toFixed(2);
                });

                const statusLabel = o.status === 'COMPLETED' ? 'fulfilled' : 
                                    o.status === 'CANCELLED' ? 'cancelled' : 
                                    String(o.status || 'pending').toLowerCase();

                return [
                    billDateStr,
                    o.id,
                    o.bill_no || "",
                    qtySum.toFixed(2),
                    taxableAmount.toFixed(2),
                    parseFloat(o.discount_amount || 0).toFixed(2),
                    ...chargeValues,
                    "0.00", // Round Off
                    grandTotal.toFixed(2),
                    ...taxValues,
                    statusLabel
                ];
            });
        } else if (mode === "eod") {
            const eod = computeEODData(dataList);
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const outletName = currentOutlet?.outlet_name || currentOutlet?.name || user.business_name || user.brand_name || "Shahe Tehzeeb Restaurant";
            const address = currentOutlet?.address || user.address || "1st floor Rather Plaza, Kangan, Jammu and Kashmir 191202";
            const storeNo = currentOutlet?.phone || currentOutlet?.id || "757810";

            headers = ["EOD Report Details", ""];
            rows = [
                ["Outlet Name", outletName],
                ["Email", currentOutlet?.email || ""],
                ["Website", currentOutlet?.website || ""],
                ["Address", address],
                ["Store No:", storeNo],
                ["TIN No:", ""],
                ["STX:", ""],
                ["Bill No:", dataList.length > 0 ? `${dataList[dataList.length - 1].bill_no || 0} - ${dataList[0].bill_no || 0}` : "0 - 0"],
                ["Total Tickets:", eod.totalTickets],
                ["From Date:", formatDateString(startDateTime, "").trim()],
                ["To Date:", formatDateString(endDateTime, "").trim()],
                [],
                ["Sale Type", "Net Sale(Subtotal without discount)", "Tickets(Order Count)", "Avg./Tickets", "Avg Sale Per Cover / Guest", "%"],
                ["Dine In", eod.dineInSales.toFixed(2), eod.dineInTickets, (eod.dineInTickets > 0 ? eod.dineInSales / eod.dineInTickets : 0).toFixed(2), (eod.dineInTickets > 0 ? eod.dineInSales / eod.dineInTickets : 0).toFixed(2), (eod.totalTickets > 0 ? (eod.dineInTickets / eod.totalTickets) * 100 : 0).toFixed(2) + "%"],
                ["Pickup", eod.pickupSales.toFixed(2), eod.pickupTickets, (eod.pickupTickets > 0 ? eod.pickupSales / eod.pickupTickets : 0).toFixed(2), (eod.pickupTickets > 0 ? eod.pickupSales / eod.pickupTickets : 0).toFixed(2), (eod.totalTickets > 0 ? (eod.pickupTickets / eod.totalTickets) * 100 : 0).toFixed(2) + "%"],
                ["Digital Order", eod.digitalSales.toFixed(2), eod.digitalTickets, (eod.digitalTickets > 0 ? eod.digitalSales / eod.digitalTickets : 0).toFixed(2), (eod.digitalTickets > 0 ? eod.digitalSales / eod.digitalTickets : 0).toFixed(2), (eod.totalTickets > 0 ? (eod.digitalTickets / eod.totalTickets) * 100 : 0).toFixed(2) + "%"],
                ["Delivery", eod.deliverySales.toFixed(2), eod.deliveryTickets, (eod.deliveryTickets > 0 ? eod.deliverySales / eod.deliveryTickets : 0).toFixed(2), (eod.deliveryTickets > 0 ? eod.deliverySales / eod.deliveryTickets : 0).toFixed(2), (eod.totalTickets > 0 ? (eod.deliveryTickets / eod.totalTickets) * 100 : 0).toFixed(2) + "%"],
                ["Total", eod.totalSales.toFixed(2), eod.totalTickets, (eod.totalTickets > 0 ? eod.totalSales / eod.totalTickets : 0).toFixed(2), (eod.totalTickets > 0 ? eod.totalSales / eod.totalTickets : 0).toFixed(2), "100.00%"],
                [],
                ["Settlement Type", "Amount", "Ticket", "%"]
            ];

            // Add payment modes to EOD CSV
            const pmSales = {};
            const pmTickets = {};
            dataList.forEach(o => {
                const pm = o.payment_method || "Cash";
                pmSales[pm] = (pmSales[pm] || 0) + parseFloat(o.total_price || 0);
                pmTickets[pm] = (pmTickets[pm] || 0) + 1;
            });
            Object.entries(pmSales).forEach(([pm, amt]) => {
                rows.push([pm, amt.toFixed(2), pmTickets[pm], (eod.totalTickets > 0 ? (pmTickets[pm] / eod.totalTickets) * 100 : 0).toFixed(2) + "%"]);
            });

            rows.push([]);
            rows.push(["Sales & Tax Summary", ""]);
            rows.push(["Net Sales", eod.netSalesSum.toFixed(2)]);
            rows.push(["Total Tax on Charges", eod.totalTaxSum.toFixed(2)]);
            
            // Add dynamic charges to CSV
            Object.entries(eod.chargeSums).forEach(([name, sum]) => {
                rows.push([name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' '), sum.toFixed(2)]);
            });

            const chargesSum = Object.values(eod.chargeSums).reduce((a, b) => a + b, 0);
            rows.push(["Net Sales + Additional Charges + Tax", (eod.netSalesSum + chargesSum + eod.totalTaxSum).toFixed(2)]);
            rows.push(["Rounded Amount", "0.00"]);
            rows.push(["Total Sales", eod.totalSales.toFixed(2)]);
            rows.push([]);
            rows.push(["Discount Details:", ""]);
            rows.push(["Discount", "0.00"]);
            rows.push(["Total Discount", eod.totalDiscountSum.toFixed(2)]);
            rows.push(["Sub Total After Discount", (eod.totalSales - eod.totalDiscountSum).toFixed(2)]);
            rows.push([]);

            // Kitchen sales to CSV
            rows.push(["Kitchen Wise Sale", "Amount", "%"]);
            const kitchenSales = {};
            dataList.forEach(o => {
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                    if (!Array.isArray(itemsList)) itemsList = [];
                } catch (e) {}
                itemsList.forEach(item => {
                    if (item && !item.is_charge && !item.is_discount) {
                        const dept = item.kitchen_department || item.kitchen_dept || "Food Kitchen";
                        const itemTotal = (parseFloat(item.price || 0) * (parseFloat(item.qty || item.quantity) || 1));
                        kitchenSales[dept] = (kitchenSales[dept] || 0) + itemTotal;
                    }
                });
            });
            if (Object.keys(kitchenSales).length === 0) {
                kitchenSales["Food Kitchen"] = eod.totalSales;
            }
            const kitchenTotal = Object.values(kitchenSales).reduce((a, b) => a + b, 0) || 1;
            Object.entries(kitchenSales).forEach(([dept, amt]) => {
                rows.push([dept, amt.toFixed(2), ((amt / kitchenTotal) * 100).toFixed(2) + "%"]);
            });
            rows.push(["Total", kitchenTotal.toFixed(2), "100.00%"]);
        }

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] border-b border-slate-200 dark:border-white/5 px-6 py-3 -mx-6 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-md">
                        <BarChart4 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Sales Report</h2>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Financial intelligence & operational sales analysis</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchOrders}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all text-slate-500"
                        title="Reload Manifest"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Sales Report Filter Box */}
            <div className={`bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden ${isFilterOpen ? "p-5" : "px-5 py-3"}`}>
                <div 
                    className={`flex items-center justify-between cursor-pointer select-none ${isFilterOpen ? "border-b border-slate-100 dark:border-white/5 pb-3 mb-4" : ""}`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <div className="flex items-center gap-2 shrink-0">
                        <Filter className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11.5px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Sales Report Filter</span>
                    </div>

                    {!isFilterOpen && (
                        <>
                            <div className="hidden md:flex items-center justify-center flex-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 px-4 select-none">
                                {getOutletDisplayName()}
                            </div>
                            <div className="text-[10px] font-black text-slate-550 dark:text-slate-400 mr-4 select-none uppercase tracking-wider">
                                {dateRangeText}
                            </div>
                        </>
                    )}

                    <button className="flex items-center justify-center w-5 h-5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 font-black text-[14px] shrink-0">
                        {isFilterOpen ? "−" : "+"}
                    </button>
                </div>

                {isFilterOpen && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-700 dark:text-white">
                            {/* Row 1 */}
                            <div className="space-y-1 md:col-span-2 relative">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">From - To Date</label>
                                <div 
                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold uppercase cursor-pointer flex items-center justify-between hover:border-slate-350 dark:hover:border-white/10 transition-all select-none h-9 text-slate-800 dark:text-white"
                                >
                                    <span className="truncate">{dateRangeText}</span>
                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                                </div>

                                {isDatePickerOpen && (
                                    <div className="absolute top-[105%] left-0 z-50 bg-white dark:bg-[#1c1f26] border border-slate-200 dark:border-white/5 rounded-xl shadow-xl p-4 flex flex-col md:flex-row gap-4 animate-in fade-in duration-200 text-slate-800 dark:text-white w-max max-w-[95vw] md:max-w-none">
                                        {/* Presets Panel */}
                                        <div className="flex flex-col gap-1.5 w-full md:w-32 border-r border-slate-100 dark:border-white/5 pr-4 shrink-0 text-left">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Presets</span>
                                            <button type="button" onClick={() => applyPreset("today")} className="text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-350">Today</button>
                                            <button type="button" onClick={() => applyPreset("yesterday")} className="text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-350">Yesterday</button>
                                            <button type="button" onClick={() => applyPreset("thisWeek")} className="text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-300">This Week</button>
                                            <button type="button" onClick={() => applyPreset("thisMonth")} className="text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-300">This Month</button>
                                            <button type="button" onClick={() => applyPreset("lastMonth")} className="text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-300">Last Month</button>
                                        </div>

                                        {/* Calendars Panel */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Left Calendar */}
                                                {renderCalendar(currentLeftMonth, false)}
                                                {/* Right Calendar */}
                                                {renderCalendar(new Date(currentLeftMonth.getFullYear(), currentLeftMonth.getMonth() + 1, 1), true)}
                                            </div>

                                            {/* Times and Actions Bar */}
                                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3 mt-1 flex-wrap gap-3">
                                                {/* Time Dropdowns */}
                                                <div className="flex items-center gap-4 text-[9.5px] font-bold text-slate-400">
                                                    <div className="flex items-center gap-1">
                                                        <span>From:</span>
                                                        <select 
                                                            value={tempStartHour}
                                                            onChange={(e) => setTempStartHour(e.target.value)}
                                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded px-1.5 py-0.5 outline-none font-bold text-slate-700 dark:text-slate-300"
                                                        >
                                                            {Array.from({ length: 12 }).map((_, idx) => {
                                                                const val = String(idx + 1).padStart(2, '0');
                                                                return <option key={val} value={val}>{val}</option>;
                                                            })}
                                                        </select>
                                                        <span>:</span>
                                                        <select 
                                                            value={tempStartMinute}
                                                            onChange={(e) => setTempStartMinute(e.target.value)}
                                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded px-1.5 py-0.5 outline-none font-bold text-slate-700 dark:text-slate-300"
                                                        >
                                                            {Array.from({ length: 60 }).map((_, idx) => {
                                                                const val = String(idx).padStart(2, '0');
                                                                return <option key={val} value={val}>{val}</option>;
                                                            })}
                                                        </select>
                                                        <select 
                                                            value={tempStartAMPM}
                                                            onChange={(e) => setTempStartAMPM(e.target.value)}
                                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded px-1.5 py-0.5 outline-none font-bold text-slate-700 dark:text-slate-300"
                                                        >
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <span>To:</span>
                                                        <select 
                                                            value={tempEndHour}
                                                            onChange={(e) => setTempEndHour(e.target.value)}
                                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded px-1.5 py-0.5 outline-none font-bold text-slate-700 dark:text-slate-300"
                                                        >
                                                            {Array.from({ length: 12 }).map((_, idx) => {
                                                                const val = String(idx + 1).padStart(2, '0');
                                                                return <option key={val} value={val}>{val}</option>;
                                                            })}
                                                        </select>
                                                        <span>:</span>
                                                        <select 
                                                            value={tempEndMinute}
                                                            onChange={(e) => setTempEndMinute(e.target.value)}
                                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded px-1.5 py-0.5 outline-none font-bold text-slate-700 dark:text-slate-300"
                                                        >
                                                            {Array.from({ length: 60 }).map((_, idx) => {
                                                                const val = String(idx).padStart(2, '0');
                                                                return <option key={val} value={val}>{val}</option>;
                                                            })}
                                                        </select>
                                                        <select 
                                                            value={tempEndAMPM}
                                                            onChange={(e) => setTempEndAMPM(e.target.value)}
                                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded px-1.5 py-0.5 outline-none font-bold text-slate-700 dark:text-slate-300"
                                                        >
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 ml-auto">
                                                    <button type="button" onClick={() => setIsDatePickerOpen(false)} className="px-3 py-1.5 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] font-black uppercase hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-500">Cancel</button>
                                                    <button type="button" onClick={confirmCustomRange} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase transition-all">Apply Range</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Platform Store</label>
                                <select 
                                    value={platformStore}
                                    onChange={(e) => setPlatformStore(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    {uniquePlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Select Menu</label>
                                <select 
                                    value={selectMenu}
                                    onChange={(e) => setSelectMenu(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    {menuOptions.map(item => <option key={item} value={item}>{item}</option>)}
                                </select>
                            </div>

                            {/* Row 2 */}
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Payment List</label>
                                <select 
                                    value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    {uniquePaymentModes.map(pm => <option key={pm} value={pm}>{pm}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kitchen Department</label>
                                <select 
                                    value={kitchenDept}
                                    onChange={(e) => setKitchenDept(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    {uniqueKitchens.map(kd => <option key={kd} value={kd}>{kd}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">User Type</label>
                                <select 
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    <option value="All">All</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="WAITER">WAITER</option>
                                    <option value="USER">USER</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">User Name</label>
                                <select 
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    {uniqueUserNames.map(un => <option key={un} value={un}>{un}</option>)}
                                </select>
                            </div>

                            {/* Row 3 */}
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Order Type</label>
                                <select 
                                    value={orderType}
                                    onChange={(e) => setOrderType(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    {uniqueOrderTypes.map(ot => <option key={ot} value={ot}>{ot}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Order Status</label>
                                <select 
                                    value={orderStatus}
                                    onChange={(e) => setOrderStatus(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    <option value="All">All</option>
                                    <option value="COMPLETED">Fulfilled</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Delivery Type</label>
                                <select 
                                    value={deliveryType}
                                    onChange={(e) => setDeliveryType(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    <option value="All">All</option>
                                    <option value="Rider">Rider</option>
                                    <option value="Self">Self</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Table Department</label>
                                <select 
                                    value={tableDept}
                                    onChange={(e) => setTableDept(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    {uniqueTables.map(t => {
                                        if (t === "All") return <option key={t} value={t}>All Department</option>;
                                        return <option key={t} value={t}>Table {t}</option>;
                                    })}
                                </select>
                            </div>

                            {/* Row 4 */}
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Order Source</label>
                                <select 
                                    value={orderSource}
                                    onChange={(e) => setOrderSource(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    {uniqueOrderSources.map(os => <option key={os} value={os}>{os}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tax Product Group</label>
                                <select 
                                    value={taxGroup}
                                    onChange={(e) => setTaxGroup(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                >
                                    {taxGroupOptions.map(tg => <option key={tg} value={tg}>{tg}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1 lg:col-span-2">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Search Customer</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder="Search customer name or phone..."
                                        value={searchCustomer}
                                        onChange={(e) => setSearchCustomer(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg pl-9 pr-3 py-2 text-[10.5px] font-bold outline-none focus:border-emerald-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Transfer Checkbox & Filter Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                                <input 
                                    type="checkbox" 
                                    checked={showTransferOrders}
                                    onChange={(e) => setShowTransferOrders(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-emerald-600 rounded cursor-pointer"
                                />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Show Transfer Orders</span>
                            </label>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={handleResetFilters}
                                    className="flex-1 sm:flex-none px-6 py-2 border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-550/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                    Reset
                                </button>
                                <button 
                                    onClick={handleApplyFilters}
                                    className="flex-1 sm:flex-none px-10 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-600/10"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Report Generation Status */}
            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                <div 
                    className={`px-5 py-3.5 bg-slate-50/50 dark:bg-white/2 flex items-center justify-between cursor-pointer select-none ${isGenerationStatusOpen ? "border-b border-slate-100 dark:border-white/5" : ""}`}
                    onClick={() => setIsGenerationStatusOpen(!isGenerationStatusOpen)}
                >
                    <span className="text-[11.5px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Report Generation Status</span>
                    <button className="flex items-center justify-center w-5 h-5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 font-black text-[14px]">
                        {isGenerationStatusOpen ? "−" : "+"}
                    </button>
                </div>
                {isGenerationStatusOpen && (
                    <div className="overflow-x-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-55/30 dark:bg-white/1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    <th className="px-5 py-3">TMPOS ID</th>
                                    <th className="px-5 py-3">Generate Date</th>
                                    <th className="px-5 py-3">Generate By</th>
                                    <th className="px-5 py-3">Report Type</th>
                                    <th className="px-5 py-3">Generation Status</th>
                                    <th className="px-5 py-3">Report Status</th>
                                    <th className="px-5 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportLogs.length === 0 ? (
                                    <tr className="border-b border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-400 text-center">
                                        <td colSpan="7" className="py-8 uppercase">No Data Found</td>
                                    </tr>
                                ) : (
                                    reportLogs.map((log, idx) => (
                                        <React.Fragment key={log.id}>
                                            <tr className="border-b border-slate-150 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                <td className="px-5 py-3.5 font-mono">{log.tmposId}</td>
                                                <td className="px-5 py-3.5">{log.generateDate}</td>
                                                <td className="px-5 py-3.5">{log.generateBy}</td>
                                                <td className="px-5 py-3.5">{log.reportType}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                        log.generationStatus === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' :
                                                        log.generationStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-600' :
                                                        'bg-slate-500/10 text-slate-500 dark:text-slate-400'
                                                    }`}>
                                                        {log.generationStatus}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button 
                                                        onClick={() => toggleLogDetails(log.id)}
                                                        className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded text-[9.5px] font-black uppercase hover:bg-slate-200 transition-all"
                                                    >
                                                        {log.showDetails ? "Hide Details" : "Show Details"}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    {log.generationStatus === 'COMPLETED' ? (
                                                        <button 
                                                            onClick={() => triggerCSVDownload(log.dataSnapshot, log.filename, log.mode)}
                                                            className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all inline-block"
                                                            title="Download Report"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400 dark:text-slate-650 font-bold">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                            {log.showDetails && (
                                                <tr className="bg-slate-50/30 dark:bg-white/1">
                                                    <td colSpan="7" className="px-10 py-4 border-b border-slate-150 dark:border-white/5">
                                                        <div className="flex flex-col gap-1.5 max-w-lg mx-auto text-[10.5px] font-bold text-slate-600 dark:text-slate-400">
                                                            <div className="flex justify-between border-b border-slate-50 dark:border-white/1 pb-1">
                                                                <span className="w-1/2 text-right pr-4 text-slate-400 dark:text-slate-500 font-bold">Report Generated between Date :</span>
                                                                <span className="w-1/2 text-left">{log.dateRangeStr}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b border-slate-50 dark:border-white/1 pb-1">
                                                                <span className="w-1/2 text-right pr-4 text-slate-400 dark:text-slate-500 font-bold">Generated By :</span>
                                                                <span className="w-1/2 text-left font-mono">{log.generateBy}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="w-1/2 text-right pr-4 text-slate-400 dark:text-slate-500 font-bold">These Outlets generated reports :</span>
                                                                <span className="w-1/2 text-left">{log.tmposId} - {currentOutlet?.outlet_name || currentOutlet?.name || user.business_name || user.brand_name || "Shahe Tehzeeb Restaurant"}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Sales Stats and Download Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales Statistics Box */}
                <div className="lg:col-span-6 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                        <span className="text-[11.5px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Sales Statistics</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-950/20 text-blue-500">
                                <IndianRupee className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Sale</p>
                                <h3 className="text-[15px] font-black text-slate-800 dark:text-white mt-0.5">
                                    ₹{totalSaleAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    <span className="text-[10.5px] font-bold text-slate-400 ml-1">({filteredOrders.length})</span>
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Tax</p>
                                <h3 className="text-[15px] font-black text-slate-800 dark:text-white mt-0.5">
                                    ₹{totalTaxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download Reports Options */}
                <div className="lg:col-span-6 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                        <span className="text-[11.5px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Download Reports</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {/* 1. Download Sales Report */}
                        <div 
                            onClick={() => handleDownloadReport("Sales Report", "sales_report.csv", "standard")}
                            className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-white/2 border border-slate-200 dark:border-white/5 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-2xl border border-slate-150 dark:border-white/5 flex items-center justify-center shrink-0 bg-white dark:bg-slate-900 group-hover:border-emerald-500/30 transition-all shadow-sm">
                                <Download className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-all" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Download Sales Report</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Order ledger details</span>
                            </div>
                        </div>

                        {/* 2. Sales Report With Items */}
                        <div 
                            onClick={() => handleDownloadReport("With Items", "sales_report_with_items.csv", "with_items")}
                            className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-white/2 border border-slate-200 dark:border-white/5 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-2xl border border-slate-150 dark:border-white/5 flex items-center justify-center shrink-0 bg-white dark:bg-slate-900 group-hover:border-amber-500/30 transition-all shadow-sm">
                                <Download className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-all" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Sales Report With Items</span>
                                    <span className="px-2 py-0.5 bg-yellow-400 text-slate-900 text-[8px] font-black uppercase rounded-md tracking-wider shadow-sm">NEW</span>
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Including items detail</span>
                            </div>
                        </div>

                        {/* 3. Sales Report With Group Details */}
                        <div 
                            onClick={() => handleDownloadReport("Group Details", "sales_report_with_group_details.csv", "group_details")}
                            className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-white/2 border border-slate-200 dark:border-white/5 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-2xl border border-slate-150 dark:border-white/5 flex items-center justify-center shrink-0 bg-white dark:bg-slate-900 group-hover:border-blue-500/30 transition-all shadow-sm">
                                <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-all" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Sales Report With Group Details</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Aggregations summary</span>
                            </div>
                        </div>

                        {/* 4. EOD Report with PDF option */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/2 border border-slate-200 dark:border-white/5 rounded-2xl">
                            <div 
                                onClick={() => handleDownloadReport("EOD Report", "eod_report.csv", "eod")}
                                className="flex-1 flex items-center gap-4 cursor-pointer group"
                            >
                                <div className="w-12 h-12 rounded-2xl border border-slate-150 dark:border-white/5 flex items-center justify-center shrink-0 bg-white dark:bg-slate-900 group-hover:border-emerald-500/30 transition-all shadow-sm">
                                    <ExcelFileIcon className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-all" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-tight">EOD Report</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">End of day audit summary</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => triggerEODPDFDownload()}
                                className="w-12 h-12 rounded-2xl border border-slate-150 dark:border-white/5 hover:border-red-500/30 flex items-center justify-center bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-all ml-4 shadow-sm group/pdf"
                                title="Download PDF"
                            >
                                <PdfFileIcon className="w-5 h-5 text-slate-400 group-hover/pdf:text-red-500 transition-all" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Report Ledger Table */}
            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 flex justify-between items-center">
                    <span className="text-[11.5px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Sales Report</span>
                    {selectedOrderIds.length > 0 && (
                        <button 
                            onClick={() => triggerCSVDownload(filteredOrders.filter(o => selectedOrderIds.includes(o.id)), "exported_selections.csv", "standard")}
                            className="px-3 py-1 bg-indigo-650 hover:bg-indigo-500 text-white rounded text-[9.5px] font-black uppercase transition-all flex items-center gap-1.5"
                        >
                            <Download className="w-3 h-3" /> Export Selected ({selectedOrderIds.length})
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-55/30 dark:bg-white/1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                <th className="px-5 py-1.5">Action</th>
                                <th className="px-5 py-1.5 w-16">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            onChange={handleSelectAll} 
                                            checked={currentItems.length > 0 && currentItems.every(o => selectedOrderIds.includes(o.id))}
                                            className="w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer"
                                        />
                                        {selectedOrderIds.length > 0 && (
                                            <button 
                                                onClick={handleBulkDeleteOrders}
                                                className="p-1 bg-red-650 hover:bg-red-500 text-white rounded-md transition-all shadow-sm"
                                                title="Delete Selected Orders"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </th>
                                <th className="px-3 py-1.5">Sr. No.</th>
                                <th className="px-5 py-1.5">Unique Id</th>
                                <th className="px-5 py-1.5">Custom Order Id</th>
                                <th className="px-5 py-1.5">Bill No</th>
                                <th className="px-5 py-1.5">E-Comm Bill Number</th>
                                <th className="px-5 py-1.5">Bar Bill Number</th>
                                <th className="px-5 py-1.5">Customer Name</th>
                                <th className="px-5 py-1.5">Customer Phone</th>
                                <th className="px-5 py-1.5">Order Type</th>
                                <th className="px-5 py-1.5">Status</th>
                                <th className="px-5 py-1.5">Pay Mode</th>
                                <th className="px-5 py-1.5">Order Source</th>
                                <th className="px-5 py-1.5 text-right">Total</th>
                                <th className="px-5 py-1.5 text-right">Date Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="16" className="py-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
                                        Fetching Manifest Ledger...
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr className="border-b border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-400 text-center">
                                    <td colSpan="16" className="py-10 uppercase">No Data Found</td>
                                </tr>
                            ) : (
                                currentItems.map((o, idx) => (
                                    <tr key={o.id} className="border-b border-slate-150 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/2 text-[11px] font-medium text-slate-700 dark:text-slate-350">
                                        <td className="px-5 py-1">
                                            <div className="flex items-center gap-1 bg-[#2c3d36] dark:bg-[#1a2b24] p-1 rounded-md w-max">
                                                <button 
                                                    onClick={() => setSelectedOrderDetails(o)}
                                                    className="text-white hover:text-emerald-400 transition-all p-0.5"
                                                    title="View Bill"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                </button>
                                                <button 
                                                    className="text-white hover:text-emerald-400 transition-all p-0.5"
                                                    title="Message"
                                                >
                                                    <MessageSquare className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-5 py-1">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedOrderIds.includes(o.id)}
                                                onChange={() => handleSelectRow(o.id)}
                                                className="w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-3 py-1">{indexOfFirstItem + idx + 1}</td>
                                        <td className="px-5 py-1 font-mono text-slate-500">{o.id}</td>
                                        <td className="px-5 py-1 font-mono text-slate-500">
                                            {o.order_reference || "-"}
                                        </td>
                                        <td className="px-5 py-1">{o.bill_no || "-"}</td>
                                        <td className="px-5 py-1">-</td>
                                        <td className="px-5 py-1">-</td>
                                        <td className="px-5 py-1">{o.customer_name || "Walk-in"}</td>
                                        <td className="px-5 py-1">{o.customer_number || "-"}</td>
                                        <td className="px-5 py-1">
                                            <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[8px] font-black uppercase">
                                                {o.order_type || "QUICK"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-1">
                                            <select
                                                value={o.status || "PENDING"}
                                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                                className="bg-white dark:bg-[#15171e] border border-slate-200 dark:border-white/10 rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-indigo-500 transition-all h-6"
                                            >
                                                <option value="PLACED">Placed</option>
                                                <option value="ACKNOWLEDGED">Acknowledged</option>
                                                <option value="FOOD_READY">Food Ready</option>
                                                <option value="DISPATCHED">Dispatched</option>
                                                <option value="CANCELLED">Cancelled</option>
                                                <option value="DELETED">Deleted</option>
                                                <option value="FREE">Free</option>
                                                <option value="COMPLETED">Fulfilled</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="AWAITING_PAYMENT">Payment Pending</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-slate-650 dark:text-slate-350 text-[11px] font-medium">
                                                    {o.payment_method || "CASH"}
                                                </span>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedOrderForPaymentEdit(o);
                                                        setEditPaymentMethod(o.payment_method || "Cash");
                                                        setEditPaymentAmount(parseFloat(o.total_price || 0).toFixed(2));
                                                        setIsAmountEditable(false);
                                                    }}
                                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors p-0.5"
                                                    title="Edit Payment Mode"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-5 py-1">{o.source || "POS_TERMINAL"}</td>
                                        <td className="px-5 py-1 text-right font-black text-slate-800 dark:text-white">
                                            ₹{parseFloat(o.total_price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-1 text-right text-slate-400 font-normal">
                                            {new Date(o.created_at).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit', hour12: true
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                    {/* Pagination Controls */}
                    {filteredOrders.length > itemsPerPage && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} Entries
                            </span>
                            <div className="flex gap-1">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className="px-3 py-1.5 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500 disabled:opacity-50 transition-all hover:bg-slate-50"
                                >
                                    Previous
                                </button>
                                <div className="flex gap-0.5">
                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setCurrentPage(idx + 1)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                                                currentPage === idx + 1 
                                                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md' 
                                                    : 'bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-50'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    className="px-3 py-1.5 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500 disabled:opacity-50 transition-all hover:bg-slate-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
            </div>

            {/* Payment Details Modal */}
            {selectedOrderForPaymentEdit && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1c1f26] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-150">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 flex justify-between items-center">
                            <h3 className="text-[12px] font-black uppercase text-slate-800 dark:text-white">Payment Details</h3>
                            <button 
                                onClick={() => setSelectedOrderForPaymentEdit(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5">
                            <table className="w-full text-left text-[11px] font-bold border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 uppercase tracking-wider text-[9.5px]">
                                        <th className="pb-2">Payment Mode</th>
                                        <th className="pb-2">Amount</th>
                                        <th className="pb-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-4 pr-3">
                                            <select
                                                value={editPaymentMethod}
                                                onChange={(e) => setEditPaymentMethod(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-2.5 py-2 text-[11px] font-bold outline-none focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                                            >
                                                {(() => {
                                                    const modesList = [...(outletPaymentModes.length > 0 ? outletPaymentModes.map(m => m.method_name || m) : [
                                                        "Cash", "Paytm", "GooglePay", "Freecharge", "Card", "Zomato", "Swiggy", 
                                                        "UberEats", "BhimPay", "Dealbox", "Magicpin", "Dineout", "Stripe", 
                                                        "ApplePay", "AmazonPay", "BharatPe", "Zomato Pro", "Airtel Money", 
                                                        "Ola Money", "Mobikwik"
                                                    ])];
                                                    const currentMethod = selectedOrderForPaymentEdit.payment_method || "Cash";
                                                    if (!modesList.some(m => String(m).toUpperCase() === String(currentMethod).toUpperCase())) {
                                                        modesList.push(currentMethod);
                                                    }
                                                    return modesList.map((m) => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ));
                                                })()}
                                            </select>
                                        </td>
                                        <td className="py-4 font-mono text-slate-700 dark:text-slate-350">
                                            {isAmountEditable ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editPaymentAmount}
                                                    onChange={(e) => setEditPaymentAmount(e.target.value)}
                                                    className="w-24 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-2 py-1 text-[11px] font-bold outline-none focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                                                />
                                            ) : (
                                                <span>₹{parseFloat(editPaymentAmount || 0).toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={() => setIsAmountEditable(!isAmountEditable)}
                                                className="px-3 py-1 bg-slate-900 dark:bg-white/5 text-white dark:text-slate-300 rounded text-[9.5px] font-black uppercase hover:bg-slate-800 transition-all"
                                            >
                                                {isAmountEditable ? "Disable" : "Edit"}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 dark:border-white/5 pt-4">
                                <button 
                                    onClick={() => setSelectedOrderForPaymentEdit(null)}
                                    className="px-4 py-2 border border-slate-200 dark:border-white/5 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={() => handleUpdateOrderPayment(selectedOrderForPaymentEdit.id, editPaymentMethod, editPaymentAmount)}
                                    className="px-5 py-2 bg-[#2c3d36] hover:bg-[#1a2b24] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-md"
                                >
                                    Save Bill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrderDetails && (() => {
                let itemsList = [];
                try {
                    itemsList = typeof selectedOrderDetails.items === 'string' 
                        ? JSON.parse(selectedOrderDetails.items) 
                        : selectedOrderDetails.items;
                    if (!Array.isArray(itemsList)) itemsList = [];
                } catch (e) {
                    itemsList = [];
                }

                const oPrice = parseFloat(selectedOrderDetails.total_price || 0);
                const oTaxC = parseFloat(selectedOrderDetails.tax_cgst || 0);
                const oTaxS = parseFloat(selectedOrderDetails.tax_sgst || 0);
                const oTaxTotal = oTaxC + oTaxS;
                const oDiscount = parseFloat(selectedOrderDetails.discount_amount || 0);
                const oSubtotal = oPrice - oTaxTotal + oDiscount;

                const formatReceiptDate = (dateStr) => {
                    if (!dateStr) return "-";
                    const d = new Date(dateStr);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    const hours = String(d.getHours()).padStart(2, '0');
                    const minutes = String(d.getMinutes()).padStart(2, '0');
                    const seconds = String(d.getSeconds()).padStart(2, '0');
                    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
                };

                const numberToWords = (num) => {
                    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
                    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
                    const scales = ['', 'thousand', 'lakh', 'crore'];

                    let n = Math.floor(num);
                    if (n === 0) return 'zero only';

                    const helper = (val) => {
                        let str = '';
                        if (val >= 100) {
                            str += ones[Math.floor(val / 100)] + ' hundred';
                            val %= 100;
                            if (val > 0) {
                                str += ' and ';
                            } else {
                                str += ' ';
                            }
                        }
                        if (val >= 20) {
                            str += tens[Math.floor(val / 10)] + ' ';
                            val %= 10;
                        }
                        if (val > 0) {
                            str += ones[val] + ' ';
                        }
                        return str.trim();
                    };

                    let wordList = [];
                    let scaleIdx = 0;

                    let part = n % 1000;
                    if (part > 0) {
                        wordList.unshift(helper(part));
                    }
                    n = Math.floor(n / 1000);

                    while (n > 0) {
                        scaleIdx++;
                        let part = n % 100;
                        if (part > 0) {
                            wordList.unshift(helper(part) + ' ' + scales[scaleIdx]);
                        }
                        n = Math.floor(n / 100);
                    }

                    return wordList.join(' ').trim() + ' only';
                };

                return (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                        <style>{`
                            @media print {
                                html, body {
                                    margin: 0 !important;
                                    padding: 0 !important;
                                    width: 80mm !important;
                                    background: white !important;
                                }
                                body * {
                                    visibility: hidden !important;
                                    background: transparent !important;
                                    color: black !important;
                                    box-shadow: none !important;
                                }
                                #print-invoice-area, #print-invoice-area * {
                                    visibility: visible !important;
                                }
                                #print-invoice-area {
                                    position: fixed !important;
                                    left: 0 !important;
                                    top: 0 !important;
                                    width: 80mm !important;
                                    max-width: 80mm !important;
                                    margin: 0 !important;
                                    padding: 4mm !important;
                                    background: white !important;
                                    color: black !important;
                                    box-sizing: border-box !important;
                                }
                                @page {
                                    size: 80mm auto;
                                    margin: 0;
                                }
                            }
                        `}</style>

                        {/* Desktop visible Modal */}
                        <div className="bg-white dark:bg-[#1c1f26] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-8 animate-in zoom-in duration-150 flex flex-col max-h-[90vh] print:hidden">
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/2 flex justify-between items-center shrink-0">
                                <h3 className="text-[12px] font-black uppercase text-slate-800 dark:text-white">Order Details</h3>
                                <button 
                                    onClick={() => setSelectedOrderDetails(null)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 text-slate-700 dark:text-slate-350">
                                <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-4 mb-5">
                                    <div>
                                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Order Unique ID</span>
                                        <h4 className="text-[12px] font-black text-slate-800 dark:text-white font-mono uppercase mt-0.5">{selectedOrderDetails.id}</h4>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Date Time</span>
                                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5 font-mono">
                                            {new Date(selectedOrderDetails.created_at).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit', hour12: true
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-[11px]">
                                    <div className="space-y-1 bg-slate-50/50 dark:bg-white/1 border border-slate-100 dark:border-white/5 p-4 rounded-xl">
                                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1 block">From:</span>
                                        <h5 className="font-black text-slate-800 dark:text-white text-[11.5px] uppercase">{currentOutlet?.brand_name || currentOutlet?.business_name || currentOutlet?.name || user.business_name || user.brand_name || "Shahe Tehzeeb Restaurant"}</h5>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-bold">{currentOutlet?.address || user.address || "1st Floor Rather Plaza, Kangan, Jammu and Kashmir 191202"}</p>
                                        <p className="font-bold mt-1 text-slate-650 dark:text-slate-350">Email: {currentOutlet?.email || user.email || "N/A"}</p>
                                        <p className="font-bold text-slate-650 dark:text-slate-350">Phone: {currentOutlet?.phone || user.phone || "9906123389"}</p>
                                    </div>

                                    <div className="space-y-1 bg-slate-50/50 dark:bg-white/1 border border-slate-100 dark:border-white/5 p-4 rounded-xl">
                                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1 block">To:</span>
                                        <p className="text-slate-800 dark:text-white font-bold"><span className="text-slate-400 dark:text-slate-500 font-normal">Customer Name:</span> {selectedOrderDetails.customer_name || "Walk-in"}</p>
                                        <p className="text-slate-800 dark:text-white font-bold"><span className="text-slate-400 dark:text-slate-500 font-normal">Table Name:</span> {selectedOrderDetails.table_number && selectedOrderDetails.table_number !== "0" ? `Table ${selectedOrderDetails.table_number}` : "N/A"}</p>
                                        <p className="text-slate-800 dark:text-white font-bold"><span className="text-slate-400 dark:text-slate-500 font-normal">Phone:</span> {selectedOrderDetails.customer_number || "N/A"}</p>
                                        <p className="text-slate-800 dark:text-white font-bold"><span className="text-slate-400 dark:text-slate-500 font-normal">TRN / GST No.:</span> -</p>
                                        <p className="text-slate-800 dark:text-white font-bold"><span className="text-slate-400 dark:text-slate-500 font-normal">Address:</span> {selectedOrderDetails.address || "-"}</p>
                                    </div>

                                    <div className="space-y-1 bg-slate-50/50 dark:bg-white/1 border border-slate-100 dark:border-white/5 p-4 rounded-xl">
                                        <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1 block">Details:</span>
                                        <p className="text-slate-800 dark:text-white font-bold"><span className="text-slate-400 dark:text-slate-500 font-normal">Bill No:</span> {selectedOrderDetails.bill_no || "-"}</p>
                                        <p className="text-slate-800 dark:text-white font-bold"><span className="text-slate-400 dark:text-slate-500 font-normal">OrderHub (Captain / Order / KDS / TMS):</span> admin143</p>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="text-slate-400 dark:text-slate-500">Order Status:</span>
                                            <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase bg-red-500/10 text-red-650`}>
                                                {selectedOrderDetails.status === 'COMPLETED' ? 'FULFILLED' : selectedOrderDetails.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <span className="text-slate-400 dark:text-slate-500">Order Type:</span>
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-[4px] text-[9px] font-black uppercase">
                                                {selectedOrderDetails.order_type || "DINE IN"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-slate-150 dark:border-white/5 rounded-xl overflow-hidden mb-6">
                                    <table className="w-full text-left text-[11px] font-bold border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-150 dark:border-white/5 bg-slate-50 dark:bg-white/2 text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                                                <th className="px-4 py-2.5 w-12 text-center">#</th>
                                                <th className="px-4 py-2.5">Item</th>
                                                <th className="px-4 py-2.5 text-center w-20">Quantity</th>
                                                <th className="px-4 py-2.5 text-right w-24">Discount</th>
                                                <th className="px-4 py-2.5 text-right w-24">Price</th>
                                                <th className="px-4 py-2.5 text-right w-24">Tax</th>
                                                <th className="px-4 py-2.5 text-right w-24">Sub Total</th>
                                                <th className="px-4 py-2.5 text-right w-28">Total With Tax</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itemsList.map((item, idx) => {
                                                const qty = parseFloat(item.qty || item.quantity || 1);
                                                const price = parseFloat(item.price || 0);
                                                const itemSubtotal = qty * price;

                                                return (
                                                    <tr key={idx} className="border-b border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-white/1">
                                                        <td className="px-4 py-3 text-center">{idx + 1}</td>
                                                        <td className="px-4 py-3 uppercase">{item.name}</td>
                                                        <td className="px-4 py-3 text-center font-mono">{qty}</td>
                                                        <td className="px-4 py-3 text-right font-mono">0.00</td>
                                                        <td className="px-4 py-3 text-right font-mono">₹{price.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right font-mono">0.00 (Exc)</td>
                                                        <td className="px-4 py-3 text-right font-mono">₹{itemSubtotal.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right font-mono">₹{itemSubtotal.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px]">
                                    <div className="space-y-2 border-t border-slate-100 dark:border-white/5 pt-4">
                                        <h6 className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Payment Details:</h6>
                                        <div className="flex justify-between items-center border-b border-slate-50 dark:border-white/2 pb-1.5">
                                            <span className="font-bold uppercase text-slate-600 dark:text-slate-400">{selectedOrderDetails.payment_method || "Cash"}:</span>
                                            <span className="font-black text-slate-800 dark:text-white font-mono">₹{oPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-right border-t border-slate-100 dark:border-white/5 pt-4 ml-auto w-full max-w-sm">
                                        <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                                            <span>Total Amount:</span>
                                            <span className="font-mono">₹{oSubtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                                            <span>Discount:</span>
                                            <span className="font-mono">₹{oDiscount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                                            <span>External Discount:</span>
                                            <span className="font-mono">₹0.00</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                                            <span>Tax:</span>
                                            <span className="font-mono">₹{oTaxTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                                            <span>Charges:</span>
                                            <span className="font-mono">₹0.00</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-white/5 pb-2">
                                            <span>Item Level Total Charges:</span>
                                            <span className="font-mono">₹0.00</span>
                                        </div>
                                        <div className="flex justify-between text-[13px] font-black text-slate-800 dark:text-white pt-1">
                                            <span>Grand Total:</span>
                                            <span className="font-mono text-indigo-600 dark:text-indigo-400">₹{oPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 flex justify-end gap-2 shrink-0">
                                <button 
                                    onClick={() => window.print()}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5"
                                >
                                    <Printer className="w-3.5 h-3.5" /> Print Bill
                                </button>
                                <button 
                                    onClick={() => setSelectedOrderDetails(null)}
                                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-red-500/10"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        {/* POS Thermal Printable Receipt */}
                        <div id="print-invoice-area" className="hidden print:block text-black bg-white font-mono text-[9px] leading-tight" style={{ width: '80mm', padding: '4mm', boxSizing: 'border-box' }}>
                            {/* Store Header */}
                            <div className="text-center mb-3">
                                <h2 className="text-[13px] font-bold uppercase tracking-wider">{currentOutlet?.brand_name || currentOutlet?.business_name || currentOutlet?.name || user.business_name || user.brand_name || "Shahe Tehzeeb Restaurant"}</h2>
                                <p className="text-[8.5px] mt-0.5 font-bold">{currentOutlet?.address || user.address || "1st Floor Rather Plaza Kangan"}</p>
                                <p className="text-[8.5px] font-bold">Contact No: {currentOutlet?.phone || user.phone || "+919906123389"}</p>
                                <p className="text-[8.5px] font-bold">GSTIN: 01BNIIP8309K1Z4</p>
                                <p className="text-[8.5px] font-bold mt-1">{formatReceiptDate(selectedOrderDetails.created_at)}</p>
                            </div>

                            {/* Divider */}
                            <div className="my-2" style={{ borderTop: '1px dashed #000' }}></div>

                            {/* Receipt Details Grid */}
                            <div className="space-y-0.5 text-[8.5px] font-bold">
                                <div className="flex justify-between">
                                    <span>Table: {selectedOrderDetails.table_number && selectedOrderDetails.table_number !== "0" ? `Table ${selectedOrderDetails.table_number}` : "Default"}</span>
                                    <span>Bill: {selectedOrderDetails.bill_no || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Order: {selectedOrderDetails.order_type || "DINE_IN"}</span>
                                    <span>Payment: {selectedOrderDetails.payment_method || "CASH"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Waiter: Default</span>
                                    <span>User: admin143</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="my-2" style={{ borderTop: '1px dashed #000' }}></div>

                            {/* Customer Profile Info */}
                            <div className="space-y-0.5 text-[8.5px] font-bold">
                                <div>Cust Name: {selectedOrderDetails.customer_name || "POS Guest"}</div>
                                <div>Delivery Address: {selectedOrderDetails.address || selectedOrderDetails.order_type || "DINE_IN"}</div>
                            </div>

                            {/* Divider */}
                            <div className="my-2" style={{ borderTop: '1px dashed #000' }}></div>

                            {/* Section Header */}
                            <div className="text-center font-bold text-[9px] tracking-wider my-1 uppercase">FOOD ITEMS</div>

                            {/* Items Header */}
                            <div className="text-[8.5px] font-bold flex justify-between pb-1 mb-1" style={{ borderBottom: '1px dashed #000' }}>
                                <span className="w-1/2 text-left">Item Name</span>
                                <span className="w-1/12 text-center">Qty.</span>
                                <span className="w-1/4 text-right">Amount</span>
                                <span className="w-1/4 text-right">Total</span>
                            </div>

                            {/* Items List */}
                            <div className="space-y-2 text-[8.5px] font-bold">
                                {itemsList.map((item, idx) => {
                                    const qty = parseFloat(item.qty || item.quantity || 1);
                                    const price = parseFloat(item.price || 0);
                                    const itemSubtotal = qty * price;

                                    return (
                                        <div key={idx} className="leading-tight">
                                            <div className="uppercase">{idx + 1}. {item.name}</div>
                                            <div className="flex justify-between pl-2">
                                                <span className="w-1/2"></span>
                                                <span className="w-1/12 text-center">{qty}</span>
                                                <span className="w-1/4 text-right">{price.toFixed(2)}</span>
                                                <span className="w-1/4 text-right">{itemSubtotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <div className="my-2" style={{ borderTop: '1px dashed #000' }}></div>

                            {/* Summary Totals */}
                            <div className="space-y-0.5 text-[8.5px] font-bold">
                                <div className="flex justify-between">
                                    <span>Amount:</span>
                                    <span>Rs {oSubtotal.toFixed(2)}</span>
                                </div>
                                {oDiscount > 0 && (
                                    <div className="flex justify-between">
                                        <span>Discount:</span>
                                        <span>Rs -{oDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                {oTaxC > 0 && (
                                    <div className="flex justify-between">
                                        <span>CGST:</span>
                                        <span>Rs {oTaxC.toFixed(2)}</span>
                                    </div>
                                )}
                                {oTaxS > 0 && (
                                    <div className="flex justify-between">
                                        <span>SGST:</span>
                                        <span>Rs {oTaxS.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="my-2" style={{ borderTop: '1px dashed #000' }}></div>

                            {/* Grand Total */}
                            <div className="flex justify-between text-[11px] font-bold">
                                <span>Grand Total:</span>
                                <span>Rs {oPrice.toFixed(2)}</span>
                            </div>

                            {/* Amount in words */}
                            <div className="text-[7.5px] italic text-left mt-1 normal-case font-medium">
                                {numberToWords(oPrice)}
                            </div>

                            {/* Divider */}
                            <div className="my-2" style={{ borderTop: '1px dashed #000' }}></div>

                            {/* Footer Message */}
                            <div className="text-center mt-3 space-y-1">
                                <p className="text-[7.5px] text-gray-500 font-bold">Powered By SaSTech LLC</p>
                                <p className="font-black text-[9px] uppercase tracking-wider">THANK YOU! VISIT AGAIN</p>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default SalesReport;
