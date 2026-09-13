import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Shield, ArrowRight, UserCheck, Key, Compass } from 'lucide-react';

export const Login = ({ onLoginError }) => {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('coordinator');
  const [password, setPassword] = useState('admin123');
  const [domain, setDomain] = useState('coordinator');

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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-sm text-[#2D0000] placeholder-[#757D6F] focus:outline-none focus:border-[#6D0808] focus:ring-1 focus:ring-[#6D0808] transition-all font-medium"
                />
              </div>
            </div>

            {/* Domain Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#2D0000] uppercase tracking-wider mb-1.5">
                Select Workspace Domain
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757D6F]">
                  <Compass className="w-4 h-4" />
                </div>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-sm text-[#2D0000] focus:outline-none focus:border-[#6D0808] focus:ring-1 focus:ring-[#6D0808] transition-all capitalize cursor-pointer font-semibold"
                >
                  <option value="coordinator">Coordinator (Operations & Dispatch)</option>
                  <option value="supplier">Supplier (Fulfillment & Delivery)</option>
                  <option value="customer">Customer (Procurement & Orders)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] font-semibold rounded-xl text-sm transition-all shadow-md shadow-[#6D0808]/20 flex items-center justify-center space-x-2 group disabled:opacity-50"
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
                className="p-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] border border-[#D8D2BC] rounded-lg text-[#6D0808] font-bold text-center transition-all"
              >
                Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('supplier1', 'supp123', 'supplier')}
                className="p-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] border border-[#D8D2BC] rounded-lg text-[#2D0000] font-bold text-center transition-all"
              >
                Supplier
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('customer1', 'cust123', 'customer')}
                className="p-2 bg-[#F8F6EC] hover:bg-[#EEEAD7] border border-[#D8D2BC] rounded-lg text-[#2D0000] font-bold text-center transition-all"
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
