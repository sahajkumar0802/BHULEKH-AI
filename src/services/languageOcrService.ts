import { SupportedLanguage, ScriptType } from '../types/landRecord';

export interface LanguageDetectionResult {
  detectedLanguage: SupportedLanguage;
  script: ScriptType;
  confidence: number;
  ocrEngine: string;
  isSimulated: boolean;
  sampleKeywordsFound: string[];
}

export const SUPPORTED_LANGUAGES: {
  language: SupportedLanguage;
  script: ScriptType;
  nativeName: string;
  sampleKeywords: string[];
  ocrEngine: string;
}[] = [
  {
    language: 'Hindi',
    script: 'Devanagari',
    nativeName: 'हिन्दी',
    sampleKeywords: ['जमाबंदी', 'खाता संख्या', 'खेसरा', 'रैयत का नाम', 'दाखिल खारिज', 'थाना संख्या'],
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Hindi Mod)'
  },
  {
    language: 'English',
    script: 'Latin',
    nativeName: 'English',
    sampleKeywords: ['Record of Rights', 'Khasra Number', 'Khata', 'Owner Name', 'Mutation Order', 'Sub-Registrar'],
    ocrEngine: 'Tesseract OCR v5.3 + Standard Legal NER'
  },
  {
    language: 'Bengali',
    script: 'Bengali',
    nativeName: 'বাংলা',
    sampleKeywords: ['খতিয়ান', 'দাগ নম্বর', 'মৌজা', 'রায়তের নাম', 'নামজারি'],
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Bengali Mod)'
  },
  {
    language: 'Marathi',
    script: 'Devanagari',
    nativeName: 'मराठी',
    sampleKeywords: ['७/१२ उतारा', 'खाते क्रमांक', 'गट क्रमांक', 'भोगवटादार', 'फेरफार'],
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Marathi Mod)'
  },
  {
    language: 'Tamil',
    script: 'Tamil',
    nativeName: 'தமிழ்',
    sampleKeywords: ['பட்டா', 'சிட்டா', 'சர்வே எண்', 'உரிமையாளர் பெயர்', 'கிராமம்'],
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Tamil Mod)'
  },
  {
    language: 'Telugu',
    script: 'Telugu',
    nativeName: 'తెలుగు',
    sampleKeywords: ['పట్టాదారు పాస్‌బుక్', 'ఖాతా సంఖ్య', 'సర్వే నంబర్', 'రైతు పేరు'],
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Telugu Mod)'
  },
  {
    language: 'Gujarati',
    script: 'Gujarati',
    nativeName: 'ગુજરાતી',
    sampleKeywords: ['૭/૧૨ નો ઉતારો', 'ખાતા નંબર', 'સર્વે નંબર', 'ખાતેદારનું નામ', 'નોંધણી'],
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Gujarati Mod)'
  },
  {
    language: 'Kannada',
    script: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    sampleKeywords: ['ಪಹಣಿ', 'ಆರ್‌ಟಿಸಿ', 'ಖಾತೆ ಸಂಖ್ಯೆ', 'ಸರ್ವೆ ನಂಬರ್', 'ಹಿಡುವಳಿದಾರ'],
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Kannada Mod)'
  },
  {
    language: 'Odia',
    script: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    sampleKeywords: ['ପଟ୍ଟା', 'ଖତିୟାନ', 'ପ୍ଲଟ ନମ୍ବର', 'ରୟତଙ୍କ ନାମ'],
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Odia Mod)'
  },
  {
    language: 'Punjabi',
    script: 'Gurmukhi',
    nativeName: 'ਪੰਜਾਬੀ',
    sampleKeywords: ['ਜਮ੍ਹਾਬੰਦੀ', 'ਖਸਰਾ ਨੰਬਰ', 'ਮਾਲਕ ਦਾ ਨਾਮ', 'ਇੰਤਕਾਲ'],
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Punjabi Mod)'
  }
];

export function detectDocumentLanguage(textSample?: string, filename?: string): LanguageDetectionResult {
  // If filename or text has specific hints
  const lower = (textSample || filename || '').toLowerCase();
  
  if (lower.includes('bengali') || lower.includes('khatian') || lower.includes('khotian')) {
    return {
      detectedLanguage: 'Bengali',
      script: 'Bengali',
      confidence: 91.2,
      ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Bengali Mod)',
      isSimulated: true,
      sampleKeywordsFound: ['খতিয়ান', 'দাগ নম্বর', 'মৌজা']
    };
  }
  if (lower.includes('marathi') || lower.includes('712') || lower.includes('satbara')) {
    return {
      detectedLanguage: 'Marathi',
      script: 'Devanagari',
      confidence: 93.4,
      ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Marathi Mod)',
      isSimulated: true,
      sampleKeywordsFound: ['७/१२ उतारा', 'खाते क्रमांक', 'फेरफार']
    };
  }
  if (lower.includes('tamil') || lower.includes('patta')) {
    return {
      detectedLanguage: 'Tamil',
      script: 'Tamil',
      confidence: 90.5,
      ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Tamil Mod)',
      isSimulated: true,
      sampleKeywordsFound: ['பட்டா', 'சர்வே எண்', 'கிராமம்']
    };
  }
  if (lower.includes('gujarati') || lower.includes('satbaro')) {
    return {
      detectedLanguage: 'Gujarati',
      script: 'Gujarati',
      confidence: 92.0,
      ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Gujarati Mod)',
      isSimulated: true,
      sampleKeywordsFound: ['૭/૧૨ નો ઉતારો', 'ખાતા નંબર']
    };
  }
  if (lower.includes('english') || lower.includes('deed') || lower.includes('conveyance') || lower.includes('reg-')) {
    return {
      detectedLanguage: 'English',
      script: 'Latin',
      confidence: 96.8,
      ocrEngine: 'Tesseract OCR v5.3 + Standard Legal NER',
      isSimulated: true,
      sampleKeywordsFound: ['Record of Rights', 'Khasra Number', 'Sub-Registrar', 'Conveyance']
    };
  }

  // Default to Hindi (Jharkhand primary revenue language)
  return {
    detectedLanguage: 'Hindi',
    script: 'Devanagari',
    confidence: 94.2,
    ocrEngine: 'Tesseract OCR v5.3 + Indic-NER (Hindi Mod)',
    isSimulated: true,
    sampleKeywordsFound: ['जमाबंदी पंजी', 'खाता संख्या', 'खेसरा', 'रैयत का नाम']
  };
}
