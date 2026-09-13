import React, { useState, useEffect } from 'react';
import { Boxes, PackageCheck, AlertCircle, Warehouse, ArrowUpRight, BarChart2 } from 'lucide-react';
import { dataService } from '../../services/dataService';

export const SupplierWarehouse = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await dataService.getItems();
      setItems(data || []);
    };
    load();
  }, []);

  const stagingZones = [
    { zone: 'Bay A-01', type: 'Rack Servers & Blades', capacity: '85%', itemsCount: 42, status: 'Active' },
    { zone: 'Bay B-04', type: 'Networking & Switches', capacity: '60%', itemsCount: 28, status: 'Active' },
    { zone: 'Bay C-12', type: 'Storage Arrays & SAN', capacity: '40%', itemsCount: 14, status: 'Available' },
    { zone: 'Bay D-03', type: 'Software Media & Licenses', capacity: '95%', itemsCount: 110, status: 'Near Full' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D0000] tracking-tight">Staging & Warehouse Inventory</h1>
          <p className="text-xs text-[#757D6F] font-medium mt-1">
            Supplier dispatch buffer inventory, staging bays, and ready-to-ship stock levels.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-white border border-[#D8D2BC] rounded-xl text-[#2D0000] shadow-sm">
          <Warehouse className="w-4 h-4 text-[#6D0808]" />
          <span>Warehouse Utilization: 70%</span>
        </div>
      </div>

      {/* Staging Bays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stagingZones.map((z, idx) => (
          <div key={idx} className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6D0808] font-mono">{z.zone}</span>
              <span className={`w-2 h-2 rounded-full ${z.status === 'Active' ? 'bg-emerald-600' : z.status === 'Near Full' ? 'bg-amber-500' : 'bg-blue-600'}`} />
            </div>
            <p className="text-sm font-bold text-[#2D0000] mt-2 truncate">{z.type}</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-[#757D6F] uppercase font-bold">Staged Units</p>
                <p className="text-lg font-black text-[#2D0000]">{z.itemsCount}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#757D6F] uppercase font-bold">Bay Load</p>
                <p className="text-sm font-bold text-[#50574B]">{z.capacity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Stock Breakdown */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#D8D2BC] bg-[#F8F6EC] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2D0000] flex items-center space-x-2">
            <Boxes className="w-4 h-4 text-[#6D0808]" />
            <span>Buffer Stock & Catalog Allocations</span>
          </h2>
          <span className="text-xs text-[#757D6F]">Real-time sync with Ejada central inventory</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D0000]">
            <thead className="bg-[#F8F6EC] text-[#757D6F] uppercase tracking-wider border-b border-[#D8D2BC] font-bold">
              <tr>
                <th className="py-3 px-4">Item Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Available In-Stock</th>
                <th className="py-3 px-4">Allocated / Reserved</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8F6EC]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#6D0808]">
                    {item.itemCode || item.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#2D0000]">
                    {item.itemName || item.name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {item.quantityInStock || item.stock || 0} units
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#50574B]">
                    {Math.min(12, item.quantityInStock || item.stock || 0)} units
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2D0000]">
                    ${Number(item.price || item.unitPrice || 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      In Stock
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
