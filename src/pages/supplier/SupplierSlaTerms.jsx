import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileText, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SupplierSlaTerms = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D0000] tracking-tight">Partner SLA Terms & Compliance</h1>
          <p className="text-xs text-[#757D6F] font-medium mt-1">
            Supplier commitment thresholds, delivery turnaround guarantees, and contractual penalties.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-white border border-[#D8D2BC] rounded-xl text-[#2D0000] shadow-sm">
          <Award className="w-4 h-4 text-[#6D0808]" />
          <span>Vendor Rating: 99.1% (Tier 1 Preferred)</span>
        </div>
      </div>

      {/* SLA Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Required Commitment Response</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">&lt; 4 Hours</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Your avg response: 1.8 Hours</p>
        </div>
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">On-Time Dispatch Rate</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">99.4%</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Minimum required: 95.0%</p>
        </div>
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-[#757D6F] uppercase tracking-wider">Defect / RMA Rejection</p>
          <p className="text-2xl font-black text-[#2D0000] mt-1">0.12%</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Threshold limit: &lt; 1.0%</p>
        </div>
      </div>

      {/* Contract Terms Content */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-[#D8D2BC] pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2D0000] flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#6D0808]" />
              <span>Ejada Enterprise Vendor Agreement Terms</span>
            </h2>
            <p className="text-xs text-[#757D6F] mt-0.5">Agreement ID: VMA-2026-SA09 | Signed & Enforced</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
            Status: Fully Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#2D0000]">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#6D0808] uppercase tracking-wide">1. Allocation Acceptance</h3>
            <p className="text-[#50574B] leading-relaxed">
              Upon receiving a supply allocation from an Ejada Coordinator, the supplier must confirm or register delivery commitment within four (4) business hours. Failure to respond may trigger automatic re-routing to secondary suppliers.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#6D0808] uppercase tracking-wide">2. Packaging & Serial Integrity</h3>
            <p className="text-[#50574B] leading-relaxed">
              All dispatched IT hardware items must include manufacturer barcode serials and Ejada tamper-evident security labels. Damaged packages will be rejected at logistics transit checkpoints.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#6D0808] uppercase tracking-wide">3. Transit Milestones</h3>
            <p className="text-[#50574B] leading-relaxed">
              Suppliers are required to update dispatch milestone timestamps in the VIPER portal upon handoff to registered logistics freight carriers (Ejada Express, DHL, Aramex).
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#6D0808] uppercase tracking-wide">4. Invoice Settlement</h3>
            <p className="text-[#50574B] leading-relaxed">
              Fulfillment invoices are automatically validated and processed for payment within fifteen (15) days of customer delivery receipt confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
