import React, { useState } from 'react';
import { API_ROUTES_DOCUMENTATION } from '../data/syntheticLandData';
import { ApiRouteDoc } from '../types/landRecord';
import { bhulekhApiClient } from '../services/apiClientService';
import { 
  Terminal, 
  Play, 
  Code2 
} from 'lucide-react';

export const ApiExplorerView: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<ApiRouteDoc>(API_ROUTES_DOCUMENTATION[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseJson, setResponseJson] = useState<string>(JSON.stringify(API_ROUTES_DOCUMENTATION[0].sampleResponse, null, 2));
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredRoutes = API_ROUTES_DOCUMENTATION.filter(r => {
    if (activeCategory === 'all') return true;
    return r.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleExecute = async (route: ApiRouteDoc) => {
    setIsLoading(true);
    try {
      const res = await bhulekhApiClient.executeEndpoint(route.path, route.method, route.sampleRequest);
      setResponseJson(JSON.stringify(res, null, 2));
    } catch {
      setResponseJson(JSON.stringify({ error: 'Endpoint execution failed' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono font-bold text-[11px]">GET</span>;
      case 'POST':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[11px]">POST</span>;
      case 'PUT':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono font-bold text-[11px]">PUT</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-mono font-bold text-[11px]">DELETE</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px]">{method}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-slate-900 text-emerald-400 rounded-xl">
            <Terminal className="w-7 h-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Government REST API Explorer
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                17 Endpoints Active
              </span>
            </h1>
            <p className="text-sm text-slate-600">
              Interactive test console for DILRMP & state land administration REST APIs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">API Endpoints Category</h3>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Parcels', 'Documents', 'OCR & Extraction', 'Validation', 'Risk', 'Feedback'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredRoutes.map((route, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedRoute(route);
                  setResponseJson(JSON.stringify(route.sampleResponse, null, 2));
                }}
                className={`p-3.5 cursor-pointer transition-colors ${selectedRoute.path === route.path && selectedRoute.method === route.method ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getMethodBadge(route.method)}
                  <span className="font-mono text-xs font-semibold text-slate-800 truncate">{route.path}</span>
                </div>
                <p className="text-xs text-slate-500 font-sans">{route.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Console (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getMethodBadge(selectedRoute.method)}
                <span className="font-mono text-sm font-bold text-slate-900">{selectedRoute.path}</span>
              </div>
              <p className="text-xs text-slate-600">{selectedRoute.description}</p>
            </div>
            <button
              onClick={() => handleExecute(selectedRoute)}
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 whitespace-nowrap self-start sm:self-auto"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isLoading ? 'animate-spin' : ''}`} />
              Execute Call
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {selectedRoute.parameters && selectedRoute.parameters.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Request Parameters</h4>
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 space-y-2">
                  {selectedRoute.parameters.map((p, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="font-mono font-semibold text-slate-800">{p.name} ({p.type})</span>
                      <span className="text-slate-500">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRoute.sampleRequest && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Request Payload (JSON)</h4>
                <pre className="p-3 bg-slate-900 text-indigo-300 rounded-lg font-mono text-xs overflow-x-auto">
                  {JSON.stringify(selectedRoute.sampleRequest, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" /> Response (200 OK)
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">application/json</span>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 rounded-lg font-mono text-xs overflow-x-auto flex-1 leading-relaxed border border-slate-800">
                {responseJson}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
