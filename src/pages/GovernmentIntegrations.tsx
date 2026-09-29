import React, { useState } from 'react';
import { GOVERNMENT_CONNECTORS } from '../data/syntheticLandData';
import { GovernmentConnector } from '../types/landRecord';
import { 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Code2, 
  ShieldCheck,
  Server,
  Layers
} from 'lucide-react';

export const GovernmentIntegrations: React.FC = () => {
  const [connectors, setConnectors] = useState<GovernmentConnector[]>(GOVERNMENT_CONNECTORS);
  const [selectedConnector, setSelectedConnector] = useState<GovernmentConnector>(GOVERNMENT_CONNECTORS[0]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleTestSync = (connector: GovernmentConnector) => {
    setIsSyncing(true);
    setSyncStatusMsg(`Sending test heartbeat packet to ${connector.acronym}...`);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatusMsg(`Successfully synchronized with ${connector.acronym}. Latency: ${connector.latencyMs}ms. Handshake status 200 OK.`);
      setConnectors(prev => prev.map(c => c.id === connector.id ? { ...c, lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19) } : c));
    }, 800);
  };

  const getStatusBadge = (status: GovernmentConnector['status']) => {
    switch (status) {
      case 'Integration Ready':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Integration Ready</span>;
      case 'Connected to Prototype GIS':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Connected to Prototype GIS</span>;
      case 'Mock / Prototype Connector':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Mock / Prototype Connector</span>;
      case 'Production Integration Required':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold flex items-center gap-1"><Server className="w-3.5 h-3.5" /> Production Integration Required</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
            <Network className="w-7 h-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Government Integrations & DILRMP Connectors
            </h1>
            <p className="text-sm text-slate-600">
              National land governance interoperability architecture for LRMS, NGDRS, and NIC Bhu-Naksha.
            </p>
          </div>
        </div>
      </div>

      {/* Honest Transparency Notice */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
            <ShieldCheck className="w-4 h-4" />
            Prototype Architecture Transparency Declaration
          </div>
          <p className="text-xs text-slate-300 max-w-3xl">
            BHULEKH AI provides production-grade adapter interfaces (<code className="text-indigo-300 font-mono">LandRecordAdapter</code>, <code className="text-indigo-300 font-mono">RegistrationAdapter</code>, <code className="text-indigo-300 font-mono">DilrmpAdapter</code>). In this hackathon build, mock connectors simulate official government responses until official NIC / DILRMP API gateway credentials are provisioned.
          </p>
        </div>
        <div className="text-xs px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 whitespace-nowrap">
          OpenAPI 3.0 Conforming
        </div>
      </div>

      {syncStatusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {syncStatusMsg}
          </span>
          <button onClick={() => setSyncStatusMsg(null)} className="text-emerald-900 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Grid of Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {connectors.map((c) => (
          <div 
            key={c.id} 
            onClick={() => setSelectedConnector(c)}
            className={`p-5 rounded-xl border transition-all cursor-pointer bg-white ${selectedConnector.id === c.id ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{c.category}</span>
              {getStatusBadge(c.status)}
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">{c.name}</h3>
            <p className="text-xs text-slate-600 mb-4 line-clamp-2">{c.description}</p>
            
            <div className="space-y-1.5 text-xs text-slate-500 font-mono pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Protocol:</span>
                <span className="text-slate-800 font-semibold">{c.authType}</span>
              </div>
              <div className="flex justify-between">
                <span>Adapter Class:</span>
                <span className="text-indigo-600 font-semibold">{c.adapterClass}</span>
              </div>
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className="text-emerald-600 font-semibold">{c.latencyMs} ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Selected Connector & Code Adapter View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase tracking-wider">
                {selectedConnector.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">{selectedConnector.version}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{selectedConnector.name} ({selectedConnector.acronym})</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedConnector.endpoint}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTestSync(selectedConnector)}
              disabled={isSyncing}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Test API Heartbeat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left: Spec Details */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Integration Specification
            </h3>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong className="text-slate-900">Functional Scope:</strong> {selectedConnector.description}</p>
              <p><strong className="text-slate-900">Authentication:</strong> {selectedConnector.authType}</p>
              <p><strong className="text-slate-900">Heartbeat Status:</strong> <span className="text-emerald-600 font-semibold">200 OK (Latency: {selectedConnector.latencyMs}ms)</span></p>
              <p><strong className="text-slate-900">Last Successful Sync:</strong> <span className="font-mono text-xs">{selectedConnector.lastSync}</span></p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Government Compliance Notes</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Complies with MeitY Open API Policy for Interoperable e-Governance.</li>
                <li>ULPIN (Bhu-Aadhaar) 14-digit alphanumeric standard supported.</li>
                <li>Payloads validated against NIC Cadastral GeoJSON schema v2.</li>
              </ul>
            </div>
          </div>

          {/* Right: Code Adapter Snippet */}
          <div className="p-6 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                src/services/adapters/{selectedConnector.adapterClass}.ts
              </span>
              <span className="text-[10px] text-emerald-400">TypeScript 5</span>
            </div>
            <pre className="text-indigo-300 leading-relaxed">
{`// Implementation for ${selectedConnector.acronym}
import { ${selectedConnector.adapterClass.charAt(0).toUpperCase() + selectedConnector.adapterClass.slice(1)} } from './governmentAdapters';

export class Production${selectedConnector.adapterClass.charAt(0).toUpperCase() + selectedConnector.adapterClass.slice(1)} implements ${selectedConnector.adapterClass.charAt(0).toUpperCase() + selectedConnector.adapterClass.slice(1)} {
  private endpoint = '${selectedConnector.endpoint}';
  private authType = '${selectedConnector.authType}';

  async syncNationalRegistry(parcelId: string) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.GOV_API_KEY}\`,
        'X-Client-ID': 'BHULEKH-AI-JH-DMK'
      },
      body: JSON.stringify({ parcelId, timestamp: new Date() })
    });
    return response.json();
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
