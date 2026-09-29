import { LandDocument, ExtractedField, DocumentClassificationType } from '../types/landRecord';

export interface OcrProcessingStep {
  step: number;
  label: string;
  description: string;
  durationMs: number;
}

export const OCR_PIPELINE_STEPS: OcrProcessingStep[] = [
  { step: 1, label: 'Document Ingestion & Image Preprocessing', description: 'Deskewing, binarization, Kaithi/Devanagari script enhancement', durationMs: 400 },
  { step: 2, label: 'AI Document Classification', description: 'Classifying document template (RoR, Khatiyan, Mutation Order, Sale Deed)', durationMs: 400 },
  { step: 3, label: 'Bilingual OCR & Text Transcription', description: 'Deep learning text recognition across Hindi, Kaithi & English typography', durationMs: 500 },
  { step: 4, label: 'Named Entity Recognition (NER)', description: 'Extracting Raiyat Name, Khasra No, Khata No, Area Rakba, Mutation ID', durationMs: 400 },
  { step: 5, label: 'Confidence Scoring & Field Normalization', description: 'Evaluating field reliability percentages and character uncertainty', durationMs: 400 },
  { step: 6, label: 'Cross-Registry Linking', description: 'Matching extracted Khasra with GIS Cadastral parcel polygons', durationMs: 300 }
];

export interface ProcessDocumentOptions {
  fileName: string;
  fileSize: string;
  docType?: DocumentClassificationType;
  sampleId?: string;
  onProgress?: (stepIndex: number, progressPct: number, currentStep: OcrProcessingStep) => void;
}

export interface OcrResult {
  document: LandDocument;
  matchedParcelId: string;
  overallConfidence: number;
  processingTimeSec: number;
  fields: ExtractedField[];
  warnings: string[];
}

