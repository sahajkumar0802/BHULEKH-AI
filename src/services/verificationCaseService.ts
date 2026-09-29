/**
 * BHULEKH AI Verification Case Management Service
 * Multi-Level Statutory Verification Workflow (Level 1 Field Officer -> Level 2 CO -> Level 3 Collector)
 * Strict Jurisdiction Filtering, 14-Day Automatic Delay Escalation, and Appeal Management.
 */

import { UserRole, RiskLevel, LandDocument } from '../types/landRecord';
import { notificationService } from './notificationService';

export type CaseStage = 
  | 'user_submitted'
  | 'ai_processing'
  | 'registry_validation'
  | 'level_1_field'
  | 'level_2_co'
  | 'level_3_collector'
  | 'verified'
  | 'rejected'
  | 'rework';

export type CaseStatus = 
  | 'submitted'
  | 'processing'
  | 'under_ai_verification'
  | 'under_official_verification'
  | 'action_required'
  | 'rejected'
  | 'approved'
  | 'completed'
  | 'escalated'
  | 'pending'
  | 'in_review'
  | 'resolved';

export interface CaseHistoryItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  stage: CaseStage;
  status: CaseStatus;
  reason?: string;
  evidenceNotes?: string;
  remarks?: string;
  publicRemarks?: string;
}

export interface AppealRecord {
  id: string;
  caseId: string;
  parcelId: string;
  reason: string;
  description: string;
  supportingDocName?: string;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'resolved';
  appellantName: string;
  resolutionNotes?: string;
}

export type DisputeStatus = 
  | 'Conflict Detected'
  | 'Supporting Document Requested'
  | 'Supporting Document Submitted'
  | 'Government Review Pending'
  | 'Under Official Review'
  | 'Resolved';

export type DisputeOutcome = 
  | 'Conflict Resolved'
  | 'Conflict Confirmed'
  | 'More Information Required'
  | 'Rejected'
  | 'Escalated';

export interface SupportingDocumentInfo {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  userNotes?: string;
  uploadedBy: string;
}

export interface ConflictingRecordInfo {
  ownerName: string;
  fatherHusbandName?: string;
  khasraNo: string;
  khataNo?: string;
  areaAcres: number | string;
  registrationNo: string;
  documentType: string;
  executionDate: string;
  sourceRecord: string;
  statusNotes: string;
}

export interface CurrentRecordInfo {
  ownerName: string;
  fatherHusbandName?: string;
  khasraNo: string;
  khataNo?: string;
  areaAcres: number | string;
  registrationNo: string;
  documentType: string;
  executionDate?: string;
}

export interface DisputeDetails {
  disputeId: string;
  isDisputed: boolean;
  conflictReason: string;
  currentRecord: CurrentRecordInfo;
  conflictingRecord: ConflictingRecordInfo;
  supportingDocument?: SupportingDocumentInfo;
  disputeStatus: DisputeStatus;
  outcome?: DisputeOutcome;
  officerRemarks?: string;
  lastUpdated: string;
}

export interface FinancialTaxInfo {
  taxStatus: 'paid' | 'unpaid' | 'partial';
  annualRevenueAmount: number; // in INR
  outstandingDues: number; // in INR
  lastPaymentDate: string;
  receiptNumber: string;
  financialYear: string;
}

export interface VerificationCase {
  id: string; // e.g. CASE-2026-0125
  parcelId: string;
  khasraNo: string;
  khataNo: string;
  plotNo?: string;
  surveyNo?: string;
  village: string;
  block: string;
  district: string;
  state: string;
  ownerName: string;
  aadhaarMasked: string;
  areaAcres: number;
  landType: string;
  documentType: string;
  isAlternativeDocument: boolean; // True if Mutation/Khasra instead of Sale Deed
  alternativeRecordType?: 'mutation_record' | 'khasra_survey';
  mutationNumber?: string;
  rejectionReason?: string;
  bdoApprovalNote?: string;
  coApprovalNote?: string;
  collectorApprovalNote?: string;
  submissionDate: string; // ISO String
  lastUpdated: string;
  daysPending: number;
  isDelayed: boolean; // True if > 14 days
  isEscalated: boolean; // True if escalated due to delay or complexity
  escalationReason?: string;
  currentStage: CaseStage;
  status: CaseStatus;
  problemDetected: string;
  riskScore: number;
  riskLevel: RiskLevel;
  assignedOfficerRole: UserRole;
  assignedOfficerName: string;
  documents: LandDocument[];
  financialInfo: FinancialTaxInfo;
  history: CaseHistoryItem[];
  appeal?: AppealRecord;
  dispute?: DisputeDetails;
  aiVerificationResult?: 'Verified' | 'Verified with Issues' | 'Unable to Verify' | 'Requires Further Review';
  trackingId?: string;
  expectedNextAction?: string;
  completionDate?: string;
}

const LOCAL_STORAGE_KEY = 'bhulekh_verification_cases_v3';

// -------------------------------------------------------------
// Deterministic Seed Dataset for Multi-Level Verification
// Varied risk scores & levels: Low (12-25), Medium (30-55), High (65-80), Critical (85-95)
// -------------------------------------------------------------

