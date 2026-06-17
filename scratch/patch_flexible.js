const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
let content = fs.readFileSync(filepath, 'utf8');

console.log("Starting flexible patch process...");

// 1. Exit Button Patch
// Key signature: isDark={isDark} icon={<LogOut size={18}
const logoutSig = "isDark={isDark} icon={<LogOut size={18}";
const logoutIndex = content.indexOf(logoutSig);
if (logoutIndex !== -1) {
  // Find start of line
  const startOfLine = content.lastIndexOf('\n', logoutIndex) + 1;
  // Find end of line
  const endOfLine = content.indexOf('\n', logoutIndex);
  
  const originalLine = content.substring(startOfLine, endOfLine);
  console.log("Found Logout original line:", originalLine.trim());
  
  const replacementLine = `            <SidebarIcon isDark={isDark} icon={<LogOut size={18} className="text-current" />} onClick={() => { localStorage.removeItem('pos_token'); localStorage.removeItem('pos_profile'); setBusiness(null); setIsAuthenticated(false); setUsername(''); setPassword(''); setActiveTab('home'); }} label="Exit" />`;
  
  content = content.substring(0, startOfLine) + replacementLine + content.substring(endOfLine);
  console.log("Exit button patch applied!");
} else {
  console.error("ERROR: Exit button signature not found!");
}

// 2. Settings Modal Tab Headers Patch
// Key signature start: { id: 'general', label: 'General', icon: <Settings size={12} /> }
// Key signature end: { id: 'profile', label: 'Profile', icon: <User size={12} /> }
const tabsStartSig = "{ id: 'general', label: 'General', icon: <Settings size={12} /> }";
const tabsEndSig = "].map((tab) => (";
const tabsStartIndex = content.indexOf(tabsStartSig);
if (tabsStartIndex !== -1) {
  // Find the opening bracket '[' before the general tab
  const bracketIndex = content.lastIndexOf('[', tabsStartIndex);
  // Find the matching end signature after start index
  const endIndex = content.indexOf(tabsEndSig, tabsStartIndex);
  if (bracketIndex !== -1 && endIndex !== -1) {
    const originalTabsBlock = content.substring(bracketIndex, endIndex + tabsEndSig.length);
    console.log("Found original tabs block successfully!");
    
    const replacementTabsBlock = `[
                           { id: 'general', label: 'General', icon: <Settings size={12} />, key: 'general' },
                           { id: 'outlet', label: 'Outlet Settings', icon: <Store size={12} />, key: 'general' },
                           { id: 'printer', label: 'Printers', icon: <Printer size={12} />, key: 'printers' },
                           { id: 'shortcuts', label: 'Shortcuts', icon: <Key size={12} />, key: 'shortcuts' },
                           { id: 'formatting', label: 'Formatting', icon: <Sliders size={12} />, key: 'formatting' },
                           { id: 'profile', label: 'Profile', icon: <User size={12} />, key: 'profile' }
                        ].filter((tab) => {
                           const posAccess = business?.staff_permissions?.pos_access;
                           if (!posAccess) return true;
                           const userRole = String(business?.role || '').toLowerCase();
                           const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
                           if (isSupervisor) return true;
                           return posAccess?.Settings?.[tab.key] !== false;
                        }).map((tab) => (`;
                        
    content = content.substring(0, bracketIndex) + replacementTabsBlock + content.substring(endIndex + tabsEndSig.length);
    console.log("Settings sub-tabs patch applied!");
  } else {
    console.error("ERROR: Bracket or endIndex not found around tabs!");
  }
} else {
  console.error("ERROR: Settings tabs start signature not found!");
}

