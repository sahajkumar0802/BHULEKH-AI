export type SupportedAppLanguage = 'hi' | 'en' | 'bn' | 'mr' | 'te' | 'ta' | 'gu' | 'ur';

export interface AppLanguageInfo {
  code: SupportedAppLanguage;
  name: string;
  nativeName: string;
  script: string;
  direction: 'ltr' | 'rtl';
  description: string;
  badge?: string;
  flagIcon?: string;
}

export const SUPPORTED_LANGUAGES: AppLanguageInfo[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    direction: 'ltr',
    description: 'राजभाषा • राष्ट्रीय आधिकारिक भाषा',
    badge: 'राजभाषा'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    direction: 'ltr',
    description: 'Official Administrative & Statutory Records',
    badge: 'Official'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    direction: 'ltr',
    description: 'পশ্চিমবঙ্গ, ত্রিপুরা ও পূর্ব ভারত অঞ্চল',
    badge: 'পূর্বাঞ্চল'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    direction: 'ltr',
    description: 'महाराष्ट्र शासन महसूल व भूमी अभिलेख',
    badge: 'पश्चिमांचल'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    direction: 'ltr',
    description: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ భూమి రికార్డులు',
    badge: 'దక్షిణాది'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    direction: 'ltr',
    description: 'தமிழ்நாடு நில வருவாய் & பட்டா பதிவுகள்',
    badge: 'தென்னகம்'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    direction: 'ltr',
    description: 'ગુજરાત રાજ્ય મહેસૂલ અને જમીન દસ્તાવેજ',
    badge: 'પશ્ચિમી'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Nastaliq / Arabic',
    direction: 'rtl',
    description: 'قومی و ریاستی دفتری زبان • دائیں سے بائیں',
    badge: 'دفتری زبان'
  }
];

export interface TranslationDictionary {
  // Portal & Branding
  portalTitle: string;
  portalSubtitle: string;
  ministryName: string;
  deptName: string;
  nationalSystem: string;

  // Navigation & Actions
  navMap: string;
  navCitizenDashboard: string;
  navOfficialDashboard: string;
  navUploadDoc: string;
  navTrackProgress: string;
  navCheckDoc: string;
  navLogout: string;
  navSignIn: string;
  navChangeJurisdiction: string;
  navHelp: string;

  // Language Selection Screen
  step1Title: string;
  step1Subtitle: string;
  step2Title: string;
  step2Subtitle: string;
  step3Title: string;
  step3Subtitle: string;
  step4Title: string;
  step4Subtitle: string;
  selectLanguageTitle: string;
  selectLanguageDesc: string;
  selectedLanguageLabel: string;
  continueToDistrictMap: string;
  backToState: string;
  backToLanguage: string;
  backToDistrict: string;
  proceedToBlockMap: string;
  proceedToLandRecords: string;
  selectStateFirst: string;
  noLanguageSelectedAlert: string;
  activeLanguageBadge: string;
  stepProgress: string;
  currentJurisdiction: string;

  // Citizen Dashboard
  welcomeCitizen: string;
  aadhaarVerifiedBadge: string;
  aadhaarIdLabel: string;
  commandCentreTitle: string;
  commandCentreSub: string;
  expandMetrics: string;
  collapseMetrics: string;
  primaryServicesTitle: string;

  // Citizen Action Cards
  cardMapTitle: string;
  cardMapDesc: string;
  cardMapBtn: string;
  cardUploadTitle: string;
  cardUploadDesc: string;
  cardUploadBtn: string;
  cardCheckTitle: string;
  cardCheckDesc: string;
  cardCheckBtn: string;
  cardTrackTitle: string;
  cardTrackDesc: string;
  cardTrackBtn: string;

  // Dashboard Summary & Applications
  myApplicationsTitle: string;
  myApplicationsSubtitle: string;
  openTrackerBtn: string;
  totalApplications: string;
  underVerification: string;
  actionRequired: string;
  approvedDone: string;
  myLinkedLandParcels: string;
  myLinkedLandSubtitle: string;
  khasraLabel: string;
  khataLabel: string;
  villageLabel: string;
  areaLabel: string;
  statusLabel: string;
  riskScoreLabel: string;
  viewDigitalTwin: string;
  viewCaseDetails: string;

  // AI Assistant Chatbox
  assistantTitle: string;
  assistantSubtitle: string;
  assistantWelcome: string;
  assistantPlaceholder: string;
  assistantSendBtn: string;
  assistantSuggestedTitle: string;
  assistantClearChat: string;
  assistantMinimize: string;
  assistantClose: string;
  assistantOfflineNotice: string;
  assistantDisclaimer: string;
  assistantThinking: string;
  assistantActionNavigate: string;

  // Suggested Prompts
  promptUploadDoc: string;
  promptTrackApp: string;
  promptCheckRecords: string;
  promptValidationScore: string;
  promptVerifyWorkflow: string;

  // Footer & Compliance
  footerCopyright: string;
  footerCompliance: string;
  footerSecurityNotice: string;
  footerDigitalIndia: string;
  footerAccessibility: string;
  footerPrivacy: string;
  footerTerms: string;
  footerHelpline: string;
}

