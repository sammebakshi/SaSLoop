const fs = require('fs');

const filesToFix = [
  'pos-app/src/App.jsx',
  'scratch/App_dirty.jsx'
];

filesToFix.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  console.log(`Fixing file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Declare missing states at the top level
  const targetStateDecl = `  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [tableWaiters, setTableWaiters] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_table_waiters');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });`;

  const newStateDecl = `  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [tableWaiters, setTableWaiters] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_table_waiters');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });`;

  let updatedContent = content.replace(/\r\n/g, '\n');
  const normalizedTargetStateDecl = targetStateDecl.replace(/\r\n/g, '\n');
  const normalizedNewStateDecl = newStateDecl.replace(/\r\n/g, '\n');

  if (updatedContent.includes(normalizedTargetStateDecl)) {
    updatedContent = updatedContent.replace(normalizedTargetStateDecl, normalizedNewStateDecl);
    console.log('  -> Top-level state declarations updated.');
  }

  // 2. Add settings to defaultSettings
  const targetDefaultSettings = `      activeStaticUpiId: '',
      countAdvanceInSales: false
    };`;

  const newDefaultSettings = `      activeStaticUpiId: '',
      countAdvanceInSales: false,
      printCustomerCopy: true,
      printRestaurantCopy: true,
      askPasswordForTableDelete: true,
      printLoyaltyPoints: true,
      loyaltyPrintOption: 'all'
    };`;

  const normalizedTargetDefaultSettings = targetDefaultSettings.replace(/\r\n/g, '\n');
  const normalizedNewDefaultSettings = newDefaultSettings.replace(/\r\n/g, '\n');

  if (updatedContent.includes(normalizedTargetDefaultSettings)) {
    updatedContent = updatedContent.replace(normalizedTargetDefaultSettings, normalizedNewDefaultSettings);
    console.log('  -> defaultSettings updated.');
  }

  // 3. Fix handleOpenPriceSubmit corrupted block
  const targetOpenPriceSubmit = `  const handleOpenPriceSubmit = (e) => {
    if (e) e.preventDefault();
    const priceNum = parseFloat(openPriceValue);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    
    const label = getItemPriceLabel();
    const updatedItem = { ...openPriceItem, price: priceNum, priceLabel: label };
    const hasOptions = optionGroups.some(og => og.item_id === updatedItem.id);
    
    if (hasOptions) {
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [tableWaiters, setTableWaiters] = useState(() => {
        return [...prev, { ...updatedItem, quantity: 1 }];
      });
    }
    
    setIsOpenPriceModalOpen(false);
    setOpenPriceItem(null);
    setOpenPriceValue('');
  };`;

  const cleanOpenPriceSubmit = `  const handleOpenPriceSubmit = (e) => {
    if (e) e.preventDefault();
    const priceNum = parseFloat(openPriceValue);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    
    const label = getItemPriceLabel();
    const updatedItem = { ...openPriceItem, price: priceNum, priceLabel: label };
    const hasOptions = optionGroups.some(og => og.item_id === updatedItem.id);
    
    if (hasOptions) {
      setSelectedItemForModifiers(updatedItem);
    } else {
      setCart(prev => {
        const existing = prev.find(c => c.id === updatedItem.id && parseFloat(c.price || 0) === priceNum && c.priceLabel === label);
        if (existing) return prev.map(c => (c.id === updatedItem.id && parseFloat(c.price || 0) === priceNum && c.priceLabel === label) ? { ...c, quantity: c.quantity + 1 } : c);
        return [...prev, { ...updatedItem, quantity: 1 }];
      });
    }
    
    setIsOpenPriceModalOpen(false);
    setOpenPriceItem(null);
    setOpenPriceValue('');
  };`;

  const normalizedTargetOpenPrice = targetOpenPriceSubmit.replace(/\r\n/g, '\n');
  const normalizedCleanOpenPrice = cleanOpenPriceSubmit.replace(/\r\n/g, '\n');

  if (updatedContent.includes(normalizedTargetOpenPrice)) {
    updatedContent = updatedContent.replace(normalizedTargetOpenPrice, normalizedCleanOpenPrice);
    console.log('  -> handleOpenPriceSubmit block fixed.');
  }

  // 4. Fix handleCatalogItemClick corrupted block
  const cleanCatalogItemClick = `  const handleCatalogItemClick = (item) => {
    try {
      if (orderType === 'DINE_IN' && !selectedTable && activeTrayTab !== 'PreOrder') {
        toast.warning("Please select a table first.");
        return;
      }
      
      if (activeTrayTab !== 'PreOrder') {
        setActiveTrayTab('KOT');
      }
      
      const isZeroPrice = parseFloat(item.price || 0) === 0;
      const isOpenPrice = item.is_open_price === true;
      
      if (isZeroPrice || isOpenPrice) {
        setOpenPriceItem(item);
        setOpenPriceValue('');
        setIsOpenPriceModalOpen(true);
        return;
      }

      // Check if optionGroups is null/undefined to prevent crashes
      if (!optionGroups || !Array.isArray(optionGroups)) {
        throw new TypeError("optionGroups is not an array: " + typeof optionGroups);
      }

      const hasOptions = optionGroups.some(og => og.item_id === item.id);`;

  const idx = updatedContent.indexOf('const handleCatalogItemClick = (item) => {');
  if (idx !== -1) {
    const corruptEnd = 'const hasOptions = optionGroups.some(og => og.item_id === item.id);';
    const corruptEndIdx = updatedContent.indexOf(corruptEnd, idx);
    if (corruptEndIdx !== -1) {
      const beforeCorrupt = updatedContent.substring(0, idx);
      const afterCorrupt = updatedContent.substring(corruptEndIdx);
      updatedContent = beforeCorrupt + cleanCatalogItemClick + '\n' + afterCorrupt;
      console.log('  -> handleCatalogItemClick block fixed.');
    }
  }

  // 5. Fix handleSaveTemporaryKOT corrupted print settings block
  const targetSaveTempKOTCorrupt = `    setTableStatuses(prev => ({ ...prev, [tempId]: isPrint ? 'PRINTED' : 'SAVED' }));
      printCustomerCopy: true,
      printRestaurantCopy: true,
      askPasswordForTableDelete: true,
      printLoyaltyPoints: true,
      loyaltyPrintOption: 'all'
    };
    setCart([]);`;

  const cleanSaveTempKOT = `    setTableStatuses(prev => ({ ...prev, [tempId]: isPrint ? 'PRINTED' : 'SAVED' }));
    
    if (isPrint) {
      handlePrintKOT(cart, tableName, bNo);
    }
    
    setCart([]);`;

  const normalizedTargetSaveTemp = targetSaveTempKOTCorrupt.replace(/\r\n/g, '\n');
  const normalizedCleanSaveTemp = cleanSaveTempKOT.replace(/\r\n/g, '\n');

  if (updatedContent.includes(normalizedTargetSaveTemp)) {
    updatedContent = updatedContent.replace(normalizedTargetSaveTemp, normalizedCleanSaveTemp);
    console.log('  -> handleSaveTemporaryKOT print logic restored.');
  }

  // 6. Fix activeTab useEffect corrupted block
  const targetActiveTabUseEffect = `    if (isPrint) {
      handlePrintKOT(cart, tableName, bNo, 'NEW', {
        isPreOrder: true,
        scheduledDate: preOrderScheduledDate,
        scheduledTime: preOrderScheduledTime,
        customerName: customerName,
        customerPhone: customerPhone
      });
    }

    }
  }, [activeTab]);`;

  const cleanActiveTabUseEffect = `  useEffect(() => {
    if (activeTab === 'digital') {
      stopLoopingSound();
    }
  }, [activeTab]);`;

  const normalizedTargetActiveTab = targetActiveTabUseEffect.replace(/\r\n/g, '\n');
  const normalizedCleanActiveTab = cleanActiveTabUseEffect.replace(/\r\n/g, '\n');

  if (updatedContent.includes(normalizedTargetActiveTab)) {
    updatedContent = updatedContent.replace(normalizedTargetActiveTab, normalizedCleanActiveTab);
    console.log('  -> activeTab useEffect block fixed.');
  }

  // 7. Fix initApp corrupted beginning block via exact range replacement
  const anchorEffectEnd = '}, [cart, selectedTable, tableBills]); // Removed tableCarts from dependencies to break the loop';
  const targetTaxesLine = 'const taxes = JSON.parse(cachedTaxes);';
  
  const anchorIdx = updatedContent.indexOf(anchorEffectEnd);
  if (anchorIdx !== -1) {
    const nextTaxesIdx = updatedContent.indexOf(targetTaxesLine, anchorIdx);
    if (nextTaxesIdx !== -1) {
      const before = updatedContent.substring(0, anchorIdx + anchorEffectEnd.length);
      const after = updatedContent.substring(nextTaxesIdx);
      
      const cleanInitAppBlock = `\n\n  const initApp = async () => {
    // 0. Load everything from cache immediately so the app is instantly active
    let cachedBiz = null;
    try {
      const cachedProfile = localStorage.getItem('pos_profile');
      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        setBusiness(parsed);
        if (parsed.username) {
          setUsername(parsed.username);
        }
        cachedBiz = parsed.business_details || parsed || {};
        
        const fetchedTaxRate = parseFloat(cachedBiz.tax_percent || (parseFloat(cachedBiz.cgst_percent || 0) + parseFloat(cachedBiz.sgst_percent || 0))) || 0;
        setConfig(prev => ({ 
          ...prev,
          currency: cachedBiz.currency_symbol || cachedBiz.currency_code || '₹', 
          tax_rate: fetchedTaxRate,
          business_type: String(cachedBiz.business_category || cachedBiz.business_type || '').toUpperCase().includes('RETAIL') ? 'RETAIL' : 'RESTAURANT'
        }));
        setPosSettings(prev => ({ ...prev, taxRate: fetchedTaxRate }));
      }

      const cachedCatalog = localStorage.getItem('pos_catalog_cache');
      if (cachedCatalog) {
        const rawCatalogData = JSON.parse(cachedCatalog);
        const catalogData = rawCatalogData.filter((item, idx, self) => {
          if (item.category === 'Uncategorized') {
            const hasCategorized = self.some(other => other.product_name === item.product_name && other.category !== 'Uncategorized');
            if (hasCategorized) return false;
          }
          return true;
        });
        setCatalog(catalogData);
        window.catalog = catalogData;
        setCategories(['All', ...new Set(catalogData.map(i => i.category).filter(c => c && c.toLowerCase() !== 'uncategorized' && c.toLowerCase() !== 'uncategorised'))]);
      }

      const cachedOptionGroups = localStorage.getItem('pos_option_groups');
      if (cachedOptionGroups) {
        setOptionGroups(JSON.parse(cachedOptionGroups));
      }

      const cachedTables = localStorage.getItem('pos_tables_cache');
      if (cachedTables) {
        const serverTables = JSON.parse(cachedTables);
        setTables(prev => {
          const localTempTables = prev.filter(t => t.is_temporary);
          return [...serverTables, ...localTempTables];
        });
      }

      const cachedTaxes = localStorage.getItem('pos_taxes');
      if (cachedTaxes) {
        `;
      
      updatedContent = before + cleanInitAppBlock + after;
      console.log('  -> initApp beginning block successfully restored.');
    }
  }

  // 8. Fix initApp second corrupted block (online fetching start)
  const cacheWarnMsg = 'console.warn("initApp - Failed to load from local cache:", e);\n    }';
  const targetWindowCatalogLine = 'window.catalog = filteredCatalog;';
  
  const cacheWarnIdx = updatedContent.indexOf(cacheWarnMsg);
  if (cacheWarnIdx !== -1) {
    const windowCatalogIdx = updatedContent.indexOf(targetWindowCatalogLine, cacheWarnIdx);
    if (windowCatalogIdx !== -1) {
      const before = updatedContent.substring(0, cacheWarnIdx + cacheWarnMsg.length);
      const after = updatedContent.substring(windowCatalogIdx);
      
      const cleanOnlineFetchStart = `\n\n    console.log("initApp - Device is online. Fetching updates from back-office...");\n    \n    // 1. Fetch Business Profile\n    let biz = null;\n    try {\n      const profile = await authService.getProfile();\n      setBusiness(profile.data);\n      if (profile.data?.username) {\n        setUsername(profile.data.username);\n      }\n      localStorage.setItem('pos_profile', JSON.stringify(profile.data));\n      biz = profile.data?.business_details || profile.data || {};\n    } catch (e) {\n      console.warn("initApp - Failed to load profile:", e);\n    }\n\n    const fetchedTaxRate = parseFloat(biz.tax_percent || (parseFloat(biz.cgst_percent || 0) + parseFloat(biz.sgst_percent || 0))) || 0;\n    setConfig(prev => ({\n      ...prev,\n      currency: biz.currency_symbol || biz.currency_code || '₹',\n      tax_rate: fetchedTaxRate,\n      business_type: String(biz.business_category || biz.business_type || '').toUpperCase().includes('RETAIL') ? 'RETAIL' : 'RESTAURANT'\n    }));\n    \n    setPosSettings(prev => ({\n      ...prev,\n      taxRate: fetchedTaxRate\n    }));\n\n    // 2. Fetch Catalog\n    try {\n      const catRes = await posService.getCatalog();\n      const catalogData = (catRes.data || []).map(i => ({\n        ...i,\n        stock: i.stock_count !== null ? parseInt(i.stock_count) : undefined,\n        tax_applicable: !!i.tax_applicable,\n        kot_category: i.kot_category || "Main Kitchen"\n      }));\n      const filteredCatalog = catalogData.filter((item, idx, self) => {\n        if (item.category === 'Uncategorized') {\n          const hasCategorized = self.some(other => other.product_name === item.product_name && other.category !== 'Uncategorized');\n          if (hasCategorized) return false;\n        }\n        return true;\n      });\n      setCatalog(filteredCatalog);\n      `;
      
      updatedContent = before + cleanOnlineFetchStart + after;
      console.log('  -> initApp online fetching start block successfully restored.');
    }
  }

  // 9. Fix handleCheckout corrupted customer save/loyalty update block
  const checkoutErrorAnchor = 'console.error("Failed to complete pre-order:", poErr);';
  const checkoutSettleAnchor = 'else if (type === \'SETTLE\') {';
  
  const errIdx = updatedContent.indexOf(checkoutErrorAnchor);
  if (errIdx !== -1) {
    const settleIdx = updatedContent.indexOf(checkoutSettleAnchor, errIdx);
    if (settleIdx !== -1) {
      const before = updatedContent.substring(0, errIdx + checkoutErrorAnchor.length);
      const after = updatedContent.substring(settleIdx);
      
      const cleanCheckoutMiddleBlock = `\n        }\n      }\n    } catch (err) {\n      toast.error("Offline Mode: Saved Locally Only");\n    }\n\n    if (fullPhone) {\n      // Auto-save/update customer in the server database\n      try {\n        await posService.saveCustomer({\n          name: customerName || "POS Guest",\n          number: fullPhone,\n          address: customerAddress || ""\n        });\n      } catch (err) {\n        console.error("Failed to sync customer details during checkout:", err);\n      }\n\n      let pointsEarned = 0;\n      if (getLoyaltySetting(\'loyalty_enabled\', true)) {\n        const isDineIn = orderType === \'DINE_IN\';\n        const isPickup = orderType === \'PICKUP\' && subOrderType !== \'DELIVERY\';\n        const isDelivery = orderType === \'DELIVERY\' || (orderType === \'PICKUP\' && subOrderType === \'DELIVERY\');\n        \n        let eligible = true;\n        if (isDineIn && getLoyaltySetting(\'loyalty_points_dinein\', true) === false) eligible = false;\n        if (isPickup && getLoyaltySetting(\'loyalty_points_pickup\', true) === false) eligible = false;\n        if (isDelivery && getLoyaltySetting(\'loyalty_points_delivery\', true) === false) eligible = false;\n        \n        if (eligible) {\n          const threshold = parseFloat(getLoyaltySetting(\'loyalty_bill_amount_threshold\', 1000));\n          const pointsAwarded = parseFloat(getLoyaltySetting(\'loyalty_points_earned\', 100));\n          const ratio = pointsAwarded / threshold;\n          pointsEarned = total >= threshold ? Math.floor(total * ratio) : 0;\n        }\n      } else {\n        pointsEarned = Math.floor(total / 100);\n      }\n\n      setCustomerDb(prev => {\n        const existing = prev[fullPhone] || { name: customerName, phone: fullPhone, address: customerAddress || "", points: 0, orders: 0, totalSpent: 0, balance: 0 };\n        const balanceChange = ((method || \'CASH\').toLowerCase() === \'credit\') ? -finalTotalPrice : \n                              (((method || \'CASH\').toLowerCase() === \'split\') ? -(parseFloat(splitCreditAmount) || 0) : \n                              (((method || \'CASH\').toLowerCase() === \'cash\' && saveChangeToBalance) ? ((parseFloat(customerPaidAmount) || 0) - finalTotalPrice) : 0));\n        const updatedCust = {\n          ...existing,\n          name: customerName || existing.name,\n          address: customerAddress || existing.address || \'\',\n          points: existing.points + pointsEarned - redeemedPoints,\n          orders: existing.orders + 1,\n          totalSpent: existing.totalSpent + total,\n          balance: (existing.balance || 0) + balanceChange\n        };\n        const nextDb = { ...prev, [fullPhone]: updatedCust };\n        localStorage.setItem(\'pos_customer_db\', JSON.stringify(nextDb));\n        return nextDb;\n      });\n      if (historyCustomerPhone === fullPhone) {\n        refreshCustomerHistory(fullPhone);\n      }\n    }\n\n    if (selectedTable) {\n      if (type === \'SAVE\') setTableStatuses(prev => ({ ...prev, [selectedTable.id]: \'SAVED\'; }));\n      else if (type === \'PRINT\') {\n        setTableStatuses(prev => ({ ...prev, [selectedTable.id]: \'PRINTED\'; }));\n        handlePrint(newOrder);\n      }\n      `;
      
      updatedContent = before + cleanCheckoutMiddleBlock + after;
      console.log('  -> handleCheckout customer/loyalty save block successfully restored.');
    }
  }

  // 10. Inject setRedeemedPoints(0) on checkout settle
  const settleCleanUpAnchor = `      setSelectedTable(null);
      setBillingView('tables');
      setEditingOrder(null);
      setSelectedWaiter(null);`;
      
  const newSettleCleanUp = `      setSelectedTable(null);
      setBillingView('tables');
      setEditingOrder(null);
      setSelectedWaiter(null);
      setRedeemedPoints(0);`;

  const normalizedSettleCleanUpAnchor = settleCleanUpAnchor.replace(/\r\n/g, '\n');
  const normalizedNewSettleCleanUp = newSettleCleanUp.replace(/\r\n/g, '\n');

  if (updatedContent.includes(normalizedSettleCleanUpAnchor)) {
    updatedContent = updatedContent.replace(normalizedSettleCleanUpAnchor, normalizedNewSettleCleanUp);
    console.log('  -> setRedeemedPoints(0) added to checkout settlement cleanup.');
  }

  // 11. Fix getStatusStepIndex and getFilteredDigitalOrders corrupted declarations
  const targetStepIndexAnchor = 'const getStatusStepIndex = (status) => {';
  const filterDigitalOrdersAnchor = 'return recentOrders.filter(order => {';
  
  const stepIndexIdx = updatedContent.indexOf(targetStepIndexAnchor);
  if (stepIndexIdx !== -1) {
    const filterIdx = updatedContent.indexOf(filterDigitalOrdersAnchor, stepIndexIdx);
    if (filterIdx !== -1) {
      const before = updatedContent.substring(0, stepIndexIdx);
      const after = updatedContent.substring(filterIdx);
      
      const cleanStepAndFilterBlock = `const getStatusStepIndex = (status) => {
    const s = String(status || 'PENDING').toUpperCase();
    if (s === 'COMPLETED') return 3;
    if (['DISPATCHED', 'READY', 'FOOD READY'].includes(s)) return 2;
    if (['PROCESSING', 'PREPARING'].includes(s)) return 1;
    return 0;
  };

  const getFilteredDigitalOrders = () => {
    `;
      
      updatedContent = before + cleanStepAndFilterBlock + after;
      console.log('  -> getStatusStepIndex and getFilteredDigitalOrders declarations successfully restored.');
    }
  }

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Finished fixing ${filePath}\n`);
});
