import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  FileCheck2,
  Calendar,
  MapPin,
  ChevronRight,
  ArrowLeft,
  UploadCloud,
  FileText,
  RefreshCw,
  Sparkles,
  Info,
  Check,
  Scale,
  Award
} from 'lucide-react';
import { VerificationCase, CaseStage, CaseStatus, SupportingDocumentInfo } from '../services/verificationCaseService';

export const TrackProgressView: React.FC = () => {
  const {
    currentUser,
    verificationCases,
    getCitizenCases,
    submitSupportingDisputeDocument,
    submitCaseAppeal,
    govLanguage,
    setActiveTab,
    selectedState,
    selectedDistrict,
    selectedTehsil,
    selectedTrackCaseId,
    setSelectedTrackCaseId
  } = useApp();

  const isHindi = govLanguage === 'hi';

  // State & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'under_verification' | 'action_required' | 'approved' | 'rejected' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'submission_desc' | 'submission_asc' | 'updated_desc' | 'risk_desc'>('submission_desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Active Detail View Case
  const [activeCaseId, setActiveCaseId] = useState<string | null>(selectedTrackCaseId || null);

  // Sync with global selectedTrackCaseId if set (e.g. from notification click)
  useEffect(() => {
    if (selectedTrackCaseId) {
      setActiveCaseId(selectedTrackCaseId);
    }
  }, [selectedTrackCaseId]);

  // Citizen's cases strictly filtered by authenticated user
  const citizenCases = useMemo(() => {
    return getCitizenCases(currentUser?.aadhaarMasked || 'XXXX-XXXX-9023');
  }, [getCitizenCases, currentUser, verificationCases]);

  // Filtered & Sorted Cases
  const filteredCases = useMemo(() => {
    return citizenCases
      .filter((c) => {
        // Status Filter
        if (statusFilter === 'submitted') {
          if (c.status !== 'submitted' && c.currentStage !== 'user_submitted') return false;
        } else if (statusFilter === 'under_verification') {
          if (c.status !== 'under_official_verification' && c.status !== 'in_review' && c.status !== 'processing') return false;
        } else if (statusFilter === 'action_required') {
          if (c.status !== 'action_required' && !c.problemDetected.includes('CONFLICT') && !c.dispute?.isDisputed) return false;
        } else if (statusFilter === 'approved') {
          if (c.status !== 'approved' && c.currentStage !== 'level_2_co' && c.currentStage !== 'level_3_collector') return false;
        } else if (statusFilter === 'rejected') {
          if (c.status !== 'rejected') return false;
        } else if (statusFilter === 'completed') {
          if (c.status !== 'completed' && c.status !== 'resolved' && c.currentStage !== 'verified') return false;
        }

        // Search Query (ID, Khasra, Khata, Village, Document Type, Raiyat)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            c.id.toLowerCase().includes(q) ||
            (c.trackingId && c.trackingId.toLowerCase().includes(q)) ||
            c.khasraNo.toLowerCase().includes(q) ||
            c.khataNo.toLowerCase().includes(q) ||
            c.village.toLowerCase().includes(q) ||
            c.documentType.toLowerCase().includes(q) ||
            c.ownerName.toLowerCase().includes(q) ||
            (c.problemDetected && c.problemDetected.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'submission_desc') {
          return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
        }
        if (sortBy === 'submission_asc') {
          return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
        }
        if (sortBy === 'updated_desc') {
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        }
        if (sortBy === 'risk_desc') {
          return b.riskScore - a.riskScore;
        }
        return 0;
      });
  }, [citizenCases, statusFilter, searchQuery, sortBy]);

  // Active selected case object
  const activeCase = useMemo(() => {
    if (!activeCaseId) return null;
    return verificationCases.find((c) => c.id === activeCaseId) || citizenCases.find((c) => c.id === activeCaseId) || null;
  }, [activeCaseId, verificationCases, citizenCases]);

  // Counts for filter tabs
  const counts = useMemo(() => {
    return {
      all: citizenCases.length,
      submitted: citizenCases.filter((c) => c.status === 'submitted' || c.currentStage === 'user_submitted').length,
      under_verification: citizenCases.filter((c) => c.status === 'under_official_verification' || c.status === 'in_review' || c.status === 'processing').length,
      action_required: citizenCases.filter((c) => c.status === 'action_required' || (c.problemDetected.includes('CONFLICT') && c.status !== 'completed')).length,
      approved: citizenCases.filter((c) => c.status === 'approved' || c.currentStage === 'level_2_co' || c.currentStage === 'level_3_collector').length,
      rejected: citizenCases.filter((c) => c.status === 'rejected').length,
      completed: citizenCases.filter((c) => c.status === 'completed' || c.status === 'resolved' || c.currentStage === 'verified').length
    };
  }, [citizenCases]);

  // Interactive Action Required / Supporting Document Modal
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionFileName, setCorrectionFileName] = useState<string | null>(null);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [isSubmittingCorrection, setIsSubmittingCorrection] = useState(false);
  const [correctionSuccessMsg, setCorrectionSuccessMsg] = useState<string | null>(null);

  // Appeal Modal
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState('Ground inspection error');
  const [appealDesc, setAppealDesc] = useState('');
  const [appealFileName, setAppealFileName] = useState<string | null>(null);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);

  // Status Badge Helper
  const getStatusBadge = (status: CaseStatus, stage: CaseStage) => {
    if (status === 'completed' || status === 'resolved' || stage === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#E8F5E9] text-[#138808] border border-[#A5D6A7] font-bold text-xs shadow-2xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isHindi ? 'सत्यापित एवं पूर्ण' : 'COMPLETED'}</span>
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] font-bold text-xs shadow-2xs font-mono">
          <XCircle className="w-3.5 h-3.5" />
          <span>{isHindi ? 'अस्वीकृत' : 'REJECTED'}</span>
        </span>
      );
    }
    if (status === 'action_required') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFF3E0] text-[#E65100] border border-[#FFE082] font-bold text-xs shadow-2xs animate-pulse font-mono">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isHindi ? 'कार्रवाई आवश्यक' : 'ACTION REQUIRED'}</span>
        </span>
      );
    }
    if (status === 'under_official_verification' || status === 'in_review') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#E1EDF7] text-[#003D7C] border border-[#C2DCF0] font-bold text-xs shadow-2xs font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{isHindi ? 'अधिकारी सत्यापन में' : 'UNDER VERIFICATION'}</span>
        </span>
      );
    }
    if (status === 'under_ai_verification' || status === 'processing') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#EDE7F6] text-[#4527A0] border border-[#D1C4E9] font-bold text-xs shadow-2xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>{isHindi ? 'एआई जांच जारी' : 'AI VERIFYING'}</span>
        </span>
      );
    }
    if (status === 'escalated') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F3E5F5] text-[#6A1B9A] border border-[#E1BEE7] font-bold text-xs shadow-2xs font-mono">
          <Scale className="w-3.5 h-3.5" />
          <span>{isHindi ? 'अग्रसारित / एस्केलेटेड' : 'ESCALATED'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F1F5F9] text-slate-700 border border-slate-300 font-bold text-xs font-mono">
        <Info className="w-3.5 h-3.5" />
        <span>{isHindi ? 'प्रस्तुत' : 'SUBMITTED'}</span>
      </span>
    );
  };

  // Officer Responsible Role Helper
  const getResponsibleRoleDisplay = (item: VerificationCase) => {
    if (item.status === 'completed' || item.status === 'resolved' || item.currentStage === 'verified') {
      return {
        roleLabel: isHindi ? 'भूमि अभिलेख रजिस्ट्री' : 'Certified Land Registry',
        badgeColor: 'bg-[#E8F5E9] text-[#138808] border-[#A5D6A7]',
        officerTitle: 'Government Revenue Office (NIC / DILRMP)'
      };
    }
    if (item.status === 'action_required') {
      return {
        roleLabel: isHindi ? 'नागरिक आवेदक (आप)' : 'Citizen Action (You)',
        badgeColor: 'bg-[#FFF3E0] text-[#E65100] border-[#FFE082]',
        officerTitle: 'Pending Citizen Evidence Upload'
      };
    }
    if (item.currentStage === 'level_1_field' || item.assignedOfficerRole === 'patwari') {
      return {
        roleLabel: isHindi ? 'प्रखण्ड विकास अधिकारी (BDO)' : 'Block Development Officer (BDO)',
        badgeColor: 'bg-[#E1EDF7] text-[#003D7C] border-[#C2DCF0]',
        officerTitle: item.assignedOfficerName || 'R. K. Mishra (Block Development Officer)'
      };
    }
    if (item.currentStage === 'level_2_co' || item.assignedOfficerRole === 'tehsildar') {
      return {
        roleLabel: isHindi ? 'अंचल अधिकारी (CO)' : 'Circle Officer (CO)',
        badgeColor: 'bg-[#EDE7F6] text-[#4527A0] border-[#D1C4E9]',
        officerTitle: item.assignedOfficerName || 'S. N. Pandey (Circle Officer)'
      };
    }
    if (item.currentStage === 'level_3_collector' || item.assignedOfficerRole === 'district_officer') {
      return {
        roleLabel: isHindi ? 'जिला समाहर्ता (Collector)' : 'District Collector',
        badgeColor: 'bg-[#FCE4EC] text-[#880E4F] border-[#F8BBD0]',
        officerTitle: item.assignedOfficerName || 'Rajeshwar Singh (IAS, District Collector)'
      };
    }
    return {
      roleLabel: isHindi ? 'एआई निष्कर्षण प्रणाली' : 'AI Verification Pipeline',
      badgeColor: 'bg-[#F8FAFC] text-slate-700 border-slate-300',
      officerTitle: 'Automated Registry Cross-Check'
    };
  };

  // Handle Citizen Correction Upload
  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;

    setIsSubmittingCorrection(true);
    const supportingDocInfo: SupportingDocumentInfo = {
      id: `SUP-${Date.now()}`,
      fileName: correctionFileName || 'Supporting_Lineage_Evidence.pdf',
      fileSize: '2.4 MB',
      fileType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      userNotes: correctionNotes || 'Submitted continuous possession evidence and ancestral revenue receipts.',
      uploadedBy: activeCase.ownerName
    };

    setTimeout(() => {
      submitSupportingDisputeDocument({
        caseId: activeCase.id,
        parcelId: activeCase.parcelId,
        supportingDoc: supportingDocInfo
      });
      setIsSubmittingCorrection(false);
      setCorrectionSuccessMsg(isHindi ? 'सहायक साक्ष्य सफलतापूर्वक जमा कर दिया गया।' : 'Evidence document submitted successfully for official review.');
      setShowCorrectionModal(false);
      setCorrectionFileName(null);
      setCorrectionNotes('');
    }, 1000);
  };

  // Handle Statutory Appeal
  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;

    setIsSubmittingAppeal(true);
    setTimeout(() => {
      submitCaseAppeal({
        caseId: activeCase.id,
        parcelId: activeCase.parcelId,
        appellantName: activeCase.ownerName,
        reason: appealReason,
        description: appealDesc || 'Request for re-hearing and title re-examination.',
        supportingDocName: appealFileName || 'Statutory_Appeal_Grounds.pdf'
      });
      setIsSubmittingAppeal(false);
      setShowAppealModal(false);
      setCorrectionSuccessMsg(isHindi ? 'वैधानिक अपील (APP) सफलतापूर्वक दर्ज कर ली गई।' : 'Statutory appeal successfully registered with Circle Officer.');
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BREADCRUMB                                                */}
      {/* ========================================================================= */}
      <div className="space-y-1.5 pb-4 border-b border-[#D0D7DE]">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer hover:underline text-[#003D7C]"
              onClick={() => {
                setActiveCaseId(null);
                setSelectedTrackCaseId(null);
                setActiveTab('user-dashboard');
              }}
            >
              {isHindi ? 'नागरिक डैशबोर्ड' : 'Citizen Dashboard'}
            </span>
            <span>/</span>
            <span
              className={`cursor-pointer ${activeCase ? 'hover:underline text-[#003D7C]' : 'text-slate-800 font-bold'}`}
              onClick={() => {
                setActiveCaseId(null);
                setSelectedTrackCaseId(null);
              }}
            >
              {isHindi ? 'आवेदन स्थिति एवं प्रगति' : 'Track Applications'}
            </span>
            {activeCase && (
              <>
                <span>/</span>
                <span className="text-slate-800 font-bold font-mono">{activeCase.id}</span>
              </>
            )}
          </div>

          <button
            onClick={() => setActiveTab('location-select')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E1EDF7] hover:bg-[#C2DCF0] text-[#003D7C] rounded text-xs font-bold border border-[#C2DCF0] transition-all shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>Jurisdiction: <strong>{selectedState || 'Jharkhand'} › {selectedDistrict || 'Giridih'} › {selectedTehsil || 'Giridih Sadar'}</strong></span>
            <span className="text-[10px] text-[#FF9933] underline ml-1">Change ›</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[#002856]">
                {isHindi ? 'भूलेख आवेदन ट्रैकर एवं सत्यापन स्थिति' : 'Application Tracking & Verification Status'}
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#003D7C] text-white text-[10px] font-bold font-mono">
                LIVE STATUS
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isHindi
                ? 'अपने जमा किए गए सभी भू-स्वामित्व आवेदनों, एआई सत्यापन चरणों व अधिकारी निर्णयों की वास्तविक स्थिति देखें।'
                : 'Monitor all your submitted land record applications across AI validation and statutory officer review stages.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('upload-document')}
            className="gov-btn-primary self-start sm:self-auto text-xs"
          >
            <UploadCloud className="w-4 h-4 text-[#FF9933]" />
            <span>{isHindi ? 'नया दस्तावेज़ जमा करें' : 'Submit New Application'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {correctionSuccessMsg && (
        <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-md text-xs text-[#138808] flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#138808]" />
            <span>{correctionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setCorrectionSuccessMsg(null)}
            className="text-[#138808] hover:underline font-bold text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. IF DETAIL VIEW IS ACTIVE: DISPLAY TIMELINE & PARTICULARS              */}
      {/* ========================================================================= */}
      {activeCase ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setActiveCaseId(null);
                setSelectedTrackCaseId(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded shadow-2xs transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#003D7C]" />
              <span>{isHindi ? 'सभी आवेदनों पर लौटें' : 'Back to All Applications'}</span>
            </button>

            <span className="text-xs text-slate-500 font-mono">
              Last Updated: <strong>{new Date(activeCase.lastUpdated).toLocaleString()}</strong>
            </span>
          </div>

          {/* Top Status & Next Action Banner */}
          <div className="bg-white rounded-lg border border-[#D0D7DE] shadow-sm overflow-hidden">
            <div className="bg-[#003D7C] text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded bg-white text-[#002856] font-mono font-bold text-xs shadow-2xs">
                    {activeCase.id}
                  </span>
                  {activeCase.trackingId && (
                    <span className="px-2 py-0.5 rounded bg-white/20 text-[#C2DCF0] font-mono text-[11px]">
                      Tracking: {activeCase.trackingId}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-white/90">
                    {activeCase.documentType}
                  </span>
                </div>
                <div className="text-xs text-[#C2DCF0] flex items-center gap-2 flex-wrap">
                  <span>Owner: <strong>{activeCase.ownerName}</strong></span>
                  <span>•</span>
                  <span>Khasra: <strong>#{activeCase.khasraNo}</strong></span>
                  <span>•</span>
                  <span>Area: <strong>{activeCase.areaAcres} Acres</strong></span>
                  <span>•</span>
                  <span>Location: <strong>{activeCase.village}, {activeCase.block}, {activeCase.district}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getStatusBadge(activeCase.status, activeCase.currentStage)}
              </div>
            </div>

            {/* Next Action Callout Box */}
            <div className="p-4 sm:p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              <div className="md:col-span-8 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Info className="w-3.5 h-3.5 text-[#003D7C]" />
                  <span>{isHindi ? 'अपेक्षित अगली कार्रवाई (Expected Next Action)' : 'Expected Next Action for Application'}</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#002856] leading-snug">
                  {activeCase.expectedNextAction || (activeCase.status === 'completed'
                    ? 'Your application has been completed. Certified land title is minted and valid.'
                    : activeCase.status === 'action_required'
                    ? 'Action Required: Supporting lineage document requested for review.'
                    : 'Awaiting statutory verification by assigned revenue officer.')}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <span>Responsible Stage:</span>
                  <span className={`px-2 py-0.5 rounded font-bold border ${getResponsibleRoleDisplay(activeCase).badgeColor}`}>
                    {getResponsibleRoleDisplay(activeCase).roleLabel}
                  </span>
                  <span className="text-slate-400">({getResponsibleRoleDisplay(activeCase).officerTitle})</span>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-2 justify-end">
                {activeCase.status === 'action_required' && (
                  <button
                    type="button"
                    onClick={() => setShowCorrectionModal(true)}
                    className="w-full py-2 px-3 bg-[#E65100] hover:bg-[#BF360C] text-white text-xs font-bold rounded shadow-sm transition-all flex items-center justify-center gap-1.5 animate-pulse"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isHindi ? 'दस्तावेज़ / सुधार जमा करें' : 'Upload Requested Document'}</span>
                  </button>
                )}

                {activeCase.status === 'rejected' && (
                  <button
                    type="button"
                    onClick={() => setShowAppealModal(true)}
                    className="w-full py-2 px-3 bg-[#003D7C] hover:bg-[#002856] text-white text-xs font-bold rounded shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Scale className="w-4 h-4 text-[#FF9933]" />
                    <span>{isHindi ? 'वैधानिक अपील (Appeal) दर्ज करें' : 'File Statutory Appeal (APP)'}</span>
                  </button>
                )}

                {(activeCase.status === 'completed' || activeCase.status === 'resolved' || activeCase.currentStage === 'verified') && (
                  <button
                    type="button"
                    onClick={() => alert(`Certified Land Title Certificate for ${activeCase.id} (Khasra #${activeCase.khasraNo}) is digitally authentic and ready.`)}
                    className="w-full py-2 px-3 bg-[#138808] hover:bg-[#0D5C05] text-white text-xs font-bold rounded shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4 text-[#FF9933]" />
                    <span>{isHindi ? 'प्रमाणित अभिलेख डाउनलोड' : 'Download Certified Title'}</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* MAIN GRID: 8 COLS TIMELINE + 4 COLS PARTICULARS                          */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT 8 COLS: CHRONOLOGICAL VERTICAL TIMELINE */}
            <div className="lg:col-span-8 bg-white rounded-lg border border-[#D0D7DE] shadow-sm p-5 sm:p-6 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#D0D7DE]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#003D7C]" />
                  <h3 className="text-sm sm:text-base font-bold text-[#002856]">
                    {isHindi ? 'आवेदन सत्यापन पूर्ण समय-रेखा (Complete Timeline)' : 'Application Verification Timeline'}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-500 font-mono">
                  {activeCase.history?.length || 1} Events Recorded
                </span>
              </div>

              {/* Dynamic Chronological Timeline Component */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 font-sans text-xs">
                
                {/* 1. Submission Event */}
                <div className="relative">
                  <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full bg-[#138808] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-[#002856] text-xs sm:text-sm">
                        1. Application Submitted &amp; Cryptographic Hash Verified
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        {new Date(activeCase.submissionDate).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Aadhaar authenticated submission by <strong>{activeCase.ownerName}</strong> ({activeCase.aadhaarMasked}). SHA-256 integrity digest minted.
                    </p>
                    <div className="text-[10px] font-mono text-slate-500 bg-[#F8FAFC] px-2 py-1 rounded border border-slate-200">
                      Tracking ID: {activeCase.trackingId || `TRK-${activeCase.id.replace('CASE-', '')}`} | Digest: e3b0c442...855
                    </div>
                  </div>
                </div>

                {/* 2. Document Received & Ingestion */}
                <div className="relative">
                  <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full bg-[#138808] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-[#002856] text-xs sm:text-sm">
                        2. Document Ingestion &amp; Repository Logging
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        {new Date(new Date(activeCase.submissionDate).getTime() + 60000).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Document Type: <strong>{activeCase.documentType}</strong> logged in state land records node ({activeCase.state} › {activeCase.district}).
                    </p>
                  </div>
                </div>

                {/* 3. AI OCR & Entity Recognition */}
                <div className="relative">
                  <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full bg-[#138808] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-[#002856] text-xs sm:text-sm">
                        3. AI Multilingual OCR &amp; Entity Extraction
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        {new Date(new Date(activeCase.submissionDate).getTime() + 120000).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Extracted Khasra #{activeCase.khasraNo}, Khata #{activeCase.khataNo}, Area {activeCase.areaAcres} Acres, and Raiyat particulars.
                    </p>
                    <div className="text-[10px] font-mono text-[#003D7C] bg-[#F0F5FA] px-2 py-1 rounded border border-[#C2DCF0]">
                      AI OCR Confidence: <strong>{activeCase.documents?.[0]?.ocrConfidence || (activeCase.riskScore > 50 ? 88.5 : 98.4)}%</strong> | Risk Score: {activeCase.riskScore}/100 ({activeCase.riskLevel.toUpperCase()})
                    </div>
                  </div>
                </div>

                {/* 4. Sub-Registrar Database & Cadastral GIS Cross-Validation */}
                <div className="relative">
                  <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                    activeCase.problemDetected.includes('CONFLICT') || activeCase.status === 'action_required'
                      ? 'bg-[#E65100]'
                      : 'bg-[#138808]'
                  }`}>
                    {activeCase.problemDetected.includes('CONFLICT') || activeCase.status === 'action_required' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-[#002856] text-xs sm:text-sm">
                        4. Sub-Registrar Registry &amp; Cadastral GIS Cross-Check
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        {new Date(new Date(activeCase.submissionDate).getTime() + 180000).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Cross-referenced against Department of Land Resources (DILRMP) Central Registration Registry and Bhu-Naksha Cadastral Vectors.
                    </p>
                    <div className={`text-[10px] px-2 py-1 rounded border ${
                      activeCase.problemDetected.includes('CONFLICT') || activeCase.status === 'action_required'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    }`}>
                      {activeCase.problemDetected}
                    </div>
                  </div>
                </div>

                {/* 5. Statutory Official Verification (Where Applicable) */}
                {activeCase.isAlternativeDocument || activeCase.currentStage !== 'user_submitted' ? (
                  <>
                    {/* 5A. BDO Stage */}
                    <div className="relative">
                      <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                        activeCase.currentStage === 'level_1_field'
                          ? 'bg-[#003D7C] ring-4 ring-blue-100'
                          : activeCase.currentStage === 'level_2_co' || activeCase.currentStage === 'level_3_collector' || activeCase.currentStage === 'verified' || activeCase.status === 'completed'
                          ? 'bg-[#138808]'
                          : 'bg-slate-300'
                      }`}>
                        {activeCase.currentStage === 'level_2_co' || activeCase.currentStage === 'level_3_collector' || activeCase.currentStage === 'verified' || activeCase.status === 'completed' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          '5'
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="font-bold text-[#002856] text-xs sm:text-sm">
                            5A. Level 1: Block Development Officer (BDO) Field Review
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">
                            Responsible: R. K. Mishra (BDO)
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Physical spot verification, possession verification, and local mutation register audit.
                        </p>
                        {activeCase.bdoApprovalNote && (
                          <div className="text-[10px] text-[#138808] bg-[#E8F5E9] px-2 py-1 rounded border border-[#A5D6A7]">
                            ✓ BDO Note: {activeCase.bdoApprovalNote}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 5B. CO Stage */}
                    <div className="relative">
                      <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                        activeCase.status === 'rejected' && activeCase.currentStage === 'level_2_co'
                          ? 'bg-[#C62828]'
                          : activeCase.currentStage === 'level_2_co'
                          ? 'bg-[#003D7C] ring-4 ring-blue-100'
                          : activeCase.currentStage === 'level_3_collector' || activeCase.currentStage === 'verified' || activeCase.status === 'completed'
                          ? 'bg-[#138808]'
                          : 'bg-slate-300'
                      }`}>
                        {activeCase.currentStage === 'level_3_collector' || activeCase.currentStage === 'verified' || activeCase.status === 'completed' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : activeCase.status === 'rejected' && activeCase.currentStage === 'level_2_co' ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          '6'
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="font-bold text-[#002856] text-xs sm:text-sm">
                            5B. Level 2: Circle Officer (CO) Quasi-Judicial Verification
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">
                            Responsible: S. N. Pandey (Circle Officer)
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Title lineage scrutiny, SPT/CNT statutory transfer compliance check, and dispute hearing.
                        </p>
                        {activeCase.coApprovalNote && (
                          <div className="text-[10px] text-[#138808] bg-[#E8F5E9] px-2 py-1 rounded border border-[#A5D6A7]">
                            ✓ CO Sanction: {activeCase.coApprovalNote}
                          </div>
                        )}
                        {activeCase.rejectionReason && (
                          <div className="text-[10px] text-[#C62828] bg-[#FFEBEE] px-2 py-1 rounded border border-[#FFCDD2] font-bold">
                            ✕ Rejection Reason: {activeCase.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 5C. District Collector Stage */}
                    <div className="relative">
                      <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                        activeCase.currentStage === 'level_3_collector'
                          ? 'bg-[#003D7C] ring-4 ring-blue-100'
                          : activeCase.currentStage === 'verified' || activeCase.status === 'completed'
                          ? 'bg-[#138808]'
                          : 'bg-slate-300'
                      }`}>
                        {activeCase.currentStage === 'verified' || activeCase.status === 'completed' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          '7'
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="font-bold text-[#002856] text-xs sm:text-sm">
                            5C. Level 3: District Collector Final Title Sign-Off
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">
                            Responsible: Rajeshwar Singh (IAS, Collector)
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Final statutory executive seal, revenue register update, and certificate minting.
                        </p>
                        {activeCase.collectorApprovalNote && (
                          <div className="text-[10px] text-[#138808] bg-[#E8F5E9] px-2 py-1 rounded border border-[#A5D6A7]">
                            ✓ Collector Order: {activeCase.collectorApprovalNote}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}

                {/* 6. Final Status & Certified Record */}
                <div className="relative">
                  <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                    activeCase.status === 'completed' || activeCase.status === 'resolved' || activeCase.currentStage === 'verified'
                      ? 'bg-[#138808]'
                      : activeCase.status === 'rejected'
                      ? 'bg-[#C62828]'
                      : 'bg-slate-300'
                  }`}>
                    {activeCase.status === 'completed' || activeCase.status === 'resolved' || activeCase.currentStage === 'verified' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : activeCase.status === 'rejected' ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      '✓'
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-[#002856] text-xs sm:text-sm">
                        6. Final Statutory Disposition &amp; Record Minting
                      </span>
                      {activeCase.completionDate && (
                        <span className="text-[10px] font-mono text-[#138808] font-bold">
                          {new Date(activeCase.completionDate).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      {activeCase.status === 'completed' || activeCase.currentStage === 'verified'
                        ? 'Digitally authentic certified land record issued with QR verification code under DILRMP 2.0.'
                        : activeCase.status === 'rejected'
                        ? 'Application closed with rejection reason recorded. Appeal filing window open for 30 days.'
                        : 'Awaiting completion of statutory verification workflow.'}
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT 4 COLS: CASE DETAILS, DISPUTE & ACTIONS */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Particulars Card */}
              <div className="bg-white rounded-lg border border-[#D0D7DE] shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-[#002856] uppercase tracking-wider">
                    {isHindi ? 'अभिलेख विवरण' : 'Record Particulars'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {activeCase.id}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-sans">Document Type:</span>
                    <span className="font-bold text-[#002856] text-right font-sans">{activeCase.documentType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-sans">Owner / Raiyat:</span>
                    <span className="font-bold text-slate-800">{activeCase.ownerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-sans">Khasra Number:</span>
                    <span className="font-bold text-[#002856]">#{activeCase.khasraNo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-sans">Khata Number:</span>
                    <span className="font-bold">#{activeCase.khataNo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-sans">Area (Stated):</span>
                    <span className="font-bold text-[#138808]">{activeCase.areaAcres} Acres</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-sans">Village / Mauza:</span>
                    <span className="font-sans font-semibold text-slate-800">{activeCase.village}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-sans">Block / Tehsil:</span>
                    <span className="font-sans">{activeCase.block}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-sans">District &amp; State:</span>
                    <span className="font-sans font-semibold">{activeCase.district}, {activeCase.state}</span>
                  </div>
                </div>

                {/* Dispute / Conflict Warning if active */}
                {activeCase.dispute?.isDisputed && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-xs space-y-1.5 text-red-950">
                    <div className="font-bold flex items-center gap-1.5 text-red-800">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Potential Conflict Summary</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-red-900">
                      {activeCase.dispute.conflictReason}
                    </p>
                    {activeCase.dispute.supportingDocument && (
                      <div className="text-[10px] text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                        ✓ Evidence on file: <strong>{activeCase.dispute.supportingDocument.fileName}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Appeal Record if active */}
                {activeCase.appeal && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded text-xs space-y-1 text-purple-950">
                    <div className="font-bold flex items-center gap-1.5 text-purple-800">
                      <Scale className="w-4 h-4" />
                      <span>Active Appeal #{activeCase.appeal.id}</span>
                    </div>
                    <p className="text-[11px] text-purple-900">
                      Reason: <strong>{activeCase.appeal.reason}</strong> — {activeCase.appeal.description}
                    </p>
                  </div>
                )}

              </div>

              {/* Security & Audit Verification Notice */}
              <div className="p-3 bg-[#F0F5FA] border-l-4 border-[#003D7C] rounded-r text-[11px] text-slate-700 leading-relaxed">
                <span className="font-bold text-[#002856]">
                  {isHindi ? 'एनआईसी / डीआईएलआरएमपी सुरक्षा:' : 'Tamper-Evident Event Log:'}
                </span>{' '}
                {isHindi
                  ? 'यह सत्यापन इतिहास भारत सरकार के डीआईएलआरएमपी मानकों के अंतर्गत क्रिप्टोग्राफिक रूप से सुरक्षित है।'
                  : 'Every status update and official remark is permanently recorded in the immutable government audit trail.'}
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* 3. MASTER DIRECTORY VIEW: LIST OF ALL CITIZEN APPLICATIONS               */
        /* ========================================================================= */
        <div className="space-y-4">
          
          {/* Controls Bar: Search, Filters & Sorting */}
          <div className="bg-white p-4 rounded-lg border border-[#D0D7DE] shadow-xs space-y-3">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'आवेदन आईडी, खसरा संख्या, खाता, मौजा, या दस्तावेज़ प्रकार से खोजें...' : 'Search by Application ID, Khasra #, Khata #, Village, or Document Type...'}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-[#003D7C] shadow-2xs font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sorting & View Toggle */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#003D7C]" />
                  <span>{isHindi ? 'क्रमबद्ध:' : 'Sort:'}</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-1.5 px-2.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#003D7C] shadow-2xs"
                >
                  <option value="submission_desc">{isHindi ? 'जमा दिनांक (नवीनतम)' : 'Submission Date (Newest)'}</option>
                  <option value="submission_asc">{isHindi ? 'जमा दिनांक (पुरातन)' : 'Submission Date (Oldest)'}</option>
                  <option value="updated_desc">{isHindi ? 'अंतिम अद्यतन (नवीनतम)' : 'Last Updated Date'}</option>
                  <option value="risk_desc">{isHindi ? 'जोखिम स्कोर / प्राथमिकता' : 'Risk / Priority Score'}</option>
                </select>

                <div className="border-l border-slate-300 pl-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                      viewMode === 'cards' ? 'bg-[#003D7C] text-white border-[#003D7C]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                      viewMode === 'table' ? 'bg-[#003D7C] text-white border-[#003D7C]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>

            {/* Status Filter Tabs (Pills) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'all'
                    ? 'bg-[#003D7C] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isHindi ? 'सभी आवेदन' : 'All Applications'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.all}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('submitted')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'submitted'
                    ? 'bg-[#003D7C] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isHindi ? 'प्रस्तुत (Submitted)' : 'Submitted'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.submitted}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('under_verification')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'under_verification'
                    ? 'bg-[#003D7C] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isHindi ? 'सत्यापन में (Under Verification)' : 'Under Verification'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.under_verification}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('action_required')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'action_required'
                    ? 'bg-[#E65100] text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isHindi ? 'कार्रवाई आवश्यक (Action Required)' : 'Action Required'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.action_required}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'approved'
                    ? 'bg-[#003D7C] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isHindi ? 'स्वीकृत / समीक्षाधीन (Approved)' : 'Approved'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.approved}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'rejected'
                    ? 'bg-[#C62828] text-white shadow-xs'
                    : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                }`}
              >
                <span>{isHindi ? 'अस्वीकृत (Rejected)' : 'Rejected'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.rejected}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'completed'
                    ? 'bg-[#138808] text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>{isHindi ? 'पूर्ण (Completed)' : 'Completed'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.completed}</span>
              </button>
            </div>

          </div>

          {/* Applications Content: Card Grid vs Table */}
          {filteredCases.length > 0 ? (
            viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCases.map((item) => {
                  const resp = getResponsibleRoleDisplay(item);
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg border border-[#D0D7DE] shadow-xs hover:border-[#003D7C] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                    >
                      {/* Card Top Strip */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[#002856] font-mono font-bold text-xs border border-slate-300">
                            {item.id}
                          </span>
                          {getStatusBadge(item.status, item.currentStage)}
                        </div>

                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#002856] line-clamp-1">
                            {item.documentType}
                          </h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#FF9933] shrink-0" />
                            <span>{item.village}, {item.block}, {item.district}</span>
                          </p>
                        </div>

                        {/* Particulars Grid */}
                        <div className="grid grid-cols-2 gap-2 p-2 rounded bg-[#F8FAFC] text-[11px] font-mono border border-slate-200">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-sans">Khasra #</span>
                            <strong className="text-[#002856]">#{item.khasraNo} (Khata #{item.khataNo})</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-sans">Area Stated</span>
                            <strong className="text-[#138808]">{item.areaAcres} Acres</strong>
                          </div>
                        </div>

                        {/* Responsible Authority */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">
                            Responsible Authority:
                          </span>
                          <div className={`p-1.5 rounded text-[11px] font-semibold border ${resp.badgeColor}`}>
                            {resp.roleLabel}
                          </div>
                        </div>

                        {/* Next Action Snippet */}
                        <div className="text-[11px] text-slate-700 bg-[#F0F5FA] p-2 rounded border border-[#C2DCF0] space-y-0.5">
                          <span className="text-[10px] font-bold text-[#003D7C] block uppercase">
                            Next Action:
                          </span>
                          <p className="line-clamp-2 leading-relaxed">
                            {item.expectedNextAction || 'Awaiting statutory review.'}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-3 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-xs">
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Submitted: {new Date(item.submissionDate).toLocaleDateString()}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveCaseId(item.id);
                            setSelectedTrackCaseId(item.id);
                          }}
                          className="px-3 py-1.5 bg-[#003D7C] hover:bg-[#002856] text-white font-bold rounded shadow-2xs transition-all flex items-center gap-1 text-xs"
                        >
                          <span>{isHindi ? 'विवरण देखें' : 'View Details'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="bg-white rounded-lg border border-[#D0D7DE] shadow-xs overflow-x-auto">
                <table className="gov-table">
                  <thead>
                    <tr>
                      <th className="gov-th">Application ID</th>
                      <th className="gov-th">Document Type</th>
                      <th className="gov-th">Khasra / Location</th>
                      <th className="gov-th">Status</th>
                      <th className="gov-th">Responsible Authority</th>
                      <th className="gov-th">Expected Next Action</th>
                      <th className="gov-th text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-sans">
                    {filteredCases.map((item) => {
                      const resp = getResponsibleRoleDisplay(item);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="gov-td font-mono font-bold text-[#002856]">
                            <div>{item.id}</div>
                            {item.trackingId && <div className="text-[10px] text-slate-400">{item.trackingId}</div>}
                          </td>
                          <td className="gov-td">
                            <span className="font-semibold text-slate-800">{item.documentType}</span>
                            <div className="text-[10px] text-slate-500 font-mono">Submitted: {new Date(item.submissionDate).toLocaleDateString()}</div>
                          </td>
                          <td className="gov-td font-mono">
                            <strong className="text-[#002856]">Khasra #{item.khasraNo}</strong> ({item.areaAcres} Ac)
                            <div className="text-[11px] font-sans text-slate-600">{item.village}, {item.block}</div>
                          </td>
                          <td className="gov-td">
                            {getStatusBadge(item.status, item.currentStage)}
                          </td>
                          <td className="gov-td">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${resp.badgeColor}`}>
                              {resp.roleLabel}
                            </span>
                          </td>
                          <td className="gov-td max-w-xs truncate text-slate-700">
                            {item.expectedNextAction || 'Under active revenue review.'}
                          </td>
                          <td className="gov-td text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCaseId(item.id);
                                setSelectedTrackCaseId(item.id);
                              }}
                              className="px-2.5 py-1 bg-[#003D7C] hover:bg-[#002856] text-white font-bold rounded text-xs"
                            >
                              Track ›
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="bg-white p-12 rounded-lg border border-slate-300 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                {isHindi ? 'कोई मेल खाता आवेदन नहीं मिला।' : 'No applications match your search or filter.'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isHindi ? 'कृपया अपने फ़िल्टर को साफ़ करें अथवा एक नया भूमि अभिलेख दस्तावेज़ अपलोड करें।' : 'Try clearing your search filters or submit a new land record document for digital verification.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: ACTION REQUIRED — SUBMIT SUPPORTING DOCUMENT / CORRECTION       */}
      {/* ========================================================================= */}
      {showCorrectionModal && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E65100]" />
                <h3 className="text-sm font-bold text-[#002856]">
                  {isHindi ? 'अपेक्षित दस्तावेज़ / सुधार जमा करें' : 'Submit Requested Supporting Document'}
                </h3>
              </div>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Notice */}
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded text-xs text-amber-950 space-y-1">
              <span className="font-bold block">Case: {activeCase.id} — Khasra #{activeCase.khasraNo}</span>
              <p className="leading-relaxed">
                {activeCase.problemDetected || 'Revenue authorities have requested supporting lineage records, previous Jamabandi tax receipts, or mutation orders for title confirmation.'}
              </p>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Evidence File (PDF, JPG, PNG)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-[#003D7C] rounded p-4 text-center bg-slate-50 relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCorrectionFileName(e.target.files[0].name);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#003D7C]" />
                    {correctionFileName ? (
                      <span className="text-[#003D7C] font-mono">{correctionFileName}</span>
                    ) : (
                      <span>Click or drag evidence file here (e.g. Khatiyan_1968.pdf)</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Applicant Clarification / Lineage Statement
                </label>
                <textarea
                  rows={3}
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="Explain continuous physical possession, succession pedigree, or partition agreement particulars..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#003D7C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-1.5 rounded border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCorrection}
                  className="px-4 py-1.5 bg-[#003D7C] hover:bg-[#002856] text-white rounded text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmittingCorrection ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting to Government Queue...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Submit for Circle Officer Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: STATUTORY APPEAL FILING (QUASI-JUDICIAL)                        */}
      {/* ========================================================================= */}
      {showAppealModal && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#003D7C]" />
                <h3 className="text-sm font-bold text-[#002856]">
                  {isHindi ? 'वैधानिक अपील दर्ज करें (Quasi-Judicial Appeal)' : 'File Statutory Appeal (Revenue Court)'}
                </h3>
              </div>
              <button
                onClick={() => setShowAppealModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-950 space-y-1">
              <span className="font-bold">Prior Rejection Reason:</span>
              <p>{activeCase.rejectionReason || 'Application rejected by Circle Officer.'}</p>
            </div>

            <form onSubmit={handleAppealSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Statutory Grounds for Appeal
                </label>
                <select
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#003D7C]"
                >
                  <option value="Ground inspection error">Ground inspection / Patwari inquiry variance</option>
                  <option value="Unrecorded registered partition deed">Unrecorded registered partition deed available</option>
                  <option value="Continuous Jamabandi tax possession">Continuous Jamabandi tax possession since 1974</option>
                  <option value="Court decree or mutation sanction">Civil court decree / High Court title order</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appeal Grounds &amp; Legal Submission
                </label>
                <textarea
                  rows={3}
                  value={appealDesc}
                  onChange={(e) => setAppealDesc(e.target.value)}
                  placeholder="Detail why the rejection grounds are legally contestable and attach reference deeds..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#003D7C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attach Supporting Title Deed / Partition Record (PDF)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-[#003D7C] rounded p-3 text-center bg-slate-50 relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAppealFileName(e.target.files[0].name);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-[#003D7C]" />
                    {appealFileName ? (
                      <span className="text-[#003D7C] font-mono">{appealFileName}</span>
                    ) : (
                      <span>Click to attach statutory petition file</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAppealModal(false)}
                  className="px-4 py-1.5 rounded border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAppeal}
                  className="px-4 py-1.5 bg-[#003D7C] hover:bg-[#002856] text-white rounded text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmittingAppeal ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Registering Appeal...</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-3.5 h-3.5" />
                      <span>Register Statutory Appeal (APP)</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
