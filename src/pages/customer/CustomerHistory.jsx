import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { FileText, Receipt, CheckCircle2 } from 'lucide-react';

export const CustomerHistory = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const [allReqs, allItems] = await Promise.all([
        dataService.getRequests(),
        dataService.getItems()
      ]);
      const myReqs = allReqs.filter((r) => !currentUser?.customerId || r.customerId === currentUser.customerId);
      setRequests(myReqs);
      setItems(allItems);
    };
    loadHistory();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#2D0000]">Order Invoices & Fulfillment Archives</h1>
        <p className="text-[#50574B] text-xs mt-0.5 font-medium">
          Historical procurement ledger, itemized valuations, completion timestamps, and accounting records.
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6EC] text-[#50574B] border-b border-[#D8D2BC]">
              <tr>
                <th className="p-3.5">Invoice / Order Code</th>
                <th className="p-3.5">Item Description</th>
                <th className="p-3.5 text-center">Quantity</th>
                <th className="p-3.5 text-right">Unit Price</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#757D6F] font-medium">
                    No order history recorded.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const itm = items.find((i) => i.id === req.itemId);
                  const total = itm ? itm.unitPrice * req.quantity : 0;

                  return (
                    <tr key={req.id} className="hover:bg-[#F8F6EC] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#6D0808]">{req.requestCode}</td>
                      <td className="p-3.5 font-semibold text-[#2D0000]">{itm?.itemName || 'Product Spec'}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-[#2D0000]">{req.quantity}</td>
                      <td className="p-3.5 text-right font-mono text-[#50574B]">
                        ${itm?.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-[#2D0000]">
                        ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium">
                          <span className={`w-2 h-2 rounded-full ${
                            req.status === 'Completed' ? 'bg-emerald-600' :
                            req.status === 'Accepted' ? 'bg-emerald-500' :
                            req.status === 'In-Review' ? 'bg-amber-500' :
                            req.status === 'Assigned' ? 'bg-purple-500' : 'bg-blue-500'
                          }`}></span>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono text-[#757D6F]">
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
    </div>
  );
};
