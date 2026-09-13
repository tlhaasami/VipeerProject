import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Shield, ArrowRight, UserCheck, Key, Compass, Building2, Truck, Users, ChevronDown, Check, Eye, EyeOff } from 'lucide-react';

export const Login = ({ onLoginError }) => {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('coordinator');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [domain, setDomain] = useState('coordinator');
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const domainOptions = [
    {
      id: 'coordinator',
      label: 'Coordinator (Operations & Dispatch)',
      shortLabel: 'Coordinator',
      icon: Building2
    },
    {
      id: 'supplier',
      label: 'Supplier (Fulfillment & Delivery)',
      shortLabel: 'Supplier',
      icon: Truck
    },
    {
      id: 'customer',
      label: 'Customer (Procurement & Orders)',
      shortLabel: 'Customer',
      icon: Users
    }
  ];

  const selectedDomainObj = domainOptions.find((d) => d.id === domain) || domainOptions[0];
  const SelectedIcon = selectedDomainObj.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDomainDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password, domain);
    if (!result.success) {
      onLoginError(result.reason, domain);
    }
  };

  const handleQuickFill = (u, p, d) => {
    setUsername(u);
    setPassword(p);
    setDomain(d);
    setDomainDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#EEEAD7] text-[#2D0000] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle warm decorative glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#6D0808]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6D0808] to-[#8A1212] text-[#EEEAD7] shadow-lg shadow-[#6D0808]/20 mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#2D0000]">
            VIPER <span className="text-[#6D0808]">SCM</span>
          </h1>
          <p className="text-[#757D6F] text-xs mt-1 font-medium">
            Ejada Supply Chain Management Platform
          </p>
          <div className="inline-flex items-center space-x-1.5 mt-2 bg-[#6D0808]/10 border border-[#6D0808]/25 px-3 py-1 rounded-full text-[11px] text-[#6D0808] font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure Enterprise Authentication</span>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-[#2D0000] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757D6F]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-sm text-[#2D0000] placeholder-[#757D6F] focus:outline-none focus:border-[#6D0808] focus:ring-1 focus:ring-[#6D0808] transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-[#2D0000] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757D6F]">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-sm text-[#2D0000] placeholder-[#757D6F] focus:outline-none focus:border-[#6D0808] focus:ring-1 focus:ring-[#6D0808] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#757D6F] hover:text-[#6D0808] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Custom Styled Domain Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#2D0000] uppercase tracking-wider mb-1.5">
                Select Workspace Domain
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDomainDropdownOpen(!domainDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F8F6EC] hover:bg-[#EEEAD7]/70 border border-[#D8D2BC] focus:border-[#6D0808] focus:ring-1 focus:ring-[#6D0808] rounded-xl text-sm text-[#2D0000] transition-all cursor-pointer text-left font-medium"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <SelectedIcon className="w-4 h-4 text-[#6D0808] shrink-0" />
                    <span className="truncate font-semibold text-xs sm:text-sm">{selectedDomainObj.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#757D6F] shrink-0 ml-2 transition-transform duration-200 ${
                      domainDropdownOpen ? 'rotate-180 text-[#6D0808]' : ''
                    }`}
                  />
                </button>

                {/* Floating Custom Menu */}
                {domainDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#D8D2BC] rounded-xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in duration-150">
                    {domainOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = opt.id === domain;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setDomain(opt.id);
                            setDomainDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors text-left ${
                            isSelected
                              ? 'bg-[#6D0808] text-[#EEEAD7] font-bold shadow-sm'
                              : 'text-[#2D0000] hover:bg-[#F8F6EC] font-medium'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#EEEAD7]' : 'text-[#6D0808]'}`} />
                            <span className="truncate">{opt.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 shrink-0 ml-2 text-[#EEEAD7]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] font-semibold rounded-xl text-sm transition-all shadow-md shadow-[#6D0808]/20 flex items-center justify-center space-x-2 group disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="mt-6 pt-5 border-t border-[#D8D2BC]">
            <p className="text-[11px] font-bold text-[#757D6F] uppercase tracking-wider mb-2.5 text-center">
              Quick Role Presets
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('coordinator', 'admin123', 'coordinator')}
                className={`p-2 border rounded-lg font-bold text-center transition-all cursor-pointer ${
                  domain === 'coordinator'
                    ? 'bg-[#6D0808] text-[#EEEAD7] border-[#6D0808]'
                    : 'bg-[#F8F6EC] hover:bg-[#EEEAD7] border-[#D8D2BC] text-[#6D0808]'
                }`}
              >
                Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('supplier1', 'supp123', 'supplier')}
                className={`p-2 border rounded-lg font-bold text-center transition-all cursor-pointer ${
                  domain === 'supplier'
                    ? 'bg-[#2D0000] text-[#EEEAD7] border-[#2D0000]'
                    : 'bg-[#F8F6EC] hover:bg-[#EEEAD7] border-[#D8D2BC] text-[#2D0000]'
                }`}
              >
                Supplier
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('customer1', 'cust123', 'customer')}
                className={`p-2 border rounded-lg font-bold text-center transition-all cursor-pointer ${
                  domain === 'customer'
                    ? 'bg-[#2D0000] text-[#EEEAD7] border-[#2D0000]'
                    : 'bg-[#F8F6EC] hover:bg-[#EEEAD7] border-[#D8D2BC] text-[#2D0000]'
                }`}
              >
                Customer
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-[#757D6F] font-medium">
          Ejada Company &bull; Supply Chain Management Operations
        </div>
      </div>
    </div>
  );
};
