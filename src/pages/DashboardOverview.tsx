import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  STATE_DIGITIZATION_STATS, 
  DISTRICT_DIGITIZATION_STATS, 
  ERROR_ANALYTICS_DATA
} from '../data/syntheticLandData';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Building,
  BarChart3,
  Cpu,
  Globe2,
  FileText,
  Clock,
  UserCheck,
  Filter
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { parcels, setSelectedParcelId, setActiveTab, selectedDistrict, setSelectedDistrict } = useApp();
  const [selectedErrorCategory, setSelectedErrorCategory] = useState<string | null>(null);
  const [interventionFilter, setInterventionFilter] = useState<'all' | 'critical' | 'pending' | 'resolved'>('all');

  const handleOpenParcel = (parcelId: string) => {
    setSelectedParcelId(parcelId);
    setActiveTab('twin');
  };

  // Tehsildar Intervention cases derived from state data
  const tehsildarStats = useMemo(() => {
    const critical = parcels.filter(p => p.status === 'critical' || p.riskScore >= 75).length;
    const pending = parcels.filter(p => p.status === 'needs_review' || p.status === 'high_risk' || p.status === 'in_dispute').length;
    const resolved = parcels.filter(p => p.status === 'verified').length;
    return {
      criticalCount: critical > 0 ? critical : 8,
      pendingCount: pending > 0 ? pending : 14,
      resolvedCount: resolved > 0 ? resolved : 32,
      avgResolutionDays: '4.2 Days'
    };
  }, [parcels]);

  // Filtered Intervention Cases
  const interventionCases = useMemo(() => {
    return parcels.map(p => {
      let interventionStatus: 'Requires Intervention' | 'Pending Review' | 'Resolved' = 'Requires Intervention';
      if (p.status === 'verified') {
        interventionStatus = 'Resolved';
      } else if (p.status === 'needs_review' || p.status === 'high_risk') {
        interventionStatus = 'Pending Review';
      } else {
        interventionStatus = 'Requires Intervention';
      }
      return {
        ...p,
        interventionStatus
      };
    }).filter(p => {
      if (interventionFilter === 'critical') return p.interventionStatus === 'Requires Intervention';
      if (interventionFilter === 'pending') return p.interventionStatus === 'Pending Review';
      if (interventionFilter === 'resolved') return p.interventionStatus === 'Resolved';
      return true;
    }).slice(0, 6);
  }, [parcels, interventionFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              National Land Record Intelligence Command Center
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold font-mono">
              LIVE MONITORING
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            AI OCR digitization, 4-way cross-database reconciliation, and explainable risk intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('gis')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Open GIS Cadastral Map</span>
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Officer Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Documents Processed */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Docs Processed</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">125,430</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.2% MoM
          </div>
        </div>

        {/* Extraction Accuracy */}
        <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-sm bg-blue-50/20">
          <div className="flex items-center justify-between text-xs text-blue-700 mb-1">
            <span className="font-semibold uppercase tracking-wider">Extraction Accuracy</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900 tracking-tight">91.4%</div>
          <div className="mt-1 text-[11px] text-blue-700 font-semibold">Indic-NER Engine</div>
        </div>

        {/* Validated */}
        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm bg-emerald-50/20">
          <div className="flex items-center justify-between text-xs text-emerald-700 mb-1">
            <span className="font-semibold uppercase tracking-wider">Validated Clean</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 tracking-tight">98,220</div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">78.3% total clear</div>
        </div>

        {/* Pending Verification */}
        <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm bg-amber-50/20">
          <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
            <span className="font-semibold uppercase tracking-wider">Pending Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900 tracking-tight">21,510</div>
          <div className="mt-1 text-[11px] text-amber-700 font-semibold">Officer Queue</div>
        </div>

        {/* Errors / Discrepancies */}
        <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-sm bg-rose-50/20">
          <div className="flex items-center justify-between text-xs text-rose-700 mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Errors</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-900 tracking-tight">4,832</div>
          <div className="mt-1 text-[11px] text-rose-700 font-semibold">3.8% error rate</div>
        </div>

        {/* High Risk Parcels */}
        <div className="p-4 rounded-xl bg-white border border-red-200 shadow-sm bg-red-50/20">
          <div className="flex items-center justify-between text-xs text-red-700 mb-1">
            <span className="font-semibold uppercase tracking-wider">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-extrabold text-red-900 tracking-tight">3,210</div>
          <div className="mt-1 text-[11px] text-red-700 font-semibold">Quasi-Judicial Action</div>
        </div>
      </div>

      {/* STATE-WISE PROGRESS (10 INDIAN STATES) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-600" />
              State-wise Land Record Digitization Progress
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                SYNTHETIC DEMO DATA
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated DILRMP digitization and AI validation progress across 10 major Indian states.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">National Average: 84.4%</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STATE_DIGITIZATION_STATS.map((s) => (
            <div 
              key={s.code}
              className={`p-3 rounded-lg border transition-all ${s.isPrototypeFocus ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-200' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">{s.stateName}</span>
                {s.isPrototypeFocus && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-600 text-white rounded">Focus</span>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-extrabold text-slate-900">{s.digitizedPercent}%</span>
                <span className="text-[10px] text-slate-500">{(s.totalParcels / 1000000).toFixed(1)}M parcels</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full ${s.digitizedPercent >= 90 ? 'bg-emerald-500' : s.digitizedPercent >= 80 ? 'bg-indigo-600' : 'bg-amber-500'}`}
                  style={{ width: `${s.digitizedPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DISTRICT-WISE DRILLDOWN (JHARKHAND) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              Jharkhand State: District-wise Digitization & Validation Health
            </h3>
            <p className="text-xs text-slate-500">Click a district to filter the active operational boundary</p>
          </div>
          <span className="text-xs text-indigo-600 font-bold">Selected: {selectedDistrict} District</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Total Documents</th>
                <th className="px-4 py-3">Digitized Count</th>
                <th className="px-4 py-3">Validated Clean</th>
                <th className="px-4 py-3">Pending Review</th>
                <th className="px-4 py-3">Errors Flagged</th>
                <th className="px-4 py-3">Avg OCR Confidence</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {DISTRICT_DIGITIZATION_STATS.map((d) => (
                <tr 
                  key={d.districtName} 
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedDistrict === d.districtName ? 'bg-indigo-50/60 font-semibold' : ''}`}
                  onClick={() => setSelectedDistrict(d.districtName)}
                >
                  <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    {d.districtName}
                  </td>
                  <td className="px-4 py-3">{d.totalDocuments.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{d.digitizedCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-emerald-700 font-bold">{d.validatedCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-amber-700 font-medium">{d.pendingVerificationCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-rose-700 font-medium">{d.errorCount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
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
                      View GIS →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ERROR ANALYTICS CATEGORY BREAKDOWN */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-600" />
              Extraction & Validation Errors Breakdown (4,832 Cases)
            </h3>
            <p className="text-xs text-slate-500">Interactive error categorization across OCR, registry records, and cadastral spatial geometry</p>
          </div>
          {selectedErrorCategory && (
            <button 
              onClick={() => setSelectedErrorCategory(null)}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ERROR_ANALYTICS_DATA.map((err) => (
            <div 
              key={err.category}
              onClick={() => setSelectedErrorCategory(err.category)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${selectedErrorCategory === err.category ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-100' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">{err.category}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${err.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                  {err.severity}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-extrabold text-slate-900">{err.count.toLocaleString()}</span>
                <span className="text-xs font-semibold text-rose-600">{err.percentage}%</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{err.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CHANGE 2: TEHSILDAR INTERVENTION SECTION (REPLACES PRIORITY CASE & ACCURACY) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Tehsildar Intervention</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                    Statutory Review Required
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cases requiring quasi-judicial review, title conflict reconciliation, and Patwari field inspection orders under Section 14.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>View Full Officer Queue ({tehsildarStats.criticalCount + tehsildarStats.pendingCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tehsildar Metrics KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Critical Cases */}
          <div className="p-4 rounded-xl bg-red-50/50 border border-red-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs text-red-700 mb-1">
              <span className="font-bold uppercase tracking-wider">Critical Cases</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-3xl font-black text-red-900 font-mono tracking-tight">
              {tehsildarStats.criticalCount.toString().padStart(2, '0')}
            </div>
            <div className="mt-1 text-[11px] text-red-700 font-semibold">Immediate CO Action</div>
          </div>

          {/* Pending Review */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
              <span className="font-bold uppercase tracking-wider">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-900 font-mono tracking-tight">
              {tehsildarStats.pendingCount.toString().padStart(2, '0')}
            </div>
            <div className="mt-1 text-[11px] text-amber-700 font-semibold">Awaiting Field Report</div>
          </div>

          {/* Resolved */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs text-emerald-700 mb-1">
              <span className="font-bold uppercase tracking-wider">Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-900 font-mono tracking-tight">
              {tehsildarStats.resolvedCount.toString().padStart(2, '0')}
            </div>
            <div className="mt-1 text-[11px] text-emerald-700 font-semibold">Mutations Sanctioned</div>
          </div>

          {/* Average Resolution Time */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-bold uppercase tracking-wider">Avg Resolution Time</span>
              <UserCheck className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {tehsildarStats.avgResolutionDays}
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> -1.4 Days vs manual
            </div>
          </div>
        </div>

        {/* Filter Controls for Recent Cases */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Recent Intervention Cases:</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setInterventionFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                interventionFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Cases
            </button>
            <button
              onClick={() => setInterventionFilter('critical')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                interventionFilter === 'critical'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical ({tehsildarStats.criticalCount.toString().padStart(2, '0')})
            </button>
            <button
              onClick={() => setInterventionFilter('pending')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                interventionFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({tehsildarStats.pendingCount.toString().padStart(2, '0')})
            </button>
            <button
              onClick={() => setInterventionFilter('resolved')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                interventionFilter === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved ({tehsildarStats.resolvedCount.toString().padStart(2, '0')})
            </button>
          </div>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interventionCases.map((c) => (
            <div
              key={c.id}
              onClick={() => handleOpenParcel(c.parcelId)}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div>
                {/* Top Row: Khasra & Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Khasra No. {c.khasraNo}
                    </span>
                    <div className="text-[11px] text-slate-500">
                      {c.village} Mauza • Khata #{c.khataNo}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.interventionStatus === 'Requires Intervention'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : c.interventionStatus === 'Pending Review'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {c.interventionStatus}
                  </span>
                </div>

                {/* Owner & Primary Conflict */}
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Recorded Owner:</span>
                    <span className="font-bold text-slate-900">{c.owner}</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium line-clamp-2">
                    <strong className="text-slate-900">Issue:</strong> {c.riskAssessment.topReasons[0] || 'Ownership conflict / cross-record mismatch'}
                  </div>
                </div>
              </div>

              {/* Bottom Footer: Risk Score & Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <RiskBadge score={c.riskScore} />
                  <span className="text-[10px] text-slate-400 font-mono">Score {c.riskScore}/100</span>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Review Case</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
