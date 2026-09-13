import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Truck, Star, Phone, Mail, MapPin, Search } from 'lucide-react';
import { useToast } from '../../components/NotificationToast';

export const ManageSuppliers = () => {
  const { addToast } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await dataService.getSuppliers();
      setSuppliers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplierCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Tier-1 Supplier Network</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Certified hardware vendors, logistics partners, cloud distributors, and authorized service providers.
          </p>
        </div>
        <div className="text-xs font-bold text-[#6D0808] bg-[#F8F6EC] px-3.5 py-2 rounded-xl border border-[#D8D2BC]">
          {suppliers.length} Certified Partners
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#757D6F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers by name, specialty, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-xs text-[#2D0000] placeholder-[#757D6F] focus:outline-none focus:border-[#6D0808] font-medium"
          />
        </div>
        <span className="text-xs text-[#757D6F] font-bold font-mono">{filteredSuppliers.length} Listed</span>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuppliers.map((supp) => (
          <div
            key={supp.id}
            className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm space-y-3.5 hover:border-[#757D6F] transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#6D0808]">{supp.supplierCode}</span>
                <h3 className="text-base font-extrabold text-[#2D0000] mt-0.5">{supp.supplierName}</h3>
                <span className="text-xs text-[#50574B] font-medium">{supp.specialty}</span>
              </div>
              <div className="flex items-center space-x-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{supp.rating}</span>
              </div>
            </div>

            <div className="bg-[#F8F6EC] p-3 rounded-xl border border-[#D8D2BC] text-xs space-y-1.5">
              <div className="flex items-center space-x-2 text-[#2D0000]">
                <Mail className="w-3.5 h-3.5 text-[#757D6F]" />
                <span className="font-medium">{supp.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#2D0000]">
                <Phone className="w-3.5 h-3.5 text-[#757D6F]" />
                <span className="font-mono text-[11px]">{supp.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#2D0000]">
                <MapPin className="w-3.5 h-3.5 text-[#757D6F]" />
                <span>{supp.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#D8D2BC]">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#2D0000] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Active SLA Contract
              </span>
              <span className="text-[#757D6F] text-[11px] font-medium">Contact: {supp.contactName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
