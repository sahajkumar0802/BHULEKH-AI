export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ParcelStatus = 'verified' | 'needs_review' | 'high_risk' | 'critical' | 'in_dispute' | 'field_verification_ordered';
export type LandType = 'Agricultural' | 'Residential' | 'Commercial' | 'Forest/Gochar' | 'Industrial' | 'Government/Anabad';
export type UserRole = 'citizen' | 'patwari' | 'tehsildar' | 'district_officer' | 'admin';

export type SupportedLanguage = 
  | 'Hindi' 
  | 'English' 
  | 'Bengali' 
  | 'Marathi' 
  | 'Tamil' 
  | 'Telugu' 
  | 'Kannada' 
  | 'Gujarati' 
  | 'Odia' 
  | 'Punjabi';

export type ScriptType = 
  | 'Devanagari' 
  | 'Latin' 
  | 'Bengali' 
  | 'Tamil' 
  | 'Telugu' 
  | 'Kannada' 
  | 'Gujarati' 
  | 'Odia' 
  | 'Gurmukhi';

export type DocumentClassificationType = 
  | 'Record of Rights (RoR / Jamabandi)'
  | 'Mutation Order (Dakhil-Kharij)'
  | 'Registered Sale Deed (Kewala)'
  | 'Cadastral Map (Bhu-Naksha)'
  | 'Khatiyan (Tenancy Record)'
  | 'Conversion Certificate'
  | 'LPC (Land Possession Certificate)'
  | 'Lease Record'
  | 'Survey Record'
  | 'Registration Record'
  | 'Other';

export type DocumentType = DocumentClassificationType;

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // [lng, lat]
}

export interface ExtractedField {
  label: string;
  key: string;
  value: string;
  confidence: number; // 0 - 100
  confidenceTier?: 'high' | 'medium' | 'review'; // >=90 high, 75-89 medium, <75 review
  isConflict?: boolean;
  notes?: string;
}

export interface LandDocument {
  id: string;
  parcelId: string;
  docType: DocumentClassificationType;
  docNumber: string;
  issueDate: string;
  issuingAuthority: string;
  language: SupportedLanguage | 'Bilingual (Hindi-English)';
  script?: ScriptType;
  ocrEngine?: string;
  ocrConfidence: number;
  classificationConfidence?: number;
  pageCount: number;
  fileSize: string;
  fileUrl?: string;
  sha256Hash?: string;
  integrityVerified?: boolean;
  extractedFields: ExtractedField[];
  uncertainFields?: ExtractedField[];
  rawSummary: string;
  uploadedAt: string;
  uploader?: string;
  status: 'processed' | 'flagged' | 'pending' | 'verified';
  ocrMode?: 'Demo OCR' | 'Production OCR Integration Ready';
}

export interface MutationRecord {
  id: string;
  mutationNo: string;
  khasraNo: string;
  khataNo: string;
  transferor: string; // Seller/Previous
  transferee: string; // Buyer/New
  date: string;
  natureOfTransfer: 'Sale' | 'Inheritance (Wirasat)' | 'Gift' | 'Partition';
  status: 'Sanctioned' | 'Disputed' | 'Pending' | 'Rejected';
  orderingOfficer: string;
  remarks: string;
}

export interface RegistrationRecord {
  id: string;
  registrationNo: string;
  deedType: 'Sale Deed' | 'Gift Deed' | 'Relinquishment' | 'Partition';
  subRegistrarOffice: string;
  executionDate: string;
  stampDutyPaid: number;
  marketValue: number;
  sellerName: string;
  buyerName: string;
  khasraNo: string;
  areaAcres: number;
  status: 'Registered' | 'Under Investigation' | 'Duplicate Flagged';
}

export interface ValidationConflict {
  id: string;
  category: 
    | 'Owner Consistency' 
    | 'Area Consistency' 
    | 'Khasra Consistency' 
    | 'Plot Number Consistency'
    | 'Village Consistency' 
    | 'District Consistency'
    | 'Mutation Consistency' 
    | 'Registration Consistency' 
    | 'Spatial Consistency' 
    | 'Duplicate Detection' 
    | 'Historical Chain';
  fieldName: string;
  recordAValue: string;
  recordBValue: string;
  sourceA: string;
  sourceB: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Match';
  isMismatch: boolean;
  explanation: string;
  suggestedAction: string;
}

export interface DuplicateMatch {
  id: string;
  originalDocNumber: string;
  duplicateDocNumber: string;
  originalParcelId: string;
  duplicateParcelId: string;
  matchType: 'Exact Registration Number' | 'Owner + Khasra Collision' | 'File Hash Duplicate' | 'Near-Duplicate Metadata';
  similarityPercentage: number;
  reason: string;
  detectedAt: string;
  severity: 'Critical' | 'High' | 'Medium';
}

