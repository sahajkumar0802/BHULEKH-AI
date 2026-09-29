import React from 'react';
import { useApp } from '../../context/AppContext';
import { AshokaEmblem, DigitalIndiaEmblem, SihBadge, TricolorRibbon } from '../common/Emblems';

export const GovHeaderBanner: React.FC = () => {
  const { govLanguage, setActiveTab } = useApp();
  const isHindi = govLanguage === 'hi';

  return (
    <div className="bg-white border-b border-[#D0D7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* LEFT: Official Ashoka Lion Capital + Ministry & Portal Branding */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3.5 cursor-pointer group"
          title="BHULEKH AI Home"
        >
          <AshokaEmblem className="h-14 sm:h-16 w-auto shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform" />
          
          <div className="border-l-2 border-[#003D7C] pl-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#002856] tracking-tight leading-none font-sans">
                {isHindi ? 'भूलेख' : 'BHULEKH'} <span className="text-[#005FA8]">AI</span>
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#E1EDF7] text-[#003D7C] text-[10px] font-bold border border-[#C2DCF0]">
                DILRMP 2.0
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-[#002856] leading-tight mt-0.5">
              {isHindi 
                ? 'राष्ट्रीय भूमि अभिलेख डिजिटलीकरण एवं भू-स्थानिक सत्यापन पोर्टल'
                : 'National Land Record Digitization & Validation Portal'}
            </p>

            <p className="text-[11px] text-[#475569] leading-tight mt-0.5 hidden sm:block">
              {isHindi
                ? 'भूमि संसाधन विभाग • ग्रामीण विकास मंत्रालय, भारत सरकार'
                : 'Department of Land Resources • Ministry of Rural Development, Govt. of India'}
            </p>
          </div>
        </div>

        {/* RIGHT: Digital India Emblem, SIH 2026 Problem Statement PS-18, Helplines */}
        <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
          {/* SIH 2026 Problem Statement Badge */}
          <div className="hidden sm:block text-right">
            <SihBadge />
            <div className="text-[10px] text-[#64748B] font-medium mt-1">
              {isHindi ? 'समस्या विवरण PS-18' : 'Problem Statement PS-18'}
            </div>
          </div>

          <div className="h-10 w-[1px] bg-[#D0D7DE] hidden sm:block" />

          {/* Digital India Logo */}
          <DigitalIndiaEmblem />
        </div>

      </div>

      {/* Official Government Tricolor Strip */}
      <TricolorRibbon />
    </div>
  );
};
