import { 
  LandParcel, 
  LandDocument, 
  StateDigitizationStat, 
  DistrictDigitizationStat, 
  GovernmentConnector, 
  AiCorrectionFeedback,
  ApiRouteDoc 
} from '../types/landRecord';

// ==========================================
// 1. STATE-WISE DIGITIZATION PROGRESS (10 STATES)
// ==========================================
export const STATE_DIGITIZATION_STATS: StateDigitizationStat[] = [
  { stateName: 'Jharkhand', code: 'JH', digitizedPercent: 82.4, totalParcels: 14200000, verifiedParcels: 11700800, pendingCases: 21510, errorRatePercent: 3.4, isPrototypeFocus: true },
  { stateName: 'Bihar', code: 'BR', digitizedPercent: 76.1, totalParcels: 18900000, verifiedParcels: 14382900, pendingCases: 48900, errorRatePercent: 4.8, isPrototypeFocus: false },
  { stateName: 'West Bengal', code: 'WB', digitizedPercent: 89.3, totalParcels: 21500000, verifiedParcels: 19199500, pendingCases: 18400, errorRatePercent: 2.1, isPrototypeFocus: false },
  { stateName: 'Odisha', code: 'OD', digitizedPercent: 71.8, totalParcels: 12400000, verifiedParcels: 8903200, pendingCases: 34100, errorRatePercent: 5.2, isPrototypeFocus: false },
  { stateName: 'Maharashtra', code: 'MH', digitizedPercent: 93.2, totalParcels: 29800000, verifiedParcels: 27773600, pendingCases: 12100, errorRatePercent: 1.8, isPrototypeFocus: false },
  { stateName: 'Tamil Nadu', code: 'TN', digitizedPercent: 88.5, totalParcels: 17200000, verifiedParcels: 15222000, pendingCases: 19800, errorRatePercent: 2.3, isPrototypeFocus: false },
  { stateName: 'Karnataka', code: 'KA', digitizedPercent: 85.0, totalParcels: 16100000, verifiedParcels: 13685000, pendingCases: 24500, errorRatePercent: 2.9, isPrototypeFocus: false },
  { stateName: 'Gujarat', code: 'GJ', digitizedPercent: 90.7, totalParcels: 19400000, verifiedParcels: 17595800, pendingCases: 14300, errorRatePercent: 1.9, isPrototypeFocus: false },
  { stateName: 'Punjab', code: 'PB', digitizedPercent: 84.6, totalParcels: 8900000, verifiedParcels: 7529400, pendingCases: 11200, errorRatePercent: 3.1, isPrototypeFocus: false },
  { stateName: 'Telangana', code: 'TS', digitizedPercent: 87.2, totalParcels: 11200000, verifiedParcels: 9766400, pendingCases: 16700, errorRatePercent: 2.5, isPrototypeFocus: false }
];

// ==========================================
// 2. DISTRICT-WISE PROGRESS (JHARKHAND DRILLDOWN)
// ==========================================
export const DISTRICT_DIGITIZATION_STATS: DistrictDigitizationStat[] = [
  { districtName: 'Dumka', state: 'Jharkhand', totalDocuments: 125430, digitizedCount: 108370, validatedCount: 98220, pendingVerificationCount: 21510, errorCount: 4832, averageConfidencePercent: 91.4 },
  { districtName: 'Deoghar', state: 'Jharkhand', totalDocuments: 98400, digitizedCount: 82100, validatedCount: 75300, pendingVerificationCount: 16800, errorCount: 3910, averageConfidencePercent: 89.8 },
  { districtName: 'Ranchi', state: 'Jharkhand', totalDocuments: 245000, digitizedCount: 228000, validatedCount: 214500, pendingVerificationCount: 23500, errorCount: 6200, averageConfidencePercent: 94.2 },
  { districtName: 'Dhanbad', state: 'Jharkhand', totalDocuments: 164000, digitizedCount: 142000, validatedCount: 131000, pendingVerificationCount: 21000, errorCount: 5100, averageConfidencePercent: 90.5 },
  { districtName: 'Bokaro', state: 'Jharkhand', totalDocuments: 112000, digitizedCount: 99400, validatedCount: 92100, pendingVerificationCount: 14200, errorCount: 3400, averageConfidencePercent: 92.1 },
  { districtName: 'Giridih', state: 'Jharkhand', totalDocuments: 135000, digitizedCount: 109000, validatedCount: 98400, pendingVerificationCount: 24100, errorCount: 5800, averageConfidencePercent: 88.6 },
  { districtName: 'Jamtara', state: 'Jharkhand', totalDocuments: 72000, digitizedCount: 58400, validatedCount: 51900, pendingVerificationCount: 13800, errorCount: 2900, averageConfidencePercent: 89.2 }
];

// ==========================================
// 3. ERROR CATEGORIES & ANALYTICS
// ==========================================
export const ERROR_ANALYTICS_DATA = [
  { category: 'Owner Mismatch', count: 1420, percentage: 29.4, severity: 'Critical', description: 'Discrepancy in owner/co-sharer names across RoR, Deed, or Mutation.' },
  { category: 'Area Discrepancy', count: 980, percentage: 20.3, severity: 'High', description: 'Deviation exceeding 2% between textual RoR acreage and GIS cadastral polygon.' },
  { category: 'Low OCR Confidence', count: 740, percentage: 15.3, severity: 'Medium', description: 'Aged, torn, or low-resolution scans yielding field confidence below 75%.' },
  { category: 'Duplicate Document', count: 520, percentage: 10.8, severity: 'Critical', description: 'Same deed or mutation registration number linked to distinct parcels.' },
  { category: 'Spatial Overlap', count: 480, percentage: 9.9, severity: 'High', description: 'Cadastral polygon overlaps with forest, water body, or Gochar land.' },
  { category: 'Khasra / Plot Mismatch', count: 390, percentage: 8.1, severity: 'High', description: 'Khasra or Plot number inconsistency across revenue registers.' },
  { category: 'Missing Mandatory Field', count: 180, percentage: 3.7, severity: 'Medium', description: 'Missing Thana number, Touzi number, or father name in legacy scans.' },
  { category: 'Historical Chain Discontinuity', count: 122, percentage: 2.5, severity: 'Medium', description: 'Gap in mutation provenance between 1968 Khatiyan and present RoR.' }
];

