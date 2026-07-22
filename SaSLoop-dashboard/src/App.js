import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isMobileDevice } from "./config";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import MasterAdminPanel from "./pages/MasterAdminPanel";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import Layout from "./components/Layout";
import MobileLayout from "./components/MobileLayout";
import AppCenter from "./pages/AppCenter";
import SetupBusiness from "./pages/SetupBusiness";
import OrderBoard from "./pages/OrderBoard";
import AuditLogs from "./pages/AuditLogs";
import Support from "./pages/Support";
import AdminTickets from "./pages/AdminTickets";
import RechargeHub from "./pages/RechargeHub";
import CRMDashboard from "./pages/CRMDashboard";
import SystemHealth from "./pages/SystemHealth";
import WhatsAppConnect from "./pages/WhatsAppConnect";
import BotConfig from "./pages/BotConfig";
import BroadcastHub from "./pages/BroadcastHub";
import LiveChats from "./pages/LiveChats";
import OperationalRules from "./pages/OperationalRules";
import FreeformKnowledge from "./pages/FreeformKnowledge";
import DigitalCatalog from "./pages/DigitalCatalog";
import CustomerMenu from "./pages/CustomerMenu";
import QRManager from "./pages/QRManager";
import Reports from "./pages/Reports";
import OnlineOrder from "./pages/OnlineOrder";
import KDS from "./pages/KDS";
import TrackOrder from "./pages/TrackOrder";
import Reservations from "./pages/Reservations";
import DeliveryTeam from "./pages/DeliveryTeam";
import RiderPortal from "./pages/RiderPortal";
import ExpenseTracker from "./pages/ExpenseTracker";
import StaffManagement from "./pages/StaffManagement";
import Integrations from "./pages/Integrations";
import IntelligenceHub from "./pages/IntelligenceHub";
import MarketingStudio from "./pages/MarketingStudio";
import CommandCenter from "./pages/CommandCenter";
import TableManagement from "./pages/TableManagement";
import InventoryMaster from "./pages/InventoryMaster";
import RecipeMaster from "./pages/RecipeMaster";
import BusinessIdentity from "./pages/BusinessIdentity";
import DebugPage from "./pages/DebugPage";
import ProfitLossHub from "./pages/ProfitLossHub";
import CentralizedOrderingHub from "./pages/CentralizedOrderingHub";
import MarketManager from "./pages/MarketManager";
import BrandManager from "./pages/BrandManager";
import OutletManager from "./pages/OutletManager";
import ClusterManager from "./pages/ClusterManager";
import DesignationManager from "./pages/DesignationManager";
import OutletUserManager from "./pages/OutletUserManager";
import OutletPaymentManager from "./pages/OutletPaymentManager";
import StoreAccessManager from "./pages/StoreAccessManager";
import POSAccessManager from "./pages/POSAccessManager";
import MPOSAccessManager from "./pages/MPOSAccessManager";
import OrderTypeManager from "./pages/OrderTypeManager";
import OrderTypeGLManager from "./pages/OrderTypeGLManager";
import TaxProductGroupManager from "./pages/TaxProductGroupManager";
import TaxConfigurationManager from "./pages/TaxConfigurationManager";
import KitchenDepartmentManager from "./pages/KitchenDepartmentManager";
import TableDepartmentManager from "./pages/TableDepartmentManager";
import TableManager from "./pages/TableManager";
import DiscountManager from "./pages/DiscountManager";
import CustomDiscountManager from "./pages/CustomDiscountManager";
import AdditionalChargeManager from "./pages/AdditionalChargeManager";
import OutletMenuManager from "./pages/OutletMenuManager";
import MenuDesigner from "./pages/MenuDesigner";
import BulkUploadManager from "./pages/BulkUploadManager";
import MasterMenuManager from "./pages/MasterMenuManager";
import OptionGroupManager from "./pages/OptionGroupManager";
import ModifierGroupManager from "./pages/ModifierGroupManager";
import CategoryManager from "./pages/CategoryManager";
import ItemNoteManager from "./pages/ItemNoteManager";
import NutritionManager from "./pages/NutritionManager";
import MultiplePricing from "./pages/MultiplePricing";
import OnlineOrderHub from "./pages/OnlineOrderHub";
import DigitalOrderSettings from "./pages/DigitalOrderSettings";
import PreOrderSettings from "./pages/PreOrderSettings";
import DeliveryPlatformManager from "./pages/DeliveryPlatformManager";
import SalesReport from "./pages/SalesReport";
import DSRReport from "./pages/DSRReport";
import TodaysReport from "./pages/TodaysReport";
import ItemReport from "./pages/ItemReport";
import MealTimeSalesReport from "./pages/MealTimeSalesReport";
import HourlyReport from "./pages/HourlyReport";
import WaiterIncentiveReport from "./pages/WaiterIncentiveReport";
import PaymentReport from "./pages/PaymentReport";
import ExpenseTrackingReport from "./pages/ExpenseTrackingReport";
import OrderTypeReport from "./pages/OrderTypeReport";
import CategoryReport from "./pages/CategoryReport";
import KitchenDepartmentReport from "./pages/KitchenDepartmentReport";
import CouponHistoryReport from "./pages/CouponHistoryReport";
import DuePaymentReport from "./pages/DuePaymentReport";
import StartCloseDayReport from "./pages/StartCloseDayReport";
import ShiftWiseReport from "./pages/ShiftWiseReport";
import DiscountReport from "./pages/DiscountReport";
import BillerWiseSummary from "./pages/BillerWiseSummary";
import DeliveryReport from "./pages/DeliveryReport";
import DayWiseSummaryReport from "./pages/DayWiseSummaryReport";
import CustomerQueries from "./pages/CustomerQueries";
import BillPrintReport from "./pages/BillPrintReport";
import AppliedChargesReport from "./pages/AppliedChargesReport";
import PasscodeUserReport from "./pages/PasscodeUserReport";
import OrderSyncHistory from "./pages/OrderSyncHistory";
import ZATCAReport from "./pages/ZATCAReport";
import LogisticReport from "./pages/LogisticReport";
import OrderTransitionReport from "./pages/OrderTransitionReport";
import ERPSyncHistory from "./pages/ERPSyncHistory";
import JordanHistory from "./pages/JordanHistory";
import UPITransactionReport from "./pages/UPITransactionReport";
import BharatPeTrxReport from "./pages/BharatPeTrxReport";
import PhonePeTrxReport from "./pages/PhonePeTrxReport";
import CustomerDirectory from "./pages/CustomerDirectory";
import CustomerManagement from "./pages/CustomerManagement";
import CRMSettings from "./pages/CRMSettings";
import CustomerHistory from "./pages/CustomerHistory";
import CouponCodeManager from "./pages/CouponCodeManager";
import CouponUsageHistory from "./pages/CouponUsageHistory";
import CustomerWallet from "./pages/CustomerWallet";
import WarehouseManager from "./pages/WarehouseManager";
import RawMaterialGroup from "./pages/RawMaterialGroup";
import RawMaterialTax from "./pages/RawMaterialTax";
import RawMaterialItems from "./pages/RawMaterialItems";
import VendorManager from "./pages/VendorManager";
import VendorPayments from "./pages/VendorPayments";
import ManualStockManager from "./pages/ManualStockManager";
import WhatsAppDashboard from "./pages/WhatsAppDashboard";
import WhatsAppTemplates from "./pages/WhatsAppTemplates";
import WhatsAppCampaigns from "./pages/WhatsAppCampaigns";
import WhatsAppChat from "./pages/WhatsAppChat";
import WhatsAppOrgs from "./pages/WhatsAppOrgs";
import WhatsAppChatFlow from "./pages/WhatsAppChatFlow";
import WhatsAppCRM from "./pages/WhatsAppCRM";
import WhatsAppAnalytics from "./pages/WhatsAppAnalytics";
import RMCategory from "./pages/RMCategory";
import RMUnits from "./pages/RMUnits";
import ManualStockOut from "./pages/ManualStockOut";
import CRMCampaigns from "./pages/CRMCampaigns";
import Profile from "./pages/Profile";
import LoyaltySettings from "./pages/LoyaltySettings";
import NotificationSettings from "./pages/NotificationSettings";



