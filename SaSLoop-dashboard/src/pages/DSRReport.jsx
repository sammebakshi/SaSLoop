import React, { useState, useEffect } from "react";
import { 
  FileText, Search, RefreshCw, Filter, 
  Download, Calendar, IndianRupee, ShieldCheck, 
  TrendingUp, PieChart, ChevronDown, ListChecks,
  Printer, Share2, Database, ChevronRight, BarChart4
} from "lucide-react";
import API_BASE from "../config";

const ExcelFileIcon = (props) => (
    <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-500 shrink-0"
        {...props}
    >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <rect x="7" y="11" width="5" height="5" rx="0.5" fill="#107c41" stroke="#107c41" strokeWidth="1" />
        <path d="M8.2 12.2l2.6 2.6" stroke="white" strokeWidth="1" />
        <path d="M10.8 12.2l-2.6 2.6" stroke="white" strokeWidth="1" />
    </svg>
);

const DSRReport = () => {
    // ----------------------------------------------------
    // Date & Time Utility States (Same as SalesReport.jsx)
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // Context & API Data States
    // ----------------------------------------------------
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isGenerationStatusOpen, setIsGenerationStatusOpen] = useState(true);

    // ----------------------------------------------------
    // Report Logging (Pre-populated to mirror screenshot)
    // ----------------------------------------------------
    const [reportLogs, setReportLogs] = useState([
        {
            id: "RPT-9001",
            tmposId: "757810",
            generateDate: "04 Jun 2026 3:53 PM",
            generateBy: "ShaheT",
            reportType: "DSR B2B Report",
            generationStatus: "COMPLETED",
            showDetails: false,
            filename: "dsr_b2b_report.csv",
            dateRangeStr: "2026-06-04 00:00:00 - 2026-06-04 23:59:59",
            dataSnapshot: []
        },
        {
            id: "RPT-9002",
            tmposId: "757810",
            generateDate: "03 Jun 2026 6:04 PM",
            generateBy: "ShaheT",
            reportType: "EOD Report",
            generationStatus: "COMPLETED",
            showDetails: false,
            filename: "eod_report.csv",
            dateRangeStr: "2026-06-03 00:00:00 - 2026-06-03 23:59:59",
            dataSnapshot: []
        },
        {
            id: "RPT-9003",
            tmposId: "757810",
            generateDate: "03 Jun 2026 6:03 PM",
            generateBy: "ShaheT",
            reportType: "Sales Report",
            generationStatus: "COMPLETED",
            showDetails: false,
            filename: "sales_report.csv",
            dateRangeStr: "2026-06-03 00:00:00 - 2026-06-03 23:59:59",
            dataSnapshot: []
        },
        {
            id: "RPT-9004",
            tmposId: "757810",
            generateDate: "03 Jun 2026 4:24 PM",
            generateBy: "ShaheT",
            reportType: "EOD Report PDF",
            generationStatus: "COMPLETED",
            showDetails: false,
            filename: "eod_report_pdf.csv",
            dateRangeStr: "2026-06-03 00:00:00 - 2026-06-03 23:59:59",
            dataSnapshot: []
        },
        {
            id: "RPT-9005",
            tmposId: "757810",
            generateDate: "03 Jun 2026 4:24 PM",
            generateBy: "ShaheT",
            reportType: "EOD Report",
            generationStatus: "COMPLETED",
            showDetails: false,
            filename: "eod_report.csv",
            dateRangeStr: "2026-06-03 00:00:00 - 2026-06-03 23:59:59",
            dataSnapshot: []
        },
        {
            id: "RPT-9006",
            tmposId: "757810",
            generateDate: "03 Jun 2026 4:24 PM",
            generateBy: "ShaheT",
            reportType: "Sales Report with Product Group Details",
            generationStatus: "COMPLETED",
            showDetails: false,
            filename: "sales_report_group_details.csv",
            dateRangeStr: "2026-06-03 00:00:00 - 2026-06-03 23:59:59",
            dataSnapshot: []
        },
        {
            id: "RPT-9007",
            tmposId: "757810",
            generateDate: "03 Jun 2026 4:24 PM",
            generateBy: "ShaheT",
            reportType: "Sales Report with items",
            generationStatus: "COMPLETED",
            showDetails: false,
            filename: "sales_report_with_items.csv",
            dateRangeStr: "2026-06-03 00:00:00 - 2026-06-03 23:59:59",
            dataSnapshot: []
        },
        {
            id: "RPT-9008",
            tmposId: "757810",
            generateDate: "03 Jun 2026 4:24 PM",
            generateBy: "ShaheT",
            reportType: "Sales Report",
            generationStatus: "COMPLETED",
            showDetails: false,
            filename: "sales_report.csv",
            dateRangeStr: "2026-06-03 00:00:00 - 2026-06-03 23:59:59",
            dataSnapshot: []
        },
        {
            id: "RPT-9009",
            tmposId: "757810",
            generateDate: "03 Jun 2026 4:07 PM",
            generateBy: "ShaheT",
            reportType: "Sales Report",
            generationStatus: "COMPLETED",
            showDetails: false,
            filename: "sales_report.csv",
            dateRangeStr: "2026-06-03 00:00:00 - 2026-06-03 23:59:59",
            dataSnapshot: []
        }
    ]);

    // ----------------------------------------------------
    // Date & Time Utility Functions
    // ----------------------------------------------------
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
        if (clickedDate > today) return;

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

    // ----------------------------------------------------
    // Load Core Data from API
    // ----------------------------------------------------
    const fetchDSRData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";

            const resp = await fetch(`${API_BASE}/api/orders${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (resp.ok) {
                const data = await resp.json();
                const safeData = data || [];
                setOrders(safeData);
                
                // Set initial filtered orders for date range
                const sDate = getTodayStartDateTime();
                const eDate = getTodayEndDateTime();
                const initialFiltered = safeData.filter(o => {
                    const oDate = new Date(o.created_at);
                    return oDate >= sDate && oDate <= eDate;
                });
                setFilteredOrders(initialFiltered);

                // Update report data snapshots
                setReportLogs(prev => prev.map(log => ({ ...log, dataSnapshot: safeData })));
            }

            const resOutlets = await fetch(`${API_BASE}/api/auth/my-outlets`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (resOutlets.ok) {
                const outletsData = await resOutlets.json();
                setOutlets(Array.isArray(outletsData) ? outletsData : []);
            }
        } catch (err) {
            console.error("DSR fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDSRData();
    }, []);

    // Sync date range label changes
    useEffect(() => {
        if (startDateTime && endDateTime) {
            const formattedStart = formatDateString(startDateTime, formatTime(startDateTime));
            const formattedEnd = formatDateString(endDateTime, formatTime(endDateTime));
            setDateRangeText(`${formattedStart} - ${formattedEnd}`);

            // Apply quick date filtering to orders
            const filtered = orders.filter(o => {
                const oDate = new Date(o.created_at);
                return oDate >= startDateTime && oDate <= endDateTime;
            });
            setFilteredOrders(filtered);
        }
    }, [startDateTime, endDateTime, orders]);

    const currentOutletId = sessionStorage.getItem("impersonate_id") || "global";
    const currentOutlet = outlets.find(o => String(o.id) === String(currentOutletId)) || (currentOutletId === "global" ? { outlet_name: "Global Overview" } : null);
    
    const getOutletDisplayName = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const brand = currentOutlet?.brand_name || currentOutlet?.business_name || currentOutlet?.name || user.business_name || user.brand_name || "Shahe Tehzeeb Restaurant";
        const outlet = currentOutlet?.outlet_name || currentOutlet?.name || user.business_name || "Shahe Tehzeeb Restaurant";
        return `${brand} - ${outlet}`;
    };

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
        
        return `${String(day).padStart(2, '0')} ${month} ${year} ${h}:${m} ${ampm}`;
    };

    // ----------------------------------------------------
    // Trigger Simulated DSR Report Generation
    // ----------------------------------------------------
    const triggerReportGeneration = (reportTypeName, filename) => {
        const logId = `RPT-${Math.floor(1000 + Math.random() * 9000)}`;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const generateByStr = user.name || user.username || "ShaheT";

        const startStr = startDateTime.toLocaleString();
        const endStr = endDateTime.toLocaleString();
        const dateRangeStr = `${startStr} - ${endStr}`;

        const newLog = {
            id: logId,
            tmposId: sessionStorage.getItem("impersonate_id") || "757810",
            generateDate: formatGenerateDate(new Date()),
            generateBy: generateByStr,
            reportType: reportTypeName,
            generationStatus: "PENDING",
            showDetails: false,
            filename: filename,
            dateRangeStr: dateRangeStr,
            dataSnapshot: [...filteredOrders]
        };

        setReportLogs(prev => [newLog, ...prev]);

        // Lifecycle: PENDING (1.5s) -> PROCESSING (1.5s) -> COMPLETED
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

    // ----------------------------------------------------
    // CSV File Download Action
    // ----------------------------------------------------
    const triggerCSVDownload = (dataSnapshot, filename, reportType) => {
        const dataList = Array.isArray(dataSnapshot) && dataSnapshot.length > 0 ? dataSnapshot : orders;
        let headers = [];
        let rows = [];

        if (reportType.includes("B2B")) {
            headers = ["Invoice No", "Date", "Customer Name", "Customer GST", "Place of Supply", "Taxable Value", "CGST Amount", "SGST Amount", "Invoice Value"];
            dataList.forEach(o => {
                const grandTotal = parseFloat(o.total_price || 0);
                const cgst = parseFloat(o.tax_cgst || 0);
                const sgst = parseFloat(o.tax_sgst || 0);
                const taxable = grandTotal - cgst - sgst;
                rows.push([
                    o.bill_no || o.id,
                    new Date(o.created_at).toLocaleDateString(),
                    o.customer_name || "Customer B2B",
                    o.gst_number || "29XXXXX",
                    "State Tax Zone",
                    taxable.toFixed(2),
                    cgst.toFixed(2),
                    sgst.toFixed(2),
                    grandTotal.toFixed(2)
                ]);
            });
        } else if (reportType.includes("Item")) {
            headers = ["Item Name", "Quantity Sold", "Sales Price", "Total Amount"];
            const itemTotals = {};
            dataList.forEach(o => {
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                } catch (e) {}
                if (Array.isArray(itemsList)) {
                    itemsList.forEach(item => {
                        if (item && item.name && !item.is_charge) {
                            const name = item.name.toUpperCase();
                            const qty = parseFloat(item.qty || item.quantity || 1);
                            const price = parseFloat(item.price || 0);
                            if (!itemTotals[name]) {
                                itemTotals[name] = { qty: 0, price: price };
                            }
                            itemTotals[name].qty += qty;
                        }
                    });
                }
            });
            Object.entries(itemTotals).forEach(([name, meta]) => {
                rows.push([name, meta.qty, meta.price.toFixed(2), (meta.qty * meta.price).toFixed(2)]);
            });
        } else {
            // General Sales CSV
            headers = ["Bill Date", "Order ID", "Bill No", "Qty", "Taxable Value", "CGST", "SGST", "Grand Total", "Status"];
            dataList.forEach(o => {
                let qtySum = 0;
                let itemsList = [];
                try {
                    itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                } catch (e) {}
                if (Array.isArray(itemsList)) {
                    itemsList.forEach(item => {
                        qtySum += parseFloat(item.qty || item.quantity || 1);
                    });
                }
                const grandTotal = parseFloat(o.total_price || 0);
                const cgst = parseFloat(o.tax_cgst || 0);
                const sgst = parseFloat(o.tax_sgst || 0);
                rows.push([
                    new Date(o.created_at).toLocaleDateString(),
                    o.id,
                    o.bill_no || "",
                    qtySum,
                    (grandTotal - cgst - sgst).toFixed(2),
                    cgst.toFixed(2),
                    sgst.toFixed(2),
                    grandTotal.toFixed(2),
                    o.status
                ]);
            });
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

    // ----------------------------------------------------
    // Calendar Builder function
    // ----------------------------------------------------
    const renderCalendar = (monthDate, isRight = false) => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = monthsNames[month];

        const daysInMonth = getDaysInMonth(year, month);
        const firstDayIdx = getFirstDayOfWeekIndex(year, month);

        const cells = [];
        for (let i = 0; i < firstDayIdx; i++) {
            cells.push(<div key={`empty-${i}`} className="w-6 h-6" />);
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);

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
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-1.5">
                    {!isRight ? (
                        <button 
                            type="button" 
                            onClick={() => navigateMonth(-1)}
                            className="p-1 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-slate-400"
                        >
                            &lt;
                        </button>
                    ) : <div className="w-5" />}
                    
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-650 dark:text-slate-400">
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

                <div className="grid grid-cols-7 text-center gap-y-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
                </div>

                <div className="grid grid-cols-7 text-center gap-y-1">
                    {cells}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            
            {/* ----------------------------------------------------
                Header Section
               ---------------------------------------------------- */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] border-b border-slate-200 dark:border-white/5 px-6 py-3 -mx-6 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-md">
                        <FileText className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-tight">DSR Report</h2>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Daily Sales Reconciliation Ledger & Audit Logs</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchDSRData}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all text-slate-500"
                        title="Reload DSR Data"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-500 transition-colors" />
                    </button>
                </div>
            </div>

            {/* ----------------------------------------------------
                DSR Report Filter Box
               ---------------------------------------------------- */}
            <div className={`bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden ${isFilterOpen ? "p-5" : "px-5 py-3"}`}>
                <div 
                    className={`flex items-center justify-between cursor-pointer select-none ${isFilterOpen ? "border-b border-slate-100 dark:border-white/5 pb-3 mb-4" : ""}`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <div className="flex items-center gap-2 shrink-0">
                        <Filter className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11.5px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 font-sans">DSR Report Filter</span>
                    </div>

                    {!isFilterOpen && (
                        <>
                            <div className="hidden md:flex items-center justify-center flex-1 text-[11px] font-extrabold text-slate-550 dark:text-slate-400 px-4 select-none">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-750 dark:text-white">
                            <div className="space-y-1 relative">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date & Time Range</label>
                                <div 
                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-[10.5px] font-bold uppercase cursor-pointer flex items-center justify-between hover:border-slate-350 dark:hover:border-white/10 transition-all select-none h-9 text-slate-800 dark:text-white"
                                >
                                    <span className="truncate">{dateRangeText}</span>
                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                                </div>

                                {isDatePickerOpen && (
                                    <div className="absolute top-[105%] left-0 z-50 bg-white dark:bg-[#1c1f26] border border-slate-200 dark:border-white/5 rounded-xl shadow-xl p-4 flex flex-col md:flex-row gap-4 animate-in fade-in duration-200 text-slate-800 dark:text-white w-max max-w-[95vw] md:max-w-none">
                                        {/* Presets */}
                                        <div className="flex flex-col gap-1.5 w-full md:w-32 border-r border-slate-100 dark:border-white/5 pr-4 shrink-0 text-left">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Presets</span>
                                            <button type="button" onClick={() => applyPreset("today")} className="text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-350">Today</button>
                                            <button type="button" onClick={() => applyPreset("yesterday")} className="text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-350">Yesterday</button>
                                            <button type="button" onClick={() => applyPreset("thisWeek")} className="text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-300">This Week</button>
                                            <button type="button" onClick={() => applyPreset("thisMonth")} className="text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded text-[10px] font-bold transition-all text-slate-700 dark:text-slate-300">This Month</button>
                                        </div>

                                        {/* Calendars */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {renderCalendar(currentLeftMonth, false)}
                                                {renderCalendar(new Date(currentLeftMonth.getFullYear(), currentLeftMonth.getMonth() + 1, 1), true)}
                                            </div>

                                            {/* Times & Actions */}
                                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3 mt-1 flex-wrap gap-3">
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

                                                <div className="flex gap-2 ml-auto">
                                                    <button type="button" onClick={() => setIsDatePickerOpen(false)} className="px-3 py-1.5 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] font-black uppercase hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-500">Cancel</button>
                                                    <button type="button" onClick={confirmCustomRange} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase transition-all">Apply Range</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-end gap-2">
                                <button 
                                    onClick={() => setIsFilterOpen(false)} 
                                    className="flex-1 h-9 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-95"
                                >
                                    Apply Filter
                                </button>
                                <button 
                                    onClick={() => {
                                        applyPreset("today");
                                        setIsFilterOpen(false);
                                    }}
                                    className="p-2.5 h-9 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm"
                                    title="Reset to Today"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ----------------------------------------------------
                16 DSR Report Buttons Grid
               ---------------------------------------------------- */}
            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl p-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {[
                        { name: "DSR Bill Wise Report", file: "dsr_bill_wise_report.csv" },
                        { name: "Bill-wise Liquor Sales Report (DSR)", file: "bill_wise_liquor_sales_report.csv" },
                        { name: "B2B Sale Report", file: "b2b_sale_report.csv" },
                        { name: "Bill No of Series", file: "bill_no_of_series.csv" },
                        { name: "DSR Item Wise", file: "dsr_item_wise.csv" },
                        { name: "DSR Bill Month Wise Report", file: "dsr_bill_month_wise_report.csv" },
                        { name: "DSR Day Wise Report", file: "dsr_day_wise_report.csv" },
                        { name: "DSR Day Wise Summary Report", file: "dsr_day_wise_summary_report.csv" },
                        { name: "Simplified Day Wise DSR Report", file: "simplified_day_wise_dsr_report.csv" },
                        { name: "Mall Report", file: "mall_report.csv" },
                        { name: "Tax Submission Report", file: "tax_submission_report.csv" },
                        { name: "Tax Submission Payment Report", file: "tax_submission_payment_report.csv" },
                        { name: "Order Type Day Wise Report", file: "order_type_day_wise_report.csv" },
                        { name: "Month Wise Sales", file: "month_wise_sales.csv" },
                        { name: "Day Wise Consolidated Report", file: "day_wise_consolidated_report.csv" },
                        { name: "Daily Sales Report", file: "daily_sales_report.csv" }
                    ].map((item, index) => (
                        <button
                            key={index}
                            onClick={() => triggerReportGeneration(item.name, item.file)}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 border border-slate-750 dark:border-white/5 active:scale-[0.98] select-none text-left"
                        >
                            <ExcelFileIcon />
                            <span className="truncate flex-1">{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ----------------------------------------------------
                Report Generation Status Table
               ---------------------------------------------------- */}
            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                <div 
                    className={`px-5 py-3.5 bg-slate-50/50 dark:bg-white/2 flex items-center justify-between cursor-pointer select-none ${isGenerationStatusOpen ? "border-b border-slate-100 dark:border-white/5" : ""}`}
                    onClick={() => setIsGenerationStatusOpen(!isGenerationStatusOpen)}
                >
                    <span className="text-[11.5px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 font-sans">Report Generation Status</span>
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
                                                        log.generationStatus === 'PROCESSING' ? 'bg-indigo-500/10 text-indigo-600' :
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
                                                            onClick={() => triggerCSVDownload(log.dataSnapshot, log.filename, log.reportType)}
                                                            className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all inline-block"
                                                            title="Download Report"
                                                        >
                                                            <Download className="w-4 h-4 text-emerald-600" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400 dark:text-slate-650 font-bold">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                            {log.showDetails && (
                                                <tr className="bg-slate-50/30 dark:bg-white/1 animate-in fade-in slide-in-from-top-1 duration-150">
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
                                                                <span className="w-1/2 text-left">{log.tmposId} - {JSON.parse(localStorage.getItem("user") || "{}").business_name || "Shahe Tehzeeb Restaurant"}</span>
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

        </div>
    );
};

export default DSRReport;
