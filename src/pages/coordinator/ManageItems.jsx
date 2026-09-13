import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useToast } from '../../components/NotificationToast';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  X
} from 'lucide-react';

export const ManageItems = () => {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    category: 'Servers & Hardware',
    description: '',
    unitPrice: 1000.0,
    stockQuantity: 10,
    reorderLevel: 5,
    unitOfMeasure: 'Units'
  });

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await dataService.getItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleOpenAdd = () => {
    const nextNum = items.length + 1;
    setFormData({
      itemCode: `ITEM-${String(nextNum).padStart(3, '0')}`,
      itemName: '',
      category: 'Servers & Hardware',
      description: '',
      unitPrice: 2500.0,
      stockQuantity: 15,
      reorderLevel: 5,
      unitOfMeasure: 'Units'
    });
    setShowAddModal(true);
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      if (parseFloat(formData.unitPrice) < 0 || parseInt(formData.stockQuantity, 10) < 0) {
        addToast('Price and stock quantity must be non-negative.', 'error');
        return;
      }
      await dataService.addItem(formData);
      addToast(`Item "${formData.itemName}" added to catalog.`, 'success');
      setShowAddModal(false);
      loadItems();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      itemCode: item.itemCode,
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      unitPrice: item.unitPrice,
      stockQuantity: item.stockQuantity,
      reorderLevel: item.reorderLevel,
      unitOfMeasure: item.unitOfMeasure
    });
    setShowEditModal(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await dataService.updateItem(selectedItem.id, formData);
      addToast(`Item "${selectedItem.itemCode}" updated successfully.`, 'success');
      setShowEditModal(false);
      loadItems();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete item "${name}"?`)) {
      try {
        await dataService.deleteItem(id);
        addToast(`Item "${name}" removed from catalog.`, 'success');
        loadItems();
      } catch (err) {
        addToast(`Cannot delete item: ${err.message}`, 'error');
      }
    }
  };

  const categories = ['ALL', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter((i) => {
    const matchesSearch =
      i.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || i.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">IT Catalog & Inventory Control</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Maintain product catalog, pricing matrices, hardware specifications, software licenses, and stock reorder thresholds.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] rounded-xl text-xs font-semibold shadow-md shadow-[#6D0808]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Catalog Item</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#757D6F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by code, name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-xs text-[#2D0000] placeholder-[#757D6F] focus:outline-none focus:border-[#6D0808] font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#757D6F]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl px-3 py-2 text-xs text-[#2D0000] font-semibold focus:outline-none focus:border-[#6D0808]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6EC] text-[#50574B] border-b border-[#D8D2BC]">
              <tr>
                <th className="p-3.5">Item Code</th>
                <th className="p-3.5">Item Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Unit Price</th>
                <th className="p-3.5 text-center">Available Stock</th>
                <th className="p-3.5 text-center">Reorder Level</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#757D6F] font-medium">
                    No items found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.stockQuantity <= item.reorderLevel;
                  return (
                    <tr key={item.id} className="hover:bg-[#F8F6EC] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#6D0808]">{item.itemCode}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-[#2D0000]">{item.itemName}</div>
                        <div className="text-[11px] text-[#50574B] max-w-sm truncate">{item.description}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F8F6EC] text-[#2D0000] border border-[#D8D2BC]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-[#2D0000]">
                        ${item.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded ${
                            isLow ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'text-[#2D0000]'
                          }`}
                        >
                          {item.stockQuantity} {item.unitOfMeasure}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono text-[#757D6F] font-semibold">{item.reorderLevel}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 bg-[#F8F6EC] hover:bg-[#6D0808]/10 text-[#6D0808] rounded-lg transition-colors border border-[#D8D2BC]"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.itemName)}
                            className="p-1.5 bg-[#F8F6EC] hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-[#D8D2BC]"
                            title="Delete Item"
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#6D0808]" />
                Add Catalog Product
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Item Code</label>
                  <input
                    type="text"
                    required
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-semibold"
                  >
                    <option value="Servers & Hardware">Servers & Hardware</option>
                    <option value="Networking">Networking</option>
                    <option value="Software & Licenses">Software & Licenses</option>
                    <option value="Business Consultation">Business Consultation</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Power & Infrastructure">Power & Infrastructure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco Nexus 9000 Series Spine Switch"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Technical Specifications / Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Port density, throughput, processor cores, support term..."
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white border border-[#D8D2BC] w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D2BC]">
              <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#6D0808]" />
                Edit Item {selectedItem.itemCode}
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-[#757D6F] hover:text-[#2D0000]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-semibold"
                  >
                    <option value="Servers & Hardware">Servers & Hardware</option>
                    <option value="Networking">Networking</option>
                    <option value="Software & Licenses">Software & Licenses</option>
                    <option value="Business Consultation">Business Consultation</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Power & Infrastructure">Power & Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#2D0000] font-bold mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    className="w-full bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl p-2.5 text-[#2D0000] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2D0000] font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
    </div>
  );
};
