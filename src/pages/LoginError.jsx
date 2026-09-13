import React from 'react';
import { AlertOctagon, RotateCcw, ShieldAlert } from 'lucide-react';

export const LoginError = ({ errorReason, attemptedDomain, onTryAgain }) => {
  return (
    <div className="min-h-screen bg-[#EEEAD7] text-[#2D0000] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6D0808]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 bg-white border border-[#D8D2BC] rounded-2xl p-8 shadow-xl text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#6D0808]/10 text-[#6D0808] border border-[#6D0808]/20 mb-5 shadow-sm">
          <AlertOctagon className="w-8 h-8" />
        </div>

        {/* Heading */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D0808] bg-[#6D0808]/10 px-3 py-1 rounded-full border border-[#6D0808]/20">
          Authentication Error
        </span>
        <h1 className="text-2xl font-bold text-[#2D0000] mt-3 mb-2">Login Unsuccessful</h1>

        {/* Description */}
        <p className="text-[#50574B] text-sm leading-relaxed mb-6 font-medium">
          {errorReason === 'DOMAIN_MISMATCH' ? (
            <>
              Your credentials are valid, but your account is not authorized for the{' '}
              <strong className="text-[#6D0808] capitalize">{attemptedDomain} Workspace</strong>. Please choose your assigned workspace.
            </>
          ) : (
            <>
              The username, password, or workspace domain provided was incorrect. Please check your credentials and try again.
            </>
          )}
        </p>

        {/* Action Button: "Try again" */}
        <button
          onClick={onTryAgain}
          className="w-full py-3 px-4 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] font-semibold rounded-xl text-sm transition-all shadow-md shadow-[#6D0808]/20 flex items-center justify-center space-x-2 group"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
          <span>[ Try again ]</span>
        </button>

        <div className="mt-6 pt-4 border-t border-[#D8D2BC] text-[11px] text-[#757D6F] flex items-center justify-center space-x-1.5 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-[#6D0808]" />
          <span>Security Notice: Failed attempt logged for account audit.</span>
        </div>
      </div>
    </div>
  );
};
