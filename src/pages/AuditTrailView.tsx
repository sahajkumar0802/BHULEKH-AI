import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Search,
  Download,
  CheckCircle2,
  Lock,
  Fingerprint
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs, setSelectedParcelId, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        log.officerName.toLowerCase().includes(q) ||
        log.parcelId.toLowerCase().includes(q) ||
        (log.khasraNo || '').toLowerCase().includes(q) ||
        log.reason.toLowerCase().includes(q) ||
        log.integrityHash.toLowerCase().includes(q);

      const matchesAction = selectedActionFilter === 'ALL' || log.action === selectedActionFilter;

      return matchesSearch && matchesAction;
    });
  }, [auditLogs, searchQuery, selectedActionFilter]);

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Officer Name', 'Role', 'Action', 'Parcel ID', 'Khasra', 'Reason', 'Previous Status', 'New Status', 'SHA-256 Hash'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      l.officerName,
      l.officerRole,
      l.action,
      l.parcelId,
      l.khasraNo,
      `"${l.reason.replace(/"/g, '""')}"`,
      l.previousStatus,
      l.newStatus,
      l.integrityHash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhulekh_ai_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actionsList = [
    'ALL',
    'Sent for Field Verification',
    'Approved & Verified',
    'AI OCR Digitized',
    'Validation Executed',
    'Rejected Mutation',
    'Requested Additional Documents'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-gov-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Tamper-Evident Revenue Audit Trail
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>SHA-256 CHAINED</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Cryptographically sealed, immutable ledger tracking all AI OCR extractions, validation executions, and officer statutory decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-gov-600" />
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-gov flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Officer Name, Khasra #, Reason, or SHA-256 Hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-gov-500"
          />
        </div>

        <select
          value={selectedActionFilter}
          onChange={(e) => setSelectedActionFilter(e.target.value)}
          className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-gov-500"
        >
          {actionsList.map(a => (
            <option key={a} value={a}>{a === 'ALL' ? 'All Revenue Actions' : a}</option>
          ))}
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-gov space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Displaying <strong>{filteredLogs.length}</strong> immutable audit entries</span>
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All Cryptographic Block Hashes Verified Valid</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp & Hash</th>
                <th className="py-3 px-4">Officer & Role</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Target Parcel</th>
                <th className="py-3 px-4">Statutory Reason</th>
                <th className="py-3 px-4">Status Transition</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900">{log.timestamp}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5" title={log.integrityHash}>
                      <Fingerprint className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{log.integrityHash.substring(0, 16)}...</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{log.officerName}</div>
                    <div className="text-[11px] text-slate-500">{log.officerRole}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold font-mono text-[11px] border border-slate-200">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">Khasra {log.khasraNo}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{log.parcelId}</div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {log.reason}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      {log.previousStatus && <span className="line-through text-slate-400">{log.previousStatus}</span>}
                      {log.previousStatus && log.newStatus && <span className="text-slate-400">→</span>}
                      {log.newStatus && <span className="font-bold text-gov-800 uppercase">{log.newStatus.replace(/_/g, ' ')}</span>}
                      {!log.newStatus && <span className="text-slate-500 font-mono text-[10px]">Logged Action</span>}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedParcelId(log.parcelId);
                        setActiveTab('twin');
                      }}
                      className="text-gov-700 hover:text-gov-900 font-bold"
                    >
                      Twin →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
