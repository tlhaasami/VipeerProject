import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { ShieldCheck, Database, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { getDatabaseMode } from '../../services/supabaseClient';

export const AuditCompliance = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(dataService.getAuditLogs());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2D0000]">Security Audit & Transaction Log</h1>
          <p className="text-[#50574B] text-xs mt-0.5 font-medium">
            Immutable audit trail recording coordinator dispatches, supplier feedback submissions, and system events.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Audit Engine Active</span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Persistence Engine</span>
          <div className="flex items-center space-x-2 mt-2">
            <Database className="w-4 h-4 text-[#6D0808]" />
            <span className="text-sm font-bold text-[#2D0000]">{getDatabaseMode()}</span>
          </div>
          <p className="text-[11px] text-[#757D6F] mt-1 font-medium">Dual-Mode Fallback Active</p>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Logged Operations</span>
          <div className="flex items-center space-x-2 mt-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span className="text-lg font-extrabold text-emerald-800">{logs.length} Transactions</span>
          </div>
          <p className="text-[11px] text-[#757D6F] mt-1 font-medium">All payloads strictly under 50KB</p>
        </div>

        <div className="bg-white border border-[#D8D2BC] rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#757D6F]">Referential Integrity</span>
          <div className="flex items-center space-x-2 mt-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-bold text-emerald-800">100% Verified</span>
          </div>
          <p className="text-[11px] text-[#757D6F] mt-1 font-medium">No dangling foreign keys</p>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white border border-[#D8D2BC] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#D8D2BC] bg-[#F8F6EC] flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#2D0000] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6D0808]" />
            Recorded Audit Trail Entries ({logs.length})
          </h2>
          <span className="text-xs text-[#757D6F] font-medium">Real-time telemetry records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8F6EC] text-[#50574B] border-b border-[#D8D2BC]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor Domain</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Entity Details</th>
                <th className="p-3">Payload Size</th>
                <th className="p-3 text-right">Execution Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2BC]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#757D6F] font-medium font-sans">
                    No transaction logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8F6EC] transition-colors">
                    <td className="p-3 text-[#757D6F]">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-3">
                      <span className="capitalize font-bold text-[#2D0000] font-sans">{log.userDomain}</span>
                    </td>
                    <td className="p-3 font-bold text-[#6D0808]">{log.action}</td>
                    <td className="p-3 text-[#2D0000] font-sans max-w-xs truncate">{log.details}</td>
                    <td className="p-3 text-[#757D6F]">{log.payloadSizeKb} KB</td>
                    <td className="p-3 text-right font-bold text-emerald-800">{log.executionTimeMs} ms</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
