import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  STATE_DIGITIZATION_STATS, 
  DISTRICT_DIGITIZATION_STATS, 
  ERROR_ANALYTICS_DATA
} from '../data/syntheticLandData';
import {
  BarChart3,
  TrendingUp,
  Globe2,
  Building,
  AlertTriangle,
  CheckCircle2,
  FileDown,
  Filter,
  Calendar,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { selectedDistrict, setSelectedDistrict, setActiveTab, addAuditLog, activeRole } = useApp();

  const [selectedState, setSelectedState] = useState<string>('Jharkhand');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'30d' | '90d' | '1y' | 'all'>('90d');
  const [activeErrorFilter, setActiveErrorFilter] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Time-series monthly throughput mock data
  const monthlyTrends = [
    { month: 'Oct', processed: 8420, validated: 6890, errors: 410, accuracy: 87.2 },
    { month: 'Nov', processed: 11200, validated: 9150, errors: 490, accuracy: 88.5 },
    { month: 'Dec', processed: 14600, validated: 11800, errors: 520, accuracy: 89.4 },
    { month: 'Jan', processed: 18900, validated: 15400, errors: 590, accuracy: 90.1 },
    { month: 'Feb', processed: 24800, validated: 20100, errors: 640, accuracy: 91.0 },
    { month: 'Mar', processed: 31200, validated: 25800, errors: 710, accuracy: 91.4 }
  ];

  const handleExportReport = (format: 'CSV' | 'PDF') => {
    addAuditLog({
      officerName: 'Executive Officer',
      officerRole: activeRole,
      action: 'Document Metadata Updated',
      parcelId: 'ALL-DISTRICTS',
      reason: `Exported National Land Record Analytics Dossier in ${format} format for ${selectedState} (${selectedDistrict} District).`
    });

    setExportNotice(`Analytics Dossier successfully generated and exported as BHULEKH_AI_Analytics_${selectedState}_${format}.`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                Executive Land Record Analytics & Intelligence
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Macro-level monitoring across 10 Indian states, district-level throughput, AI OCR accuracy gains, and discrepancy diagnostics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1.5" />
            {(['30d', '90d', '1y', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExportReport('CSV')}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExportReport('PDF')}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-white" />
            <span>Export PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Export Confirmation Notice */}
      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Key Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Processed</div>
          <div className="text-2xl font-extrabold text-slate-900">125,430</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this qtr
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm bg-emerald-50/10">
          <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-1">Validated Clean</div>
          <div className="text-2xl font-extrabold text-emerald-700">98,220</div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">78.3% pass rate</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-sm bg-blue-50/10">
          <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-1">Indic OCR Accuracy</div>
          <div className="text-2xl font-extrabold text-blue-700">91.4%</div>
          <div className="mt-1 text-[11px] text-blue-600 font-semibold">+8.7% with feedback</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm bg-amber-50/10">
          <div className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1">Officer Queue</div>
          <div className="text-2xl font-extrabold text-amber-700">21,510</div>
          <div className="mt-1 text-[11px] text-amber-600 font-semibold">17.1% pending desk</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-sm bg-rose-50/10">
          <div className="text-xs text-rose-700 font-semibold uppercase tracking-wider mb-1">Total Errors</div>
          <div className="text-2xl font-extrabold text-rose-700">4,832</div>
          <div className="mt-1 text-[11px] text-rose-600 font-semibold">3.8% anomaly rate</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-red-200 shadow-sm bg-red-50/10">
          <div className="text-xs text-red-700 font-semibold uppercase tracking-wider mb-1">Critical Conflicts</div>
          <div className="text-2xl font-extrabold text-red-700">412</div>
          <div className="mt-1 text-[11px] text-red-600 font-semibold">Immediate hearing</div>
        </div>
      </div>

      {/* Row 1: Monthly Throughput Bar Chart & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Throughput Progress (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Monthly Digitization & Validation Throughput
              </h3>
              <p className="text-xs text-slate-500">Historical velocity of document ingestion vs clean auto-validation</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-3 h-3 rounded bg-indigo-500" /> Ingested
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-3 h-3 rounded bg-emerald-500" /> Validated
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {monthlyTrends.map((m) => {
              const maxVal = 35000;
              const procWidth = (m.processed / maxVal) * 100;
              const valWidth = (m.validated / maxVal) * 100;

              return (
                <div key={m.month} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{m.month} 2024</span>
                    <span className="text-slate-500 font-mono">
                      {m.processed.toLocaleString()} docs ({m.accuracy}% accuracy)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 flex overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-3 rounded-l-full transition-all duration-500" 
                      style={{ width: `${procWidth}%` }}
                      title={`Processed: ${m.processed}`}
                    />
                    <div 
                      className="bg-emerald-500 h-3 rounded-r-full -ml-1 transition-all duration-500 opacity-90" 
                      style={{ width: `${valWidth}%` }}
                      title={`Validated: ${m.validated}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cumulative Volume: <strong>125,430 documents</strong></span>
            <span className="text-emerald-700 font-bold">Automated Clearance Velocity: +28% MoM</span>
          </div>
        </div>

        {/* Risk & Quality Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Risk Severity & Quality Distribution
            </h3>
            <p className="text-xs text-slate-500">Breakdown of parcels by calculated additive risk tier</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Low Risk (0–30) — Instant Clear', count: '98,220', pct: 78.3, color: 'bg-emerald-500', text: 'text-emerald-800', bg: 'bg-emerald-50' },
              { label: 'Medium Risk (31–60) — Desk Review', count: '21,510', pct: 17.1, color: 'bg-amber-500', text: 'text-amber-800', bg: 'bg-amber-50' },
              { label: 'High Risk (61–80) — Field Survey', count: '3,210', pct: 2.6, color: 'bg-orange-500', text: 'text-orange-800', bg: 'bg-orange-50' },
              { label: 'Critical Risk (81–100) — Title Dispute', count: '412', pct: 0.3, color: 'bg-rose-600', text: 'text-rose-800', bg: 'bg-rose-50' }
            ].map((tier) => (
              <div key={tier.label} className={`p-3 rounded-lg border border-slate-200 ${tier.bg} text-xs space-y-1.5`}>
                <div className="flex justify-between font-bold">
                  <span className={tier.text}>{tier.label}</span>
                  <span className="font-mono text-slate-900">{tier.count} ({tier.pct}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${tier.color}`} style={{ width: `${tier.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average Quality Score: <strong className="text-indigo-600">88.2 / 100</strong></span>
            <button 
              onClick={() => setActiveTab('risk')}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              Risk Intelligence Center <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* STATE-WISE PROGRESS & LEADERBOARD (10 INDIAN STATES) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-600" />
              National Land Record Modernization (10 Indian States)
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                SYNTHETIC BENCHMARK
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              State-wise DILRMP spatial digitization coverage, cadastral vector alignment, and average AI OCR confidence.
            </p>
          </div>
          <span className="text-xs text-indigo-600 font-bold font-mono">
            Active Focus: {selectedState}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STATE_DIGITIZATION_STATS.map((s) => {
            const isSelected = selectedState === s.stateName;
            return (
              <div
                key={s.code}
                onClick={() => setSelectedState(s.stateName)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">{s.stateName}</span>
                  {s.isPrototypeFocus && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-indigo-600 text-white rounded">
                      Live Test
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-extrabold text-slate-900">{s.digitizedPercent}%</span>
                  <span className="text-[10px] text-slate-500">{(s.totalParcels / 1000000).toFixed(1)}M Plots</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      s.digitizedPercent >= 90
                        ? 'bg-emerald-500'
                        : s.digitizedPercent >= 80
                        ? 'bg-indigo-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${s.digitizedPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DISTRICT-WISE DRILLDOWN (JHARKHAND PILOT) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              {selectedState}: District-wise Revenue Health & Discrepancies
            </h3>
            <p className="text-xs text-slate-500">Click any district to filter active operations or launch cadastral GIS</p>
          </div>
          <span className="text-xs text-indigo-700 font-bold">Selected District: {selectedDistrict}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">District Name</th>
                <th className="px-4 py-3">Total Ingested</th>
                <th className="px-4 py-3">Digitized Count</th>
                <th className="px-4 py-3">Validated Clean</th>
                <th className="px-4 py-3">Officer Review</th>
                <th className="px-4 py-3">Errors Flagged</th>
                <th className="px-4 py-3">Avg OCR Confidence</th>
                <th className="px-4 py-3 text-right">Cadastral View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {DISTRICT_DIGITIZATION_STATS.map((d) => {
                const isSelected = selectedDistrict === d.districtName;
                return (
                  <tr
                    key={d.districtName}
                    onClick={() => setSelectedDistrict(d.districtName)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-indigo-50/70 font-semibold text-slate-900' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      {d.districtName}
                    </td>
                    <td className="px-4 py-3">{d.totalDocuments.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-900 font-bold">{d.digitizedCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-emerald-700 font-bold">{d.validatedCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-amber-700">{d.pendingVerificationCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-rose-700 font-bold">{d.errorCount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold font-mono">
                        {d.averageConfidencePercent}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDistrict(d.districtName);
                          setActiveTab('gis');
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px]"
                      >
                        Open Map →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ERROR ANALYTICS & ROOT CAUSE MATRIX */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Root-Cause Error Distribution (4,832 Anomalies Flagged)
            </h3>
            <p className="text-xs text-slate-500">
              Interactive categorization of OCR blur, ownership mismatches, duplicate deeds, and cadastral spatial overlaps.
            </p>
          </div>
          {activeErrorFilter && (
            <button
              onClick={() => setActiveErrorFilter(null)}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              <Filter className="w-3.5 h-3.5" /> Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ERROR_ANALYTICS_DATA.map((err) => {
            const isSelected = activeErrorFilter === err.category;
            return (
              <div
                key={err.category}
                onClick={() => setActiveErrorFilter(isSelected ? null : err.category)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-100 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">{err.category}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      err.severity === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : err.severity === 'High'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {err.severity}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-extrabold text-slate-900">{err.count.toLocaleString()}</span>
                  <span className="text-xs font-bold text-rose-600">{err.percentage}%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{err.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
