import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { BarChart3, TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const AnalyticsReports = () => {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [reqs, itms] = await Promise.all([
          dataService.getRequests(),
          dataService.getItems()
        ]);
        setRequests(reqs);
        setItems(itms);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const totalOrders = requests.length;
  const completedOrders = requests.filter((r) => r.status === 'Completed').length;
  const activeOrders = requests.filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled').length;
  const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0;

  const totalValue = requests.reduce((acc, r) => {
    const item = items.find((i) => i.id === r.itemId);
    return acc + (item ? item.unitPrice * r.quantity : 0);
  }, 0);

  const priorityCounts = {
    Critical: requests.filter((r) => r.priority === 'Critical').length,
    High: requests.filter((r) => r.priority === 'High').length,
    Medium: requests.filter((r) => r.priority === 'Medium').length,
    Low: requests.filter((r) => r.priority === 'Low').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#2D0000]">Procurement Analytics & Reports</h1>
        <p className="text-[#50574B] text-xs mt-0.5 font-medium">
          Comprehensive operational KPIs, order fulfillment throughput, expenditure distribution, and SLA adherence.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Total Pipeline Value</span>
            <div className="w-9 h-9 rounded-xl bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#2D0000]">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-[11px] text-[#757D6F] font-medium">Across {totalOrders} total supply orders</p>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Active Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-blue-900">{activeOrders} Orders</div>
          <p className="mt-1 text-[11px] text-[#757D6F] font-medium">Currently in procurement & dispatch</p>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Completion Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-emerald-800">{completionRate}%</div>
          <p className="mt-1 text-[11px] text-[#757D6F] font-medium">{completedOrders} fulfilled successfully</p>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Average Lead Time</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-[#2D0000]">8.4 Days</div>
          <p className="mt-1 text-[11px] text-[#757D6F] font-medium">From request to supplier fulfillment</p>
        </div>
      </div>

      {/* Priority Distribution Bar Chart Representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#6D0808]" />
            Order Volume by Priority Level
          </h2>
          <div className="space-y-3">
            {Object.entries(priorityCounts).map(([priority, count]) => {
              const pct = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(0) : 0;
              const color =
                priority === 'Critical'
                  ? 'bg-red-600'
                  : priority === 'High'
                  ? 'bg-amber-500'
                  : priority === 'Medium'
                  ? 'bg-blue-500'
                  : 'bg-slate-400';
              return (
                <div key={priority} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-[#2D0000]">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${color}`}></span>
                      {priority} Priority
                    </span>
                    <span className="font-mono font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F8F6EC] rounded-full h-2 overflow-hidden border border-[#D8D2BC]">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLA Adherence & Health */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            SLA Performance Adherence
          </h2>
          <div className="p-4 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#757D6F] font-medium">On-Time Fulfillment:</span>
              <span className="text-emerald-800 font-bold">96.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#757D6F] font-medium">Supplier Response Time:</span>
              <span className="text-[#2D0000] font-bold">&lt; 24 Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#757D6F] font-medium">Order Accuracy:</span>
              <span className="text-emerald-800 font-bold">100.0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#757D6F] font-medium">Customer Satisfaction:</span>
              <span className="text-[#6D0808] font-bold">4.9 / 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
