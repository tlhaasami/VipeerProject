import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Navigation, Truck, Package, Clock, CheckCircle2, AlertCircle, MapPin, ArrowRight } from 'lucide-react';

export const LogisticsDispatch = () => {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [reqs, itms, sups] = await Promise.all([
        dataService.getRequests(),
        dataService.getItems(),
        dataService.getSuppliers()
      ]);
      setRequests(reqs || []);
      setItems(itms || []);
      setSuppliers(sups || []);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D0000] tracking-tight">Logistics & Dispatch Fleet</h1>
          <p className="text-xs text-[#757D6F] font-medium mt-1">
            Real-time transit oversight, carrier routing, and Ejada supply chain fulfillment milestones.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-white border border-[#D8D2BC] rounded-xl text-[#2D0000] shadow-sm">
          <Navigation className="w-4 h-4 text-[#6D0808]" />
          <span>Active Shipments: {requests.filter(r => r.status !== 'Rejected').length}</span>
        </div>
      </div>

      {/* Logistics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Scheduled Today</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">4 Shipments</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-1.5"></span>
            100% On Schedule
          </p>
        </div>
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Carrier Fleet</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">3 Partners</p>
          <p className="text-[11px] text-[#50574B] font-semibold mt-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block mr-1.5"></span>
            Ejada Express, DHL Supply, Aramex
          </p>
        </div>
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Avg. Transit Time</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">2.4 Days</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-1.5"></span>
            Within 72h SLA Target
          </p>
        </div>
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Delivery Success</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">98.9%</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-1.5"></span>
            High Accuracy Rating
          </p>
        </div>
      </div>

      {/* Active Dispatch Pipeline Table */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#D8D2BC] bg-[#F8F6EC] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2D0000] flex items-center space-x-2">
            <Truck className="w-4 h-4 text-[#6D0808]" />
            <span>Fulfillment & Dispatch Manifest</span>
          </h2>
          <span className="text-xs text-[#757D6F]">Showing all active and historical manifests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D0000]">
            <thead className="bg-[#F8F6EC] text-[#757D6F] uppercase tracking-wider border-b border-[#D8D2BC] font-bold">
              <tr>
                <th className="py-3 px-4">Tracking / Request ID</th>
                <th className="py-3 px-4">Destination & Client</th>
                <th className="py-3 px-4">Product Payload</th>
                <th className="py-3 px-4">Assigned Supplier</th>
                <th className="py-3 px-4">Dispatch Status</th>
                <th className="py-3 px-4">Est. Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {requests.map((req) => {
                const item = items.find(i => i.id === req.itemId);
                const supplier = suppliers.find(s => s.id === req.assignedSupplierId || s.supplierCode === req.assignedSupplierId);
                const isDelivered = req.status === 'Closed';
                const isInProgress = req.status === 'Allocated' || req.status === 'Approved';

                return (
                  <tr key={req.id} className="hover:bg-[#F8F6EC]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#6D0808]">
                      EXP-{String(req.id).toUpperCase()}
                      <span className="block text-[10px] font-sans text-[#757D6F] font-normal">Req: {req.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#757D6F]" />
                        <span>{req.customerId ? `Client #${req.customerId}` : 'Corporate Site'}</span>
                      </div>
                      <span className="text-[10px] text-[#757D6F]">Riyadh Main Distribution Center</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2D0000]">{item?.name || 'IT Hardware Units'}</p>
                      <p className="text-[10px] text-[#757D6F] font-semibold">{req.quantity} units requested</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#50574B]">
                      {supplier ? (supplier.supplierName || supplier.name) : 'Ejada Central Hub'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          isDelivered ? 'bg-emerald-600' :
                          isInProgress ? 'bg-blue-600' :
                          req.status === 'Submitted' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span className="font-semibold text-xs">{req.status}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#50574B] font-mono">
                      {req.preferredDate || '2026-09-18'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
