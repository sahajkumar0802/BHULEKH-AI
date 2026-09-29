import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LandParcel, ParcelStatus } from '../types/landRecord';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ListTodo,
  Navigation,
  CheckCircle2,
  ArrowRight,
  X,
  Edit3,
  BrainCircuit,
  Sparkles
} from 'lucide-react';

export const VerificationQueue: React.FC = () => {
  const { parcels, setSelectedParcelId, setActiveTab, updateParcelStatus, activeRole, recordAiCorrection } = useApp();

  const [activeTabTier, setActiveTabTier] = useState<'critical' | 'high' | 'medium' | 'low'>('critical');
  const [selectedCaseForAction, setSelectedCaseForAction] = useState<LandParcel | null>(null);
  const [actionType, setActionType] = useState<ParcelStatus | 'request_docs' | 'edit_field' | null>(null);
  const [actionReason, setActionReason] = useState('');

  // Field edit states
  const [editFieldKey, setEditFieldKey] = useState<string>('ownerName');
  const [editFieldLabel, setEditFieldLabel] = useState<string>('Owner Name');
  const [aiOriginalValue, setAiOriginalValue] = useState<string>('Rakesh Kumar');
  const [correctedValue, setCorrectedValue] = useState<string>('Rajesh Kumar');
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);

  const counts = useMemo(() => ({
    critical: parcels.filter((p: LandParcel) => p.riskLevel === 'critical').length,
    high: parcels.filter((p: LandParcel) => p.riskLevel === 'high').length,
    medium: parcels.filter((p: LandParcel) => p.riskLevel === 'medium').length,
    low: parcels.filter((p: LandParcel) => p.riskLevel === 'low').length
  }), [parcels]);

  const queueCases = useMemo(() => {
    return parcels.filter((p: LandParcel) => p.riskLevel === activeTabTier);
  }, [parcels, activeTabTier]);

  const handleOpenActionModal = (p: LandParcel, type: ParcelStatus | 'request_docs' | 'edit_field') => {
    setSelectedCaseForAction(p);
    setActionType(type);
    if (type === 'verified') {
      setActionReason('Title documents and spatial boundaries verified in compliance with Revenue Code.');
    } else if (type === 'field_verification_ordered') {
      setActionReason('Discrepancy in recorded area / ownership requires ground ETS/DGPS demarcation by Patwari.');
    } else if (type === 'in_dispute') {
      setActionReason('Mutation rejected due to active civil title dispute and conflicting transfer instruments.');
    } else if (type === 'edit_field') {
      setEditFieldKey('ownerName');
      setEditFieldLabel('Owner Name');
      setAiOriginalValue(p.khasraNo === '125' ? 'Rakesh Kumar' : p.owner);
      setCorrectedValue(p.owner);
      setActionReason('Typographical discrepancy corrected in accordance with registered Khata ledger.');
    } else {
      setActionReason('Requesting certified copy of parent Khatiyan #48 from District Archives.');
    }
  };

  const handleConfirmAction = () => {
    if (!selectedCaseForAction || !actionType) return;

    if (actionType === 'edit_field') {
      recordAiCorrection({
        documentId: selectedCaseForAction.documents[0]?.id || `DOC-${selectedCaseForAction.khasraNo}`,
        parcelId: selectedCaseForAction.parcelId,
        fieldKey: editFieldKey,
        fieldLabel: editFieldLabel,
        aiValue: aiOriginalValue,
        correctedValue: correctedValue,
        language: 'Hindi',
        notes: actionReason
      });

      setFeedbackSuccessMsg(`AI correction recorded for future model improvement! Ground truth pair saved to AI Learning Center.`);
      setTimeout(() => setFeedbackSuccessMsg(null), 6000);
    } else if (actionType !== 'request_docs') {
      updateParcelStatus(selectedCaseForAction.parcelId, actionType, actionReason);
    } else {
      updateParcelStatus(
        selectedCaseForAction.parcelId,
        'needs_review',
        `Additional documents requested: ${actionReason}`
      );
    }

    setSelectedCaseForAction(null);
    setActionType(null);
    setActionReason('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Official Breadcrumb Bar */}
      <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-4 py-2 rounded border border-slate-200 shadow-sm">
        <span className="text-slate-400">मुखपृष्ठ (Home)</span>
        <span>/</span>
        <span className="text-slate-400">राजस्व अधिकारी पोर्टल (Revenue Portal)</span>
        <span>/</span>
        <span className="font-bold text-[#003D7C]">अधिकारी सत्यापन कतार (Officer Verification Queue)</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-[#003D7C]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Human-Assisted Officer Verification Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-blue-100 text-[#003D7C] border border-blue-200 text-xs font-bold font-mono">
              ROLE: {activeRole.toUpperCase().replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Triage low-confidence OCR records, resolve cross-record conflicts, and record training corrections for the AI Learning Loop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('learning')}
            className="px-3.5 py-2 rounded text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-[#003D7C] border border-blue-200 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Learning Center</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className="px-3.5 py-2 rounded text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <span>Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {feedbackSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold">{feedbackSuccessMsg}</span>
          </div>
          <button onClick={() => setActiveTab('learning')} className="text-emerald-800 font-bold hover:underline">
            View Training Dataset →
          </button>
        </div>
      )}

      {/* Tabs by Risk Severity Tier */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTabTier('critical')}
          className={`p-4 rounded border text-left transition-all ${
            activeTabTier === 'critical'
              ? 'bg-rose-50 border-rose-600 shadow-sm ring-1 ring-rose-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-rose-700">Critical Priority</div>
          <div className="text-2xl font-bold text-rose-900 mt-1">{counts.critical}</div>
          <div className="text-[11px] text-slate-500">Ownership / Boundary Overlap</div>
        </button>

        <button
          onClick={() => setActiveTabTier('high')}
          className={`p-4 rounded border text-left transition-all ${
            activeTabTier === 'high'
              ? 'bg-amber-50 border-amber-600 shadow-sm ring-1 ring-amber-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">High Risk</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">{counts.high}</div>
          <div className="text-[11px] text-slate-500">Duplicate Deeds / Area Variance</div>
        </button>

        <button
          onClick={() => setActiveTabTier('medium')}
          className={`p-4 rounded border text-left transition-all ${
            activeTabTier === 'medium'
              ? 'bg-blue-50 border-[#003D7C] shadow-sm ring-1 ring-blue-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-[#003D7C]">Medium Review</div>
          <div className="text-2xl font-bold text-[#003D7C] mt-1">{counts.medium}</div>
          <div className="text-[11px] text-slate-500">Low OCR Confidence Scores</div>
        </button>

        <button
          onClick={() => setActiveTabTier('low')}
          className={`p-4 rounded border text-left transition-all ${
            activeTabTier === 'low'
              ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-1 ring-emerald-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Clean & Low Risk</div>
          <div className="text-2xl font-bold text-emerald-900 mt-1">{counts.low}</div>
          <div className="text-[11px] text-slate-500">Ready for Title Certificate</div>
        </button>
      </div>

      {/* Cases Docket Table */}
      <div className="gov-card overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Active cases in <strong>{activeTabTier.toUpperCase()}</strong> queue: <strong className="text-slate-900">{queueCases.length}</strong></span>
          <span className="text-[#003D7C] font-semibold">Click any parcel to inspect 360° Digital Land Twin</span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table w-full">
            <thead>
              <tr>
                <th className="gov-th">Parcel ID & Khasra</th>
                <th className="gov-th">Current Owner</th>
                <th className="gov-th">Area (RoR vs GIS)</th>
                <th className="gov-th">AI Risk Assessment</th>
                <th className="gov-th">Status</th>
                <th className="gov-th text-right">Quasi-Judicial Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {queueCases.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="gov-td">
                    <button
                      onClick={() => {
                        setSelectedParcelId(p.parcelId);
                        setActiveTab('twin');
                      }}
                      className="text-[#003D7C] font-bold hover:underline block"
                    >
                      Khasra {p.khasraNo} ({p.village})
                    </button>
                    <span className="text-[11px] text-slate-500 font-mono">{p.parcelId}</span>
                  </td>
                  <td className="gov-td">
                    <span className="font-bold text-slate-900 block">{p.owner}</span>
                    <span className="text-[11px] text-slate-500">{p.fatherHusbandName}</span>
                  </td>
                  <td className="gov-td font-mono">
                    <span className="text-slate-800">{p.areaRoR} ac (RoR)</span>
                    <span className={`text-[11px] block ${p.areaGIS !== p.areaRoR ? 'text-amber-800 font-bold' : 'text-slate-500'}`}>
                      {p.areaGIS} ac (GIS)
                    </span>
                  </td>
                  <td className="gov-td">
                    <div className="flex items-center gap-2 mb-1">
                      <RiskBadge score={p.riskScore} />
                    </div>
                    <span className="text-[11px] text-slate-600 line-clamp-1">
                      {p.riskAssessment.topReasons[0] || 'Clean verified record'}
                    </span>
                  </td>
                  <td className="gov-td">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="gov-td text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenActionModal(p, 'edit_field')}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#003D7C] border border-blue-200 rounded text-xs font-bold transition-colors flex items-center gap-1"
                        title="Edit AI-extracted field to trigger learning feedback"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Field</span>
                      </button>
                      <button
                        onClick={() => handleOpenActionModal(p, 'field_verification_ordered')}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Re-Survey</span>
                      </button>
                      <button
                        onClick={() => handleOpenActionModal(p, 'verified')}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal (Approve / Re-Survey / Edit Field) */}
      {selectedCaseForAction && actionType && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-lg w-full border border-slate-300 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#003D7C] flex items-center gap-2">
                {actionType === 'edit_field' ? (
                  <>
                    <BrainCircuit className="w-5 h-5 text-[#003D7C]" />
                    Correct AI Extracted Field (Training Feedback)
                  </>
                ) : actionType === 'verified' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    Quasi-Judicial Approval of Land Record
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5 text-blue-700" />
                    Order On-Site DGPS Field Re-Survey
                  </>
                )}
              </h3>
              <button onClick={() => setSelectedCaseForAction(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
              <p><strong>Parcel ID:</strong> {selectedCaseForAction.parcelId}</p>
              <p><strong>Khasra:</strong> {selectedCaseForAction.khasraNo} in {selectedCaseForAction.village} Mauza</p>
              <p><strong>Current Stated Owner:</strong> {selectedCaseForAction.owner}</p>
            </div>

            {actionType === 'edit_field' ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[#003D7C]">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#003D7C]" />
                    AI Continuous Learning Protocol
                  </p>
                  <p className="text-[11px] text-blue-900 mt-0.5">
                    "AI correction recorded for future model improvement." Submitting this correction automatically appends to the Indic-NER training feedback dataset.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Revenue Field</label>
                  <select
                    value={editFieldKey}
                    onChange={(e) => {
                      setEditFieldKey(e.target.value);
                      setEditFieldLabel(e.target.value === 'ownerName' ? 'Owner Name' : e.target.value === 'mutationNo' ? 'Mutation Number' : 'Area (Acres)');
                    }}
                    className="w-full p-2 border border-slate-300 rounded text-xs text-slate-900 font-semibold"
                  >
                    <option value="ownerName">Owner Name (रैयत का नाम)</option>
                    <option value="mutationNo">Mutation Number (दाखिल खारिज)</option>
                    <option value="area">Stated Area (रक़बा)</option>
                    <option value="fatherName">Father / Husband Name</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-red-600 block mb-1">AI Prediction (Before)</label>
                    <input
                      type="text"
                      value={aiOriginalValue}
                      onChange={(e) => setAiOriginalValue(e.target.value)}
                      className="w-full p-2 border border-red-300 bg-red-50/50 rounded text-xs font-mono text-red-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-emerald-700 block mb-1">Officer Correction (After)</label>
                    <input
                      type="text"
                      value={correctedValue}
                      onChange={(e) => setCorrectedValue(e.target.value)}
                      className="w-full p-2 border border-emerald-400 bg-emerald-50/50 rounded text-xs font-bold text-emerald-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Officer Correction Reason / Notes</label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quasi-Judicial Action Order Notes</label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedCaseForAction(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="gov-btn-primary text-xs"
              >
                Confirm & Seal Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
