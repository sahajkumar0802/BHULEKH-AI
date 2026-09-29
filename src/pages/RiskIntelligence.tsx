import React from 'react';
import { useApp } from '../context/AppContext';
import { LandParcel, RiskFactor } from '../types/landRecord';
import { RiskBadge } from '../components/common/RiskBadge';
import { ExplainableAiBanner } from '../components/common/ExplainableAiBanner';
import {
  ShieldAlert,
  Sparkles,
  Calculator,
  Scale,
  CheckCircle2
} from 'lucide-react';

export const RiskIntelligence: React.FC = () => {
  const { parcels, selectedParcelId, setSelectedParcelId, setActiveTab } = useApp();

  const parcel = parcels.find((p: LandParcel) => p.parcelId === selectedParcelId) || parcels[0];
  const assessment = parcel.riskAssessment;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Official Breadcrumb Bar */}
      <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-4 py-2 rounded border border-slate-200 shadow-sm">
        <span className="text-slate-400">मुखपृष्ठ (Home)</span>
        <span>/</span>
        <span className="text-slate-400">राजस्व विश्लेषण (Revenue Analytics)</span>
        <span>/</span>
        <span className="font-bold text-[#003D7C]">Explainable AI Risk Intelligence</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-700" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Explainable AI Risk Intelligence
            </h1>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 text-xs font-bold font-mono">
              MATHEMATICAL BREAKDOWN
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Transparent, additive risk scoring engineered to assist Revenue Officers in dispute prioritization and fraud prevention.
          </p>
        </div>

        {/* Parcel Switcher */}
        <select
          value={selectedParcelId}
          onChange={(e) => setSelectedParcelId(e.target.value)}
          className="p-2 rounded border border-slate-300 bg-white text-xs font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-[#003D7C]"
        >
          {parcels.map((p: LandParcel) => (
            <option key={p.id} value={p.parcelId}>
              Khasra {p.khasraNo} — {p.owner} ({p.village}) [Score: {p.riskScore}]
            </option>
          ))}
        </select>
      </div>

      {/* Official Legal Disclaimer Box */}
      <div className="p-4 rounded border-l-4 border-[#FF9933] bg-[#003D7C] text-white flex items-start gap-3 shadow-sm">
        <Scale className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-200">
          <strong className="text-[#FF9933] font-semibold">Statutory Legal Governance Principle: </strong>
          "Risk score is an automated AI-assisted prioritization score for inspection queue management, not a legal determination of civil title or proprietary ownership under the State Revenue Act."
        </div>
      </div>

      {/* Main Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mathematical Scoring Breakdown for Selected Parcel */}
        <div className="lg:col-span-2 gov-card p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                Parcel #{parcel.khasraNo} ({parcel.village})
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#003D7C]" />
                <span>Deterministic Additive Scoring Model</span>
              </h2>
            </div>
            <RiskBadge score={parcel.riskScore} level={parcel.riskLevel} size="md" />
          </div>

          {/* Equation Formula Banner */}
          <div className="p-4 rounded bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Mathematical Formulation:</div>
            <div className="text-xs text-[#003D7C] font-bold overflow-x-auto">
              Score = Min(100, Σ [ Factor_Weight × Severity_Multiplier ])
            </div>
            <div className="text-[11px] text-slate-600 pt-1">
              Base Risk: +5 | Discrepancy Deductions: +{parcel.riskScore - 5} points
            </div>
          </div>

          {/* Factor Rows */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Factor Contributions:
            </h3>

            {assessment.factors.map((f: RiskFactor, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{f.factor}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                      Source: {f.source}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{f.reason}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-red-100 text-red-800 border border-red-200 font-bold font-mono text-xs">
                    +{f.points} pts
                  </span>
                </div>
              </div>
            ))}

            {assessment.factors.length === 0 && (
              <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All factors validated with zero risk penalties. Total score: {parcel.riskScore}/100</span>
              </div>
            )}
          </div>

          {/* Why This Parcel is Risky? Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#003D7C]" />
              <span>Why is this parcel flagged as risky?</span>
            </h3>

            <ExplainableAiBanner
              summary={assessment.explainableSummary}
              reasons={assessment.topReasons}
              recommendedAction={assessment.recommendedOfficerAction}
              onActionClick={() => setActiveTab('queue')}
            />
          </div>
        </div>

        {/* Right Col: Risk Tiers Definition & Comparison */}
        <div className="space-y-6">
          <div className="gov-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#003D7C]">
              Risk Tier Classification Matrix
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-900">
                <div className="flex items-center justify-between font-bold">
                  <span>81 – 100: CRITICAL</span>
                  <span className="font-mono bg-red-100 px-1.5 py-0.5 rounded text-[10px]">Immediate Hearing</span>
                </div>
                <p className="text-[11px] text-red-800 mt-1">
                  Active title dispute, legal heir collision, or duplicate registered deeds.
                </p>
              </div>

              <div className="p-3 rounded bg-orange-50 border border-orange-200 text-orange-900">
                <div className="flex items-center justify-between font-bold">
                  <span>61 – 80: HIGH RISK</span>
                  <span className="font-mono bg-orange-100 px-1.5 py-0.5 rounded text-[10px]">Field Survey</span>
                </div>
                <p className="text-[11px] text-orange-800 mt-1">
                  Cadastral polygon encroachment or area divergence exceeding statutory ±2.5%.
                </p>
              </div>

              <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900">
                <div className="flex items-center justify-between font-bold">
                  <span>31 – 60: MEDIUM RISK</span>
                  <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">Desk Audit</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  Low OCR extraction confidence on vintage paper or missing secondary deeds.
                </p>
              </div>

              <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="flex items-center justify-between font-bold">
                  <span>0 – 30: LOW RISK (VERIFIED)</span>
                  <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">Instant Clearance</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Complete unbroken historical title chain synchronized with satellite GIS.
                </p>
              </div>
            </div>
          </div>

          <div className="gov-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#003D7C]">
              Risk Score vs. Record Quality Index
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>AI Risk Score:</span>
                  <span className="text-red-700 font-mono font-bold">{parcel.riskScore} / 100</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Measures likelihood of fraud, legal disputes, or spatial encroachment.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>Record Quality Score:</span>
                  <span className="text-[#003D7C] font-mono font-bold">{parcel.qualityScore} / 100</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Measures data completeness, OCR resolution, and archival integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
