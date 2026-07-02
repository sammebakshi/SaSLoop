const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

function replaceExact(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Replaced: ${label}`);
  } else {
    console.error(`[FAILED] Target not found for: ${label}`);
  }
}

// 1. Inject handleOpenSplitBill and handleOpenOldKOT
const findTabClickEnd = `    callback();
  };

  const getFilteredSettingsTabs = () => {`;

const replaceTabClickEnd = `    callback();
  };

  const handleOpenSplitBill = () => {
     if (!checkSplitBillPermission('visible')) {
        toast.error("Split Bill is restricted.");
        return;
     }
     if (!checkSplitBillPasscode('visible', "Enter Manager PIN to open Split Bill:")) {
        return;
     }
     setIsSplitModalOpen(true);
  };

  const handleOpenOldKOT = () => {
     const access = getStaffPermissions()?.pos_access;
     let allowed = true;
     if (orderType === 'DELIVERY') {
        allowed = access?.Delivery?.OldKOT?.visible !== false;
     } else if (orderType === 'PICKUP') {
        allowed = access?.Pickup?.OldKOT?.visible !== false;
     } else if (orderType === 'PRE_ORDER') {
        allowed = access?.PreOrder?.OldKOT?.visible !== false;
     } else {
        allowed = access?.OldKOT?.visible !== false;
     }
     if (!allowed) {
        toast.error("Old KOT is restricted.");
        return;
     }

     if (!checkOldKOTPasscode('visible', "Enter Manager PIN to access Old KOT modal:")) {
        return;
     }

     setSelectedOldKOTItems({});
     setOldKOTItemReasons({});
     setSelectAllOldKOT(false);
     setIsOldKOTModalOpen(true);
  };

  const getFilteredSettingsTabs = () => {`;

replaceExact(findTabClickEnd, replaceTabClickEnd, 'Open Modal Handlers Inject');

// 2. Replace button clicks in Dine In
const findDineInButtons = `                              <button
                                onClick={() => {
                                  setSelectedOldKOTItems({});
                                  setOldKOTItemReasons({});
                                  setSelectAllOldKOT(false);
                                  setIsOldKOTModalOpen(true);
                                }}
                                className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                              >
                                Old KOT
                              </button>
                              <button onClick={() => setIsSplitModalOpen(true)} className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10">
                                Split Bill
                              </button>`;

const replaceDineInButtons = `                              <button
                                onClick={handleOpenOldKOT}
                                className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                              >
                                Old KOT
                              </button>
                              <button onClick={handleOpenSplitBill} className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10">
                                Split Bill
                              </button>`;

replaceExact(findDineInButtons, replaceDineInButtons, 'Dine In Buttons onClick Replace');

// 3. Replace button clicks in Pickup
const findPickupButtons = `                                <button
                                  onClick={() => {
                                    setSelectedOldKOTItems({});
                                    setOldKOTItemReasons({});
                                    setSelectAllOldKOT(false);
                                    setIsOldKOTModalOpen(true);
                                  }}
                                  className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                                >
                                  Old KOT
                                </button>
                                <button
                                  onClick={() => setIsSplitModalOpen(true)}
                                  className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                                >
                                  Split Bill
                                </button>`;

const replacePickupButtons = `                                <button
                                  onClick={handleOpenOldKOT}
                                  className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                                >
                                  Old KOT
                                </button>
                                <button
                                  onClick={handleOpenSplitBill}
                                  className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                                >
                                  Split Bill
                                </button>`;

replaceExact(findPickupButtons, replacePickupButtons, 'Pickup Buttons onClick Replace');

// 4. Replace button clicks in Quick
const findQuickButtons = `                                <button
                                  onClick={() => {
                                    setSelectedOldKOTItems({});
                                    setOldKOTItemReasons({});
                                    setSelectAllOldKOT(false);
                                    setIsOldKOTModalOpen(true);
                                  }}
                                  className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                                >
                                  Old KOT
                                </button>
                                <button
                                  onClick={() => setIsSplitModalOpen(true)}
                                  className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                                >
                                  Split Bill
                                </button>`;

const replaceQuickButtons = `                                <button
                                  onClick={handleOpenOldKOT}
                                  className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                                >
                                  Old KOT
                                </button>
                                <button
                                  onClick={handleOpenSplitBill}
                                  className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                                >
                                  Split Bill
                                </button>`;

replaceExact(findQuickButtons, replaceQuickButtons, 'Quick Buttons onClick Replace');

// 5. Replace button clicks in PreOrder
const findPreOrderButtons = `                              <button
                                onClick={() => {
                                  setSelectedOldKOTItems({});
                                  setOldKOTItemReasons({});
                                  setSelectAllOldKOT(false);
                                  setIsOldKOTModalOpen(true);
                                }}
                                className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                              >
                                Old KOT
                              </button>
                              <button
                                onClick={() => setIsSplitModalOpen(true)}
                                className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                              >
                                Split Bill
                              </button>`;

const replacePreOrderButtons = `                              <button
                                onClick={handleOpenOldKOT}
                                className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                              >
                                Old KOT
                              </button>
                              <button
                                onClick={handleOpenSplitBill}
                                className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
                              >
                                Split Bill
                              </button>`;

replaceExact(findPreOrderButtons, replacePreOrderButtons, 'PreOrder Buttons onClick Replace');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Modal gating script completed!');