export async function processDocumentWithAiOcr(
  options: ProcessDocumentOptions
): Promise<OcrResult> {
  const { fileName, fileSize, docType = 'Record of Rights (RoR / Jamabandi)', sampleId, onProgress } = options;
  const startTime = Date.now();

  // Simulate realistic asynchronous progressive pipeline
  let totalElapsed = 0;
  for (let i = 0; i < OCR_PIPELINE_STEPS.length; i++) {
    const step = OCR_PIPELINE_STEPS[i];
    const progressPct = Math.round(((i + 1) / OCR_PIPELINE_STEPS.length) * 100);
    if (onProgress) {
      onProgress(i, progressPct, step);
    }
    await new Promise(resolve => setTimeout(resolve, step.durationMs));
    totalElapsed += step.durationMs;
  }

  // Pre-configured deterministic extraction based on sample or generic document
  let extractedFields: ExtractedField[] = [];
  let matchedParcelId = 'JH-DMK-RMP-2024-0125';
  let warnings: string[] = [];
  let detectedType: DocumentClassificationType = docType;
  let ocrConfidence = 94;

  if (sampleId === 'sample-kewala-218' || fileName.toLowerCase().includes('218')) {
    matchedParcelId = 'JH-DMK-LAK-2024-0218';
    detectedType = 'Registered Sale Deed (Kewala)';
    ocrConfidence = 89;
    extractedFields = [
      { label: 'Purchaser Name (क्रेता)', key: 'owner', value: 'Suresh Prasad', confidence: 94, confidenceTier: 'high' },
      { label: 'Father Name', key: 'father', value: 'Late Brijesh Prasad', confidence: 91, confidenceTier: 'high' },
      { label: 'Khasra Number (खसरा नं)', key: 'khasra', value: '218', confidence: 96, confidenceTier: 'high' },
      { label: 'Khata Number (खाता नं)', key: 'khata', value: '93', confidence: 95, confidenceTier: 'high' },
      { label: 'Deed Area (रकबा)', key: 'area', value: '1.85 Acre', confidence: 93, confidenceTier: 'high' },
      { label: 'Deed Registration No', key: 'regNo', value: 'REG-2018-8831', confidence: 96, confidenceTier: 'high', isConflict: true, notes: 'Duplicate Registration ID Collision' },
      { label: 'Village (ग्राम)', key: 'village', value: 'Lakshmipur', confidence: 98, confidenceTier: 'high' },
      { label: 'District', key: 'district', value: 'Dumka', confidence: 99, confidenceTier: 'high' }
    ];
    warnings.push('Duplicate Registration ID REG-2018-8831 detected in Sub-Registrar registry database.');
  } else if (sampleId === 'sample-khatiyan-101' || fileName.toLowerCase().includes('101')) {
    matchedParcelId = 'JH-DMK-RMP-2024-0101';
    detectedType = 'Khatiyan (Tenancy Record)';
    ocrConfidence = 97;
    extractedFields = [
      { label: 'Raiyat Name (रैयत का नाम)', key: 'owner', value: 'Ravi Kumar', confidence: 98, confidenceTier: 'high' },
      { label: 'Father Name', key: 'father', value: 'Ashok Kumar', confidence: 97, confidenceTier: 'high' },
      { label: 'Khasra Number (खसरा नं)', key: 'khasra', value: '101', confidence: 99, confidenceTier: 'high' },
      { label: 'Khata Number (खाता नं)', key: 'khata', value: '12', confidence: 98, confidenceTier: 'high' },
      { label: 'Recorded Area', key: 'area', value: '1.50 Acre', confidence: 96, confidenceTier: 'high' },
      { label: 'Village (ग्राम)', key: 'village', value: 'Rampur', confidence: 99, confidenceTier: 'high' },
      { label: 'Land Classification', key: 'landType', value: 'Agricultural (Dhani-1)', confidence: 95, confidenceTier: 'high' }
    ];
  } else {
    // Default: Sample Khasra 125 with rich high-risk realistic extraction
    matchedParcelId = 'JH-DMK-RMP-2024-0125';
    detectedType = 'Record of Rights (RoR / Jamabandi)';
    ocrConfidence = 93;
    extractedFields = [
      { label: 'Owner Name (खातेदार)', key: 'owner', value: 'Rajesh Kumar', confidence: 98, confidenceTier: 'high' },
      { label: 'Father / Husband Name', key: 'father', value: 'Mahesh Kumar', confidence: 96, confidenceTier: 'high' },
      { label: 'Khasra Number (खसरा नं)', key: 'khasra', value: '125', confidence: 96, confidenceTier: 'high' },
      { label: 'Khata Number (खाता नं)', key: 'khata', value: '48', confidence: 95, confidenceTier: 'high' },
      { label: 'Recorded Area (रकबा)', key: 'area', value: '2.40 Acre', confidence: 91, confidenceTier: 'high' },
      { label: 'Village (ग्राम)', key: 'village', value: 'Rampur', confidence: 99, confidenceTier: 'high' },
      { label: 'District (जिला)', key: 'district', value: 'Dumka', confidence: 99, confidenceTier: 'high' },
      { label: 'Mutation Reference', key: 'mutationNo', value: 'MUT-2024-0192', confidence: 71, confidenceTier: 'review', isConflict: true, notes: 'Low confidence stamp; possible transferee name variance' },
      { label: 'Associated Sale Deed', key: 'regNo', value: 'REG-2018-8831', confidence: 92, confidenceTier: 'high' }
    ];
    warnings.push('Mutation document contains transferee spelling variance: "Rakesh Kumar" vs RoR "Rajesh Kumar".');
    warnings.push('Area recorded (2.40 Acre) diverges by +2.91% against GIS Cadastral Polygon (2.47 Acre).');
  }

  const processingTimeSec = Number(((Date.now() - startTime) / 1000).toFixed(1));

  const newDoc: LandDocument = {
    id: `doc-upload-${Date.now()}`,
    parcelId: matchedParcelId,
    docType: detectedType,
    docNumber: `DIGI-OCR-${Math.floor(100000 + Math.random() * 900000)}`,
    issueDate: '2024-06-20',
    issuingAuthority: 'Circle Office, Dumka Sadar',
    language: 'Hindi',
    script: 'Devanagari',
    ocrEngine: 'Tesseract OCR v5.3 + Indic NER',
    pageCount: 2,
    fileSize,
    ocrConfidence,
    classificationConfidence: 97,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    integrityVerified: true,
    status: warnings.length > 0 ? 'flagged' : 'processed',
    uploadedAt: new Date().toISOString(),
    uploader: 'Revenue Inspector Office',
    ocrMode: 'Demo OCR',
    rawSummary: `Automated AI OCR extraction completed in ${processingTimeSec}s with ${ocrConfidence}% average field confidence.`,
    extractedFields,
    uncertainFields: extractedFields.filter(f => f.confidenceTier === 'review')
  };

  return {
    document: newDoc,
    matchedParcelId,
    overallConfidence: ocrConfidence,
    processingTimeSec,
    fields: extractedFields,
    warnings
  };
}
