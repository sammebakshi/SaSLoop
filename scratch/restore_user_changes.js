const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Helper to replace exact strings
function replaceExactlyOnce(findText, replaceText, name) {
  const normalizedFind = findText.replace(/\r\n/g, '\n');
  const normalizedContent = content.replace(/\r\n/g, '\n');

  const index = normalizedContent.indexOf(normalizedFind);
  if (index === -1) {
    throw new Error(`Could not find target block for: ${name}`);
  }
  
  const lastIndex = normalizedContent.lastIndexOf(normalizedFind);
  if (index !== lastIndex) {
    throw new Error(`Multiple occurrences found for target block of: ${name}`);
  }

  // Replace
  content = normalizedContent.substring(0, index) + replaceText.replace(/\r\n/g, '\n') + normalizedContent.substring(index + normalizedFind.length);
  console.log(`✅ Successfully replaced: ${name}`);
}

// 1. fetchOrdersForMode block
const targetFetchOrders = `  // Centralized Receipts Fetching Function
  const fetchOrdersForMode = async (mode, start = receiptsStartDate, end = receiptsEndDate) => {
    if (!isAuthenticated) return;
    setFetchingOrders(true);
    try {
      const params = {};
      if (mode !== 'all') {
        params.startDate = formatLocalISO(start);
        params.endDate = formatLocalISO(end);
      }

      const orderRes = await posService.getAllOrders(params);
      if (Array.isArray(orderRes.data)) {
        const mappedOrders = orderRes.data.map(o => {
          const totalPrice = parseFloat(o.total_price || 0);
          const discountAmt = parseFloat(o.discount_amount || o.discount || 0);
          const cgst = parseFloat(o.tax_cgst || 0);
          const sgst = parseFloat(o.tax_sgst || 0);
          const tip = parseFloat(o.tip_amount || 0);

          const itemsList = Array.isArray(o.items) ? o.items : [];
          const calculatedSub = getReceiptSubtotal({ ...o, subtotal: undefined });
          const subtotal = calculatedSub > 0 ? calculatedSub : (totalPrice - cgst - sgst + discountAmt - tip);

          return {
            ...o,
            id: o.id,
            bill_no: o.bill_no || String(o.id),
            customer_name: o.customer_name || 'POS Guest',
            customer_phone: o.customer_number || '',
            items: itemsList,
            subtotal: subtotal,
            discount: discountAmt,
            discountAmt: discountAmt,
            tax_cgst: cgst,
            tax_sgst: sgst,
            total_price: totalPrice,
            payment_method: o.payment_method || 'CASH',
            reference_no: o.order_reference || '',
            order_reference: o.order_reference || '',
            tip_amount: tip,
            status: o.status || 'COMPLETED',
            table_id: o.table_number || null,
            order_type: o.order_type || o.address || 'QUICK',
            created_at: o.created_at,
            synced: true
          };
        });

        // Merge with unsynced local orders
        const unsyncedLocal = (recentOrders || []).filter(o => o && (o.synced === false || (o.id && String(o.id).startsWith('L-'))));

        // Avoid duplicates if order is now synced
        const remoteRefs = new Set();
        mappedOrders.forEach(o => {
          if (o.order_reference) remoteRefs.add(String(o.order_reference));
          if (o.reference_no) remoteRefs.add(String(o.reference_no));
          if (o.id) remoteRefs.add(String(o.id));
        });

        const filteredUnsynced = unsyncedLocal.filter(o =>
          !remoteRefs.has(String(o.id)) &&
          !remoteRefs.has(String(o.order_reference || '')) &&
          !remoteRefs.has(String(o.reference_no || ''))
        );

        const merged = [...filteredUnsynced, ...mappedOrders];
        merged.sort((a, b) => new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp));

        setRecentOrders(merged);
        calculateStats(merged);
      }
    } catch (err) {
      console.error("Failed to load orders from backend range:", err);
      calculateStats(recentOrders);
    } finally {
      setFetchingOrders(false);
    }
  };`;

const replacementFetchOrders = `  // Centralized Receipts Fetching Function
  const fetchOrdersForMode = async (mode, start = receiptsStartDate, end = receiptsEndDate) => {
    if (!isAuthenticated) return;
    setFetchingOrders(true);
    try {
      const sorted = [...(recentOrders || [])].sort((a, b) => new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp));
      setRecentOrders(sorted);
      calculateStats(sorted);
    } catch (err) {
      console.error("Local receipts calculation error:", err);
    } finally {
      setFetchingOrders(false);
    }
  };`;