export const INITIAL_VERIFICATION_CASES: VerificationCase[] = [
  {
    id: 'CASE-2026-0125',
    trackingId: 'TRK-2026-0125',
    parcelId: 'JH-DMK-RMP-2024-0125',
    khasraNo: '125',
    khataNo: '42',
    plotNo: '125/A',
    surveyNo: 'SUR-1968-042',
    village: 'Rampur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Rajesh Kumar',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 2.40,
    landType: 'Agricultural',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 16,
    isDelayed: true,
    isEscalated: true,
    escalationReason: 'Statutory 14-Day Review Period Exceeded. Auto-escalated to Circle Officer (CO).',
    currentStage: 'level_2_co',
    status: 'action_required',
    expectedNextAction: 'Action Required: Please upload the requested legacy Khatiyan or succession document for Circle Officer hearing.',
    problemDetected: 'Overlapping registered claim (Deed #REG-2018-8831) identified for Khasra #125.',
    riskScore: 78,
    riskLevel: 'high',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'S. N. Pandey (Circle Officer)',
    aiVerificationResult: 'Requires Further Review',
    dispute: {
      disputeId: 'DISP-2026-0125',
      isDisputed: true,
      conflictReason: 'Conflict detected because Khasra #125 (Area: 2.40 Acre) in Rampur village has another conflicting registered Sale Deed (Deed #REG-2018-8831) claiming overlapping ownership.',
      currentRecord: {
        ownerName: 'Rajesh Kumar',
        fatherHusbandName: 'Late Mohan Lal',
        khasraNo: '125',
        khataNo: '42',
        areaAcres: '2.40',
        registrationNo: 'REG-2024-9042',
        documentType: 'Registered Sale Deed (Kewala)',
        executionDate: '2024-03-12'
      },
      conflictingRecord: {
        ownerName: 'Shyamal Mondal',
        fatherHusbandName: 'Late Bipin Mondal',
        khasraNo: '125',
        khataNo: '42',
        areaAcres: '2.40',
        registrationNo: 'REG-2018-8831',
        documentType: 'Registered Sale Deed (Kewala)',
        executionDate: '2018-11-20',
        sourceRecord: 'Sub-Registrar Office Dumka / Jamabandi Vol-IV Page 82',
        statusNotes: 'Pre-existing registered conveyance deed with active mutation claim.'
      },
      supportingDocument: {
        id: 'SUP-0125',
        fileName: 'Legacy_Khatiyan_Succession_Certificate_1968.pdf',
        fileSize: '3.4 MB',
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        userNotes: 'Ancestral partition deed and continuous Jamabandi tax receipts since 1974.',
        uploadedBy: 'Rajesh Kumar'
      },
      disputeStatus: 'Government Review Pending',
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    financialInfo: {
      taxStatus: 'unpaid',
      annualRevenueAmount: 480,
      outstandingDues: 960,
      lastPaymentDate: '2024-03-12',
      receiptNumber: 'TAX-JH-DMK-2024-8812',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1',
        timestamp: '2026-08-29 10:15:00',
        actorName: 'Rajesh Kumar',
        actorRole: 'Citizen',
        action: 'Document Submitted',
        stage: 'user_submitted',
        status: 'submitted',
        publicRemarks: 'Registered Sale Deed for Khasra #125 submitted.'
      },
      {
        id: 'h-2',
        timestamp: '2026-08-29 10:16:30',
        actorName: 'BHULEKH AI Engine',
        actorRole: 'AI Validation Pipeline',
        action: 'Twinning Dispute Flagged (Multiple Claims)',
        stage: 'user_submitted',
        status: 'action_required',
        evidenceNotes: 'Conflicting deed REG-2018-8831 identified for Khasra 125.',
        publicRemarks: 'Overlap detected with Deed #REG-2018-8831.'
      },
      {
        id: 'h-3',
        timestamp: '2026-09-02 11:20:00',
        actorName: 'Rajesh Kumar',
        actorRole: 'Citizen',
        action: 'Supporting Document Uploaded',
        stage: 'level_2_co',
        status: 'under_official_verification',
        evidenceNotes: 'Attached Legacy_Khatiyan_Succession_Certificate_1968.pdf for Circle Officer Review',
        publicRemarks: 'Supporting succession proof uploaded by citizen.'
      }
    ]
  },
  {
    id: 'CASE-2026-0312',
    trackingId: 'TRK-2026-0312',
    parcelId: 'JH-DMK-SHI-2024-0312',
    khasraNo: '312',
    khataNo: '88',
    plotNo: '312/1',
    surveyNo: 'SUR-1972-088',
    village: 'Shikaripara',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Rajesh Kumar',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 1.85,
    landType: 'Agricultural (Raiyati)',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 1,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'verified',
    status: 'completed',
    expectedNextAction: 'Application completed. Certified Land Title is ready for download.',
    problemDetected: 'Zero defects. 100% Registry & Cadastral GIS match.',
    riskScore: 12,
    riskLevel: 'low',
    assignedOfficerRole: 'district_officer',
    assignedOfficerName: 'AI Verification Engine',
    aiVerificationResult: 'Verified',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 370,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-10',
      receiptNumber: 'TAX-JH-DMK-2026-3120',
      financialYear: '2025-2026'
    },
    documents: [
      {
        id: 'doc-312',
        parcelId: 'JH-DMK-SHI-2024-0312',
        docType: 'Registered Sale Deed (Kewala)',
        docNumber: 'REG-2023-4109',
        issueDate: '2023-11-14',
        issuingAuthority: 'Sub-Registrar Office',
        language: 'Hindi',
        ocrConfidence: 98.4,
        pageCount: 4,
        fileSize: '2.8 MB',
        extractedFields: [
          { label: 'Raiyat / Owner', key: 'owner', value: 'Rajesh Kumar', confidence: 99 },
          { label: 'Khasra Number', key: 'khasra', value: '312', confidence: 99 },
          { label: 'Area', key: 'area', value: '1.85 Acres', confidence: 98 }
        ],
        rawSummary: 'पंजीकृत विक्रय विलेख संख्या REG-2023-4109... मौजा: Shikaripara, खेसरा: 312...',
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'verified'
      }
    ],
    history: [
      {
        id: 'h-312-1',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString(),
        actorName: 'Rajesh Kumar',
        actorRole: 'Citizen Applicant',
        action: 'Application Submitted & SHA-256 Hash Generated',
        stage: 'user_submitted',
        status: 'submitted',
        publicRemarks: 'Registered Sale Deed submitted online.'
      },
      {
        id: 'h-312-2',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 120000).toLocaleString(),
        actorName: 'BHULEKH AI OCR',
        actorRole: 'AI Engine',
        action: 'Multilingual OCR & Entity Recognition (98.4% Confidence)',
        stage: 'ai_processing',
        status: 'processing',
        publicRemarks: 'Extracted Khasra #312, Khata #88, Area 1.85 Acres without transcription variance.'
      },
      {
        id: 'h-312-3',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
        actorName: 'Sub-Registrar Registry Connector',
        actorRole: 'Registry Validation',
        action: 'Sub-Registrar Deed & Bhu-Naksha Vector Geometry Matched',
        stage: 'registry_validation',
        status: 'approved',
        publicRemarks: 'Deed REG-2023-4109 confirmed active in Sub-Registrar Database.'
      },
      {
        id: 'h-312-4',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000).toLocaleString(),
        actorName: 'BHULEKH Direct AI System',
        actorRole: 'Statutory Certification',
        action: 'Direct AI Verification Sanctioned - Digital Certificate Minted',
        stage: 'verified',
        status: 'completed',
        publicRemarks: 'Title authentication certified under DILRMP 2.0 standards.'
      }
    ]
  },
  {
    id: 'CASE-2026-0689',
    trackingId: 'TRK-2026-0689',
    parcelId: 'JH-DMK-RMP-2024-0689',
    khasraNo: '689',
    khataNo: '54',
    plotNo: '689/1',
    surveyNo: 'SUR-1970-054',
    village: 'Rampur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Rajesh Kumar',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 3.20,
    landType: 'Agricultural',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    submissionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 12,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_2_co',
    status: 'rejected',
    rejectionReason: 'Mismatch in parental succession chain and uncertified mutation extract. Missing partition decree.',
    expectedNextAction: 'Application rejected by Circle Officer. You may file a statutory appeal or upload requested correction.',
    problemDetected: 'Parental lineage variance with Jamabandi RoR volume III page 45.',
    riskScore: 74,
    riskLevel: 'high',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'S. N. Pandey (Circle Officer)',
    financialInfo: {
      taxStatus: 'unpaid',
      annualRevenueAmount: 640,
      outstandingDues: 1280,
      lastPaymentDate: '2023-08-15',
      receiptNumber: 'TAX-JH-DMK-2023-6890',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-689-1',
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleString(),
        actorName: 'Rajesh Kumar',
        actorRole: 'Citizen Applicant',
        action: 'Mutation Record Submitted for Verification',
        stage: 'user_submitted',
        status: 'submitted',
        publicRemarks: 'Applicant submitted Mutation extract MUT-2024-5412.'
      },
      {
        id: 'h-689-2',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toLocaleString(),
        actorName: 'R. K. Mishra (BDO)',
        actorRole: 'Block Development Officer (BDO)',
        action: 'Level 1 Field Inspection: Lineage Discrepancy Noted',
        stage: 'level_1_field',
        status: 'under_official_verification',
        publicRemarks: 'Ground inquiry indicates unrecorded co-sharer claim.'
      },
      {
        id: 'h-689-3',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString(),
        actorName: 'S. N. Pandey (Circle Officer)',
        actorRole: 'Circle Officer (CO)',
        action: 'Application Rejected by Circle Officer',
        stage: 'level_2_co',
        status: 'rejected',
        reason: 'Mismatch in parental succession chain and uncertified mutation extract. Missing partition decree.',
        publicRemarks: 'Rejection ground: Mismatch in parental succession chain and uncertified mutation extract.'
      }
    ]
  },
  {
    id: 'CASE-2026-0790',
    trackingId: 'TRK-2026-0790',
    parcelId: 'JH-DMK-LAK-2024-0790',
    khasraNo: '790',
    khataNo: '95',
    plotNo: '790/B',
    surveyNo: 'SUR-1985-095',
    village: 'Lakshmipur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Rajesh Kumar',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 1.15,
    landType: 'Agricultural',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    daysPending: 1,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'user_submitted',
    status: 'submitted',
    expectedNextAction: 'Your document has been received and is queued for AI/OCR extraction and entity validation.',
    problemDetected: 'Document received. Queued in asynchronous processing pipeline.',
    riskScore: 25,
    riskLevel: 'low',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'AI Pre-Processing Engine',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 230,
      outstandingDues: 0,
      lastPaymentDate: '2026-03-01',
      receiptNumber: 'TAX-JH-DMK-2026-7901',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-790-1',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toLocaleString(),
        actorName: 'Rajesh Kumar',
        actorRole: 'Citizen Applicant',
        action: 'Application Submitted & SHA-256 Hash Generated',
        stage: 'user_submitted',
        status: 'submitted',
        publicRemarks: 'Uploaded Registered Sale Deed for Khasra #790.'
      }
    ]
  },
  {
    id: 'CASE-2026-0218',
    parcelId: 'JH-DMK-LAK-2024-0218',
    khasraNo: '218',
    khataNo: '58',
    plotNo: '218/B',
    surveyNo: 'SUR-1968-058',
    village: 'Lakshmipur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Suresh Prasad',
    aadhaarMasked: 'XXXX-XXXX-4412',
    areaAcres: 1.80,
    landType: 'Agricultural',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    submissionDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 6,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'pending',
    problemDetected: 'Standard mutation succession; ground spot verification pending with Village Patwari.',
    riskScore: 38,
    riskLevel: 'medium',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'R. K. Mishra (Block Development Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 360,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-18',
      receiptNumber: 'TAX-JH-DMK-2026-0419',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-201',
        timestamp: '2026-09-08 11:20:00',
        actorName: 'Suresh Prasad',
        actorRole: 'Citizen',
        action: 'Alternative Document Submitted (Mutation)',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CASE-2026-0341',
    parcelId: 'JH-DMK-MAD-2024-0341',
    khasraNo: '341',
    khataNo: '89',
    plotNo: '341/C',
    surveyNo: 'SUR-1972-089',
    village: 'Madhopur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Anita Devi',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 3.10,
    landType: 'Agricultural',
    documentType: 'Khasra / Survey Record (Khatiyan)',
    isAlternativeDocument: true,
    submissionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 8,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_2_co',
    status: 'in_review',
    bdoApprovalNote: 'Field inspection completed by RI Rampur. Ground boundary matches Jamabandi volume IV.',
    problemDetected: 'Authentic Khatiyan record; 0.6% minor area deviation well within statutory tolerance.',
    riskScore: 18,
    riskLevel: 'low',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'S. N. Pandey (Circle Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 620,
      outstandingDues: 0,
      lastPaymentDate: '2026-01-10',
      receiptNumber: 'TAX-JH-DMK-2026-1120',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-301',
        timestamp: '2026-09-03 09:30:00',
        actorName: 'Anita Devi',
        actorRole: 'Citizen',
        action: 'Document Submitted (Khatiyan)',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-302',
        timestamp: '2026-09-06 16:45:00',
        actorName: 'R. K. Mishra (BDO)',
        actorRole: 'BDO Officer',
        action: 'BDO Level 1 Inspection Approved',
        stage: 'level_2_co',
        status: 'in_review'
      }
    ]
  },
  {
    id: 'CASE-2026-0429',
    parcelId: 'JH-DMK-GHA-2024-0429',
    khasraNo: '429',
    khataNo: '63',
    plotNo: '429/1',
    surveyNo: 'SUR-1981-063',
    village: 'Ghasipur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Pradeep Murmu',
    aadhaarMasked: 'XXXX-XXXX-8834',
    areaAcres: 2.10,
    landType: 'Agricultural (Raiyati)',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 3,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'pending',
    problemDetected: 'Lineage verified; Jamabandi tax up to date. Ready for BDO field recommendation.',
    riskScore: 22,
    riskLevel: 'low',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'R. K. Mishra (Block Development Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 420,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-28',
      receiptNumber: 'TAX-JH-DMK-2026-8834',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-401',
        timestamp: '2026-09-12 10:00:00',
        actorName: 'Pradeep Murmu',
        actorRole: 'Citizen',
        action: 'Mutation Record Submitted',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CASE-2026-0512',
    parcelId: 'JH-DMK-CHA-2024-0512',
    khasraNo: '512',
    khataNo: '104',
    plotNo: '512/1',
    surveyNo: 'SUR-1988-104',
    village: 'Chandipur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Manoj Sharma',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 1.50,
    landType: 'Agricultural',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 18,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'verified',
    status: 'resolved',
    bdoApprovalNote: 'Field inspection passed without objections.',
    coApprovalNote: 'Mutation sanctioned under Section 14.',
    collectorApprovalNote: 'Final statutory title verified and digital certificate minted.',
    problemDetected: 'None. Clean title, 100% GIS boundary match, tax clearance verified.',
    riskScore: 12,
    riskLevel: 'low',
    assignedOfficerRole: 'district_officer',
    assignedOfficerName: 'Rajeshwar Singh (IAS)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 300,
      outstandingDues: 0,
      lastPaymentDate: '2026-03-01',
      receiptNumber: 'TAX-JH-DMK-2026-9901',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-501',
        timestamp: '2026-08-27 10:00:00',
        actorName: 'Manoj Sharma',
        actorRole: 'Citizen',
        action: 'Document Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-504',
        timestamp: '2026-09-09 16:20:00',
        actorName: 'Rajeshwar Singh (IAS)',
        actorRole: 'District Collector (Level 3)',
        action: 'Final Verification Sanctioned - Title Clean',
        stage: 'verified',
        status: 'resolved'
      }
    ]
  },
  {
    id: 'CASE-2026-0671',
    parcelId: 'JH-DMK-RMP-2024-0671',
    khasraNo: '671',
    khataNo: '77',
    plotNo: '671/2',
    surveyNo: 'SUR-1976-077',
    village: 'Rampur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Bina Soren',
    aadhaarMasked: 'XXXX-XXXX-5521',
    areaAcres: 2.80,
    landType: 'Agricultural',
    documentType: 'Khasra / Survey Record (Khatiyan)',
    isAlternativeDocument: true,
    submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 5,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'pending',
    problemDetected: 'Partition share allocation verification requested by joint heirs in Mauza Rampur.',
    riskScore: 48,
    riskLevel: 'medium',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'R. K. Mishra (Block Development Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 560,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-15',
      receiptNumber: 'TAX-JH-DMK-2026-7721',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-601',
        timestamp: '2026-09-10 11:15:00',
        actorName: 'Bina Soren',
        actorRole: 'Citizen',
        action: 'Khasra Survey Record Submitted',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CASE-2026-0782',
    parcelId: 'JH-DMK-SHI-2024-0782',
    khasraNo: '782',
    khataNo: '112',
    plotNo: '782/A',
    surveyNo: 'SUR-1984-112',
    village: 'Shikaripara',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Arvind Besra',
    aadhaarMasked: 'XXXX-XXXX-3341',
    areaAcres: 4.20,
    landType: 'Agricultural',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 10,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_2_co',
    status: 'in_review',
    bdoApprovalNote: 'Ground inspection completed. SPT Act section 46 compliance flagged for CO hearing.',
    problemDetected: 'Santhal Parganas Tenancy (SPT) statutory transfer clause scrutiny required.',
    riskScore: 86,
    riskLevel: 'critical',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'S. N. Pandey (Circle Officer)',
    financialInfo: {
      taxStatus: 'unpaid',
      annualRevenueAmount: 840,
      outstandingDues: 840,
      lastPaymentDate: '2025-01-14',
      receiptNumber: 'TAX-JH-DMK-2025-3341',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-701',
        timestamp: '2026-09-05 10:00:00',
        actorName: 'Arvind Besra',
        actorRole: 'Citizen',
        action: 'Registered Deed Submitted',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CASE-2026-0895',
    parcelId: 'JH-DMK-SHI-2024-0895',
    khasraNo: '895',
    khataNo: '91',
    plotNo: '895/1',
    surveyNo: 'SUR-1979-091',
    village: 'Shikaripara',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Sunita Marandi',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 1.65,
    landType: 'Agricultural',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    submissionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 4,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'pending',
    problemDetected: 'Ground physical possession verified by Patwari; succession mutation in process.',
    riskScore: 32,
    riskLevel: 'medium',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'R. K. Mishra (Block Development Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 330,
      outstandingDues: 0,
      lastPaymentDate: '2026-03-02',
      receiptNumber: 'TAX-JH-DMK-2026-9023',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-801',
        timestamp: '2026-09-11 14:00:00',
        actorName: 'Sunita Marandi',
        actorRole: 'Citizen',
        action: 'Mutation Record Uploaded',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  // BIHAR JURISDICTION CASES (FOR ARWAL / PATNA / GAYA STRICT JURISDICTION TESTING)
  {
    id: 'CASE-BR-ARW-0104',
    parcelId: 'BR-ARW-KRT-2024-0104',
    khasraNo: '104',
    khataNo: '33',
    plotNo: '104/A',
    surveyNo: 'SUR-BR-1974-033',
    village: 'Karpi',
    block: 'Arwal Sadar',
    district: 'Arwal',
    state: 'Bihar',
    ownerName: 'Ramashray Singh',
    aadhaarMasked: 'XXXX-XXXX-6612',
    areaAcres: 2.15,
    landType: 'Agricultural',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 15,
    isDelayed: true,
    isEscalated: true,
    escalationReason: 'Statutory 14-Day Limit Exceeded in Arwal Revenue Jurisdiction.',
    currentStage: 'level_2_co',
    status: 'escalated',
    problemDetected: 'Father name spelling mismatch in Khatiyan 1974 vs Current RoR.',
    riskScore: 72,
    riskLevel: 'high',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'R. K. Verma (Circle Officer, Arwal)',
    financialInfo: {
      taxStatus: 'unpaid',
      annualRevenueAmount: 430,
      outstandingDues: 860,
      lastPaymentDate: '2024-04-10',
      receiptNumber: 'TAX-BR-ARW-2024-0012',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-br-1',
        timestamp: '2026-08-30 11:00:00',
        actorName: 'Ramashray Singh',
        actorRole: 'Citizen',
        action: 'Document Submitted',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CASE-BR-ARW-0220',
    parcelId: 'BR-ARW-KRT-2024-0220',
    khasraNo: '220',
    khataNo: '54',
    plotNo: '220/1',
    surveyNo: 'SUR-BR-1974-054',
    village: 'Sonbhadra',
    block: 'Arwal Sadar',
    district: 'Arwal',
    state: 'Bihar',
    ownerName: 'Vimla Devi',
    aadhaarMasked: 'XXXX-XXXX-7721',
    areaAcres: 1.20,
    landType: 'Agricultural',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    submissionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 4,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'pending',
    problemDetected: 'Standard succession mutation; village ground inspection completed without objections.',
    riskScore: 19,
    riskLevel: 'low',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'Pankaj Kumar (Revenue Inspector, Arwal)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 240,
      outstandingDues: 0,
      lastPaymentDate: '2026-01-22',
      receiptNumber: 'TAX-BR-ARW-2026-3390',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-br-201',
        timestamp: '2026-09-10 14:00:00',
        actorName: 'Vimla Devi',
        actorRole: 'Citizen',
        action: 'Mutation Record Uploaded',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CASE-BR-ARW-0315',
    parcelId: 'BR-ARW-KAL-2024-0315',
    khasraNo: '315',
    khataNo: '48',
    plotNo: '315/2',
    surveyNo: 'SUR-BR-1974-048',
    village: 'Kaler',
    block: 'Arwal Sadar',
    district: 'Arwal',
    state: 'Bihar',
    ownerName: 'Satish Chandra',
    aadhaarMasked: 'XXXX-XXXX-1198',
    areaAcres: 3.40,
    landType: 'Agricultural',
    documentType: 'Khasra / Survey Record',
    isAlternativeDocument: true,
    submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 7,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_2_co',
    status: 'in_review',
    bdoApprovalNote: 'Lineage confirmed with local Gram Panchayat Sarpanch.',
    problemDetected: 'Minor name spelling variant in 1974 survey record; affidavit submitted.',
    riskScore: 42,
    riskLevel: 'medium',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'R. K. Verma (Circle Officer, Arwal)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 680,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-10',
      receiptNumber: 'TAX-BR-ARW-2026-1198',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-br-301',
        timestamp: '2026-09-08 10:00:00',
        actorName: 'Satish Chandra',
        actorRole: 'Citizen',
        action: 'Survey Record Submitted',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  // =========================================================================
  // ADDITIONAL PENDING CASES: LEVEL 1 (BDO / FIELD VERIFICATION QUEUE)
  // =========================================================================
  {
    id: 'CASE-2026-0932',
    parcelId: 'JH-DMK-RMP-2024-0932',
    khasraNo: '932',
    khataNo: '115',
    plotNo: '932/A',
    surveyNo: 'SUR-1982-115',
    village: 'Rampur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Amit Kumar Soren',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 3.25,
    landType: 'Agricultural (Raiyati)',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    alternativeRecordType: 'mutation_record',
    mutationNumber: 'MUT-2026-DMK-4491',
    submissionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 4,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'pending',
    problemDetected: 'Warisan (Inheritance) succession mutation filed. BDO / Revenue Inspector field inquiry pending to record legal heir statements and verify physical possession.',
    riskScore: 26,
    riskLevel: 'low',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'R. K. Mishra (Block Development Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 650,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-20',
      receiptNumber: 'TAX-JH-DMK-2026-4491',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-932-1',
        timestamp: '2026-09-11 10:30:00',
        actorName: 'Amit Kumar Soren',
        actorRole: 'Citizen',
        action: 'Mutation (Warisan) Application Submitted',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CASE-2026-1048',
    parcelId: 'JH-DMK-MAD-2024-1048',
    khasraNo: '1048',
    khataNo: '67',
    plotNo: '1048/B',
    surveyNo: 'SUR-1975-067',
    village: 'Madhopur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Gopal Chandra Mahato',
    aadhaarMasked: 'XXXX-XXXX-4190',
    areaAcres: 1.95,
    landType: 'Agricultural',
    documentType: 'Khasra / Survey Record (Khatiyan)',
    isAlternativeDocument: true,
    alternativeRecordType: 'khasra_survey',
    submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 5,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'in_review',
    problemDetected: 'Khatiyan survey entry cross-verification pending. Physical demarcation of boundary stones (Seemana) against cadastral map sheet #3 in progress by Amin.',
    riskScore: 34,
    riskLevel: 'medium',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'R. K. Mishra (Block Development Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 390,
      outstandingDues: 0,
      lastPaymentDate: '2026-01-18',
      receiptNumber: 'TAX-JH-DMK-2026-1048',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1048-1',
        timestamp: '2026-09-10 09:15:00',
        actorName: 'Gopal Chandra Mahato',
        actorRole: 'Citizen',
        action: 'Khatiyan Survey Record Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-1048-2',
        timestamp: '2026-09-13 14:00:00',
        actorName: 'R. K. Mishra (BDO)',
        actorRole: 'BDO Officer',
        action: 'Field Demarcation Assigned to Block Amin',
        stage: 'level_1_field',
        status: 'in_review'
      }
    ]
  },
  {
    id: 'CASE-2026-1175',
    parcelId: 'JH-DMK-LAK-2024-1175',
    khasraNo: '1175',
    khataNo: '82',
    plotNo: '1175/1',
    surveyNo: 'SUR-1980-082',
    village: 'Lakshmipur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Mohammad Imran Ansari',
    aadhaarMasked: 'XXXX-XXXX-7788',
    areaAcres: 0.85,
    landType: 'Homestead (Bari / Residential)',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    alternativeRecordType: 'mutation_record',
    mutationNumber: 'MUT-2026-DMK-5102',
    submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 2,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'pending',
    problemDetected: 'Family gift settlement (Hibanama) mutation review. BDO field inspection pending for donor verification and neighbor boundary NOC.',
    riskScore: 28,
    riskLevel: 'low',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'R. K. Mishra (Block Development Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 220,
      outstandingDues: 0,
      lastPaymentDate: '2026-03-05',
      receiptNumber: 'TAX-JH-DMK-2026-5102',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1175-1',
        timestamp: '2026-09-13 11:45:00',
        actorName: 'Mohammad Imran Ansari',
        actorRole: 'Citizen',
        action: 'Gift Settlement Mutation Submitted',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CASE-2026-1284',
    parcelId: 'JH-DMK-GHA-2024-1284',
    khasraNo: '1284',
    khataNo: '94',
    plotNo: '1284/C',
    surveyNo: 'SUR-1985-094',
    village: 'Ghasipur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Rameshwar Murmu',
    aadhaarMasked: 'XXXX-XXXX-5519',
    areaAcres: 2.60,
    landType: 'Agricultural (Raiyati)',
    documentType: 'Khasra / Survey Record (Khatiyan)',
    isAlternativeDocument: true,
    alternativeRecordType: 'khasra_survey',
    submissionDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 6,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'pending',
    problemDetected: 'Khasra survey record submitted with minor spelling variation in ancestor record; Patwari genealogical lineage certificate pending verification.',
    riskScore: 42,
    riskLevel: 'medium',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'R. K. Mishra (Block Development Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 520,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-14',
      receiptNumber: 'TAX-JH-DMK-2026-1284',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1284-1',
        timestamp: '2026-09-09 15:20:00',
        actorName: 'Rameshwar Murmu',
        actorRole: 'Citizen',
        action: 'Khasra Survey Record Submitted',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  {
    id: 'CASE-BR-ARW-0450',
    parcelId: 'BR-ARW-KRT-2024-0450',
    khasraNo: '450',
    khataNo: '71',
    plotNo: '450/1',
    surveyNo: 'SUR-BR-1974-071',
    village: 'Sonbhadra',
    block: 'Arwal Sadar',
    district: 'Arwal',
    state: 'Bihar',
    ownerName: 'Shambhu Nath Tiwari',
    aadhaarMasked: 'XXXX-XXXX-3382',
    areaAcres: 1.75,
    landType: 'Agricultural',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    alternativeRecordType: 'mutation_record',
    mutationNumber: 'MUT-BR-ARW-2026-781',
    submissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 3,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_1_field',
    status: 'pending',
    problemDetected: 'Standard succession mutation; village ground inspection and verification of legal heir genealogy pending with Revenue Inspector.',
    riskScore: 24,
    riskLevel: 'low',
    assignedOfficerRole: 'patwari',
    assignedOfficerName: 'Pankaj Kumar (Revenue Inspector, Arwal)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 350,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-11',
      receiptNumber: 'TAX-BR-ARW-2026-781',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-br-450-1',
        timestamp: '2026-09-12 11:00:00',
        actorName: 'Shambhu Nath Tiwari',
        actorRole: 'Citizen',
        action: 'Mutation Record Submitted',
        stage: 'user_submitted',
        status: 'pending'
      }
    ]
  },
  // =========================================================================
  // ADDITIONAL PENDING CASES: LEVEL 2 (CO / CIRCLE OFFICER QUEUE & HEARINGS)
  // =========================================================================
  {
    id: 'CASE-2026-1390',
    parcelId: 'JH-DMK-RMP-2024-1390',
    khasraNo: '1390',
    khataNo: '128',
    plotNo: '1390/A',
    surveyNo: 'SUR-1979-128',
    village: 'Rampur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Naresh Prasad Sah',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 4.10,
    landType: 'Agricultural',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 9,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_2_co',
    status: 'in_review',
    bdoApprovalNote: 'BDO Level 1 physical inspection passed on 2026-09-08. Co-sharer filed formal objection petition claiming unpartitioned joint family share. Forwarded for Circle Officer hearing.',
    problemDetected: 'Co-sharer objection petition received under Land Reforms Rules. Circle Officer quasi-judicial hearing scheduled for title determination.',
    riskScore: 74,
    riskLevel: 'high',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'S. N. Pandey (Circle Officer)',
    aiVerificationResult: 'Requires Further Review',
    dispute: {
      disputeId: 'DISP-2026-1390',
      isDisputed: true,
      conflictReason: 'Co-sharer Kailash Prasad Sah filed objection under SPT Act Section 20 claiming ancestral unpartitioned holding against registered Sale Deed REG-2024-7719.',
      currentRecord: {
        ownerName: 'Naresh Prasad Sah',
        fatherHusbandName: 'Late Ganga Sah',
        khasraNo: '1390',
        khataNo: '128',
        areaAcres: '4.10',
        registrationNo: 'REG-2024-7719',
        documentType: 'Registered Sale Deed (Kewala)',
        executionDate: '2024-06-15'
      },
      conflictingRecord: {
        ownerName: 'Kailash Prasad Sah (Co-Sharer)',
        fatherHusbandName: 'Late Ganga Sah',
        khasraNo: '1390',
        khataNo: '128',
        areaAcres: '4.10',
        registrationNo: 'PAR-1986-042',
        documentType: 'Joint Jamabandi Khata',
        executionDate: '1986-04-12',
        sourceRecord: 'Jamabandi Register Vol-VI Page 112',
        statusNotes: 'Unpartitioned co-heir objection petition pending CO quasi-judicial adjudication.'
      },
      supportingDocument: {
        id: 'SUP-1390',
        fileName: 'Family_Partition_Panchayat_Faisla_1994.pdf',
        fileSize: '2.8 MB',
        fileType: 'application/pdf',
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        userNotes: 'Registered family settlement deed and continuous separate rent receipts since 1995.',
        uploadedBy: 'Naresh Prasad Sah'
      },
      disputeStatus: 'Government Review Pending',
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    financialInfo: {
      taxStatus: 'unpaid',
      annualRevenueAmount: 820,
      outstandingDues: 820,
      lastPaymentDate: '2025-02-10',
      receiptNumber: 'TAX-JH-DMK-2025-1390',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1390-1',
        timestamp: '2026-09-06 10:00:00',
        actorName: 'Naresh Prasad Sah',
        actorRole: 'Citizen',
        action: 'Registered Deed Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-1390-2',
        timestamp: '2026-09-08 16:30:00',
        actorName: 'R. K. Mishra (BDO)',
        actorRole: 'BDO Officer',
        action: 'BDO Level 1 Inspection Approved & Forwarded with Co-Sharer Objection',
        stage: 'level_2_co',
        status: 'in_review',
        evidenceNotes: 'Ground boundary verified. Objection under SPT Act Section 20 enqueued for CO hearing.'
      }
    ]
  },
  {
    id: 'CASE-2026-1455',
    parcelId: 'JH-DMK-MAD-2024-1455',
    khasraNo: '1455',
    khataNo: '53',
    plotNo: '1455/1',
    surveyNo: 'SUR-1981-053',
    village: 'Madhopur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Sanjay Kumar Yadav',
    aadhaarMasked: 'XXXX-XXXX-3829',
    areaAcres: 2.75,
    landType: 'Agricultural',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    alternativeRecordType: 'mutation_record',
    mutationNumber: 'MUT-2026-DMK-6180',
    submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 7,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_2_co',
    status: 'in_review',
    bdoApprovalNote: 'Ground inspection verified actual cultivation of 2.75 Acres. Legacy Khatiyan shows 2.68 Acres (+0.07 Acre deviation). BDO recommends CO regularization under Rule 18(2).',
    problemDetected: 'Acreage deviation of +0.07 Acres between legacy RoR and digital GIS boundary survey. Circle Officer correction order required.',
    riskScore: 44,
    riskLevel: 'medium',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'S. N. Pandey (Circle Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 550,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-12',
      receiptNumber: 'TAX-JH-DMK-2026-6180',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1455-1',
        timestamp: '2026-09-08 14:15:00',
        actorName: 'Sanjay Kumar Yadav',
        actorRole: 'Citizen',
        action: 'Mutation Record Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-1455-2',
        timestamp: '2026-09-10 17:00:00',
        actorName: 'R. K. Mishra (BDO)',
        actorRole: 'BDO Officer',
        action: 'BDO Level 1 Approved with Area Regularization Note',
        stage: 'level_2_co',
        status: 'in_review'
      }
    ]
  },
  {
    id: 'CASE-2026-1520',
    parcelId: 'JH-DMK-CHA-2024-1520',
    khasraNo: '1520',
    khataNo: '79',
    plotNo: '1520/2',
    surveyNo: 'SUR-1986-079',
    village: 'Chandipur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Basanti Hembrom',
    aadhaarMasked: 'XXXX-XXXX-9023',
    areaAcres: 3.50,
    landType: 'Agricultural (Raiyati)',
    documentType: 'Khasra / Survey Record (Khatiyan)',
    isAlternativeDocument: true,
    alternativeRecordType: 'khasra_survey',
    submissionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 12,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_2_co',
    status: 'in_review',
    bdoApprovalNote: 'BDO Level 1 inspection cleared on 2026-09-04. Raiyati tenure in order with valid Jamabandi rent receipts. Forwarded for CO final mutation order.',
    problemDetected: 'Approaching statutory 14-day review SLA deadline (12 days pending). Priority Circle Officer mutation hearing pending.',
    riskScore: 38,
    riskLevel: 'medium',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'S. N. Pandey (Circle Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 700,
      outstandingDues: 0,
      lastPaymentDate: '2026-01-29',
      receiptNumber: 'TAX-JH-DMK-2026-1520',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1520-1',
        timestamp: '2026-09-03 11:20:00',
        actorName: 'Basanti Hembrom',
        actorRole: 'Citizen',
        action: 'Khasra Survey Record Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-1520-2',
        timestamp: '2026-09-07 15:45:00',
        actorName: 'R. K. Mishra (BDO)',
        actorRole: 'BDO Officer',
        action: 'BDO Level 1 Approved & Forwarded to CO',
        stage: 'level_2_co',
        status: 'in_review'
      }
    ]
  },
  {
    id: 'CASE-2026-1633',
    parcelId: 'JH-DMK-SHI-2024-1633',
    khasraNo: '1633',
    khataNo: '105',
    plotNo: '1633/1',
    surveyNo: 'SUR-1983-105',
    village: 'Shikaripara',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Alok Kumar Gupta',
    aadhaarMasked: 'XXXX-XXXX-4491',
    areaAcres: 1.10,
    landType: 'Commercial / Agro-storage',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 8,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_2_co',
    status: 'in_review',
    bdoApprovalNote: 'BDO field verification confirms plot has direct PWD road frontage and is outside prohibited eco-sensitive buffer zone.',
    problemDetected: 'Agricultural to Agro-Commercial conversion scrutiny under Section 23 of Land Revenue Code pending CO sanction order.',
    riskScore: 56,
    riskLevel: 'medium',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'S. N. Pandey (Circle Officer)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 880,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-18',
      receiptNumber: 'TAX-JH-DMK-2026-1633',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1633-1',
        timestamp: '2026-09-07 10:10:00',
        actorName: 'Alok Kumar Gupta',
        actorRole: 'Citizen',
        action: 'Conversion Application & Sale Deed Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-1633-2',
        timestamp: '2026-09-10 16:20:00',
        actorName: 'R. K. Mishra (BDO)',
        actorRole: 'BDO Officer',
        action: 'BDO Level 1 Road & Buffer Clearance Verified',
        stage: 'level_2_co',
        status: 'in_review'
      }
    ]
  },
  {
    id: 'CASE-BR-ARW-0560',
    parcelId: 'BR-ARW-KAL-2024-0560',
    khasraNo: '560',
    khataNo: '62',
    plotNo: '560/A',
    surveyNo: 'SUR-BR-1974-062',
    village: 'Kaler',
    block: 'Arwal Sadar',
    district: 'Arwal',
    state: 'Bihar',
    ownerName: 'Dharmendra Rai',
    aadhaarMasked: 'XXXX-XXXX-6619',
    areaAcres: 2.90,
    landType: 'Agricultural',
    documentType: 'Khasra / Survey Record',
    isAlternativeDocument: true,
    alternativeRecordType: 'khasra_survey',
    submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 10,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_2_co',
    status: 'in_review',
    bdoApprovalNote: 'BDO Level 1 spot inquiry verified continuous cultivation since 1982. Recommended for Jamabandi volume correction.',
    problemDetected: 'Jamabandi volume number transcription correction required. Circle Officer correction proceeding in progress.',
    riskScore: 35,
    riskLevel: 'medium',
    assignedOfficerRole: 'tehsildar',
    assignedOfficerName: 'R. K. Verma (Circle Officer, Arwal)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 580,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-05',
      receiptNumber: 'TAX-BR-ARW-2026-0560',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-br-560-1',
        timestamp: '2026-09-05 12:00:00',
        actorName: 'Dharmendra Rai',
        actorRole: 'Citizen',
        action: 'Jamabandi Correction Petition Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-br-560-2',
        timestamp: '2026-09-09 15:30:00',
        actorName: 'Pankaj Kumar (Revenue Inspector)',
        actorRole: 'BDO Officer',
        action: 'BDO Field Inquiry Forwarded to Circle Officer',
        stage: 'level_2_co',
        status: 'in_review'
      }
    ]
  },
  // =========================================================================
  // ADDITIONAL PENDING CASES: LEVEL 3 (DISTRICT COLLECTOR SIGN-OFF QUEUE)
  // =========================================================================
  {
    id: 'CASE-2026-1780',
    parcelId: 'JH-DMK-RMP-2024-1780',
    khasraNo: '1780',
    khataNo: '98',
    plotNo: '1780/A',
    surveyNo: 'SUR-1983-098',
    village: 'Rampur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Surendra Nath Tudu',
    aadhaarMasked: 'XXXX-XXXX-8821',
    areaAcres: 5.40,
    landType: 'Agricultural',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 11,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_3_collector',
    status: 'in_review',
    bdoApprovalNote: 'BDO Level 1 inspection cleared. Boundary markers verified on 2026-09-02.',
    coApprovalNote: 'CO quasi-judicial hearing concluded. Santhal Parganas Tenancy Section 20 clearance certified on 2026-09-08. Recommended for final statutory title minting.',
    problemDetected: 'BDO and CO stages passed. Ready for District Collector final title validation.',
    riskScore: 18,
    riskLevel: 'low',
    assignedOfficerRole: 'district_officer',
    assignedOfficerName: 'Rajeshwar Singh (IAS, District Collector)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 1080,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-28',
      receiptNumber: 'TAX-JH-DMK-2026-1780',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1780-1',
        timestamp: '2026-09-04 10:00:00',
        actorName: 'Surendra Nath Tudu',
        actorRole: 'Citizen',
        action: 'Registered Deed Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-1780-2',
        timestamp: '2026-09-06 14:30:00',
        actorName: 'R. K. Mishra (BDO)',
        actorRole: 'BDO Officer',
        action: 'BDO Level 1 Inspection Approved',
        stage: 'level_2_co',
        status: 'in_review'
      },
      {
        id: 'h-1780-3',
        timestamp: '2026-09-09 16:45:00',
        actorName: 'S. N. Pandey (Circle Officer)',
        actorRole: 'Circle Officer (CO)',
        action: 'CO Level 2 Verification Sanctioned -> Forwarded to District Collector Queue',
        stage: 'level_3_collector',
        status: 'in_review'
      }
    ]
  },
  {
    id: 'CASE-2026-1892',
    parcelId: 'JH-DMK-MAD-2024-1892',
    khasraNo: '1892',
    khataNo: '142',
    plotNo: '1892/1',
    surveyNo: 'SUR-1987-142',
    village: 'Madhopur',
    block: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    ownerName: 'Sunil Kumar Verma',
    aadhaarMasked: 'XXXX-XXXX-5590',
    areaAcres: 3.80,
    landType: 'Agricultural',
    documentType: 'Mutation Record (Dakhil-Kharij)',
    isAlternativeDocument: true,
    alternativeRecordType: 'mutation_record',
    mutationNumber: 'MUT-2026-DMK-8820',
    submissionDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 13,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_3_collector',
    status: 'in_review',
    bdoApprovalNote: 'BDO physical inspection completed without objections on 2026-09-04.',
    coApprovalNote: 'Mutation sanction order drafted under Rule 14. Title chain from 1974 Khatiyan authenticated.',
    problemDetected: 'Multi-generational mutation chain verified. Circle Officer hearing concluded; pending final Collector seal.',
    riskScore: 22,
    riskLevel: 'low',
    assignedOfficerRole: 'district_officer',
    assignedOfficerName: 'Rajeshwar Singh (IAS, District Collector)',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 760,
      outstandingDues: 0,
      lastPaymentDate: '2026-02-15',
      receiptNumber: 'TAX-JH-DMK-2026-1892',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-1892-1',
        timestamp: '2026-09-02 11:00:00',
        actorName: 'Sunil Kumar Verma',
        actorRole: 'Citizen',
        action: 'Mutation Record Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-1892-2',
        timestamp: '2026-09-05 15:00:00',
        actorName: 'R. K. Mishra (BDO)',
        actorRole: 'BDO Officer',
        action: 'BDO Level 1 Inspection Approved',
        stage: 'level_2_co',
        status: 'in_review'
      },
      {
        id: 'h-1892-3',
        timestamp: '2026-09-08 17:30:00',
        actorName: 'S. N. Pandey (Circle Officer)',
        actorRole: 'Circle Officer (CO)',
        action: 'CO Level 2 Title Verification Sanctioned -> Forwarded to District Collector Queue',
        stage: 'level_3_collector',
        status: 'in_review'
      }
    ]
  },
  {
    id: 'CASE-BR-ARW-0670',
    parcelId: 'BR-ARW-KRT-2024-0670',
    khasraNo: '670',
    khataNo: '85',
    plotNo: '670/1',
    surveyNo: 'SUR-BR-1974-085',
    village: 'Karpi',
    block: 'Arwal Sadar',
    district: 'Arwal',
    state: 'Bihar',
    ownerName: 'Upendra Narain Sharma',
    aadhaarMasked: 'XXXX-XXXX-9192',
    areaAcres: 4.15,
    landType: 'Agricultural',
    documentType: 'Registered Sale Deed (Kewala)',
    isAlternativeDocument: false,
    submissionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    daysPending: 12,
    isDelayed: false,
    isEscalated: false,
    currentStage: 'level_3_collector',
    status: 'in_review',
    bdoApprovalNote: 'BDO physical possession and genealogy verified without dispute.',
    coApprovalNote: 'CO statutory title verification cleared. Forwarded for Collector final approval.',
    problemDetected: 'Clean registered deed; dual-level BDO and CO inspections cleared.',
    riskScore: 16,
    riskLevel: 'low',
    assignedOfficerRole: 'district_officer',
    assignedOfficerName: 'District Magistrate / Collector, Arwal',
    financialInfo: {
      taxStatus: 'paid',
      annualRevenueAmount: 830,
      outstandingDues: 0,
      lastPaymentDate: '2026-01-20',
      receiptNumber: 'TAX-BR-ARW-2026-0670',
      financialYear: '2025-2026'
    },
    documents: [],
    history: [
      {
        id: 'h-br-670-1',
        timestamp: '2026-09-03 10:30:00',
        actorName: 'Upendra Narain Sharma',
        actorRole: 'Citizen',
        action: 'Sale Deed Submitted',
        stage: 'user_submitted',
        status: 'pending'
      },
      {
        id: 'h-br-670-2',
        timestamp: '2026-09-06 16:00:00',
        actorName: 'Pankaj Kumar (Revenue Inspector)',
        actorRole: 'BDO Officer',
        action: 'BDO Level 1 Approved',
        stage: 'level_2_co',
        status: 'in_review'
      },
      {
        id: 'h-br-670-3',
        timestamp: '2026-09-09 17:00:00',
        actorName: 'R. K. Verma (Circle Officer)',
        actorRole: 'Circle Officer (CO)',
        action: 'CO Level 2 Approved -> Forwarded to District Collector Queue',
        stage: 'level_3_collector',
        status: 'in_review'
      }
    ]
  }
];

