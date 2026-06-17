const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
let content = fs.readFileSync(filepath, 'utf8');

console.log("Starting patch process...");

// 1. Exit Button Patch
const exitTarget = `            <SidebarIcon isDark={isDark} icon={<LogOut size={18} className="text-current" />} onClick={() => { localStorage.removeItem('pos_token'); setIsAuthenticated(false); setUsername(''); setPassword(''); setActiveTab('home'); }} label="Exit" />`;
const exitReplacement = `            <SidebarIcon isDark={isDark} icon={<LogOut size={18} className="text-current" />} onClick={() => { localStorage.removeItem('pos_token'); localStorage.removeItem('pos_profile'); setBusiness(null); setIsAuthenticated(false); setUsername(''); setPassword(''); setActiveTab('home'); }} label="Exit" />`;

if (content.includes(exitTarget)) {
  content = content.replace(exitTarget, exitReplacement);
  console.log("Exit button patch applied successfully!");
} else {
  console.error("ERROR: Exit button target not found!");
}

// 2. Settings Modal Tab Headers Patch
const tabsTarget = `                     {/* Tab Headers */}
                     <div className={\`flex border-b shrink-0 \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar\`}>
                        {[
                           { id: 'general', label: 'General', icon: <Settings size={12} /> },
                           { id: 'outlet', label: 'Outlet Settings', icon: <Store size={12} /> },
                           { id: 'printer', label: 'Printers', icon: <Printer size={12} /> },
                           { id: 'shortcuts', label: 'Shortcuts', icon: <Key size={12} /> },
                           { id: 'formatting', label: 'Formatting', icon: <Sliders size={12} /> },
                           { id: 'profile', label: 'Profile', icon: <User size={12} /> }
                        ].map((tab) => (`;

const tabsReplacement = `                     {/* Tab Headers */}
                     <div className={\`flex border-b shrink-0 \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar\`}>
                        {[
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

// Normalize line endings to LF for matching
const contentLF = content.replace(/\r\n/g, '\n');
const tabsTargetLF = tabsTarget.replace(/\r\n/g, '\n');
const tabsReplacementLF = tabsReplacement.replace(/\r\n/g, '\n');

if (contentLF.includes(tabsTargetLF)) {
  const index = contentLF.indexOf(tabsTargetLF);
  // Find where it ends
  const before = contentLF.substring(0, index);
  const after = contentLF.substring(index + tabsTargetLF.length);
  // Reconstruct using LF (will write out as LF, or we can restore CRLF at end if we want)
  content = before + tabsReplacementLF + after;
  console.log("Settings sub-tabs patch applied successfully!");
} else {
  console.error("ERROR: Settings sub-tabs target not found!");
}

// 3. Settings Page Buttons Grid Patch
const buttonsTarget = `                 <div className="grid grid-cols-3 gap-4">
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
                 </div>`;

const buttonsReplacement = `                 <div className="grid grid-cols-3 gap-4">
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

// Normalize content to LF for button grid matching
const currentContentLF = content.replace(/\r\n/g, '\n');
const buttonsTargetLF = buttonsTarget.replace(/\r\n/g, '\n');
const buttonsReplacementLF = buttonsReplacement.replace(/\r\n/g, '\n');

if (currentContentLF.includes(buttonsTargetLF)) {
  const index = currentContentLF.indexOf(buttonsTargetLF);
  const before = currentContentLF.substring(0, index);
  const after = currentContentLF.substring(index + buttonsTargetLF.length);
  content = before + buttonsReplacementLF + after;
  console.log("Settings page buttons patch applied successfully!");
} else {
  console.error("ERROR: Settings page buttons target not found!");
}

// Convert all back to CRLF before writing back, to maintain original line endings
const finalCRLF = content.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
fs.writeFileSync(filepath, finalCRLF, 'utf8');
console.log("All patches written to file successfully!");
