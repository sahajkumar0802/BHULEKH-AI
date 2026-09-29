import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  FileSpreadsheet,
  X,
  FileCheck,
  Upload,
  Check,
  GitBranch,
  Building2,
  MapPin
} from 'lucide-react';
import { LandDocument, RiskLevel } from '../types/landRecord';
import { SupportingDocumentInfo } from '../services/verificationCaseService';

export const UploadDocumentView: React.FC = () => {
  const { 
    currentUser, 
    submitNewCase, 
    submitSupportingDisputeDocument,
    setActiveTab,
    selectedState,
    selectedDistrict,
    selectedTehsil
  } = useApp();

  // Document Category: 'primary' vs 'alternative'
  const [docCategory, setDocCategory] = useState<'primary' | 'alternative'>('primary');

  // Primary Document Types (Exactly 2 options)
  const [selectedPrimaryType, setSelectedPrimaryType] = useState<'sale_deed' | 'khatiyan_ror'>('sale_deed');

  // Alternative Document Types (Exactly 2 options)
  const [selectedAlternativeType, setSelectedAlternativeType] = useState<'mutation_record' | 'khasra_survey'>('mutation_record');

  // Form Inputs
  const [khasraNo, setKhasraNo] = useState('125');
  const [khataNo, setKhataNo] = useState('42');
  const [plotNo, setPlotNo] = useState('125/A');
  const [surveyNo, setSurveyNo] = useState('SUR-1968-042');
  const [mutationNo, setMutationNo] = useState('MUT-2026-8812');
  const [village, setVillage] = useState('Rampur');
  const [block, setBlock] = useState(selectedTehsil || 'Giridih Sadar');
  const [district, setDistrict] = useState(selectedDistrict || 'Giridih');
  const [state, setState] = useState(selectedState || 'Jharkhand');
  const [ownerName, setOwnerName] = useState(currentUser?.name || 'Rajesh Kumar');
  const [fatherHusbandName, setFatherHusbandName] = useState('Late Mohan Lal');
  const [areaAcres, setAreaAcres] = useState('2.40');
  const [landType] = useState('Agricultural (Raiyati)');
  const [regNumber, setRegNumber] = useState('REG-2024-9042');
  const [docDate, setDocDate] = useState('2024-03-12');

  // Upload & AI Processing State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiStep, setAiStep] = useState<number>(0);

  // Dispute & Supporting Document State (For Primary Twinning Dispute)
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [supportingFileName, setSupportingFileName] = useState<string | null>(null);
  const [supportingNotes, setSupportingNotes] = useState('');
  const [isSubmittingSupportingDoc, setIsSubmittingSupportingDoc] = useState(false);
  const [supportingDocSubmitted, setSupportingDocSubmitted] = useState(false);

  // Processed AI Verification Result
  const [processedResult, setProcessedResult] = useState<{
    isAlternative: boolean;
    aiResultStatus: 'Verified' | 'Verified with Issues' | 'Unable to Verify' | 'Requires Further Review';
    riskScore: number;
    riskLevel: RiskLevel;
    problemDetected: string;
    hasDispute: boolean;
    disputeReason?: string;
    hasConflict?: boolean;
    conflictIssue?: string;
    createdCaseId?: string;
    parcelId?: string;
    crossCheckItems: {
      field: string;
      extractedValue: string;
      govRecordValue: string;
      status: 'match' | 'mismatch' | 'flagged';
    }[];
  } | null>(null);

  // Sample Presets for Testing
  const handleLoadSample = (type: 'clean_deed' | 'clean_ror' | 'disputed_deed' | 'alt_mutation_conflict' | 'alt_survey_clean') => {
    if (type === 'clean_deed') {
      setDocCategory('primary');
      setSelectedPrimaryType('sale_deed');
      setKhasraNo('312');
      setKhataNo('88');
      setPlotNo('312/1');
      setSurveyNo('SUR-1972-088');
      setVillage('Shikaripara');
      setOwnerName('Manoj Hembram');
      setFatherHusbandName('Shri Shibu Hembram');
      setAreaAcres('1.85');
      setRegNumber('REG-2023-4109');
      setDocDate('2023-11-14');
      setUploadedFileName('Registered_Sale_Deed_Khasra_312_ClearTitle.pdf');
    } else if (type === 'clean_ror') {
      setDocCategory('primary');
      setSelectedPrimaryType('khatiyan_ror');
      setKhasraNo('084');
      setKhataNo('34');
      setPlotNo('84/B');
      setSurveyNo('SUR-1965-034');
      setVillage('Rampur');
      setOwnerName('Sunita Soren');
      setFatherHusbandName('W/o Late Anil Soren');
      setAreaAcres('3.10');
      setRegNumber('ROR-DMK-1965-084');
      setDocDate('1965-04-20');
      setUploadedFileName('Khatiyan_Jamabandi_Khasra_084_Authenticated.pdf');
    } else if (type === 'disputed_deed') {
      setDocCategory('primary');
      setSelectedPrimaryType('sale_deed');
      setKhasraNo('125');
      setKhataNo('42');
      setPlotNo('125/A');
      setSurveyNo('SUR-1968-042');
      setVillage('Rampur');
      setOwnerName('Rajesh Kumar');
      setFatherHusbandName('Late Mohan Lal');
      setAreaAcres('2.40');
      setRegNumber('REG-2024-9042');
      setDocDate('2024-03-12');
      setUploadedFileName('Deed_REG-2024-9042_Khasra_125_OverlappingClaim.pdf');
    } else if (type === 'alt_mutation_conflict') {
      setDocCategory('alternative');
      setSelectedAlternativeType('mutation_record');
      setKhasraNo('218');
      setKhataNo('58');
      setPlotNo('218/B');
      setSurveyNo('SUR-1968-058');
      setMutationNo('MUT-2026-8812');
      setVillage('Lakshmipur');
      setOwnerName('Suresh Prasad');
      setFatherHusbandName('Late Ramadhar Prasad');
      setAreaAcres('1.80');
      setRegNumber('MUT-2026-8812');
      setDocDate('2026-02-18');
      setUploadedFileName('Mutation_Order_DakhilKharij_Khasra_218.pdf');
    } else if (type === 'alt_survey_clean') {
      setDocCategory('alternative');
      setSelectedAlternativeType('khasra_survey');
      setKhasraNo('341');
      setKhataNo('89');
      setPlotNo('341/C');
      setSurveyNo('SUR-1972-089');
      setMutationNo('SUR-1972-089');
      setVillage('Madhopur');
      setOwnerName('Anita Devi');
      setFatherHusbandName('W/o Sh. Rameshwar Yadav');
      setAreaAcres('3.10');
      setRegNumber('SUR-1972-089');
      setDocDate('1972-08-15');
      setUploadedFileName('Khasra_Survey_Record_1972_Khasra_341.pdf');
    }
  };

  // Run Progressive AI Pipeline
  const handleStartAiScan = () => {
    const isAlt = docCategory === 'alternative';
    if (!uploadedFileName) {
      if (isAlt) {
        setUploadedFileName(selectedAlternativeType === 'mutation_record' ? 'Mutation_Order_Record.pdf' : 'Khasra_Survey_Record.pdf');
      } else {
        setUploadedFileName(selectedPrimaryType === 'sale_deed' ? 'Registered_Sale_Deed_Kewala.pdf' : 'Khatiyan_RoR_Extract.pdf');
      }
    }

    setIsProcessingAi(true);
    setAiStep(1);
    setProcessedResult(null);
    setSupportingDocSubmitted(false);

    // Step 1: OCR
    setTimeout(() => {
      setAiStep(2);
    }, 800);

    // Step 2: Extraction & Validation
    setTimeout(() => {
      setAiStep(3);
    }, 1600);

    // Step 3: Gov Cross-Check & Conflict Detection
    setTimeout(() => {
      setAiStep(4);
    }, 2400);

    // Step 4: Finish Processing
    setTimeout(() => {
      setIsProcessingAi(false);

      const parcelId = `${state === 'Bihar' ? 'BR-ARW' : 'JH-DMK'}-${village.substring(0, 3).toUpperCase()}-2024-0${khasraNo}`;

      if (isAlt) {
        // =========================================================================
        // ALTERNATIVE LAND RECORD FLOW (Mutation / Khasra-Survey)
        // Enters 3-Step Statutory Pipeline: BDO -> CO -> Collector
        // =========================================================================
        const isConflict = khasraNo === '218' || khasraNo === '125';
        const docTitle = selectedAlternativeType === 'mutation_record' 
          ? 'Mutation Record (Dakhil-Kharij)' 
          : 'Khasra / Survey Record (Survey Extract)';

        let riskScore = isConflict ? 78 : 32;
        let riskLevel: RiskLevel = isConflict ? 'high' : 'low';
        let problemDetected = isConflict
          ? '⚠ CONFLICT DETECTED: Ownership information does not match the available government record. Mutation register references unverified conveyance chain.'
          : 'Clean alternative record. Boundary and Jamabandi tenure verified. Assigned to Level 1 BDO verification.';

        const newDoc: LandDocument = {
          id: `doc-alt-${Date.now()}`,
          parcelId,
          docType: selectedAlternativeType === 'mutation_record' ? 'Mutation Order (Dakhil-Kharij)' : 'Survey Record',
          docNumber: mutationNo || regNumber,
          issueDate: docDate,
          issuingAuthority: 'Circle Revenue Office',
          language: 'Hindi',
          ocrConfidence: 94,
          pageCount: 3,
          fileSize: '2.4 MB',
          extractedFields: [
            { label: 'Applicant / Raiyat', key: 'owner', value: ownerName, confidence: 95 },
            { label: 'Father/Husband Name', key: 'father', value: fatherHusbandName, confidence: 94 },
            { label: 'Khasra / Plot No', key: 'khasraNo', value: khasraNo, confidence: 98 },
            { label: 'Khata No', key: 'khataNo', value: khataNo, confidence: 96 },
            { label: 'Area', key: 'area', value: `${areaAcres} Acres`, confidence: 97 },
            { label: 'Mutation / Survey No', key: 'mutNo', value: mutationNo || regNumber, confidence: 96 }
          ],
          rawSummary: `${docTitle} संख्या ${mutationNo || regNumber}... मौजा: ${village}, खाता: ${khataNo}, खेसरा: ${khasraNo}, रकबा: ${areaAcres} एकड़... आवेदक: ${ownerName}`,
          uploadedAt: new Date().toISOString(),
          sha256Hash: 'a7b3c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b992',
          status: isConflict ? 'flagged' : 'pending'
        };

        const newCase = submitNewCase({
          parcelId,
          khasraNo,
          khataNo,
          village,
          block,
          district,
          state,
          ownerName,
          aadhaarMasked: currentUser?.aadhaarMasked || 'XXXX-XXXX-9023',
          areaAcres: parseFloat(areaAcres) || 2.4,
          landType,
          documentType: docTitle,
          isAlternativeDocument: true,
          problemDetected,
          riskScore,
          riskLevel,
          document: newDoc
        });

        const crossCheckItems = [
          { field: 'Applicant / Raiyat Name', extractedValue: ownerName, govRecordValue: isConflict ? 'Late Ramadhar Prasad / Suresh Prasad (Variance)' : ownerName, status: isConflict ? 'flagged' as const : 'match' as const },
          { field: 'Father / Husband Name', extractedValue: fatherHusbandName, govRecordValue: fatherHusbandName, status: 'match' as const },
          { field: 'Khasra / Plot Number', extractedValue: `#${khasraNo} (${plotNo})`, govRecordValue: `#${khasraNo} (${plotNo})`, status: 'match' as const },
          { field: 'Mutation / Survey Record ID', extractedValue: mutationNo || regNumber, govRecordValue: mutationNo || regNumber, status: 'match' as const },
          { field: 'Stated Area', extractedValue: `${areaAcres} Acres`, govRecordValue: isConflict ? `${areaAcres} Acres (Overlap)` : `${areaAcres} Acres`, status: isConflict ? 'mismatch' as const : 'match' as const },
          { field: 'Block / Tehsil Jurisdiction', extractedValue: `${block}, ${district}`, govRecordValue: `${block}, ${district}`, status: 'match' as const },
          { field: 'Jamabandi RoR Status', extractedValue: `Khata #${khataNo}`, govRecordValue: `Khata #${khataNo}`, status: 'match' as const },
          { field: 'Cadastral GIS Verification', extractedValue: `${areaAcres} Acres Boundary`, govRecordValue: `${areaAcres} Acres Matched`, status: 'match' as const }
        ];

        setProcessedResult({
          isAlternative: true,
          aiResultStatus: isConflict ? 'Requires Further Review' : 'Verified with Issues',
          riskScore,
          riskLevel,
          problemDetected,
          hasDispute: false,
          hasConflict: isConflict,
          conflictIssue: isConflict ? 'Ownership information does not match the available government record.' : undefined,
          createdCaseId: newCase.id,
          parcelId,
          crossCheckItems
        });

      } else {
        // =========================================================================
        // PRIMARY DOCUMENT FLOW (Registered Sale Deed / Khatiyan RoR)
        // AI Direct Verification against Government Registry
        // =========================================================================
        const isDisputed = khasraNo === '125';
        let aiResultStatus: 'Verified' | 'Verified with Issues' | 'Unable to Verify' | 'Requires Further Review' = 'Verified';
        let riskScore = 12;
        let riskLevel: RiskLevel = 'low';
        let problemDetected = 'All 14 government registry checks passed. Deed matched Jamabandi RoR and GIS cadastral boundary.';
        let disputeReason = '';

        if (isDisputed) {
          aiResultStatus = 'Requires Further Review';
          riskScore = 72;
          riskLevel = 'high';
          problemDetected = '⚠ POTENTIAL DISPUTE DETECTED: Multiple registered claims detected for Khasra #125. Overlapping deed #REG-2018-8831 recorded under Shyamal Mondal.';
          disputeReason = 'Conflict detected because Khasra Number: 125 (Area: 2.40 Acre) appears to have another registered conveyance record (Deed #REG-2018-8831) recorded in the Sub-Registrar registry for the same parcel.';
        } else if (khasraNo === '084') {
          aiResultStatus = 'Verified';
          riskScore = 15;
          riskLevel = 'low';
          problemDetected = 'Khatiyan / RoR lineage authentic. Jamabandi Volume IV record verified with 0% area deviation.';
        }

        const docTitle = selectedPrimaryType === 'sale_deed' 
          ? 'Registered Sale Deed (Kewala)' 
          : 'Khatiyan / RoR (Record of Rights)';

        const newDoc: LandDocument = {
          id: `doc-${Date.now()}`,
          parcelId,
          docType: selectedPrimaryType === 'sale_deed' ? 'Registered Sale Deed (Kewala)' : 'Khatiyan (Tenancy Record)',
          docNumber: regNumber,
          issueDate: docDate,
          issuingAuthority: 'Sub-Registrar Office',
          language: 'Hindi',
          ocrConfidence: isDisputed ? 88 : 98,
          pageCount: 4,
          fileSize: '3.4 MB',
          extractedFields: [
            { label: 'Owner Name', key: 'owner', value: ownerName, confidence: 96 },
            { label: 'Father/Husband Name', key: 'father', value: fatherHusbandName, confidence: 94 },
            { label: 'Khasra No', key: 'khasraNo', value: khasraNo, confidence: 99 },
            { label: 'Khata No', key: 'khataNo', value: khataNo, confidence: 98 },
            { label: 'Area', key: 'area', value: `${areaAcres} Acres`, confidence: 96 },
            { label: 'Village', key: 'village', value: village, confidence: 98 },
            { label: 'Registration No', key: 'regNo', value: regNumber, confidence: 95 }
          ],
          rawSummary: `${docTitle} संख्या ${regNumber}... मौजा: ${village}, खाता: ${khataNo}, खेसरा: ${khasraNo}, रकबा: ${areaAcres} एकड़... क्रेता/रैयत: ${ownerName}`,
          uploadedAt: new Date().toISOString(),
          sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          status: isDisputed ? 'flagged' : 'verified'
        };

        const newCase = submitNewCase({
          parcelId,
          khasraNo,
          khataNo,
          village,
          block,
          district,
          state,
          ownerName,
          aadhaarMasked: currentUser?.aadhaarMasked || 'XXXX-XXXX-9023',
          areaAcres: parseFloat(areaAcres) || 2.4,
          landType,
          documentType: docTitle,
          isAlternativeDocument: false,
          problemDetected,
          riskScore,
          riskLevel,
          document: newDoc
        });

        const crossCheckItems = [
          { field: 'Owner Name', extractedValue: ownerName, govRecordValue: isDisputed ? 'Rajesh Kumar / Shyamal Mondal (Disputed)' : ownerName, status: isDisputed ? 'flagged' as const : 'match' as const },
          { field: 'Father / Husband Name', extractedValue: fatherHusbandName, govRecordValue: fatherHusbandName, status: 'match' as const },
          { field: 'Khasra / Plot Number', extractedValue: `#${khasraNo} (${plotNo})`, govRecordValue: `#${khasraNo} (${plotNo})`, status: 'match' as const },
          { field: 'Survey Number', extractedValue: surveyNo, govRecordValue: surveyNo, status: 'match' as const },
          { field: 'Area (Acres)', extractedValue: `${areaAcres} Acres`, govRecordValue: `${areaAcres} Acres`, status: 'match' as const },
          { field: 'Village, Block & District', extractedValue: `${village}, ${block}, ${district}`, govRecordValue: `${village}, ${block}, ${district}`, status: 'match' as const },
          { field: 'Registration / Document No', extractedValue: regNumber, govRecordValue: regNumber, status: 'match' as const },
          { field: 'Execution Date', extractedValue: docDate, govRecordValue: docDate, status: 'match' as const },
          { field: 'Jamabandi RoR Record', extractedValue: `Khata #${khataNo} Active`, govRecordValue: `Khata #${khataNo} Active`, status: 'match' as const },
          { field: 'GIS Cadastral Polygon (Bhu-Naksha)', extractedValue: `${areaAcres} Acres Vector Boundary`, govRecordValue: isDisputed ? 'Overlapping Vector Claim' : `${areaAcres} Acres Matched`, status: isDisputed ? 'mismatch' as const : 'match' as const }
        ];

        setProcessedResult({
          isAlternative: false,
          aiResultStatus,
          riskScore,
          riskLevel,
          problemDetected,
          hasDispute: isDisputed,
          disputeReason: isDisputed ? disputeReason : undefined,
          createdCaseId: newCase.id,
          parcelId,
          crossCheckItems
        });
      }
    }, 3000);
  };

  // Submit Supporting Document for Twinning Dispute
  const handleSubmitSupportingDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processedResult?.createdCaseId) return;

    setIsSubmittingSupportingDoc(true);

    const supportingDocInfo: SupportingDocumentInfo = {
      id: `SUP-${Date.now()}`,
      fileName: supportingFileName || 'Supporting_Title_Evidence.pdf',
      fileSize: '2.8 MB',
      fileType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      userNotes: supportingNotes || 'Ancestral continuous possession, mutation order and tax receipts.',
      uploadedBy: ownerName
    };

    setTimeout(() => {
      submitSupportingDisputeDocument({
        caseId: processedResult.createdCaseId!,
        parcelId: processedResult.parcelId || `JH-DMK-RMP-2024-0${khasraNo}`,
        supportingDoc: supportingDocInfo
      });

      setIsSubmittingSupportingDoc(false);
      setSupportingDocSubmitted(true);
      setShowDisputeModal(false);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-7 pb-16 animate-in fade-in duration-300">
      {/* Header with Breadcrumb */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium flex-wrap">
          <div className="flex items-center gap-2">
            <span className="cursor-pointer hover:underline text-[#003D7C]" onClick={() => setActiveTab('user-dashboard')}>Home</span>
            <span>/</span>
            <span>Citizen Services</span>
            <span>/</span>
            <span className="text-gov-navy font-bold">Document Upload &amp; Verification</span>
          </div>

          <button
            onClick={() => setActiveTab('location-select')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E1EDF7] hover:bg-[#C2DCF0] text-[#003D7C] rounded text-xs font-bold border border-[#C2DCF0] transition-all shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>Jurisdiction: <strong>{state} › {district} › {block}</strong></span>
            <span className="text-[10px] text-[#FF9933] underline ml-1">Change ›</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gov-navy">
                दस्तावेज़ सत्यापन एवं अपलोड | Land Document Verification &amp; Upload
              </h1>
              <span className="px-2 py-0.5 rounded bg-gov-navy text-white text-[11px] font-bold font-mono">
                DILRMP-AI-2026
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Automated AI verification for Primary deeds (Sale Deed / Khatiyan); 3-stage statutory government pipeline (BDO → CO → Collector) for Alternative records.
            </p>
          </div>

          {/* Test Cases Quick Selector */}
          <div className="flex items-center gap-1.5 flex-wrap bg-slate-100 p-1.5 rounded-md border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 px-1">Quick Test Presets:</span>
            <button
              type="button"
              onClick={() => handleLoadSample('clean_deed')}
              className="px-2 py-1 text-xs bg-white hover:bg-emerald-50 text-emerald-800 rounded border border-emerald-300 font-semibold shadow-xs transition-all"
            >
              Clear Sale Deed (312)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('disputed_deed')}
              className="px-2 py-1 text-xs bg-white hover:bg-red-50 text-red-800 rounded border border-red-300 font-semibold shadow-xs transition-all"
            >
              Deed Dispute (125)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('alt_mutation_conflict')}
              className="px-2 py-1 text-xs bg-white hover:bg-amber-50 text-amber-800 rounded border border-amber-300 font-semibold shadow-xs transition-all"
            >
              Mutation Conflict (218)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('alt_survey_clean')}
              className="px-2 py-1 text-xs bg-white hover:bg-blue-50 text-gov-navy rounded border border-blue-300 font-semibold shadow-xs transition-all"
            >
              Survey Record (341)
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DOCUMENT CATEGORY SELECTION: PRIMARY VS ALTERNATIVE                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* SECTION 1: PRIMARY DOCUMENTS */}
        <div className={`gov-card p-5 rounded-lg border-2 transition-all ${
          docCategory === 'primary' 
            ? 'border-gov-navy bg-white shadow-sm ring-1 ring-gov-navy/20' 
            : 'border-slate-200 bg-slate-50 opacity-80'
        }`}>
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-gov-navy text-white flex items-center justify-center text-xs font-bold font-mono">
                  A
                </span>
                <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wide">
                  प्राथमिक भू-अभिलेख | Primary Documents
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Direct AI verification against Registration Registry &amp; Cadastral Maps. Verified without manual queues.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setDocCategory('primary')}
              className={`px-3 py-1 text-xs font-bold rounded border transition-all ${
                docCategory === 'primary' 
                  ? 'bg-gov-navy text-white border-gov-navy' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {docCategory === 'primary' ? 'Selected' : 'Select'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {/* Primary 1: Registered Sale Deed */}
            <button
              type="button"
              onClick={() => {
                setDocCategory('primary');
                setSelectedPrimaryType('sale_deed');
              }}
              className={`p-3.5 rounded-md border text-left transition-all flex items-start gap-3 ${
                docCategory === 'primary' && selectedPrimaryType === 'sale_deed'
                  ? 'bg-blue-50/80 border-gov-navy ring-1 ring-gov-navy shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded ${docCategory === 'primary' && selectedPrimaryType === 'sale_deed' ? 'bg-gov-navy text-white' : 'bg-slate-100 text-slate-600'}`}>
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>1. Registered Sale Deed</span>
                  {docCategory === 'primary' && selectedPrimaryType === 'sale_deed' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gov-navy text-white font-semibold">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  रजिस्ट्री विलेख / Kewala registered at Sub-Registrar office.
                </p>
              </div>
            </button>

            {/* Primary 2: Khatiyan / RoR */}
            <button
              type="button"
              onClick={() => {
                setDocCategory('primary');
                setSelectedPrimaryType('khatiyan_ror');
              }}
              className={`p-3.5 rounded-md border text-left transition-all flex items-start gap-3 ${
                docCategory === 'primary' && selectedPrimaryType === 'khatiyan_ror'
                  ? 'bg-blue-50/80 border-gov-navy ring-1 ring-gov-navy shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded ${docCategory === 'primary' && selectedPrimaryType === 'khatiyan_ror' ? 'bg-gov-navy text-white' : 'bg-slate-100 text-slate-600'}`}>
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>2. Khatiyan / RoR</span>
                  {docCategory === 'primary' && selectedPrimaryType === 'khatiyan_ror' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gov-navy text-white font-semibold">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  खतियान / Statutory Jamabandi Record of Rights extract.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 2: ALTERNATIVE / SUPPORTING LAND RECORDS */}
        <div className={`gov-card p-5 rounded-lg border-2 transition-all ${
          docCategory === 'alternative' 
            ? 'border-gov-saffron bg-white shadow-sm ring-1 ring-gov-saffron/30' 
            : 'border-slate-200 bg-slate-50 opacity-80'
        }`}>
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-gov-saffron text-slate-900 flex items-center justify-center text-xs font-bold font-mono">
                  B
                </span>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  वैकल्पिक भू-अभिलेख | Alternative Land Records
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                For applicants without Sale Deed or Khatiyan. Processed via 3-stage statutory queue (BDO → CO → Collector).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDocCategory('alternative')}
              className={`px-3 py-1 text-xs font-bold rounded border transition-all ${
                docCategory === 'alternative' 
                  ? 'bg-gov-saffron text-slate-900 border-amber-500' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {docCategory === 'alternative' ? 'Selected' : 'Select'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {/* Alternative 1: Mutation Record */}
            <button
              type="button"
              onClick={() => {
                setDocCategory('alternative');
                setSelectedAlternativeType('mutation_record');
              }}
              className={`p-3.5 rounded-md border text-left transition-all flex items-start gap-3 ${
                docCategory === 'alternative' && selectedAlternativeType === 'mutation_record'
                  ? 'bg-amber-50/80 border-gov-saffron ring-1 ring-gov-saffron shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded ${docCategory === 'alternative' && selectedAlternativeType === 'mutation_record' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>Mutation Record</span>
                  {docCategory === 'alternative' && selectedAlternativeType === 'mutation_record' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-600 text-white font-semibold">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  दाखिल खारिज आदेश / Circle Officer mutation sanction slip.
                </p>
              </div>
            </button>

            {/* Alternative 2: Khasra / Survey Record */}
            <button
              type="button"
              onClick={() => {
                setDocCategory('alternative');
                setSelectedAlternativeType('khasra_survey');
              }}
              className={`p-3.5 rounded-md border text-left transition-all flex items-start gap-3 ${
                docCategory === 'alternative' && selectedAlternativeType === 'khasra_survey'
                  ? 'bg-amber-50/80 border-gov-saffron ring-1 ring-gov-saffron shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded ${docCategory === 'alternative' && selectedAlternativeType === 'khasra_survey' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>Khasra / Survey Record</span>
                  {docCategory === 'alternative' && selectedAlternativeType === 'khasra_survey' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-600 text-white font-semibold">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  सर्वे / खसरा विवरणी / Settlement Cadastral schedule.
                </p>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. DOCUMENT METADATA FORM & UPLOAD CONTAINER                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & File Drop (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="gov-card p-5 sm:p-6 rounded-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gov-navy" />
                <h3 className="text-sm font-bold text-slate-900">
                  {docCategory === 'primary' 
                    ? `Primary: ${selectedPrimaryType === 'sale_deed' ? 'Registered Sale Deed (रजिस्ट्री विलेख)' : 'Khatiyan / RoR (खतियान)'}`
                    : `Alternative: ${selectedAlternativeType === 'mutation_record' ? 'Mutation Record (दाखिल खारिज)' : 'Khasra / Survey Record (खसरा विवरणी)'}`
                  }
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {docCategory === 'primary' ? 'AI Auto-Verification' : 'Statutory 3-Level Queue'}
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">State (राज्य)</label>
                <input 
                  type="text" 
                  value={state} 
                  onChange={(e) => setState(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">District (जिला)</label>
                <input 
                  type="text" 
                  value={district} 
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Block / Tehsil (अंचल)</label>
                <input 
                  type="text" 
                  value={block} 
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Village (मौजा)</label>
                <input 
                  type="text" 
                  value={village} 
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Khasra No (खेसरा नं.)</label>
                <input 
                  type="text" 
                  value={khasraNo} 
                  onChange={(e) => setKhasraNo(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Khata No (खाता नं.)</label>
                <input 
                  type="text" 
                  value={khataNo} 
                  onChange={(e) => setKhataNo(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-slate-700 font-bold mb-1">Owner / Raiyat (रैयत)</label>
                <input 
                  type="text" 
                  value={ownerName} 
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-slate-700 font-bold mb-1">Father / Husband Name</label>
                <input 
                  type="text" 
                  value={fatherHusbandName} 
                  onChange={(e) => setFatherHusbandName(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Area (रकबा - एकड़)</label>
                <input 
                  type="text" 
                  value={areaAcres} 
                  onChange={(e) => setAreaAcres(e.target.value)}
                  className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>

              {docCategory === 'primary' ? (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Deed Registration No</label>
                    <input 
                      type="text" 
                      value={regNumber} 
                      onChange={(e) => setRegNumber(e.target.value)}
                      className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:border-gov-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Execution Date</label>
                    <input 
                      type="date" 
                      value={docDate} 
                      onChange={(e) => setDocDate(e.target.value)}
                      className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:border-gov-navy"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {selectedAlternativeType === 'mutation_record' ? 'Mutation Case No' : 'Survey Entry No'}
                    </label>
                    <input 
                      type="text" 
                      value={mutationNo} 
                      onChange={(e) => setMutationNo(e.target.value)}
                      placeholder="e.g. MUT-2026-8812"
                      className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Order / Sanction Date</label>
                    <input 
                      type="date" 
                      value={docDate} 
                      onChange={(e) => setDocDate(e.target.value)}
                      className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:border-gov-navy"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Document File Dropzone */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                दस्तावेज़ की स्कैन प्रति संलग्न करें | Attach Scanned Land Document (PDF, JPG, PNG)
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-gov-navy rounded-lg p-5 text-center bg-slate-50 relative cursor-pointer group transition-all">
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedFileName(e.target.files[0].name);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1.5">
                  <div className="w-8 h-8 mx-auto rounded bg-gov-navy/10 text-gov-navy flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {uploadedFileName ? (
                      <span className="text-gov-navy font-mono font-bold">{uploadedFileName}</span>
                    ) : (
                      <span>Drag &amp; drop document, or <span className="text-gov-navy underline">browse files</span></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports Devanagari, Kaithi script &amp; English scanned records (Max: 15 MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleStartAiScan}
              disabled={isProcessingAi}
              className={`w-full py-3 text-white font-bold rounded shadow-sm transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 ${
                docCategory === 'primary'
                  ? 'gov-btn-primary'
                  : 'bg-gov-saffron hover:bg-amber-600 text-slate-950 font-black'
              }`}
            >
              {isProcessingAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing AI Extraction &amp; Government Cross-Verification...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {docCategory === 'primary' 
                      ? 'दस्तावेज़ सत्यापन शुरू करें | Execute AI Direct Verification' 
                      : '3-स्तरीय सत्यापन के लिए अग्रेषित करें | Submit for 3-Step Verification'
                    }
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Live Pipeline & Dispute / Verification Results (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Pipeline Live Status Card */}
          <div className="gov-card p-5 rounded-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gov-saffron" />
                <span>
                  {docCategory === 'primary' ? 'AI Verification Engine' : 'AI Processing & Conflict Detector'}
                </span>
              </span>
              {isProcessingAi && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold animate-pulse border border-amber-300">
                  STAGE {aiStep}/4
                </span>
              )}
            </h3>

            <div className="space-y-2 font-mono text-xs">
              <div className={`p-2.5 rounded border transition-all ${
                aiStep >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <div className="flex items-center justify-between font-sans">
                  <span className="font-bold">1. Document OCR &amp; Script Normalization</span>
                  {aiStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : aiStep === 1 ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" /> : null}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-sans">Devanagari, Kaithi &amp; English raw entity text bounding boxes</div>
              </div>

              <div className={`p-2.5 rounded border transition-all ${
                aiStep >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <div className="flex items-center justify-between font-sans">
                  <span className="font-bold">2. Named Entity Extraction</span>
                  {aiStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : aiStep === 2 ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" /> : null}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-sans">Owner, Father Name, Khasra #{khasraNo}, Area {areaAcres} Acres</div>
              </div>

              <div className={`p-2.5 rounded border transition-all ${
                aiStep >= 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <div className="flex items-center justify-between font-sans">
                  <span className="font-bold">3. Government Data Cross-Verification</span>
                  {aiStep > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : aiStep === 3 ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" /> : null}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-sans">14-point cross-checks against Jamabandi RoR &amp; Cadastral GIS</div>
              </div>

              <div className={`p-2.5 rounded border transition-all ${
                aiStep >= 4 ? 'bg-blue-50 border-blue-300 text-gov-navy' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <div className="flex items-center justify-between font-sans">
                  <span className="font-bold">
                    {docCategory === 'primary' ? '4. Twinning / Conflict & Risk Scoring' : '4. Conflict Flag & Statutory Routing'}
                  </span>
                  {aiStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : null}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
                  {docCategory === 'primary' 
                    ? 'Duplicate claim detection, Risk Score (0-100) & Title status generation' 
                    : 'Discrepancy detection & BDO queue routing'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Processed AI Result */}
          {processedResult && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* IF ALTERNATIVE DOCUMENT: Show 3-Step Pipeline Status */}
              {processedResult.isAlternative ? (
                <div className="space-y-4">
                  {/* CONFLICT BANNER FOR ALTERNATIVE DOCUMENT */}
                  {processedResult.hasConflict ? (
                    <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5 shadow-xs space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-600 text-white rounded shrink-0">
                          <AlertTriangle className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-900 font-bold text-xs uppercase tracking-wider">
                              ⚠ CONFLICT DETECTED
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                              Pending BDO Review
                            </span>
                          </div>
                          <p className="text-xs text-amber-950 font-semibold mt-1 leading-relaxed">
                            Issue: {processedResult.conflictIssue || 'Ownership information does not match the available government record.'}
                          </p>
                          <div className="text-xs font-bold text-amber-900 mt-1.5">
                            Risk Score: {processedResult.riskScore} / 100 ({processedResult.riskLevel.toUpperCase()})
                          </div>
                          <p className="text-[11px] text-amber-800 mt-1">
                            The record has entered the 3-stage statutory government verification workflow.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 shadow-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gov-navy text-white rounded">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-gov-navy font-bold text-xs">
                            Alternative Record Queued for Verification
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Current Stage: <span className="font-bold text-gov-navy">Pending Level 1 (BDO Verification)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3-Step Statutory Verification Progress Card */}
                  <div className="gov-card p-4 rounded-lg space-y-2.5">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      3-Step Statutory Verification Workflow
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded bg-gov-navy text-white flex items-center justify-center font-bold text-xs">
                            1
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">Level 1 — BDO Verification</span>
                            <span className="text-[10px] text-slate-500">Block Development Officer review of record &amp; field survey</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded border border-amber-300 animate-pulse">
                          Pending
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between opacity-70">
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs">
                            2
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">Level 2 — Circle Officer (CO)</span>
                            <span className="text-[10px] text-slate-500">Tehsil Cadastral cross-verification &amp; mutation sanction</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">Awaiting BDO</span>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between opacity-70">
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs">
                            3
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">Level 3 — District Collector</span>
                            <span className="text-[10px] text-slate-500">Final statutory sign-off &amp; verified title generation</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">Awaiting CO</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* IF PRIMARY DOCUMENT: Show Direct AI Result / Twinning Dispute */
                <div className="space-y-4">
                  {processedResult.hasDispute ? (
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5 shadow-xs space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-600 text-white rounded shrink-0">
                          <AlertTriangle className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-red-900 font-bold text-xs uppercase tracking-wider">
                              ⚠ POTENTIAL DISPUTE DETECTED
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-red-200 text-red-900 text-[10px] font-bold">
                              Title Overlap
                            </span>
                          </div>
                          <p className="text-xs text-red-950 font-semibold mt-1 leading-relaxed">
                            This parcel appears to have another registered record/claim associated with the same land.
                          </p>
                          <p className="text-[11px] text-red-800 mt-1">
                            Reason: Multiple records detected for the same parcel (Khasra #{khasraNo}).
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => setShowDisputeModal(true)}
                          className="py-1.5 px-3 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>View Dispute Details</span>
                        </button>

                        {supportingDocSubmitted ? (
                          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1 bg-emerald-100 px-3 py-1.5 rounded border border-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>Supporting File Submitted to Government Queue</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setShowDisputeModal(true)}
                            className="py-1.5 px-3 bg-white hover:bg-red-50 text-red-900 border border-red-300 rounded text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Upload className="w-4 h-4 text-red-700" />
                            <span>Upload Supporting Document</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Clean Primary Result */
                    <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 shadow-xs space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-700 text-white rounded">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-emerald-950 font-bold text-xs">
                            AI Verification: {processedResult.aiResultStatus} (Title Authentic)
                          </div>
                          <div className="text-[11px] text-emerald-800">
                            Directly cleared against Registry &amp; Cadastral Maps • No officer queue required
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Land Risk Score & Cross Checks Card */}
              <div className="gov-card p-5 rounded-lg space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Statutory Land Risk Assessment
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                    processedResult.riskLevel === 'low' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                    processedResult.riskLevel === 'medium' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                    'bg-red-50 text-red-800 border-red-300'
                  }`}>
                    Risk: {processedResult.riskScore}/100 ({processedResult.riskLevel.toUpperCase()})
                  </span>
                </div>

                {/* Government Cross-Verification Results Table */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    14-Point Government Data Cross-Verification Results:
                  </span>
                  <div className="max-h-52 overflow-y-auto space-y-1 pr-1 text-xs">
                    {processedResult.crossCheckItems.map((item, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-slate-500 block font-sans">{item.field}</span>
                          <span className="font-mono text-slate-800 font-medium truncate block text-[11px]">{item.extractedValue}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          item.status === 'match' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          item.status === 'flagged' ? 'bg-red-100 text-red-800 font-bold border border-red-300' :
                          'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {item.status === 'match' ? 'Matched' : item.status === 'flagged' ? 'Conflict' : 'Variance'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DISPUTE DETAILS MODAL (FOR PRIMARY TWINNING CONFLICTS)                 */}
      {/* ========================================================================= */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl border border-slate-300 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Potential Land Record Dispute Details (भू-विवाद विवरण)
                </h3>
              </div>
              <button 
                onClick={() => setShowDisputeModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conflict Explanation Notice */}
            <div className="p-3.5 bg-red-50 border border-red-300 rounded text-xs space-y-1 text-red-950">
              <div className="font-bold flex items-center gap-1.5 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <span>Conflict detected because:</span>
              </div>
              <p className="font-sans pl-5 text-red-900 leading-relaxed">
                Khasra Number: <span className="font-mono font-bold">125</span>, Area: <span className="font-mono font-bold">2.40 Acre</span> in <span className="font-bold">Rampur</span> village. Another registration record exists for the same/overlapping parcel.
              </p>
            </div>

            {/* Side-by-Side Comparison: Current Record vs Conflicting Record */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
              {/* Current Record */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span>Current Uploaded Record</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-gov-navy text-[10px] font-bold">Applicant</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div><span className="text-slate-500 font-sans">Owner:</span> <strong className="text-slate-800">{ownerName}</strong></div>
                  <div><span className="text-slate-500 font-sans">Father:</span> {fatherHusbandName}</div>
                  <div><span className="text-slate-500 font-sans">Khasra:</span> #{khasraNo} (Khata #{khataNo})</div>
                  <div><span className="text-slate-500 font-sans">Area:</span> {areaAcres} Acres</div>
                  <div><span className="text-slate-500 font-sans">Doc Type:</span> Registered Sale Deed</div>
                  <div><span className="text-slate-500 font-sans">Reg No:</span> {regNumber}</div>
                  <div><span className="text-slate-500 font-sans">Date:</span> {docDate}</div>
                </div>
              </div>

              {/* Conflicting Record */}
              <div className="p-3 bg-red-50/70 border border-red-200 rounded space-y-2">
                <div className="font-bold text-red-950 flex items-center justify-between pb-1.5 border-b border-red-200">
                  <span>Conflicting Record in Registry</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-200 text-red-900 text-[10px] font-bold">Existing Claim</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div><span className="text-slate-500 font-sans">Owner:</span> <strong className="text-red-900">Shyamal Mondal</strong></div>
                  <div><span className="text-slate-500 font-sans">Father:</span> Late Bipin Mondal</div>
                  <div><span className="text-slate-500 font-sans">Khasra:</span> #125 (Khata #42)</div>
                  <div><span className="text-slate-500 font-sans">Area:</span> 2.40 Acres</div>
                  <div><span className="text-slate-500 font-sans">Doc Type:</span> Registered Sale Deed</div>
                  <div><span className="text-slate-500 font-sans">Reg No:</span> REG-2018-8831</div>
                  <div><span className="text-slate-500 font-sans">Source:</span> Sub-Registrar Dumka / Jamabandi Vol-IV</div>
                </div>
              </div>
            </div>

            {/* Upload Supporting Document Form */}
            <form onSubmit={handleSubmitSupportingDoc} className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Upload Supporting Document for Official Hearing
                </span>
                <span className="text-[10px] text-slate-500">Linked to Khasra #{khasraNo}</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 hover:border-gov-navy rounded p-3 text-center bg-white relative cursor-pointer">
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSupportingFileName(e.target.files[0].name);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-2">
                  <FileCheck className="w-4 h-4 text-gov-navy" />
                  {supportingFileName ? (
                    <span className="text-gov-navy font-mono">{supportingFileName}</span>
                  ) : (
                    <span>Click to attach evidence file (PDF, JPG, PNG)</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Citizen Clarification / Lineage Statement
                </label>
                <textarea
                  rows={2}
                  value={supportingNotes}
                  onChange={(e) => setSupportingNotes(e.target.value)}
                  placeholder="Explain continuous possession, Jamabandi tax receipt history, or legal pedigree..."
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-gov-navy font-sans"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingSupportingDoc}
                  className="px-4 py-1.5 gov-btn-primary text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmittingSupportingDoc ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting to Government Queue...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Submit for Government Review</span>
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
