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
import POS from "./pages/POS";
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
import POSLogin from "./pages/POSLogin";


// ============================================================
// 🎯 LAYOUT SELECTOR — Desktop (Sidebar) vs Mobile (Bottom Tabs)
// ============================================================
const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileLayout /> : <Layout />;
};

// ============================================================
// ROLE-BASED ROUTE GUARD
// ============================================================
const ProtectedShell = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length > 0) {
    if (user.role === 'master_admin') return <AppLayout />;
    
    const hasRole = allowedRoles.some(role => {
       if (role === 'admin' && user.role?.startsWith('admin')) return true;
       return user.role === role;
    });
    if (!hasRole) {
      const defaultPath = user.role === 'master_admin' ? '/master-dashboard' : 
                         (user.role?.startsWith('admin') ? '/admin-dashboard' : '/dashboard');
      return <Navigate to={defaultPath} replace />;
    }
  }
  return <AppLayout />;
};

// Simple guard for POS to open without Layout
const POSGuard = () => {
  const token = localStorage.getItem("pos_token");
  if (!token) return <Navigate to="/pos/login" replace />;
  return <POS />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (No Layout) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu/:bizId/:tableId" element={<CustomerMenu />} />
        <Route path="/order/:bizId" element={<OnlineOrder />} />
        <Route path="/track/:orderRef" element={<TrackOrder />} />
        <Route path="/rider/:riderId" element={<RiderPortal />} />
        <Route path="/pos/login" element={<POSLogin />} />
        <Route path="/pos" element={<POSGuard />} />

        {/* Master Admin Routes */}
        <Route element={<ProtectedShell allowedRoles={['master_admin']} />}>
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/master-dashboard" element={<MasterAdminPanel />} />
            <Route path="/system-health" element={<SystemHealth />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
        </Route>
        
        {/* Shared Admin Routes */}
        <Route element={<ProtectedShell allowedRoles={['admin', 'master_admin']} />}>
            <Route path="/admin-dashboard" element={<AdminPanel />} />
            <Route path="/support-desk" element={<AdminTickets />} />
        </Route>

        {/* User Specific Routes */}
        <Route element={<ProtectedShell allowedRoles={['user']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrderBoard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/chats" element={<LiveChats />} />
            <Route path="/broadcast" element={<BroadcastHub />} />
            <Route path="/recharge" element={<RechargeHub />} />
            <Route path="/crm" element={<CRMDashboard />} />
            <Route path="/reports" element={<Reports />} />
            {/* Removed /pos from here so it doesn't render inside Layout */}
            <Route path="/kds" element={<KDS />} />
            <Route path="/delivery-team" element={<DeliveryTeam />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/mobile-app" element={<AppCenter />} />
            <Route path="/intelligence" element={<IntelligenceHub />} />
            <Route path="/marketing-studio" element={<MarketingStudio />} />
            <Route path="/command-center" element={<CommandCenter />} />
            <Route path="/floor-plan" element={<TableManagement />} />
        </Route>
        
        {/* Shared Restricted Routes */}
        <Route element={<ProtectedShell />}>
            <Route path="/business-data/rules" element={<OperationalRules />} />
            <Route path="/business-data/knowledge" element={<FreeformKnowledge />} />
            <Route path="/business-data/catalog" element={<DigitalCatalog />} />
            <Route path="/business-data/qr" element={<QRManager />} />
            <Route path="/whatsapp-connect" element={<WhatsAppConnect />} />
            <Route path="/bot-config" element={<BotConfig />} />
            <Route path="/setup-business" element={<SetupBusiness />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/support" element={<Support />} />

            <Route path="/mobile-app" element={<AppCenter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;