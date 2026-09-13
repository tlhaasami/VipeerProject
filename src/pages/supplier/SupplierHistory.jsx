import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { History, CheckCircle2, MessageSquare } from 'lucide-react';

export const SupplierHistory = () => {
  const { currentUser } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const [allReqs, allItems] = await Promise.all([
        dataService.getRequests(),
        dataService.getItems()
      ]);
      setRequests(allReqs);
      setItems(allItems);

      // Collect feedback history for all supplier's requests
      const myReqs = allReqs.filter((r) => !currentUser?.supplierId || r.assignedSupplierId === currentUser.supplierId);
      let allFbs = [];
      for (const r of myReqs) {
        const fbs = await dataService.getFeedbacksForRequest(r.id);
        allFbs = [...allFbs, ...fbs.map((f) => ({ ...f, request: r }))];
      }
      setFeedbacks(allFbs);
    };
    loadHistory();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#2D0000]">Fulfillment History & Commitment Logs</h1>
        <p className="text-[#50574B] text-xs mt-0.5 font-medium">
          Historical log of capacity responses, warehouse commitments, and fulfillment milestones submitted to operations.
        </p>
      </div>

      {/* History Feed */}
      <div className="space-y-3">
        {feedbacks.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#D8D2BC] rounded-2xl text-[#757D6F] text-xs font-medium">
            No historical fulfillment commitments recorded.
          </div>
        ) : (
          feedbacks.map((fb) => {
            const itm = items.find((i) => i.id === fb.request?.itemId);

            return (
              <div
                key={fb.id}
                className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-[#6D0808]">{fb.request?.requestCode}</span>
                    <span className="text-xs font-semibold text-[#2D0000]">{itm?.itemName || 'Product Item'}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#757D6F]">
                    {new Date(fb.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-3 bg-[#F8F6EC] rounded-xl border border-[#D8D2BC] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#757D6F] font-medium">Committed Capacity:</span>
                    <span className="font-bold text-emerald-800">{fb.capacity} ({fb.deliverableQuantity} Units)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757D6F] font-medium">Staging Timeframe:</span>
                    <span className="font-mono font-bold text-[#2D0000]">{fb.timeframeDays} Days</span>
                  </div>
                  {fb.comments && (
                    <p className="text-[#50574B] text-[11px] mt-1 pt-1 border-t border-[#D8D2BC]">
                      "{fb.comments}"
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
