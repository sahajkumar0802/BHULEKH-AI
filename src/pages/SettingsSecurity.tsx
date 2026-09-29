import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/landRecord';
import {
  Settings,
  Lock,
  CheckCircle2,
  Users,
  Globe
} from 'lucide-react';

export const SettingsSecurity: React.FC = () => {
  const { activeRole, setActiveRole } = useApp();

  const rbacMatrix: { role: UserRole; title: string; permissions: string[] }[] = [
    {
      role: 'citizen',
      title: 'Citizen / Landholder',
      permissions: ['Search Public RoR Records', 'View Digital Land Twin', 'Download Certified Jamabandi Copy', 'Track Mutation Application Status']
    },
    {
      role: 'patwari',
      title: 'Patwari / Karamchari',
      permissions: ['Upload Field Notes & Crop Survey', 'Attest Cadastral Vector Boundaries', 'Initiate Document Scan Ingestion', 'View Assigned Village Halka']
    },
    {
      role: 'tehsildar',
      title: 'Tehsildar / Circle Officer',
      permissions: ['Sanction / Reject Mutations (Dakhil-Kharij)', 'Order Ground DGPS Field Surveys', 'Resolve Discrepancy Queue Cases', 'Issue Statutory Notices']
    },
    {
      role: 'district_officer',
      title: 'District Collector (DC)',
      permissions: ['District-wide Compliance Analytics', 'Revenue Court Appeal Adjudication', 'Inter-Circle Cadastral Reconciliation', 'Export Master Audit Dossiers']
    },
    {
      role: 'admin',
      title: 'System SuperAdministrator',
      permissions: ['Configure AI Discrepancy Weights', 'Verify Cryptographic Block Integrity', 'Manage Sub-Registrar API Connectors', 'Full Database RBAC Oversight']
    }
  ];

  const apiConnectors = [
    { name: 'Jharbhoomi RoR Portal', status: 'Connected (Live Mirror)', type: 'State Jamabandi Ledger', latency: '42ms' },
    { name: 'Jharkhand Bhu-Naksha GIS', status: 'Connected (Vector Synced)', type: 'Cadastral GeoJSON API', latency: '68ms' },
    { name: 'NGDRS Sub-Registrar Deeds', status: 'Integration-Ready (OAuth2)', type: 'Deed Registration System', latency: '35ms' },
    { name: 'CERSAI Mortgage Registry', status: 'Integration-Ready', type: 'Encumbrance & Bank Liens', latency: '89ms' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-gov-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              System Settings & Security Architecture
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Role-based access control, cryptographic hash verification, and national land registry connector configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </span>
        </div>
      </div>

      {/* RBAC Persona Selector & Permissions Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-gov space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-gov-600" />
            <span>Role-Based Access Control (RBAC) Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an active persona to experience different statutory permission levels across the prototype.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {rbacMatrix.map((item) => {
            const isActive = activeRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setActiveRole(item.role)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-gov-50 border-gov-500 shadow-md ring-2 ring-gov-500/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-extrabold text-slate-900 mb-1">
                    {item.title}
                  </div>
                  <div className="space-y-1 my-2">
                    {item.permissions.map((p, idx) => (
                      <div key={idx} className="text-[10px] text-slate-600 flex items-start gap-1">
                        <CheckCircle2 className="w-3 h-3 text-gov-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 mt-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-gov-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isActive ? 'Current Active Role' : 'Click to Switch'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security & Cryptography Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cryptographic Standards */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-gov space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gov-600" />
            <span>Document Integrity & Cryptography</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>Tamper-Evident SHA-256 Hashing:</span>
                <span className="text-emerald-700 font-mono font-bold">Enabled</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Every digitized revenue record and officer action is sealed with a cryptographic hash linked sequentially to previous audit records.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>Encrypted Document Vault:</span>
                <span className="text-emerald-700 font-mono font-bold">AES-256-GCM</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Legacy document scans are encrypted at rest with hardware-security module (HSM) key rotation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>Zero-Trust API Ingress:</span>
                <span className="text-emerald-700 font-mono font-bold">mTLS & JWT</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Restricted circle magistrate authentication with biometrically backed session tokens.
              </p>
            </div>
          </div>
        </div>

        {/* Integration-Ready API Connectors */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-gov space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gov-600" />
            <span>Integration-Ready National Connectors</span>
          </h2>

          <div className="space-y-2.5">
            {apiConnectors.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.type}</div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    {c.status}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Latency: {c.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
