import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { QualityBadge } from '../components/common/QualityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExplainableAiBanner } from '../components/common/ExplainableAiBanner';
import {
  Layers,
  MapPin,
  FileText,
  User,
  History,
  CheckCheck,
  AlertTriangle,
  GitBranch,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const DigitalLandTwin: React.FC = () => {
  const { selectedParcel, runValidationForParcel, updateParcelStatus, setActiveTab } = useApp();
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);

  const parcel = selectedParcel;

  const handleRunValidation = () => {
    setIsVerifying(true);
    setTimeout(() => {
      runValidationForParcel(parcel.parcelId);
      setIsVerifying(false);
      setValidationSuccess(true);
      setTimeout(() => setValidationSuccess(false), 3000);
    }, 800);
  };

  const handleOrderFieldSurvey = () => {
    updateParcelStatus(
      parcel.parcelId,
      'field_verification_ordered',
      `Field verification and DGPS survey ordered due to risk score ${parcel.riskScore}/100 and detected discrepancies.`
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Official Breadcrumb Bar */}
      <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-4 py-2 rounded border border-slate-200 shadow-sm">
        <span className="text-slate-400">मुखपृष्ठ (Home)</span>
        <span>/</span>
        <span className="text-slate-400">भूलेख रजिस्ट्री (Land Registry)</span>
        <span>/</span>
        <span className="font-bold text-[#003D7C]">360° Digital Land Twin (खसरा #{parcel.khasraNo})</span>
      </div>

      {/* Official Hero Land Twin Header (UIDAI / GOI Deep Navy) */}
      <div className="p-6 rounded-lg bg-[#003D7C] text-white shadow-md border-b-4 border-[#FF9933] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-white/10 border border-white/20 text-[#FF9933] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>360° Digital Land Twin</span>
              </span>
              <span className="text-xs text-slate-200 font-mono bg-[#002856] px-2 py-0.5 rounded border border-white/10">
                ULPIN: {parcel.parcelId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>खसरा (Khasra) {parcel.khasraNo}</span>
              <span className="text-slate-400 font-light">•</span>
              <span className="text-amber-300 font-semibold">{parcel.village} Village</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span><strong className="text-white">Primary Raiyat:</strong> {parcel.owner}</span>
              <span><strong className="text-white">Khata:</strong> {parcel.khataNo}</span>
              <span><strong className="text-white">Thana No:</strong> {parcel.thanaNo}</span>
              <span><strong className="text-white">Tehsil:</strong> {parcel.tehsil}, {parcel.district}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRunValidation}
              disabled={isVerifying}
              className="px-4 py-2 rounded font-bold text-xs bg-[#FF9933] hover:bg-[#e68a00] text-slate-900 shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'AI Verification in Progress...' : 'Run Live AI Cross-Check'}</span>
            </button>

            {parcel.riskScore > 30 && parcel.status !== 'field_verification_ordered' && (
              <button
                onClick={handleOrderFieldSurvey}
                className="px-4 py-2 rounded font-bold text-xs bg-red-700 hover:bg-red-800 text-white shadow transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Order Field Verification</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('gis')}
              className="px-4 py-2 rounded font-bold text-xs bg-[#002856] hover:bg-[#001f44] text-white border border-white/20 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#FF9933]" />
              <span>Cadastral GIS</span>
            </button>
          </div>
        </div>

        {/* Live Validation Alert Notification */}
        {validationSuccess && (
          <div className="mt-4 p-3 rounded bg-emerald-900/80 border border-emerald-400 text-emerald-100 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AI Cross-Record Validation executed successfully! Risk Score and validation matrix refreshed.</span>
          </div>
        )}
      </div>

      {/* Top 2 Score Cards: Large Risk Card & Record Quality Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RiskBadge score={parcel.riskScore} level={parcel.riskLevel} size="lg" />
        <QualityBadge score={parcel.qualityScore} size="lg" />
      </div>

      {/* Explainable AI Rationale Banner */}
      <ExplainableAiBanner
        summary={parcel.riskAssessment.explainableSummary}
        reasons={parcel.riskAssessment.topReasons}
        recommendedAction={parcel.riskAssessment.recommendedOfficerAction}
        onActionClick={() => setActiveTab('queue')}
      />

      {/* 9 Core Digital Twin Sections in Modular Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION A: Parcel Summary */}
        <div className="gov-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-[#003D7C] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#003D7C]" />
              <span>A. Parcel Summary Ledger</span>
            </h2>
            <StatusBadge status={parcel.status} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Khasra (Plot) No</div>
              <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{parcel.khasraNo}</div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Khata (Account) No</div>
              <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{parcel.khataNo}</div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Recorded Area (RoR)</div>
              <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{parcel.areaRoR} Acre</div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">GIS Cadastral Area</div>
              <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{parcel.areaGIS} Acre</div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Land Classification</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{parcel.landType}</div>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Estimated Market Rate</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">₹{parcel.marketRatePerAcre?.toLocaleString()} / ac</div>
            </div>
          </div>
        </div>

        {/* SECTION B: Owner Information */}
        <div className="gov-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-[#003D7C] flex items-center gap-2">
              <User className="w-4 h-4 text-[#003D7C]" />
              <span>B. Raiyat & Co-Sharer Info</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Possession: Active</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Recorded Primary Raiyat (Owner)</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">{parcel.owner}</div>
              <div className="text-slate-600">Father / Husband: {parcel.fatherHusbandName}</div>
            </div>

            {parcel.coOwners && parcel.coOwners.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <div className="text-[10px] uppercase font-bold text-amber-800 mb-1">Co-Sharers & Unregistered Heirs</div>
                <div className="space-y-1">
                  {parcel.coOwners.map((co, idx) => (
                    <div key={idx} className="p-2 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{co}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Revenue Demand (Lagan):</span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">₹142.50 / annum (Paid)</span>
              </div>
              <div className="flex justify-between">
                <span>Cess & Surcharge:</span>
                <span className="font-semibold text-slate-800">₹28.00 (Cleared)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION C: GIS Cadastral Map Snippet */}
        <div className="gov-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-[#003D7C] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#003D7C]" />
              <span>C. Cadastral GIS Vector Polygon</span>
            </h2>
            <button
              onClick={() => setActiveTab('gis')}
              className="text-xs font-semibold text-[#003D7C] hover:underline flex items-center gap-1"
            >
              <span>Explore GIS</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="relative h-44 bg-[#001f44] rounded overflow-hidden border border-slate-700 p-3 flex flex-col justify-between">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

            <div className="relative z-10 flex items-center justify-between text-[11px] text-white">
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-600">
                Lat: 24.2650°N | Lng: 87.2520°E
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-700 text-emerald-100 font-semibold border border-emerald-500">
                GeoJSON Matched
              </span>
            </div>

            <div className="relative z-10 my-auto text-center">
              <div className="inline-block p-3 rounded bg-[#003D7C]/80 border-2 border-[#FF9933] text-white font-bold text-sm shadow">
                Polygon Khasra #{parcel.khasraNo}
                <div className="text-[10px] font-normal text-amber-200 font-mono mt-0.5">
                  Vector Area: {parcel.areaGIS} Acres
                </div>
              </div>
            </div>

            <div className="relative z-10 text-[10px] text-slate-300 bg-slate-900/90 p-1.5 rounded flex items-center justify-between">
              <span>State Survey Standard: WGS-84 / UTM 45N</span>
              <span className="text-emerald-300 font-semibold">Bhu-Naksha Sync: OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Documents, Mutation History, Validation Matrix & Provenance Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION D: Associated Documents */}
        <div className="gov-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-[#003D7C] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#003D7C]" />
              <span>D. Digitized Revenue Documents ({parcel.documents.length})</span>
            </h2>
            <button
              onClick={() => setActiveTab('digitization')}
              className="text-xs font-semibold text-[#003D7C] hover:underline"
            >
              + Upload New Scan
            </button>
          </div>

          <div className="space-y-3">
            {parcel.documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-3.5 rounded border transition-all ${
                  doc.status === 'flagged'
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span>{doc.docType}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {doc.docNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Issued: {doc.issueDate} • {doc.issuingAuthority} • {doc.language}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-semibold text-[#003D7C] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      OCR: {doc.ocrConfidence}%
                    </span>
                  </div>
                </div>

                {/* Extracted Fields Chips */}
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                  {doc.extractedFields.map((f, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                        f.isConflict
                          ? 'bg-red-100 text-red-800 border-red-300 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {f.label}: <strong className="font-semibold">{f.value}</strong> ({f.confidence}%)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION E: Mutation History */}
        <div className="gov-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-[#003D7C] flex items-center gap-2">
              <History className="w-4 h-4 text-[#003D7C]" />
              <span>E. Mutation Ledger (Dakhil-Kharij)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Total Cases: {parcel.mutations.length}</span>
          </div>

          <div className="space-y-3">
            {parcel.mutations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No subsequent mutation entries recorded. Root title remains under ancestral settlement.
              </div>
            ) : (
              parcel.mutations.map((m) => (
                <div key={m.id} className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-mono">
                      #{m.mutationNo} ({m.natureOfTransfer})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.status === 'Sanctioned'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : m.status === 'Disputed'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <div className="text-slate-600">
                    <span className="text-slate-400">Transfer: </span>
                    <strong className="text-slate-800">{m.transferor}</strong> → <strong className="text-slate-800">{m.transferee}</strong>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700">Remarks: </span>
                    {m.remarks}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION F: Cross-Record Validation Results Matrix */}
        <div className="gov-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-[#003D7C] flex items-center gap-2">
              <CheckCheck className="w-4 h-4 text-[#003D7C]" />
              <span>F. Cross-Record Validation Matrix</span>
            </h2>
            <button
              onClick={() => setActiveTab('validation')}
              className="text-xs font-semibold text-[#003D7C] hover:underline"
            >
              Detailed Engine →
            </button>
          </div>

          <div className="space-y-2.5">
            {parcel.validationResults.map((val) => (
              <div
                key={val.id}
                className={`p-3 rounded border text-xs space-y-1.5 ${
                  val.isMismatch
                    ? 'bg-red-50/50 border-red-200'
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{val.fieldName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      val.severity === 'Critical'
                        ? 'bg-red-600 text-white'
                        : val.severity === 'High'
                        ? 'bg-orange-500 text-white'
                        : val.severity === 'Match'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {val.severity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">{val.sourceA}</div>
                    <div className="font-semibold text-slate-900">{val.recordAValue}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">{val.sourceB}</div>
                    <div className="font-semibold text-slate-900">{val.recordBValue}</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {val.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION H: Ownership Timeline & Provenance */}
        <div className="gov-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-[#003D7C] flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#003D7C]" />
              <span>H. Ownership Provenance Lineage</span>
            </h2>
            <button
              onClick={() => setActiveTab('timeline')}
              className="text-xs font-semibold text-[#003D7C] hover:underline"
            >
              Knowledge Graph →
            </button>
          </div>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
            {parcel.timeline.map((event, idx) => (
              <div key={idx} className="relative text-xs group">
                <div
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                    event.verified
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-red-600 text-red-600'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${event.verified ? 'bg-emerald-600' : 'bg-red-600'}`} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-mono">{event.year} ({event.date})</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                    {event.eventType}
                  </span>
                </div>

                <div className="font-bold text-slate-800 mt-0.5">{event.ownerName}</div>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{event.transferDetails}</p>
                <div className="text-[10px] text-[#003D7C] font-mono mt-1">Ref: {event.sourceDoc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
