import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  FileCheck2, 
  UserCheck, 
  AlertCircle, 
  Server, 
  CheckCircle2,
  Database
} from 'lucide-react';

export const SecurityCenter: React.FC = () => {
  const { activeRole } = useApp();

  const securityFeatures = [
    {
      title: 'Role-Based Access Control (RBAC)',
      desc: 'Enforces strict separation of duty between Citizen, Patwari, Tehsildar, and District Collector roles.',
      status: 'Enforced',
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'SHA-256 Cryptographic Integrity',
      desc: 'Every scanned deed, RoR, and mutation order is hashed on ingest to prevent undetected document tampering.',
      status: 'Active',
      icon: Lock,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Immutable Audit Trail Architecture',
      desc: 'All quasi-judicial approvals, field corrections, and re-surveys are appended to a tamper-evident audit ledger.',
      status: 'Active (Chain Verified)',
      icon: FileCheck2,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Transport Layer Security (TLS 1.3)',
      desc: 'All government adapter calls utilize mTLS / HTTPS encryption with forward secrecy and token rotation.',
      status: 'Compliant',
      icon: Server,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      title: 'Least-Privilege Quasi-Judicial Gates',
      desc: 'Citizens have read-only access to certified RoRs; only Tehsildars can sanction or dispute title mutations.',
      status: 'Active',
      icon: KeyRound,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Encrypted Ground Truth Feedback Vault',
      desc: 'AI training pairs collected from officer corrections are sanitized and stored securely.',
      status: 'Active',
      icon: Database,
      color: 'text-rose-600 bg-rose-50'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <ShieldCheck className="w-7 h-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Security & Compliance Center
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Government Grade
              </span>
            </h1>
            <p className="text-sm text-slate-600">
              Security controls, cryptographic hash integrity, and role permissions.
            </p>
          </div>
        </div>
        <div className="text-xs px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-medium">
          Active Session Role: <strong className="text-indigo-600 uppercase font-mono">{activeRole}</strong>
        </div>
      </div>

      {/* Honest Compliance Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold">Compliance Transparency Declaration:</p>
          <p className="text-amber-800 mt-0.5">
            Security policies follow standard MeitY e-Governance Information Security Guidelines. As a prototype demonstration, cryptographic hashing is performed via simulated in-browser algorithms without formal STQC third-party audit certification.
          </p>
        </div>
      </div>

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {securityFeatures.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`p-2 rounded-lg ${f.color}`}><Icon className="w-5 h-5" /></span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {f.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{f.title}</h3>
                <p className="text-xs text-slate-600">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
          <p className="text-xs text-slate-500">Fine-grained operational permissions across the land digitization lifecycle</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Permission Scope</th>
                <th className="px-4 py-3 text-center">Citizen</th>
                <th className="px-4 py-3 text-center">Patwari (RI)</th>
                <th className="px-4 py-3 text-center">Tehsildar (CO)</th>
                <th className="px-4 py-3 text-center">District Collector</th>
                <th className="px-4 py-3 text-center">System Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">View Verified RoR & GIS Maps</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Upload Land Documents for AI OCR</td>
                <td className="px-4 py-3 text-center text-slate-300">✗ Restricted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Edit AI Field Corrections (Training Feedback)</td>
                <td className="px-4 py-3 text-center text-slate-300">✗ Restricted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-slate-300">✗ Restricted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">Quasi-Judicial Approval / Dispute Sanction</td>
                <td className="px-4 py-3 text-center text-slate-300">✗ Restricted</td>
                <td className="px-4 py-3 text-center text-slate-300">✗ Restricted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Appeal Only</td>
                <td className="px-4 py-3 text-center text-slate-300">✗ Restricted</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900">District Executive Analytics & Export</td>
                <td className="px-4 py-3 text-center text-slate-300">✗ Restricted</td>
                <td className="px-4 py-3 text-center text-slate-300">✗ Restricted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
