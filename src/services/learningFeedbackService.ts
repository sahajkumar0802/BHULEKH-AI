import { AiCorrectionFeedback, SupportedLanguage, DocumentClassificationType } from '../types/landRecord';
import { INITIAL_AI_LEARNING_FEEDBACK } from '../data/syntheticLandData';

const LOCAL_STORAGE_KEY = 'bhumi_ai_learning_feedback';

export interface LearningCenterMetrics {
  totalCorrectionsCollected: number;
  totalFieldsCorrected: number;
  averageExtractionConfidence: number;
  modelImprovementRate: number; // e.g., +8.7%
  pendingTrainingCandidates: number;
  topCorrectedFields: { fieldName: string; correctionCount: number; accuracyGain: string }[];
  languageFeedbackBreakdown: { language: string; feedbackCount: number }[];
}

export function getStoredFeedbackRecords(): AiCorrectionFeedback[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_AI_LEARNING_FEEDBACK;
    }
  } catch {
    // fallback
  }
  return INITIAL_AI_LEARNING_FEEDBACK;
}

export function saveFeedbackCorrection(correction: {
  documentId: string;
  parcelId: string;
  fieldKey: string;
  fieldLabel: string;
  aiValue: string;
  correctedValue: string;
  language?: SupportedLanguage;
  documentType?: DocumentClassificationType;
  confidence?: number;
  verifiedBy: string;
  officerRole: string;
  notes?: string;
}): AiCorrectionFeedback {
  const current = getStoredFeedbackRecords();

  const newFeedback: AiCorrectionFeedback = {
    id: `FB-${new Date().getFullYear()}-${String(current.length + 1).padStart(4, '0')}`,
    documentId: correction.documentId,
    parcelId: correction.parcelId,
    fieldKey: correction.fieldKey,
    fieldLabel: correction.fieldLabel,
    aiValue: correction.aiValue,
    correctedValue: correction.correctedValue,
    language: correction.language || 'Hindi',
    documentType: correction.documentType || 'Record of Rights (RoR / Jamabandi)',
    confidence: correction.confidence || 72,
    verifiedBy: correction.verifiedBy,
    officerRole: correction.officerRole,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    appliedToRetrainingDataset: true,
    notes: correction.notes || 'Human officer verified correction recorded for future model fine-tuning.'
  };

  const updated = [newFeedback, ...current];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage issues
  }

  return newFeedback;
}

export function computeLearningMetrics(feedbackList: AiCorrectionFeedback[]): LearningCenterMetrics {
  const baseCorrections = 1284;
  const baseFields = 2931;
  const currentCount = feedbackList.length;

  return {
    totalCorrectionsCollected: baseCorrections + (currentCount - INITIAL_AI_LEARNING_FEEDBACK.length),
    totalFieldsCorrected: baseFields + (currentCount - INITIAL_AI_LEARNING_FEEDBACK.length),
    averageExtractionConfidence: 91.4,
    modelImprovementRate: 8.7,
    pendingTrainingCandidates: Math.max(12, currentCount),
    topCorrectedFields: [
      { fieldName: 'Mutation Number', correctionCount: 842, accuracyGain: '+14.2%' },
      { fieldName: 'Father / Spouse Name', correctionCount: 618, accuracyGain: '+9.8%' },
      { fieldName: 'Owner Name Spelling', correctionCount: 524, accuracyGain: '+8.1%' },
      { fieldName: 'Cadastral Survey Number', correctionCount: 480, accuracyGain: '+6.4%' },
      { fieldName: 'Stated Area (Dismil / Acre)', correctionCount: 467, accuracyGain: '+5.0%' }
    ],
    languageFeedbackBreakdown: [
      { language: 'Hindi (Devanagari)', feedbackCount: 780 },
      { language: 'English (Latin)', feedbackCount: 240 },
      { language: 'Bengali (Bengali)', feedbackCount: 120 },
      { language: 'Marathi (Devanagari)', feedbackCount: 85 },
      { language: 'Other Indic Languages', feedbackCount: 59 }
    ]
  };
}
