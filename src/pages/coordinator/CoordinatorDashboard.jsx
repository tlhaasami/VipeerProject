import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import {
  ClipboardList,
  Users,
  Package,
  ArrowUpRight,
  PlusCircle,
  Truck
} from 'lucide-react';

export const CoordinatorDashboard = ({ onNavigate }) => {
  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [reqs, custs, itms, supps] = await Promise.all([
          dataService.getRequests(),
          dataService.getCustomers(),
          dataService.getItems(),
          dataService.getSuppliers()
        ]);
        setRequests(reqs);
        setCustomers(custs);
        setItems(itms);
        setSuppliers(supps);
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
      {/* Page Title & Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Supply Chain Operations Overview</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Central dispatch for procurement orders, enterprise clients, catalog inventory, and supplier allocations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('requests')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] rounded-xl text-xs font-semibold shadow-md shadow-[#6D0808]/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Supply Request</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <button onClick={() => onNavigate('requests')} className="text-[#6D0808] hover:underline flex items-center font-bold">
              View All <ArrowUpRight className="w-3 h-3 ml-0.5" />
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
            <button onClick={() => onNavigate('customers')} className="text-[#2D0000] hover:underline flex items-center font-bold">
              View All <ArrowUpRight className="w-3 h-3 ml-0.5" />
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
              <span className="text-xs text-[#6D0808] font-semibold">({lowStockItems.length} low stock)</span>
            )}
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#757D6F] justify-between font-medium">
            <span>Hardware & Licenses</span>
            <button onClick={() => onNavigate('items')} className="text-[#2D0000] hover:underline flex items-center font-bold">
              View All <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Partner Suppliers */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 hover:border-[#757D6F] transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Supply Partners</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[#2D0000]">{suppliers.length}</span>
            <span className="text-xs text-emerald-700 font-semibold">Tier-1 Certified</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#757D6F] justify-between font-medium">
            <span>Fulfillment Network</span>
            <span className="text-[#757D6F] font-semibold">Active</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Requests & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Supply Requests (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#2D0000]">Active Supply Orders</h2>
              <p className="text-xs text-[#757D6F] font-medium">Recent procurement orders in the Ejada pipeline</p>
            </div>
            <button
              onClick={() => onNavigate('requests')}
              className="text-xs text-[#6D0808] hover:text-[#820a0a] font-bold"
            >
              Manage Orders &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6EC] text-[#50574B] border-b border-[#D8D2BC]">
                <tr>
                  <th className="p-3">Order Code</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Supplier</th>
                  <th className="p-3 text-right">Delivery Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D2BC]">
                {requests.slice(0, 5).map((req) => {
                  const cust = customers.find((c) => c.id === req.customerId);
                  const supp = suppliers.find((s) => s.id === req.assignedSupplierId);
                  return (
                    <tr key={req.id} className="hover:bg-[#F8F6EC] transition-colors">
                      <td className="p-3 font-mono font-bold text-[#6D0808]">{req.requestCode}</td>
                      <td className="p-3 font-semibold text-[#2D0000]">{cust?.customerName || 'N/A'}</td>
                      <td className="p-3">
                        {renderPriorityDot(req.priority)}
                      </td>
                      <td className="p-3">
                        {renderStatusDot(req.status)}
                      </td>
                      <td className="p-3 text-[#50574B]">
                        {supp ? supp.supplierName : <span className="text-stone-400 italic">Unassigned</span>}
                      </td>
                      <td className="p-3 text-right font-mono text-[#757D6F] font-medium">{req.deliveryDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & System Specifications (1 col) */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-extrabold text-[#2D0000] mb-1">Quick Shortcuts</h2>
            <p className="text-xs text-[#757D6F] font-medium">Direct access to core modules</p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate('requests')}
              className="w-full p-3 bg-[#F8F6EC] hover:bg-[#EEEAD7] border border-[#D8D2BC] rounded-xl flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-4 h-4 text-[#6D0808]" />
                <div>
                  <p className="text-xs font-bold text-[#2D0000]">Supply Requests</p>
                  <p className="text-[10px] text-[#757D6F]">Create, Edit, Delete, Assign</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#6D0808]">&rarr;</span>
            </button>

            <button
              onClick={() => onNavigate('customers')}
              className="w-full p-3 bg-[#F8F6EC] hover:bg-[#EEEAD7] border border-[#D8D2BC] rounded-xl flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-[#757D6F]" />
                <div>
                  <p className="text-xs font-bold text-[#2D0000]">Client Directory</p>
                  <p className="text-[10px] text-[#757D6F]">Accounts & Credit Limits</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#757D6F]">&rarr;</span>
            </button>

            <button
              onClick={() => onNavigate('items')}
              className="w-full p-3 bg-[#F8F6EC] hover:bg-[#EEEAD7] border border-[#D8D2BC] rounded-xl flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4 text-[#2D0000]" />
                <div>
                  <p className="text-xs font-bold text-[#2D0000]">Product Catalog</p>
                  <p className="text-[10px] text-[#757D6F]">Pricing, Stock, Categories</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#2D0000]">&rarr;</span>
            </button>
          </div>

          <div className="p-4 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-xs space-y-1.5">
            <span className="font-bold text-[#2D0000] block">Enterprise Communication Sync</span>
            <p className="text-[11px] text-[#50574B] leading-relaxed">
              Every coordinator update automatically synchronizes with assigned supplier partner portals in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
