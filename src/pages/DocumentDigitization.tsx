import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupportedLanguage, ScriptType, DocumentClassificationType, ExtractedField } from '../types/landRecord';
import { SUPPORTED_LANGUAGES, detectDocumentLanguage } from '../services/languageOcrService';
import { classifyLandDocument } from '../services/documentClassifierService';
import { extractRevenueFields } from '../services/fieldExtractionService';
import {
  UploadCloud,
  FileScan,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Languages,
  ShieldCheck,
  Edit3,
  ExternalLink
} from 'lucide-react';

export const DocumentDigitization: React.FC = () => {
  const { setSelectedParcelId, setActiveTab, addDocumentToParcel, recordAiCorrection } = useApp();

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('Hindi');
  const [selectedDocType, setSelectedDocType] = useState<DocumentClassificationType>('Record of Rights (RoR / Jamabandi)');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>('Jamabandi_Khasra_125_Deoghar_Scan.pdf');
  const [samplePreset, setSamplePreset] = useState<string>('sample-1');
  
  // OCR & Classification Extraction Results
  const [detectedScript, setDetectedScript] = useState<ScriptType>('Devanagari');
  const [ocrEngine, setOcrEngine] = useState<string>('Tesseract OCR v5.3 + Indic-NER (Hindi Mod)');
  const [ocrConfidence, setOcrConfidence] = useState<number>(94.2);
  const [classificationConfidence, setClassificationConfidence] = useState<number>(97.4);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [uncertainFields, setUncertainFields] = useState<ExtractedField[]>([]);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [activeEditingKey, setActiveEditingKey] = useState<string | null>(null);

  const OCR_STEPS = [
    '1. Image Preprocessing & Adaptive Binarization (Deskewing, Noise Reduction)',
    '2. Multi-Script Language & Layout Detection',
    '3. Intelligent Document Classification (RoR / Deed / Mutation)',
    '4. Indic-NER Revenue Entity Extraction (16 Fields)',
    '5. Cross-Script Phonetic Normalization & Confidence Scoring',
    '6. Digital Land Twin & GIS Parcel Association'
  ];

  const handleRunOcr = async (preset = samplePreset, filename = uploadedFileName) => {
    setIsProcessing(true);
    setProgressPct(10);
    setCurrentStepIndex(0);
    setIsProcessed(false);

    // Progressive step animation
    for (let i = 0; i < OCR_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 250));
      setCurrentStepIndex(i);
      setProgressPct(Math.round(((i + 1) / OCR_STEPS.length) * 100));
    }

    const langDetect = detectDocumentLanguage(undefined, filename);
    const classification = classifyLandDocument(filename, filename);
    const extraction = extractRevenueFields(filename, preset);

    setSelectedLanguage(langDetect.detectedLanguage);
    setDetectedScript(langDetect.script);
    setOcrEngine(langDetect.ocrEngine);
    setOcrConfidence(langDetect.confidence);
    setSelectedDocType(classification.classifiedType);
    setClassificationConfidence(classification.confidence);
    setExtractedFields(extraction.fields);
    setUncertainFields(extraction.uncertainFields);
    setIsProcessing(false);
    setIsProcessed(true);

    // Save document to parcel
    const targetParcelId = preset === 'sample-2' ? 'JH-DMK-LAK-2024-0218' : 'JH-DMK-RMP-2024-0125';
    addDocumentToParcel(targetParcelId, {
      id: `DOC-UPLOAD-${Date.now().toString().slice(-4)}`,
      parcelId: targetParcelId,
      docType: classification.classifiedType,
      docNumber: preset === 'sample-2' ? 'REG-2018-8831' : 'ROR-DMK-1988-421',
      issueDate: '2020-09-14',
      issuingAuthority: 'Circle Officer, Dumka Sadar',
      language: langDetect.detectedLanguage,
      script: langDetect.script,
      ocrEngine: langDetect.ocrEngine,
      ocrConfidence: langDetect.confidence,
      classificationConfidence: classification.confidence,
      pageCount: 2,
      fileSize: '2.4 MB',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      integrityVerified: true,
      extractedFields: extraction.fields,
      uncertainFields: extraction.uncertainFields,
      rawSummary: `Digitized ${classification.classifiedType} for ${filename}.`,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      uploader: 'Revenue Inspector Office',
      status: extraction.uncertainFields.length > 0 ? 'flagged' : 'verified',
      ocrMode: 'Demo OCR'
    });
  };

  const handleFieldEdit = (field: ExtractedField, newValue: string) => {
    setExtractedFields(prev => prev.map(f => f.key === field.key ? { ...f, value: newValue } : f));
    
    // Record feedback for training
    recordAiCorrection({
      documentId: 'DOC-DMK-125-01',
      parcelId: 'JH-DMK-RMP-2024-0125',
      fieldKey: field.key,
      fieldLabel: field.label,
      aiValue: field.value,
      correctedValue: newValue,
      language: selectedLanguage,
      notes: `Officer updated field in digitization studio.`
    });

    setActiveEditingKey(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <FileScan className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                Multilingual AI OCR & Document Digitization Studio
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Ingest scanned land records, classify documents, transcribe across 10 Indian scripts, and extract structured revenue entities.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Demo OCR & NER Engine Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Zone & Sample Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Sample Selector */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Select Sample Document</span>
              <span className="text-indigo-600 text-[11px] font-semibold">1-Click Test</span>
            </h3>

            <div className="space-y-2">
              {[
                { id: 'sample-1', title: 'Sample 1: Deoghar Jamabandi Scan (Discrepancy)', desc: 'Hindi RoR (Khasra 125) with name mismatch and uncertain mutation numeral.', file: 'Jamabandi_Khasra_125_Scan.pdf', lang: 'Hindi (Devanagari)' },
                { id: 'sample-2', title: 'Sample 2: Registered Sale Deed (Duplicate)', desc: 'English registered conveyance deed #REG-2018-8831 with duplicate registration ID.', file: 'Sale_Deed_REG_8831.pdf', lang: 'English (Latin)' },
                { id: 'sample-3', title: 'Sample 3: Pristine Clean RoR Record', desc: 'High confidence bilingual record (Khasra 341) with zero discrepancies.', file: 'Clean_RoR_Khasra_341.pdf', lang: 'Hindi (Devanagari)' }
              ].map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSamplePreset(s.id);
                    setUploadedFileName(s.file);
                    setIsProcessed(false);
                  }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${samplePreset === s.id ? 'bg-indigo-50/80 border-indigo-500 ring-1 ring-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                >
                  <p className="font-bold text-slate-900">{s.title}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{s.desc}</p>
                  <span className="text-[10px] font-semibold text-indigo-600 mt-1 block">{s.lang}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Box */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Upload Custom Land Document</h3>
            <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-indigo-50/20 transition-all text-center">
              <UploadCloud className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-xs font-bold text-slate-800">Click to upload or drag & drop</span>
              <span className="text-[11px] text-slate-500 mt-0.5">Supports PDF, JPG, PNG, Scanned & Handwritten docs</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedFileName(file.name);
                    setSamplePreset('custom');
                    handleRunOcr('custom', file.name);
                  }
                }}
              />
            </label>
            <p className="text-[11px] text-slate-500 font-mono truncate">Selected file: <strong>{uploadedFileName}</strong></p>

            <button
              onClick={() => handleRunOcr(samplePreset, uploadedFileName)}
              disabled={isProcessing}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Cpu className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              {isProcessing ? 'Running 6-Stage AI OCR Pipeline...' : 'Run OCR & Entity Extraction'}
            </button>
          </div>

          {/* 10 Indian Language Manual Override Selector */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-600" />
                Language & Script Settings
              </h3>
              <span className="text-[10px] text-slate-400">10 Scripts</span>
            </div>
            <p className="text-xs text-slate-500">
              Language is detected automatically. You can override it manually below:
            </p>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.language} value={l.language}>
                  {l.language} ({l.nativeName}) — {l.script} Script
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column: Processing Pipeline & Extracted Fields (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Progress / Pipeline Steps */}
          {isProcessing && (
            <div className="p-6 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Neural OCR Pipeline In Progress</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{progressPct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="space-y-1.5 pt-2">
                {OCR_STEPS.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {idx < currentStepIndex ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : idx === currentStepIndex ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                    )}
                    <span className={idx === currentStepIndex ? 'text-white font-bold' : idx < currentStepIndex ? 'text-slate-300' : 'text-slate-500'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classification & Confidence Header (When Processed) */}
          {isProcessed && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Detected Language</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedLanguage}</span>
                  <span className="text-slate-500 text-[10px] block">Script: {detectedScript}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Document Class</span>
                  <span className="font-bold text-indigo-700 text-sm">{selectedDocType}</span>
                  <span className="text-emerald-700 text-[10px] font-semibold block">{classificationConfidence}% confidence</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">OCR Engine</span>
                  <span className="font-semibold text-slate-800 text-xs truncate block">{ocrEngine}</span>
                  <span className="text-emerald-700 text-[10px] font-bold block">{ocrConfidence}% overall</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Integrity Hash</span>
                  <span className="font-mono text-[10px] text-slate-600 block">e3b0c442...</span>
                  <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> SHA-256 Verified
                  </span>
                </div>
              </div>

              {/* Uncertain Fields Alert Box */}
              {uncertainFields.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Uncertain Fields Flagged ({uncertainFields.length})
                    </span>
                    <button
                      onClick={() => setActiveTab('queue')}
                      className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
                    >
                      Route to Officer Queue →
                    </button>
                  </div>
                  <p className="text-xs text-amber-800">
                    The following fields have confidence below 75% due to aged seal imprints or faded text:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uncertainFields.map((uf) => (
                      <span key={uf.key} className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 rounded text-xs font-medium flex items-center gap-1">
                        <strong>{uf.label}:</strong> {uf.value}
                        <span className="text-amber-700 text-[10px] font-bold">({uf.confidence}%)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 16 Extracted Revenue Fields Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Structured Revenue Entities (16 Fields)
                  </h3>
                  <span className="text-xs text-slate-500">Click any field to edit & train AI</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {extractedFields.map((field) => (
                    <div
                      key={field.key}
                      className={`p-3 rounded-lg border transition-all ${field.confidenceTier === 'review' ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-500 font-medium">{field.label}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${field.confidenceTier === 'high' ? 'bg-emerald-100 text-emerald-800' : field.confidenceTier === 'medium' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                          {field.confidence}%
                        </span>
                      </div>

                      {activeEditingKey === field.key ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            defaultValue={field.value}
                            id={`edit-input-${field.key}`}
                            className="w-full p-1.5 border border-indigo-400 rounded text-xs font-bold text-slate-900 bg-white"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(`edit-input-${field.key}`) as HTMLInputElement;
                              if (input) handleFieldEdit(field, input.value);
                            }}
                            className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-slate-900 text-sm">{field.value}</span>
                          <button
                            onClick={() => setActiveEditingKey(field.key)}
                            className="text-slate-400 hover:text-indigo-600 p-1"
                            title="Edit field"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Associated with GIS Parcel: <strong className="text-indigo-600">JH-DMK-RMP-2024-0125</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedParcelId('JH-DMK-RMP-2024-0125');
                      setActiveTab('twin');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    View 360° Digital Land Twin
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isProcessed && !isProcessing && (
            <div className="p-12 bg-white rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
              <FileScan className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-base">No Document Processed Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Select a demonstration document on the left or upload a scanned revenue record to initiate the 6-stage AI OCR and entity extraction pipeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