export interface RiskFactor {
  factor: string;
  weight: number;
  points: number;
  reason: string;
  source: string;
}

export interface RiskAssessment {
  overallScore: number; // 0 - 100
  qualityScore: number; // 0 - 100 (Record Quality/Completeness)
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  explainableSummary: string;
  topReasons: string[];
  recommendedOfficerAction: string;
  lastAssessedAt: string;
}

export interface OwnershipHistoryEvent {
  year: string;
  date: string;
  ownerName: string;
  eventType: 'Initial Settlement / Khatiyan' | 'Wirasat (Inheritance)' | 'Sale Deed Registration' | 'Mutation Sanctioned' | 'Partition' | 'Current RoR' | 'AI Cross-Check Flag';
  sourceDoc: string;
  docNumber: string;
  transferDetails: string;
  verified: boolean;
  notes?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  officerName: string;
  officerRole: string;
  action: 
    | 'Document Uploaded' 
    | 'OCR Processed' 
    | 'Field Extracted' 
    | 'Field Corrected' 
    | 'Validation Run' 
    | 'Risk Updated' 
    | 'Officer Verified' 
    | 'Case Rejected' 
    | 'Case Escalated'
    | 'Batch Verified'
    | 'Document Metadata Updated' 
    | 'Integration Called';
  parcelId: string;
  documentId?: string;
  khasraNo?: string;
  oldValue?: string;
  newValue?: string;
  reason: string;
  previousStatus?: ParcelStatus;
  newStatus?: ParcelStatus;
  integrityHash: string; // Simulated SHA-256
}

export interface AiCorrectionFeedback {
  id: string;
  documentId: string;
  parcelId: string;
  fieldKey: string;
  fieldLabel: string;
  aiValue: string;
  correctedValue: string;
  language: SupportedLanguage;
  documentType: DocumentClassificationType;
  confidence: number;
  verifiedBy: string;
  officerRole: string;
  timestamp: string;
  appliedToRetrainingDataset: boolean;
  notes?: string;
}

export interface LandParcel {
  id: string;
  parcelId: string; // e.g., JH-DMK-RMP-2024-0125
  khasraNo: string;
  khataNo: string;
  plotNo?: string;
  surveyNo?: string;
  thanaNo: string;
  touziNo?: string;
  ulpin?: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  owner: string;
  fatherHusbandName: string;
  coOwners?: string[];
  areaRoR: number; // in acres
  areaGIS: number; // in acres
  landType: LandType;
  marketRatePerAcre?: number; // INR
  riskScore: number; // 0 - 100
  qualityScore: number; // 0 - 100
  riskLevel: RiskLevel;
  status: ParcelStatus;
  geometry: GeoPolygon;
  documents: LandDocument[];
  mutations: MutationRecord[];
  registrations?: RegistrationRecord[];
  validationResults: ValidationConflict[];
  duplicateMatches?: DuplicateMatch[];
  riskAssessment: RiskAssessment;
  timeline: OwnershipHistoryEvent[];
  lastUpdated: string;
}

export interface VillageStats {
  village: string;
  tehsil: string;
  totalParcels: number;
  verifiedParcels: number;
  highRiskParcels: number;
  criticalParcels: number;
  averageQualityScore: number;
}

export interface StateDigitizationStat {
  stateName: string;
  code: string;
  digitizedPercent: number;
  totalParcels: number;
  verifiedParcels: number;
  pendingCases: number;
  errorRatePercent: number;
  isPrototypeFocus: boolean;
}

export interface DistrictDigitizationStat {
  districtName: string;
  state: string;
  totalDocuments: number;
  digitizedCount: number;
  validatedCount: number;
  pendingVerificationCount: number;
  errorCount: number;
  averageConfidencePercent: number;
}

export interface GovernmentConnector {
  id: string;
  name: string;
  acronym: string;
  category: 'Land Records' | 'Registration' | 'Cadastral GIS' | 'Judicial' | 'Identity';
  description: string;
  status: 'Mock / Prototype Connector' | 'Integration Ready' | 'Connected to Prototype GIS' | 'Production Integration Required';
  endpoint: string;
  authType: 'mTLS / OAuth2' | 'API Key / JWT' | 'HMAC Signature';
  latencyMs: number;
  lastSync: string;
  version: string;
  adapterClass: string;
}

export interface ApiRouteDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  category: 'Parcels' | 'Documents' | 'OCR & Extraction' | 'Validation' | 'Risk' | 'Audit' | 'Feedback';
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  sampleRequest?: Record<string, unknown>;
  sampleResponse: Record<string, unknown>;
}
