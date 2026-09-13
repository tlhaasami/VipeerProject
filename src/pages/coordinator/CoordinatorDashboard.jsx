import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import {
  ClipboardList,
  Users,
  Package,
  ArrowUpRight,
  PlusCircle,
  Truck,
  UserPlus,
  UserCog,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';

export const CoordinatorDashboard = ({ onNavigate }) => {
  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [reqs, custs, itms, supps, usrs] = await Promise.all([
          dataService.getRequests(),
          dataService.getCustomers(),
          dataService.getItems(),
          dataService.getSuppliers(),
          dataService.getUsers()
        ]);
        setRequests(reqs || []);
        setCustomers(custs || []);
        setItems(itms || []);
        setSuppliers(supps || []);
        setUsers(usrs || []);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const pendingRequests = requests.filter((r) => r.status === 'Pending' || r.status === 'Assigned' || r.status === 'In-Review');
  const lowStockItems = items.filter((i) => i.stockQuantity <= i.reorderLevel);

  const renderPriorityDot = (priority) => {
    switch (priority) {
      case 'Critical':
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-red-600"></span>Critical</span>;
      case 'High':
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-amber-500"></span>High</span>;
      case 'Medium':
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Medium</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-slate-400"></span>Low</span>;
    }
  };

  const renderStatusDot = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-emerald-600"></span>Completed</span>;
      case 'Accepted':
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Accepted</span>;
      case 'In-Review':
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-amber-500"></span>In-Review</span>;
      case 'Assigned':
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Assigned</span>;
      case 'Cancelled':
      case 'Rejected':
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-red-600"></span>{status}</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Supply Chain Operations Overview</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Central dispatch for procurement orders, enterprise clients, catalog inventory, and staff provisioning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('users')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#6D0808] border border-[#D8D2BC] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Manage and provision enterprise accounts"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add / Manage Users</span>
          </button>

          <button
            onClick={() => onNavigate('requests')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] rounded-xl text-xs font-semibold shadow-md shadow-[#6D0808]/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Supply Request</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Requests */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 hover:border-[#757D6F] transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Total Requests</span>
            <div className="w-9 h-9 rounded-xl bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#2D0000]">{requests.length}</span>
            <span className="text-xs text-amber-700 font-semibold">({pendingRequests.length} active)</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#757D6F] justify-between font-medium">
            <span>Procurement Pipeline</span>
            <button onClick={() => onNavigate('requests')} className="text-[#6D0808] hover:underline flex items-center font-bold cursor-pointer">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* User Accounts & Staff */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 hover:border-[#757D6F] transition-all shadow-sm border-l-4 border-l-[#6D0808]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">User Directory</span>
            <div className="w-9 h-9 rounded-xl bg-[#6D0808]/15 text-[#6D0808] flex items-center justify-center">
              <UserCog className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#2D0000]">{users.length}</span>
            <span className="text-xs text-emerald-700 font-semibold">Active Staff</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#757D6F] justify-between font-medium">
            <span>RBAC Identity</span>
            <button onClick={() => onNavigate('users')} className="text-[#6D0808] hover:underline flex items-center font-bold cursor-pointer">
              Add User <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 hover:border-[#757D6F] transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Corporate Clients</span>
            <div className="w-9 h-9 rounded-xl bg-[#757D6F]/15 text-[#2D0000] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#2D0000]">{customers.length}</span>
            <span className="text-xs text-emerald-700 font-semibold">100% Active</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#757D6F] justify-between font-medium">
            <span>Client Directory</span>
            <button onClick={() => onNavigate('customers')} className="text-[#2D0000] hover:underline flex items-center font-bold cursor-pointer">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Inventory Items */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 hover:border-[#757D6F] transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Catalog Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-[#2D0000]/10 text-[#2D0000] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#2D0000]">{items.length}</span>
            {lowStockItems.length > 0 && (
              <span className="text-xs text-[#6D0808] font-semibold">({lowStockItems.length} low)</span>
            )}
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#757D6F] justify-between font-medium">
            <span>Hardware Catalog</span>
            <button onClick={() => onNavigate('items')} className="text-[#2D0000] hover:underline flex items-center font-bold cursor-pointer">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Partner Suppliers */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 hover:border-[#757D6F] transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Certified Suppliers</span>
            <div className="w-9 h-9 rounded-xl bg-[#2D0000]/10 text-[#2D0000] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#2D0000]">{suppliers.length}</span>
            <span className="text-xs text-emerald-700 font-semibold">Verified</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#757D6F] justify-between font-medium">
            <span>Hardware Network</span>
            <button onClick={() => onNavigate('suppliers')} className="text-[#2D0000] hover:underline flex items-center font-bold cursor-pointer">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Orders & Quick Dispatch Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Supply Requests Table */}
        <div className="lg:col-span-2 bg-white border border-[#D8D2BC] rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#D8D2BC] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#2D0000]">Recent Supply Requests</h2>
              <p className="text-[11px] text-[#757D6F] font-medium">Real-time status updates from procurement customers</p>
            </div>
            <button
              onClick={() => onNavigate('requests')}
              className="text-xs font-bold text-[#6D0808] hover:underline cursor-pointer"
            >
              Manage All Requests &rarr;
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6EC] text-[#757D6F] uppercase tracking-wider border-b border-[#D8D2BC] font-bold">
                <tr>
                  <th className="py-3 px-4">Request Ref</th>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D2BC]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#757D6F]">
                      Loading active requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#757D6F]">
                      No active requests found.
                    </td>
                  </tr>
                ) : (
                  requests.slice(0, 6).map((req) => (
                    <tr key={req.id} className="hover:bg-[#F8F6EC]/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#6D0808]">
                        {req.requestId || req.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#2D0000]">{req.itemName || req.itemId}</div>
                        <div className="text-[10px] text-[#757D6F]">Qty: {req.quantity}</div>
                      </td>
                      <td className="py-3 px-4 text-[#50574B] font-medium">
                        {req.customerName || req.customerId}
                      </td>
                      <td className="py-3 px-4">{renderPriorityDot(req.priority)}</td>
                      <td className="py-3 px-4">{renderStatusDot(req.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations Actions Panel */}
        <div className="space-y-4">
          <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-[#D8D2BC] pb-3">
              <h2 className="text-sm font-extrabold text-[#2D0000]">Quick Operations Center</h2>
              <p className="text-[11px] text-[#757D6F] font-medium">Administrative shortcuts and fast actions</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <button
                onClick={() => onNavigate('users')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] font-bold border border-[#D8D2BC] transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#6D0808] text-[#EEEAD7] flex items-center justify-center shadow-xs">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#2D0000]">Provision New Staff Account</p>
                    <p className="text-[10px] text-[#757D6F] font-medium">Add Coordinator, Supplier, or Customer</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#757D6F] group-hover:text-[#6D0808] transition-colors" />
              </button>

              <button
                onClick={() => onNavigate('requests')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] font-bold border border-[#D8D2BC] transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2D0000] text-[#EEEAD7] flex items-center justify-center shadow-xs">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#2D0000]">Process Pending Allocations</p>
                    <p className="text-[10px] text-[#757D6F] font-medium">Assign suppliers & dispatch dates</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#757D6F] group-hover:text-[#6D0808] transition-colors" />
              </button>

              <button
                onClick={() => onNavigate('analytics')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] font-bold border border-[#D8D2BC] transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#757D6F] text-[#EEEAD7] flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#2D0000]">Run NFR Performance Benchmark</p>
                    <p className="text-[10px] text-[#757D6F] font-medium">Execute 100 transaction stress test</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#757D6F] group-hover:text-[#6D0808] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