// ============================================================
// 🎯 LAYOUT SELECTOR — Desktop (Sidebar) vs Mobile (Bottom Tabs)
// ============================================================
const AppLayout = () => {
  const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
  const [layoutMode, setLayoutMode] = useState(() => {
    const saved = localStorage.getItem("preferred_layout_mode");
    if (saved) return saved;
    return isCapacitor ? "mobile" : "desktop";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("preferred_layout_mode");
      if (saved) {
        setLayoutMode(saved);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    const handleSwitch = (e) => {
      setLayoutMode(e.detail);
    };
    window.addEventListener("switchLayoutMode", handleSwitch);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("switchLayoutMode", handleSwitch);
    };
  }, []);

  return layoutMode === "mobile" ? <MobileLayout /> : <Layout />;
};

// ============================================================
// ROLE-BASED ROUTE GUARD
// ============================================================
const ProtectedShell = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" replace />;

  // 🛡️ Guard against infinite redirect loops
  const redirectCount = parseInt(sessionStorage.getItem("redirect_count") || "0");
  if (redirectCount > 5) {
      console.error("🚨 Redirect loop detected. Clearing session.");
      sessionStorage.clear();
      return <div className="p-20 text-center font-bold">Session Error: Too many redirects. Please login again.</div>;
  }

  const role = (user.role || "").toLowerCase().trim().replace(/[\s-]/g, '_');

  // 🛡️ High-level roles bypass explicit role checks for general shell access
  if (role === 'master_admin' || role === 'brand_owner' || role.includes('owner')) return <AppLayout />;

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(r => {
       if (r === 'admin' && role?.startsWith('admin')) return true;
       return role === r.toLowerCase();
    });

    if (!hasRole) {
      const defaultPath = (role?.startsWith('admin') || role === 'brand_owner') ? '/admin-dashboard' : '/dashboard';
      
      // 🛡️ Ensure defaultPath is authorized for this role to prevent infinite redirect loops
      const isAllowedOnDefault = 
        (defaultPath === '/admin-dashboard' && (role?.startsWith('admin') || role === 'brand_owner' || role === 'master_admin')) ||
        (defaultPath === '/dashboard' && (role === 'user' || role?.startsWith('admin') || role === 'brand_owner' || role === 'master_admin'));

      if (!isAllowedOnDefault) {
        console.error("🚨 Role unauthorized for all dashboard interfaces. Clearing session.");
        localStorage.clear();
        sessionStorage.clear();
        return <Navigate to="/login?error=unauthorized_role" replace />;
      }

      sessionStorage.setItem("redirect_count", (redirectCount + 1).toString());
      return <Navigate to={defaultPath} replace />;
    }
  }
  sessionStorage.removeItem("redirect_count");
  return <AppLayout />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (No Layout) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu/:bizId" element={<CustomerMenu />} />
        <Route path="/menu/:bizId/:tableId" element={<CustomerMenu />} />
        <Route path="/:bizId" element={<CustomerMenu />} />
        <Route path="/:bizId/:tableId" element={<CustomerMenu />} />
        <Route path="/order/:bizId" element={<OnlineOrder />} />
        <Route path="/track/:orderRef" element={<TrackOrder />} />
        <Route path="/rider/:riderId" element={<RiderPortal />} />

        {/* Master Admin Routes */}
        <Route element={<ProtectedShell allowedRoles={['master_admin']} />}>
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/master-dashboard" element={<MasterAdminPanel />} />
            <Route path="/system-health" element={<SystemHealth />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
        </Route>
        
        {/* Shared Admin Routes */}
        <Route element={<ProtectedShell allowedRoles={['admin', 'master_admin', 'brand_owner']} />}>
            <Route path="/admin-dashboard" element={<AdminPanel />} />
            <Route path="/master-dashboard" element={<MasterAdminPanel />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/system-health" element={<SystemHealth />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/support-desk" element={<AdminTickets />} />
        </Route>

        {/* User Specific Routes */}
        <Route element={<ProtectedShell allowedRoles={['user', 'admin', 'brand_owner']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrderBoard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/chats" element={<LiveChats />} />
            <Route path="/broadcast" element={<BroadcastHub />} />
            <Route path="/recharge" element={<RechargeHub />} />
            <Route path="/crm" element={<CRMDashboard />} />
            <Route path="/customer-management" element={<CustomerManagement />} />
            <Route path="/whatsapp-marketing/dashboard" element={<WhatsAppDashboard />} />
            <Route path="/whatsapp-marketing/templates" element={<WhatsAppTemplates />} />
            <Route path="/whatsapp-marketing/campaigns" element={<WhatsAppCampaigns />} />
            <Route path="/whatsapp-marketing/messages" element={<WhatsAppChat />} />
            <Route path="/whatsapp-marketing/organizations" element={<WhatsAppOrgs />} />
            <Route path="/whatsapp-marketing/chat-flow" element={<WhatsAppChatFlow />} />
            <Route path="/whatsapp-marketing/crm" element={<WhatsAppCRM />} />
            <Route path="/whatsapp-marketing/analytics" element={<WhatsAppAnalytics />} />
            <Route path="/reports" element={<Reports />} />
            {/* Removed /pos from here so it doesn't render inside Layout */}
            <Route path="/kds" element={<KDS />} />
            <Route path="/delivery-team" element={<DeliveryTeam />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="/staff" element={<OutletUserManager />} />

            <Route path="/mobile-app" element={<AppCenter />} />
            <Route path="/intelligence" element={<IntelligenceHub />} />
            <Route path="/marketing-studio" element={<MarketingStudio />} />
            <Route path="/command-center" element={<CommandCenter />} />
            <Route path="/floor-plan" element={<TableManagement />} />
        </Route>
        
        {/* Shared Restricted Routes */}
        <Route element={<ProtectedShell />}>
            {/* System Governance */}
            <Route path="/business-data/rules" element={<OperationalRules />} />
            <Route path="/business-data/knowledge" element={<FreeformKnowledge />} />
            <Route path="/business-identity" element={<BusinessIdentity />} />
            <Route path="/tax-product-group" element={<TaxProductGroupManager />} />
            <Route path="/setup-business" element={<SetupBusiness />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/loyalty-settings" element={<LoyaltySettings />} />
            <Route path="/notification-settings" element={<NotificationSettings />} />

            {/* Product & Operations */}
            <Route path="/business-data/catalog" element={<DigitalCatalog />} />
            <Route path="/business-data/inventory" element={<InventoryMaster />} />
            <Route path="/business-data/recipes" element={<RecipeMaster />} />
            <Route path="/outlet-menus" element={<OutletMenuManager />} />
            <Route path="/outlet-menus/:id/design" element={<MenuDesigner />} />
            <Route path="/outlet-menus/bulk-upload" element={<BulkUploadManager />} />
            <Route path="/multiple-pricing" element={<MultiplePricing />} />
            <Route path="/master-menu" element={<MasterMenuManager />} />
            <Route path="/categories" element={<CategoryManager />} />
            <Route path="/modifier-groups" element={<ModifierGroupManager />} />
            <Route path="/option-groups" element={<OptionGroupManager />} />
            <Route path="/item-notes" element={<ItemNoteManager />} />
            
            {/* Infrastructure */}
            <Route path="/outlets-list" element={<OutletManager />} />
            <Route path="/brands" element={<BrandManager />} />
            <Route path="/clusters" element={<ClusterManager />} />
            <Route path="/outlet-payments" element={<OutletPaymentManager />} />
            <Route path="/order-types" element={<OrderTypeManager />} />
            <Route path="/gl-mappings" element={<OrderTypeGLManager />} />
            <Route path="/tax-config" element={<TaxConfigurationManager />} />
            <Route path="/kitchen-department" element={<KitchenDepartmentManager />} />
            <Route path="/table-department" element={<TableDepartmentManager />} />
            <Route path="/table-management" element={<TableManager />} />
            <Route path="/discount-manager" element={<DiscountManager />} />
            <Route path="/additional-charges" element={<AdditionalChargeManager />} />
            
            {/* Human Capital */}
            <Route path="/staff" element={<OutletUserManager />} />
            <Route path="/designations" element={<DesignationManager />} />
            <Route path="/outlet-users" element={<OutletUserManager />} />
            <Route path="/admin/store/access/:userId" element={<StoreAccessManager />} />
            <Route path="/admin/pos/access/:userId" element={<POSAccessManager />} />
            <Route path="/admin/outlets-users/app/:userId" element={<MPOSAccessManager />} />

            {/* Growth & Channels */}
            <Route path="/online-orders" element={<OnlineOrderHub />} />
            <Route path="/delivery-platforms" element={<DeliveryPlatformManager />} />
            <Route path="/digital-order-settings" element={<DigitalOrderSettings />} />
            <Route path="/pre-order-settings" element={<PreOrderSettings />} />
            <Route path="/centralized-hub" element={<CentralizedOrderingHub />} />
            <Route path="/whatsapp-connect" element={<WhatsAppConnect />} />
            <Route path="/bot-config" element={<BotConfig />} />
            
            {/* Analytics & Reports */}
            <Route path="/analytics/sales-report" element={<SalesReport />} />
            <Route path="/analytics/dsr-report" element={<DSRReport />} />
            <Route path="/analytics/todays-report" element={<TodaysReport />} />
            <Route path="/analytics/item-report" element={<ItemReport />} />
            <Route path="/analytics/meal-time-sales" element={<MealTimeSalesReport />} />
            <Route path="/analytics/hourly-report" element={<HourlyReport />} />
            <Route path="/analytics/waiter-incentive" element={<WaiterIncentiveReport />} />
            <Route path="/analytics/payment-report" element={<PaymentReport />} />
            <Route path="/analytics/expense-report" element={<ExpenseTrackingReport />} />
            <Route path="/analytics/order-type" element={<OrderTypeReport />} />
            <Route path="/analytics/category-report" element={<CategoryReport />} />
            <Route path="/analytics/kitchen-dept" element={<KitchenDepartmentReport />} />
            <Route path="/analytics/coupon-history" element={<CouponHistoryReport />} />
            <Route path="/analytics/due-payment" element={<DuePaymentReport />} />
            <Route path="/analytics/start-close-day" element={<StartCloseDayReport />} />
            <Route path="/analytics/shift-wise" element={<ShiftWiseReport />} />
            <Route path="/analytics/discount-report" element={<DiscountReport />} />
            <Route path="/analytics/biller-wise" element={<BillerWiseSummary />} />
            <Route path="/analytics/delivery-report" element={<DeliveryReport />} />
            <Route path="/analytics/day-wise" element={<DayWiseSummaryReport />} />
            <Route path="/analytics/customer-queries" element={<CustomerQueries />} />
            <Route path="/analytics/bill-print" element={<BillPrintReport />} />
            <Route path="/analytics/applied-charges" element={<AppliedChargesReport />} />
            <Route path="/analytics/passcode-user" element={<PasscodeUserReport />} />
            <Route path="/analytics/order-sync" element={<OrderSyncHistory />} />
            <Route path="/analytics/zatca-report" element={<ZATCAReport />} />
            <Route path="/analytics/logistic-report" element={<LogisticReport />} />
            <Route path="/analytics/order-transition" element={<OrderTransitionReport />} />
            <Route path="/analytics/erp-sync" element={<ERPSyncHistory />} />
            <Route path="/analytics/jordan-history" element={<JordanHistory />} />
            <Route path="/analytics/upi-report" element={<UPITransactionReport />} />

            {/* Sub-Modules */}
            <Route path="/business-data/qr" element={<QRManager />} />
            <Route path="/inventory/locations" element={<WarehouseManager />} />
            <Route path="/inventory/rm-category" element={<RMCategory />} />
            <Route path="/inventory/rm-units" element={<RMUnits />} />
            <Route path="/inventory/rm-items" element={<RawMaterialItems />} />
            <Route path="/inventory/vendors" element={<VendorManager />} />
            <Route path="/inventory/manual-stock-entry" element={<ManualStockManager />} />
            <Route path="/inventory/manual-stock-out" element={<ManualStockOut />} />
            <Route path="/option-groups" element={<OptionGroupManager />} />
            <Route path="/modifier-groups" element={<ModifierGroupManager />} />
            <Route path="/item-notes" element={<ItemNoteManager />} />
            <Route path="/nutrition" element={<NutritionManager />} />
        </Route>

        
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;