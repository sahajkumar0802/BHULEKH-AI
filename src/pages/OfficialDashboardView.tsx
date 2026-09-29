import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Award,
  ShieldAlert,
  FileCheck,
  Scale,
  GitBranch,
  UserCheck,
  LogOut
} from 'lucide-react';
import { VerificationCase, DisputeOutcome } from '../services/verificationCaseService';
import { UserRole } from '../types/landRecord';

export const OfficialDashboardView: React.FC = () => {
  const { 
    currentUser, 
    selectedState, 
    selectedDistrict, 
    selectedTehsil, 
    getOfficerCases,
    processOfficerDecision,
    resolveDisputeCase,
    addAuditLog,
    logoutUser
  } = useApp();

  // Officer Jurisdiction & Role State
  const [filterState, setFilterState] = useState<string>(selectedState || 'Jharkhand');
  const [filterDistrict, setFilterDistrict] = useState<string>(selectedDistrict || 'Dumka');
  const [filterTehsil, setFilterTehsil] = useState<string>(selectedTehsil || 'Dumka Sadar');
  const [activeOfficerLevel, setActiveOfficerLevel] = useState<UserRole>(
    currentUser?.role && currentUser.role !== 'citizen' ? currentUser.role : 'patwari'
  );

  // Active Queue Tab
  const [activeQueueTab, setActiveQueueTab] = useState<string>('all');

  // Filtered cases strictly by jurisdiction & hierarchy (Service layer enforced)
  const officerCases = useMemo(() => {
    return getOfficerCases(filterState, filterDistrict, filterTehsil, activeOfficerLevel);
  }, [filterState, filterDistrict, filterTehsil, activeOfficerLevel, getOfficerCases]);

  // Tab Filtering respecting strict role visibility hierarchy
  const displayedCases = useMemo(() => {
    if (activeQueueTab === 'all') return officerCases;
    
    // -------------------------------------------------------------
    // BDO Tabs (Level 1: Block Level)
    // -------------------------------------------------------------
    if (activeOfficerLevel === 'patwari') {
      if (activeQueueTab === 'mutation_pending') {
        return officerCases.filter(c => c.isAlternativeDocument && c.documentType.toLowerCase().includes('mutation') && c.status !== 'rejected');
      }
      if (activeQueueTab === 'survey_pending') {
        return officerCases.filter(c => c.isAlternativeDocument && (c.documentType.toLowerCase().includes('survey') || c.documentType.toLowerCase().includes('khatiyan')) && c.status !== 'rejected');
      }
    }

    // -------------------------------------------------------------
    // CO Tabs (Level 2: Circle Level - BDO + CO visible)
    // -------------------------------------------------------------
    if (activeOfficerLevel === 'tehsildar') {
      if (activeQueueTab === 'co_pending') {
        // Strictly actionable CO queue
        return officerCases.filter(c => c.currentStage === 'level_2_co' && c.status !== 'rejected');
      }
      if (activeQueueTab === 'bdo_queue') {
        // Monitored BDO queue
        return officerCases.filter(c => c.currentStage === 'level_1_field' || c.currentStage === 'user_submitted');
      }
    }

    // -------------------------------------------------------------
    // Collector Tabs (Level 3: District Level - BDO + CO + Collector visible)
    // -------------------------------------------------------------
    if (activeOfficerLevel === 'district_officer') {
      if (activeQueueTab === 'collector_pending') {
        // Strictly actionable Collector queue
        return officerCases.filter(c => c.currentStage === 'level_3_collector' && c.status !== 'rejected');
      }
      if (activeQueueTab === 'co_queue') {
        return officerCases.filter(c => c.currentStage === 'level_2_co');
      }
      if (activeQueueTab === 'bdo_queue') {
        return officerCases.filter(c => c.currentStage === 'level_1_field' || c.currentStage === 'user_submitted');
      }
      if (activeQueueTab === 'completed') {
        return officerCases.filter(c => c.status === 'resolved' || c.currentStage === 'verified');
      }
    }

    // Common Tabs
    if (activeQueueTab === 'conflict_cases') {
      return officerCases.filter(c => c.riskScore >= 65 || c.problemDetected.includes('CONFLICT') || c.dispute?.isDisputed);
    }
    if (activeQueueTab === 'approaching_sla') {
      return officerCases.filter(c => c.isDelayed || c.daysPending >= 10);
    }
    if (activeQueueTab === 'rejected') {
      return officerCases.filter(c => c.status === 'rejected');
    }

    return officerCases;
  }, [officerCases, activeQueueTab, activeOfficerLevel]);

  // Selected Case for Modal Decision
  const [inspectCase, setInspectCase] = useState<VerificationCase | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [decisionEvidence, setDecisionEvidence] = useState('');
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [decisionToast, setDecisionToast] = useState<string | null>(null);

  // Dispute Decision State
  const [selectedDisputeOutcome, setSelectedDisputeOutcome] = useState<DisputeOutcome>('Conflict Resolved');

  // Daily Batch Submission State
  const [isDailyBatchSubmitted, setIsDailyBatchSubmitted] = useState(false);
  const [dailyBatchDigest, setDailyBatchDigest] = useState<string | null>(null);

  // Officer Profile
  const officerName = 
    activeOfficerLevel === 'patwari' ? 'R. K. Mishra (Block Development Officer)' :
    activeOfficerLevel === 'tehsildar' ? 'S. N. Pandey (Circle Officer)' :
    activeOfficerLevel === 'district_officer' ? 'Rajeshwar Singh (IAS, District Collector)' :
    'System Administrator (National Nodal)';

  // Hierarchy Action Permission Evaluation (Visibility != Action Permission)
  const isActionableForCurrentOfficer = useMemo(() => {
    if (!inspectCase) return false;
    if (inspectCase.status === 'resolved' || inspectCase.currentStage === 'verified') return false;
    if (activeOfficerLevel === 'patwari') {
      return inspectCase.currentStage === 'level_1_field' || inspectCase.currentStage === 'user_submitted';
    }
    if (activeOfficerLevel === 'tehsildar') {
      return inspectCase.currentStage === 'level_2_co';
    }
    if (activeOfficerLevel === 'district_officer') {
      return inspectCase.currentStage === 'level_3_collector';
    }
    return true; // admin
  }, [inspectCase, activeOfficerLevel]);

  // Role-Specific KPI Calculations (Derived from authorized hierarchy query)
  const totalAssigned = officerCases.length;

  const actionablePendingCount = useMemo(() => {
    if (activeOfficerLevel === 'patwari') {
      return officerCases.filter(c => (c.currentStage === 'level_1_field' || c.currentStage === 'user_submitted') && c.status !== 'rejected' && c.status !== 'resolved').length;
    }
    if (activeOfficerLevel === 'tehsildar') {
      return officerCases.filter(c => c.currentStage === 'level_2_co' && c.status !== 'rejected' && c.status !== 'resolved').length;
    }
    if (activeOfficerLevel === 'district_officer') {
      return officerCases.filter(c => c.currentStage === 'level_3_collector' && c.status !== 'rejected' && c.status !== 'resolved').length;
    }
    return officerCases.filter(c => c.status === 'pending' || c.status === 'in_review').length;
  }, [officerCases, activeOfficerLevel]);

  const monitoredOrSecondaryCount = useMemo(() => {
    if (activeOfficerLevel === 'patwari') {
      return officerCases.filter(c => c.bdoApprovalNote || c.status === 'resolved').length;
    }
    if (activeOfficerLevel === 'tehsildar') {
      return officerCases.filter(c => c.currentStage === 'level_1_field').length;
    }
    if (activeOfficerLevel === 'district_officer') {
      return officerCases.filter(c => c.currentStage === 'level_2_co' || c.currentStage === 'level_1_field').length;
    }
    return officerCases.length;
  }, [officerCases, activeOfficerLevel]);

  const overdueCount = officerCases.filter(c => c.isDelayed).length;
  const disputeCount = officerCases.filter(c => c.dispute?.isDisputed || c.riskScore >= 65).length;
  const resolvedCount = officerCases.filter(c => c.status === 'resolved' || c.currentStage === 'verified').length;
  const rejectedCount = officerCases.filter(c => c.status === 'rejected').length;

  // Handle Standard Statutory Decision: Approve vs Reject
  const handleOfficerDecision = (decision: 'approve' | 'reject') => {
    if (!inspectCase) return;
    setDecisionError(null);

    if (decision === 'reject' && (!decisionReason || decisionReason.trim().length < 5)) {
      setDecisionError('Mandatory Rejection Reason required (minimum 5 characters). Explain the defect to the citizen.');
      return;
    }

    setIsSubmittingDecision(true);

    setTimeout(() => {
      const res = processOfficerDecision({
        caseId: inspectCase.id,
        officerName,
        officerRole: activeOfficerLevel,
        decision,
        reason: decisionReason,
        evidenceNotes: decisionEvidence
      });

      setIsSubmittingDecision(false);

      if (res.success) {
        setDecisionToast(
          decision === 'approve'
            ? activeOfficerLevel === 'district_officer'
              ? `Case #${inspectCase.id} FINAL VERIFIED by District Collector`
              : `Case #${inspectCase.id} Approved & Advanced to Next Level`
            : `Case #${inspectCase.id} Rejected with Recorded Reason`
        );
        setInspectCase(null);
        setDecisionReason('');
        setDecisionEvidence('');
      }
    }, 700);
  };

  // Handle Dispute Quasi-Judicial Decision (For Twinning Disputes)
  const handleDisputeResolution = () => {
    if (!inspectCase) return;
    setDecisionError(null);

    if (!decisionReason || decisionReason.trim().length < 5) {
      setDecisionError('Statutory reasoning remarks required (minimum 5 characters).');
      return;
    }

    setIsSubmittingDecision(true);

    setTimeout(() => {
      const res = resolveDisputeCase({
        caseId: inspectCase.id,
        outcome: selectedDisputeOutcome,
        officerRemarks: decisionReason,
        officerName,
        officerRole: activeOfficerLevel === 'tehsildar' ? 'Circle Officer / Tehsildar' : 'District Collector / SDM'
      });

      setIsSubmittingDecision(false);

      if (res.success) {
        setDecisionToast(`Dispute Case #${inspectCase.id} updated to "${selectedDisputeOutcome}"`);
        setInspectCase(null);
        setDecisionReason('');
      }
    }, 800);
  };

  // Handle Daily Batch Work Submission
  const handleDailyBatchSubmit = () => {
    const digest = `BATCH-SIG-${filterDistrict.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-SHA256`;
    setDailyBatchDigest(digest);
    setIsDailyBatchSubmitted(true);

    addAuditLog({
      officerName,
      officerRole: activeOfficerLevel,
      action: 'Batch Verified',
      parcelId: `${filterDistrict}-BATCH`,
      reason: `Officer daily verification sign-off submitted. Cryptographic attestation: ${digest}`
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-7 pb-16 animate-in fade-in duration-300">
      {/* Toast */}
      {decisionToast && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{decisionToast}</span>
          <button onClick={() => setDecisionToast(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Header with Breadcrumb */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Home</span>
          <span>/</span>
          <span>Revenue Administration</span>
          <span>/</span>
          <span className="text-gov-navy font-bold">Official Verification Portal</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gov-navy">
                शासकीय राजस्व अधिकारी पोर्टल | Official Verification Portal
              </h1>
              <span className="px-2 py-0.5 rounded bg-gov-navy text-white text-[11px] font-bold font-mono">
                3-STAGE STATUTORY RBAC
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Statutory jurisdiction workflow: Level 1 (BDO - Block) → Level 2 (CO - Circle) → Level 3 (District Collector / DM).
            </p>
          </div>

          {/* Daily Sign-Off Attestation & Logout */}
          <div className="flex items-center gap-2 flex-wrap">
            {isDailyBatchSubmitted ? (
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-300">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Daily Sign-Off Synced ({dailyBatchDigest?.substring(0, 16)}...)</span>
              </span>
            ) : (
              <button
                onClick={handleDailyBatchSubmit}
                className="gov-btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-xs"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit Daily Batch Attestation</span>
              </button>
            )}

            <button
              id="official-profile-logout-btn"
              onClick={logoutUser}
              className="px-3 py-1.5 rounded text-xs font-bold bg-white hover:bg-red-50 text-red-800 border border-red-300 shadow-xs transition-all flex items-center gap-1.5"
              title="Logout of Government Official Session"
            >
              <LogOut className="w-3.5 h-3.5 text-red-700" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ROLE SELECTOR (BDO -> CO -> COLLECTOR) & JURISDICTION SELECTION        */}
      {/* ========================================================================= */}
      <div className="gov-card p-5 rounded-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              सक्रिय प्राधिकृत अधिकारी | Active Official Authority
            </span>
            <div className="text-sm font-black text-gov-navy mt-0.5 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-gov-navy" />
              <span>{officerName}</span>
            </div>
          </div>

          {/* Role Level Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setActiveOfficerLevel('patwari');
                setActiveQueueTab('all');
              }}
              className={`px-3 py-1 text-xs font-bold rounded border transition-all ${
                activeOfficerLevel === 'patwari'
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Level 1: BDO (Block)
            </button>

            <button
              onClick={() => {
                setActiveOfficerLevel('tehsildar');
                setActiveQueueTab('all');
              }}
              className={`px-3 py-1 text-xs font-bold rounded border transition-all ${
                activeOfficerLevel === 'tehsildar'
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Level 2: CO (Circle)
            </button>

            <button
              onClick={() => {
                setActiveOfficerLevel('district_officer');
                setActiveQueueTab('all');
              }}
              className={`px-3 py-1 text-xs font-bold rounded border transition-all ${
                activeOfficerLevel === 'district_officer'
                  ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Level 3: Collector (District)
            </button>

            <button
              onClick={() => {
                setActiveOfficerLevel('admin');
                setActiveQueueTab('all');
              }}
              className={`px-3 py-1 text-xs font-bold rounded border transition-all ${
                activeOfficerLevel === 'admin'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Admin Oversight
            </button>
          </div>
        </div>

        {/* Jurisdiction Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">State Jurisdiction (राज्य)</label>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
            >
              <option value="Jharkhand">Jharkhand (झारखण्ड)</option>
              <option value="Bihar">Bihar (बिहार)</option>
              <option value="Odisha">Odisha (ओडिशा)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">District (जिला)</label>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
            >
              {filterState === 'Bihar' ? (
                <>
                  <option value="Arwal">Arwal</option>
                  <option value="Patna">Patna</option>
                  <option value="Gaya">Gaya</option>
                </>
              ) : (
                <>
                  <option value="Dumka">Dumka</option>
                  <option value="Ranchi">Ranchi</option>
                  <option value="Deoghar">Deoghar</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Block / Tehsil (अंचल)</label>
            <select
              value={filterTehsil}
              onChange={(e) => setFilterTehsil(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
            >
              {filterDistrict === 'Arwal' ? (
                <>
                  <option value="Arwal Sadar">Arwal Sadar</option>
                  <option value="Karpi">Karpi</option>
                  <option value="Kaler">Kaler</option>
                </>
              ) : (
                <>
                  <option value="Dumka Sadar">Dumka Sadar</option>
                  <option value="Shikaripara">Shikaripara</option>
                  <option value="Jama">Jama</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ROLE-SPECIFIC KPI METRIC CARDS                                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gov-card p-4 rounded-lg border-t-4 border-t-gov-navy">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
            <span>
              {activeOfficerLevel === 'patwari' ? 'BDO Visible Cases' :
               activeOfficerLevel === 'tehsildar' ? 'CO & BDO Visible Records' :
               'District Visible Registry'}
            </span>
            <Building2 className="w-4 h-4 text-gov-navy" />
          </div>
          <div className="text-2xl font-black text-gov-navy font-mono">{totalAssigned}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{filterTehsil}, {filterDistrict}</div>
        </div>

        <div className="gov-card p-4 rounded-lg border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
            <span className="font-bold">
              {activeOfficerLevel === 'patwari' ? '⚡ BDO Pending (Actionable)' :
               activeOfficerLevel === 'tehsildar' ? '⚡ CO Pending (Actionable)' :
               '⚡ Collector Pending (Actionable)'}
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 font-mono">{actionablePendingCount}</div>
          <div className="text-[11px] text-amber-700 mt-0.5 font-semibold">
            {activeOfficerLevel === 'patwari' ? 'Awaiting BDO field inspection' :
             activeOfficerLevel === 'tehsildar' ? 'Awaiting CO hearing / sanction' :
             'Awaiting Collector final seal'}
          </div>
        </div>

        <div className="gov-card p-4 rounded-lg border-t-4 border-t-red-600">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
            <span>
              {activeOfficerLevel === 'patwari' ? 'BDO Conflicts / High Risk' :
               activeOfficerLevel === 'tehsildar' ? 'BDO Level Cases (Monitored)' :
               'CO / BDO Active Pipeline'}
            </span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {activeOfficerLevel === 'patwari' ? disputeCount : monitoredOrSecondaryCount}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5 font-semibold">
            {activeOfficerLevel === 'patwari' ? 'Discrepancy / overlap flagged' :
             activeOfficerLevel === 'tehsildar' ? 'Visible under hierarchy (View Only)' :
             'Lower hierarchy active pipeline'}
          </div>
        </div>

        <div className="gov-card p-4 rounded-lg border-t-4 border-t-emerald-600">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
            <span>
              {activeOfficerLevel === 'district_officer' ? 'Final Verified Titles' :
               activeOfficerLevel === 'tehsildar' ? 'Sanctioned to Collector' :
               'Forwarded to CO Level'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            {activeOfficerLevel === 'district_officer' ? resolvedCount :
             activeOfficerLevel === 'tehsildar' ? officerCases.filter(c => c.coApprovalNote || c.currentStage === 'level_3_collector' || c.status === 'resolved').length :
             officerCases.filter(c => c.bdoApprovalNote || c.status === 'resolved').length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 font-semibold">
            {activeOfficerLevel === 'district_officer' ? 'Minted & Digitally Certified' : 'Advanced to next statutory level'}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DEDICATED DASHBOARD TABS (BDO / CO / COLLECTOR HIERARCHY)                */}
      {/* ========================================================================= */}
      <div className="gov-card p-5 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-gov-navy">
              {activeOfficerLevel === 'patwari' && 'प्रखंड विकास अधिकारी (BDO) सत्यापन सूची | Block Verification Queue (BDO-Only)'}
              {activeOfficerLevel === 'tehsildar' && 'अंचल अधिकारी (CO) सुनवाई एवं सत्यापन सूची | Circle Hearing Queue (BDO + CO Visible)'}
              {activeOfficerLevel === 'district_officer' && 'जिला समाहर्ता (Collector) अंतिम विधिक आदेश सूची | Collector Sign-Off (Full District Hierarchy)'}
              {activeOfficerLevel === 'admin' && 'National Nodal Administrative Audit Queue'}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold border border-slate-200">
              {displayedCases.length} Records
            </span>
          </div>

          {/* Role-Specific Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
            <button
              onClick={() => setActiveQueueTab('all')}
              className={`px-2.5 py-1 rounded font-bold transition-all border ${
                activeQueueTab === 'all' 
                  ? 'bg-gov-navy text-white border-gov-navy shadow-2xs' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              All ({totalAssigned})
            </button>

            {/* BDO TABS */}
            {activeOfficerLevel === 'patwari' && (
              <>
                <button
                  onClick={() => setActiveQueueTab('mutation_pending')}
                  className={`px-2.5 py-1 rounded font-bold transition-all border ${
                    activeQueueTab === 'mutation_pending' 
                      ? 'bg-gov-navy text-white border-gov-navy shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Mutation Pending
                </button>

                <button
                  onClick={() => setActiveQueueTab('survey_pending')}
                  className={`px-2.5 py-1 rounded font-bold transition-all border ${
                    activeQueueTab === 'survey_pending' 
                      ? 'bg-gov-navy text-white border-gov-navy shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Survey Pending
                </button>
              </>
            )}

            {/* CO TABS */}
            {activeOfficerLevel === 'tehsildar' && (
              <>
                <button
                  onClick={() => setActiveQueueTab('co_pending')}
                  className={`px-2.5 py-1 rounded font-bold transition-all border ${
                    activeQueueTab === 'co_pending' 
                      ? 'bg-gov-navy text-white border-gov-navy shadow-2xs' 
                      : 'bg-white text-blue-900 border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  ⚡ CO Actionable ({actionablePendingCount})
                </button>

                <button
                  onClick={() => setActiveQueueTab('bdo_queue')}
                  className={`px-2.5 py-1 rounded font-bold transition-all border ${
                    activeQueueTab === 'bdo_queue' 
                      ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  BDO Level (View Only) ({monitoredOrSecondaryCount})
                </button>
              </>
            )}

            {/* COLLECTOR TABS */}
            {activeOfficerLevel === 'district_officer' && (
              <>
                <button
                  onClick={() => setActiveQueueTab('collector_pending')}
                  className={`px-2.5 py-1 rounded font-bold transition-all border ${
                    activeQueueTab === 'collector_pending' 
                      ? 'bg-gov-navy text-white border-gov-navy shadow-2xs' 
                      : 'bg-white text-blue-900 border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  ⚡ Collector Actionable ({actionablePendingCount})
                </button>

                <button
                  onClick={() => setActiveQueueTab('co_queue')}
                  className={`px-2.5 py-1 rounded font-bold transition-all border ${
                    activeQueueTab === 'co_queue' 
                      ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  CO Active Stage ({officerCases.filter(c => c.currentStage === 'level_2_co').length})
                </button>

                <button
                  onClick={() => setActiveQueueTab('bdo_queue')}
                  className={`px-2.5 py-1 rounded font-bold transition-all border ${
                    activeQueueTab === 'bdo_queue' 
                      ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  BDO Active Stage ({officerCases.filter(c => c.currentStage === 'level_1_field').length})
                </button>

                <button
                  onClick={() => setActiveQueueTab('completed')}
                  className={`px-2.5 py-1 rounded font-bold transition-all border ${
                    activeQueueTab === 'completed' 
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs' 
                      : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  Final Verified ({resolvedCount})
                </button>
              </>
            )}

            <button
              onClick={() => setActiveQueueTab('conflict_cases')}
              className={`px-2.5 py-1 rounded font-bold transition-all border ${
                activeQueueTab === 'conflict_cases' 
                  ? 'bg-red-700 text-white border-red-700' 
                  : 'bg-white text-red-800 border-red-300 hover:bg-red-50'
              }`}
            >
              Conflicts ({disputeCount})
            </button>

            <button
              onClick={() => setActiveQueueTab('approaching_sla')}
              className={`px-2.5 py-1 rounded font-bold transition-all border ${
                activeQueueTab === 'approaching_sla' 
                  ? 'bg-amber-600 text-white border-amber-600' 
                  : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
              }`}
            >
              14-Day Overdue ({overdueCount})
            </button>

            <button
              onClick={() => setActiveQueueTab('rejected')}
              className={`px-2.5 py-1 rounded font-bold transition-all border ${
                activeQueueTab === 'rejected' 
                  ? 'bg-slate-800 text-white border-slate-800' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="gov-table w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-gov-navy font-bold uppercase tracking-wider text-[11px]">
                <th className="gov-th py-2.5 px-3">Case ID &amp; Type</th>
                <th className="gov-th py-2.5 px-3">Claimant &amp; Location</th>
                <th className="gov-th py-2.5 px-3">Khasra / Area</th>
                <th className="gov-th py-2.5 px-3">Statutory Stage &amp; Authority</th>
                <th className="gov-th py-2.5 px-3">Land Risk</th>
                <th className="gov-th py-2.5 px-3">SLA Status</th>
                <th className="gov-th py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {displayedCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    No cases match the selected filter in current jurisdiction ({filterTehsil}, {filterDistrict}, {filterState}).
                  </td>
                </tr>
              ) : (
                displayedCases.map((c) => {
                  const isOverdue = c.isDelayed;
                  const hasDispute = c.dispute?.isDisputed;
                  const isAlt = c.isAlternativeDocument;

                  const isRowActionable = 
                    (activeOfficerLevel === 'patwari' && (c.currentStage === 'level_1_field' || c.currentStage === 'user_submitted')) ||
                    (activeOfficerLevel === 'tehsildar' && c.currentStage === 'level_2_co') ||
                    (activeOfficerLevel === 'district_officer' && c.currentStage === 'level_3_collector') ||
                    (activeOfficerLevel === 'admin' && c.currentStage !== 'verified');

                  return (
                    <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="gov-td py-2.5 px-3 font-bold text-gov-navy">
                        <div className="flex items-center gap-1.5">
                          <span>{c.id}</span>
                          {isRowActionable && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              ⚡ Action
                            </span>
                          )}
                        </div>
                        <span className={`block text-[10px] font-sans font-semibold ${isAlt ? 'text-amber-800' : 'text-slate-600'}`}>
                          {c.documentType}
                        </span>
                        {hasDispute && (
                          <span className="inline-block text-[9px] font-sans text-red-800 font-bold bg-red-100 px-1 py-0.2 rounded border border-red-300 mt-0.5">
                            ⚠ Dispute Flagged
                          </span>
                        )}
                      </td>

                      <td className="gov-td py-2.5 px-3 font-sans">
                        <div className="font-bold text-slate-900">{c.ownerName}</div>
                        <div className="text-[11px] text-slate-500">{c.village}, {c.block}</div>
                      </td>

                      <td className="gov-td py-2.5 px-3">
                        <div className="font-bold text-slate-800">Khasra #{c.khasraNo}</div>
                        <div className="text-[11px] text-slate-500">{c.areaAcres} Acres</div>
                      </td>

                      <td className="gov-td py-2.5 px-3 font-sans">
                        {c.status === 'rejected' ? (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px] border border-red-300">
                            Rejected / Correction Required
                          </span>
                        ) : c.currentStage === 'verified' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                            FINAL VERIFIED
                          </span>
                        ) : c.currentStage === 'level_3_collector' ? (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-gov-navy font-bold text-[10px] border border-blue-300">
                            Level 3: District Collector Sign-Off
                          </span>
                        ) : c.currentStage === 'level_2_co' ? (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-gov-navy font-bold text-[10px] border border-blue-300">
                            Level 2: Circle Officer (CO) Hearing
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                            Level 1: BDO Field Verification
                          </span>
                        )}
                      </td>

                      <td className="gov-td py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
                          c.riskScore > 65 ? 'bg-red-50 text-red-800 border-red-300' :
                          c.riskScore > 30 ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}>
                          {c.riskScore}/100 ({c.riskLevel.toUpperCase()})
                        </span>
                      </td>

                      <td className="gov-td py-2.5 px-3 font-sans">
                        {isOverdue ? (
                          <span className="text-red-700 font-bold text-[11px] flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                            <span>{c.daysPending}d (&gt;14d Overdue)</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px] font-mono">{c.daysPending} days</span>
                        )}
                      </td>

                      <td className="gov-td py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setInspectCase(c);
                            setDecisionReason('');
                            setDecisionEvidence('');
                            setDecisionError(null);
                          }}
                          className={`py-1 px-2.5 rounded text-xs font-bold shadow-xs transition-all flex items-center gap-1 ml-auto border ${
                            isRowActionable 
                              ? 'bg-gov-navy hover:bg-gov-navy/90 text-white border-gov-navy' 
                              : 'bg-white hover:bg-slate-100 text-gov-navy border-slate-300'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRowActionable ? 'Take Action' : 'View Audit'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. STATUTORY CASE REVIEW & THREE-STEP DECISION MODAL                      */}
      {/* ========================================================================= */}
      {inspectCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-xl border border-slate-300 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-gov-navy">
                    Statutory Case Review: {inspectCase.id}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                    inspectCase.isAlternativeDocument ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-blue-100 text-gov-navy border-blue-300'
                  }`}>
                    {inspectCase.isAlternativeDocument ? 'ALTERNATIVE LAND RECORD (3-STAGE)' : 'PRIMARY REGISTERED DEED'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                    isActionableForCurrentOfficer 
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {isActionableForCurrentOfficer ? '⚡ ACTIONABLE AT YOUR LEVEL' : '👁 VIEW & AUDIT MODE'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned Authority: <strong className="text-slate-800">{officerName}</strong> | Jurisdiction: <strong className="text-slate-800">{filterDistrict} ({filterTehsil})</strong>
                </p>
              </div>

              <button
                onClick={() => setInspectCase(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* 1. Document & AI OCR Extracted Fields */}
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Original Scanned Document &amp; AI Extraction</span>
                <span className="font-mono text-[10px] text-slate-500">OCR Confidence: 96.4%</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px] font-sans">Document Type</span>
                  <span className="font-semibold text-slate-800">{inspectCase.documentType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-sans">Owner / Raiyat</span>
                  <span className="font-semibold text-slate-800">{inspectCase.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-sans">Khasra / Plot</span>
                  <span className="font-semibold text-slate-800">#{inspectCase.khasraNo} ({inspectCase.areaAcres} Ac)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-sans">Location</span>
                  <span className="font-semibold text-slate-800">{inspectCase.village}, {inspectCase.block}</span>
                </div>
              </div>
            </div>

            {/* 2. Previous Level Approvals Chain */}
            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded text-xs space-y-2">
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-gov-navy" />
                <span>Statutory Hierarchy Progress (3-Stage Workflow)</span>
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className={`p-2 rounded border ${
                  inspectCase.bdoApprovalNote ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200'
                }`}>
                  <span className="font-bold block">1. BDO (Block Level):</span>
                  <span className="text-slate-600">{inspectCase.bdoApprovalNote || (inspectCase.currentStage === 'level_1_field' ? 'Pending Review' : 'Approved')}</span>
                </div>

                <div className={`p-2 rounded border ${
                  inspectCase.coApprovalNote ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200'
                }`}>
                  <span className="font-bold block">2. CO (Circle Level):</span>
                  <span className="text-slate-600">{inspectCase.coApprovalNote || (inspectCase.currentStage === 'level_2_co' ? 'Pending Hearing' : inspectCase.currentStage === 'level_3_collector' || inspectCase.currentStage === 'verified' ? 'Approved' : 'Awaiting BDO')}</span>
                </div>

                <div className={`p-2 rounded border ${
                  inspectCase.collectorApprovalNote ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200'
                }`}>
                  <span className="font-bold block">3. Collector (District Level):</span>
                  <span className="text-slate-600">{inspectCase.collectorApprovalNote || (inspectCase.currentStage === 'level_3_collector' ? 'Pending Final Seal' : inspectCase.currentStage === 'verified' ? 'FINAL VERIFIED' : 'Awaiting CO')}</span>
                </div>
              </div>
            </div>

            {/* 3. Conflict / Discrepancy Information */}
            {(inspectCase.problemDetected || inspectCase.dispute?.isDisputed) && (
              <div className="p-3.5 bg-red-50 border border-red-300 rounded text-xs space-y-1 text-red-950">
                <div className="font-bold text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Detected Issues &amp; Conflicts:</span>
                </div>
                <p className="font-sans text-red-900 leading-relaxed">
                  {inspectCase.problemDetected || inspectCase.dispute?.conflictReason}
                </p>
                <div className="font-mono text-[11px] text-red-800 font-bold">
                  Risk Score: {inspectCase.riskScore}/100 ({inspectCase.riskLevel.toUpperCase()})
                </div>
              </div>
            )}

            {/* 4. Supporting Document (if uploaded by citizen) */}
            {inspectCase.dispute?.supportingDocument && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-950 font-bold">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <span>Citizen Supporting Document Attached</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-800">{inspectCase.dispute.supportingDocument.fileSize}</span>
                </div>
                <div className="font-mono text-emerald-950 font-bold">
                  {inspectCase.dispute.supportingDocument.fileName}
                </div>
                <p className="text-emerald-900 text-[11px]">
                  <b>Citizen Statement:</b> "{inspectCase.dispute.supportingDocument.userNotes}"
                </p>
              </div>
            )}

            {/* 5. Hierarchical Action or View-Only Banner */}
            {isActionableForCurrentOfficer ? (
              <div className="space-y-3 text-xs pt-1">
                {inspectCase.dispute?.isDisputed && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Select Quasi-Judicial Dispute Resolution Outcome
                    </label>
                    <select
                      value={selectedDisputeOutcome}
                      onChange={(e) => setSelectedDisputeOutcome(e.target.value as DisputeOutcome)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-slate-900 focus:outline-none focus:border-gov-navy cursor-pointer text-xs"
                    >
                      <option value="Conflict Resolved">Conflict Resolved (Title cleared based on supporting lineage evidence)</option>
                      <option value="Conflict Confirmed">Conflict Confirmed (Duplicate claim substantiated, deed returned)</option>
                      <option value="More Information Required">More Information Required (Direct field inspection)</option>
                      <option value="Escalated">Escalated (Refer to District Collector / SDM Revenue Court)</option>
                      <option value="Rejected">Rejected (Defective conveyance deed)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                    <span>Official Statutory Reasoning / Order Remarks</span>
                    <span className="text-amber-800 text-[10px]">Mandatory for rejection (min 5 chars)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={decisionReason}
                    onChange={(e) => {
                      setDecisionReason(e.target.value);
                      setDecisionError(null);
                    }}
                    placeholder="Record ground survey observations, lineage verification, or statutory order notes..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gov-navy text-xs font-sans font-medium"
                  />
                </div>

                {decisionError && (
                  <div className="p-2.5 bg-red-50 border border-red-300 rounded text-xs text-red-800 flex items-center gap-2">
                    <XCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{decisionError}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2">
                  {inspectCase.dispute?.isDisputed ? (
                    <button
                      type="button"
                      disabled={isSubmittingDecision}
                      onClick={handleDisputeResolution}
                      className="w-full py-2.5 px-4 gov-btn-primary text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmittingDecision ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Recording Quasi-Judicial Order...</span>
                        </>
                      ) : (
                        <>
                          <Scale className="w-4 h-4" />
                          <span>Apply Dispute Resolution Outcome ({selectedDisputeOutcome})</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <button
                        type="button"
                        disabled={isSubmittingDecision}
                        onClick={() => handleOfficerDecision('reject')}
                        className="flex-1 py-2 px-3 bg-white hover:bg-red-50 border border-red-300 text-red-800 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>✕ Reject / Cross (Reason Mandatory)</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmittingDecision}
                        onClick={() => handleOfficerDecision('approve')}
                        className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isSubmittingDecision ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Signing Decision...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {activeOfficerLevel === 'district_officer'
                                ? '✓ Final Approve & Grant Verified Title'
                                : activeOfficerLevel === 'tehsildar'
                                ? '✓ Sanction CO Title & Forward to Collector'
                                : '✓ Verify Field Report & Forward to CO'
                              }
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* VIEW-ONLY HIERARCHY NOTICE BANNER */
              <div className="pt-2">
                {inspectCase.currentStage === 'verified' ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-950 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Final Title Verified &amp; Certified:</strong> This land record has completed all statutory stages (BDO → CO → Collector). Digital Title Certificate has been minted. Modification is locked.
                    </span>
                  </div>
                ) : activeOfficerLevel === 'tehsildar' && inspectCase.currentStage === 'level_1_field' ? (
                  <div className="p-3.5 bg-blue-50 border border-blue-300 rounded text-xs text-blue-950 flex items-center gap-2 font-medium">
                    <Eye className="w-4 h-4 text-gov-navy shrink-0" />
                    <span>
                      <strong>BDO Level 1 Case — View &amp; Audit Mode:</strong> Visibility is enabled under the hierarchical access system. Action can only be taken by the BDO at this stage. Once BDO completes Level 1 verification, this case will advance to the CO Actionable Queue.
                    </span>
                  </div>
                ) : activeOfficerLevel === 'district_officer' ? (
                  <div className="p-3.5 bg-blue-50 border border-blue-300 rounded text-xs text-blue-950 flex items-center gap-2 font-medium">
                    <Eye className="w-4 h-4 text-gov-navy shrink-0" />
                    <span>
                      <strong>{inspectCase.currentStage === 'level_1_field' ? 'Level 1 (BDO)' : 'Level 2 (CO)'} Stage Record — Audit View:</strong> Multi-level review enabled. Action will be unlocked when this case advances to the District Collector (Level 3) Queue.
                    </span>
                  </div>
                ) : null}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