export const TRANSLATIONS: Record<SupportedAppLanguage, TranslationDictionary> = {
  // 1. Hindi (हिन्दी)
  hi: {
    portalTitle: 'भूलेख एआई',
    portalSubtitle: 'राष्ट्रीय भूमि अभिलेख डिजिटलीकरण एवं सत्यापन प्रणाली',
    ministryName: 'भारत सरकार | ग्रामीण विकास मंत्रालय',
    deptName: 'भूमि संसाधन विभाग (DILRMP)',
    nationalSystem: 'डिजिटल इंडिया भूमि अभिलेख आधुनिकीकरण कार्यक्रम',

    navMap: 'मानचित्र प्रणाली',
    navCitizenDashboard: 'नागरिक डैशबोर्ड',
    navOfficialDashboard: 'अधिकारी डैशबोर्ड',
    navUploadDoc: 'दस्तावेज़ अपलोड',
    navTrackProgress: 'आवेदन स्थिति',
    navCheckDoc: '14-अंकीय खोज',
    navLogout: 'लॉगआउट',
    navSignIn: 'लॉग इन करें',
    navChangeJurisdiction: 'अधिकार क्षेत्र बदलें',
    navHelp: 'सहायता केंद्र',

    step1Title: 'चरण 1: राज्य का चयन करें',
    step1Subtitle: 'ड्रॉपडाउन से अपना राज्य चुनें जहां आपकी भूमि स्थित है।',
    step2Title: 'चरण 2: पोर्टल भाषा का चयन करें',
    step2Subtitle: 'अपनी पसंदीदा भाषा चुनें। सभी 8 आधिकारिक भाषाएं उपलब्ध हैं।',
    step3Title: 'चरण 3: जिला मानचित्र चुनें',
    step3Subtitle: 'मानचित्र पर सीधे अपने जिले पर क्लिक करें।',
    step4Title: 'चरण 4: प्रखण्ड (ब्लॉक) मानचित्र चुनें',
    step4Subtitle: 'अपने प्रखण्ड पर क्लिक कर भू-अभिलेख देखें।',
    selectLanguageTitle: 'भाषा का चयन करें | Select Language',
    selectLanguageDesc: 'सटीक भू-अभिलेख, खतियान, जमाबंदी एवं कैडस्ट्रल नक्शे देखने के लिए अपनी भाषा चुनें।',
    selectedLanguageLabel: 'चयनित भाषा',
    continueToDistrictMap: 'जिला मानचित्र पर आगे बढ़ें',
    backToState: 'राज्य बदलें',
    backToLanguage: 'भाषा बदलें',
    backToDistrict: 'जिला बदलें',
    proceedToBlockMap: 'प्रखण्ड मानचित्र पर जाएं',
    proceedToLandRecords: 'भूमि अभिलेख एवं डैशबोर्ड पर जाएं',
    selectStateFirst: 'कृपया पहले राज्य चुनें',
    noLanguageSelectedAlert: 'आगे बढ़ने के लिए कृपया एक भाषा चुनें।',
    activeLanguageBadge: 'सक्रिय',
    stepProgress: 'प्रगति चरण',
    currentJurisdiction: 'वर्तमान अधिकार क्षेत्र',

    welcomeCitizen: 'स्वागत है,',
    aadhaarVerifiedBadge: 'आधार प्रमाणित नागरिक',
    aadhaarIdLabel: 'आधार संख्या:',
    commandCentreTitle: 'राष्ट्रीय भूमि अभिलेख डिजिटलीकरण स्थिति (DILRMP 2.0)',
    commandCentreSub: 'ग्रामीण विकास मंत्रालय • भूमि संसाधन विभाग',
    expandMetrics: 'विस्तार करें',
    collapseMetrics: 'संक्षिप्त करें',
    primaryServicesTitle: 'प्रमुख नागरिक सेवाएं',

    cardMapTitle: 'स्थान एवं प्रखण्ड मानचित्र',
    cardMapDesc: 'झारखण्ड के सभी 24 जिलों एवं गिरिडीह के 13 प्रखण्डों का संपूर्ण भौगोलिक मानचित्र देखें।',
    cardMapBtn: 'मानचित्र खोलें',
    cardUploadTitle: 'दस्तावेज़ अपलोड एवं सत्यापन',
    cardUploadDesc: 'पंजीकृत विक्रय विलेख, खतियान/RoR अथवा सहायक राजस्व अभिलेख अपलोड कर एआई ओसीआर व विसंगति जांच कराएं।',
    cardUploadBtn: 'अपलोड प्रक्रिया शुरू करें',
    cardCheckTitle: '14-अंकीय भू-आधार (ULPIN) खोज',
    cardCheckDesc: '14-अंकीय सत्यापन आईडी अथवा खसरा संख्या दर्ज कर आधिकारिक भूमि स्वामित्व, वित्तीय लगान स्थिति व जीआईएस मानचित्र देखें।',
    cardCheckBtn: 'रिकॉर्ड खोजें',
    cardTrackTitle: '3-स्तरीय सत्यापन स्थिति एवं अपील',
    cardTrackDesc: 'BDO → अंचल अधिकारी (CO) → समाहर्ता की चरणबद्ध स्थिति देखें और अस्वीकृति पर वैधानिक अपील दर्ज करें।',
    cardTrackBtn: 'सत्यापन स्थिति देखें',

    myApplicationsTitle: 'मेरे जमा किए गए आवेदन एवं लाइव ट्रैकिंग',
    myApplicationsSubtitle: 'आधार संख्या से जुड़े सभी सक्रिय भूमि अभिलेख सत्यापन मामलों की वास्तविक समय स्थिति।',
    openTrackerBtn: 'सभी आवेदन देखें (ट्रैकर)',
    totalApplications: 'कुल आवेदन',
    underVerification: 'सत्यापनाधीन',
    actionRequired: 'कार्रवाई आवश्यक',
    approvedDone: 'स्वीकृत / पूर्ण',
    myLinkedLandParcels: 'मेरे लिंक किए गए भूमि पार्सल (डिजिटल खतियान)',
    myLinkedLandSubtitle: 'आधार प्रमाणीकरण द्वारा सत्यापित आपकी भूमि जमाबंदी एवं कैडस्ट्रल जीआईएस रिकॉर्ड।',
    khasraLabel: 'खसरा सं.',
    khataLabel: 'खाता सं.',
    villageLabel: 'ग्राम',
    areaLabel: 'क्षेत्रफल',
    statusLabel: 'स्थिति',
    riskScoreLabel: 'जोखिम स्कोर',
    viewDigitalTwin: '360° डिजिटल लैंड ट्विन देखें',
    viewCaseDetails: 'मामला विवरण देखें',

    assistantTitle: 'भूलेख एआई सहायक',
    assistantSubtitle: 'नागरिक भूमि अभिलेख एवं सत्यापन मार्गदर्शक',
    assistantWelcome: 'नमस्ते! मैं **भूलेख एआई सहायक** हूँ। मैं दस्तावेज़ अपलोड, आवेदन ट्रैकिंग, भू-अभिलेख सत्यापन और पोर्टल नेविगेशन में आपकी सहायता कर सकता हूँ। नीचे दिए गए सुझावों में से चुनें या अपना प्रश्न लिखें।',
    assistantPlaceholder: 'भू-अभिलेख, दस्तावेज़ या सत्यापन के संबंध में प्रश्न पूछें...',
    assistantSendBtn: 'भेजें',
    assistantSuggestedTitle: 'सुझाए गए प्रश्न:',
    assistantClearChat: 'नई बातचीत',
    assistantMinimize: 'न्यूनतम करें',
    assistantClose: 'बंद करें',
    assistantOfflineNotice: 'एआई मॉडल ऑफ़लाइन मोड में है। आधिकारिक राजस्व नियम इंजन द्वारा त्वरित उत्तर प्रदान किए जा रहे हैं।',
    assistantDisclaimer: 'सूचना: यह सहायक केवल मार्गदर्शन हेतु है। विधिक सत्यापन व नामांतरण का अधिकार केवल अधिकृत राजस्व अधिकारियों के पास है।',
    assistantThinking: 'सहायक विचार कर रहा है...',
    assistantActionNavigate: 'संबंधित पृष्ठ खोलें',

    promptUploadDoc: 'मैं अपना भूमि दस्तावेज़ कैसे अपलोड करूँ?',
    promptTrackApp: 'मैं अपने आवेदन की स्थिति कैसे ट्रैक करूँ?',
    promptCheckRecords: 'मैं अपने भूमि रिकॉर्ड की जांच कैसे करूँ?',
    promptValidationScore: 'दस्तावेज़ सत्यापन परिणाम और जोखिम स्कोर का क्या अर्थ है?',
    promptVerifyWorkflow: 'सरकारी सत्यापन प्रक्रिया कैसे कार्य करती है?',

    footerCopyright: '© 2026 भारत सरकार | भूमि संसाधन विभाग | सर्वाधिकार सुरक्षित',
    footerCompliance: 'DILRMP 2.0 • राष्ट्रीय सूचना विज्ञान केंद्र (NIC) मानकों के अनुरूप',
    footerSecurityNotice: 'सभी डेटा 256-बिट SSL द्वारा सुरक्षित है। आधार बायोमेट्रिक प्रमाणीकरण UIDAI मानकों के अनुरूप।',
    footerDigitalIndia: 'डिजिटल इंडिया पहल',
    footerAccessibility: 'सुगमता कथन',
    footerPrivacy: 'गोपनीयता नीति',
    footerTerms: 'उपयोग की शर्तें',
    footerHelpline: 'टोल-फ्री हेल्पलाइन: 1800-111-555'
  },

  // 2. English
  en: {
    portalTitle: 'BHULEKH AI',
    portalSubtitle: 'National Land Record Digitization & Verification System',
    ministryName: 'Government of India | Ministry of Rural Development',
    deptName: 'Department of Land Resources (DILRMP)',
    nationalSystem: 'Digital India Land Records Modernization Programme',

    navMap: 'Map System',
    navCitizenDashboard: 'Citizen Dashboard',
    navOfficialDashboard: 'Official Dashboard',
    navUploadDoc: 'Upload Document',
    navTrackProgress: 'Track Progress',
    navCheckDoc: 'Check Document',
    navLogout: 'Logout',
    navSignIn: 'Sign In',
    navChangeJurisdiction: 'Change Jurisdiction',
    navHelp: 'Help Center',

    step1Title: 'Step 1: Select State',
    step1Subtitle: 'Select the state where your land parcel is located.',
    step2Title: 'Step 2: Select Portal Language',
    step2Subtitle: 'Choose your preferred language. All 8 official languages available.',
    step3Title: 'Step 3: Select District Map',
    step3Subtitle: 'Click directly on your district on the interactive map.',
    step4Title: 'Step 4: Select Block Map',
    step4Subtitle: 'Select your block (Tehsil) to inspect land records.',
    selectLanguageTitle: 'Select Your Language | भाषा का चयन करें',
    selectLanguageDesc: 'Select your preferred language to inspect land records, Khatiyan, Jamabandi, and cadastral maps.',
    selectedLanguageLabel: 'Selected Language',
    continueToDistrictMap: 'Proceed to District Map',
    backToState: 'Change State',
    backToLanguage: 'Change Language',
    backToDistrict: 'Change District',
    proceedToBlockMap: 'Proceed to Block Map',
    proceedToLandRecords: 'Proceed to Land Records & Dashboard',
    selectStateFirst: 'Please select a state first',
    noLanguageSelectedAlert: 'Please select a language before proceeding.',
    activeLanguageBadge: 'Active',
    stepProgress: 'Step Progress',
    currentJurisdiction: 'Current Jurisdiction',

    welcomeCitizen: 'Welcome,',
    aadhaarVerifiedBadge: 'Aadhaar Verified Citizen',
    aadhaarIdLabel: 'Aadhaar ID:',
    commandCentreTitle: 'National Land Digitalisation Command Status (DILRMP 2.0)',
    commandCentreSub: 'Ministry of Rural Development • Department of Land Resources',
    expandMetrics: 'Expand Metrics',
    collapseMetrics: 'Collapse',
    primaryServicesTitle: 'Primary Citizen Services',

    cardMapTitle: 'Interactive Location Map',
    cardMapDesc: 'Explore interactive 24-district map of Jharkhand and 13-block map of Giridih.',
    cardMapBtn: 'Open Map',
    cardUploadTitle: 'Upload Document & AI Scan',
    cardUploadDesc: 'Upload Registered Sale Deed, Khatiyan or Alternative records for instant AI extraction & discrepancy validation.',
    cardUploadBtn: 'Start Upload',
    cardCheckTitle: 'Check Record (14-Digit ULPIN)',
    cardCheckDesc: 'Enter 14-digit verification ID or Khasra number to inspect legal title, tax dues, and cadastral maps.',
    cardCheckBtn: 'Search Record',
    cardTrackTitle: 'Track 3-Stage Progress & Appeals',
    cardTrackDesc: 'View live statutory verification pipeline (BDO → CO → Collector) and file quasi-judicial appeals.',
    cardTrackBtn: 'View Pipeline',

    myApplicationsTitle: 'My Submitted Applications & Tracking Status',
    myApplicationsSubtitle: 'Real-time tracking of all revenue record verification applications submitted under your authenticated profile.',
    openTrackerBtn: 'Open Full Application Tracker',
    totalApplications: 'Total Applications',
    underVerification: 'Under Verification',
    actionRequired: 'Action Required',
    approvedDone: 'Approved / Done',
    myLinkedLandParcels: 'My Linked Land Parcels (Digital Khatiyan)',
    myLinkedLandSubtitle: 'Land parcels and cadastral GIS boundaries linked to your verified Aadhaar profile.',
    khasraLabel: 'Khasra No.',
    khataLabel: 'Khata No.',
    villageLabel: 'Village',
    areaLabel: 'Area',
    statusLabel: 'Status',
    riskScoreLabel: 'Risk Score',
    viewDigitalTwin: 'View 360° Digital Land Twin',
    viewCaseDetails: 'View Case Details',

    assistantTitle: 'Bhulekh AI Assistant',
    assistantSubtitle: 'Citizen Land Records & Verification Copilot',
    assistantWelcome: 'Namaste! I am the **Bhulekh AI Assistant**. I can help you understand how to upload documents, track verification cases, inspect land records, and navigate the BHULEKH AI platform. Choose a suggested topic below or type your question.',
    assistantPlaceholder: 'Ask about land records, document uploads, or verification status...',
    assistantSendBtn: 'Send',
    assistantSuggestedTitle: 'Suggested Questions:',
    assistantClearChat: 'New Conversation',
    assistantMinimize: 'Minimize',
    assistantClose: 'Close',
    assistantOfflineNotice: 'AI Provider is in offline mode. Responses are grounded in official revenue rule engines.',
    assistantDisclaimer: 'Notice: This assistant provides procedural guidance only. Official title sanction and legal determinations rest solely with authorized Revenue Officers.',
    assistantThinking: 'Assistant is generating response...',
    assistantActionNavigate: 'Open Feature',

    promptUploadDoc: 'How do I upload my land document?',
    promptTrackApp: 'How can I track my application?',
    promptCheckRecords: 'How do I check my land records?',
    promptValidationScore: 'What does my document validation result mean?',
    promptVerifyWorkflow: 'How does the verification process work?',

    footerCopyright: '© 2026 Government of India | Department of Land Resources | All Rights Reserved',
    footerCompliance: 'DILRMP 2.0 • In compliance with NIC & Digital India guidelines',
    footerSecurityNotice: 'All data is encrypted with 256-bit SSL. Aadhaar verification complies with UIDAI standards.',
    footerDigitalIndia: 'Digital India Initiative',
    footerAccessibility: 'Accessibility Statement',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Use',
    footerHelpline: 'Toll-Free Helpline: 1800-111-555'
  },

  // 3. Bengali (বাংলা)
  bn: {
    portalTitle: 'ভূলেখ এআই',
    portalSubtitle: 'জাতীয় ভূমি রেকর্ড ডিজিটাইজেশন ও যাচাইকরণ পোর্টাল',
    ministryName: 'ভারত সরকার | পল্লী উন্নয়ন মন্ত্রক',
    deptName: 'ভূমি সম্পদ বিভাগ (DILRMP)',
    nationalSystem: 'ডিজিটাল ইন্ডিয়া ল্যান্ড রেকর্ডস আধুনিকীকরণ কর্মসূচি',

    navMap: 'মানচিত্র ব্যবস্থা',
    navCitizenDashboard: 'নাগরিক ড্যাশবোর্ড',
    navOfficialDashboard: 'অফিসার ড্যাশবোর্ড',
    navUploadDoc: 'নথি আপলোড',
    navTrackProgress: 'আবেদনের স্থিতি',
    navCheckDoc: '১৪-সংখ্যার অনুসন্ধান',
    navLogout: 'লগআউট',
    navSignIn: 'লগইন করুন',
    navChangeJurisdiction: 'এলাকা পরিবর্তন',
    navHelp: 'সহায়তা কেন্দ্র',

    step1Title: 'ধাপ ১: রাজ্য নির্বাচন করুন',
    step1Subtitle: 'আপনার জমি অবস্থিত রাজ্যটি ড্রপডাউন থেকে নির্বাচন করুন।',
    step2Title: 'ধাপ ২: পোর্টালের ভাষা নির্বাচন করুন',
    step2Subtitle: 'আপনার পছন্দের ভাষা বেছে নিন। সকল ৮টি ভাষা উপলব্ধ।',
    step3Title: 'ধাপ ৩: জেলা মানচিত্র নির্বাচন করুন',
    step3Subtitle: 'মানচিত্রে সরাসরি আপনার জেলার উপর ক্লিক করুন।',
    step4Title: 'ধাপ ৪: ব্লক মানচিত্র নির্বাচন করুন',
    step4Subtitle: 'আপনার ব্লকে ক্লিক করে জমির খতিয়ান ও রেকর্ড দেখুন।',
    selectLanguageTitle: 'ভাষা নির্বাচন করুন | Select Language',
    selectLanguageDesc: 'জমির রেকর্ড, খতিয়ান, জমা বন্দি এবং ক্যাডাস্ট্রাল মানচিত্র দেখতে আপনার ভাষা নির্বাচন করুন।',
    selectedLanguageLabel: 'নির্বাচিত ভাষা',
    continueToDistrictMap: 'জেলা মানচিত্রে এগিয়ে যান',
    backToState: 'রাজ্য পরিবর্তন',
    backToLanguage: 'ভাষা পরিবর্তন',
    backToDistrict: 'জেলা পরিবর্তন',
    proceedToBlockMap: 'ব্লক মানচিত্রে যান',
    proceedToLandRecords: 'জমি রেকর্ড ও ড্যাশবোর্ডে যান',
    selectStateFirst: 'প্রথমে একটি রাজ্য নির্বাচন করুন',
    noLanguageSelectedAlert: 'এগিয়ে যাওয়ার আগে অনুগ্রহ করে একটি ভাষা নির্বাচন করুন।',
    activeLanguageBadge: 'সক্রিয়',
    stepProgress: 'অগ্রগতি ধাপ',
    currentJurisdiction: 'বর্তমান এলাকা',

    welcomeCitizen: 'স্বাগতম,',
    aadhaarVerifiedBadge: 'আধার যাচাইকৃত নাগরিক',
    aadhaarIdLabel: 'আধার নম্বর:',
    commandCentreTitle: 'জাতীয় ভূমি ডিজিটাইজেশন কমান্ড স্থিতি (DILRMP 2.0)',
    commandCentreSub: 'পল্লী উন্নয়ন মন্ত্রক • ভূমি সম্পদ বিভাগ',
    expandMetrics: 'প্রসারিত করুন',
    collapseMetrics: 'সংক্ষেপ করুন',
    primaryServicesTitle: 'প্রধান নাগরিক পরিষেবা',

    cardMapTitle: 'ইন্টারেক্টিভ ভৌগোলিক মানচিত্র',
    cardMapDesc: 'ঝাড়খণ্ডের ২৪টি জেলা এবং গিরিডিহের ১৩টি ব্লকের পূর্ণ ভৌগোলিক মানচিত্র দেখুন।',
    cardMapBtn: 'মানচিত্র খুলুন',
    cardUploadTitle: 'নথি আপলোড ও এআই স্ক্যান',
    cardUploadDesc: 'বিক্রয় দলিল, খতিয়ান বা সহায়ক নথি আপলোড করে তাৎক্ষণিক এআই যাচাইকরণ করান।',
    cardUploadBtn: 'আপলোড শুরু করুন',
    cardCheckTitle: '১৪-সংখ্যার ভূ-আধার (ULPIN) অনুসন্ধান',
    cardCheckDesc: '১৪-সংখ্যার যাচাইকরণ আইডি বা খসরা নম্বর দিয়ে জমির মালিকানা ও রাজস্ব স্থিতি দেখুন।',
    cardCheckBtn: 'রেকর্ড খুঁজুন',
    cardTrackTitle: '৩-স্তরের যাচাইকরণ স্থিতি ও আপিল',
    cardTrackDesc: 'BDO → সার্কেল অফিসার (CO) → কালেক্টরের ধাপ দেখুন এবং প্রয়োজনে আপিল দায়ের করুন।',
    cardTrackBtn: 'স্থিতি দেখুন',

    myApplicationsTitle: 'আমার জমাকৃত আবেদন ও লাইভ ট্র্যাকিং',
    myApplicationsSubtitle: 'আধার নম্বরের সাথে যুক্ত সমস্ত সক্রিয় ভূমি রেকর্ড যাচাইকরণ আবেদনের রিয়েল-টাইম অবস্থা।',
    openTrackerBtn: 'সম্পূর্ণ ট্র্যাকার খুলুন',
    totalApplications: 'মোট আবেদন',
    underVerification: 'যাচাইাধীন',
    actionRequired: 'পদক্ষেপ প্রয়োজন',
    approvedDone: 'অনুমোদিত / সম্পন্ন',
    myLinkedLandParcels: 'আমার যুক্ত জমির পার্সেল (ডিজিটাল খতিয়ান)',
    myLinkedLandSubtitle: 'আপনার যাচাইকৃত আধার প্রোফাইলের সাথে যুক্ত জমি ও জিআইএস সীমানা।',
    khasraLabel: 'খসরা নং',
    khataLabel: 'খতিয়ান নং',
    villageLabel: 'গ্রাম',
    areaLabel: 'আয়তন',
    statusLabel: 'অবস্থা',
    riskScoreLabel: 'ঝুঁকি স্কোর',
    viewDigitalTwin: '৩৬০° ডিজিটাল ল্যান্ড টুইন দেখুন',
    viewCaseDetails: 'কেস বিবরণ দেখুন',

    assistantTitle: 'ভূলেখ এআই সহকারী',
    assistantSubtitle: 'নাগরিক ভূমি রেকর্ড ও যাচাইকরণ নির্দেশক',
    assistantWelcome: 'নমস্কার! আমি **ভূলেখ এআই সহকারী**। নথি আপলোড, আবেদন ট্র্যাকিং, ভূমি রেকর্ড যাচাইকরণ এবং পোর্টাল ব্যবহারে আমি আপনাকে সাহায্য করতে পারি। নিচের প্রস্তাবিত বিষয়গুলি থেকে বেছে নিন অথবা আপনার প্রশ্ন লিখুন।',
    assistantPlaceholder: 'ভূমি রেকর্ড বা যাচাইকরণ সম্পর্কে প্রশ্ন লিখুন...',
    assistantSendBtn: 'পাঠান',
    assistantSuggestedTitle: 'প্রস্তাবিত প্রশ্নাবলী:',
    assistantClearChat: 'নতুন বার্তালাপ',
    assistantMinimize: 'ছোট করুন',
    assistantClose: 'বন্ধ করুন',
    assistantOfflineNotice: 'এআই মডেল অফলাইন মোডে রয়েছে। সরকারি রাজস্ব নিয়মানুযায়ী তাৎক্ষণিক উত্তর দেওয়া হচ্ছে।',
    assistantDisclaimer: 'বিজ্ঞপ্তি: এই সহকারী কেবল তথ্য ও নির্দেশনার জন্য। আইনি যাচাইকরণ ও অনুমোদনের চূড়ান্ত ক্ষমতা কেবল রাজস্ব আধিকারিকদের রয়েছে।',
    assistantThinking: 'সহকারী উত্তর তৈরি করছে...',
    assistantActionNavigate: 'পৃষ্ঠা খুলুন',

    promptUploadDoc: 'আমি কিভাবে আমার জমির নথি আপলোড করব?',
    promptTrackApp: 'আমি কিভাবে আমার আবেদনের স্থিতি ট্র্যাক করব?',
    promptCheckRecords: 'আমি কিভাবে আমার জমির রেকর্ড পরীক্ষা করব?',
    promptValidationScore: 'নথি যাচাইকরণের ফলাফল এবং ঝুঁকি স্কোরের অর্থ কী?',
    promptVerifyWorkflow: 'সরকারি যাচাইকরণ প্রক্রিয়া কীভাবে কাজ করে?',

    footerCopyright: '© ২০২৬ ভারত সরকার | ভূমি সম্পদ বিভাগ | সর্বস্বত্ব সংরক্ষিত',
    footerCompliance: 'DILRMP 2.0 • এনআইসি ও ডিজিটাল ইন্ডিয়া মানদণ্ড অনুযায়ী',
    footerSecurityNotice: 'সমস্ত ডেটা ২৫৬-বিট এসএসএল দ্বারা সুরক্ষিত। আধার যাচাইকরণ UIDAI মানদণ্ড অনুযায়ী।',
    footerDigitalIndia: 'ডিজিটাল ইন্ডিয়া উদ্যোগ',
    footerAccessibility: 'অভিগম্যতা বিবৃতি',
    footerPrivacy: 'গোপনীয়তা নীতি',
    footerTerms: 'ব্যবহারের শর্তাবলী',
    footerHelpline: 'টোল-ফ্রি হেল্পলাইন: ১৮০০-১১১-৫৫৫'
  },

  // 4. Marathi (मराठी)
  mr: {
    portalTitle: 'भूलेख एआय',
    portalSubtitle: 'राष्ट्रीय भूमी अभिलेख डिजिटायझेशन व पडताळणी प्रणाली',
    ministryName: 'भारत सरकार | ग्रामीण विकास मंत्रालय',
    deptName: 'भूमी संसाधन विभाग (DILRMP)',
    nationalSystem: 'डिजिटल इंडिया भूमी अभिलेख आधुनिकीकरण कार्यक्रम',

    navMap: 'नकाशा प्रणाली',
    navCitizenDashboard: 'नागरिक डॅशबोर्ड',
    navOfficialDashboard: 'अधिकारी डॅशबोर्ड',
    navUploadDoc: 'दस्तऐवज अपलोड',
    navTrackProgress: 'अर्जाची स्थिती',
    navCheckDoc: '१४-अंकी शोध',
    navLogout: 'लॉगआउट',
    navSignIn: 'लॉगिन करा',
    navChangeJurisdiction: 'अधिकार क्षेत्र बदला',
    navHelp: 'मदत केंद्र',

    step1Title: 'टप्पा १: राज्य निवडा',
    step1Subtitle: 'ड्रॉपडाउनमधून आपली जमीन असलेले राज्य निवडा.',
    step2Title: 'टप्पा २: पोर्टलची भाषा निवडा',
    step2Subtitle: 'आपली पसंतीची भाषा निवडा. सर्व ८ अधिकृत भाषा उपलब्ध आहेत.',
    step3Title: 'टप्पा ३: जिल्हा नकाशा निवडा',
    step3Subtitle: 'नकाशावर थेट आपल्या जिल्ह्यावर क्लिक करा.',
    step4Title: 'टप्पा ४: तालुका (ब्लॉक) नकाशा निवडा',
    step4Subtitle: 'आपल्या तालुक्यावर क्लिक करून जमिनीचे ७/१२ व अभिलेख पहा.',
    selectLanguageTitle: 'भाषा निवडा | Select Language',
    selectLanguageDesc: 'जमिनीचे अभिलेख, खतियान, जमाबंदी आणि कॅडस्ट्रल नकाशे पाहण्यासाठी आपली भाषा निवडा.',
    selectedLanguageLabel: 'निवडलेली भाषा',
    continueToDistrictMap: 'जिल्हा नकाशावर पुढे जा',
    backToState: 'राज्य बदला',
    backToLanguage: 'भाषा बदला',
    backToDistrict: 'जिल्हा बदला',
    proceedToBlockMap: 'तालुका नकाशावर जा',
    proceedToLandRecords: 'भूमी अभिलेख व डॅशबोर्डवर जा',
    selectStateFirst: 'कृपया आधी राज्य निवडा',
    noLanguageSelectedAlert: 'पुढे जाण्यापूर्वी कृपया एक भाषा निवडा.',
    activeLanguageBadge: 'सक्रिय',
    stepProgress: 'प्रगती टप्पा',
    currentJurisdiction: 'सध्याचे अधिकार क्षेत्र',

    welcomeCitizen: 'स्वागत आहे,',
    aadhaarVerifiedBadge: 'आधार प्रमाणित नागरिक',
    aadhaarIdLabel: 'आधार क्रमांक:',
    commandCentreTitle: 'राष्ट्रीय भूमी डिजिटायझेशन कमांड स्थिती (DILRMP 2.0)',
    commandCentreSub: 'ग्रामीण विकास मंत्रालय • भूमी संसाधन विभाग',
    expandMetrics: 'विस्तार करा',
    collapseMetrics: 'संक्षिप्त करा',
    primaryServicesTitle: 'प्रमुख नागरिक सेवा',

    cardMapTitle: 'स्थान व तालुका नकाशा',
    cardMapDesc: 'झारखंडमधील सर्व २४ जिल्हे आणि गिरिडीहमधील १३ तालुक्यांचा नकाशा पहा.',
    cardMapBtn: 'नकाशा उघडा',
    cardUploadTitle: 'दस्तऐवज अपलोड व एआय स्कॅन',
    cardUploadDesc: 'नोंदणीकृत खरेदी खत, खतियान किंवा महसूल दस्तऐवज अपलोड करून एआय तपासणी करा.',
    cardUploadBtn: 'अपलोड सुरू करा',
    cardCheckTitle: '१४-अंकी भू-आधार (ULPIN) शोध',
    cardCheckDesc: '१४-अंकी पडताळणी आयडी किंवा खसरा क्रमांक टाकून मालकी व कर स्थिती पहा.',
    cardCheckBtn: 'अभिलेख शोधा',
    cardTrackTitle: '३-स्तरीय पडताळणी स्थिती व अपील',
    cardTrackDesc: 'BDO → मंडळ अधिकारी (CO) → जिल्हाधिकारी टप्प्यांची स्थिती पहा आणि अपील दाखल करा.',
    cardTrackBtn: 'स्थिती तपासा',

    myApplicationsTitle: 'माझे सादर केलेले अर्ज व थेट ट्रॅकिंग',
    myApplicationsSubtitle: 'आधार क्रमांकाशी जोडलेल्या सर्व सक्रिय जमीन पडताळणी प्रकरणांची रिअल-टाइम स्थिती.',
    openTrackerBtn: 'संपूर्ण ट्रॅकर उघडा',
    totalApplications: 'एकूण अर्ज',
    underVerification: 'पडताळणी सुरू',
    actionRequired: 'कारवाई आवश्यक',
    approvedDone: 'मंजूर / पूर्ण',
    myLinkedLandParcels: 'माझे जोडलेले जमीन पार्सल (डिजिटल खतियान)',
    myLinkedLandSubtitle: 'आपल्या आधारशी जोडलेली जमीन व जीआयएस सीमा.',
    khasraLabel: 'खसरा क्र.',
    khataLabel: 'खाते क्र.',
    villageLabel: 'गाव',
    areaLabel: 'क्षेत्रफळ',
    statusLabel: 'स्थिती',
    riskScoreLabel: 'धोका स्कोर',
    viewDigitalTwin: '३६०° डिजिटल लँड ट्विन पहा',
    viewCaseDetails: 'तपशील पहा',

    assistantTitle: 'भूलेख एआय सहाय्यक',
    assistantSubtitle: 'नागरिक भूमी अभिलेख व पडताळणी मार्गदर्शक',
    assistantWelcome: 'नमस्कार! मी **भूलेख एआय सहाय्यक** आहे. दस्तऐवज अपलोड, अर्ज ट्रॅकिंग, जमीन अभिलेख पडताळणी आणि पोर्टल वापरात मी मदत करू शकतो. खालील सुचवलेल्या विषयांवर क्लिक करा किंवा आपला प्रश्न विचारा.',
    assistantPlaceholder: 'भूमी अभिलेख, दस्तऐवज किंवा पडताळणीबाबत विचारा...',
    assistantSendBtn: 'पाठवा',
    assistantSuggestedTitle: 'सुचवलेले प्रश्न:',
    assistantClearChat: 'नवीन संभाषण',
    assistantMinimize: 'लहान करा',
    assistantClose: 'बंद करा',
    assistantOfflineNotice: 'एआय मॉडेल ऑफलाइन मोडमध्ये आहे. महसूल नियमांनुसार त्वरित उत्तरे दिली जात आहेत.',
    assistantDisclaimer: 'सूचना: हा सहाय्यक केवळ माहिती व मार्गदर्शनासाठी आहे. कायदेशीर पडताळणीचे अधिकार केवळ महसूल अधिकाऱ्यांकडे आहेत.',
    assistantThinking: 'सहाय्यक विचार करत आहे...',
    assistantActionNavigate: 'पृष्ठ उघडा',

    promptUploadDoc: 'मी माझे जमिनीचे दस्तऐवज कसे अपलोड करू?',
    promptTrackApp: 'मी माझ्या अर्जाची स्थिती कशी ट्रॅक करू?',
    promptCheckRecords: 'मी माझे जमिनीचे अभिलेख कसे तपासू?',
    promptValidationScore: 'दस्तऐवज पडताळणी निकाल आणि रिस्क स्कोरचा अर्थ काय आहे?',
    promptVerifyWorkflow: 'सरकारी पडताळणी प्रक्रिया कशी चालते?',

    footerCopyright: '© २०२६ भारत सरकार | भूमी संसाधन विभाग | सर्व हक्क राखीव',
    footerCompliance: 'DILRMP 2.0 • एनआयसी व डिजिटल इंडिया मार्गदर्शक तत्त्वांनुसार',
    footerSecurityNotice: 'सर्व डेटा २५६-बिट एसएसएल द्वारे सुरक्षित आहे. आधार पडताळणी UIDAI नियमांनुसार.',
    footerDigitalIndia: 'डिजिटल इंडिया उपक्रम',
    footerAccessibility: 'सुलभता विधान',
    footerPrivacy: 'गोपनीयता धोरण',
    footerTerms: 'वापराच्या अटी',
    footerHelpline: 'टोल-फ्री हेल्पलाइन: १८००-१११-५५५'
  },

  // 5. Telugu (తెలుగు)
  te: {
    portalTitle: 'భూలేఖ్ AI',
    portalSubtitle: 'జాతీయ భూ రికార్డుల డిజిటలైజేషన్ మరియు ధృవీకరణ వ్యవస్థ',
    ministryName: 'భారత ప్రభుత్వం | గ్రామీణాభివృద్ధి మంత్రిత్వ శాఖ',
    deptName: 'భూ వనరుల శాఖ (DILRMP)',
    nationalSystem: 'డిజిటల్ ఇండియా ల్యాండ్ రికార్డ్స్ ఆధునీకరణ కార్యక్రమం',

    navMap: 'మ్యాప్ సిస్టమ్',
    navCitizenDashboard: 'పౌరుల డ్యాష్‌బోర్డ్',
    navOfficialDashboard: 'అధికారుల డ్యాష్‌బోర్డ్',
    navUploadDoc: 'పత్రం అప్‌లోడ్',
    navTrackProgress: 'దరఖాస్తు స్థితి',
    navCheckDoc: '14-అంకెల శోధన',
    navLogout: 'లాగౌట్',
    navSignIn: 'లాగిన్ అవ్వండి',
    navChangeJurisdiction: 'పరిధి మార్చండి',
    navHelp: 'సహాయ కేంద్రం',

    step1Title: 'దశ 1: రాష్ట్రాన్ని ఎంచుకోండి',
    step1Subtitle: 'డ్రాప్‌డౌన్ నుండి మీ భూమి ఉన్న రాష్ట్రాన్ని ఎంచుకోండి.',
    step2Title: 'దశ 2: భాషను ఎంచుకోండి',
    step2Subtitle: 'మీ ప్రాధాన్యత గల భాషను ఎంచుకోండి. మొత్తం 8 భాషలు అందుబాటులో ఉన్నాయి.',
    step3Title: 'దశ 3: జిల్లా మ్యాప్‌ను ఎంచుకోండి',
    step3Subtitle: 'మ్యాప్‌పై నేరుగా మీ జిల్లాపై క్లిక్ చేయండి.',
    step4Title: 'దశ 4: మండలం (బ్లాక్) మ్యాప్‌ను ఎంచుకోండి',
    step4Subtitle: 'మీ మండలంపై క్లిక్ చేసి భూమి రికార్డులు చూడండి.',
    selectLanguageTitle: 'భాషను ఎంచుకోండి | Select Language',
    selectLanguageDesc: 'భూ రికార్డులు, ఖతియాన్, జమాబందీ మరియు మ్యాప్‌లను వీక్షించడానికి మీ భాషను ఎంచుకోండి.',
    selectedLanguageLabel: 'ఎంచుకున్న భాష',
    continueToDistrictMap: 'జిల్లా మ్యాప్‌కు వెళ్లండి',
    backToState: 'రాష్ట్రాన్ని మార్చండి',
    backToLanguage: 'భాషను మార్చండి',
    backToDistrict: 'జిల్లాను మార్చండి',
    proceedToBlockMap: 'బ్లాక్ మ్యాప్‌కు వెళ్లండి',
    proceedToLandRecords: 'భూ రికార్డులకు వెళ్లండి',
    selectStateFirst: 'దయచేసి ముందుగా రాష్ట్రాన్ని ఎంచుకోండి',
    noLanguageSelectedAlert: 'కొనసాగడానికి ముందు దయచేసి ఒక భాషను ఎంచుకోండి.',
    activeLanguageBadge: 'సక్రియం',
    stepProgress: 'పురోగతి దశ',
    currentJurisdiction: 'ప్రస్తుత అధికార పరిధి',

    welcomeCitizen: 'స్వాగతం,',
    aadhaarVerifiedBadge: 'ఆధార్ ధృవీకరించబడిన పౌరుడు',
    aadhaarIdLabel: 'ఆధార్ సంఖ్య:',
    commandCentreTitle: 'జాతీయ భూ డిజిటలైజేషన్ కమాండ్ స్థితి (DILRMP 2.0)',
    commandCentreSub: 'గ్రామీణాభివృద్ధి మంత్రిత్వ శాఖ • భూ వనరుల శాఖ',
    expandMetrics: 'వివరాలు చూడండి',
    collapseMetrics: 'కుదించండి',
    primaryServicesTitle: 'ప్రధాన పౌర సేవలు',

    cardMapTitle: 'భౌగోళిక మ్యాప్ సిస్టమ్',
    cardMapDesc: 'జార్ఖండ్‌లోని 24 జిల్లాలు మరియు గిరిడిహ్ 13 మండలాల సమగ్ర మ్యాప్‌ను చూడండి.',
    cardMapBtn: 'మ్యాప్ తెరవండి',
    cardUploadTitle: 'పత్రం అప్‌లోడ్ & AI స్కాన్',
    cardUploadDesc: 'రిజిస్టర్డ్ సేల్ డీడ్ లేదా ఖతియాన్ అప్‌లోడ్ చేసి తక్షణ AI విశ్లేషణ పొందండి.',
    cardUploadBtn: 'అప్‌లోడ్ ప్రారంభించండి',
    cardCheckTitle: '14-అంకెల భూ-ఆధార్ (ULPIN) శోధన',
    cardCheckDesc: '14-అంకెల ఐడీ లేదా ఖస్రా నంబర్ నమోదు చేసి యాజమాన్యం మరియు పన్ను స్థితిని చూడండి.',
    cardCheckBtn: 'రికార్డు శోధించండి',
    cardTrackTitle: '3-దశల ధృవీకరణ & అప్పీల్స్',
    cardTrackDesc: 'BDO → సర్కిల్ ఆఫీసర్ (CO) → కలెక్టర్ దశలను ట్రాక్ చేయండి మరియు అప్పీల్ దాఖలు చేయండి.',
    cardTrackBtn: 'స్థితి చూడండి',

    myApplicationsTitle: 'నా సమర్పించిన దరఖాస్తులు & ట్రాకింగ్',
    myApplicationsSubtitle: 'మీ ఆధార్‌తో అనుసంధానించబడిన అన్ని భూమి రికార్డు ధృవీకరణ కేసుల తాజా స్థితి.',
    openTrackerBtn: 'పూర్తి ట్రాకర్‌ను తెరవండి',
    totalApplications: 'మొత్తం దరఖాస్తులు',
    underVerification: 'ధృవీకరణలో ఉంది',
    actionRequired: 'చర్య అవసరం',
    approvedDone: 'ఆమోదించబడింది / పూర్తయింది',
    myLinkedLandParcels: 'నా లింక్ చేయబడిన భూమి పార్శిళ్లు (డిజిటల్ రికార్డులు)',
    myLinkedLandSubtitle: 'మీ ఆధార్‌తో ధృవీకరించబడిన భూమి రికార్డులు మరియు GIS సరిహద్దులు.',
    khasraLabel: 'ఖస్రా నం.',
    khataLabel: 'ఖాతా నం.',
    villageLabel: 'గ్రామం',
    areaLabel: 'విస్తీర్ణం',
    statusLabel: 'స్థితి',
    riskScoreLabel: 'రిస్క్ స్కోరు',
    viewDigitalTwin: '360° డిజిటల్ ల్యాండ్ ట్విన్ చూడండి',
    viewCaseDetails: 'వివరాలు చూడండి',

    assistantTitle: 'భూలేఖ్ AI అసిస్టెంట్',
    assistantSubtitle: 'పౌర భూ రికార్డులు & ధృవీకరణ గైడ్',
    assistantWelcome: 'నమస్కారం! నేను **భూలేఖ్ AI అసిస్టెంట్**ని. పత్రాల అప్‌లోడ్, దరఖాస్తు ట్రాకింగ్, భూ రికార్డుల ధృవీకరణలో నేను మీకు సహాయం చేయగలను. క్రింది సూచనలలో ఒకదాన్ని ఎంచుకోండి లేదా మీ ప్రశ్నను టైప్ చేయండి.',
    assistantPlaceholder: 'భూ రికార్డులు లేదా ధృవీకరణ గురించి అడగండి...',
    assistantSendBtn: 'పంపు',
    assistantSuggestedTitle: 'సూచించిన ప్రశ్నలు:',
    assistantClearChat: 'కొత్త సంభాషణ',
    assistantMinimize: 'చిన్నది చేయి',
    assistantClose: 'మూసివేయి',
    assistantOfflineNotice: 'AI ప్రొవైడర్ ఆఫ్‌లైన్ మోడ్‌లో ఉంది. అధికారిక రెవెన్యూ నిబంధనల ప్రకారం సమాధానాలు ఇవ్వబడుతున్నాయి.',
    assistantDisclaimer: 'గమనిక: ఈ అసిస్టెంట్ సమాచార మార్గదర్శకత్వం కోసం మాత్రమే. చట్టపరమైన అనుమతులు అధికారిక రెవెన్యూ అధికారులకే ఉంటాయి.',
    assistantThinking: 'అసిస్టెంట్ సమాధానం రూపొందిస్తోంది...',
    assistantActionNavigate: 'పేజీ తెరవండి',

    promptUploadDoc: 'నా భూమి పత్రాన్ని ఎలా అప్‌లోడ్ చేయాలి?',
    promptTrackApp: 'నా దరఖాస్తు స్థితిని ఎలా ట్రాక్ చేయాలి?',
    promptCheckRecords: 'నా భూమి రికార్డులను ఎలా తనిఖీ చేయాలి?',
    promptValidationScore: 'పత్రం ధృవీకరణ ఫలితం మరియు రిస్క్ స్కోరు అర్థం ఏమిటి?',
    promptVerifyWorkflow: 'ప్రభుత్వ ధృవీకరణ ప్రక్రియ ఎలా పనిచేస్తుంది?',

    footerCopyright: '© 2026 భారత ప్రభుత్వం | భూ వనరుల శాఖ | సర్వహక్కులు ప్రత్యేకించబడ్డాయి',
    footerCompliance: 'DILRMP 2.0 • NIC మరియు డిజిటల్ ఇండియా మార్గదర్శకాలకు అనుగుణంగా',
    footerSecurityNotice: 'సమాచారం 256-బిట్ SSL తో భద్రపరచబడింది. ఆధార్ ధృవీకరణ UIDAI ప్రమాణాలకు అనుగుణంగా ఉంటుంది.',
    footerDigitalIndia: 'డిజిటల్ ఇండియా చొరవ',
    footerAccessibility: 'యాక్సెసిబిలిటీ ప్రకటన',
    footerPrivacy: 'గోప్యతా విధానం',
    footerTerms: 'వినియోగ నిబంధనలు',
    footerHelpline: 'టోల్-ఫ్రీ హెల్ప్‌లైన్: 1800-111-555'
  },

  // 6. Tamil (தமிழ்)
  ta: {
    portalTitle: 'பூலேக் AI',
    portalSubtitle: 'தேசிய நில ஆவணங்கள் டிஜிட்டல் மயமாக்கல் & சரிபார்ப்பு போர்டல்',
    ministryName: 'இந்திய அரசு | ஊரக வளர்ச்சி அமைச்சகம்',
    deptName: 'நில வளத்துறை (DILRMP)',
    nationalSystem: 'டிஜிட்டல் இந்தியா நில ஆவணங்கள் நவீனமயமாக்கல் திட்டம்',

    navMap: 'வரைபட அமைப்பு',
    navCitizenDashboard: 'குடிமக்கள் டாஷ்போர்டு',
    navOfficialDashboard: 'அதிகாரிகள் டாஷ்போர்டு',
    navUploadDoc: 'ஆவணம் பதிவேற்றம்',
    navTrackProgress: 'விண்ணப்ப நிலை',
    navCheckDoc: '14-இலக்க தேடல்',
    navLogout: 'வெளியேறு',
    navSignIn: 'உள்நுழைக',
    navChangeJurisdiction: 'பகுதியை மாற்றுக',
    navHelp: 'உதவி மையம்',

    step1Title: 'படி 1: மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
    step1Subtitle: 'உங்கள் நிலம் அமைந்துள்ள மாநிலத்தை கீழ்தோன்றும் பட்டியலில் தேர்ந்தெடுக்கவும்.',
    step2Title: 'படி 2: போர்டல் மொழியைத் தேர்ந்தெடுக்கவும்',
    step2Subtitle: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும். அனைத்து 8 மொழிகளும் உள்ளன.',
    step3Title: 'படி 3: மாவட்ட வரைபடத்தைத் தேர்ந்தெடுக்கவும்',
    step3Subtitle: 'வரைபடத்தில் நேரடியாக உங்கள் மாவட்டத்தை கிளிக் செய்யவும்.',
    step4Title: 'படி 4: வட்டார (பிளாக்) வரைபடத்தைத் தேர்ந்தெடுக்கவும்',
    step4Subtitle: 'உங்கள் வட்டாரத்தை கிளிக் செய்து நில ஆவணங்களைப் பார்க்கவும்.',
    selectLanguageTitle: 'மொழியைத் தேர்ந்தெடுக்கவும் | Select Language',
    selectLanguageDesc: 'நில ஆவணங்கள், பட்டா, சிட்டா மற்றும் வரைபடங்களைப் பார்க்க உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்.',
    selectedLanguageLabel: 'தேர்ந்தெடுக்கப்பட்ட மொழி',
    continueToDistrictMap: 'மாவட்ட வரைபடத்திற்குச் செல்க',
    backToState: 'மாநிலத்தை மாற்றுக',
    backToLanguage: 'மொழியை மாற்றுக',
    backToDistrict: 'மாவட்டத்தை மாற்றுக',
    proceedToBlockMap: 'வட்டார வரைபடத்திற்குச் செல்க',
    proceedToLandRecords: 'நில ஆவணங்கள் மற்றும் டாஷ்போர்டிற்குச் செல்க',
    selectStateFirst: 'முதலில் ஒரு மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
    noLanguageSelectedAlert: 'தொடர்வதற்கு முன் ஒரு மொழியைத் தேர்ந்தெடுக்கவும்.',
    activeLanguageBadge: 'செயலில்',
    stepProgress: 'முன்னேற்றப் படி',
    currentJurisdiction: 'தற்போதைய பகுதி',

    welcomeCitizen: 'வரவேற்கிறோம்,',
    aadhaarVerifiedBadge: 'ஆதார் சரிபார்க்கப்பட்ட குடிமகன்',
    aadhaarIdLabel: 'ஆதார் எண்:',
    commandCentreTitle: 'தேசிய நில டிஜிட்டல் நிலை (DILRMP 2.0)',
    commandCentreSub: 'ஊரக வளர்ச்சி அமைச்சகம் • நில வளத்துறை',
    expandMetrics: 'விரிவாக்கு',
    collapseMetrics: 'சுருக்கு',
    primaryServicesTitle: 'முதன்மை குடிமக்கள் சேவைகள்',

    cardMapTitle: 'இன்டராக்டிவ் வரைபடம்',
    cardMapDesc: 'ஜார்க்கண்டின் 24 மாவட்டங்கள் மற்றும் கிரிடியின் 13 வட்டாரங்களின் வரைபடத்தைக் காண்க.',
    cardMapBtn: 'வரைபடத்தைத் திற',
    cardUploadTitle: 'ஆவணம் பதிவேற்றம் & AI ஸ்கேன்',
    cardUploadDesc: 'விற்பனை பத்திரம் அல்லது பட்டா ஆவணங்களைப் பதிவேற்றி உடனடி AI சரிபார்ப்பு பெறவும்.',
    cardUploadBtn: 'பதிவேற்றத்தைத் தொடங்கு',
    cardCheckTitle: '14-இலக்க பூ-ஆதார் (ULPIN) தேடல்',
    cardCheckDesc: '14-இலக்க ஐடி அல்லது கஸ்ரா எண்ணை உள்ளிட்டு நில உரிமை நிலையை அறியவும்.',
    cardCheckBtn: 'ஆவணத்தைத் தேடு',
    cardTrackTitle: '3-நிலை சரிபார்ப்பு & மேல்முறையீடு',
    cardTrackDesc: 'BDO → வருவாய் ஆய்வாளர் (CO) → ஆட்சியர் நிலைகளைக் கண்காணித்து மேல்முறையீடு செய்யவும்.',
    cardTrackBtn: 'நிலையைக் காண்க',

    myApplicationsTitle: 'எனது சமர்ப்பிக்கப்பட்ட விண்ணப்பங்கள் & நிலை',
    myApplicationsSubtitle: 'உங்கள் ஆதாருடன் இணைக்கப்பட்ட நில ஆவண சரிபார்ப்பு விண்ணப்பங்களின் நேரடி நிலை.',
    openTrackerBtn: 'முழு டிராக்கரைத் திறக்க',
    totalApplications: 'மொத்த விண்ணப்பங்கள்',
    underVerification: 'சரிபார்ப்பில் உள்ளது',
    actionRequired: 'நடவடிக்கை தேவை',
    approvedDone: 'ஏற்கப்பட்டது / முடிந்தது',
    myLinkedLandParcels: 'எனது நிலப் பகுதிகள் (டிஜிட்டல் பட்டா)',
    myLinkedLandSubtitle: 'உங்கள் ஆதாருடன் சரிபார்க்கப்பட்ட நிலப் பகுதிகள் மற்றும் வரைபட எல்லைகள்.',
    khasraLabel: 'கஸ்ரா எண்',
    khataLabel: 'பட்டா எண்',
    villageLabel: 'கிராமம்',
    areaLabel: 'பரப்பளவு',
    statusLabel: 'நிலை',
    riskScoreLabel: 'ஆபத்து மதிப்பீடு',
    viewDigitalTwin: '360° டிஜிட்டல் லேண்ட் ட்வின் காண்க',
    viewCaseDetails: 'விவரங்களைக் காண்க',

    assistantTitle: 'பூலேக் AI உதவியாளர்',
    assistantSubtitle: 'குடிமக்கள் நில ஆவணங்கள் & சரிபார்ப்பு வழிகாட்டி',
    assistantWelcome: 'வணக்கம்! நான் **பூலேக் AI உதவியாளர்**. ஆவண பதிவேற்றம், விண்ணப்ப கண்காணிப்பு மற்றும் நில பதிவேடுகள் வழிகாட்டலில் உங்களுக்கு உதவ முடியும். கீழே உள்ள தலைப்புகளில் ஒன்றை தேர்வு செய்யவும் அல்லது உங்கள் கேள்வியை தட்டச்சு செய்யவும்.',
    assistantPlaceholder: 'நில பதிவேடுகள் அல்லது சரிபார்ப்பு பற்றி கேளுங்கள்...',
    assistantSendBtn: 'அனுப்பு',
    assistantSuggestedTitle: 'பரிந்துரைக்கப்பட்ட கேள்விகள்:',
    assistantClearChat: 'புதிய உரையாடல்',
    assistantMinimize: 'சிறிதாக்கு',
    assistantClose: 'மூடு',
    assistantOfflineNotice: 'AI மாதிரி ஆஃப்லைனில் உள்ளது. அதிகாரப்பூர்வ வருவாய் விதிகளின்படி பதில்கள் வழங்கப்படுகின்றன.',
    assistantDisclaimer: 'அறிவிப்பு: இந்த உதவியாளர் வழிகாட்டுதலுக்கு மட்டுமே. அதிகாரப்பூர்வ ஒப்புதல்கள் வருவாய் அலுவலர்களிடமே இருக்கும்.',
    assistantThinking: 'உதவியாளர் பதிலளிக்கிறார்...',
    assistantActionNavigate: 'பக்கத்தைத் திறக்க',

    promptUploadDoc: 'எனது நில ஆவணத்தை எவ்வாறு பதிவேற்றுவது?',
    promptTrackApp: 'எனது விண்ணப்ப நிலையை எவ்வாறு கண்காணிப்பது?',
    promptCheckRecords: 'எனது நில ஆவணங்களை எவ்வாறு சரிபார்ப்பது?',
    promptValidationScore: 'ஆவண சரிபார்ப்பு முடிவு மற்றும் ஆபத்து மதிப்பெண் என்றால் என்ன?',
    promptVerifyWorkflow: 'அரசு சரிபார்ப்பு செயல்முறை எவ்வாறு செயல்படுகிறது?',

    footerCopyright: '© 2026 இந்திய அரசு | நில வளத்துறை | அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை',
    footerCompliance: 'DILRMP 2.0 • NIC மற்றும் டிஜிட்டல் இந்தியா விதிகளின்படி',
    footerSecurityNotice: 'அனைத்து தகவல்களும் 256-பிட் SSL மூலம் பாதுகாக்கப்படுகின்றன. ஆதார் சரிபார்ப்பு UIDAI தரநிலைகளின்படி.',
    footerDigitalIndia: 'டிஜிட்டல் இந்தியா முன்முயற்சி',
    footerAccessibility: 'அணுகல்தன்மை அறிக்கை',
    footerPrivacy: 'தனியுரிமைக் கொள்கை',
    footerTerms: 'பயன்பாட்டு விதிமுறைகள்',
    footerHelpline: 'கட்டணமில்லா உதவி எண்: 1800-111-555'
  },

  // 7. Gujarati (ગુજરાતી)
  gu: {
    portalTitle: 'ભૂલેખ AI',
    portalSubtitle: 'રાષ્ટ્રીય જમીન રેકોર્ડ ડિજિટાઈઝેશન અને ચકાસણી પોર્ટલ',
    ministryName: 'ભારત સરકાર | ગ્રામીણ વિકાસ મંત્રાલય',
    deptName: 'જમીન સંસાધન વિભાગ (DILRMP)',
    nationalSystem: 'ડિજિટલ ઇન્ડિયા લેન્ડ રેકોર્ડ્સ આધુનિકીકરણ કાર્યક્રમ',

    navMap: 'નકશા સિસ્ટમ',
    navCitizenDashboard: 'નાગરિક ડેશબોર્ડ',
    navOfficialDashboard: 'અધિકારી ડેશબોર્ડ',
    navUploadDoc: 'દસ્તાવેજ અપલોડ',
    navTrackProgress: 'અરજીની સ્થિતિ',
    navCheckDoc: '14-અંકિય શોધ',
    navLogout: 'લૉગઆઉટ',
    navSignIn: 'સાઇન ઇન કરો',
    navChangeJurisdiction: 'વિસ્તાર બદલો',
    navHelp: 'સહાય કેન્દ્ર',

    step1Title: 'પગલું 1: રાજ્ય પસંદ કરો',
    step1Subtitle: 'ડ્રૉપડાઉનમાંથી તમારી જમીન આવેલી હોય તે રાજ્ય પસંદ કરો.',
    step2Title: 'પગલું 2: પોર્ટલની ભાષા પસંદ કરો',
    step2Subtitle: 'તમારી પસંદગીની ભાષા પસંદ કરો. બધી 8 ભાષાઓ ઉપલબ્ધ છે.',
    step3Title: 'પગલું 3: જિલ્લા નકશો પસંદ કરો',
    step3Subtitle: 'નકશા પર સીધા તમારા જિલ્લા પર ક્લિક કરો.',
    step4Title: 'પગલું 4: તાલુકા (બ્લૉક) નકશો પસંદ કરો',
    step4Subtitle: 'તમારા તાલુકા પર ક્લિક કરીને જમીનના 7/12 અને રેકોર્ડ જુઓ.',
    selectLanguageTitle: 'ભાષા પસંદ કરો | Select Language',
    selectLanguageDesc: 'જમીનના રેકોર્ડ્સ, ખતિયાન, જમાબંધી અને નકશા જોવા માટે તમારી ભાષા પસંદ કરો.',
    selectedLanguageLabel: 'પસંદ કરેલી ભાષા',
    continueToDistrictMap: 'જિલ્લા નકશા પર આગળ વધો',
    backToState: 'રાજ્ય બદલો',
    backToLanguage: 'ભાષા બદલો',
    backToDistrict: 'જિલ્લો બદલો',
    proceedToBlockMap: 'તાલુકા નકશા પર જાઓ',
    proceedToLandRecords: 'જમીન રેકોર્ડ્સ અને ડેશબોર્ડ પર જાઓ',
    selectStateFirst: 'કૃપા કરીને પહેલાં રાજ્ય પસંદ કરો',
    noLanguageSelectedAlert: 'આગળ વધતા પહેલાં કૃપા કરીને એક ભાષા પસંદ કરો.',
    activeLanguageBadge: 'સક્રિય',
    stepProgress: 'પ્રગતિ પગલું',
    currentJurisdiction: 'વર્તમાન વિસ્તાર',

    welcomeCitizen: 'સ્વાગત છે,',
    aadhaarVerifiedBadge: 'આધાર પ્રમાણિત નાગરિક',
    aadhaarIdLabel: 'આધાર નંબર:',
    commandCentreTitle: 'રાષ્ટ્રીય જમીન ડિજિટાઈઝેશન સ્થિતિ (DILRMP 2.0)',
    commandCentreSub: 'ગ્રામીણ વિકાસ મંત્રાલય • જમીન સંસાધન વિભાગ',
    expandMetrics: 'વિસ્તૃત કરો',
    collapseMetrics: 'સંક્ષિપ્ત કરો',
    primaryServicesTitle: 'મુખ્ય નાગરિક સેવાઓ',

    cardMapTitle: 'સ્થાન અને તાલુકા નકશો',
    cardMapDesc: 'ઝારખંડના 24 જિલ્લાઓ અને ગિરિડીહના 13 તાલુકાઓનો સંપૂર્ણ નકશો જુઓ.',
    cardMapBtn: 'નકશો ખોલો',
    cardUploadTitle: 'દસ્તાવેજ અપલોડ અને AI સ્કેન',
    cardUploadDesc: 'વેચાણ દસ્તાવેજ, ખતિયાન અથવા મહેસૂલી દસ્તાવેજ અપલોડ કરી તાત્કાલિક AI ચકાસણી મેળવો.',
    cardUploadBtn: 'અપલોડ શરૂ કરો',
    cardCheckTitle: '14-અંકિય ભૂ-આધાર (ULPIN) શોધ',
    cardCheckDesc: '14-અંકિય આઈડી અથવા ખસરા નંબર દાખલ કરીને જમીન માલિકી અને કર સ્થિતિ જુઓ.',
    cardCheckBtn: 'રેકોર્ડ શોધો',
    cardTrackTitle: '3-સ્તરીય ચકાસણી સ્થિતિ અને અપીલ',
    cardTrackDesc: 'BDO → સર્કલ ઓફિસર (CO) → કલેક્ટર તબક્કાઓ જુઓ અને અપીલ દાખલ કરો.',
    cardTrackBtn: 'સ્થિતિ જુઓ',

    myApplicationsTitle: 'મારી સબમિટ કરેલી અરજીઓ અને ટ્રેકિંગ',
    myApplicationsSubtitle: 'આધાર નંબર સાથે જોડાયેલા તમામ સક્રિય જમીન ચકાસણી કેસોની વાસ્તવિક સ્થિતિ.',
    openTrackerBtn: 'સંપૂર્ણ ટ્રેકર ખોલો',
    totalApplications: 'કુલ અરજીઓ',
    underVerification: 'ચકાસણી હેઠળ',
    actionRequired: 'પગલાં જરૂરી',
    approvedDone: 'મંજૂર / પૂર્ણ',
    myLinkedLandParcels: 'મારા લિંક કરેલા જમીન પાર્સલ (ડિજિટલ ખતિયાન)',
    myLinkedLandSubtitle: 'તમારા આધાર સાથે પ્રમાણિત જમીન રેકોર્ડ્સ અને GIS સીમાઓ.',
    khasraLabel: 'ખસરા નં.',
    khataLabel: 'ખાતા નં.',
    villageLabel: 'ગામ',
    areaLabel: 'વિસ્તાર',
    statusLabel: 'સ્થિતિ',
    riskScoreLabel: 'જોખમ સ્કોર',
    viewDigitalTwin: '360° ડિજિટલ લેન્ડ ટ્વિન જુઓ',
    viewCaseDetails: 'વિગતો જુઓ',

    assistantTitle: 'ભૂલેખ AI સહાયક',
    assistantSubtitle: 'નાગરિક જમીન રેકોર્ડ્સ અને ચકાસણી માર્ગદર્શક',
    assistantWelcome: 'નમસ્તે! હું **ભૂલેખ AI સહાયક** છું. દસ્તાવેજ અપલોડ, અરજી ટ્રેકિંગ અને જમીન રેકોર્ડ ચકાસણીમાં હું તમારી મદદ કરી શકું છું. નીચે આપેલા વિષયોમાંથી પસંદ કરો અથવા તમારો પ્રશ્ન લખો.',
    assistantPlaceholder: 'જમીન રેકોર્ડ અથવા ચકાસણી વિશે પૂછો...',
    assistantSendBtn: 'મોકલો',
    assistantSuggestedTitle: 'સૂચવેલા પ્રશ્નો:',
    assistantClearChat: 'નવી વાતચીત',
    assistantMinimize: 'નાનું કરો',
    assistantClose: 'બંધ કરો',
    assistantOfflineNotice: 'AI મોડેલ ઑફલાઇન મોડમાં છે. સત્તાવાર મહેસૂલ નિયમો મુજબ જવાબો આપવામાં આવી રહ્યા છે.',
    assistantDisclaimer: 'સૂચના: આ સહાયક માત્ર માર્ગદર્શન માટે છે. કાનૂની મંજૂરીના અધિકારો માત્ર મહેસૂલ અધિકારીઓ પાસે છે.',
    assistantThinking: 'સહાયક વિચારી રહ્યો છે...',
    assistantActionNavigate: 'પૃષ્ઠ ખોલો',

    promptUploadDoc: 'હું મારો જમીન દસ્તાવેજ કેવી રીતે અપલોડ કરું?',
    promptTrackApp: 'હું મારી અરજીની સ્થિતિ કેવી રીતે ટ્રેક કરું?',
    promptCheckRecords: 'હું મારા જમીનના રેકોર્ડ્સ કેવી રીતે તપાસું?',
    promptValidationScore: 'દસ્તાવેજ ચકાસણી પરિણામ અને રિસ્ક સ્કોરનો અર્થ શું છે?',
    promptVerifyWorkflow: 'સરકારી ચકાસણી પ્રક્રિયા કેવી રીતે કાર્ય કરે છે?',

    footerCopyright: '© 2026 ભારત સરકાર | જમીન સંસાધન વિભાગ | સર્વાધિકાર સુરક્ષિત',
    footerCompliance: 'DILRMP 2.0 • NIC અને ડિજિટલ ઇન્ડિયા નિયમો મુજબ',
    footerSecurityNotice: 'તમામ ડેટા 256-બીટ SSL દ્વારા સુરક્ષિત છે. આધાર ચકાસણી UIDAI ધોરણો મુજબ.',
    footerDigitalIndia: 'ડિજિટલ ઇન્ડિયા પહેલ',
    footerAccessibility: 'ઍક્સેસિબિલિટી સ્ટેટમેન્ટ',
    footerPrivacy: 'ગોપનીયતા નીતિ',
    footerTerms: 'ઉપયોગની શરતો',
    footerHelpline: 'ટોલ-ફ્રી હેલ્પલાઇન: 1800-111-555'
  },

  // 8. Urdu (اردو) - RTL Language
  ur: {
    portalTitle: 'بھولیکھ اے آئی',
    portalSubtitle: 'قومی اراضی ریکارڈ ڈیجیٹائزیشن اور تصدیقی پورٹل',
    ministryName: 'حکومت ہند | وزارت دیہی ترقی',
    deptName: 'محکمہ اراضی وسائل (DILRMP)',
    nationalSystem: 'ڈیجیٹل انڈیا لینڈ ریکارڈز ماڈرنائزیشن پروگرام',

    navMap: 'نقشہ نظام',
    navCitizenDashboard: 'شہری ڈیش بورڈ',
    navOfficialDashboard: 'افسر ڈیش بورڈ',
    navUploadDoc: 'دستاویز اپ لوڈ',
    navTrackProgress: 'درخواست کی صورتحال',
    navCheckDoc: '14-ہندسی تلاش',
    navLogout: 'لاگ آؤٹ',
    navSignIn: 'لاگ ان کریں',
    navChangeJurisdiction: 'علاقہ تبدیل کریں',
    navHelp: 'امدادی مرکز',

    step1Title: 'مرحلہ 1: ریاست کا انتخاب کریں',
    step1Subtitle: 'ڈراپ ڈاؤن سے وہ ریاست منتخب کریں جہاں آپ کی زمین واقع ہے۔',
    step2Title: 'مرحلہ 2: پورٹل کی زبان منتخب کریں',
    step2Subtitle: 'اپنی پسندیدہ زبان کا انتخاب کریں۔ تمام 8 سرکاری زبانیں دستیاب ہیں۔',
    step3Title: 'مرحلہ 3: ضلع کا نقشہ منتخب کریں',
    step3Subtitle: 'نقشے پر براہ راست اپنے ضلع پر کلک کریں۔',
    step4Title: 'مرحلہ 4: بلاک (تحصیل) کا نقشہ منتخب کریں',
    step4Subtitle: 'اپنے بلاک پر کلک کر کے زمین کے ریکارڈز اور کھتیان دیکھیں۔',
    selectLanguageTitle: 'زبان کا انتخاب کریں | Select Language',
    selectLanguageDesc: 'اراضی ریکارڈز، کھتیان، جمع بندی اور کیڈسٹرل نقشے دیکھنے کے لیے اپنی زبان منتخب کریں۔',
    selectedLanguageLabel: 'منتخب زبان',
    continueToDistrictMap: 'ضلعی نقشے کی طرف آگے بڑھیں',
    backToState: 'ریاست تبدیل کریں',
    backToLanguage: 'زبان تبدیل کریں',
    backToDistrict: 'ضلع تبدیل کریں',
    proceedToBlockMap: 'بلاک کے نقشے پر جائیں',
    proceedToLandRecords: 'اراضی ریکارڈز اور ڈیش بورڈ پر جائیں',
    selectStateFirst: 'براہ کرم پہلے ریاست کا انتخاب کریں',
    noLanguageSelectedAlert: 'آگے بڑھنے سے پہلے براہ کرم ایک زبان منتخب کریں۔',
    activeLanguageBadge: 'فعال',
    stepProgress: 'پیش رفت مرحلہ',
    currentJurisdiction: 'موجودہ دائرہ اختیار',

    welcomeCitizen: 'خوش آمدید،',
    aadhaarVerifiedBadge: 'آدھار تصدیق شدہ شہری',
    aadhaarIdLabel: 'آدھار نمبر:',
    commandCentreTitle: 'قومی اراضی ڈیجیٹائزیشن کمانڈ صورتحال (DILRMP 2.0)',
    commandCentreSub: 'وزارت دیہی ترقی • محکمہ اراضی وسائل',
    expandMetrics: 'تفصیلات دیکھیں',
    collapseMetrics: 'مختصر کریں',
    primaryServicesTitle: 'اہم شہری خدمات',

    cardMapTitle: 'مقام اور بلاک کا نقشہ',
    cardMapDesc: 'جھارکھنڈ کے تمام 24 اضلاع اور گریڈیہہ کے 13 بلاکس کا مکمل نقشہ دیکھیں۔',
    cardMapBtn: 'نقشہ کھولیں',
    cardUploadTitle: 'دستاویز اپ لوڈ اور اے آئی اسکین',
    cardUploadDesc: 'بیع نامہ، کھتیان یا ریونیو دستاویزات اپ لوڈ کر کے فوری اے آئی جانچ کروائیں۔',
    cardUploadBtn: 'اپ لوڈ شروع کریں',
    cardCheckTitle: '14-ہندسی بھو-آدھار (ULPIN) تلاش',
    cardCheckDesc: '14-ہندسی تصدیقی شناخت یا خسرہ نمبر درج کر کے قانونی ملکیت اور لگان دیکھیں۔',
    cardCheckBtn: 'ریکارڈ تلاش کریں',
    cardTrackTitle: '3-مرحلہ وار تصدیق اور اپیل',
    cardTrackDesc: 'BDO ← سرکل آفیسر (CO) ← کلکٹر کے مراحل دیکھیں اور ضرورت پڑنے پر اپیل دائر کریں۔',
    cardTrackBtn: 'صورتحال دیکھیں',

    myApplicationsTitle: 'میری جمع کردہ درخواستیں اور لائیو ٹریکنگ',
    myApplicationsSubtitle: 'آدھار سے منسلک تمام فعال اراضی تصدیقی مقدمات کی حقیقی وقت کی صورتحال۔',
    openTrackerBtn: 'مکمل ٹریکر کھولیں',
    totalApplications: 'کل درخواستیں',
    underVerification: 'زیر تصدیق',
    actionRequired: 'کارروائی درکار',
    approvedDone: 'منظور شدہ / مکمل',
    myLinkedLandParcels: 'میرے منسلک اراضی پارسلز (ڈیجیٹل کھتیان)',
    myLinkedLandSubtitle: 'آپ کے آدھار سے تصدیق شدہ زمین اور جی آئی ایس حدود۔',
    khasraLabel: 'خسرہ نمبر',
    khataLabel: 'کھاتہ نمبر',
    villageLabel: 'گاؤں',
    areaLabel: 'رقبہ',
    statusLabel: 'صورتحال',
    riskScoreLabel: 'رسک اسکور',
    viewDigitalTwin: '360° ڈیجیٹل لینڈ ٹوئن دیکھیں',
    viewCaseDetails: 'تفصیلات دیکھیں',

    assistantTitle: 'بھولیکھ اے آئی معاون',
    assistantSubtitle: 'شہری اراضی ریکارڈز اور تصدیقی گائیڈ',
    assistantWelcome: 'السلام علیکم! میں **بھولیکھ اے آئی معاون** ہوں۔ دستاویزات اپ لوڈ کرنے، درخواست ٹریک کرنے اور اراضی ریکارڈز کی تصدیق میں آپ کی مدد کر سکتا ہوں۔ نیچے دیئے گئے موضوعات میں سے انتخاب کریں یا اپنا سوال لکھیں۔',
    assistantPlaceholder: 'اراضی ریکارڈز، دستاویزات یا تصدیق کے بارے میں پوچھیں...',
    assistantSendBtn: 'ارسال کریں',
    assistantSuggestedTitle: 'تجویز کردہ سوالات:',
    assistantClearChat: 'نئی گفتگو',
    assistantMinimize: 'چھوٹا کریں',
    assistantClose: 'بند کریں',
    assistantOfflineNotice: 'اے آئی ماڈل آف لائن موڈ میں ہے۔ سرکاری ریونیو ضوابط کے تحت فوری جوابات دیئے جا رہے ہیں۔',
    assistantDisclaimer: 'اطلاع: یہ معاون صرف معلوماتی رہنمائی کے لیے ہے۔ قانونی تصدیق اور منظوری کے اختیارات صرف مجاز ریونیو افسران کے پاس ہیں۔',
    assistantThinking: 'معاون جواب تیار کر رہا ہے...',
    assistantActionNavigate: 'صفحہ کھولیں',

    promptUploadDoc: 'میں اپنی زمین کی دستاویز کیسے اپ لوڈ کروں؟',
    promptTrackApp: 'میں اپنی درخواست کی صورتحال کیسے ٹریک کروں؟',
    promptCheckRecords: 'میں اپنی زمین کے ریکارڈز کی جانچ کیسے کروں؟',
    promptValidationScore: 'دستاویز کی تصدیق اور رسک اسکور کا کیا مطلب ہے؟',
    promptVerifyWorkflow: 'سرکاری تصدیقی عمل کس طرح کام کرتا ہے؟',

    footerCopyright: '© 2026 حکومت ہند | محکمہ اراضی وسائل | جملہ حقوق محفوظ ہیں',
    footerCompliance: 'DILRMP 2.0 • این آئی سی اور ڈیجیٹل انڈیا کے رہنما خطوط کے مطابق',
    footerSecurityNotice: 'تمام ڈیٹا 256-بٹ SSL کے ذریعے محفوظ ہے۔ آدھار تصدیق UIDAI کے معیارات کے مطابق ہے۔',
    footerDigitalIndia: 'ڈیجیٹل انڈیا اقدام',
    footerAccessibility: 'رسائی کا بیان',
    footerPrivacy: 'رازداری کی پالیسی',
    footerTerms: 'استعمال کی شرائط',
    footerHelpline: 'ٹول فری ہیلپ لائن: 1800-111-555'
  }
};

/**
 * Get translation for key with fallback to English or key itself
 */
export function getTranslation(lang: SupportedAppLanguage, key: keyof TranslationDictionary): string {
  const currentDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return currentDict[key] || TRANSLATIONS.en[key] || key;
}

/**
 * Check if a language is RTL (Urdu)
 */
export function isRtlLanguage(lang: SupportedAppLanguage): boolean {
  return lang === 'ur';
}

/**
 * Save selected language to local storage for persistence
 */
export function saveStoredLanguage(lang: SupportedAppLanguage): void {
  try {
    localStorage.setItem('bhulekh_selected_language', lang);
  } catch (e) {
    console.error('Failed to save language in localStorage:', e);
  }
}

/**
 * Retrieve stored language or fallback to 'hi'
 */
export function getStoredLanguage(): SupportedAppLanguage {
  try {
    const stored = localStorage.getItem('bhulekh_selected_language');
    if (stored && ['hi', 'en', 'bn', 'mr', 'te', 'ta', 'gu', 'ur'].includes(stored)) {
      return stored as SupportedAppLanguage;
    }
  } catch (e) {
    console.error('Failed to read language from localStorage:', e);
  }
  return 'hi';
}
