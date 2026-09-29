import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  LandParcel, 
  UserRole, 
  AuditEvent, 
  ParcelStatus, 
  LandDocument, 
  AiCorrectionFeedback,
  SupportedLanguage,
  RiskLevel
} from '../types/landRecord';
import { AuthUser } from '../services/authService';
import { 
  verificationCaseService, 
  VerificationCase
} from '../services/verificationCaseService';
import { SYNTHETIC_LAND_PARCELS } from '../data/syntheticLandData';
import { runCrossRecordValidation } from '../services/validationService';
import { calculateParcelRiskAssessment } from '../services/riskService';
import { saveFeedbackCorrection, getStoredFeedbackRecords } from '../services/learningFeedbackService';
import { AppNotification, notificationService } from '../services/notificationService';
import { 
  SupportedAppLanguage, 
  getTranslation, 
  isRtlLanguage, 
  getStoredLanguage, 
  saveStoredLanguage, 
  TranslationDictionary 
} from '../services/i18nService';

export type NotificationItem = AppNotification;

interface AppContextType {
  parcels: LandParcel[];
  selectedParcelId: string;
  selectedParcel: LandParcel;
  setSelectedParcelId: (id: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  loginUser: (user: AuthUser) => void;
  logoutUser: () => void;
  selectedState: string;
  setSelectedState: (s: string) => void;
  selectedDistrict: string;
  selectedTehsil: string;
  setSelectedDistrict: (d: string) => void;
  setSelectedTehsil: (t: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  auditLogs: AuditEvent[];
  addAuditLog: (event: Omit<AuditEvent, 'id' | 'timestamp' | 'integrityHash'>) => void;
  updateParcelStatus: (parcelId: string, newStatus: ParcelStatus, actionReason: string) => void;
  runValidationForParcel: (parcelId: string) => void;
  addDocumentToParcel: (parcelId: string, doc: LandDocument) => void;
  updateDocumentMetadata: (docId: string, updates: Partial<LandDocument>) => void;
  feedbackRecords: AiCorrectionFeedback[];
  recordAiCorrection: (correction: {
    documentId: string;
    parcelId: string;
    fieldKey: string;
    fieldLabel: string;
    aiValue: string;
    correctedValue: string;
    language?: SupportedLanguage;
    notes?: string;
  }) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  // Verification Cases (3-Level Verification Workflow & Jurisdiction)
  verificationCases: VerificationCase[];
  getOfficerCases: (state?: string, district?: string, tehsil?: string, role?: UserRole) => VerificationCase[];
  getCitizenCases: (aadhaarMasked?: string) => VerificationCase[];
  submitNewCase: (data: {
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
    problemDetected: string;
    riskScore: number;
    riskLevel: RiskLevel;
    document?: LandDocument;
  }) => VerificationCase;
  processOfficerDecision: (params: {
    caseId: string;
    officerName: string;
    officerRole: UserRole;
    decision: 'approve' | 'reject';
    reason?: string;
    evidenceNotes?: string;
  }) => { success: boolean; updatedCase?: VerificationCase };
  submitCaseAppeal: (params: {
    caseId: string;
    parcelId: string;
    appellantName: string;
    reason: string;
    description: string;
    supportingDocName?: string;
  }) => { success: boolean; appealId: string; updatedCase?: VerificationCase };
  submitSupportingDisputeDocument: (params: {
    caseId: string;
    parcelId: string;
    supportingDoc: {
      id: string;
      fileName: string;
      fileSize: string;
      fileType: string;
      uploadedAt: string;
      userNotes?: string;
      uploadedBy: string;
    };
  }) => { success: boolean; updatedCase?: VerificationCase };
  resolveDisputeCase: (params: {
    caseId: string;
    outcome: 'Conflict Resolved' | 'Conflict Confirmed' | 'More Information Required' | 'Rejected' | 'Escalated';
    officerRemarks: string;
    officerName: string;
    officerRole: string;
  }) => { success: boolean; updatedCase?: VerificationCase };
  getCaseByIdForOfficer: (
    id: string, 
    role?: UserRole, 
    state?: string, 
    district?: string, 
    tehsil?: string
  ) => { authorized: boolean; caseData?: VerificationCase; error?: string };
  // Guided SIH Demo Mode
  isDemoTourActive: boolean;
  demoStep: number;
  startDemoTour: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  endDemoTour: () => void;
  goToDemoStep: (step: number) => void;
  // Tracking & Application Selection
  selectedTrackCaseId: string | null;
  setSelectedTrackCaseId: (id: string | null) => void;
  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  refreshNotifications: () => void;
  hasPermission: (action: 'view' | 'upload' | 'verify' | 'admin' | 'export') => boolean;
  // Accessibility & Localization (UIDAI standard & 8 Indian Languages)
  govLanguage: SupportedAppLanguage;
  setGovLanguage: (lang: SupportedAppLanguage) => void;
  isRtl: boolean;
  t: (key: keyof TranslationDictionary, fallback?: string) => string;
  fontScale: 'sm' | 'base' | 'lg' | 'xl';
  setFontScale: (scale: 'sm' | 'base' | 'lg' | 'xl') => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}e4b81c29e73d45aa98c214e09f87b1c34a2e5d981240${hex}`.substring(0, 64);
}

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-06 18:40:00',
    officerName: 'BHULEKH AI Validation Engine',
    officerRole: 'system',
    action: 'Validation Run',
    parcelId: 'JH-DMK-RMP-2024-0125',
    khasraNo: '125',
    reason: 'Automated 4-way cross-check detected 3 critical conflicts (Name mismatch, duplicate deed ID, Gochar overlap).',
    previousStatus: 'needs_review',
    newStatus: 'critical',
    integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-06 17:15:00',
    officerName: 'S. N. Pandey',
    officerRole: 'Tehsildar / Circle Officer',
    action: 'Risk Updated',
    parcelId: 'JH-DMK-LAK-2024-0218',
    khasraNo: '218',
    reason: 'Duplicate deed ID REG-2018-8831 flagged by Sub-Registrar cross-database validation.',
    previousStatus: 'verified',
    newStatus: 'needs_review',
    integrityHash: '8f4c2810a9b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parcels, setParcels] = useState<LandParcel[]>(SYNTHETIC_LAND_PARCELS);
  const [selectedParcelId, setSelectedParcelId] = useState<string>('JH-DMK-RMP-2024-0125');
  const [activeRole, setActiveRole] = useState<UserRole>('citizen');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<string>('Jharkhand');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Dumka');
  const [selectedTehsil, setSelectedTehsil] = useState<string>('Dumka Sadar');
  const [activeTab, setActiveTab] = useState<string>('signin');
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [feedbackRecords, setFeedbackRecords] = useState<AiCorrectionFeedback[]>(getStoredFeedbackRecords());
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedTrackCaseId, setSelectedTrackCaseId] = useState<string | null>(null);
  // Accessibility & Localization states (UIDAI Gov standard & 8 Indian Languages)
  const [govLanguage, setGovLanguageState] = useState<SupportedAppLanguage>(() => getStoredLanguage());
  const [fontScale, setFontScale] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  const isRtl = useMemo(() => isRtlLanguage(govLanguage), [govLanguage]);

  // Synchronize document direction and language on root HTML element
  React.useEffect(() => {
    try {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = govLanguage;
    } catch (e) {}
  }, [govLanguage, isRtl]);

  const setGovLanguage = (lang: SupportedAppLanguage) => {
    setGovLanguageState(lang);
    saveStoredLanguage(lang);
    try {
      document.documentElement.dir = isRtlLanguage(lang) ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    } catch (e) {}
  };

  const t = (key: keyof TranslationDictionary, fallback?: string): string => {
    return getTranslation(govLanguage, key) || fallback || key;
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  const [verificationCases, setVerificationCases] = useState<VerificationCase[]>(() => 
    verificationCaseService.getCasesForJurisdiction('Jharkhand', 'Dumka', 'Dumka Sadar', 'admin')
  );

  const [notifications, setNotifications] = useState<AppNotification[]>(() => 
    notificationService.getNotificationsForUser('XXXX-XXXX-9023', 'citizen')
  );

  const refreshNotifications = () => {
    setNotifications(notificationService.getNotificationsForUser(currentUser?.aadhaarMasked || 'XXXX-XXXX-9023', activeRole));
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Verification Case methods
  const getOfficerCases = (state?: string, district?: string, tehsil?: string, role?: UserRole): VerificationCase[] => {
    const s = state || selectedState;
    const d = district || selectedDistrict;
    const t = tehsil || selectedTehsil;
    const r = role || activeRole;
    return verificationCaseService.getCasesForJurisdiction(s, d, t, r);
  };

  const getCitizenCases = (aadhaarMasked?: string): VerificationCase[] => {
    return verificationCaseService.getCasesForCitizen(aadhaarMasked || currentUser?.aadhaarMasked || 'XXXX-XXXX-9023');
  };

  const submitNewCase = (data: {
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
    problemDetected: string;
    riskScore: number;
    riskLevel: RiskLevel;
    document?: LandDocument;
  }): VerificationCase => {
    const newCase = verificationCaseService.createVerificationCase(data);
    setVerificationCases([...verificationCaseService.getCasesForJurisdiction(selectedState, selectedDistrict, selectedTehsil, activeRole)]);
    addAuditLog({
      officerName: data.ownerName,
      officerRole: 'citizen',
      action: 'Document Uploaded',
      parcelId: data.parcelId,
      khasraNo: data.khasraNo,
      reason: `New verification case created: ${newCase.id} (${data.documentType}) - Risk Score: ${data.riskScore}/100`
    });
    return newCase;
  };

  const processOfficerDecision = (params: {
    caseId: string;
    officerName: string;
    officerRole: UserRole;
    decision: 'approve' | 'reject';
    reason?: string;
    evidenceNotes?: string;
  }) => {
    const res = verificationCaseService.processOfficerDecision(params);
    if (res.success && res.updatedCase) {
      setVerificationCases([...verificationCaseService.getCasesForJurisdiction(selectedState, selectedDistrict, selectedTehsil, activeRole)]);
      
      addAuditLog({
        officerName: params.officerName,
        officerRole: params.officerRole,
        action: params.decision === 'approve' ? 'Officer Verified' : 'Case Rejected',
        parcelId: res.updatedCase.parcelId,
        khasraNo: res.updatedCase.khasraNo,
        reason: params.reason || (params.decision === 'approve' ? 'Approved & forwarded to next verification stage' : 'Rejected for correction')
      });

      refreshNotifications();
    }
    return res;
  };

  const submitCaseAppeal = (params: {
    caseId: string;
    parcelId: string;
    appellantName: string;
    reason: string;
    description: string;
    supportingDocName?: string;
  }) => {
    const res = verificationCaseService.submitAppeal(params);
    if (res.success && res.updatedCase) {
      setVerificationCases([...verificationCaseService.getCasesForJurisdiction(selectedState, selectedDistrict, selectedTehsil, activeRole)]);
      addAuditLog({
        officerName: params.appellantName,
        officerRole: 'citizen',
        action: 'Case Escalated',
        parcelId: params.parcelId,
        reason: `Statutory appeal submitted #${res.appealId}: ${params.reason}`
      });
    }
    return res;
  };

  const submitSupportingDisputeDocument = (params: {
    caseId: string;
    parcelId: string;
    supportingDoc: {
      id: string;
      fileName: string;
      fileSize: string;
      fileType: string;
      uploadedAt: string;
      userNotes?: string;
      uploadedBy: string;
    };
  }) => {
    const res = verificationCaseService.submitSupportingDisputeDocument(params);
    if (res.success && res.updatedCase) {
      setVerificationCases([...verificationCaseService.getCasesForJurisdiction(selectedState, selectedDistrict, selectedTehsil, activeRole)]);
      addAuditLog({
        officerName: params.supportingDoc.uploadedBy,
        officerRole: 'citizen',
        action: 'Document Uploaded',
        parcelId: params.parcelId,
        reason: `Supporting document uploaded for dispute on #${params.caseId}: ${params.supportingDoc.fileName}`
      });
    }
    return res;
  };

  const resolveDisputeCase = (params: {
    caseId: string;
    outcome: 'Conflict Resolved' | 'Conflict Confirmed' | 'More Information Required' | 'Rejected' | 'Escalated';
    officerRemarks: string;
    officerName: string;
    officerRole: string;
  }) => {
    const res = verificationCaseService.resolveDisputeCase(params);
    if (res.success && res.updatedCase) {
      setVerificationCases([...verificationCaseService.getCasesForJurisdiction(selectedState, selectedDistrict, selectedTehsil, activeRole)]);
      addAuditLog({
        officerName: params.officerName,
        officerRole: params.officerRole as UserRole,
        action: params.outcome === 'Conflict Resolved' ? 'Officer Verified' : 'Case Rejected',
        parcelId: res.updatedCase.parcelId,
        reason: `Dispute Case #${params.caseId} Outcome: ${params.outcome}. Remarks: ${params.officerRemarks}`
      });
    }
    return res;
  };

  const getCaseByIdForOfficer = (
    id: string, 
    role?: UserRole, 
    state?: string, 
    district?: string, 
    tehsil?: string
  ) => {
    return verificationCaseService.getCaseByIdForOfficer(
      id, 
      role || activeRole, 
      state || selectedState, 
      district || selectedDistrict, 
      tehsil || selectedTehsil
    );
  };

  // Guided Demo Tour state
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  const selectedParcel = useMemo(() => {
    return parcels.find(p => p.parcelId === selectedParcelId || p.id === selectedParcelId || p.khasraNo === selectedParcelId) || parcels[0];
  }, [parcels, selectedParcelId]);

  const addAuditLog = (event: Omit<AuditEvent, 'id' | 'timestamp' | 'integrityHash'>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const hashData = `${timestamp}|${event.officerName}|${event.action}|${event.parcelId}|${event.reason}|${event.newStatus}`;
    const newLog: AuditEvent = {
      ...event,
      id: `aud-${Date.now()}`,
      timestamp,
      integrityHash: generateHash(hashData)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateParcelStatus = (parcelId: string, newStatus: ParcelStatus, actionReason: string) => {
    const target = parcels.find(p => p.parcelId === parcelId || p.id === parcelId);
    if (!target) return;

    const prevStatus = target.status;
    let actionLabel: AuditEvent['action'] = 'Validation Run';
    if (newStatus === 'field_verification_ordered') actionLabel = 'Officer Verified';
    else if (newStatus === 'verified') actionLabel = 'Officer Verified';
    else if (newStatus === 'in_dispute') actionLabel = 'Case Rejected';

    const officerMap: Record<UserRole, { name: string; role: string }> = {
      tehsildar: { name: 'S. N. Pandey', role: 'Tehsildar / Circle Officer' },
      patwari: { name: 'Anil Soren', role: 'Revenue Inspector / Patwari' },
      district_officer: { name: 'Rajeshwar Singh (IAS)', role: 'District Collector (Dumka)' },
      admin: { name: 'System Administrator', role: 'Revenue Department IT' },
      citizen: { name: 'Citizen Self-Service', role: 'Public Portal' }
    };

    const currentOfficer = officerMap[activeRole];

    setParcels(prev => prev.map(p => {
      if (p.parcelId === parcelId || p.id === parcelId) {
        return {
          ...p,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));

    addAuditLog({
      officerName: currentOfficer.name,
      officerRole: currentOfficer.role,
      action: actionLabel,
      parcelId: target.parcelId,
      khasraNo: target.khasraNo,
      reason: actionReason,
      previousStatus: prevStatus,
      newStatus
    });

    notificationService.notify({
      recipientAadhaar: 'XXXX-XXXX-9023',
      title: `Status Updated: Khasra ${target.khasraNo}`,
      desc: `Action: ${actionLabel} by ${currentOfficer.name}. Status: ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
      type: 'success',
      parcelId: target.parcelId,
      actionTab: 'track-progress'
    });
    refreshNotifications();
  };

  const runValidationForParcel = (parcelId: string) => {
    setParcels(prev => prev.map(p => {
      if (p.parcelId === parcelId || p.id === parcelId) {
        const val = runCrossRecordValidation(p, prev);
        const risk = calculateParcelRiskAssessment(p, prev);
        return {
          ...p,
          validationResults: val.conflicts,
          riskAssessment: risk,
          riskScore: risk.overallScore,
          qualityScore: risk.qualityScore,
          riskLevel: risk.riskLevel,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const addDocumentToParcel = (parcelId: string, doc: LandDocument) => {
    setParcels(prev => prev.map(p => {
      if (p.parcelId === parcelId || p.id === parcelId) {
        const updatedDocs = [doc, ...p.documents];
        const updatedParcel = { ...p, documents: updatedDocs };
        const val = runCrossRecordValidation(updatedParcel, prev);
        const risk = calculateParcelRiskAssessment(updatedParcel, prev);
        return {
          ...updatedParcel,
          validationResults: val.conflicts,
          riskAssessment: risk,
          riskScore: risk.overallScore,
          qualityScore: risk.qualityScore,
          riskLevel: risk.riskLevel,
          lastUpdated: new Date().toISOString()
        };
      }
      return p;
    }));

    addAuditLog({
      officerName: activeRole === 'patwari' ? 'Anil Soren' : 'S. N. Pandey',
      officerRole: activeRole,
      action: 'Document Uploaded',
      parcelId,
      documentId: doc.id,
      khasraNo: doc.parcelId.split('-').pop() || '',
      reason: `Uploaded ${doc.docType} (#${doc.docNumber}) with SHA-256 integrity digest.`
    });
  };

  const updateDocumentMetadata = (docId: string, updates: Partial<LandDocument>) => {
    setParcels(prev => prev.map(p => {
      const docIdx = p.documents.findIndex(d => d.id === docId);
      if (docIdx >= 0) {
        const updatedDocs = [...p.documents];
        updatedDocs[docIdx] = { ...updatedDocs[docIdx], ...updates };
        return { ...p, documents: updatedDocs };
      }
      return p;
    }));

    addAuditLog({
      officerName: 'S. N. Pandey',
      officerRole: activeRole,
      action: 'Document Metadata Updated',
      parcelId: selectedParcelId,
      documentId: docId,
      khasraNo: selectedParcel.khasraNo,
      reason: `Updated document metadata for #${docId}.`
    });
  };

  const recordAiCorrection = (correction: {
    documentId: string;
    parcelId: string;
    fieldKey: string;
    fieldLabel: string;
    aiValue: string;
    correctedValue: string;
    language?: SupportedLanguage;
    notes?: string;
  }) => {
    const officerMap: Record<UserRole, { name: string; role: string }> = {
      tehsildar: { name: 'S. N. Pandey (Tehsildar)', role: 'tehsildar' },
      patwari: { name: 'Anil Soren (Revenue Inspector)', role: 'patwari' },
      district_officer: { name: 'Rajeshwar Singh (IAS)', role: 'district_officer' },
      admin: { name: 'System Admin', role: 'admin' },
      citizen: { name: 'Citizen', role: 'citizen' }
    };
    const off = officerMap[activeRole];

    const saved = saveFeedbackCorrection({
      ...correction,
      verifiedBy: off.name,
      officerRole: off.role
    });

    setFeedbackRecords(prev => [saved, ...prev]);

    // Also update field on parcel if applicable
    setParcels(prev => prev.map(p => {
      if (p.parcelId === correction.parcelId || p.id === correction.parcelId) {
        if (correction.fieldKey === 'ownerName') {
          return { ...p, owner: correction.correctedValue };
        }
      }
      return p;
    }));

    addAuditLog({
      officerName: off.name,
      officerRole: off.role,
      action: 'Field Corrected',
      parcelId: correction.parcelId,
      documentId: correction.documentId,
      khasraNo: correction.parcelId.split('-').pop() || '',
      oldValue: correction.aiValue,
      newValue: correction.correctedValue,
      reason: `AI correction recorded: ${correction.fieldLabel} corrected from "${correction.aiValue}" to "${correction.correctedValue}". Stored in training feedback dataset.`
    });
  };

  const hasPermission = (action: 'view' | 'upload' | 'verify' | 'admin' | 'export'): boolean => {
    if (activeRole === 'admin') return true;
    if (action === 'view') return true;
    if (action === 'upload') return activeRole === 'patwari' || activeRole === 'tehsildar';
    if (action === 'verify') return activeRole === 'tehsildar' || activeRole === 'district_officer';
    if (action === 'export') return activeRole !== 'citizen';
    return false;
  };

  const startDemoTour = () => {
    setIsDemoTourActive(true);
    setDemoStep(1);
    setActiveTab('digitization');
  };

  const nextDemoStep = () => {
    setDemoStep(prev => {
      const next = Math.min(18, prev + 1);
      syncTabWithDemoStep(next);
      return next;
    });
  };

  const prevDemoStep = () => {
    setDemoStep(prev => {
      const back = Math.max(1, prev - 1);
      syncTabWithDemoStep(back);
      return back;
    });
  };

  const endDemoTour = () => {
    setIsDemoTourActive(false);
  };

  const goToDemoStep = (step: number) => {
    setDemoStep(step);
    syncTabWithDemoStep(step);
  };

  const syncTabWithDemoStep = (step: number) => {
    switch (step) {
      case 1:
      case 2:
      case 3:
      case 4:
        setActiveTab('digitization');
        break;
      case 5:
      case 6:
        setSelectedParcelId('JH-DMK-RMP-2024-0125');
        setActiveTab('gis');
        break;
      case 7:
      case 8:
      case 9:
        setActiveTab('validation');
        break;
      case 10:
      case 11:
        setActiveTab('twin');
        break;
      case 12:
      case 13:
        setActiveTab('queue');
        break;
      case 14:
      case 15:
        setActiveTab('learning');
        break;
      case 16:
        setActiveTab('integrations');
        break;
      case 17:
        setActiveTab('audit');
        break;
      case 18:
        setActiveTab('sih-coverage');
        break;
      default:
        break;
    }
  };

  const loginUser = (user: AuthUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveRole(user.role);
    if (user.jurisdiction?.district) {
      setSelectedDistrict(user.jurisdiction.district);
    }
    if (user.jurisdiction?.tehsil) {
      setSelectedTehsil(user.jurisdiction.tehsil);
    }
    if (user.jurisdiction?.state) {
      setSelectedState(user.jurisdiction.state);
    }
    try {
      sessionStorage.setItem('bhulekh_user_session', JSON.stringify(user));
      localStorage.setItem('bhulekh_auth_token', `tok_${Date.now()}_${user.id}`);
    } catch (e) {
      console.error('Session persistence error:', e);
    }
  };

  const logoutUser = () => {
    // 1. Clear current authentication/session state
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveRole('citizen');

    // 2. Clear location context
    setSelectedState('Jharkhand');
    setSelectedDistrict('Dumka');
    setSelectedTehsil('Dumka Sadar');

    // 3. Clear temporary OTP and session caches
    try {
      sessionStorage.clear();
      localStorage.removeItem('bhulekh_user_session');
      localStorage.removeItem('bhulekh_auth_token');
      localStorage.removeItem('bhulekh_otp_session');
      localStorage.removeItem('bhulekh_temp_otp');
    } catch (e) {
      console.error('Storage clear error:', e);
    }

    // 4. Redirect directly to Sign In / Login page
    setActiveTab('signin');

    // 5. Replace browser history state to prevent Back button access
    try {
      window.history.replaceState({ tab: 'signin' }, '', window.location.pathname);
    } catch (e) {}
  };

  const markNotificationRead = (id: string) => {
    notificationService.markAsRead(id);
    refreshNotifications();
  };

  const markAllNotificationsRead = () => {
    notificationService.markAllAsRead(currentUser?.aadhaarMasked || 'XXXX-XXXX-9023', activeRole);
    refreshNotifications();
  };

  const deleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
    refreshNotifications();
  };

  const clearAllNotifications = () => {
    notificationService.clearAll(currentUser?.aadhaarMasked || 'XXXX-XXXX-9023');
    refreshNotifications();
  };

  return (
    <AppContext.Provider
      value={{
        parcels,
        selectedParcelId,
        selectedParcel,
        setSelectedParcelId,
        activeRole,
        setActiveRole,
        currentUser,
        isAuthenticated,
        loginUser,
        logoutUser,
        selectedState,
        setSelectedState,
        selectedDistrict,
        selectedTehsil,
        setSelectedDistrict,
        setSelectedTehsil,
        activeTab,
        setActiveTab,
        auditLogs,
        addAuditLog,
        updateParcelStatus,
        runValidationForParcel,
        addDocumentToParcel,
        updateDocumentMetadata,
        feedbackRecords,
        recordAiCorrection,
        isSearchOpen,
        setIsSearchOpen,
        verificationCases,
        getOfficerCases,
        getCitizenCases,
        submitNewCase,
        processOfficerDecision,
        submitCaseAppeal,
        submitSupportingDisputeDocument,
        resolveDisputeCase,
        getCaseByIdForOfficer,
        isDemoTourActive,
        demoStep,
        startDemoTour,
        nextDemoStep,
        prevDemoStep,
        endDemoTour,
        goToDemoStep,
        selectedTrackCaseId,
        setSelectedTrackCaseId,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        refreshNotifications,
        hasPermission,
        govLanguage,
        setGovLanguage,
        isRtl,
        t,
        fontScale,
        setFontScale,
        isHighContrast,
        toggleHighContrast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