// ==========================================
// 4. FIELD-WISE & LANGUAGE ACCURACY (EVALUATION METRICS)
// ==========================================
export const FIELD_ACCURACY_STATS = [
  { field: 'Owner Name', accuracy: 97.2, sampleCount: 125430 },
  { field: 'Khasra Number', accuracy: 95.8, sampleCount: 125430 },
  { field: 'Village / Mauza', accuracy: 98.4, sampleCount: 125430 },
  { field: 'District / State', accuracy: 99.1, sampleCount: 125430 },
  { field: 'Area (Acres / Dismil)', accuracy: 91.6, sampleCount: 125430 },
  { field: 'Registration Number', accuracy: 93.4, sampleCount: 98200 },
  { field: 'Mutation Number', accuracy: 84.1, sampleCount: 88400 },
  { field: 'Father / Spouse Name', accuracy: 92.8, sampleCount: 125430 },
  { field: 'Survey Number', accuracy: 88.7, sampleCount: 74200 },
  { field: 'ULPIN', accuracy: 96.5, sampleCount: 42100 }
];

export const LANGUAGE_ACCURACY_STATS = [
  { language: 'Hindi', script: 'Devanagari', accuracy: 93.8, sampleCount: 65400 },
  { language: 'English', script: 'Latin', accuracy: 97.4, sampleCount: 38200 },
  { language: 'Bengali', script: 'Bengali', accuracy: 91.2, sampleCount: 12400 },
  { language: 'Marathi', script: 'Devanagari', accuracy: 92.5, sampleCount: 8100 },
  { language: 'Tamil', script: 'Tamil', accuracy: 90.1, sampleCount: 4200 },
  { language: 'Telugu', script: 'Telugu', accuracy: 89.6, sampleCount: 3800 },
  { language: 'Gujarati', script: 'Gujarati', accuracy: 91.8, sampleCount: 2900 },
  { language: 'Kannada', script: 'Kannada', accuracy: 88.9, sampleCount: 2100 },
  { language: 'Odia', script: 'Odia', accuracy: 90.4, sampleCount: 1800 },
  { language: 'Punjabi', script: 'Gurmukhi', accuracy: 92.1, sampleCount: 1500 }
];

// ==========================================
// 5. GOVERNMENT CONNECTORS (LRMS / DILRMP / NGDRS)
// ==========================================
export const GOVERNMENT_CONNECTORS: GovernmentConnector[] = [
  {
    id: 'conn-dilrmp',
    name: 'Digital India Land Records Modernization Programme',
    acronym: 'DILRMP Core Gateway',
    category: 'Land Records',
    description: 'National centralized land record synchronization protocol and unified ULPIN lookup.',
    status: 'Integration Ready',
    endpoint: 'https://dilrmp.gov.in/api/v2/national-registry',
    authType: 'mTLS / OAuth2',
    latencyMs: 42,
    lastSync: '2026-09-06 23:45:10',
    version: 'v2.4.1-gov',
    adapterClass: 'dilrmpAdapter'
  },
  {
    id: 'conn-jharbhoomi',
    name: 'State LRMS (Jharbhoomi / RoR Portal)',
    acronym: 'JharBhoomi LRMS',
    category: 'Land Records',
    description: 'State-level Record of Rights, Jamabandi registry, and online Khatiyan retrieval.',
    status: 'Mock / Prototype Connector',
    endpoint: 'https://jharbhoomi.jharkhand.gov.in/api/ror-service',
    authType: 'API Key / JWT',
    latencyMs: 38,
    lastSync: '2026-09-06 23:50:22',
    version: 'v3.1.0-state',
    adapterClass: 'landRecordAdapter'
  },
  {
    id: 'conn-bhunaksha',
    name: 'National Informatics Centre Bhu-Naksha GIS',
    acronym: 'NIC Bhu-Naksha',
    category: 'Cadastral GIS',
    description: 'Cadastral map vector polygons, geo-referenced spatial layers, and parcel subdivision shapes.',
    status: 'Connected to Prototype GIS',
    endpoint: 'https://bhunaksha.gov.in/wfs/cadastral-service',
    authType: 'HMAC Signature',
    latencyMs: 65,
    lastSync: '2026-09-07 00:10:04',
    version: 'v4.0.2-geo',
    adapterClass: 'gisAdapter'
  },
  {
    id: 'conn-ngdrs',
    name: 'National Generic Document Registration System',
    acronym: 'NGDRS Sub-Registrar',
    category: 'Registration',
    description: 'Sub-registrar sale deeds, e-stamp verifications, and property valuation indices.',
    status: 'Integration Ready',
    endpoint: 'https://ngdrs.gov.in/api/v1/registered-deeds',
    authType: 'mTLS / OAuth2',
    latencyMs: 51,
    lastSync: '2026-09-06 22:30:15',
    version: 'v2.0.0-ngdrs',
    adapterClass: 'registrationAdapter'
  },
  {
    id: 'conn-dakhil-kharij',
    name: 'Online Mutation Management System',
    acronym: 'E-Mutation Portal',
    category: 'Land Records',
    description: 'Tracking Dakhil-Kharij petitions, public notice generation, and Circle Officer sanctions.',
    status: 'Mock / Prototype Connector',
    endpoint: 'https://revenue.jharkhand.gov.in/api/mutations',
    authType: 'API Key / JWT',
    latencyMs: 44,
    lastSync: '2026-09-06 23:15:00',
    version: 'v1.8.4',
    adapterClass: 'mutationAdapter'
  },
  {
    id: 'conn-ecourts',
    name: 'e-Courts Land Dispute Registry',
    acronym: 'e-Courts NJDG',
    category: 'Judicial',
    description: 'Cross-checks pending civil land disputes, stay orders, and title suits in District Courts.',
    status: 'Production Integration Required',
    endpoint: 'https://ecourts.gov.in/api/v1/cases/land-title',
    authType: 'API Key / JWT',
    latencyMs: 89,
    lastSync: '2026-09-06 18:00:00',
    version: 'v1.2.0',
    adapterClass: 'eCourtsAdapter'
  }
];

