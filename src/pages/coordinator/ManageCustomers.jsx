import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../components/NotificationToast';
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  X
} from 'lucide-react';

export const ManageCustomers = () => {
  const { addToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerCode: '',
    customerName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    accountStatus: 'Active',
    creditLimit: 50000.00
  });

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await dataService.getCustomers();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleOpenAdd = () => {
    const nextNum = customers.length + 1;
    setFormData({
      customerCode: `CUST-${String(nextNum).padStart(3, '0')}`,
      customerName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      accountStatus: 'Active',
      creditLimit: 50000.00
    });
    setShowAddModal(true);
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      await dataService.addCustomer(formData);
      addToast(`Customer ${formData.customerName} created successfully.`, 'success');
      setShowAddModal(false);
      loadCustomers();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleOpenEdit = (cust) => {
    setSelectedCustomer(cust);
    setFormData({
      customerCode: cust.customerCode,
      customerName: cust.customerName,
      contactPerson: cust.contactPerson,
      email: cust.email,
      phone: cust.phone,
      address: cust.address,
      accountStatus: cust.accountStatus,
      creditLimit: cust.creditLimit
    });
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      await dataService.updateCustomer(selectedCustomer.id, formData);
      addToast(`Customer ${selectedCustomer.customerCode} updated successfully.`, 'success');
      setShowEditModal(false);
      loadCustomers();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteCustomer = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      try {
        await dataService.deleteCustomer(id);
        addToast(`Customer ${name} deleted successfully.`, 'success');
        loadCustomers();
      } catch (err) {
        addToast(`Deletion blocked: ${err.message}`, 'error');
      }
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Enterprise Client Directory</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Register corporate clients, maintain authorized contacts, adjust credit limits, and monitor account health.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] rounded-xl text-xs font-semibold shadow-md shadow-[#6D0808]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Corporate Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#757D6F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, code, contact person..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-xs text-[#2D0000] placeholder-[#757D6F] focus:outline-none focus:border-[#6D0808] font-medium"
          />
        </div>
        <span className="text-xs text-[#757D6F] font-bold font-mono">{filteredCustomers.length} Clients</span>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6EC] text-[#50574B] border-b border-[#D8D2BC]">
              <tr>
                <th className="p-3.5">Client Code</th>
                <th className="p-3.5">Company Name</th>
                <th className="p-3.5">Primary Contact</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Credit Facility</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#757D6F] font-medium">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#F8F6EC] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#6D0808]">{cust.customerCode}</td>
                    <td className="p-3.5 font-semibold text-[#2D0000]">{cust.customerName}</td>
                    <td className="p-3.5 text-[#50574B] font-medium">{cust.contactPerson}</td>
                    <td className="p-3.5 text-[#757D6F]">
                      <div className="text-[11px] font-medium text-[#2D0000]">{cust.email}</div>
                      <div className="text-[10px] text-[#757D6F] font-mono">{cust.phone}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[#2D0000] font-bold">
                      ${cust.creditLimit?.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium">
                        <span className={`w-2 h-2 rounded-full ${cust.accountStatus === 'Active' ? 'bg-emerald-600' : cust.accountStatus === 'Pending' ? 'bg-amber-500' : 'bg-red-600'}`}></span>
                        {cust.accountStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] rounded-lg transition-colors border border-[#D8D2BC]"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 bg-[#F8F6EC] hover:bg-[#6D0808]/10 text-[#6D0808] rounded-lg transition-colors border border-[#D8D2BC]"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(cust.id, cust.customerName)}
                          className="p-1.5 bg-[#F8F6EC] hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-[#D8D2BC]"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#6D0808]" />
                Register New Enterprise Client
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Client Code</label>
                  <input
                    type="text"
                    required
                    value={formData.customerCode}
                    onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Credit Facility ($)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saudi Aramco Services Group"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                />
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Primary Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Al-Otaibi"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+966-11-234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Office / Physical Address</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Street, District, City, Country"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#6D0808]" />
                Edit Client {selectedCustomer.customerCode}
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                />
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Primary Contact</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Status</label>
                  <select
                    value={formData.accountStatus}
                    onChange={(e) => setFormData({ ...formData, accountStatus: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Address</label>
                <textarea
                  rows="2"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <div>
                <h2 className="text-lg font-extrabold text-[#2D0000]">{selectedCustomer.customerName}</h2>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#F8F6EC] p-4 rounded-xl border border-[#D8D2BC]">
                <div>
                  <span className="text-[#757D6F] block font-medium">Client Code</span>
                  <span className="text-[#6D0808] font-mono font-bold">{selectedCustomer.customerCode}</span>
                </div>
                <div>
                  <span className="text-[#757D6F] block font-medium">Account Status</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#2D0000] mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${selectedCustomer.accountStatus === 'Active' ? 'bg-emerald-600' : selectedCustomer.accountStatus === 'Pending' ? 'bg-amber-500' : 'bg-red-600'}`}></span>
                    {selectedCustomer.accountStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[#757D6F] block font-medium">Primary Contact</span>
                  <span className="text-[#2D0000] font-semibold">{selectedCustomer.contactPerson}</span>
                </div>
                <div>
                  <span className="text-[#757D6F] block font-medium">Credit Facility</span>
                  <span className="text-[#2D0000] font-mono font-bold">
                    ${selectedCustomer.creditLimit?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-[#F8F6EC] p-4 rounded-xl border border-[#D8D2BC] space-y-2">
                <div className="flex items-center space-x-2 text-[#2D0000]">
                  <Mail className="w-4 h-4 text-[#757D6F]" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-[#2D0000]">
                  <Phone className="w-4 h-4 text-[#757D6F]" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-start space-x-2 text-[#2D0000]">
                  <MapPin className="w-4 h-4 text-[#757D6F] shrink-0 mt-0.5" />
                  <span>{selectedCustomer.address}</span>
                </div>
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