// 2. filteredOrders block
const targetFilteredOrders = `  const filteredOrders = React.useMemo(() => {
    let list = recentOrders;
    if (receiptSearchQuery) {
      const q = receiptSearchQuery.toLowerCase().trim();
      list = recentOrders.filter(o => {
        const billNo = String(o.bill_no || o.id || '').toLowerCase();
        const customer = String(o.customer_name || '').toLowerCase();
        const phone = String(o.customer_phone || o.customer_number || '').toLowerCase();
        const table = String(o.table_id || '').toLowerCase();
        const type = String(o.order_type || '').toLowerCase();
        const status = String(o.status || '').toLowerCase();
        const payment = String(o.payment_method || '').toLowerCase();
        return (
          billNo.includes(q) ||
          customer.includes(q) ||
          phone.includes(q) ||
          table.includes(q) ||
          type.includes(q) ||
          status.includes(q) ||
          payment.includes(q)
        );
      });
    }

    // Sort based on receiptsSortField and receiptsSortDirection
    return [...list].sort((a, b) => {
      let valA, valB;
      if (receiptsSortField === 'date') {
        valA = new Date(a.created_at || a.timestamp || 0).getTime();
        valB = new Date(b.created_at || b.timestamp || 0).getTime();
      } else if (receiptsSortField === 'value') {
        valA = parseFloat(a.total_price || 0);
        valB = parseFloat(b.total_price || 0);
      } else if (receiptsSortField === 'status') {
        valA = String(a.status || '').toLowerCase();
        valB = String(b.status || '').toLowerCase();
      } else if (receiptsSortField === 'bill_no') {
        valA = String(a.bill_no || a.id || '').toLowerCase();
        valB = String(b.bill_no || b.id || '').toLowerCase();
      } else {
        valA = new Date(a.created_at || a.timestamp || 0).getTime();
        valB = new Date(b.created_at || b.timestamp || 0).getTime();
      }

      if (valA < valB) return receiptsSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return receiptsSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [recentOrders, receiptSearchQuery, receiptsSortField, receiptsSortDirection]);`;

const replacementFilteredOrders = `  const filteredOrders = React.useMemo(() => {
    let list = recentOrders;
    
    // Filter by receiptsDateMode and local date range if not 'all'
    if (receiptsDateMode !== 'all') {
      const start = new Date(receiptsStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(receiptsEndDate);
      end.setHours(23, 59, 59, 999);
      list = list.filter(o => {
        const d = new Date(o.created_at || o.timestamp);
        return d >= start && d <= end;
      });
    }

    if (receiptSearchQuery) {
      const q = receiptSearchQuery.toLowerCase().trim();
      list = list.filter(o => {
        const billNo = String(o.bill_no || o.id || '').toLowerCase();
        const customer = String(o.customer_name || '').toLowerCase();
        const phone = String(o.customer_phone || o.customer_number || '').toLowerCase();
        const table = String(o.table_id || '').toLowerCase();
        const type = String(o.order_type || '').toLowerCase();
        const status = String(o.status || '').toLowerCase();
        const payment = String(o.payment_method || '').toLowerCase();
        return (
          billNo.includes(q) ||
          customer.includes(q) ||
          phone.includes(q) ||
          table.includes(q) ||
          type.includes(q) ||
          status.includes(q) ||
          payment.includes(q)
        );
      });
    }

    // Sort based on receiptsSortField and receiptsSortDirection
    return [...list].sort((a, b) => {
      let valA, valB;
      if (receiptsSortField === 'date') {
        valA = new Date(a.created_at || a.timestamp || 0).getTime();
        valB = new Date(b.created_at || b.timestamp || 0).getTime();
      } else if (receiptsSortField === 'value') {
        valA = parseFloat(a.total_price || 0);
        valB = parseFloat(b.total_price || 0);
      } else if (receiptsSortField === 'status') {
        valA = String(a.status || '').toLowerCase();
        valB = String(b.status || '').toLowerCase();
      } else if (receiptsSortField === 'bill_no') {
        valA = String(a.bill_no || a.id || '').toLowerCase();
        valB = String(b.bill_no || b.id || '').toLowerCase();
      } else {
        valA = new Date(a.created_at || a.timestamp || 0).getTime();
        valB = new Date(b.created_at || b.timestamp || 0).getTime();
      }

      if (valA < valB) return receiptsSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return receiptsSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [recentOrders, receiptSearchQuery, receiptsSortField, receiptsSortDirection, receiptsDateMode, receiptsStartDate, receiptsEndDate]);`;

