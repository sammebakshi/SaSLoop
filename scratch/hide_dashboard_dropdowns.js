const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\SaSLoop-dashboard\\src\\pages';
const files = fs.readdirSync(dir);

const DRY_RUN = false; // Set to false to perform the actual file writes

files.forEach(file => {
  if (file.endsWith('Report.jsx')) {
    const filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');
    let modified = false;

    // Skip already modified files
    if (file === 'SalesReport.jsx' || file === 'DSRReport.jsx' || file === 'PaymentReport.jsx') {
      return;
    }

    console.log(`\n-----------------------------------------`);
    console.log(`Processing: ${file}`);

    // 1. Check if it is a dynamic report that fetches outlets and sets the filter
    const setFiltersRegex = /if\s*\(\s*d\.length\s*>\s*0\s*\)\s*setFilters\(\s*prev\s*=>\s*\(\s*\{\s*\.\.\.prev,\s*outlet_id:\s*d\[0\]\.id\s*\}\s*\)\s*\);/g;
    if (setFiltersRegex.test(content)) {
      console.log(`- Found dynamic outlet initialization. Replacing...`);
      content = content.replace(setFiltersRegex, `if (d.length > 0) {
                const targetId = sessionStorage.getItem("impersonate_id");
                const matched = d.find(o => o.id.toString() === targetId?.toString());
                setFilters(prev => ({ ...prev, outlet_id: matched ? matched.id : d[0].id }));
            }`);
      modified = true;
    }

    // 2. Hide the select element parent div in JSX
    // This regex looks for '<div className="..."' followed by label/span for Outlet/Hub and then select with filters.outlet_id
    const selectDivRegex = /(<div\s+className=")([^"]*)("\s*>\s*<(?:label|span)[^>]*>(?:Target\s+)?(?:Operating\s+Hub|Operational\s+Hub|Operating|Outlet\s+Hub|Outlet|Select\s+Outlet)<\/(?:label|span)>\s*<select[^>]*value=\{\s*filters\.outlet_id[^}]*\})/gi;
    
    if (selectDivRegex.test(content)) {
      console.log(`- Found select wrapper div in JSX. Appending 'hidden'...`);
      content = content.replace(selectDivRegex, (match, p1, p2, p3) => {
        if (!p2.includes('hidden')) {
          return `${p1}${p2} hidden${p3}`;
        }
        return match;
      });
      modified = true;
    }

    // Special case for MealTimeSalesReport.jsx separator div
    if (file === 'MealTimeSalesReport.jsx') {
      const sepTarget = '<div className="w-px h-6 bg-slate-200 mx-1" />';
      if (content.includes(sepTarget)) {
        content = content.replace(sepTarget, '<div className="w-px h-6 bg-slate-200 mx-1 hidden" />');
        modified = true;
      }
    }

    // 3. For static report pages: ItemReport, HourlyReport, ExpenseReport, TodaysReport
    // Let's manually hide their Outlet Hub / Operating Hub wrapper div
    if (file === 'ItemReport.jsx') {
      // Hide Outlet Hub
      const target = `<div className="space-y-1.5">\n                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Outlet Hub</label>\n                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all">\n                            <option>All Outlets</option>\n                        </select>\n                    </div>`;
      if (content.includes(target)) {
        content = content.replace(target, `<div className="space-y-1.5 hidden">\n                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Outlet Hub</label>\n                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all">\n                            <option>All Outlets</option>\n                        </select>\n                    </div>`);
        content = content.replace('md:grid-cols-5', 'md:grid-cols-4');
        modified = true;
      }
    }

    if (file === 'HourlyReport.jsx') {
      // Hide Outlet Hub
      const target = `<div className="space-y-1.5">\n                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Outlet Hub</label>\n                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all">\n                            <option>All Outlets</option>\n                        </select>\n                    </div>`;
      if (content.includes(target)) {
        content = content.replace(target, `<div className="space-y-1.5 hidden">\n                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Outlet Hub</label>\n                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all">\n                            <option>All Outlets</option>\n                        </select>\n                    </div>`);
        content = content.replace('md:grid-cols-4', 'md:grid-cols-3');
        modified = true;
      }
    }

    if (file === 'ExpenseReport.jsx') {
      // Hide Target Operating Hub
      const target = `<div className="space-y-1">\n                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Target Operating Hub</label>\n                        <select className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none focus:border-rose-500 transition-all cursor-pointer">\n                            <option className="text-slate-900">All Target Hubs</option>\n                        </select>\n                    </div>`;
      if (content.includes(target)) {
        content = content.replace(target, `<div className="space-y-1 hidden">\n                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Target Operating Hub</label>\n                        <select className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none focus:border-rose-500 transition-all cursor-pointer">\n                            <option className="text-slate-900">All Target Hubs</option>\n                        </select>\n                    </div>`);
        content = content.replace('md:grid-cols-4', 'md:grid-cols-3');
        modified = true;
      }
    }

    if (file === 'TodaysReport.jsx') {
      // Hide Target Operating Hub
      const target = `<div className="space-y-1.5">\n                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>\n                            <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-rose-500 transition-all cursor-pointer">\n                                <option>All Target Hubs</option>\n                            </select>\n                        </div>`;
      if (content.includes(target)) {
        content = content.replace(target, `<div className="space-y-1.5 hidden">\n                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>\n                            <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-rose-500 transition-all cursor-pointer">\n                                <option>All Target Hubs</option>\n                            </select>\n                        </div>`);
        content = content.replace('md:grid-cols-4', 'md:grid-cols-3');
        modified = true;
      }
    }

    // 4. Grid column adjustments for files where we appended 'hidden' to col-span-3 (e.g. ZATCAReport.jsx, UPITransactionReport.jsx, PhonePeTrxReport.jsx, OrderTransitionReport.jsx, LogisticReport.jsx, BharatPeTrxReport.jsx)
    if (['ZATCAReport.jsx', 'PhonePeTrxReport.jsx', 'OrderTransitionReport.jsx', 'LogisticReport.jsx', 'BharatPeTrxReport.jsx'].includes(file)) {
      // These files have: grid-cols-1 md:grid-cols-4, with the hidden select wrapper having col-span-3.
      // If we hide the select wrapper, only the button is left.
      // We should change md:grid-cols-4 to md:grid-cols-1 or change the parent layout to not be a sparse grid.
      // For simplicity, changing the parent grid class to md:grid-cols-1 lets the button align nicely.
      content = content.replace('md:grid-cols-4 gap-6 items-end', 'md:grid-cols-1 gap-6 items-end justify-items-end');
      modified = true;
    }
    
    if (file === 'UPITransactionReport.jsx') {
      // UPITransactionReport has two grids. The first grid has Target Operating Hub (1 col), Temporal Audit Window (2 cols), and button (1 col).
      // If we hide Target Operating Hub, we change md:grid-cols-4 to md:grid-cols-3.
      content = content.replace('grid-cols-1 md:grid-cols-4 gap-6 items-end', 'grid-cols-1 md:grid-cols-3 gap-6 items-end');
      modified = true;
    }

    if (file === 'CategoryReport.jsx' || file === 'DiscountReport.jsx' || file === 'KitchenDepartmentReport.jsx' || file === 'OrderTypeReport.jsx' || file === 'WaiterIncentiveReport.jsx' || file === 'AppliedChargesReport.jsx') {
      // These have: grid-cols-1 md:grid-cols-4, with 4 items: Operating Hub, Temporal Range/Date (2 cols), button.
      // If we hide Operating Hub, we change md:grid-cols-4 to md:grid-cols-3.
      content = content.replace('grid-cols-1 md:grid-cols-4 gap-6 items-end', 'grid-cols-1 md:grid-cols-3 gap-6 items-end');
      modified = true;
    }

    if (file === 'StartCloseDayReport.jsx' || file === 'ShiftWiseReport.jsx' || file === 'PasscodeUserReport.jsx' || file === 'DuePaymentReport.jsx' || file === 'CouponHistoryReport.jsx' || file === 'DayWiseSummaryReport.jsx') {
      // These have: Target Operating Hub, Temporal Range (2 cols), button.
      // If we hide Target Operating Hub, change grid-cols-4 to grid-cols-3.
      content = content.replace('grid-cols-1 md:grid-cols-4 gap-6 items-end', 'grid-cols-1 md:grid-cols-3 gap-6 items-end');
      modified = true;
    }

    if (modified && !DRY_RUN) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`[SUCCESS] Wrote modifications to ${file}`);
    } else if (modified) {
      console.log(`[DRY RUN] Would write modifications to ${file}`);
    } else {
      console.log(`[NO CHANGES] No targets matched in ${file}`);
    }
  }
});