// 3. Settings Page Buttons Grid Patch
// Key signature start: <h3 className="text-xl font-black uppercase italic text-[#c9d1d9] flex items-center gap-3"><Settings className="text-[#10ac84]"/> Configuration & Settings</h3>
// Key signature button start: onClick={() => setIsAccessLevelModalOpen(true)}
// Key signature end: Manage menu items, prices, and availability.
const buttonsHeaderSig = 'Configuration & Settings';
const buttonsEndSig = 'Manage menu items, prices, and availability.';
const headerIndex = content.indexOf(buttonsHeaderSig);
if (headerIndex !== -1) {
  // Find the grid div start after the header
  const gridDivIndex = content.indexOf('<div className="grid grid-cols-3 gap-4">', headerIndex);
  // Find the end signature
  const endSigIndex = content.indexOf(buttonsEndSig, gridDivIndex);
  if (gridDivIndex !== -1 && endSigIndex !== -1) {
    // Find the closing button tag </button> and container div </div> after the end signature
    const buttonCloseIndex = content.indexOf('</button>', endSigIndex);
    const divCloseIndex = content.indexOf('</div>', buttonCloseIndex);
    
    if (buttonCloseIndex !== -1 && divCloseIndex !== -1) {
      const originalButtonsBlock = content.substring(gridDivIndex, divCloseIndex + 6);
      console.log("Found original buttons grid block successfully!");
      
      const replacementButtonsBlock = `<div className="grid grid-cols-3 gap-4">
                    {(() => {
                      const userRole = String(business?.role || '').toLowerCase();
                      const isSupervisor = ['brand_owner', 'master_admin', 'admin', 'manager'].includes(userRole) || userRole.includes('admin') || userRole.includes('manager');
                      const posAccess = business?.staff_permissions?.pos_access;
                      
                      return (
                        <>
                          {isSupervisor && (
                            <button 
                               onClick={() => setIsAccessLevelModalOpen(true)}
                               className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                            >
                               <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                                  <Lock size={20}/>
                               </div>
                               <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Access Level Management</h4>
                               <p className="text-[9px] font-bold text-[#8b949e] mt-1">Configure dashboard visibility and permissions.</p>
                            </button>
                          )}

                          {isModuleAllowed("POS Configuration") && (
                            <button 
                               onClick={() => setIsTableManagementModalOpen(true)}
                               className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                            >
                               <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                                  <LayoutGrid size={20}/>
                               </div>
                               <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Table Management</h4>
                               <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage tables, QR codes, and departments.</p>
                            </button>
                          )}

                          {isModuleAllowed("POS Configuration") && posAccess?.UserManagement?.visible !== false && (
                            <button 
                               onClick={() => setIsUserManagementModalOpen(true)}
                               className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                            >
                               <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                                  <Users size={20}/>
                               </div>
                               <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">User Management</h4>
                               <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage staff, roles, and KDS access.</p>
                            </button>
                          )}

                          {isModuleAllowed("POS Configuration") && (
                            <button 
                               onClick={() => setIsCaptainAppModalOpen(true)}
                               className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                            >
                               <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                                  <Monitor size={20}/>
                               </div>
                               <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Captain App</h4>
                               <p className="text-[9px] font-bold text-[#8b949e] mt-1">View Captain (Waiter) app mockup.</p>
                            </button>
                          )}

                          {isModuleAllowed("Feedback Management") && (
                            <button 
                               onClick={() => setIsFeedbackModalOpen(true)}
                               className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                            >
                               <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                                  <MessageSquare size={20}/>
                               </div>
                               <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Feedback Management</h4>
                               <p className="text-[9px] font-bold text-[#8b949e] mt-1">View customer feedback form.</p>
                            </button>
                          )}

                          {isModuleAllowed("Inventory Management") && (
                            <button 
                               onClick={() => setIsInventoryModalOpen(true)}
                               className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                            >
                               <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                                  <Package size={20}/>
                               </div>
                               <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Inventory Management</h4>
                               <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage stock on hand and vendors.</p>
                            </button>
                          )}

                          {isModuleAllowed("Table Reservation") && (
                            <button 
                               onClick={() => setIsReservationModalOpen(true)}
                               className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                            >
                               <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                                  <Calendar size={20}/>
                               </div>
                               <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Table Reservations</h4>
                               <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage table bookings and guests.</p>
                            </button>
                          )}

                          {isModuleAllowed("POS Configuration") && posAccess?.OperationManagement?.ItemsManagement?.visible !== false && (
                            <button 
                               onClick={async () => {
                                  setActiveTab('config');
                                  setConfigSubView('items');
                                  if (itemMgmtItems.length === 0) {
                                     setItemMgmtLoading(true);
                                     try {
                                        const outletId = business?.user_id || business?.parent_user_id || business?.id;
                                        const [itemsRes, catsRes, taxGroupsRes, kitchenDeptsRes] = await Promise.all([
                                           posService.getAllMenuItems(outletId),
                                           posService.getCategories(outletId),
                                           posService.getTaxGroups(outletId),
                                           posService.getKitchenDepartments(outletId)
                                        ]);
                                        setItemMgmtItems(itemsRes.data || []);
                                        setItemMgmtCategories(catsRes.data || []);
                                        setItemMgmtTaxGroups(taxGroupsRes.data || []);
                                        setItemMgmtKitchenDepts(kitchenDeptsRes.data || []);
                                     } catch (err) {
                                        console.error('Failed to load menu items:', err);
                                        toast.error('Failed to load items');
                                     }
                                     setItemMgmtLoading(false);
                                  }
                               }}
                               className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                            >
                               <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                                  <Utensils size={20}/>
                               </div>
                               <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Items Management</h4>
                               <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage menu items, prices, and availability.</p>
                            </button>
                          )}
                        </>
                      );
                    })()}
                 </div>`;
      
      content = content.substring(0, gridDivIndex) + replacementButtonsBlock + content.substring(divCloseIndex + 6);
      console.log("Settings page buttons patch applied successfully!");
    } else {
      console.error("ERROR: Closing button or div not found after grid div!");
    }
  } else {
    console.error("ERROR: Grid div or buttons end signature not found!");
  }
} else {
  console.error("ERROR: Buttons header signature not found!");
}

// Convert all to original line endings (CRLF for Windows)
const finalCRLF = content.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
fs.writeFileSync(filepath, finalCRLF, 'utf8');
console.log("Flexible patch completed!");
