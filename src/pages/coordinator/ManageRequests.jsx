import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../components/NotificationToast';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Truck,
  X
} from 'lucide-react';

export const ManageRequests = () => {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestFeedbacks, setRequestFeedbacks] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    itemId: '',
    quantity: 1,
    priority: 'Medium',
    status: 'Pending',
    deliveryDate: '',
    assignedSupplierId: '',
    notes: ''
  });

  const loadData = async () => {
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

      if (custs.length > 0 && !formData.customerId) {
        setFormData((prev) => ({
          ...prev,
          customerId: custs[0].id,
          itemId: itms[0]?.id || '',
          deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      customerId: customers[0]?.id || '',
      itemId: items[0]?.id || '',
      quantity: 5,
      priority: 'Medium',
      status: 'Pending',
      deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      assignedSupplierId: suppliers[0]?.id || '',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      if (parseInt(formData.quantity, 10) <= 0) {
        addToast('Quantity must be greater than 0.', 'error');
        return;
      }

      await dataService.addRequest(formData, 'coordinator');
      addToast(`Supply request registered successfully.`, 'success');
      setShowAddModal(false);
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleOpenEdit = (req) => {
    setSelectedRequest(req);
    setFormData({
      customerId: req.customerId,
      itemId: req.itemId,
      quantity: req.quantity,
      priority: req.priority,
      status: req.status,
      deliveryDate: req.deliveryDate,
      assignedSupplierId: req.assignedSupplierId || '',
      notes: req.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    try {
      await dataService.updateRequest(selectedRequest.id, formData, 'coordinator');
      addToast(`Request ${selectedRequest.requestCode} updated and supplier notified.`, 'success');
      setShowEditModal(false);
      loadData();
    } catch (err) {
      addToast(`Update error: ${err.message}`, 'error');
    }
  };

  const handleDeleteRequest = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete supply request ${code}?`)) {
      try {
        await dataService.deleteRequest(id, 'coordinator');
        addToast(`Request ${code} deleted successfully.`, 'success');
        loadData();
      } catch (err) {
        addToast(err.message, 'error');
      }
    }
  };

  const handleViewDetails = async (req) => {
    setSelectedRequest(req);
    const feedbacks = await dataService.getFeedbacksForRequest(req.id);
    setRequestFeedbacks(feedbacks);
    setShowDetailsModal(true);
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

  const filteredRequests = requests.filter((r) => {
    const cust = customers.find((c) => c.id === r.customerId);
    const itm = items.find((i) => i.id === r.itemId);
    const matchesSearch =
      r.requestCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust?.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itm?.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Supply Request Management</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Create, view specifications, adjust scheduling, allocate suppliers, and manage order lifecycles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] rounded-xl text-xs font-semibold shadow-md shadow-[#6D0808]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Supply Request</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#757D6F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, customer, item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-xs text-[#2D0000] placeholder-[#757D6F] focus:outline-none focus:border-[#6D0808] font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-[#757D6F] font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl px-3 py-2 text-xs text-[#2D0000] font-semibold focus:outline-none focus:border-[#6D0808]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In-Review">In-Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl px-3 py-2 text-xs text-[#2D0000] font-semibold focus:outline-none focus:border-[#6D0808]"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
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
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assigned Supplier</th>
                <th className="p-3.5">Required Delivery</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-[#757D6F] font-medium">
                    No supply requests match your query.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const cust = customers.find((c) => c.id === req.customerId);
                  const itm = items.find((i) => i.id === req.itemId);
                  const supp = suppliers.find((s) => s.id === req.assignedSupplierId);

                  return (
                    <tr key={req.id} className="hover:bg-[#F8F6EC] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#6D0808]">{req.requestCode}</td>
                      <td className="p-3.5 text-[#2D0000] font-semibold">{cust?.customerName || 'N/A'}</td>
                      <td className="p-3.5 text-[#50574B] max-w-[200px] truncate font-medium">{itm?.itemName || 'N/A'}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#2D0000]">{req.quantity}</td>
                      <td className="p-3.5">
                        {renderPriorityDot(req.priority)}
                      </td>
                      <td className="p-3.5">
                        {renderStatusDot(req.status)}
                      </td>
                      <td className="p-3.5 text-[#50574B]">
                        {supp ? (
                          <span className="text-[#2D0000] flex items-center gap-1 font-medium">
                            <Truck className="w-3.5 h-3.5 text-[#757D6F]" />
                            {supp.supplierName}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-[#757D6F] font-medium">{req.deliveryDate}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleViewDetails(req)}
                            className="p-1.5 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-lg transition-colors border border-[#D8D2BC]"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(req)}
                            className="p-1.5 bg-[#F8F6EC] hover:bg-[#6D0808]/10 text-[#6D0808] rounded-lg transition-colors border border-[#D8D2BC]"
                            title="Edit Order"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(req.id, req.requestCode)}
                            className="p-1.5 bg-[#F8F6EC] hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-[#D8D2BC]"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#6D0808]" />
                Register New Supply Request
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Corporate Client</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-semibold"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customerCode} - {c.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Requested Catalog Item</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Required Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Assign Supplier</label>
                  <select
                    value={formData.assignedSupplierId}
                    onChange={(e) => setFormData({ ...formData, assignedSupplierId: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                  >
                    <option value="">-- Leave Unassigned --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.supplierName} ({s.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Special Requirements / Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Special instructions for supply fulfillment..."
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#D8D2BC]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-xl font-semibold border border-[#D8D2BC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] font-semibold rounded-xl shadow-md"
                >
                  Save Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <div>
                <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-[#6D0808]" />
                  Edit Request {selectedRequest.requestCode}
                </h2>
                <p className="text-[11px] text-[#757D6F] font-medium">Updates will synchronize with assigned supplier portal.</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRequest} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-semibold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In-Review">In-Review</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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
                  <label className="block text-[#2D0000] font-bold mb-1">Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Assigned Supplier</label>
                <select
                  value={formData.assignedSupplierId}
                  onChange={(e) => setFormData({ ...formData, assignedSupplierId: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                >
                  <option value="">-- No Supplier Assigned --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.supplierName} ({s.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#D8D2BC]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-xl font-semibold border border-[#D8D2BC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] font-semibold rounded-xl shadow-md"
                >
                  Save & Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details & Feedback Inspection Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <div>
                <h2 className="text-lg font-extrabold text-[#2D0000]">{selectedRequest.requestCode} Specifications</h2>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6 text-xs">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-[#F8F6EC] p-4 rounded-xl border border-[#D8D2BC]">
                <div>
                  <span className="text-[#757D6F] block font-medium">Corporate Client</span>
                  <span className="text-[#2D0000] font-bold text-sm">
                    {customers.find((c) => c.id === selectedRequest.customerId)?.customerName || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#757D6F] block font-medium">Requested Product</span>
                  <span className="text-[#2D0000] font-bold text-sm">
                    {items.find((i) => i.id === selectedRequest.itemId)?.itemName || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#757D6F] block font-medium">Order Quantity</span>
                  <span className="text-[#6D0808] font-bold font-mono text-sm">{selectedRequest.quantity} Units</span>
                </div>
                <div>
                  <span className="text-[#757D6F] block font-medium">Delivery Deadline</span>
                  <span className="text-[#2D0000] font-mono text-sm font-semibold">{selectedRequest.deliveryDate}</span>
                </div>
                <div>
                  <span className="text-[#757D6F] block font-medium">Assigned Supplier</span>
                  <span className="text-[#2D0000] font-semibold">
                    {suppliers.find((s) => s.id === selectedRequest.assignedSupplierId)?.supplierName || 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-[#757D6F] block font-medium">Workflow Status</span>
                  <div className="mt-0.5">{renderStatusDot(selectedRequest.status)}</div>
                </div>
              </div>

              {/* Notes */}
              {selectedRequest.notes && (
                <div>
                  <span className="text-[#757D6F] font-bold block mb-1">Coordinator Notes</span>
                  <p className="p-3 bg-[#F8F6EC] rounded-xl text-[#2D0000] border border-[#D8D2BC]">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}

              {/* Supplier Feedbacks Section */}
              <div>
                <h3 className="font-extrabold text-[#2D0000] mb-2 flex items-center justify-between">
                  <span>Supplier Capacity Commitments</span>
                  <span className="text-[#757D6F] font-medium">{requestFeedbacks.length} Submissions</span>
                </h3>

                {requestFeedbacks.length === 0 ? (
                  <p className="p-4 bg-[#F8F6EC] rounded-xl text-[#757D6F] text-center border border-[#D8D2BC]">
                    No supplier feedback has been submitted for this order yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {requestFeedbacks.map((fb) => (
                      <div key={fb.id} className="p-4 bg-[#F8F6EC] rounded-xl border border-[#D8D2BC] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#6D0808]">
                            Capacity: <span className="underline">{fb.capacity}</span>
                          </span>
                          <span className="text-[#757D6F] font-mono text-[11px]">
                            {new Date(fb.submittedAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-[#757D6F]">Deliverable Quantity:</span>{' '}
                            <span className="text-[#2D0000] font-mono font-bold">{fb.deliverableQuantity} Units</span>
                          </div>
                          <div>
                            <span className="text-[#757D6F]">Timeframe:</span>{' '}
                            <span className="text-emerald-800 font-mono font-bold">{fb.timeframeDays} Days</span>
                          </div>
                        </div>
                        {fb.comments && (
                          <p className="text-[#50574B] text-[11px] bg-white p-2 rounded border border-[#D8D2BC]">
                            "{fb.comments}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D8D2BC] text-right">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-xl text-xs font-semibold border border-[#D8D2BC]"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
