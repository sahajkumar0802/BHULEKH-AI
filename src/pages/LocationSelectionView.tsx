import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  INDIAN_STATES,
  JHARKHAND_DISTRICTS,
  GIRIDIH_BLOCKS,
  DIVISION_LIST,
  DistrictData,
  BlockData,
  StateData
} from '../data/jharkhandGeoData';
import { 
  SUPPORTED_LANGUAGES, 
  SupportedAppLanguage, 
  AppLanguageInfo 
} from '../services/i18nService';
import { JharkhandDistrictMap } from '../components/maps/JharkhandDistrictMap';
import { GiridihBlockMap } from '../components/maps/GiridihBlockMap';
import {
  MapPin,
  Building2,
  Search,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ShieldCheck,
  FileCheck2,
  Receipt,
  Compass,
  Check,
  Languages,
  AlertCircle,
  Info
} from 'lucide-react';

export const LocationSelectionView: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedTehsil,
    setSelectedTehsil,
    setActiveTab,
    govLanguage,
    setGovLanguage
  } = useApp();

  const isHindi = govLanguage === 'hi';

  // Step 1 = State (Dropdown), Step 2 = Language, Step 3 = District Map, Step 4 = Block Map
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // State selection state
  const [selectedStateObj, setSelectedStateObj] = useState<StateData | null>(() => {
    return INDIAN_STATES.find(s => s.name.toLowerCase() === (selectedState || '').toLowerCase()) || null;
  });
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateSearchFilter, setStateSearchFilter] = useState('');

  // 8-Language selection state
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<SupportedAppLanguage>(govLanguage || 'hi');

  // District selection state
  const [selectedDistrictObj, setSelectedDistrictObj] = useState<DistrictData | null>(() => {
    return JHARKHAND_DISTRICTS.find(d => d.name.toLowerCase() === (selectedDistrict || '').toLowerCase()) || null;
  });
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);

  // Block selection state
  const [selectedBlockObj, setSelectedBlockObj] = useState<BlockData | null>(() => {
    return GIRIDIH_BLOCKS.find(b => b.name.toLowerCase() === (selectedTehsil || '').toLowerCase()) || null;
  });
  const [selectedOtherBlockName, setSelectedOtherBlockName] = useState<string | null>(() => {
    return selectedTehsil || null;
  });
  const [blockSearchQuery, setBlockSearchQuery] = useState('');
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  // Filtered States for Dropdown
  const filteredStates = INDIAN_STATES.filter(s =>
    s.name.toLowerCase().includes(stateSearchFilter.toLowerCase()) ||
    s.hindiName.includes(stateSearchFilter) ||
    s.code.toLowerCase().includes(stateSearchFilter.toLowerCase())
  );

  // Exactly 8 Supported Languages for BHULEKH AI
  const availableLanguages: AppLanguageInfo[] = SUPPORTED_LANGUAGES;

  // Filtered Districts for Jharkhand
  const filteredDistricts = JHARKHAND_DISTRICTS.filter(d => {
    const matchesDivision = selectedDivision === 'All Divisions' || d.division === selectedDivision;
    const matchesSearch = d.name.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
      d.hindiName.includes(districtSearchQuery) ||
      d.headquarters.toLowerCase().includes(districtSearchQuery.toLowerCase());
    return matchesDivision && matchesSearch;
  });

  // Filtered Giridih Blocks
  const filteredGiridihBlocks = GIRIDIH_BLOCKS.filter(b =>
    b.name.toLowerCase().includes(blockSearchQuery.toLowerCase()) ||
    b.hindiName.includes(blockSearchQuery) ||
    b.headquarters.toLowerCase().includes(blockSearchQuery.toLowerCase())
  );

  // Handlers for Step Transitions
  const handleSelectStateFromDropdown = (state: StateData) => {
    setSelectedStateObj(state);
    setSelectedState(state.name);
    setStateDropdownOpen(false);
    setStateSearchFilter('');

    // Reset downstream selections upon state change
    setSelectedDistrictObj(null);
    setSelectedDistrict('');
    setSelectedBlockObj(null);
    setSelectedOtherBlockName(null);
    setSelectedTehsil('');

    // Advance to Step 2: Language Selection
    setCurrentStep(2);
  };

  const handleSelectLanguage = (lang: AppLanguageInfo) => {
    setSelectedLanguageCode(lang.code);
    setGovLanguage(lang.code);
  };

  const handleProceedToDistrictMap = () => {
    if (!selectedLanguageCode) return;
    setCurrentStep(3);
  };

  const handleSelectDistrict = (district: DistrictData) => {
    setSelectedDistrictObj(district);
    setSelectedDistrict(district.name);

    // Reset block selection upon district change
    setSelectedBlockObj(null);
    setSelectedOtherBlockName(null);
    setSelectedTehsil('');

    // If Giridih, default to null so user can click on the block map explicitly
    setCurrentStep(4);
  };

  const handleSelectGiridihBlock = (block: BlockData) => {
    setSelectedBlockObj(block);
    setSelectedOtherBlockName(block.headquarters || block.name);
    setSelectedTehsil(block.headquarters || block.name);
  };

  const handleSelectOtherBlock = (blockName: string) => {
    setSelectedOtherBlockName(blockName);
    setSelectedBlockObj(null);
    setSelectedTehsil(blockName);
  };

  const handleProceedToLandRecords = (targetTab: string = 'user-dashboard') => {
    if (selectedStateObj) setSelectedState(selectedStateObj.name);
    if (selectedDistrictObj) setSelectedDistrict(selectedDistrictObj.name);
    if (selectedBlockObj) {
      setSelectedTehsil(selectedBlockObj.headquarters || selectedBlockObj.name);
    } else if (selectedOtherBlockName) {
      setSelectedTehsil(selectedOtherBlockName);
    }
    setActiveTab(targetTab);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300 select-none">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#002856] via-[#003D7C] to-[#0B5499] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,#FF9933_0,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#FF9933]" />
            <span>DILRMP Geographical Jurisdiction Selection System</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <span>स्थान चयन प्रणाली | Select Your Location</span>
              </h1>
              <p className="text-sm text-slate-200 mt-1 max-w-2xl">
                {isHindi
                  ? 'सटीक भू-अभिलेख, खतियान, जमाबंदी एवं कैडस्ट्रल नक्शे देखने के लिए अपना राज्य, भाषा, जिला एवं प्रखण्ड चुनें।'
                  : 'Follow the sequence: Select State (Dropdown) → Select Language → District Map → Block Map → Land Records.'}
              </p>
            </div>

            {/* Current Active Breadcrumb Status Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/20 shrink-0 text-right">
              <div className="text-[11px] text-slate-300 font-medium">Current Jurisdiction:</div>
              <div className="text-sm font-black text-amber-300 mt-0.5 flex items-center gap-1.5 justify-end">
                <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                <span>
                  {selectedStateObj ? selectedStateObj.name : 'State'} › {selectedDistrictObj ? selectedDistrictObj.name : 'District'} › {selectedBlockObj ? selectedBlockObj.name : selectedOtherBlockName || 'Block'}
                </span>
              </div>
            </div>
          </div>

          {/* 4-Step Interactive Breadcrumb Stepper */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-2">
            
            {/* Step 1: Select State */}
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                currentStep === 1
                  ? 'bg-white text-[#002856] border-amber-400 shadow-md ring-2 ring-amber-400/50'
                  : currentStep > 1
                  ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/40 hover:bg-white/10'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === 1 ? 'bg-[#002856] text-white' : currentStep > 1 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'
              }`}>
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </div>
              <div className="min-w-0">
                <div className="text-[9px] uppercase font-bold tracking-wider opacity-75">Step 1: State</div>
                <div className="text-xs font-bold truncate">
                  {selectedStateObj ? selectedStateObj.name : 'Select State'}
                </div>
              </div>
            </button>

            {/* Step 2: Language Selection */}
            <button
              onClick={() => {
                if (selectedStateObj) setCurrentStep(2);
              }}
              disabled={!selectedStateObj}
              className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                currentStep === 2
                  ? 'bg-white text-[#002856] border-amber-400 shadow-md ring-2 ring-amber-400/50'
                  : currentStep > 2
                  ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/40 hover:bg-white/10'
                  : 'bg-white/5 text-slate-400 border-white/10 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === 2 ? 'bg-[#002856] text-white' : currentStep > 2 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'
              }`}>
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </div>
              <div className="min-w-0">
                <div className="text-[9px] uppercase font-bold tracking-wider opacity-75">Step 2: Language</div>
                <div className="text-xs font-bold truncate">
                  {availableLanguages.find(l => l.code === selectedLanguageCode)?.name || 'Language'}
                </div>
              </div>
            </button>

            {/* Step 3: District Map */}
            <button
              onClick={() => {
                if (selectedStateObj) setCurrentStep(3);
              }}
              disabled={!selectedStateObj}
              className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                currentStep === 3
                  ? 'bg-white text-[#002856] border-amber-400 shadow-md ring-2 ring-amber-400/50'
                  : currentStep > 3
                  ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/40 hover:bg-white/10'
                  : 'bg-white/5 text-slate-400 border-white/10 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === 3 ? 'bg-[#002856] text-white' : currentStep > 3 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'
              }`}>
                {currentStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
              </div>
              <div className="min-w-0">
                <div className="text-[9px] uppercase font-bold tracking-wider opacity-75">Step 3: District Map</div>
                <div className="text-xs font-bold truncate">
                  {selectedDistrictObj ? selectedDistrictObj.name : 'Select District'}
                </div>
              </div>
            </button>

            {/* Step 4: Block Map */}
            <button
              onClick={() => {
                if (selectedDistrictObj) setCurrentStep(4);
              }}
              disabled={!selectedDistrictObj}
              className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                currentStep === 4
                  ? 'bg-white text-[#002856] border-amber-400 shadow-md ring-2 ring-amber-400/50'
                  : selectedBlockObj || selectedOtherBlockName
                  ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/40 hover:bg-white/10'
                  : 'bg-white/5 text-slate-400 border-white/10 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === 4 ? 'bg-[#002856] text-white' : (selectedBlockObj || selectedOtherBlockName) ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'
              }`}>
                {(selectedBlockObj || selectedOtherBlockName) && currentStep !== 4 ? <Check className="w-3.5 h-3.5" /> : '4'}
              </div>
              <div className="min-w-0">
                <div className="text-[9px] uppercase font-bold tracking-wider opacity-75">Step 4: Block Map</div>
                <div className="text-xs font-bold truncate">
                  {selectedBlockObj ? selectedBlockObj.name : selectedOtherBlockName || 'Select Block'}
                </div>
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: STATE DROPDOWN SELECTION (NO DISTRICT MAP SHOWN BEFORE SELECTION)  */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          
          <div className="max-w-2xl mx-auto space-y-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#003D7C] text-xs font-bold border border-blue-200 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>चरण 1 / Step 1</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#002856]">
              राज्य का चयन करें | Select State
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Please select the state where your land parcel, Khatiyan, or registered deed is situated. The corresponding district map will load immediately after selection.
            </p>
          </div>

          {/* Searchable State Dropdown Card */}
          <div className="max-w-xl mx-auto space-y-4 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="state-select-dropdown-btn" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Select State / राज्य चुनें <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                {/* Dropdown Trigger Button */}
                <button
                  type="button"
                  id="state-select-dropdown-btn"
                  onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                  className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 focus:border-[#003D7C] rounded-xl flex items-center justify-between text-left transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                      selectedStateObj ? 'bg-[#002856] text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {selectedStateObj ? selectedStateObj.code : <Compass className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {selectedStateObj ? `${selectedStateObj.name} (${selectedStateObj.hindiName})` : '-- Select State from Dropdown --'}
                      </div>
                      {selectedStateObj && (
                        <div className="text-[11px] text-emerald-600 font-medium">
                          {selectedStateObj.districtsCount} Districts • DILRMP 2.0 Digitized
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${stateDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Popup */}
                {stateDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-300 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    
                    {/* Search inside Dropdown */}
                    <div className="p-3 bg-slate-50 border-b border-slate-200">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          autoFocus
                          value={stateSearchFilter}
                          onChange={(e) => setStateSearchFilter(e.target.value)}
                          placeholder="Search state (e.g. Jharkhand, Bihar, UP)..."
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#003D7C]"
                        />
                      </div>
                    </div>

                    {/* States List */}
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {filteredStates.map((state) => {
                        const isSelected = selectedStateObj?.id === state.id;

                        return (
                          <div
                            key={state.id}
                            onClick={() => handleSelectStateFromDropdown(state)}
                            className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50 border-l-4 border-[#002856]'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded bg-[#002856] text-white flex items-center justify-center text-[10px] font-bold">
                                {state.code}
                              </span>
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                                  <span>{state.name}</span>
                                  <span className="text-xs text-slate-500 font-normal">({state.hindiName})</span>
                                  {state.featured && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold border border-amber-300">
                                      ACTIVE MAP
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {state.districtsCount} Districts
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-[#003D7C]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick State Selection Chips */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-500 mb-2">Quick Featured State:</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const jh = INDIAN_STATES[0];
                    handleSelectStateFromDropdown(jh);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-[#003D7C] text-[#002856] font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <span className="w-5 h-5 rounded bg-[#002856] text-white flex items-center justify-center text-[10px]">JH</span>
                  <span>Jharkhand (झारखण्ड) — 24 Districts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF9933]" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: 8-LANGUAGE SELECTION (AFTER STATE DROPDOWN & BEFORE DISTRICT MAP) */}
      {/* ========================================================================= */}
      {currentStep === 2 && selectedStateObj && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                <span className="cursor-pointer hover:underline text-[#003D7C]" onClick={() => setCurrentStep(1)}>
                  {selectedStateObj.name} ({selectedStateObj.hindiName})
                </span>
                <span>/</span>
                <span className="text-slate-800 font-bold">Step 2: Language Selection (8 Languages)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#002856] flex items-center gap-2">
                <Languages className="w-6 h-6 text-[#FF9933]" />
                <span>भाषा का चयन करें | Select Portal Language</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                Choose your preferred language for land record digitization, Khatiyan, Jamabandi, validation alerts, and cadastral map inspection. Urdu includes complete Right-to-Left (RTL) layout support.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start sm:self-center"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: State Selection</span>
            </button>
          </div>

          {/* Active Selection Banner */}
          <div className="bg-[#F0F5FA] border border-[#C2DCF0] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#003D7C] text-white flex items-center justify-center font-black text-sm shrink-0">
                {availableLanguages.find(l => l.code === selectedLanguageCode)?.code.toUpperCase() || 'LANG'}
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Currently Selected Language / वर्तमान चयनित भाषा:</div>
                <div className="text-sm font-black text-[#002856] flex items-center gap-2">
                  <span>{availableLanguages.find(l => l.code === selectedLanguageCode)?.nativeName || 'Not Selected'}</span>
                  <span className="text-xs font-normal text-slate-600">({availableLanguages.find(l => l.code === selectedLanguageCode)?.name})</span>
                  {availableLanguages.find(l => l.code === selectedLanguageCode)?.direction === 'rtl' && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                      RTL Layout (دائیں سے بائیں)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-600">
              Select 1 of 8 Languages
            </div>
          </div>

          {/* Exactly 8 Selectable Language Cards Grid */}
          <div 
            role="radiogroup" 
            aria-label="Select Portal Language"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-1"
          >
            {availableLanguages.map((lang, index) => {
              const isSelected = selectedLanguageCode === lang.code;

              return (
                <div
                  key={lang.code}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => handleSelectLanguage(lang)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectLanguage(lang);
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white border-[#003D7C] ring-2 ring-[#003D7C]/30 shadow-md transform -translate-y-0.5'
                      : 'bg-white border-slate-200 hover:border-[#003D7C]/60 hover:shadow-sm hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top Row: Index Badge + Status / Script */}
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 group-hover:bg-[#003D7C] group-hover:text-white flex items-center justify-center text-[10px] font-bold transition-colors">
                      {index + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {lang.direction === 'rtl' && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold border border-purple-200">
                          RTL
                        </span>
                      )}
                      {lang.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-200">
                          {lang.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Language Titles (Native Script + English) */}
                  <div className="space-y-1 py-1">
                    <div className="text-xl font-black text-[#002856] tracking-tight">
                      {lang.nativeName}
                    </div>
                    <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <span>{lang.name}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500 font-mono font-normal">{lang.script}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug pt-1">
                      {lang.description}
                    </p>
                  </div>

                  {/* Bottom Selection Radio Button / Indicator */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#003D7C] bg-[#003D7C]' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#003D7C]' : 'text-slate-500'}`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>

                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#003D7C] transition-colors" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls: Back & Continue */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Change State</span>
            </button>

            <div className="flex items-center gap-3">
              {!selectedLanguageCode && (
                <span className="text-xs text-red-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please select a language to proceed</span>
                </span>
              )}

              <button
                type="button"
                id="proceed-to-district-map-btn"
                onClick={handleProceedToDistrictMap}
                disabled={!selectedLanguageCode}
                className={`py-2.5 px-6 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-2 ${
                  selectedLanguageCode
                    ? 'bg-[#FF9933] hover:bg-[#E68A00] text-slate-900 shadow-md cursor-pointer active:scale-98'
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                }`}
                title={!selectedLanguageCode ? 'Please select a language first' : 'Proceed to District Map'}
              >
                <span>Proceed to District Map ({selectedStateObj.name})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: DISTRICT MAP (DISPLAYS ONLY AFTER STATE & LANGUAGE ARE SELECTED)   */}
      {/* ========================================================================= */}
      {currentStep === 3 && selectedStateObj && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {selectedStateObj.id === 'jharkhand' ? (
            <>
              {/* Controls Bar: Search & Division Filter */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="cursor-pointer hover:underline text-[#003D7C]" onClick={() => setCurrentStep(1)}>
                        {selectedStateObj.name}
                      </span>
                      <span>/</span>
                      <span className="cursor-pointer hover:underline text-[#003D7C]" onClick={() => setCurrentStep(2)}>
                        {availableLanguages.find(l => l.code === selectedLanguageCode)?.name || 'Language'}
                      </span>
                      <span>/</span>
                      <span className="text-slate-800 font-bold">24 Districts Map</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-[#002856] flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#FF9933]" />
                      <span>झारखण्ड जिला मानचित्र | Step 3: Select District (24 Districts)</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Click directly on any of the 24 districts on the map below (e.g. <strong>Giridih</strong>, Ranchi, Dumka) to view its block map.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1 shrink-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back: Language</span>
                    </button>

                    {/* District Search */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={districtSearchQuery}
                        onChange={(e) => setDistrictSearchQuery(e.target.value)}
                        placeholder="Search district (e.g. Giridih)..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#003D7C] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Division Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
                  <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Divisions:</span>
                  {DIVISION_LIST.map((division) => (
                    <button
                      key={division}
                      onClick={() => setSelectedDivision(division)}
                      className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                        selectedDivision === division
                          ? 'bg-[#002856] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {division}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main District Map + District Directory Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Interactive District Map Component */}
                <div className="lg:col-span-8 space-y-3">
                  <JharkhandDistrictMap
                    selectedDistrictId={selectedDistrictObj?.id || null}
                    onSelectDistrict={handleSelectDistrict}
                    hoveredDistrictId={hoveredDistrictId}
                    onHoverDistrict={setHoveredDistrictId}
                  />
                </div>

                {/* District Sidebar Directory */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Selected District Highlight Card */}
                  {selectedDistrictObj && (
                    <div className="bg-gradient-to-br from-[#002856] to-[#003D7C] text-white p-5 rounded-xl shadow-md border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                        <div>
                          <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                            Selected District
                          </span>
                          <h3 className="text-xl font-black text-white">
                            {selectedDistrictObj.name} ({selectedDistrictObj.hindiName})
                          </h3>
                        </div>
                        <span className="px-2 py-1 bg-white/15 rounded text-[11px] font-bold text-white">
                          {selectedDistrictObj.division}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/10 p-2 rounded">
                          <div className="text-slate-300 text-[10px]">Headquarters</div>
                          <div className="font-bold text-white">{selectedDistrictObj.headquarters}</div>
                        </div>
                        <div className="bg-white/10 p-2 rounded">
                          <div className="text-slate-300 text-[10px]">Total Blocks</div>
                          <div className="font-bold text-white">{selectedDistrictObj.blocksCount} Blocks</div>
                        </div>
                        <div className="bg-white/10 p-2 rounded">
                          <div className="text-slate-300 text-[10px]">Digitized Records</div>
                          <div className="font-bold text-emerald-300">{selectedDistrictObj.digitizedRecords}</div>
                        </div>
                        <div className="bg-white/10 p-2 rounded">
                          <div className="text-slate-300 text-[10px]">Completion Rate</div>
                          <div className="font-bold text-amber-300">{selectedDistrictObj.digitizationRate}%</div>
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentStep(4)}
                        className="w-full py-2.5 px-4 bg-[#FF9933] hover:bg-[#E68A00] text-slate-900 rounded-lg font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <span>Open {selectedDistrictObj.name} Block Map</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* 24 District Scrollable List */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Jharkhand Districts ({filteredDistricts.length})
                      </span>
                      <span className="text-[11px] text-slate-500">Click to Open Block Map</span>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                      {filteredDistricts.map((d) => {
                        const isSelected = selectedDistrictObj?.id === d.id;

                        return (
                          <div
                            key={d.id}
                            onClick={() => handleSelectDistrict(d)}
                            onMouseEnter={() => setHoveredDistrictId(d.id)}
                            onMouseLeave={() => setHoveredDistrictId(null)}
                            className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50/80 border-l-4 border-[#002856]'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <span>{d.name}</span>
                                <span className="text-[11px] text-slate-500 font-normal">({d.hindiName})</span>
                                {d.id === 'giridih' && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-bold border border-amber-300">
                                    EXACT MAP
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                HQ: {d.headquarters} • {d.blocksCount} Blocks
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[11px] font-bold text-emerald-600 font-mono">
                                {d.digitizationRate}%
                              </span>
                              <div className="text-[9px] text-slate-400">Digitized</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            </>
          ) : (
            /* Other State Notice */
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-800">
                {selectedStateObj.name} District Vector Scan in Progress
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-resolution cadastral vector maps for {selectedStateObj.name} ({selectedStateObj.districtsCount} Districts) are currently being integrated under DILRMP Phase 2. Currently, <strong>Jharkhand (24 Districts &amp; Giridih 13 Blocks)</strong> is fully live with high-precision reference raster maps.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                >
                  Change State
                </button>
                <button
                  onClick={() => {
                    const jh = INDIAN_STATES[0];
                    handleSelectStateFromDropdown(jh);
                  }}
                  className="px-4 py-2 bg-[#002856] text-white rounded-lg text-xs font-bold shadow hover:bg-[#003D7C] transition"
                >
                  Switch to Jharkhand
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: BLOCK MAP (DISPLAYS ONLY AFTER A DISTRICT IS CLICKED)              */}
      {/* ========================================================================= */}
      {currentStep === 4 && selectedDistrictObj && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="cursor-pointer hover:underline text-[#003D7C]" onClick={() => setCurrentStep(1)}>
                  {selectedStateObj?.name}
                </span>
                <span>/</span>
                <span className="cursor-pointer hover:underline text-[#003D7C]" onClick={() => setCurrentStep(2)}>
                  {availableLanguages.find(l => l.code === selectedLanguageCode)?.name || 'Language'}
                </span>
                <span>/</span>
                <span className="cursor-pointer hover:underline text-[#003D7C]" onClick={() => setCurrentStep(3)}>
                  {selectedDistrictObj.name}
                </span>
                <span>/</span>
                <span className="text-slate-800 font-bold">Block Map</span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[#002856] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FF9933]" />
                <span>प्रखण्ड मानचित्र | Step 4: Block Map for {selectedDistrictObj.name} District</span>
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to District Map</span>
              </button>

              {selectedDistrictObj.id === 'giridih' && (
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={blockSearchQuery}
                    onChange={(e) => setBlockSearchQuery(e.target.value)}
                    placeholder="Search block in Giridih..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#003D7C] focus:bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* GIRIDIH DISTRICT BLOCK MAP (EXACT REFERENCE RASTER MAP + SVG OVERLAYS) */}
          {selectedDistrictObj.id === 'giridih' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Interactive Giridih Block Map Component */}
              <div className="lg:col-span-8 space-y-3">
                <GiridihBlockMap
                  selectedBlockId={selectedBlockObj?.id || null}
                  onSelectBlock={handleSelectGiridihBlock}
                  hoveredBlockId={hoveredBlockId}
                  onHoverBlock={setHoveredBlockId}
                />
              </div>

              {/* Giridih Block Details Panel & Action Button */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Active Block Summary Card */}
                {selectedBlockObj ? (
                  <div className="bg-gradient-to-br from-[#003D7C] to-[#0B5499] text-white p-5 rounded-xl shadow-md border border-slate-700 space-y-3.5">
                    <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                      <div>
                        <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                          Selected Block
                        </span>
                        <h3 className="text-xl font-black text-white">
                          {selectedBlockObj.name} ({selectedBlockObj.hindiName})
                        </h3>
                      </div>
                      <span className="px-2 py-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded text-[11px] font-bold">
                        {selectedBlockObj.completionRate}% Done
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/10 p-2 rounded">
                        <div className="text-slate-300 text-[10px]">Headquarters</div>
                        <div className="font-bold text-white">{selectedBlockObj.headquarters}</div>
                      </div>
                      <div className="bg-white/10 p-2 rounded">
                        <div className="text-slate-300 text-[10px]">Panchayats</div>
                        <div className="font-bold text-white">{selectedBlockObj.panchayatsCount} Panchayats</div>
                      </div>
                      <div className="bg-white/10 p-2 rounded">
                        <div className="text-slate-300 text-[10px]">Revenue Villages</div>
                        <div className="font-bold text-white">{selectedBlockObj.villagesCount} Villages</div>
                      </div>
                      <div className="bg-white/10 p-2 rounded">
                        <div className="text-slate-300 text-[10px]">Digitized Parcels</div>
                        <div className="font-bold text-amber-300">{selectedBlockObj.digitizedParcels.toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    {/* Step 5: Continue to Land Records Button */}
                    <div className="space-y-2 pt-2 border-t border-white/15">
                      <button
                        onClick={() => handleProceedToLandRecords('user-dashboard')}
                        className="w-full py-3 px-4 bg-[#FF9933] hover:bg-[#E68A00] text-slate-900 rounded-lg font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Continue to Land Records ({selectedBlockObj.name})</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleProceedToLandRecords('upload')}
                          className="py-2 px-3 bg-white/15 hover:bg-white/25 text-white rounded-lg font-bold text-xs transition-all border border-white/20 flex items-center justify-center gap-1.5"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                          <span>Upload Deed</span>
                        </button>
                        <button
                          onClick={() => handleProceedToLandRecords('check-document')}
                          className="py-2 px-3 bg-white/15 hover:bg-white/25 text-white rounded-lg font-bold text-xs transition-all border border-white/20 flex items-center justify-center gap-1.5"
                        >
                          <Receipt className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Check Records</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center space-y-2">
                    <Info className="w-8 h-8 text-[#003D7C] mx-auto opacity-75" />
                    <h4 className="text-sm font-bold text-slate-800">
                      Click a Block on the Giridih Map
                    </h4>
                    <p className="text-xs text-slate-500">
                      Select any of the 13 blocks (e.g. <strong>JAMUA</strong>, <strong>DHANWAR</strong>, <strong>GIRIDIH</strong>, <strong>DUMRI</strong>) to enable the Continue button.
                    </p>
                  </div>
                )}

                {/* 13 Giridih Blocks Quick Grid Directory */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Giridih Blocks Directory (13)
                    </span>
                    <span className="text-[11px] text-slate-500">Click to Select</span>
                  </div>

                  <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100">
                    {filteredGiridihBlocks.map((b) => {
                      const isSelected = selectedBlockObj?.id === b.id;

                      return (
                        <div
                          key={b.id}
                          onClick={() => handleSelectGiridihBlock(b)}
                          onMouseEnter={() => setHoveredBlockId(b.id)}
                          onMouseLeave={() => setHoveredBlockId(null)}
                          className={`p-2.5 px-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50/80 border-l-4 border-[#003D7C]'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{b.name}</span>
                              <span className="text-[11px] text-slate-500 font-normal">({b.hindiName})</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {b.panchayatsCount} Panchayats • {b.villagesCount} Villages
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-bold text-emerald-600 font-mono">
                              {b.completionRate}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* OTHER 23 JHARKHAND DISTRICTS: VERIFIED CADASTRAL BLOCK DIRECTORY */
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-black text-[#002856] flex items-center gap-2">
                    <span>{selectedDistrictObj.name} District Anchal &amp; Block Directory</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-bold">
                      {selectedDistrictObj.blocks?.length || 0} Blocks
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Click any block in {selectedDistrictObj.name} to select jurisdiction for land deed upload &amp; verification.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const giridih = JHARKHAND_DISTRICTS.find(d => d.id === 'giridih');
                      if (giridih) handleSelectDistrict(giridih);
                    }}
                    className="px-3.5 py-2 bg-gradient-to-r from-[#002856] to-[#003D7C] text-white rounded-lg text-xs font-bold shadow-xs hover:brightness-110 transition flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>View Giridih Interactive Block Map</span>
                  </button>
                </div>
              </div>

              {/* Block Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {selectedDistrictObj.blocks?.map((blockName, idx) => {
                  const isSelected = selectedOtherBlockName === blockName;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOtherBlock(blockName)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-[#003D7C] ring-2 ring-[#003D7C]/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-[#003D7C] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{blockName}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#003D7C]" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Revenue Anchal / Block Office
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Note about Reference Map Availability */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>DILRMP Verified Block Directory:</strong> High-resolution raster scan map is currently featured for Giridih District. All {selectedDistrictObj.blocks?.length || 0} blocks of {selectedDistrictObj.name} are fully selectable and integrated with the AI verification engine.
                </div>
              </div>

              {/* Step 5 Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-slate-600 font-medium">
                  Selected Block: <strong className="text-[#002856]">{selectedOtherBlockName || 'None'}</strong>
                </div>

                <button
                  disabled={!selectedOtherBlockName}
                  onClick={() => handleProceedToLandRecords('user-dashboard')}
                  className="py-2.5 px-6 bg-[#FF9933] hover:bg-[#E68A00] text-slate-900 rounded-lg font-black text-xs transition-all shadow-md flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Continue to Land Records ({selectedOtherBlockName || 'Select a Block'})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
