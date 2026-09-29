import React from 'react';
import { useApp } from '../../context/AppContext';
import { AshokaEmblem } from '../common/Emblems';
import { Volume2, Eye } from 'lucide-react';

export const GovTopUtilityBar: React.FC = () => {
  const {
    govLanguage,
    setGovLanguage,
    fontScale,
    setFontScale,
    isHighContrast,
    toggleHighContrast
  } = useApp();

  const isHindi = govLanguage === 'hi';

  const handleSkipToContent = (e: React.MouseEvent) => {
    e.preventDefault();
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.focus();
      mainEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#002856] text-[#E1EDF7] text-[11px] font-medium border-b border-[#001A3A] select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-8 flex items-center justify-between gap-2">
        
        {/* LEFT: Government of India / Ministry of Rural Development */}
        <div className="flex items-center gap-2 overflow-hidden">
          <AshokaEmblem className="h-4 w-auto shrink-0 fill-white" size={16} />
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-bold text-white tracking-wide">
              {isHindi ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
            </span>
            <span className="text-[#8FBFE4] hidden md:inline">|</span>
            <span className="text-[#C2DCF0] hidden md:inline truncate">
              {isHindi ? 'ग्रामीण विकास मंत्रालय • भूमि संसाधन विभाग' : 'Ministry of Rural Development • Department of Land Resources'}
            </span>
          </div>
        </div>

        {/* RIGHT: Accessibility Controls, Screen Reader, Font Size, Language */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          
          {/* Skip to Main Content */}
          <a
            href="#main-content"
            onClick={handleSkipToContent}
            className="hidden lg:inline-block text-[#C2DCF0] hover:text-white underline text-[10px] pr-2 border-r border-[#0B4F8A]"
            title="Skip to main content"
          >
            {isHindi ? 'मुख्य सामग्री पर जाएं' : 'Skip to Main Content'}
          </a>

          {/* Screen Reader Access */}
          <button
            onClick={() => {
              const msg = isHindi ? 'स्क्रीन रीडर एक्सेसिबिलिटी सक्रिय है' : 'Screen reader accessibility is active';
              alert(msg);
            }}
            className="hidden sm:flex items-center gap-1 text-[#C2DCF0] hover:text-white px-1.5 py-0.5 rounded text-[10px]"
            title="Screen Reader Access"
          >
            <Volume2 className="w-3 h-3 text-[#FF9933]" />
            <span className="hidden xl:inline">{isHindi ? 'स्क्रीन रीडर' : 'Screen Reader'}</span>
          </button>

          {/* Accessibility Font Size: A- | A | A+ */}
          <div className="flex items-center bg-[#001A3A] rounded border border-[#0B4F8A] px-1 py-0.5" title="Font Size Adjust">
            <button
              type="button"
              onClick={() => setFontScale('sm')}
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                fontScale === 'sm' ? 'bg-[#FF9933] text-[#002856]' : 'text-[#C2DCF0] hover:text-white'
              }`}
              title="Decrease font size"
            >
              A-
            </button>
            <span className="text-[#0B4F8A] px-0.5">|</span>
            <button
              type="button"
              onClick={() => setFontScale('base')}
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                fontScale === 'base' ? 'bg-[#FF9933] text-[#002856]' : 'text-[#C2DCF0] hover:text-white'
              }`}
              title="Normal font size"
            >
              A
            </button>
            <span className="text-[#0B4F8A] px-0.5">|</span>
            <button
              type="button"
              onClick={() => setFontScale('lg')}
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                fontScale === 'lg' || fontScale === 'xl' ? 'bg-[#FF9933] text-[#002856]' : 'text-[#C2DCF0] hover:text-white'
              }`}
              title="Increase font size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              isHighContrast
                ? 'bg-[#FFFF00] text-black border-[#FFFF00]'
                : 'bg-[#001A3A] text-[#C2DCF0] hover:text-white border-[#0B4F8A]'
            }`}
            title="High Contrast Mode"
          >
            <Eye className="w-3 h-3 text-[#FF9933]" />
            <span className="font-mono">[A]</span>
            <span className="hidden md:inline">{isHighContrast ? (isHindi ? 'सामान्य दृश्य' : 'Standard') : (isHindi ? 'उच्च कंट्रास्ट' : 'High Contrast')}</span>
          </button>

          {/* Language Switcher Toggle: हिन्दी / English */}
          <div className="flex items-center bg-[#001A3A] rounded border border-[#0B4F8A] p-0.5">
            <button
              type="button"
              onClick={() => setGovLanguage('hi')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                govLanguage === 'hi'
                  ? 'bg-[#FF9933] text-[#002856] shadow-2xs'
                  : 'text-[#C2DCF0] hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setGovLanguage('en')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                govLanguage === 'en'
                  ? 'bg-[#FF9933] text-[#002856] shadow-2xs'
                  : 'text-[#C2DCF0] hover:text-white'
              }`}
            >
              English
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
