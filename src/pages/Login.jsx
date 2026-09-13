import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import {
  Layers,
  ArrowRight,
  UserCheck,
  Building2,
  Truck,
  Users,
  ChevronDown,
  Check,
  Eye,
  EyeOff,
  UserPlus,
  X,
  Mail,
  Lock,
  Briefcase
} from 'lucide-react';

export const Login = ({ onLoginError }) => {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [domain, setDomain] = useState('coordinator');
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Register / Add User Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerDomainDropdownOpen, setRegisterDomainDropdownOpen] = useState(false);
  const registerDropdownRef = useRef(null);

  const [registerSuccessMessage, setRegisterSuccessMessage] = useState('');
  const [registerErrorMessage, setRegisterErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [registerFormData, setRegisterFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    domain: 'coordinator',
    roleTitle: ''
  });

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

  const selectedRegisterDomainObj =
    domainOptions.find((d) => d.id === registerFormData.domain) || domainOptions[0];
  const SelectedRegisterIcon = selectedRegisterDomainObj.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDomainDropdownOpen(false);
      }
      if (registerDropdownRef.current && !registerDropdownRef.current.contains(event.target)) {
        setRegisterDomainDropdownOpen(false);
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

  const handleOpenRegisterModal = () => {
    setRegisterFormData({
      fullName: '',
      username: '',
      email: '',
      password: '',
      domain: domain || 'coordinator',
      roleTitle: ''
    });
    setRegisterErrorMessage('');
    setRegisterSuccessMessage('');
    setRegisterDomainDropdownOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterErrorMessage('');
    setRegisterSuccessMessage('');

    if (
      !registerFormData.fullName.trim() ||
      !registerFormData.username.trim() ||
      !registerFormData.email.trim() ||
      !registerFormData.password
    ) {
      setRegisterErrorMessage('Please complete all required fields (*).');
      return;
    }

    setIsRegistering(true);
    try {
      await dataService.addUser(registerFormData);
      setRegisterSuccessMessage(`Account @${registerFormData.username.trim().toLowerCase()} successfully provisioned! Logging in...`);

      setTimeout(async () => {
        setIsRegisterModalOpen(false);
        setUsername(registerFormData.username.trim().toLowerCase());
        setPassword(registerFormData.password);
        setDomain(registerFormData.domain);
        const res = await login(
          registerFormData.username.trim().toLowerCase(),
          registerFormData.password,
          registerFormData.domain
        );
        if (!res.success) {
          onLoginError(res.reason, registerFormData.domain);
        }
      }, 900);
    } catch (err) {
      setRegisterErrorMessage(err.message || 'Error creating user account. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEAD7] text-[#2D0000] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle warm decorative glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#6D0808]/5 rounded-full blur-3xl pointer-events-none" />

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

            {/* Password Input with Show/Hide Toggle */}
            <div>
              <label className="block text-xs font-bold text-[#2D0000] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757D6F]">
                  <Lock className="w-4 h-4" />
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
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#757D6F] hover:text-[#6D0808] transition-colors cursor-pointer focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Workspace Domain Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#2D0000] uppercase tracking-wider mb-1.5">
                Target Domain
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDomainDropdownOpen(!domainDropdownOpen)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-sm text-[#2D0000] flex items-center justify-between font-semibold hover:border-[#6D0808] transition-all text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#6D0808]"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <div className="w-6 h-6 rounded-lg bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center shrink-0">
                      <SelectedIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{selectedDomainObj.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#757D6F] transition-transform duration-200 shrink-0 ml-2 ${
                      domainDropdownOpen ? 'rotate-180 text-[#6D0808]' : ''
                    }`}
                  />
                </button>

                {domainDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#D8D2BC] rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in duration-150">
                    {domainOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = domain === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setDomain(opt.id);
                            setDomainDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#6D0808] text-[#EEEAD7]'
                              : 'text-[#2D0000] hover:bg-[#F8F6EC]'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-white/20 text-[#EEEAD7]'
                                  : 'bg-[#6D0808]/10 text-[#6D0808]'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#EEEAD7]" />}
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

            {/* Create Account / Add User Button */}
            <div className="mt-4 pt-3 border-t border-[#D8D2BC]/60 flex items-center justify-center">
              <button
                type="button"
                onClick={handleOpenRegisterModal}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] border border-[#D8D2BC] text-[#6D0808] font-bold text-xs transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Register New Account / Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-[#757D6F] font-medium">
          Ejada Company &bull; Supply Chain Management Operations
        </div>
      </div>

      {/* Register / Provision Account Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#D8D2BC] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#D8D2BC] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2D0000]">Register New SCM Account</h3>
                  <p className="text-[10px] text-[#757D6F]">Create and provision a live user on the VIPER platform</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 text-[#757D6F] hover:text-[#2D0000] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {registerErrorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold leading-relaxed">
                {registerErrorMessage}
              </div>
            )}

            {registerSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold leading-relaxed">
                {registerSuccessMessage}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Full Legal Name *</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-[#757D6F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Faisal Al-Zahrani"
                    value={registerFormData.fullName}
                    onChange={(e) =>
                      setRegisterFormData({ ...registerFormData, fullName: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D0000] mb-1">Username * (Must be Unique)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. fazahrani"
                    value={registerFormData.username}
                    onChange={(e) =>
                      setRegisterFormData({ ...registerFormData, username: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2D0000] mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={registerFormData.password}
                      onChange={(e) =>
                        setRegisterFormData({ ...registerFormData, password: e.target.value })
                      }
                      className="w-full pl-3 pr-8 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#757D6F] hover:text-[#6D0808] cursor-pointer"
                    >
                      {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Email Address * (Must be Unique)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#757D6F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="faisal@ejada.com"
                    value={registerFormData.email}
                    onChange={(e) =>
                      setRegisterFormData({ ...registerFormData, email: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                  />
                </div>
              </div>

              {/* Custom Styled Workspace Domain Dropdown */}
              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Workspace Domain *</label>
                <div className="relative" ref={registerDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setRegisterDomainDropdownOpen(!registerDomainDropdownOpen)}
                    className="w-full px-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-xs text-[#2D0000] flex items-center justify-between font-semibold hover:border-[#6D0808] transition-all text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#6D0808]"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <div className="w-5 h-5 rounded-md bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center shrink-0">
                        <SelectedRegisterIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{selectedRegisterDomainObj.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#757D6F] transition-transform duration-200 shrink-0 ml-2 ${
                        registerDomainDropdownOpen ? 'rotate-180 text-[#6D0808]' : ''
                      }`}
                    />
                  </button>

                  {registerDomainDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D8D2BC] rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in duration-150">
                      {domainOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = registerFormData.domain === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setRegisterFormData({ ...registerFormData, domain: opt.id });
                              setRegisterDomainDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs font-semibold transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#6D0808] text-[#EEEAD7]'
                                : 'text-[#2D0000] hover:bg-[#F8F6EC]'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-white/20 text-[#EEEAD7]'
                                    : 'bg-[#6D0808]/10 text-[#6D0808]'
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                              </div>
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#EEEAD7]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D0000] mb-1">Official Position / Role Title</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#757D6F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Senior Procurement Officer"
                    value={registerFormData.roleTitle}
                    onChange={(e) =>
                      setRegisterFormData({ ...registerFormData, roleTitle: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-[#2D0000] focus:outline-none focus:border-[#6D0808]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#50574B] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="px-4 py-2 rounded-xl bg-[#6D0808] hover:bg-[#2D0000] text-[#EEEAD7] font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isRegistering ? 'Provisioning...' : 'Save & Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
