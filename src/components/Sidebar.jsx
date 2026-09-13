import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
  Bell,
  PlusCircle,
  Building2,
  Truck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  ShieldCheck,
  Calendar,
  History,
  FileText,
  Navigation,
  FileCheck,
  Boxes
} from 'lucide-react';

export const Sidebar = ({ currentView, onNavigate }) => {
  const { currentUser, domain, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuItems = () => {
    switch (domain) {
      case 'coordinator':
        return [
          { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'requests', label: 'Supply Requests', icon: ClipboardList },
          { id: 'customers', label: 'Client Directory', icon: Users },
          { id: 'items', label: 'Product Catalog', icon: Package },
          { id: 'suppliers', label: 'Supplier Network', icon: Truck },
          { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
          { id: 'audit', label: 'Security Audit Trail', icon: ShieldCheck },
          { id: 'dispatch', label: 'Logistics & Dispatch', icon: Navigation },
          { id: 'contracts', label: 'SLA & Contracts', icon: FileCheck }
        ];
      case 'supplier':
        return [
          { id: 'dashboard', label: 'Supplier Overview', icon: LayoutDashboard },
          { id: 'requests', label: 'Supply Requests', icon: ClipboardList },
          { id: 'schedule', label: 'Delivery Schedule', icon: Calendar },
          { id: 'notifications', label: 'Alerts & Updates', icon: Bell },
          { id: 'history', label: 'Fulfillment History', icon: History },
          { id: 'inventory', label: 'Staging & Warehouse', icon: Boxes },
          { id: 'compliance', label: 'Partner SLA Terms', icon: ShieldCheck }
        ];
      case 'customer':
        return [
          { id: 'dashboard', label: 'My Supply Requests', icon: ClipboardList },
          { id: 'new-request', label: 'Submit New Request', icon: PlusCircle },
          { id: 'account', label: 'Corporate Account', icon: Building2 },
          { id: 'history', label: 'Invoices & Archives', icon: FileText },
          { id: 'catalog', label: 'Browse IT Catalog', icon: Package },
          { id: 'tracking', label: 'Order Tracking', icon: Truck }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-[#D8D2BC] shrink-0 h-full shadow-sm transition-all duration-300 relative z-30 flex flex-col`}
    >
      {/* Floating Border Edge Toggle Arrow Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-6 z-50 w-7 h-7 rounded-full bg-[#2D0000] hover:bg-[#6D0808] text-[#EEEAD7] border-2 border-white shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-[#EEEAD7]" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-[#EEEAD7]" />
        )}
      </button>

      {/* Inner Scrollable Menu Area */}
      <div className="h-full w-full flex flex-col justify-between p-3.5 overflow-y-auto overflow-x-hidden">
        {/* Top Section */}
        <div className="space-y-4">
          {/* Simple Clean Heading */}
          {!isCollapsed ? (
            <div className="flex items-center space-x-2.5 px-2 py-1">
              <div className="w-7 h-7 rounded-lg bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center shrink-0">
                {domain === 'coordinator' && <Building2 className="w-4 h-4" />}
                {domain === 'supplier' && <Truck className="w-4 h-4" />}
                {domain === 'customer' && <Users className="w-4 h-4" />}
              </div>
              <h2 className="font-extrabold text-sm text-[#2D0000] capitalize truncate">
                {domain} Portal
              </h2>
            </div>
          ) : (
            <div className="flex justify-center py-1" title={`${domain} Portal`}>
              <div className="w-8 h-8 rounded-lg bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center">
                {domain === 'coordinator' && <Building2 className="w-4 h-4" />}
                {domain === 'supplier' && <Truck className="w-4 h-4" />}
                {domain === 'customer' && <Users className="w-4 h-4" />}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
                  } rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#6D0808] text-[#EEEAD7] shadow-md shadow-[#6D0808]/20'
                      : 'text-[#50574B] hover:text-[#2D0000] hover:bg-[#F8F6EC]'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5'} min-w-0`}>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#EEEAD7]' : 'text-[#757D6F]'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Info & Exit */}
        <div className="pt-3 border-t border-[#D8D2BC]">
          <div
            className={`p-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl flex items-center ${
              isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
            }`}
          >
            {!isCollapsed ? (
              <>
                <div className="truncate pr-2 min-w-0">
                  <p className="text-xs font-bold text-[#2D0000] truncate leading-tight">{currentUser?.fullName || 'Active User'}</p>
                  <p className="text-[10px] text-[#757D6F] truncate font-medium">{currentUser?.roleTitle || currentUser?.username}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-[#6D0808] hover:text-rose-700 border border-[#D8D2BC] text-xs font-semibold transition-all shrink-0 shadow-sm cursor-pointer"
                  title="Sign Out / Exit"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>
              </>
            ) : (
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-white hover:bg-rose-50 text-[#6D0808] hover:text-rose-700 border border-[#D8D2BC] transition-all shadow-sm cursor-pointer"
                title={`Sign Out (${currentUser?.fullName})`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