// ==========================================
// 6. INITIAL AI LEARNING FEEDBACK DATASET
// ==========================================
export const INITIAL_AI_LEARNING_FEEDBACK: AiCorrectionFeedback[] = [
  {
    id: 'FB-2026-001',
    documentId: 'DOC-DMK-125-01',
    parcelId: 'JH-DMK-RMP-2024-0125',
    fieldKey: 'ownerName',
    fieldLabel: 'Owner Name',
    aiValue: 'Rakesh Kumar',
    correctedValue: 'Rajesh Kumar',
    language: 'Hindi',
    documentType: 'Record of Rights (RoR / Jamabandi)',
    confidence: 68,
    verifiedBy: 'S. N. Pandey (Tehsildar)',
    officerRole: 'tehsildar',
    timestamp: '2026-09-06 14:22:18',
    appliedToRetrainingDataset: true,
    notes: 'Devanagari OCR misread "जे" (Ja) as "के" (Ka) due to ink smudge on line 4.'
  },
  {
    id: 'FB-2026-002',
    documentId: 'DOC-DMK-218-01',
    parcelId: 'JH-DMK-LAK-2024-0218',
    fieldKey: 'mutationNo',
    fieldLabel: 'Mutation Number',
    aiValue: 'MUT-2020-0012',
    correctedValue: 'MUT-2020-0112',
    language: 'Hindi',
    documentType: 'Mutation Order (Dakhil-Kharij)',
    confidence: 71,
    verifiedBy: 'Anil Soren (Revenue Inspector)',
    officerRole: 'patwari',
    timestamp: '2026-09-06 16:05:44',
    appliedToRetrainingDataset: true,
    notes: 'Numeral 1 was partially faded in rubber stamp imprint.'
  },
  {
    id: 'FB-2026-003',
    documentId: 'DOC-DMK-341-01',
    parcelId: 'JH-DMK-MAD-2024-0341',
    fieldKey: 'area',
    fieldLabel: 'Area (Acres)',
    aiValue: '3.10',
    correctedValue: '3.18',
    language: 'English',
    documentType: 'Registered Sale Deed (Kewala)',
    confidence: 74,
    verifiedBy: 'S. N. Pandey (Tehsildar)',
    officerRole: 'tehsildar',
    timestamp: '2026-09-06 17:30:10',
    appliedToRetrainingDataset: true,
    notes: 'Numeral 8 was read as 0 due to low resolution scanning artifact.'
  }
];