// 3. handleLogoutFlow states block
const targetLogoutFlow = `      // 2. Collect all keys to remove first to avoid index shifting
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pos_')) {
          if (
            key === 'pos_device_id' ||
            key === 'pos_theme' ||
            key === 'pos_terminal_settings' ||
            key.includes('_sound') ||
            key.includes('_sound_name')
          ) {
            continue;
          }
          keysToRemove.push(key);
        }
      }
      
      // Also explicitly add all known keys to ensure they are cleared
      const explicitKeys = [
        'pos_token',
        'pos_profile',
        'pos_current_shift',
        'pos_expenses',
        'pos_local_orders',
        'pos_recent_orders',
        'pos_customer_db',
        'pos_dinein_cart',
        'pos_pickup_cart',
        'pos_quick_cart',
        'pos_preorder_cart',
        'pos_table_carts',
        'pos_table_statuses',
        'pos_table_bills',
        'pos_table_bill_numbers',
        'pos_table_active_timestamps',
        'pos_kot_history',
        'pos_table_waiters',
        'pos_table_discounts',
        'pos_table_additional_charges',
        'pos_table_customers',
        'pos_catalog_cache',
        'pos_option_groups',
        'pos_tables_cache',
        'pos_taxes',
        'pos_payment_modes',
        'pos_discounts',
        'pos_additional_charges',
        'pos_waiters',
        'pos_riders',
        'pos_item_mgmt_items',
        'pos_item_mgmt_categories',
        'pos_item_mgmt_taxes',
        'pos_item_mgmt_depts',
        'pos_rejection_reasons',
        'pos_deleted_items_queue',
        'pos_unsynced_categories',
        'pos_tables',
        'pos_next_bill_no'
      ];
      
      explicitKeys.forEach(k => {
        if (!keysToRemove.includes(k)) {
          keysToRemove.push(k);
        }
      });

      keysToRemove.forEach(key => localStorage.removeItem(key));

      // 2. Clear all react states in memory thoroughly
      setRecentOrders([]);
      setTableBills({});
      setTableStatuses({});
      setTableBillNumbers({});
      setKotHistory({});
      setCustomerDb({});
      setDineInCart([]);
      setPickupCart([]);
      setQuickCart([]);
      setPreOrderCart([]);
      setTableCarts({});
      setTableCustomers({});
      setTableDiscounts({});
      setTableAdditionalCharges({});
      setTableWaiters({});
      setTableActiveTimestamps({});
      setShift({ status: 'NOT_STARTED', startTime: null, openingBalance: 0, sales: 0, expenses: 0 });
      setExpenses([]);
      
      // Also clear other cached lists to avoid state leakage
      setCatalog([]);
      setCategories(['All']);
      setTables([]);
      setSyncedTax(null);
      setPaymentModes(['CASH']);
      setWaitersList([]);
      setRiders([]);
      setOptionGroups([]);
      setAvailableDiscounts([]);
      setAvailableCharges([]);
      setBusiness(null);`;

