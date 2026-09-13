import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Package, Search, ShoppingCart, Check, Filter } from 'lucide-react';
import { useToast } from '../../components/NotificationToast';

export const BrowseCatalog = ({ onSelectProduct }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      const data = await dataService.getItems();
      setItems(data || []);
    };
    load();
  }, []);

  const filteredItems = items.filter((item) => {
    const name = item.itemName || item.name || '';
    const code = item.itemCode || item.id || '';
    return name.toLowerCase().includes(search.toLowerCase()) || code.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D0000] tracking-tight">Enterprise IT Catalog</h1>
          <p className="text-xs text-[#757D6F] font-medium mt-1">
            Certified enterprise hardware, high-availability servers, networking appliances, and software licenses.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#757D6F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equipment or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#D8D2BC] rounded-xl text-xs text-[#2D0000] placeholder-[#757D6F] focus:outline-none focus:ring-1 focus:ring-[#6D0808]"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id || item.itemCode}
            className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#6D0808] px-2 py-0.5 bg-[#6D0808]/10 rounded-md">
                  {item.itemCode || item.id}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-1"></span>
                  {item.quantityInStock || item.stock || 0} Available
                </span>
              </div>
              <h2 className="text-base font-bold text-[#2D0000] mt-3">
                {item.itemName || item.name}
              </h2>
              <p className="text-xs text-[#757D6F] mt-1.5 leading-relaxed">
                {item.description || 'Enterprise-grade hardware fully supported under standard Ejada 24/7 SLA maintenance.'}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#D8D2BC] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#757D6F] uppercase font-bold">Standard Price</p>
                <p className="text-lg font-black text-[#2D0000] font-mono">
                  ${Number(item.price || item.unitPrice || 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  if (onSelectProduct) {
                    onSelectProduct(item);
                  } else {
                    addToast(`Selected ${item.itemName || item.name}. Open "Submit New Request" to order.`, 'info');
                  }
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] text-xs font-bold transition-colors shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Request Quote</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