// ==========================================
// 7. REST API ROUTES DOCUMENTATION (17 ENDPOINTS)
// ==========================================
export const API_ROUTES_DOCUMENTATION: ApiRouteDoc[] = [
  {
    method: 'GET',
    path: '/api/parcels',
    summary: 'List all digital land parcels',
    category: 'Parcels',
    description: 'Retrieves a paginated list of land parcels with GIS boundaries, owner info, and risk ratings.',
    sampleResponse: {
      total: 108,
      page: 1,
      limit: 20,
      parcels: [
        { parcelId: 'JH-DMK-RMP-2024-0125', khasraNo: '125', village: 'Rampur', owner: 'Rajesh Kumar', riskScore: 91, status: 'critical' }
      ]
    }
  },
  {
    method: 'GET',
    path: '/api/parcels/:id',
    summary: 'Get 360° Digital Land Twin',
    category: 'Parcels',
    description: 'Fetches the complete Digital Land Twin dossier including GIS coordinates, mutations, and validation matrix.',
    parameters: [{ name: 'id', type: 'string', required: true, description: 'Unique Parcel ID or Khasra Number' }],
    sampleResponse: {
      parcelId: 'JH-DMK-RMP-2024-0125',
      khasraNo: '125',
      khataNo: '42',
      owner: 'Rajesh Kumar',
      areaRoR: 2.40,
      areaGIS: 2.47,
      riskScore: 91,
      qualityScore: 68
    }
  },
  {
    method: 'GET',
    path: '/api/documents',
    summary: 'Query secure document repository',
    category: 'Documents',
    description: 'Fetches uploaded deeds, Khatiyans, and RoR records with cryptographic SHA-256 hashes.',
    sampleResponse: {
      count: 240,
      documents: [
        { id: 'DOC-DMK-125-01', docType: 'Record of Rights (RoR / Jamabandi)', sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', integrityVerified: true }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/documents/upload',
    summary: 'Upload land document for AI processing',
    category: 'Documents',
    description: 'Accepts PDF, JPG, or PNG files, computes SHA-256 hash, and schedules OCR pipeline.',
    sampleRequest: { filename: 'Jamabandi_Khasra_125.pdf', fileSize: '2.4MB', uploaderRole: 'patwari' },
    sampleResponse: { success: true, documentId: 'DOC-UPLOAD-9921', sha256Hash: 'a718293b4e9f...', status: 'uploaded' }
  },
  {
    method: 'POST',
    path: '/api/ocr/process',
    summary: 'Run 10-language progressive OCR',
    category: 'OCR & Extraction',
    description: 'Executes language detection, script identification, and progressive text extraction.',
    sampleRequest: { documentId: 'DOC-DMK-125-01', languageOverride: 'Hindi' },
    sampleResponse: { language: 'Hindi', script: 'Devanagari', ocrConfidence: 94, extractedWords: 412, mode: 'Demo OCR' }
  },
  {
    method: 'POST',
    path: '/api/extraction',
    summary: 'Extract structured revenue entities',
    category: 'OCR & Extraction',
    description: 'Performs layout analysis and Named Entity Recognition (NER) for 16 standard revenue fields.',
    sampleResponse: {
      extractedFields: [
        { key: 'ownerName', label: 'Owner Name', value: 'Rajesh Kumar', confidence: 98, confidenceTier: 'high' },
        { key: 'mutationNo', label: 'Mutation Number', value: 'MUT-2020-0012', confidence: 71, confidenceTier: 'review' }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/validation/run',
    summary: 'Execute 4-way cross-database reconciliation',
    category: 'Validation',
    description: 'Cross-references RoR, Sub-Registrar Deed, Mutation, and Cadastral GIS data.',
    sampleRequest: { parcelId: 'JH-DMK-RMP-2024-0125' },
    sampleResponse: {
      conflictsFound: 3,
      conflicts: [
        { category: 'Owner Consistency', severity: 'Critical', explanation: 'RoR name "Rajesh Kumar" mismatches Deed name "Rakesh Kumar"' }
      ]
    }
  },
  {
    method: 'GET',
    path: '/api/risk',
    summary: 'Get deterministic risk assessment',
    category: 'Risk',
    description: 'Returns additive mathematical risk score (0-100) and natural language explainability.',
    sampleResponse: {
      overallScore: 91,
      riskLevel: 'critical',
      qualityScore: 68,
      factors: [{ factor: 'Owner Name Mismatch', points: 30, weight: 30 }]
    }
  },
  {
    method: 'POST',
    path: '/api/verification',
    summary: 'Submit human officer triage action',
    category: 'Validation',
    description: 'Records officer approval, rejection, or field re-survey order with SHA-256 audit signing.',
    sampleRequest: { parcelId: 'JH-DMK-RMP-2024-0125', action: 'Order Re-Survey', officerName: 'S. N. Pandey', reason: 'Verify boundary coordinates' },
    sampleResponse: { success: true, newStatus: 'field_verification_ordered', auditHash: '8f4c2810...' }
  },
  {
    method: 'POST',
    path: '/api/feedback',
    summary: 'Submit AI correction for training feedback dataset',
    category: 'Feedback',
    description: 'Captures human corrections to AI-extracted fields to enrich the model improvement pipeline.',
    sampleRequest: { documentId: 'DOC-DMK-125-01', fieldKey: 'ownerName', aiValue: 'Rakesh Kumar', correctedValue: 'Rajesh Kumar', officer: 'Tehsildar' },
    sampleResponse: { success: true, feedbackId: 'FB-2026-994', recordedForRetraining: true }
  }
];

// ==========================================
// 8. 100+ REALISTIC SYNTHETIC PARCELS DATASET
// ==========================================

const BASE_POLYGONS: number[][][] = [
  // Polygon 0: Rampur Central
  [[87.2450, 24.2650], [87.2475, 24.2652], [87.2472, 24.2678], [87.2448, 24.2675], [87.2450, 24.2650]],
  // Polygon 1: Lakshmipur North
  [[87.2510, 24.2710], [87.2538, 24.2714], [87.2534, 24.2740], [87.2506, 24.2736], [87.2510, 24.2710]],
  // Polygon 2: Madhopur East
  [[87.2600, 24.2580], [87.2628, 24.2584], [87.2624, 24.2612], [87.2596, 24.2608], [87.2600, 24.2580]],
  // Polygon 3: Haripur South
  [[87.2380, 24.2520], [87.2405, 24.2524], [87.2402, 24.2550], [87.2376, 24.2546], [87.2380, 24.2520]],
  // Polygon 4: Chandipur West
  [[87.2300, 24.2680], [87.2325, 24.2683], [87.2322, 24.2710], [87.2297, 24.2706], [87.2300, 24.2680]]
];

function generatePolygonForIndex(idx: number): { type: 'Polygon'; coordinates: number[][][] } {
  const base = BASE_POLYGONS[idx % BASE_POLYGONS.length];
  const shiftLat = ((idx % 7) - 3) * 0.0035;
  const shiftLng = ((Math.floor(idx / 7) % 7) - 3) * 0.0035;
  const coords = base.map(pt => [Number((pt[0] + shiftLng).toFixed(5)), Number((pt[1] + shiftLat).toFixed(5))]);
  return { type: 'Polygon', coordinates: [coords] };
}

const VILLAGES = ['Rampur', 'Lakshmipur', 'Madhopur', 'Haripur', 'Chandipur', 'Barmasia', 'Kathikund', 'Shikaripara', 'Raneshwar', 'Jama'];
const DISTRICTS = ['Dumka', 'Deoghar', 'Ranchi', 'Dhanbad', 'Bokaro', 'Giridih', 'Jamtara'];
const FIRST_NAMES = ['Rajesh', 'Suresh', 'Anita', 'Manoj', 'Pooja', 'Vikram', 'Dinesh', 'Sunita', 'Ramesh', 'Amit', 'Priya', 'Kavita', 'Sanjay', 'Rahul', 'Gita', 'Manish', 'Alok', 'Deepak', 'Geeta', 'Santosh'];
const LAST_NAMES = ['Kumar', 'Prasad', 'Devi', 'Sharma', 'Singh', 'Murmu', 'Hembrom', 'Marandi', 'Tudu', 'Soren', 'Verma', 'Yadav', 'Mishra', 'Pandey', 'Gupta', 'Banerjee', 'Ghosh', 'Das'];

export function generateSyntheticParcels(): LandParcel[] {
  const parcels: LandParcel[] = [];

  // ============================================
  // HERO PARCEL 1: KHASRA 125 (CRITICAL RISK 91)
  // Owner Name Mismatch + Area Discrepancy + Boundary Encroachment
  // ============================================
  parcels.push({
    id: 'p-125',
    parcelId: 'JH-DMK-RMP-2024-0125',
    khasraNo: '125',
    khataNo: '42',
    plotNo: '125/A',
    surveyNo: 'SUR-1968-042',
    thanaNo: '14',
    touziNo: '882',
    ulpin: '12-JH-DMK-RMP-0125',
    village: 'Rampur',
    tehsil: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    owner: 'Rajesh Kumar',
    fatherHusbandName: 'Late Birendra Kumar',
    coOwners: ['Ramesh Kumar (Brother)'],
    areaRoR: 2.40,
    areaGIS: 2.47,
    landType: 'Agricultural',
    marketRatePerAcre: 850000,
    riskScore: 91,
    qualityScore: 68,
    riskLevel: 'critical',
    status: 'critical',
    geometry: generatePolygonForIndex(0),
    lastUpdated: '2026-09-06 18:40:00',
    documents: [
      {
        id: 'DOC-DMK-125-01',
        parcelId: 'JH-DMK-RMP-2024-0125',
        docType: 'Record of Rights (RoR / Jamabandi)',
        docNumber: 'ROR-DMK-1988-421',
        issueDate: '1988-03-15',
        issuingAuthority: 'Circle Officer, Dumka Sadar',
        language: 'Hindi',
        script: 'Devanagari',
        ocrEngine: 'Tesseract OCR v5.3 + Indic NER',
        ocrConfidence: 94,
        classificationConfidence: 97,
        pageCount: 2,
        fileSize: '3.4 MB',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        integrityVerified: true,
        rawSummary: 'Jamabandi entry in Rampur Mauza showing Khata 42, Khasra 125 recorded under Rajesh Kumar.',
        uploadedAt: '2026-09-01 10:14:00',
        uploader: 'Anil Soren (Revenue Inspector)',
        status: 'flagged',
        ocrMode: 'Demo OCR',
        extractedFields: [
          { key: 'ownerName', label: 'Owner Name', value: 'Rajesh Kumar', confidence: 98, confidenceTier: 'high' },
          { key: 'fatherName', label: 'Father / Spouse Name', value: 'Birendra Kumar', confidence: 95, confidenceTier: 'high' },
          { key: 'khasraNo', label: 'Khasra Number', value: '125', confidence: 97, confidenceTier: 'high' },
          { key: 'khataNo', label: 'Khata Number', value: '42', confidence: 96, confidenceTier: 'high' },
          { key: 'village', label: 'Village / Mauza', value: 'Rampur', confidence: 98, confidenceTier: 'high' },
          { key: 'tehsil', label: 'Tehsil', value: 'Dumka Sadar', confidence: 97, confidenceTier: 'high' },
          { key: 'district', label: 'District', value: 'Dumka', confidence: 99, confidenceTier: 'high' },
          { key: 'state', label: 'State', value: 'Jharkhand', confidence: 99, confidenceTier: 'high' },
          { key: 'area', label: 'Area (Acres)', value: '2.40', confidence: 92, confidenceTier: 'high' },
          { key: 'landType', label: 'Land Type', value: 'Agricultural', confidence: 94, confidenceTier: 'high' },
          { key: 'mutationNo', label: 'Mutation Number', value: 'MUT-2020-0012', confidence: 71, confidenceTier: 'review', notes: 'Uncertain numeral' },
          { key: 'regNo', label: 'Registration Number', value: 'REG-2018-8831', confidence: 93, confidenceTier: 'high' },
          { key: 'docDate', label: 'Document Date', value: '1988-03-15', confidence: 91, confidenceTier: 'high' },
          { key: 'surveyNo', label: 'Survey Number', value: 'SUR-1968-042', confidence: 89, confidenceTier: 'medium' },
          { key: 'plotNo', label: 'Plot Number', value: '125/A', confidence: 93, confidenceTier: 'high' },
          { key: 'ulpin', label: 'ULPIN', value: '12-JH-DMK-RMP-0125', confidence: 95, confidenceTier: 'high' }
        ],
        uncertainFields: [
          { key: 'mutationNo', label: 'Mutation Number', value: 'MUT-2020-0012', confidence: 71, confidenceTier: 'review', notes: 'Low optical resolution on seal stamp imprint.' }
        ]
      },
      {
        id: 'DOC-DMK-125-02',
        parcelId: 'JH-DMK-RMP-2024-0125',
        docType: 'Registered Sale Deed (Kewala)',
        docNumber: 'REG-2018-8831',
        issueDate: '2018-06-20',
        issuingAuthority: 'Sub-Registrar Office, Dumka',
        language: 'English',
        script: 'Latin',
        ocrEngine: 'Tesseract OCR v5.3 + Legal NER',
        ocrConfidence: 96,
        classificationConfidence: 98,
        pageCount: 8,
        fileSize: '6.2 MB',
        sha256Hash: '4a53e990c884635a968a35fd41f71f65203fa8a385f0e9b9ec8cbbe95c6ab44c',
        integrityVerified: true,
        rawSummary: 'Deed executed showing buyer name as "Rakesh Kumar" instead of "Rajesh Kumar".',
        uploadedAt: '2026-09-02 11:20:00',
        uploader: 'S. N. Pandey (Tehsildar)',
        status: 'flagged',
        ocrMode: 'Demo OCR',
        extractedFields: [
          { key: 'ownerName', label: 'Owner Name (Buyer)', value: 'Rakesh Kumar', confidence: 96, confidenceTier: 'high', isConflict: true, notes: 'Spelling mismatch with RoR (Rajesh vs Rakesh)' },
          { key: 'khasraNo', label: 'Khasra Number', value: '125', confidence: 99, confidenceTier: 'high' },
          { key: 'area', label: 'Stated Area', value: '2.40 Acres', confidence: 95, confidenceTier: 'high' }
        ],
        uncertainFields: []
      }
    ],
    mutations: [
      {
        id: 'MUT-2020-0012',
        mutationNo: 'MUT-2020-0012',
        khasraNo: '125',
        khataNo: '42',
        transferor: 'Birendra Kumar (Deceased)',
        transferee: 'Rajesh Kumar & Ramesh Kumar',
        date: '2020-09-14',
        natureOfTransfer: 'Inheritance (Wirasat)',
        status: 'Disputed',
        orderingOfficer: 'Circle Officer Dumka',
        remarks: 'Transferee name recorded as Rajesh Kumar in RoR but deed registration cited Rakesh Kumar.'
      }
    ],
    registrations: [
      {
        id: 'REG-2018-8831',
        registrationNo: 'REG-2018-8831',
        deedType: 'Sale Deed',
        subRegistrarOffice: 'Dumka Sadar Sub-Registrar',
        executionDate: '2018-06-20',
        stampDutyPaid: 42500,
        marketValue: 850000,
        sellerName: 'Manoj Mandal',
        buyerName: 'Rakesh Kumar',
        khasraNo: '125',
        areaAcres: 2.40,
        status: 'Duplicate Flagged'
      }
    ],
    validationResults: [
      {
        id: 'VAL-125-01',
        category: 'Owner Consistency',
        fieldName: 'Owner / Transferee Name',
        recordAValue: 'Rajesh Kumar (RoR Record)',
        recordBValue: 'Rakesh Kumar (Sub-Registrar Deed #REG-2018-8831)',
        sourceA: 'RoR Jamabandi (1988)',
        sourceB: 'Sale Deed (2018)',
        severity: 'Critical',
        isMismatch: true,
        explanation: 'Phonetic & Levenshtein mismatch: RoR states "Rajesh Kumar" whereas registered conveyance states "Rakesh Kumar".',
        suggestedAction: 'Summon owner with Aadhaar/PAN to Circle Office for quasi-judicial name rectification.'
      },
      {
        id: 'VAL-125-02',
        category: 'Area Consistency',
        fieldName: 'Total Parcel Area',
        recordAValue: '2.40 Acres (Textual RoR)',
        recordBValue: '2.47 Acres (Cadastral GIS Vector)',
        sourceA: 'RoR Khata 42',
        sourceB: 'Bhu-Naksha Cadastral GIS',
        severity: 'High',
        isMismatch: true,
        explanation: 'Spatial polygon area (2.47 Acres) exceeds registered entitlement (2.40 Acres) by 0.07 Acres (+2.9%).',
        suggestedAction: 'Order Patwari field re-survey with DGPS/ETS to verify eastern boundary markers.'
      },
      {
        id: 'VAL-125-03',
        category: 'Spatial Consistency',
        fieldName: 'Boundary Alignment',
        recordAValue: 'Private Agricultural Boundary',
        recordBValue: 'Encroachment on Protected Gochar Land',
        sourceA: 'Cadastral Map Vector',
        sourceB: 'Revenue Forest / Gochar Boundary Layer',
        severity: 'Critical',
        isMismatch: true,
        explanation: 'Eastern boundary overlaps 0.07 acres into Plot 126 (Protected Village Grazing / Gochar Land).',
        suggestedAction: 'Issue immediate stay on mutation sanction until field demarcations are verified.'
      },
      {
        id: 'VAL-125-04',
        category: 'Duplicate Detection',
        fieldName: 'Deed Registration Number',
        recordAValue: 'REG-2018-8831 (Khasra 125)',
        recordBValue: 'REG-2018-8831 (Khasra 218)',
        sourceA: 'Sub-Registrar NGDRS',
        sourceB: 'Sub-Registrar NGDRS',
        severity: 'Critical',
        isMismatch: true,
        explanation: 'Duplicate deed registration ID: Deed REG-2018-8831 is simultaneously indexed on Khasra 125 and Khasra 218.',
        suggestedAction: 'Cross-reference Sub-Registrar volume register #44 to identify index ledger collision.'
      }
    ],
    duplicateMatches: [
      {
        id: 'DUP-001',
        originalDocNumber: 'REG-2018-8831',
        duplicateDocNumber: 'REG-2018-8831',
        originalParcelId: 'JH-DMK-RMP-2024-0125',
        duplicateParcelId: 'JH-DMK-LAK-2024-0218',
        matchType: 'Exact Registration Number',
        similarityPercentage: 100,
        reason: 'Identical Sub-Registrar deed number REG-2018-8831 found registered across two separate village jurisdictions.',
        detectedAt: '2026-09-06 18:30:00',
        severity: 'Critical'
      }
    ],
    riskAssessment: {
      overallScore: 91,
      qualityScore: 68,
      riskLevel: 'critical',
      lastAssessedAt: '2026-09-06 18:40:00',
      factors: [
        { factor: 'Owner Name Discrepancy', weight: 30, points: 30, reason: 'RoR states Rajesh Kumar vs Deed states Rakesh Kumar', source: 'RoR vs Sub-Registrar' },
        { factor: 'Duplicate Deed ID Flag', weight: 20, points: 20, reason: 'Deed REG-2018-8831 linked to multiple distinct parcels', source: 'NGDRS Sub-Registrar' },
        { factor: 'Spatial Encroachment', weight: 17, points: 17, reason: 'Boundary overlaps 0.07 acres into protected Gochar land', source: 'GIS Cadastral Layer' },
        { factor: 'Area Deviation (+2.9%)', weight: 15, points: 15, reason: 'GIS area (2.47 ac) exceeds RoR area (2.40 ac) by >2%', source: 'Cadastral Vector' },
        { factor: 'Low OCR Field Confidence', weight: 9, points: 9, reason: 'Mutation number extraction confidence is 71% (Needs Review)', source: 'OCR Engine' }
      ],
      topReasons: [
        'Critical owner name spelling mismatch across RoR and Sale Deed (Rajesh vs Rakesh)',
        'Duplicate registration ID REG-2018-8831 recorded on distinct parcels',
        'Spatial boundary overlaps protected village Gochar land by 0.07 acres',
        'Area mismatch: GIS vector area exceeds textual RoR by 0.07 acres (+2.9%)'
      ],
      explainableSummary: 'Khasra 125 exhibits four concurrent high-severity discrepancies totaling an additive risk score of 91/100. The principal vulnerability is a critical identity contradiction between the Jamabandi (Rajesh Kumar) and the conveyance deed (Rakesh Kumar), compounded by duplicate deed indexing and Gochar encroachment.',
      recommendedOfficerAction: 'Hold mutation sanction. Order Patwari on-site DGPS demarcation and summon parties for quasi-judicial hearing under Section 14 of Jharkhand Land Reforms Act.'
    },
    timeline: [
      { year: '1968', date: '1968-11-10', ownerName: 'Ganga Ram Kumar', eventType: 'Initial Settlement / Khatiyan', sourceDoc: 'Survey Khatiyan #42', docNumber: 'KHT-1968-042', transferDetails: 'Cadastral Survey Settlement recording 2.40 acres of agricultural land.', verified: true },
      { year: '1988', date: '1988-03-15', ownerName: 'Birendra Kumar', eventType: 'Wirasat (Inheritance)', sourceDoc: 'RoR Jamabandi #421', docNumber: 'ROR-DMK-1988-421', transferDetails: 'Inherited from Ganga Ram Kumar following intestate partition.', verified: true },
      { year: '2018', date: '2018-06-20', ownerName: 'Rakesh Kumar (Disputed)', eventType: 'Sale Deed Registration', sourceDoc: 'Sale Deed #8831', docNumber: 'REG-2018-8831', transferDetails: 'Conveyance executed with typographical error recording buyer as Rakesh Kumar.', verified: false, notes: 'Typographical error flagged by AI' },
      { year: '2020', date: '2020-09-14', ownerName: 'Rajesh Kumar', eventType: 'Mutation Sanctioned', sourceDoc: 'Mutation Order #0012', docNumber: 'MUT-2020-0012', transferDetails: 'Mutation sanctioned in favour of Rajesh Kumar creating legal title conflict.', verified: false },
      { year: '2026', date: '2026-09-06', ownerName: 'Rajesh Kumar', eventType: 'AI Cross-Check Flag', sourceDoc: 'BHULEKH AI Validation Engine', docNumber: 'VAL-125-01', transferDetails: 'AI flagged critical name mismatch, duplicate deed ID, and Gochar encroachment.', verified: false }
    ]
  });

  // ============================================
  // HERO PARCEL 2: KHASRA 218 (HIGH RISK 84)
  // Duplicate Deed ID + Area Discrepancy
  // ============================================
  parcels.push({
    id: 'p-218',
    parcelId: 'JH-DMK-LAK-2024-0218',
    khasraNo: '218',
    khataNo: '58',
    plotNo: '218/B',
    surveyNo: 'SUR-1968-058',
    thanaNo: '14',
    touziNo: '882',
    ulpin: '12-JH-DMK-LAK-0218',
    village: 'Lakshmipur',
    tehsil: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    owner: 'Suresh Prasad',
    fatherHusbandName: 'Jagdish Prasad',
    areaRoR: 1.80,
    areaGIS: 1.85,
    landType: 'Agricultural',
    marketRatePerAcre: 920000,
    riskScore: 84,
    qualityScore: 72,
    riskLevel: 'critical',
    status: 'needs_review',
    geometry: generatePolygonForIndex(1),
    lastUpdated: '2026-09-06 17:15:00',
    documents: [
      {
        id: 'DOC-DMK-218-01',
        parcelId: 'JH-DMK-LAK-2024-0218',
        docType: 'Registered Sale Deed (Kewala)',
        docNumber: 'REG-2018-8831',
        issueDate: '2018-06-20',
        issuingAuthority: 'Sub-Registrar Office, Dumka',
        language: 'Hindi',
        script: 'Devanagari',
        ocrEngine: 'Tesseract OCR v5.3 + Legal NER',
        ocrConfidence: 93,
        classificationConfidence: 96,
        pageCount: 6,
        fileSize: '4.8 MB',
        sha256Hash: '4a53e990c884635a968a35fd41f71f65203fa8a385f0e9b9ec8cbbe95c6ab44c',
        integrityVerified: true,
        rawSummary: 'Deed registration duplicate flagged against Khasra 125 in Rampur.',
        uploadedAt: '2026-09-03 14:00:00',
        uploader: 'Anil Soren (Revenue Inspector)',
        status: 'flagged',
        ocrMode: 'Demo OCR',
        extractedFields: [
          { key: 'ownerName', label: 'Owner Name', value: 'Suresh Prasad', confidence: 97, confidenceTier: 'high' },
          { key: 'khasraNo', label: 'Khasra Number', value: '218', confidence: 96, confidenceTier: 'high' },
          { key: 'regNo', label: 'Registration Number', value: 'REG-2018-8831', confidence: 95, confidenceTier: 'high' }
        ],
        uncertainFields: []
      }
    ],
    mutations: [],
    validationResults: [
      {
        id: 'VAL-218-01',
        category: 'Duplicate Detection',
        fieldName: 'Registration Number Collision',
        recordAValue: 'REG-2018-8831 (Lakshmipur, Khasra 218)',
        recordBValue: 'REG-2018-8831 (Rampur, Khasra 125)',
        sourceA: 'NGDRS Sub-Registrar Database',
        sourceB: 'NGDRS Sub-Registrar Database',
        severity: 'Critical',
        isMismatch: true,
        explanation: 'Deed ID REG-2018-8831 is registered against two separate owners in different villages.',
        suggestedAction: 'Notify Sub-Registrar for volume audit.'
      }
    ],
    riskAssessment: {
      overallScore: 84,
      qualityScore: 72,
      riskLevel: 'critical',
      lastAssessedAt: '2026-09-06 17:15:00',
      factors: [
        { factor: 'Duplicate Deed Registration Number', weight: 20, points: 20, reason: 'Deed REG-2018-8831 registered on multiple parcels', source: 'NGDRS Sub-Registrar' },
        { factor: 'Area Deviation (+2.7%)', weight: 15, points: 15, reason: 'GIS area (1.85 ac) exceeds RoR area (1.80 ac)', source: 'Cadastral Vector' }
      ],
      topReasons: ['Duplicate registration number REG-2018-8831', 'Area mismatch between RoR and Cadastral GIS'],
      explainableSummary: 'Khasra 218 has an active critical duplicate registration collision that must be investigated with the Sub-Registrar office.',
      recommendedOfficerAction: 'Issue notice to Suresh Prasad to produce original physical deed stamp certificate.'
    },
    timeline: [
      { year: '1975', date: '1975-04-12', ownerName: 'Jagdish Prasad', eventType: 'Initial Settlement / Khatiyan', sourceDoc: 'Survey Khatiyan #58', docNumber: 'KHT-1975-058', transferDetails: 'Recorded 1.80 acres of agricultural land.', verified: true },
      { year: '2018', date: '2018-06-20', ownerName: 'Suresh Prasad', eventType: 'Sale Deed Registration', sourceDoc: 'Sale Deed #8831', docNumber: 'REG-2018-8831', transferDetails: 'Registered conveyance deed #8831.', verified: false }
    ]
  });

  // ============================================
  // HERO PARCEL 3: KHASRA 341 (HIGH RISK 73)
  // Spatial Overlap on Gochar Land
  // ============================================
  parcels.push({
    id: 'p-341',
    parcelId: 'JH-DMK-MAD-2024-0341',
    khasraNo: '341',
    khataNo: '88',
    plotNo: '341',
    surveyNo: 'SUR-1968-088',
    thanaNo: '14',
    touziNo: '882',
    ulpin: '12-JH-DMK-MAD-0341',
    village: 'Madhopur',
    tehsil: 'Dumka Sadar',
    district: 'Dumka',
    state: 'Jharkhand',
    owner: 'Anita Devi',
    fatherHusbandName: 'Sunil Sharma',
    areaRoR: 3.10,
    areaGIS: 3.18,
    landType: 'Agricultural',
    marketRatePerAcre: 780000,
    riskScore: 73,
    qualityScore: 75,
    riskLevel: 'high',
    status: 'in_dispute',
    geometry: generatePolygonForIndex(2),
    lastUpdated: '2026-09-06 16:30:00',
    documents: [],
    mutations: [],
    validationResults: [
      {
        id: 'VAL-341-01',
        category: 'Spatial Consistency',
        fieldName: 'Cadastral Boundary',
        recordAValue: 'Private Land (3.10 ac)',
        recordBValue: 'Overlaps Gochar Land (0.08 ac)',
        sourceA: 'Cadastral GIS',
        sourceB: 'Government Land Registry',
        severity: 'High',
        isMismatch: true,
        explanation: 'Western boundary overlaps 0.08 acres into protected village grazing reserve.',
        suggestedAction: 'Order survey inspection.'
      }
    ],
    riskAssessment: {
      overallScore: 73,
      qualityScore: 75,
      riskLevel: 'high',
      lastAssessedAt: '2026-09-06 16:30:00',
      factors: [
        { factor: 'Gochar Land Overlap', weight: 17, points: 17, reason: 'Boundary overlaps protected grazing land', source: 'GIS Cadastral Layer' },
        { factor: 'Area Deviation (+2.5%)', weight: 15, points: 15, reason: 'GIS area (3.18 ac) exceeds RoR area (3.10 ac)', source: 'Cadastral Vector' }
      ],
      topReasons: ['Cadastral polygon overlaps protected Gochar reserve', 'Area mismatch > 2%'],
      explainableSummary: 'Parcel boundary intersects with public community grazing land requiring boundary trimming.',
      recommendedOfficerAction: 'Direct Patwari to conduct field demarcation.'
    },
    timeline: [
      { year: '1982', date: '1982-08-19', ownerName: 'Sunil Sharma', eventType: 'Initial Settlement / Khatiyan', sourceDoc: 'Survey Khatiyan #88', docNumber: 'KHT-1982-088', transferDetails: 'Settled 3.10 acres.', verified: true }
    ]
  });

  // ============================================
  // GENERATE REMAINING 97+ PARCELS (VERIFIED & DIVERSE CASES)
  // ============================================
  for (let i = 4; i <= 105; i++) {
    const village = VILLAGES[i % VILLAGES.length];
    const district = DISTRICTS[i % DISTRICTS.length];
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const ownerName = `${firstName} ${lastName}`;
    const khasraNum = `${100 + i}`;
    const khataNum = `${10 + (i % 60)}`;
    const baseArea = Number((1.2 + (i % 50) * 0.08).toFixed(2));
    
    // Vary risk levels: Mostly verified (8-25), some review (35-48), some high (62-78)
    let risk = 12 + (i % 18);
    let status: LandParcel['status'] = 'verified';
    let riskLevel: LandParcel['riskLevel'] = 'low';
    let quality = 94 - (i % 10);
    let areaGIS = baseArea;

    if (i % 7 === 0) {
      risk = 65 + (i % 12);
      status = 'needs_review';
      riskLevel = 'high';
      quality = 74;
      areaGIS = Number((baseArea * 1.035).toFixed(2));
    } else if (i % 13 === 0) {
      risk = 45;
      status = 'needs_review';
      riskLevel = 'medium';
      quality = 82;
    }

    const docTypeIndex = i % 4;
    const docTypes: LandDocument['docType'][] = [
      'Record of Rights (RoR / Jamabandi)',
      'Registered Sale Deed (Kewala)',
      'Mutation Order (Dakhil-Kharij)',
      'LPC (Land Possession Certificate)'
    ];

    const langIndex = i % 10;
    const languages: LandDocument['language'][] = [
      'Hindi', 'English', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Kannada', 'Odia', 'Punjabi'
    ];
    const scripts: LandDocument['script'][] = [
      'Devanagari', 'Latin', 'Bengali', 'Devanagari', 'Tamil', 'Telugu', 'Gujarati', 'Kannada', 'Odia', 'Gurmukhi'
    ];

    const docId = `DOC-${district.slice(0, 3).toUpperCase()}-${khasraNum}-01`;
    const parcelId = `JH-${district.slice(0, 3).toUpperCase()}-${village.slice(0, 3).toUpperCase()}-2024-${khasraNum.padStart(4, '0')}`;

    parcels.push({
      id: `p-${i}`,
      parcelId,
      khasraNo: khasraNum,
      khataNo: khataNum,
      plotNo: `${khasraNum}`,
      surveyNo: `SUR-1968-${khataNum}`,
      thanaNo: `${10 + (i % 15)}`,
      touziNo: `${800 + (i % 50)}`,
      ulpin: `12-JH-${district.slice(0, 3).toUpperCase()}-${village.slice(0, 3).toUpperCase()}-${khasraNum.padStart(4, '0')}`,
      village,
      tehsil: `${district} Sadar`,
      district,
      state: 'Jharkhand',
      owner: ownerName,
      fatherHusbandName: `Late ${FIRST_NAMES[(i + 3) % FIRST_NAMES.length]} ${lastName}`,
      areaRoR: baseArea,
      areaGIS,
      landType: i % 8 === 0 ? 'Residential' : i % 12 === 0 ? 'Commercial' : 'Agricultural',
      marketRatePerAcre: 650000 + (i % 20) * 25000,
      riskScore: risk,
      qualityScore: quality,
      riskLevel,
      status,
      geometry: generatePolygonForIndex(i),
      lastUpdated: '2026-09-06 12:00:00',
      documents: [
        {
          id: docId,
          parcelId,
          docType: docTypes[docTypeIndex],
          docNumber: `DOC-${district.slice(0, 3).toUpperCase()}-2024-${1000 + i}`,
          issueDate: `202${i % 4}-0${(i % 9) + 1}-15`,
          issuingAuthority: `Circle Officer, ${district} Sadar`,
          language: languages[langIndex],
          script: scripts[langIndex],
          ocrEngine: 'Tesseract OCR v5.3 + Indic NER',
          ocrConfidence: 90 + (i % 9),
          classificationConfidence: 94 + (i % 5),
          pageCount: 1 + (i % 4),
          fileSize: `${(1.8 + (i % 3) * 0.9).toFixed(1)} MB`,
          sha256Hash: `7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d90${(i % 90 + 10)}`,
          integrityVerified: true,
          rawSummary: `${docTypes[docTypeIndex]} for Khasra ${khasraNum} in ${village}, ${district}.`,
          uploadedAt: '2026-09-04 10:00:00',
          uploader: 'Revenue Inspector Office',
          status: 'verified',
          ocrMode: 'Demo OCR',
          extractedFields: [
            { key: 'ownerName', label: 'Owner Name', value: ownerName, confidence: 97, confidenceTier: 'high' },
            { key: 'khasraNo', label: 'Khasra Number', value: khasraNum, confidence: 98, confidenceTier: 'high' },
            { key: 'khataNo', label: 'Khata Number', value: khataNum, confidence: 96, confidenceTier: 'high' },
            { key: 'village', label: 'Village', value: village, confidence: 99, confidenceTier: 'high' },
            { key: 'area', label: 'Area (Acres)', value: `${baseArea}`, confidence: 94, confidenceTier: 'high' }
          ],
          uncertainFields: []
        }
      ],
      mutations: [
        {
          id: `MUT-${2020 + (i % 4)}-${1000 + i}`,
          mutationNo: `MUT-${2020 + (i % 4)}-${1000 + i}`,
          khasraNo: khasraNum,
          khataNo: khataNum,
          transferor: `Ancestor of ${lastName}`,
          transferee: ownerName,
          date: `202${i % 4}-03-12`,
          natureOfTransfer: i % 2 === 0 ? 'Inheritance (Wirasat)' : 'Sale',
          status: 'Sanctioned',
          orderingOfficer: `Circle Officer ${district}`,
          remarks: 'Mutation verified and entered in Jamabandi register.'
        }
      ],
      validationResults: [
        {
          id: `VAL-${i}-01`,
          category: 'Owner Consistency',
          fieldName: 'Owner Name',
          recordAValue: ownerName,
          recordBValue: ownerName,
          sourceA: 'RoR Register',
          sourceB: 'Mutation Order',
          severity: 'Match',
          isMismatch: false,
          explanation: 'Owner identity matches 100% across RoR and Mutation records.',
          suggestedAction: 'No action required. Record is verified.'
        }
      ],
      riskAssessment: {
        overallScore: risk,
        qualityScore: quality,
        riskLevel,
        lastAssessedAt: '2026-09-06 12:00:00',
        factors: risk > 30 ? [
          { factor: 'Minor Area Difference', weight: 15, points: 15, reason: 'Slight difference between textual and GIS boundary', source: 'GIS Vector' }
        ] : [],
        topReasons: risk > 30 ? ['Area deviation flagged for review'] : ['All records verified across revenue registers'],
        explainableSummary: risk > 30 
          ? `Parcel exhibits a minor area deviation requiring routine field check.` 
          : `Parcel records are 100% consistent across RoR, Deed, Mutation, and Cadastral GIS.`,
        recommendedOfficerAction: risk > 30 ? 'Assign to Patwari for routine boundary check' : 'Approve for digital title certificate issuance.'
      },
      timeline: [
        {
          year: '1970',
          date: '1970-05-15',
          ownerName: `Ancestor of ${lastName}`,
          eventType: 'Initial Settlement / Khatiyan',
          sourceDoc: `Khatiyan #${khataNum}`,
          docNumber: `KHT-1970-${khataNum}`,
          transferDetails: `Settled ${baseArea} acres of agricultural land.`,
          verified: true
        },
        {
          year: `202${i % 4}`,
          date: `202${i % 4}-03-12`,
          ownerName: ownerName,
          eventType: 'Current RoR',
          sourceDoc: `Jamabandi Entry #${1000 + i}`,
          docNumber: `ROR-${district.slice(0, 3).toUpperCase()}-2024`,
          transferDetails: `Recorded under ${ownerName} following sanctioned mutation.`,
          verified: true
        }
      ]
    });
  }

  return parcels;
}

export const SYNTHETIC_LAND_PARCELS: LandParcel[] = generateSyntheticParcels();
