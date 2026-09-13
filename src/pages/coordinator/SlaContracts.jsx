import React from 'react';
import { FileCheck, Shield, Clock, AlertTriangle, CheckCircle2, Award } from 'lucide-react';

export const SlaContracts = () => {
  const contracts = [
    {
      vendor: 'Dell Enterprise Middle East',
      scope: 'Server & Rack Hardware Supply',
      slaResponse: '< 4 Hours',
      slaDelivery: '48 - 72 Hours',
      uptimeGuaranteed: '99.9%',
      complianceRate: '99.4%',
      status: 'Active',
      renewalDate: 'Dec 2026'
    },
    {
      vendor: 'Cisco Systems Gulf LLC',
      scope: 'Core Routing & Security Appliances',
      slaResponse: '< 2 Hours',
      slaDelivery: '24 - 48 Hours',
      uptimeGuaranteed: '99.95%',
      complianceRate: '98.8%',
      status: 'Active',
      renewalDate: 'Nov 2026'
    },
    {
      vendor: 'Oracle Saudi Arabia',
      scope: 'Database & Middleware Licenses',
      slaResponse: '< 1 Hour',
      slaDelivery: 'Instant / Electronic',
      uptimeGuaranteed: '99.99%',
      complianceRate: '100.0%',
      status: 'Active',
      renewalDate: 'Mar 2027'
    },
    {
      vendor: 'HP Enterprise Solutions',
      scope: 'Storage Arrays & Backup Infrastructure',
      slaResponse: '< 6 Hours',
      slaDelivery: '3 - 5 Days',
      uptimeGuaranteed: '99.5%',
      complianceRate: '97.2%',
      status: 'Under Review',
      renewalDate: 'Oct 2026'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D0000] tracking-tight">SLA Terms & Vendor Contracts</h1>
          <p className="text-xs text-[#757D6F] font-medium mt-1">
            Service Level Agreement governance, vendor turnaround benchmarks, and penalty clause monitors.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-white border border-[#D8D2BC] rounded-xl text-[#2D0000] shadow-sm">
          <Award className="w-4 h-4 text-[#6D0808]" />
          <span>Overall SLA Compliance: 98.9%</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Active Vendor Master Agreements</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">4 Enforced</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">All verified under Ejada procurement policy</p>
        </div>
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Breach / Dispute Rate</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">0.6%</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Well below 2.0% maximum tolerance</p>
        </div>
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Avg. Allocation Speed</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">3.1 Hours</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Exceeds standard 8.0h threshold</p>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#D8D2BC] bg-[#F8F6EC] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2D0000] flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-[#6D0808]" />
            <span>Master Supplier SLA Matrix</span>
          </h2>
          <span className="text-xs text-[#757D6F]">Enforced under 2008 Ejada baseline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D0000]">
            <thead className="bg-[#F8F6EC] text-[#757D6F] uppercase tracking-wider border-b border-[#D8D2BC] font-bold">
              <tr>
                <th className="py-3 px-4">Vendor Name</th>
                <th className="py-3 px-4">Procurement Scope</th>
                <th className="py-3 px-4">Response SLA</th>
                <th className="py-3 px-4">Fulfillment SLA</th>
                <th className="py-3 px-4">Compliance Rating</th>
                <th className="py-3 px-4">Contract Status</th>
                <th className="py-3 px-4">Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {contracts.map((contract, idx) => (
                <tr key={idx} className="hover:bg-[#F8F6EC]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#2D0000]">
                    {contract.vendor}
                  </td>
                  <td className="py-3.5 px-4 text-[#50574B] font-medium">
                    {contract.scope}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#6D0808]">
                    {contract.slaResponse}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#2D0000]">
                    {contract.slaDelivery}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {contract.complianceRate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${contract.status === 'Active' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                      <span className="font-semibold">{contract.status}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#757D6F] font-mono">
                    {contract.renewalDate}
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
