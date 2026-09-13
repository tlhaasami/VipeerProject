import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/NotificationToast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { Login } from './pages/Login';
import { LoginError } from './pages/LoginError';
import { CoordinatorDashboard } from './pages/coordinator/CoordinatorDashboard';
import { ManageUsers } from './pages/coordinator/ManageUsers';
import { ManageRequests } from './pages/coordinator/ManageRequests';
import { ManageCustomers } from './pages/coordinator/ManageCustomers';
import { ManageItems } from './pages/coordinator/ManageItems';
import { ManageSuppliers } from './pages/coordinator/ManageSuppliers';
import { AnalyticsReports } from './pages/coordinator/AnalyticsReports';
import { AuditCompliance } from './pages/coordinator/AuditCompliance';
import { LogisticsDispatch } from './pages/coordinator/LogisticsDispatch';
import { SlaContracts } from './pages/coordinator/SlaContracts';
import { SupplierDashboard } from './pages/supplier/SupplierDashboard';
import { SupplierRequests } from './pages/supplier/SupplierRequests';
import { SupplierNotifications } from './pages/supplier/SupplierNotifications';
import { SupplierSchedule } from './pages/supplier/SupplierSchedule';
import { SupplierHistory } from './pages/supplier/SupplierHistory';
import { SupplierWarehouse } from './pages/supplier/SupplierWarehouse';
import { SupplierSlaTerms } from './pages/supplier/SupplierSlaTerms';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerAccount } from './pages/customer/CustomerAccount';
import { CustomerHistory } from './pages/customer/CustomerHistory';
import { BrowseCatalog } from './pages/customer/BrowseCatalog';
import { OrderTracking } from './pages/customer/OrderTracking';
import { NotFound404 } from './pages/NotFound404';

const MainLayout = () => {
  const { isAuthenticated, domain } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [loginErrorState, setLoginErrorState] = useState(null);

  // If not authenticated
  if (!isAuthenticated) {
    if (loginErrorState) {
      return (
        <LoginError
          errorReason={loginErrorState.reason}
          attemptedDomain={loginErrorState.domain}
          onTryAgain={() => setLoginErrorState(null)}
        />
      );
    }
    return (
      <Login
        onLoginError={(reason, attemptedDomain) =>
          setLoginErrorState({ reason, domain: attemptedDomain })
        }
      />
    );
  }

  // Render view based on domain and currentView
  const renderViewContent = () => {
    if (currentView === '404') {
      return <NotFound404 onGoHome={() => setCurrentView('dashboard')} />;
    }

    if (domain === 'coordinator') {
      switch (currentView) {
        case 'users':
          return <ManageUsers />;
        case 'requests':
          return <ManageRequests />;
        case 'customers':
          return <ManageCustomers />;
        case 'items':
          return <ManageItems />;
        case 'suppliers':
          return <ManageSuppliers />;
        case 'analytics':
          return <AnalyticsReports />;
        case 'audit':
          return <AuditCompliance />;
        case 'dispatch':
          return <LogisticsDispatch />;
        case 'contracts':
          return <SlaContracts />;
        case 'dashboard':
        default:
          return <CoordinatorDashboard onNavigate={setCurrentView} />;
      }
    } else if (domain === 'supplier') {
      switch (currentView) {
        case 'requests':
          return <SupplierRequests />;
        case 'schedule':
          return <SupplierSchedule />;
        case 'notifications':
          return <SupplierNotifications />;
        case 'history':
          return <SupplierHistory />;
        case 'inventory':
          return <SupplierWarehouse />;
        case 'compliance':
          return <SupplierSlaTerms />;
        case 'dashboard':
        default:
          return <SupplierDashboard onNavigate={setCurrentView} />;
      }
    } else if (domain === 'customer') {
      switch (currentView) {
        case 'account':
          return <CustomerAccount />;
        case 'history':
          return <CustomerHistory />;
        case 'catalog':
          return <BrowseCatalog onSelectProduct={() => setCurrentView('dashboard')} />;
        case 'tracking':
          return <OrderTracking />;
        case 'new-request':
        case 'dashboard':
        default:
          return <CustomerDashboard />;
      }
    }
    return <CoordinatorDashboard onNavigate={setCurrentView} />;
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-[#EEEAD7] text-[#2D0000] flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex overflow-hidden min-h-0">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8 bg-[#EEEAD7]">
          <div className="max-w-7xl mx-auto pb-12">
            {renderViewContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
