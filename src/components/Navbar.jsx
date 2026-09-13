import React from 'react';
import { Layers } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="shrink-0 sticky top-0 z-30 bg-white border-b border-[#D8D2BC] text-[#2D0000] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D0808] to-[#8A1212] flex items-center justify-center shadow-md shadow-[#6D0808]/20">
            <Layers className="w-5 h-5 text-[#EEEAD7]" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-[#2D0000]">
              VIPER <span className="text-[#6D0808]">SCM</span>
            </span>
            <p className="text-[11px] text-[#757D6F] leading-none font-medium">Supply Chain Management</p>
          </div>
        </div>
      </div>
    </header>
  );
};

