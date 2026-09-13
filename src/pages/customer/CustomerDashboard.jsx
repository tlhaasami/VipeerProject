import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { useToast } from '../../components/NotificationToast';
import {
  PlusCircle,
  X
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 2,
    priority: 'Medium',
    deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: ''
  });

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const [allReqs, allItems] = await Promise.all([
        dataService.getRequests(),
        dataService.getItems()
      ]);
      const myReqs = allReqs.filter((r) => !currentUser?.customerId || r.customerId === currentUser.customerId);
      setRequests(myReqs);
      setItems(allItems);
      if (allItems.length > 0 && !formData.itemId) {
        setFormData((prev) => ({ ...prev, itemId: allItems[0].id }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, [currentUser]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      if (parseInt(formData.quantity, 10) <= 0) {
        addToast('Quantity must be greater than 0.', 'error');
        return;
      }

      await dataService.addRequest({
        ...formData,
        customerId: currentUser?.customerId || 'cust-001'
      }, 'customer');

      addToast('Supply request submitted to SCM operations successfully.', 'success');
      setShowNewModal(false);
      loadCustomerData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Enterprise Procurement Portal</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Logged in as <strong className="text-[#2D0000]">{currentUser?.fullName}</strong> ({currentUser?.roleTitle})
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] rounded-xl text-xs font-semibold shadow-md shadow-[#6D0808]/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Supply Order</span>
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#D8D2BC] flex items-center justify-between bg-[#F8F6EC]">
          <h2 className="text-sm font-extrabold text-[#2D0000]">Registered Procurement Requests ({requests.length})</h2>
          <span className="text-xs text-[#757D6F] font-medium">Track delivery timelines and review status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6EC] text-[#50574B] border-b border-[#D8D2BC]">
              <tr>
                <th className="p-3.5">Order Code</th>
                <th className="p-3.5">Requested Product / Service</th>
                <th className="p-3.5 text-center">Quantity</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Requested Delivery</th>
                <th className="p-3.5">Submission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#757D6F] font-medium">
                    You have no active supply requests. Click "New Supply Order" above to submit.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const itm = items.find((i) => i.id === req.itemId);
                  return (
                    <tr key={req.id} className="hover:bg-[#F8F6EC] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#6D0808]">{req.requestCode}</td>
                      <td className="p-3.5 text-[#2D0000] font-semibold">{itm?.itemName || 'N/A'}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#2D0000]">{req.quantity}</td>
                      <td className="p-3.5">
                        {renderPriorityDot(req.priority)}
                      </td>
                      <td className="p-3.5">
                        {renderStatusDot(req.status)}
                      </td>
                      <td className="p-3.5 font-mono text-[#757D6F] font-medium">{req.deliveryDate}</td>
                      <td className="p-3.5 font-mono text-[#757D6F] text-[11px]">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#6D0808]" />
                Submit New Supply Order
              </h2>
              <button onClick={() => setShowNewModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Select Catalog Item</label>
                <select
                  required
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-semibold"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.itemCode} - {i.itemName} (${i.unitPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-semibold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Target Delivery Date</label>
                <input
                  type="date"
                  required
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                />
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Order Scope / Logistics Notes</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Deployment location specifications, power constraints, or delivery deadlines..."
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#D8D2BC]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-xl font-semibold border border-[#D8D2BC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] font-semibold rounded-xl shadow-md"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
