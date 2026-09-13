import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { Truck, CheckCircle2, Clock, MapPin, Package, ArrowRight } from 'lucide-react';

export const OrderTracking = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [allReqs, allItems] = await Promise.all([
        dataService.getRequests(),
        dataService.getItems()
      ]);
      setRequests(allReqs || []);
      setItems(allItems || []);
    };
    load();
  }, []);

  const myRequests = requests.filter(
    (r) => r.customerId === currentUser?.username || r.customerId === 'c1' || r.customerId === 'c2' || r.customerId === 'CUST-001'
  );

  const steps = [
    { name: 'Submitted', key: 'Submitted' },
    { name: 'Evaluated', key: 'Approved' },
    { name: 'Allocated', key: 'Allocated' },
    { name: 'In Transit', key: 'In Transit' },
    { name: 'Delivered', key: 'Closed' }
  ];

  const getStepProgress = (status) => {
    switch (status) {
      case 'Submitted': return 1;
      case 'Approved': return 2;
      case 'Allocated': return 3;
      case 'In Transit': return 4;
      case 'Closed': return 5;
      case 'Rejected': return 0;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D0000] tracking-tight">Order & Shipment Tracking</h1>
          <p className="text-xs text-[#757D6F] font-medium mt-1">
            Real-time fulfillment stages, carrier checkpoints, and estimated delivery dates.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-white border border-[#D8D2BC] rounded-xl text-[#2D0000] shadow-sm">
          <Truck className="w-4 h-4 text-[#6D0808]" />
          <span>Active Orders: {myRequests.filter(r => r.status !== 'Closed' && r.status !== 'Rejected').length}</span>
        </div>
      </div>

      {/* Orders List with Progress Trackers */}
      <div className="space-y-4">
        {myRequests.length === 0 ? (
          <div className="bg-white border border-[#D8D2BC] rounded-2xl p-8 text-center">
            <Package className="w-10 h-10 text-[#757D6F] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-[#2D0000]">No Active Orders In Transit</p>
            <p className="text-xs text-[#757D6F] mt-1">Submit a new supply request to start tracking fulfillment milestones.</p>
          </div>
        ) : (
          myRequests.map((req) => {
            const item = items.find((i) => i.id === req.itemId || i.itemCode === req.itemId);
            const currentProgress = getStepProgress(req.status);

            return (
              <div
                key={req.id}
                className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8D2BC] pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#2D0000] flex items-center space-x-2">
                        <span>{item?.itemName || item?.name || 'Enterprise Hardware Batch'}</span>
                        <span className="font-mono text-xs text-[#6D0808] font-semibold">({req.id})</span>
                      </h2>
                      <p className="text-xs text-[#757D6F]">
                        Quantity: <span className="font-bold text-[#2D0000]">{req.quantity} units</span> | Est. Delivery: <span className="font-mono font-medium">{req.preferredDate || '2026-09-20'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                      req.status === 'Closed' ? 'bg-emerald-600' :
                      req.status === 'Rejected' ? 'bg-rose-600' : 'bg-blue-600'
                    }`} />
                    <span className="text-xs font-bold text-[#2D0000]">{req.status}</span>
                  </div>
                </div>

                {/* Step Progress Bar */}
                <div className="pt-2">
                  <div className="grid grid-cols-5 gap-2 relative">
                    {steps.map((step, idx) => {
                      const stepNum = idx + 1;
                      const isDone = currentProgress >= stepNum;
                      const isCurrent = currentProgress === stepNum;

                      return (
                        <div key={step.key} className="text-center">
                          <div className="flex items-center justify-center mb-1.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-[#6D0808] text-[#EEEAD7] shadow-sm'
                                  : 'bg-[#F8F6EC] text-[#757D6F] border border-[#D8D2BC]'
                              }`}
                            >
                              {isDone ? '✓' : stepNum}
                            </div>
                          </div>
                          <p className={`text-[11px] font-bold ${isCurrent ? 'text-[#6D0808]' : isDone ? 'text-[#2D0000]' : 'text-[#757D6F]'}`}>
                            {step.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Destination */}
                <div className="bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-3 flex items-center justify-between text-xs text-[#50574B]">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#6D0808] shrink-0" />
                    <span>Carrier: Ejada Logistics Express | Destination: Riyadh Regional Datacenter</span>
                  </div>
                  <span className="font-bold text-[#2D0000]">Tracking: EXP-{String(req.id).toUpperCase()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