const replacementLogoutFlow = `      // 2. Collect all keys to remove first to avoid index shifting
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          if (
            key === 'pos_device_id' ||
            key === 'pos_theme' ||
            key === 'pos_terminal_settings' ||
            key === 'pos_business' ||
            key === 'pos_brand_color' ||
            key === 'pos_active_state' ||
            key === 'pos_available_printers'
          ) {
            continue;
          }
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      
      // Additional UI, statistics, dashboard and session states
      setStats({ totalSales: 0, totalOrders: 0, averageOrderValue: 0, totalTax: 0 });
      setTopItems([]);
      setPieItems([]);
      setLineData([]);
      setBarData([]);
      setPieStartDate('');
      setPieEndDate('');
      setPieLimit(5);
      setLineStartDate('');
      setLineEndDate('');
      setBarStartDate('');
      setBarEndDate('');
      setLineTimeframe('daily');
      setBarTimeframe('daily');
      setSearchQuery('');
      setSelectedTable(null);
      setSelectedLiveOrderId(null);
      setActiveDepartment('All');
      setIsCustomerHistoryModalOpen(false);
      setCustomerHistoryActiveTab('orders');
      setShowCustomerPopup(false);
      setShowWaiterPopup(false);
      setSelectedHistoryOrder(null);
      setIsWaiterModalOpen(false);
      setSelectedWaiter(null);
      setIsRiderModalOpen(false);
      setSelectedRiderId('');
      setRedeemedPoints(0);
      setIsAiAnalyzing(false);
      setAiAdvice(null);
      setPreviewQrUrl(null);
      setPreviewQrMeta(null);
      setBackendQrs([]);
      setIsExpenseModalOpen(false);
      setSelectedItemForModifiers(null);
      setTempKitchenNote('');
      setSelectedItemForDiscount(null);
      setIsOpenPriceModalOpen(false);
      setOpenPriceItem(null);
      setOpenPriceValue('');
      setExtraCharges({ packing: 0, delivery: 0, service: 0 });
      setIsDiscountModalOpen(false);
      setIsChargesModalOpen(false);
      setAppliedAdditionalCharges([]);
      setCustomDiscountType('percent');
      setCustomDiscountValue('');
      setSaveDiscountToBackOffice(false);
      setCustomDiscountName('');
      setSaveChargeToBackOffice(false);
      setSelectedDiscountId(null);
      setCustomChargeName('');
      setCustomChargeType('fixed');
      setCustomChargeValue('');
      setIsCouponModalOpen(false);
      setAvailableCoupons([]);
      setCouponCode('');
      setAppliedCoupon(null);
      setShowLoyaltyPopup(false);
      setIsSplitModalOpen(false);
      setSplitMode('PORTION');
      setSplitPortions(2);
      setSplitPercentages([50, 50]);
      setSplitParts([]);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setSelectedCustomer(null);
      setKOTNote('');
      setCoversCount('');
      setEbillEnabled(false);
      setSearchResults([]);
      setShowSearchResults(false);
      setActiveSearchResultIndex(-1);
      setCustomerPaymentMethod('CASH');
      setDiscount({ type: 'NONE', value: 0 });
      setIsKOTPending(false);
      setLastKOTId(null);
      setSelectedCategory('All');
      setSelectedPriceTier(1);
      setCart([]);
      setActiveTrayTab('KOT');
      setIsSettingsModalOpen(false);
      setSettingsActiveTab('general');
      setItemMgmtSearch('');
      setItemMgmtCodeSearch('');
      setItemMgmtSelectedCategory('All');
      setItemMgmtEditItem(null);
      setItemMgmtLoading(false);
      setConfigSubView('main');
      setItemMgmtTypeFilter('0');
      setIsItemFormOpen(false);
      setItemMgmtTaxGroups([]);
      setItemMgmtKitchenDepts([]);
      setIsPaymentModalOpen(false);
      setSelectedPaymentMode('Cash');
      setIsSplitPayment(false);
      setIsDuePayment(false);
      setPaymentReferenceNo('');
      setTipAmount('');
      setCustomerPaidAmount('');
      setSplitPaidAmount('');
      setSplitCreditAmount('');
      setSaveChangeToBalance(false);
      setExpandedOrderId(null);
      setIsPayDueModalOpen(false);
      setPayDueAmount('');
      setPayDueMethod('Cash');
      setPayDueNotes('');
      setCreditSearchQuery('');
      setCreditSearchResults([]);
      setQrModalTable(null);
      setTableContextMenu(null);
      setFeedbackRating({ item1: 5, item2: 5 });
      setInventoryActiveTab('list');
      setIsTableManagementModalOpen(false);
      setIsUserManagementModalOpen(false);
      setIsCaptainAppModalOpen(false);
      setIsFeedbackModalOpen(false);
      setIsInventoryModalOpen(false);
      setInventoryItems([]);
      setIsReservationModalOpen(false);
      setReservations([]);
      setIsOldKOTModalOpen(false);
      setPrintKOT(true);
      setPrintCancelledKOT(true);
      setPrintTransferredKOT(true);
      setSelectAllOldKOT(false);
      setSelectedOldKOTItems({});
      setOldKOTItemReasons({});
      setIsTransferModalOpen(false);
      setSelectedReport('Sales Report');
      setIsAddCustomerModalOpen(false);
      setIsManageCustomersModalOpen(false);
      setIsManageBalancesModalOpen(false);
      setIsManagePointsModalOpen(false);
      setNewCustomerForm({ name: '', phone: '', address: '', points: 0, balance: 0 });
      setCustomerSearchQuery('');
      setEditingCustomerPhone(null);
      setEditingCustomerFields({ name: '', phone: '', address: '' });
      setAdjustmentAmount('');
      setAdjustmentType('ADD');
      setCustomerCountryCode('+91');
      setNewCustomerCountryCode('+91');
      setAdjustmentReason('');
      setHistoryCustomerPhone(null);
      setCustomerHistoryData({ orders: [], transactions: [] });
      setIsHistoryLoading(false);
      setIncludeItemized(false);
      setIsCheckingOut(false);
      setPreOrders([]);
      setPreOrderAdvanceAmount('');
      setPreOrderOrderType('PICKUP');
      setPreOrderNotes('');
      setShowPreOrderList(false);
      setEditingPreOrder(null);
      setPreOrderSubTab('KOT');
      setPreOrderTableNumber('');
      setSelectedReceipt(null);
      setPreviewReceipt(null);
      setEditingOrder(null);
      setTicker(0);
      setIsRejectionModalOpen(false);
      setRejectionOrderId(null);
      setSelectedRejectionReason("");
      setCustomRejectionReason("");
      setIsManagingPresets(false);
      setNewPresetInput("");
      setSaveToPresets(false);
      setNextBillNo(1);`;

