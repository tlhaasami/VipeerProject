import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[VIPER Error Boundary Intercepted]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#EEEAD7] text-[#2D0000] flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white border border-[#D8D2BC] rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-[#6D0808]/10 text-[#6D0808] flex items-center justify-center border border-[#6D0808]/20">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D0808] bg-[#6D0808]/10 px-2.5 py-1 rounded-full border border-[#6D0808]/20">
                  Fault Interception Active
                </span>
                <h1 className="text-2xl font-extrabold text-[#2D0000] mt-1">Application Runtime Interception</h1>
              </div>
            </div>

            <p className="text-[#50574B] text-sm mb-4 leading-relaxed font-medium">
              An unexpected runtime error occurred during component execution. The system has safely isolated the fault and preserved session state without crashing the application window.
            </p>

            <div className="bg-[#F8F6EC] rounded-xl p-4 border border-[#D8D2BC] font-mono text-xs text-[#6D0808] mb-6 overflow-x-auto">
              <p className="font-bold text-[#6D0808] mb-1">Error: {this.state.error?.toString()}</p>
              <p className="text-[#757D6F] text-[11px] truncate">Component trace captured</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[#6D0808] hover:bg-[#820a0a] text-[#EEEAD7] font-semibold rounded-xl transition-all shadow-md shadow-[#6D0808]/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recover & Restart Session</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-5 py-2.5 bg-[#F8F6EC] hover:bg-[#EEEAD7] text-[#2D0000] font-semibold rounded-xl border border-[#D8D2BC] transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
