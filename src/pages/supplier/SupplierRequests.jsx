import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { useToast } from '../../components/NotificationToast';
import {
  ClipboardList,
  MessageSquare,
  Eye,
  X
} from 'lucide-react';

export const SupplierRequests = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [existingFeedbacks, setExistingFeedbacks] = useState([]);

  // Feedback Form State
  const [feedbackData, setFeedbackData] = useState({
    capacity: 'Full',
    deliverableQuantity: 1,
    timeframeDays: 7,
    comments: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [allReqs, custs, itms] = await Promise.all([
        dataService.getRequests(),
        dataService.getCustomers(),
        dataService.getItems()
      ]);
      const assigned = allReqs.filter((r) => !currentUser?.supplierId || r.assignedSupplierId === currentUser.supplierId);
      setRequests(assigned);
      setCustomers(custs);
      setItems(itms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleOpenFeedback = async (req) => {
    setSelectedRequest(req);
    setFeedbackData({
      capacity: 'Full',
      deliverableQuantity: req.quantity,
      timeframeDays: 7,
      comments: ''
    });
    const fbs = await dataService.getFeedbacksForRequest(req.id);
    setExistingFeedbacks(fbs);
    setShowFeedbackModal(true);
  };

  const handleOpenDetails = async (req) => {
    setSelectedRequest(req);
    const fbs = await dataService.getFeedbacksForRequest(req.id);
    setExistingFeedbacks(fbs);
    setShowDetailsModal(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await dataService.submitFeedback({
        requestId: selectedRequest.id,
        supplierId: currentUser?.supplierId || 'supp-001',
        capacity: feedbackData.capacity,
        deliverableQuantity: feedbackData.deliverableQuantity,
        timeframeDays: feedbackData.timeframeDays,
        comments: feedbackData.comments
      });

      addToast(`Feedback for ${selectedRequest.requestCode} submitted successfully.`, 'success');
      setShowFeedbackModal(false);
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Assigned Supply Orders</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Review specifications and submit formal commitments regarding delivery timeframe and fulfillment capacity.
          </p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6EC] text-[#50574B] border-b border-[#D8D2BC]">
              <tr>
                <th className="p-3.5">Order Code</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Requested Item</th>
                <th className="p-3.5 text-center">Required Qty</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Delivery Deadline</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-[#757D6F] font-medium">
                    No supply requests currently assigned to your supplier profile.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const cust = customers.find((c) => c.id === req.customerId);
                  const itm = items.find((i) => i.id === req.itemId);

                  return (
                    <tr key={req.id} className="hover:bg-[#F8F6EC] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#6D0808]">{req.requestCode}</td>
                      <td className="p-3.5 text-[#2D0000] font-semibold">{cust?.customerName || 'N/A'}</td>
                      <td className="p-3.5 text-[#50574B] max-w-[200px] truncate font-medium">{itm?.itemName || 'N/A'}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#2D0000]">{req.quantity}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium">
                          <span className={`w-2 h-2 rounded-full ${
                            req.priority === 'Critical' ? 'bg-red-600' :
                            req.priority === 'High' ? 'bg-amber-500' :
                            req.priority === 'Medium' ? 'bg-blue-500' : 'bg-slate-400'
                          }`}></span>
                          {req.priority}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium">
                          <span className={`w-2 h-2 rounded-full ${
                            req.status === 'Completed' ? 'bg-emerald-600' :
                            req.status === 'Accepted' ? 'bg-emerald-500' :
                            req.status === 'In-Review' ? 'bg-amber-500' :
                            req.status === 'Assigned' ? 'bg-purple-500' :
                            req.status === 'Pending' ? 'bg-blue-500' : 'bg-red-600'
                          }`}></span>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[#757D6F] font-medium">{req.deliveryDate}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenDetails(req)}
                            className="p-1.5 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-lg transition-colors border border-[#D8D2BC]"
                            title="View Full Specifications"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenFeedback(req)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] rounded-lg font-semibold transition-all shadow-sm"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Submit Feedback</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <div>
                <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#6D0808]" />
                  Submit Feedback for {selectedRequest.requestCode}
                </h2>
                <p className="text-[11px] text-[#757D6F] font-medium">
                  State fulfillment capacity and expected completion timeframe.
                </p>
              </div>
              <button onClick={() => setShowFeedbackModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-[#F8F6EC] rounded-xl border border-[#D8D2BC] grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#757D6F] block font-medium">Requested Product:</span>
                  <span className="text-[#2D0000] font-bold">
                    {items.find((i) => i.id === selectedRequest.itemId)?.itemName || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#757D6F] block font-medium">Total Units Needed:</span>
                  <span className="text-[#6D0808] font-mono font-bold">{selectedRequest.quantity} Units</span>
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Fulfillment Capacity</label>
                <select
                  value={feedbackData.capacity}
                  onChange={(e) => setFeedbackData({ ...feedbackData, capacity: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-semibold"
                >
                  <option value="Full">Can Supply All (100% of requested items)</option>
                  <option value="Partial">Can Supply Part (Partial stock availability)</option>
                  <option value="Cannot-Supply">Cannot Supply (Out of stock / unavailable)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Deliverable Quantity (Units)</label>
                  <input
                    type="number"
                    required
                    value={feedbackData.deliverableQuantity}
                    onChange={(e) => setFeedbackData({ ...feedbackData, deliverableQuantity: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                  <span className="text-[10px] text-[#757D6F] block mt-0.5 font-medium">Target: {selectedRequest.quantity}</span>
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Timeframe (Delivery Days)</label>
                  <input
                    type="number"
                    required
                    value={feedbackData.timeframeDays}
                    onChange={(e) => setFeedbackData({ ...feedbackData, timeframeDays: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                  <span className="text-[10px] text-[#757D6F] block mt-0.5 font-medium">Days from confirmation</span>
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Supplier Remarks / Warehouse Notes</label>
                <textarea
                  rows="3"
                  value={feedbackData.comments}
                  onChange={(e) => setFeedbackData({ ...feedbackData, comments: e.target.value })}
                  placeholder="Specify warehouse batch numbers, logistics carrier, or constraints..."
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#D8D2BC]">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-xl font-semibold border border-[#D8D2BC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] font-semibold rounded-xl shadow-md"
                >
                  Submit Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <h2 className="text-base font-extrabold text-[#2D0000]">{selectedRequest.requestCode} Specifications</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="bg-[#F8F6EC] p-4 rounded-xl border border-[#D8D2BC] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#757D6F] font-medium">Corporate Client:</span>
                  <span className="text-[#2D0000] font-bold">
                    {customers.find((c) => c.id === selectedRequest.customerId)?.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#757D6F] font-medium">Item:</span>
                  <span className="text-[#2D0000] font-semibold">
                    {items.find((i) => i.id === selectedRequest.itemId)?.itemName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#757D6F] font-medium">Quantity:</span>
                  <span className="text-[#6D0808] font-mono font-bold">{selectedRequest.quantity} Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#757D6F] font-medium">Delivery Target:</span>
                  <span className="text-[#2D0000] font-mono font-semibold">{selectedRequest.deliveryDate}</span>
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <span className="text-[#757D6F] block font-bold mb-1">Coordinator Notes:</span>
                  <p className="p-3 bg-[#F8F6EC] rounded-xl text-[#2D0000] border border-[#D8D2BC]">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#D8D2BC] text-right">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-xl text-xs font-semibold border border-[#D8D2BC]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