// 4. calculateStats block
const targetCalculateStats = `    calculated.avgSalePerPerson = calculated.totalCount > 0 ? (calculated.totalSales / calculated.totalCount).toFixed(2) : '0.00';

    if (navigator.onLine && stats.totalSales > 0) {
      setStats(prev => ({
        ...calculated,
        todaySales: prev.todaySales,
        todayCount: prev.todayCount,
        totalSales: prev.totalSales,
        totalCount: prev.totalCount,
        monthSales: prev.monthSales,
        monthCount: prev.monthCount,
        offlineSales: prev.offlineSales,
        offlineCount: prev.offlineCount,
        onlineSales: prev.onlineSales,
        onlineCount: prev.onlineCount,
        dineInSales: prev.dineInSales,
        dineInCount: prev.dineInCount,
        quickSales: prev.quickSales,
        quickCount: prev.quickCount,
        takeawaySales: prev.takeawaySales,
        takeawayCount: prev.takeawayCount,
        deliverySales: prev.deliverySales,
        deliveryCount: prev.deliveryCount,
        totalTax: prev.totalTax,
        totalDiscount: prev.totalDiscount,
        todayCreditSales: prev.todayCreditSales,
        totalCreditSales: prev.totalCreditSales,
        avgSalePerPerson: prev.avgSalePerPerson,
        serverIp: prev.serverIp,
        weeklyHeatmap: prev.weeklyHeatmap,
        paymentBreakdown: prev.paymentBreakdown
      }));
    } else {
      setStats(prev => ({
        ...calculated,
        serverIp: prev.serverIp,
        weeklyHeatmap: prev.weeklyHeatmap
      }));
    }`;

const replacementCalculateStats = `    calculated.avgSalePerPerson = calculated.totalCount > 0 ? (calculated.totalSales / calculated.totalCount).toFixed(2) : '0.00';

    setStats(prev => ({
      ...calculated,
      serverIp: prev.serverIp,
      weeklyHeatmap: prev.weeklyHeatmap
    }));`;

