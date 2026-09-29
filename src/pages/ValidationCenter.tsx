import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { runCrossRecordValidation } from '../services/validationService';
import { LandParcel, ValidationConflict } from '../types/landRecord';
import {
  CheckCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy
} from 'lucide-react';

export const ValidationCenter: React.FC = () => {
  const { parcels, selectedParcelId, setSelectedParcelId, runValidationForParcel } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [isRunning, setIsRunning] = useState(false);

  const parcel = parcels.find((p: LandParcel) => p.parcelId === selectedParcelId) || parcels[0];
  const validationSummary = runCrossRecordValidation(parcel, parcels);

  const handleReRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      runValidationForParcel(parcel.parcelId);
      setIsRunning(false);
    }, 600);
  };

  const categories = [
    'ALL',
    'Owner Consistency',
    'Area Consistency',
    'Duplicate Detection',
    'Spatial Consistency',
    'Village Consistency'
  ];

  const filteredConflicts = validationSummary.conflicts.filter((c: ValidationConflict) =>
    activeCategoryFilter === 'ALL' || c.category === activeCategoryFilter
  );

  const mismatchCount = validationSummary.conflicts.filter(c => c.isMismatch).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CheckCheck className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Cross-Record Validation & Duplicate Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold font-mono">
              MULTI-DATABASE RECONCILIATION
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Deterministic cross-referencing of Record of Rights (Jamabandi), Sub-Registrar Deeds, Mutation Orders, and Cadastral GIS layers.
          </p>
        </div>

        {/* Parcel Switcher & Trigger */}
        <div className="flex items-center gap-3">
          <select
            value={selectedParcelId}
            onChange={(e) => setSelectedParcelId(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            {parcels.slice(0, 30).map((p: LandParcel) => (
              <option key={p.id} value={p.parcelId}>
                Khasra {p.khasraNo} — {p.owner} ({p.village}) [{p.riskLevel.toUpperCase()}]
              </option>
            ))}
          </select>

          <button
            onClick={handleReRun}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Re-Checking...' : 'Run Engine'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Checks Executed</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{validationSummary.totalChecks}</div>
          <div className="text-[11px] text-slate-400 mt-1">11 Consistency Rules</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm bg-emerald-50/20">
          <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-1">Passed Harmonious</div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">{validationSummary.passedChecks}</div>
          <div className="text-[11px] text-emerald-600 mt-1">100% record match</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-sm bg-rose-50/20">
          <div className="text-xs text-rose-700 font-semibold uppercase tracking-wider mb-1">Discrepancies Detected</div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono">{mismatchCount}</div>
          <div className="text-[11px] text-rose-600 mt-1">Title & area contradictions</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-indigo-200 shadow-sm bg-indigo-50/20">
          <div className="text-xs text-indigo-700 font-semibold uppercase tracking-wider mb-1">Additive AI Risk Score</div>
          <div className="text-2xl font-extrabold text-indigo-700 font-mono">{parcel.riskScore}/100</div>
          <div className="text-[11px] text-indigo-600 font-bold uppercase">{parcel.riskLevel} Severity</div>
        </div>
      </div>

      {/* DUPLICATE DETECTION BANNER (IF APPLICABLE) */}
      {parcel.duplicateMatches && parcel.duplicateMatches.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <Copy className="w-5 h-5 text-rose-600" />
              Critical Duplicate Document Detection ({parcel.duplicateMatches.length} Collisions)
            </span>
            <span className="text-xs font-bold px-2.5 py-1 bg-rose-600 text-white rounded-full">
              100% Match Collision
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {parcel.duplicateMatches.map((dup) => (
              <div key={dup.id} className="p-3 bg-white rounded-lg border border-rose-200 text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-800">Duplicate Stamped Document:</span>
                  <span className="text-rose-700 font-mono font-bold">{dup.originalDocNumber}</span>
                </div>
                <p className="text-slate-600">{dup.reason}</p>
                <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Matched Parcel: <strong className="text-indigo-600">{dup.duplicateParcelId}</strong></span>
                  <span className="text-rose-600 font-bold">Severity: {dup.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeCategoryFilter === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Comparison Matrix Cards */}
      <div className="space-y-4">
        {filteredConflicts.map((conflict: ValidationConflict) => (
          <div
            key={conflict.id}
            className={`p-5 rounded-xl border bg-white shadow-sm transition-all ${
              conflict.isMismatch
                ? conflict.severity === 'Critical'
                  ? 'border-rose-300 ring-1 ring-rose-100'
                  : 'border-amber-300 ring-1 ring-amber-100'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {conflict.isMismatch ? (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{conflict.category}</span>
                  <h3 className="text-base font-bold text-slate-900">{conflict.fieldName}</h3>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full self-start sm:self-auto ${
                  conflict.severity === 'Critical'
                    ? 'bg-rose-100 text-rose-800'
                    : conflict.severity === 'High'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {conflict.severity.toUpperCase()}
              </span>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Source A: {conflict.sourceA}
                </span>
                <span className="text-slate-900 font-bold text-sm block">{conflict.recordAValue}</span>
              </div>

              <div className={`p-3.5 rounded-lg border text-xs ${conflict.isMismatch ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Source B: {conflict.sourceB}
                </span>
                <span className={`font-bold text-sm block ${conflict.isMismatch ? 'text-rose-700' : 'text-slate-900'}`}>
                  {conflict.recordBValue}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <p><strong className="text-slate-900">AI Finding:</strong> {conflict.explanation}</p>
              <p><strong className="text-indigo-600">Recommended Action:</strong> {conflict.suggestedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
