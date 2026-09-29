import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LandParcel, OwnershipHistoryEvent } from '../types/landRecord';
import { TerminologyTooltip } from '../components/common/TerminologyTooltip';
import {
  GitBranch,
  Layers,
  Calendar,
  FileText,
  User,
  MapPin,
  Sparkles,
  Activity
} from 'lucide-react';

export const OwnershipTimelineView: React.FC = () => {
  const { parcels, selectedParcelId, setSelectedParcelId, setActiveTab } = useApp();
  const [selectedGraphNode, setSelectedGraphNode] = useState<string>('khasra-125');

  const parcel = parcels.find((p: LandParcel) => p.parcelId === selectedParcelId) || parcels[0];

  const graphNodes = [
    { id: 'owner-rajesh', label: parcel.owner, type: 'Person', subtitle: 'Recorded Raiyat', icon: User, color: 'bg-blue-600 border-blue-400 text-white' },
    { id: 'khasra-125', label: `Khasra #${parcel.khasraNo}`, type: 'Parcel', subtitle: `${parcel.areaRoR} Acre (${parcel.landType})`, icon: Layers, color: 'bg-gov-700 border-gov-400 text-white' },
    { id: 'village-rampur', label: `${parcel.village} Village`, type: 'Jurisdiction', subtitle: `Thana #${parcel.thanaNo}, Dumka`, icon: MapPin, color: 'bg-slate-800 border-slate-600 text-white' },
    { id: 'gis-polygon', label: 'Cadastral GIS Vector', type: 'Spatial', subtitle: `Area: ${parcel.areaGIS} Acre`, icon: MapPin, color: 'bg-emerald-700 border-emerald-400 text-white' },
    { id: 'sale-deed', label: 'Sale Deed REG-2018', type: 'Instrument', subtitle: 'Registered Kewala', icon: FileText, color: 'bg-purple-700 border-purple-400 text-white' },
    { id: 'mutation-order', label: 'Mutation Order MUT-2024', type: 'Revenue Order', subtitle: 'Dakhil-Kharij Petition', icon: FileText, color: 'bg-amber-700 border-amber-400 text-white' },
    { id: 'ai-flag', label: 'AI Validation Engine', type: 'Intelligence', subtitle: 'Single-char shift: Rajesh vs Rakesh', icon: Sparkles, color: 'bg-red-700 border-red-400 text-white animate-pulse' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-gov-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Ownership Timeline & Revenue Knowledge Graph
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-gov-100 text-gov-800 text-xs font-bold font-mono">
              TITLE PROVENANCE
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Trace unbroken historical title lineage from foundational <TerminologyTooltip termKey="Khatiyan">Khatiyan surveys</TerminologyTooltip> to modern digitized transactions.
          </p>
        </div>

        {/* Parcel Switcher */}
        <select
          value={selectedParcelId}
          onChange={(e) => setSelectedParcelId(e.target.value)}
          className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-gov-500"
        >
          {parcels.map((p: LandParcel) => (
            <option key={p.id} value={p.parcelId}>
              Khasra {p.khasraNo} — {p.owner} ({p.village})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Chronological Provenance Timeline */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-gov space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gov-600" />
                <span>Historical Title Provenance Timeline</span>
              </h2>
              <p className="text-xs text-slate-500">
                Chronological chain of custody and succession events for Khasra {parcel.khasraNo}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('twin')}
              className="text-xs font-semibold text-gov-700 hover:text-gov-800"
            >
              Digital Twin →
            </button>
          </div>

          <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {parcel.timeline.map((event: OwnershipHistoryEvent, idx: number) => (
              <div key={idx} className="relative text-xs group">
                <div
                  className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center font-bold text-[10px] shadow-sm ${
                    event.verified
                      ? 'border-emerald-500 text-emerald-700'
                      : 'border-red-500 text-red-700 animate-pulse'
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 group-hover:border-gov-400 group-hover:bg-gov-50/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {event.year} • {event.date}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        event.verified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {event.eventType}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Beneficiary / Title Holder</div>
                    <div className="text-sm font-bold text-slate-900">{event.ownerName}</div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {event.transferDetails}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-gov-700 font-medium">Ref: {event.sourceDoc}</span>
                    <span className="font-mono text-slate-400">Doc: {event.docNumber}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Interactive Visual Knowledge Graph */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-gov space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-gov-600" />
                <span>Visual Revenue Entity Relationship Graph</span>
              </h2>
              <p className="text-xs text-slate-500">
                Graph network connecting legal persons, survey polygons, deeds, and validation flags
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-gov-100 text-gov-800 font-mono font-bold">
              7 Connected Nodes
            </span>
          </div>

          {/* Interactive Graph Node Canvas */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-white min-h-[420px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 text-[10px] text-slate-400 font-mono uppercase tracking-wider flex justify-between">
              <span>Interactive Graph Visualizer</span>
              <span className="text-amber-400">Click any node to inspect ontology</span>
            </div>

            <div className="relative z-10 space-y-4 my-auto">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedGraphNode('owner-rajesh')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedGraphNode === 'owner-rajesh' ? 'ring-2 ring-gov-400 scale-105' : ''
                  } bg-blue-900/80 border-blue-600 text-white`}
                >
                  <User className="w-4 h-4 mx-auto mb-1 text-blue-300" />
                  <div className="text-xs font-bold">{parcel.owner}</div>
                  <div className="text-[9px] text-blue-300">Raiyat (Person)</div>
                </button>

                <div className="flex items-center gap-1 text-[10px] font-mono text-gov-400">
                  <span>── owns ──►</span>
                </div>

                <button
                  onClick={() => setSelectedGraphNode('khasra-125')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedGraphNode === 'khasra-125' ? 'ring-2 ring-gov-400 scale-105' : ''
                  } bg-gov-900/90 border-gov-500 text-white`}
                >
                  <Layers className="w-4 h-4 mx-auto mb-1 text-gov-300" />
                  <div className="text-xs font-bold">Khasra #{parcel.khasraNo}</div>
                  <div className="text-[9px] text-gov-300">Plot ({parcel.areaRoR} ac)</div>
                </button>

                <div className="flex items-center gap-1 text-[10px] font-mono text-gov-400">
                  <span>── in ──►</span>
                </div>

                <button
                  onClick={() => setSelectedGraphNode('village-rampur')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedGraphNode === 'village-rampur' ? 'ring-2 ring-gov-400 scale-105' : ''
                  } bg-slate-900 border-slate-700 text-white`}
                >
                  <MapPin className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                  <div className="text-xs font-bold">{parcel.village}</div>
                  <div className="text-[9px] text-slate-400">Revenue Village</div>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedGraphNode('gis-polygon')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedGraphNode === 'gis-polygon' ? 'ring-2 ring-gov-400 scale-105' : ''
                  } bg-emerald-950/80 border-emerald-600 text-white`}
                >
                  <div className="text-xs font-bold">GIS Polygon</div>
                  <div className="text-[9px] text-emerald-300">{parcel.areaGIS} Acre (+2.91%)</div>
                </button>

                <div className="text-slate-600 font-mono text-xs">▲▼ matched</div>

                <button
                  onClick={() => setSelectedGraphNode('sale-deed')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedGraphNode === 'sale-deed' ? 'ring-2 ring-gov-400 scale-105' : ''
                  } bg-purple-950/80 border-purple-600 text-white`}
                >
                  <div className="text-xs font-bold">Sale Deed #8831</div>
                  <div className="text-[9px] text-purple-300">Reg: 2018 (₹12.5L)</div>
                </button>

                <div className="text-slate-600 font-mono text-xs">──►</div>

                <button
                  onClick={() => setSelectedGraphNode('mutation-order')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedGraphNode === 'mutation-order' ? 'ring-2 ring-gov-400 scale-105' : ''
                  } bg-amber-950/80 border-amber-600 text-white`}
                >
                  <div className="text-xs font-bold">Mutation Order</div>
                  <div className="text-[9px] text-amber-300">MUT-2024-0192</div>
                </button>
              </div>

              {parcel.riskScore > 50 && (
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setSelectedGraphNode('ai-flag')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedGraphNode === 'ai-flag' ? 'ring-2 ring-red-400 scale-105' : ''
                    } bg-red-950/90 border-red-500 text-red-200 animate-pulse flex items-center gap-2`}
                  >
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <div>
                      <div className="text-xs font-bold text-red-100">AI Validation Flag: Discrepancy Detected</div>
                      <div className="text-[9px] text-red-300">Mutation transferee (Rakesh Kumar) != RoR (Rajesh Kumar)</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <div className="relative z-10 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-gov-400 font-bold uppercase tracking-wider text-[10px]">Active Node Inspector: </span>
              <span className="text-white font-medium">
                {graphNodes.find(n => n.id === selectedGraphNode)?.label} — {graphNodes.find(n => n.id === selectedGraphNode)?.subtitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
