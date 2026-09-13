import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../components/NotificationToast';
import {
  Users,
  UserPlus,
  Search,
  Building2,
  Truck,
  Shield,
  Trash2,
  Edit2,
  Key,
  Mail,
  CheckCircle2,
  X,
  Filter,
  UserCheck
} from 'lucide-react';

export const ManageUsers = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    domain: 'coordinator',
    roleTitle: ''
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await dataService.getUsers();
      setUsers(data || []);
    } catch (err) {
      addToast('Failed to load user records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      fullName: '',
      username: '',
      email: '',
      password: '',
      domain: 'coordinator',
      roleTitle: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setCurrentUserToEdit(user);
    setFormData({
      fullName: user.fullName || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      domain: user.domain || 'coordinator',
      roleTitle: user.roleTitle || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveNewUser = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    try {
      await dataService.addUser(formData);
      addToast(`User ${formData.fullName} successfully provisioned!`, 'success');
      setIsAddModalOpen(false);
      loadUsers();
    } catch (err) {
      addToast('Error provisioning user account', 'error');
    }
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      addToast('Please fill required fields', 'error');
      return;
    }

    try {
      await dataService.updateUser(currentUserToEdit.id, formData);
      addToast(`User ${formData.fullName} updated successfully!`, 'success');
      setIsEditModalOpen(false);
      setCurrentUserToEdit(null);
      loadUsers();
    } catch (err) {
      addToast('Error updating user', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await dataService.deleteUser(userToDelete.id, userToDelete.username);
      addToast(`User account ${userToDelete.fullName} removed`, 'info');
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      addToast('Error removing user account', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesDomain =
      selectedDomainFilter === 'all' || u.domain.toLowerCase() === selectedDomainFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (u.fullName && u.fullName.toLowerCase().includes(query)) ||
      (u.username && u.username.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.roleTitle && u.roleTitle.toLowerCase().includes(query));
    return matchesDomain && matchesSearch;
  });

  const coordCount = users.filter((u) => u.domain === 'coordinator').length;
  const suppCount = users.filter((u) => u.domain === 'supplier').length;
  const custCount = users.filter((u) => u.domain === 'customer').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D0000] tracking-tight">User & Access Management</h1>
          <p className="text-xs text-[#757D6F] font-medium mt-1">
            Enterprise RBAC identity governance, user provisioning, and role lifecycle management.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold rounded-xl text-xs transition-all shadow-md shadow-[#6D0808]/20 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Total User Accounts</p>
            <Users className="w-4 h-4 text-[#6D0808]" />
          </div>
          <p className="text-2xl font-black text-[#2D0000] mt-1">{users.length}</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-1.5"></span>
            100% Active in Database
          </p>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">SCM Coordinators</p>
            <Building2 className="w-4 h-4 text-[#6D0808]" />
          </div>
          <p className="text-2xl font-black text-[#2D0000] mt-1">{coordCount}</p>
          <p className="text-[11px] text-[#50574B] font-semibold mt-1">Full Operations Authority</p>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Certified Suppliers</p>
            <Truck className="w-4 h-4 text-[#757D6F]" />
          </div>
          <p className="text-2xl font-black text-[#2D0000] mt-1">{suppCount}</p>
          <p className="text-[11px] text-[#50574B] font-semibold mt-1">Tier-1 Hardware Partners</p>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Corporate Clients</p>
            <Shield className="w-4 h-4 text-[#2D0000]" />
          </div>
          <p className="text-2xl font-black text-[#2D0000] mt-1">{custCount}</p>
          <p className="text-[11px] text-[#50574B] font-semibold mt-1">Procurement Organizations</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Domain Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Users', count: users.length },
            { id: 'coordinator', label: 'Coordinators', count: coordCount },
            { id: 'supplier', label: 'Suppliers', count: suppCount },
            { id: 'customer', label: 'Customers', count: custCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDomainFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                selectedDomainFilter === tab.id
                  ? 'bg-[#6D0808] text-[#EEEAD7] shadow-sm'
                  : 'bg-[#F8F6EC] text-[#50574B] hover:text-[#2D0000] hover:bg-[#EEEAD7]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedDomainFilter === tab.id ? 'bg-white/20 text-[#EEEAD7]' : 'bg-black/5 text-[#757D6F]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#757D6F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, username, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-xs text-[#2D0000] placeholder-[#757D6F] focus:outline-none focus:border-[#6D0808] font-medium"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D0000]">
            <thead className="bg-[#F8F6EC] text-[#757D6F] uppercase tracking-wider border-b border-[#D8D2BC] font-bold">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Workspace Domain</th>
                <th className="py-3.5 px-4">Role Title / Position</th>
                <th className="py-3.5 px-4">Contact Email</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#757D6F]">
                    Loading user directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#757D6F]">
                    No matching user records found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const domainColor =
                    u.domain === 'coordinator'
                      ? 'bg-[#6D0808]/10 text-[#6D0808] border-[#6D0808]/20'
                      : u.domain === 'supplier'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200';

                  const initials = u.fullName
                    ? u.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()
                    : 'U';

                  return (
                    <tr key={u.id || u.username} className="hover:bg-[#F8F6EC]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#6D0808] text-[#EEEAD7] font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-[#2D0000]">{u.fullName || u.username}</p>
                            <p className="font-mono text-[10px] text-[#757D6F]">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${domainColor}`}>
                          {u.domain}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#50574B]">
                        {u.roleTitle || 'Authorized Specialist'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#50574B]">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-[#50574B] hover:text-[#6D0808] hover:bg-[#F8F6EC] rounded-lg transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove User"
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

      {/* Provision User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#D8D2BC] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#D8D2BC] pb-3">
              <h3 className="text-base font-bold text-[#2D0000] flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-[#6D0808]" />
                <span>Provision New User Account</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#757D6F] hover:text-[#2D0000] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faisal Al-Zahrani"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D0000] mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. fazahrani"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2D0000] mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="faisal@ejada.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Workspace Domain *</label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808] font-semibold capitalize"
                >
                  <option value="coordinator">Coordinator (Operations & Dispatch)</option>
                  <option value="supplier">Supplier (Fulfillment & Delivery)</option>
                  <option value="customer">Customer (Procurement & Orders)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Official Position / Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Dispatch Engineer"
                  value={formData.roleTitle}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#50574B] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold shadow-md cursor-pointer"
                >
                  Save & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#D8D2BC] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#D8D2BC] pb-3">
              <h3 className="text-base font-bold text-[#2D0000] flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-[#6D0808]" />
                <span>Edit User Account (@{currentUserToEdit?.username})</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-[#757D6F] hover:text-[#2D0000] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Position / Role Title</label>
                <input
                  type="text"
                  value={formData.roleTitle}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Reset Password (Leave blank to keep unchanged)</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#50574B] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#D8D2BC] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <h3 className="text-sm font-bold text-rose-700 flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Confirm Account Removal</span>
            </h3>
            <p className="text-[#50574B] leading-relaxed">
              Are you sure you want to remove user <strong>{userToDelete.fullName}</strong> (@{userToDelete.username})? This user will lose access to the VIPER platform immediately.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-3 py-1.5 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#50574B] font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
