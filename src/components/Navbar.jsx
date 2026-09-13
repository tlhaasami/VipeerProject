import React from 'react';
import { Layers, Menu, X, Building2, Truck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { domain, currentUser } = useAuth();

  const getDomainIcon = () => {
    switch (domain) {
      case 'coordinator':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'supplier':
        return <Truck className="w-3.5 h-3.5" />;
      case 'customer':
        return <Users className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const userInitials = currentUser?.fullName
    ? currentUser.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="shrink-0 sticky top-0 z-40 bg-white border-b border-[#D8D2BC] text-[#2D0000] shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Hamburger (Mobile/Tablet) & Brand Logo */}
        <div className="flex items-center space-x-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-xl bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] border border-[#D8D2BC] transition-all cursor-pointer shrink-0"
              title={isMobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#6D0808]" /> : <Menu className="w-5 h-5 text-[#2D0000]" />}
            </button>
          )}

          <div className="flex items-center space-x-2.5">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-gradient-to-tr from-[#6D0808] to-[#8A1212] flex items-center justify-center shadow-md shadow-[#6D0808]/20 shrink-0">
              <Layers className="w-5 h-5 text-[#EEEAD7]" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#2D0000] block leading-none">
                VIPER <span className="text-[#6D0808]">SCM</span>
              </span>
              <p className="text-[10px] sm:text-[11px] text-[#757D6F] leading-none font-medium mt-1 hidden xs:block">
                Supply Chain Management
              </p>
            </div>
          </div>
        </div>

        {/* Right: Active User Profile & Workspace Info in Navbar */}
        <div className="flex items-center space-x-3">
          {domain && (
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-[#F8F6EC] border border-[#D8D2BC] rounded-xl text-xs font-bold text-[#2D0000]">
              <span className="text-[#6D0808]">{getDomainIcon()}</span>
              <span className="capitalize">{domain} Workspace</span>
            </div>
          )}

          {currentUser && (
            <div className="flex items-center space-x-2.5 pl-2 sm:border-l sm:border-[#D8D2BC]">
              <div className="w-9 h-9 rounded-xl bg-[#6D0808] text-[#EEEAD7] font-extrabold text-xs flex items-center justify-center shadow-sm border border-[#6D0808]/20 shrink-0">
                {userInitials}
              </div>
              <div className="hidden sm:block text-left leading-tight min-w-0">
                <p className="text-xs font-bold text-[#2D0000] truncate max-w-[130px] md:max-w-[170px] lg:max-w-[210px]">
                  {currentUser.fullName || currentUser.username}
                </p>
                <p className="text-[10px] text-[#757D6F] font-medium truncate max-w-[130px] md:max-w-[170px] lg:max-w-[210px]">
                  {currentUser.roleTitle || `@${currentUser.username}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
