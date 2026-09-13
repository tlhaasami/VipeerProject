import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Calendar, Clock, Truck, CheckCircle2 } from 'lucide-react';

export const SupplierSchedule = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadSchedule = async () => {
      const [reqs, itms, custs] = await Promise.all([
        dataService.getRequests(),
        dataService.getItems(),
        dataService.getCustomers()
      ]);
      const myReqs = reqs.filter((r) => !currentUser?.supplierId || r.assignedSupplierId === currentUser.supplierId);
      setRequests(myReqs);
      setItems(itms);
      setCustomers(custs);
    };
    loadSchedule();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#2D0000]">Delivery & Fulfillment Schedule</h1>
        <p className="text-[#50574B] text-xs mt-0.5 font-medium">
          Timeline view of allocated procurement orders, warehouse staging deadlines, and delivery milestones.
        </p>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#D8D2BC] rounded-2xl text-[#757D6F] text-xs font-medium">
            No scheduled dispatches assigned at this time.
          </div>
        ) : (
          requests.map((req) => {
            const itm = items.find((i) => i.id === req.itemId);
            const cust = customers.find((c) => c.id === req.customerId);

            return (
              <div
                key={req.id}
                className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono font-bold text-xs text-[#6D0808]">{req.requestCode}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium">
                      <span className={`w-2 h-2 rounded-full ${
                        req.priority === 'Critical' ? 'bg-red-600' :
                        req.priority === 'High' ? 'bg-amber-500' :
                        req.priority === 'Medium' ? 'bg-blue-500' : 'bg-slate-400'
                      }`}></span>
                      {req.priority} Priority
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium">
                      <span className={`w-2 h-2 rounded-full ${
                        req.status === 'Completed' ? 'bg-emerald-600' :
                        req.status === 'Accepted' ? 'bg-emerald-500' :
                        req.status === 'In-Review' ? 'bg-amber-500' : 'bg-purple-500'
                      }`}></span>
                      {req.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#2D0000]">{itm?.itemName || 'Product Spec'}</h3>
                  <p className="text-xs text-[#50574B] font-medium">
                    Client: <strong className="text-[#2D0000]">{cust?.customerName || 'Enterprise Client'}</strong> &bull; Quantity: <strong>{req.quantity} Units</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-4 bg-[#F8F6EC] px-4 py-2.5 rounded-xl border border-[#D8D2BC] shrink-0">
                  <Calendar className="w-4 h-4 text-[#6D0808]" />
                  <div className="text-xs">
                    <span className="text-[#757D6F] block font-medium text-[10px]">Target Delivery Date</span>
                    <span className="font-mono font-bold text-[#2D0000]">{req.deliveryDate}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