// 5. fetchDashboardStatsFromServer block
const targetFetchDashboard = `  const fetchDashboardStatsFromServer = async () => {
    if (!isAuthenticated || !navigator.onLine) return;
    try {
      const res = await posService.getDashboardStats();
      if (res.data) {
        setStats(prev => ({
          ...prev,
          todaySales: parseFloat(res.data.todaySales?.total || 0),
          todayCount: parseInt(res.data.todaySales?.count || 0),
          totalSales: parseFloat(res.data.totalSales?.total || 0),
          totalCount: parseInt(res.data.totalSales?.count || 0),
          monthSales: parseFloat(res.data.thisMonth?.total || 0),
          monthCount: parseInt(res.data.thisMonth?.count || 0),
          offlineSales: parseFloat(res.data.offlineSales?.total || 0),
          offlineCount: parseInt(res.data.offlineSales?.count || 0),
          onlineSales: parseFloat(res.data.onlineSales?.total || 0),
          onlineCount: parseInt(res.data.onlineSales?.count || 0),
          dineInSales: parseFloat(res.data.dineIn?.total || 0),
          dineInCount: parseInt(res.data.dineIn?.count || 0),
          quickSales: parseFloat(res.data.quickBill?.total || 0),
          quickCount: parseInt(res.data.quickBill?.count || 0),
          takeawaySales: parseFloat(res.data.pickup?.total || 0),
          takeawayCount: parseInt(res.data.pickup?.count || 0),
          deliverySales: parseFloat(res.data.onlineSales?.total || 0),
          deliveryCount: parseInt(res.data.onlineSales?.count || 0),
          totalTax: parseFloat(res.data.totalTax || 0),
          totalDiscount: parseFloat(res.data.totalDiscount || 0),
          todayCreditSales: parseFloat(res.data.todayCreditSales || 0),
          totalCreditSales: parseFloat(res.data.totalCreditSales || 0),
          avgSalePerPerson: res.data.avgSalePerPerson || '0.00',
          serverIp: res.data.serverIp || prev.serverIp || '127.0.0.1',
          weeklyHeatmap: Array.isArray(res.data.weeklyHeatmap) ? res.data.weeklyHeatmap : [],
          paymentBreakdown: Array.isArray(res.data.paymentBreakdown) ? res.data.paymentBreakdown : []
        }));

        if (Array.isArray(res.data.dailySales)) {
          const chartPoints = res.data.dailySales.map(d => ({
            day: d.date ? d.date.split('T')[0] : '',
            total: parseFloat(d.total || 0)
          }));
          setLineData(chartPoints);
          setBarData(chartPoints);
        }

        if (Array.isArray(res.data.topItems)) {
          const piePoints = res.data.topItems.map(i => ({
            name: i.name,
            qty: parseInt(i.count || 0)
          }));
          setPieItems(piePoints);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch dashboard stats from server:", e);
    }
  };`;

const replacementFetchDashboard = `  const fetchDashboardStatsFromServer = async () => {
    // No-op: skip loading server stats to keep POS data purely local
    if (!isAuthenticated) return;
  };`;

// 6. handleLogin block
const targetHandleLogin = `  const handleLogin = async (e) => {
    e.preventDefault();
    // 🔐 Internet is REQUIRED for login — per system policy
    if (!navigator.onLine) {
      toast.error("⚠️ No Internet Connection. Internet is required to login. Please connect and try again.");
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await authService.posLogin(username, password);
      localStorage.setItem('pos_token', res.data.token);
      setIsTransitioningToDashboard(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsTransitioningToDashboard(false);
      }, 2200);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Invalid Credentials";
      toast.error(errMsg);
    }
    finally { setIsLoggingIn(false); }
  };`;

const replacementHandleLogin = `  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await authService.posLogin(username, password);
      localStorage.setItem('pos_token', res.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Invalid Credentials";
      toast.error(errMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };`;

// Apply all
try {
  replaceExactlyOnce(targetFetchOrders, replacementFetchOrders, 'fetchOrdersForMode');
  replaceExactlyOnce(targetFilteredOrders, replacementFilteredOrders, 'filteredOrders');
  replaceExactlyOnce(targetLogoutFlow, replacementLogoutFlow, 'logoutFlow');
  replaceExactlyOnce(targetCalculateStats, replacementCalculateStats, 'calculateStats');
  replaceExactlyOnce(targetFetchDashboard, replacementFetchDashboard, 'fetchDashboardStatsFromServer');
  replaceExactlyOnce(targetHandleLogin, replacementHandleLogin, 'handleLogin');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("🎉 ALL USER CUSTOM OFFLINE POS FEATURES RESTORED AND INTEGRATED SUCCESSFULLY!");
} catch (e) {
  console.error("❌ Failed to apply user changes:", e.message);
  process.exit(1);
}
