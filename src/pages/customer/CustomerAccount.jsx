import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Building2, Mail, Phone, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

export const CustomerAccount = () => {
  const { currentUser } = useAuth();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const loadAccount = async () => {
      const custs = await dataService.getCustomers();
      const myCust = custs.find((c) => c.id === currentUser?.customerId) || custs[0];
      setCustomer(myCust);
    };
    loadAccount();
  }, [currentUser]);

  if (!customer) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#2D0000]">Enterprise Client Profile</h1>
        <p className="text-[#50574B] text-xs mt-0.5 font-medium">
          Authorized corporate account details, active credit facility limits, and delivery billing address.
        </p>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#D8D2BC]">
            <div className="w-12 h-12 rounded-xl bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-[#6D0808]">{customer.customerCode}</span>
              <h2 className="text-base font-extrabold text-[#2D0000]">{customer.customerName}</h2>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center space-x-2 text-[#2D0000]">
              <Mail className="w-4 h-4 text-[#757D6F]" />
              <span className="font-medium">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-[#2D0000]">
              <Phone className="w-4 h-4 text-[#757D6F]" />
              <span className="font-mono">{customer.phone}</span>
            </div>
            <div className="flex items-start space-x-2 text-[#2D0000]">
              <MapPin className="w-4 h-4 text-[#757D6F] shrink-0 mt-0.5" />
              <span>{customer.address}</span>
            </div>
          </div>
        </div>

        {/* Credit & Security Facility */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-[#2D0000] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#6D0808]" />
            Credit Facility & Account Health
          </h2>

          <div className="p-4 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl space-y-3">
            <div>
              <span className="text-xs text-[#757D6F] font-medium block">Approved Credit Facility</span>
              <span className="text-2xl font-extrabold text-[#2D0000] font-mono">
                ${customer.creditLimit?.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#D8D2BC]">
              <span className="text-[#757D6F] font-medium">Account Standing:</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {customer.accountStatus} (Good Standing)
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-[#757D6F] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6D0808]" />
              <span>Ejada Enterprise SLA Agreement Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