// -------------------------------------------------------------
// Case Management Engine Class
// -------------------------------------------------------------

export class VerificationCaseService {
  private cases: VerificationCase[];

  constructor() {
    this.cases = this.loadFromStorage();
  }

  private loadFromStorage(): VerificationCase[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: VerificationCase[] = JSON.parse(stored);
        // Merge any new seed cases that aren't yet stored in local browser state
        const existingIds = new Set(parsed.map(c => c.id));
        const missingInitial = INITIAL_VERIFICATION_CASES.filter(c => !existingIds.has(c.id));
        const combined = [...parsed, ...missingInitial];
        return this.recalculateDaysAndEscalations(combined);
      }
    } catch {
      // Fallback
    }
    return this.recalculateDaysAndEscalations(INITIAL_VERIFICATION_CASES);
  }

  private saveToStorage() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.cases));
    } catch {
      // Ignore
    }
  }

  /**
   * Recalculates days pending dynamically from submission timestamp.
   * Enforces 14-day automatic delay escalation rule.
   */
  public recalculateDaysAndEscalations(caseList: VerificationCase[]): VerificationCase[] {
    const now = Date.now();
    return caseList.map(c => {
      const subTime = new Date(c.submissionDate).getTime();
      const days = Math.max(1, Math.floor((now - subTime) / (1000 * 60 * 60 * 24)));
      const isOver14Days = days > 14 && c.status !== 'resolved';

      let stage = c.currentStage;
      let status = c.status;
      let isEscalated = c.isEscalated;
      let escalationReason = c.escalationReason;

      // Auto-escalate if > 14 days and still at level 1 or 2
      if (isOver14Days && (status === 'pending' || status === 'in_review')) {
        isEscalated = true;
        status = 'escalated';
        escalationReason = `Automatic Statutory Delay Escalation: Case pending for ${days} days (> 14 days maximum threshold).`;
        if (stage === 'level_1_field') {
          stage = 'level_2_co';
        }
      }

      return {
        ...c,
        daysPending: days,
        isDelayed: isOver14Days,
        isEscalated,
        escalationReason: isOver14Days ? escalationReason : c.escalationReason,
        currentStage: stage,
        status
      };
    });
  }

  /**
   * Strictly filters cases by Government Officer's assigned jurisdiction AND visibility hierarchy.
   * Enforced at service / data access layer (State -> District -> Block + Role Hierarchy).
   * 
   * Visibility Rules:
   * - BDO ('patwari'): ONLY sees BDO-level cases (level_1_field).
   * - CO ('tehsildar'): Sees BDO-level cases + CO-level cases (level_1_field, level_2_co).
   * - Collector ('district_officer'): Sees BDO + CO + Collector-level cases (level_1_field, level_2_co, level_3_collector, verified, rejected).
   * - Admin ('admin'): Full system-wide visibility.
   */
  public getCasesForJurisdiction(
    state: string, 
    district: string, 
    tehsil?: string, 
    role?: UserRole
  ): VerificationCase[] {
    // Admin has system-wide audit access
    if (role === 'admin') {
      return [...this.cases];
    }

    const normalizedState = state.toLowerCase().trim();
    const normalizedDistrict = district.toLowerCase().trim();
    const normalizedTehsil = (tehsil || '').toLowerCase().trim();

    return this.cases.filter(c => {
      // 1. STATE & DISTRICT JURISDICTION
      const matchState = c.state.toLowerCase().trim() === normalizedState;
      const matchDistrict = c.district.toLowerCase().trim() === normalizedDistrict;
      if (!matchState || !matchDistrict) return false;

      // 2. BLOCK / TEHSIL JURISDICTION
      const matchBlock = !normalizedTehsil || 
        c.block.toLowerCase().trim() === normalizedTehsil ||
        c.block.toLowerCase().trim().includes(normalizedTehsil) ||
        normalizedTehsil.includes(c.block.toLowerCase().trim());

      // Level 1: BDO is strictly restricted to their Block
      if (role === 'patwari' && !matchBlock) {
        return false;
      }

      // Level 2: CO is restricted to their Circle / Block within District
      if (role === 'tehsildar' && !matchBlock) {
        return false;
      }

      // Level 3: Collector has jurisdiction across all Blocks within the District
      if (role === 'district_officer') {
        // District matched
      }

      // -------------------------------------------------------------
      // 3. STRICT HIERARCHICAL VISIBILITY FILTERING
      // -------------------------------------------------------------
      // BDO: ONLY sees BDO-level cases (level_1_field or user_submitted).
      // If a case moves BDO -> CO, it must immediately disappear from BDO.
      if (role === 'patwari') {
        return c.currentStage === 'level_1_field' || c.currentStage === 'user_submitted';
      }

      // CO: Sees BDO-level cases (level_1_field) + CO-level cases (level_2_co).
      // CO must NOT see Collector-pending cases (level_3_collector) in their actionable queue.
      if (role === 'tehsildar') {
        return c.currentStage === 'level_1_field' || c.currentStage === 'level_2_co' || c.currentStage === 'user_submitted';
      }

      // Collector: Sees BDO cases, CO cases, Collector cases, and final verified/completed cases.
      if (role === 'district_officer') {
        return true;
      }

      return true;
    });
  }

  /**
   * Direct case lookup by ID with strict role hierarchy & jurisdiction verification.
   * Prevents unauthorized access via direct URL or manual input.
   */
  public getCaseByIdForOfficer(
    id: string, 
    role: UserRole, 
    state?: string, 
    district?: string, 
    tehsil?: string
  ): { authorized: boolean; caseData?: VerificationCase; error?: string } {
    if (role === 'admin') {
      const found = this.getCaseById(id);
      return found ? { authorized: true, caseData: found } : { authorized: false, error: 'Case ID not found in registry.' };
    }

    const target = this.getCaseById(id);
    if (!target) {
      return { authorized: false, error: 'Case ID not found in registry.' };
    }

    // 1. Check Jurisdiction
    if (state && target.state.toLowerCase().trim() !== state.toLowerCase().trim()) {
      return { authorized: false, error: 'Access Denied: Case belongs to another State jurisdiction.' };
    }
    if (district && target.district.toLowerCase().trim() !== district.toLowerCase().trim()) {
      return { authorized: false, error: 'Access Denied: Case belongs to another District jurisdiction.' };
    }
    if ((role === 'patwari' || role === 'tehsildar') && tehsil) {
      const normalizedTehsil = tehsil.toLowerCase().trim();
      const normalizedBlock = target.block.toLowerCase().trim();
      if (normalizedBlock !== normalizedTehsil && !normalizedBlock.includes(normalizedTehsil) && !normalizedTehsil.includes(normalizedBlock)) {
        return { authorized: false, error: 'Access Denied: Case belongs to another Block/Circle jurisdiction.' };
      }
    }

    // 2. Check Visibility Hierarchy
    if (role === 'patwari') {
      if (target.currentStage !== 'level_1_field' && target.currentStage !== 'user_submitted') {
        return { 
          authorized: false, 
          error: 'Access Denied: BDO is strictly restricted to Level 1 (BDO) stage cases.' 
        };
      }
    } else if (role === 'tehsildar') {
      if (target.currentStage === 'level_3_collector') {
        return { 
          authorized: false, 
          error: 'Access Denied: Case has advanced to District Collector (Level 3) queue.' 
        };
      }
    }

    return { authorized: true, caseData: target };
  }

  /**
   * Get all cases linked to a citizen's Aadhaar
   */
  public getCasesForCitizen(aadhaarMasked = 'XXXX-XXXX-9023'): VerificationCase[] {
    return this.cases.filter(c => c.aadhaarMasked === aadhaarMasked || c.ownerName === 'Rajesh Kumar');
  }

  /**
   * Get a single case by ID
   */
  public getCaseById(id: string): VerificationCase | undefined {
    return this.cases.find(c => c.id === id || c.parcelId === id);
  }

  /**
   * Create a new verification case from Citizen Upload workflow
   */
  public createVerificationCase(data: {
    parcelId: string;
    khasraNo: string;
    khataNo?: string;
    village: string;
    block: string;
    district: string;
    state: string;
    ownerName: string;
    aadhaarMasked: string;
    areaAcres: number;
    landType: string;
    documentType: string;
    isAlternativeDocument: boolean;
    alternativeRecordType?: 'mutation_record' | 'khasra_survey';
    mutationNumber?: string;
    problemDetected: string;
    riskScore: number;
    riskLevel: RiskLevel;
    document?: LandDocument;
  }): VerificationCase {
    const caseId = `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    let expectedNextAction = 'Awaiting initial verification review.';
    if (data.isAlternativeDocument) {
      expectedNextAction = 'Awaiting spot inspection and recommendation by Block Development Officer (BDO).';
    } else {
      expectedNextAction = data.problemDetected.includes('CONFLICT') || data.problemDetected.includes('DISPUTE')
        ? 'Action Required: Supporting lineage document requested for review.'
        : 'Direct AI validation in progress against Registry Database.';
    }

    const newCase: VerificationCase = {
      id: caseId,
      trackingId: `TRK-${caseId.replace('CASE-', '')}`,
      parcelId: data.parcelId,
      khasraNo: data.khasraNo,
      khataNo: data.khataNo || '42',
      village: data.village,
      block: data.block,
      district: data.district,
      state: data.state,
      ownerName: data.ownerName,
      aadhaarMasked: data.aadhaarMasked,
      areaAcres: data.areaAcres,
      landType: data.landType,
      documentType: data.documentType,
      isAlternativeDocument: data.isAlternativeDocument,
      alternativeRecordType: data.alternativeRecordType,
      mutationNumber: data.mutationNumber,
      submissionDate: nowIso,
      lastUpdated: nowIso,
      daysPending: 1,
      isDelayed: false,
      isEscalated: false,
      currentStage: data.isAlternativeDocument ? 'level_1_field' : (data.problemDetected.includes('CONFLICT') ? 'level_1_field' : 'verified'),
      status: data.isAlternativeDocument ? 'under_official_verification' : (data.problemDetected.includes('CONFLICT') ? 'action_required' : 'completed'),
      expectedNextAction,
      problemDetected: data.problemDetected,
      riskScore: data.riskScore,
      riskLevel: data.riskLevel,
      assignedOfficerRole: data.isAlternativeDocument ? 'patwari' : (data.problemDetected.includes('CONFLICT') ? 'patwari' : 'district_officer'),
      assignedOfficerName: data.isAlternativeDocument ? 'R. K. Mishra (Block Development Officer)' : (data.problemDetected.includes('CONFLICT') ? 'R. K. Mishra (Block Development Officer)' : 'AI Verification Engine'),
      documents: data.document ? [data.document] : [],
      financialInfo: {
        taxStatus: 'paid',
        annualRevenueAmount: Math.round(data.areaAcres * 200),
        outstandingDues: 0,
        lastPaymentDate: '2026-01-15',
        receiptNumber: `TAX-${Date.now().toString().slice(-6)}`,
        financialYear: '2025-2026'
      },
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          actorName: data.ownerName,
          actorRole: 'Citizen Applicant',
          action: data.isAlternativeDocument ? `Alternative Land Record Uploaded (${data.documentType})` : 'Registered Document Submitted',
          stage: 'user_submitted',
          status: 'submitted',
          remarks: `Initial submission of ${data.documentType} for Khasra #${data.khasraNo}, Mauza ${data.village}.`
        },
        {
          id: `h-${Date.now() + 1}`,
          timestamp: new Date().toLocaleString(),
          actorName: 'BHULEKH AI Pipeline',
          actorRole: 'AI Extraction Engine',
          action: data.problemDetected.includes('CONFLICT') || data.problemDetected.includes('DISPUTE')
            ? `AI Conflict Detected (${data.problemDetected}) -> Enqueued for Statutory Review`
            : `AI Extraction Completed (Risk Score: ${data.riskScore}/100) -> Registry Cross-Check Passed`,
          stage: data.isAlternativeDocument ? 'level_1_field' : (data.problemDetected.includes('CONFLICT') ? 'level_1_field' : 'verified'),
          status: data.isAlternativeDocument ? 'under_official_verification' : (data.problemDetected.includes('CONFLICT') ? 'action_required' : 'completed'),
          remarks: data.problemDetected
        }
      ]
    };

    this.cases = [newCase, ...this.cases];
    this.saveToStorage();

    // Trigger Notification
    notificationService.notify({
      recipientAadhaar: data.aadhaarMasked,
      caseId: newCase.id,
      title: 'Application Successfully Submitted',
      desc: `Your application #${newCase.id} for Khasra #${data.khasraNo} (${data.documentType}) has been logged with tracking ID ${newCase.trackingId}.`,
      type: 'info',
      actionTab: 'track-progress'
    });

    return newCase;
  }

  /**
   * Process Officer Decision: 3-Step Verification Pipeline (BDO -> CO -> Collector)
   * Enforces strict action permissions:
   * - BDO can ONLY act when currentStage === 'level_1_field'
   * - CO can ONLY act when currentStage === 'level_2_co'
   * - Collector can ONLY act when currentStage === 'level_3_collector'
   */
  public processOfficerDecision(params: {
    caseId: string;
    officerName: string;
    officerRole: UserRole;
    decision: 'approve' | 'reject';
    reason?: string;
    evidenceNotes?: string;
  }): { success: boolean; updatedCase?: VerificationCase; error?: string } {
    const targetIdx = this.cases.findIndex(c => c.id === params.caseId);
    if (targetIdx === -1) {
      return { success: false, error: 'Case ID not found in registry.' };
    }

    const currentCase = this.cases[targetIdx];
    const timestamp = new Date().toISOString();
    const formattedTime = new Date().toLocaleString();

    // -------------------------------------------------------------
    // STRICT ACTION PERMISSIONS (Visibility != Action Permission)
    // -------------------------------------------------------------
    if (currentCase.status === 'resolved' || currentCase.status === 'completed' || currentCase.currentStage === 'verified') {
      return {
        success: false,
        error: 'Final Verified Decision is locked. Modification is only permitted through statutory appeals or re-survey.'
      };
    }

    if (params.officerRole === 'patwari') {
      if (currentCase.currentStage !== 'level_1_field' && currentCase.currentStage !== 'user_submitted') {
        return { 
          success: false, 
          error: `Action Unauthorized: BDO can only take action on Level 1 (BDO) stage cases. Current stage: ${currentCase.currentStage}.` 
        };
      }
    } else if (params.officerRole === 'tehsildar') {
      if (currentCase.currentStage !== 'level_2_co') {
        return { 
          success: false, 
          error: `Action Unauthorized: Circle Officer (CO) can only take action on Level 2 (CO) stage cases. Current stage: ${currentCase.currentStage}.` 
        };
      }
    } else if (params.officerRole === 'district_officer') {
      if (currentCase.currentStage !== 'level_3_collector') {
        return { 
          success: false, 
          error: `Action Unauthorized: District Collector can only take action on Level 3 (Collector) stage cases. Current stage: ${currentCase.currentStage}.` 
        };
      }
    }

    // Rejection MUST have a reason (minimum 5 characters)
    if (params.decision === 'reject' && (!params.reason || params.reason.trim().length < 5)) {
      return { success: false, error: 'Mandatory Rejection Reason required (minimum 5 characters).' };
    }

    let nextStage: CaseStage = currentCase.currentStage;
    let nextStatus: CaseStatus = currentCase.status;
    let nextOfficerRole: UserRole = currentCase.assignedOfficerRole;
    let nextOfficerName: string = currentCase.assignedOfficerName;
    let nextAction = '';
    let actionLabel = '';
    let bdoApprovalNote = currentCase.bdoApprovalNote;
    let coApprovalNote = currentCase.coApprovalNote;
    let collectorApprovalNote = currentCase.collectorApprovalNote;
    let rejectionReason = currentCase.rejectionReason;
    let completionDate = currentCase.completionDate;

    if (params.decision === 'approve') {
      rejectionReason = undefined;
      if (currentCase.currentStage === 'level_1_field' || currentCase.currentStage === 'user_submitted') {
        // LEVEL 1: BDO Approved -> Advances to CO
        nextStage = 'level_2_co';
        nextStatus = 'under_official_verification';
        nextOfficerRole = 'tehsildar';
        nextOfficerName = 'S. N. Pandey (Circle Officer)';
        nextAction = 'Awaiting Circle Officer (CO) title & Cadastral cross-check verification.';
        bdoApprovalNote = params.evidenceNotes || 'BDO physical and field record verification approved.';
        actionLabel = 'BDO Level 1 Inspection Approved -> Forwarded to Circle Officer (CO) Queue';

        notificationService.notify({
          recipientAadhaar: currentCase.aadhaarMasked,
          caseId: currentCase.id,
          title: 'BDO Verification Approved (Level 1 Passed)',
          desc: `Block Development Officer (BDO) has approved your application #${currentCase.id}. It has moved to Circle Officer (CO) verification.`,
          type: 'success',
          actionTab: 'track-progress'
        });

      } else if (currentCase.currentStage === 'level_2_co') {
        // LEVEL 2: CO Approved -> Advances to Collector
        nextStage = 'level_3_collector';
        nextStatus = 'under_official_verification';
        nextOfficerRole = 'district_officer';
        nextOfficerName = 'Rajeshwar Singh (IAS, District Collector)';
        nextAction = 'Awaiting final statutory title sign-off by District Collector.';
        coApprovalNote = params.evidenceNotes || 'Circle Officer title & Cadastral cross-check approved.';
        actionLabel = 'CO Level 2 Title Verification Sanctioned -> Forwarded to District Collector Queue';

        notificationService.notify({
          recipientAadhaar: currentCase.aadhaarMasked,
          caseId: currentCase.id,
          title: 'Circle Officer (CO) Approval Granted',
          desc: `Circle Officer has approved your application #${currentCase.id}. It is now in final District Collector review.`,
          type: 'success',
          actionTab: 'track-progress'
        });

      } else if (currentCase.currentStage === 'level_3_collector') {
        // LEVEL 3: Collector Approved -> Final Verified
        nextStage = 'verified';
        nextStatus = 'completed';
        completionDate = timestamp;
        nextAction = 'Your application has been completed. Certified land title issued.';
        collectorApprovalNote = params.evidenceNotes || 'District Collector final statutory title sign-off granted.';
        actionLabel = 'District Collector Final Approval Granted -> FINAL VERIFIED (Certificate Minted)';

        notificationService.notify({
          recipientAadhaar: currentCase.aadhaarMasked,
          caseId: currentCase.id,
          title: 'Application Completed & Title Verified',
          desc: `District Collector has granted final approval for Application #${currentCase.id}. Your certified land title is now issued.`,
          type: 'success',
          actionTab: 'track-progress'
        });
      }
    } else {
      // REJECTION LOGIC - Mandatory reason recorded
      rejectionReason = params.reason;
      nextStatus = 'rejected';
      nextAction = `Rejected: ${params.reason}. You may file a statutory appeal or upload requested correction.`;

      if (currentCase.currentStage === 'level_3_collector') {
        nextStage = 'level_3_collector';
        actionLabel = `District Collector Rejected (Reason: ${params.reason}) -> Correction Required`;
      } else if (currentCase.currentStage === 'level_2_co') {
        nextStage = 'level_2_co';
        actionLabel = `Circle Officer (CO) Rejected (Reason: ${params.reason}) -> Correction Required`;
      } else {
        nextStage = 'level_1_field';
        actionLabel = `BDO Rejected (Reason: ${params.reason}) -> Correction Required`;
      }

      notificationService.notify({
        recipientAadhaar: currentCase.aadhaarMasked,
        caseId: currentCase.id,
        title: `Application Rejected by ${params.officerRole === 'patwari' ? 'BDO' : params.officerRole === 'tehsildar' ? 'Circle Officer (CO)' : 'District Collector'}`,
        desc: `Application #${currentCase.id} was rejected. Ground: ${params.reason}`,
        type: 'alert',
        actionTab: 'track-progress'
      });
    }

    const historyItem: CaseHistoryItem = {
      id: `h-${Date.now()}`,
      timestamp: formattedTime,
      actorName: params.officerName,
      actorRole: params.officerRole === 'patwari' ? 'Block Development Officer (BDO)' : params.officerRole === 'tehsildar' ? 'Circle Officer (CO)' : 'District Collector',
      action: actionLabel,
      stage: nextStage,
      status: nextStatus,
      reason: params.reason,
      evidenceNotes: params.evidenceNotes,
      publicRemarks: params.decision === 'approve' 
        ? (params.evidenceNotes || 'Statutory review passed successfully.')
        : `Rejection ground: ${params.reason}`
    };

    const updatedCase: VerificationCase = {
      ...currentCase,
      currentStage: nextStage,
      status: nextStatus,
      assignedOfficerRole: nextOfficerRole,
      assignedOfficerName: nextOfficerName,
      expectedNextAction: nextAction,
      completionDate,
      bdoApprovalNote,
      coApprovalNote,
      collectorApprovalNote,
      rejectionReason,
      lastUpdated: timestamp,
      isDelayed: false, // Reset delay warning once acted upon
      isEscalated: params.decision === 'reject' ? false : currentCase.isEscalated,
      history: [...currentCase.history, historyItem]
    };

    this.cases[targetIdx] = updatedCase;
    this.saveToStorage();

    return { success: true, updatedCase };
  }

  /**
   * Submit an Appeal for a rejected or disputed case
   */
  public submitAppeal(params: {
    caseId: string;
    parcelId: string;
    appellantName: string;
    reason: string;
    description: string;
    supportingDocName?: string;
  }): { success: boolean; appealId: string; updatedCase?: VerificationCase } {
    const targetIdx = this.cases.findIndex(c => c.id === params.caseId || c.parcelId === params.parcelId);
    const appealId = `APP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();

    const appeal: AppealRecord = {
      id: appealId,
      caseId: params.caseId,
      parcelId: params.parcelId,
      reason: params.reason,
      description: params.description,
      supportingDocName: params.supportingDocName || 'Supporting_Title_Deed.pdf',
      submittedAt: nowIso,
      status: 'submitted',
      appellantName: params.appellantName
    };

    if (targetIdx !== -1) {
      const currentCase = this.cases[targetIdx];
      const updatedCase: VerificationCase = {
        ...currentCase,
        status: 'under_official_verification',
        currentStage: 'level_2_co', // Appeals go directly to CO for quasi-judicial hearing
        assignedOfficerRole: 'tehsildar',
        expectedNextAction: 'Statutory appeal under quasi-judicial review with Circle Officer.',
        lastUpdated: nowIso,
        appeal,
        history: [
          ...currentCase.history,
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            actorName: params.appellantName,
            actorRole: 'Citizen Appellant',
            action: `Statutory Appeal Submitted (${appealId})`,
            stage: 'level_2_co',
            status: 'under_official_verification',
            reason: `Appeal Grounds: ${params.reason} - ${params.description}`,
            publicRemarks: `Statutory appeal grounds filed by ${params.appellantName}.`
          }
        ]
      };
      this.cases[targetIdx] = updatedCase;
      this.saveToStorage();

      notificationService.notify({
        recipientAadhaar: currentCase.aadhaarMasked,
        caseId: currentCase.id,
        title: 'Statutory Appeal Registered',
        desc: `Appeal #${appealId} has been registered for Case #${currentCase.id} and assigned to Circle Officer (CO).`,
        type: 'warning',
        actionTab: 'track-progress'
      });

      return { success: true, appealId, updatedCase };
    }

    return { success: true, appealId };
  }

  /**
   * Submit Supporting Document for a Disputed Case
   */
  public submitSupportingDisputeDocument(params: {
    caseId: string;
    parcelId: string;
    supportingDoc: SupportingDocumentInfo;
  }): { success: boolean; updatedCase?: VerificationCase } {
    const targetIdx = this.cases.findIndex(c => c.id === params.caseId || c.parcelId === params.parcelId);
    const nowIso = new Date().toISOString();

    if (targetIdx !== -1) {
      const currentCase = this.cases[targetIdx];
      const existingDispute = currentCase.dispute || {
        disputeId: `DISP-${new Date().getFullYear()}-${currentCase.khasraNo}`,
        isDisputed: true,
        conflictReason: currentCase.problemDetected,
        currentRecord: {
          ownerName: currentCase.ownerName,
          khasraNo: currentCase.khasraNo,
          khataNo: currentCase.khataNo,
          areaAcres: currentCase.areaAcres,
          registrationNo: `REG-${currentCase.khasraNo}-2024`,
          documentType: currentCase.documentType
        },
        conflictingRecord: {
          ownerName: 'Prior Claim / Unidentified Claimant',
          khasraNo: currentCase.khasraNo,
          areaAcres: currentCase.areaAcres,
          registrationNo: `DEED-${currentCase.khasraNo}-PREV`,
          documentType: 'Registered Sale Deed (Kewala)',
          executionDate: '2019-06-15',
          sourceRecord: 'State Cadastral Records & Jamabandi Registry',
          statusNotes: 'Duplicate claim flagged by AI validation cross-check.'
        },
        disputeStatus: 'Supporting Document Submitted',
        lastUpdated: nowIso
      };

      const updatedDispute: DisputeDetails = {
        ...existingDispute,
        supportingDocument: params.supportingDoc,
        disputeStatus: 'Government Review Pending',
        lastUpdated: nowIso
      };

      const updatedCase: VerificationCase = {
        ...currentCase,
        status: 'under_official_verification',
        currentStage: 'level_2_co', // Routes to Circle Officer for review
        assignedOfficerRole: 'tehsildar',
        expectedNextAction: 'Supporting documents under review by Circle Officer (CO).',
        lastUpdated: nowIso,
        dispute: updatedDispute,
        history: [
          ...currentCase.history,
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            actorName: params.supportingDoc.uploadedBy,
            actorRole: 'Citizen Applicant',
            action: 'Supporting Evidence Uploaded for Dispute',
            stage: 'level_2_co',
            status: 'under_official_verification',
            evidenceNotes: `Attached ${params.supportingDoc.fileName} (${params.supportingDoc.userNotes || 'Supporting proof of continuous ownership'})`,
            publicRemarks: `Citizen submitted proof: ${params.supportingDoc.fileName}`
          }
        ]
      };

      this.cases[targetIdx] = updatedCase;
      this.saveToStorage();

      notificationService.notify({
        recipientAadhaar: currentCase.aadhaarMasked,
        caseId: currentCase.id,
        title: 'Requested Correction / Evidence Received',
        desc: `Supporting document '${params.supportingDoc.fileName}' uploaded for Case #${currentCase.id}. Moved to Circle Officer review.`,
        type: 'info',
        actionTab: 'track-progress'
      });

      return { success: true, updatedCase };
    }

    return { success: false };
  }

  /**
   * Government Official Dispute Decision Resolution
   */
  public resolveDisputeCase(params: {
    caseId: string;
    outcome: DisputeOutcome;
    officerRemarks: string;
    officerName: string;
    officerRole: string;
  }): { success: boolean; updatedCase?: VerificationCase } {
    const targetIdx = this.cases.findIndex(c => c.id === params.caseId);
    const nowIso = new Date().toISOString();

    if (targetIdx !== -1) {
      const currentCase = this.cases[targetIdx];
      let nextStatus: CaseStatus = 'under_official_verification';
      let nextStage: CaseStage = currentCase.currentStage;
      let nextDisputeStatus: DisputeStatus = 'Under Official Review';
      let expectedNextAction = '';

      if (params.outcome === 'Conflict Resolved') {
        nextStatus = 'completed';
        nextStage = 'verified';
        nextDisputeStatus = 'Resolved';
        expectedNextAction = 'Dispute resolved. Certified land record available for download.';
      } else if (params.outcome === 'Conflict Confirmed') {
        nextStatus = 'rejected';
        nextStage = 'rework';
        nextDisputeStatus = 'Resolved';
        expectedNextAction = 'Dispute confirmed. Application rejected by revenue authorities.';
      } else if (params.outcome === 'Escalated') {
        nextStatus = 'escalated';
        nextStage = 'level_3_collector';
        nextDisputeStatus = 'Under Official Review';
        expectedNextAction = 'Case escalated to District Collector for final quasi-judicial determination.';
      } else if (params.outcome === 'More Information Required') {
        nextStatus = 'action_required';
        nextStage = 'level_1_field';
        nextDisputeStatus = 'Supporting Document Requested';
        expectedNextAction = 'Action Required: Please upload additional title or succession documents.';
      } else if (params.outcome === 'Rejected') {
        nextStatus = 'rejected';
        nextStage = 'rejected';
        nextDisputeStatus = 'Resolved';
        expectedNextAction = 'Application rejected. Citizen may appeal within 30 days.';
      }

      const updatedDispute: DisputeDetails | undefined = currentCase.dispute ? {
        ...currentCase.dispute,
        disputeStatus: nextDisputeStatus,
        outcome: params.outcome,
        officerRemarks: params.officerRemarks,
        lastUpdated: nowIso
      } : undefined;

      const updatedCase: VerificationCase = {
        ...currentCase,
        status: nextStatus,
        currentStage: nextStage,
        expectedNextAction,
        lastUpdated: nowIso,
        dispute: updatedDispute,
        history: [
          ...currentCase.history,
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            actorName: params.officerName,
            actorRole: params.officerRole,
            action: `Dispute Review: ${params.outcome}`,
            stage: nextStage,
            status: nextStatus,
            reason: params.officerRemarks,
            publicRemarks: `Official outcome: ${params.outcome}. ${params.officerRemarks}`
          }
        ]
      };

      this.cases[targetIdx] = updatedCase;
      this.saveToStorage();

      notificationService.notify({
        recipientAadhaar: currentCase.aadhaarMasked,
        caseId: currentCase.id,
        title: `Official Dispute Decision: ${params.outcome}`,
        desc: `Authorized Officer ${params.officerName} determined: ${params.outcome}. Remarks: ${params.officerRemarks}`,
        type: params.outcome === 'Conflict Resolved' ? 'success' : 'alert',
        actionTab: 'track-progress'
      });

      return { success: true, updatedCase };
    }

    return { success: false };
  }
}

export const verificationCaseService = new VerificationCaseService();

