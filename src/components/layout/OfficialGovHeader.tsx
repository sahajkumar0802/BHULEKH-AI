import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AshokaEmblem } from '../common/Emblems';
import { LogOut, UserCheck, MapPin, Compass, Languages, ChevronDown, Check } from 'lucide-react';
import { NotificationBellDrawer } from '../notifications/NotificationBellDrawer';
import { SUPPORTED_LANGUAGES } from '../../services/i18nService';

export const OfficialGovHeader: React.FC = () => {
  const { 
    govLanguage, 
    setGovLanguage, 
    isAuthenticated, 
    activeRole, 
    currentUser, 
    logoutUser, 
    activeTab, 
    setActiveTab,
    selectedState,
    selectedDistrict,
    t,
    isRtl
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === govLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="bg-[#003D7C] text-white border-b-2 border-[#FF9933] shadow-xs select-none">
      {/* Top Main Navy Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left Branding: Ashoka Emblem + Government of India / Ministry */}
        <div 
          onClick={() => {
            if (isAuthenticated) {
              if (activeRole === 'citizen') setActiveTab('location-select');
              else setActiveTab('official-dashboard');
            } else {
              setActiveTab('signin');
            }
          }}
          className="flex items-center gap-3 cursor-pointer group"
          title="BHULEKH AI"
        >
          <AshokaEmblem variant="light" className="h-10 sm:h-11 w-auto shrink-0 drop-shadow-xs" />
          
          <div className="border-l border-white/30 pl-3 leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                {(() => {
                  const title = t('portalTitle');
                  const lastSpaceIdx = title.lastIndexOf(' ');
                  if (lastSpaceIdx === -1) return title;
                  const mainName = title.slice(0, lastSpaceIdx);
                  const aiSuffix = title.slice(lastSpaceIdx + 1);
                  return (
                    <>
                      {mainName} <span className="text-[#FF9933]">{aiSuffix}</span>
                    </>
                  );
                })()}
              </span>
              <span className="text-[10px] bg-[#002856] px-1.5 py-0.2 rounded text-slate-200 border border-white/20 font-mono">
                SIH PS-18
              </span>
            </div>
            <div className="text-[11px] font-semibold text-slate-200 mt-0.5">
              {t('ministryName')}
            </div>
            <div className="text-[10px] text-[#C2DCF0] hidden sm:block">
              {t('deptName')}
            </div>
          </div>
        </div>

        {/* Right Section: Navigation Links (when authenticated) + 8-Language Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Quick Context Navigation for authenticated users */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1.5 text-xs">
              {activeRole === 'citizen' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('location-select')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all border flex items-center gap-1 ${
                      activeTab === 'location-select'
                        ? 'bg-[#002856] text-white border-white/40'
                        : 'text-slate-200 hover:text-white border-transparent hover:bg-[#002856]'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>{t('navMap')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('user-dashboard')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all border ${
                      activeTab === 'user-dashboard'
                        ? 'bg-[#002856] text-white border-white/40'
                        : 'text-slate-200 hover:text-white border-transparent hover:bg-[#002856]'
                    }`}
                  >
                    {t('navCitizenDashboard')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload-document')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all border ${
                      activeTab === 'upload-document' || activeTab === 'upload'
                        ? 'bg-[#002856] text-white border-white/40'
                        : 'text-slate-200 hover:text-white border-transparent hover:bg-[#002856]'
                    }`}
                  >
                    {t('navUploadDoc')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('track-progress')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all border ${
                      activeTab === 'track-progress'
                        ? 'bg-[#002856] text-white border-white/40'
                        : 'text-slate-200 hover:text-white border-transparent hover:bg-[#002856]'
                    }`}
                  >
                    {t('navTrackProgress')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('location-select')}
                    className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-[#002856] hover:bg-[#002856]/80 text-[#FF9933] border border-[#FF9933]/30 text-xs font-bold transition-all shadow-2xs"
                    title="Change Jurisdiction"
                  >
                    <MapPin className="w-3 h-3 text-[#FF9933]" />
                    <span className="text-slate-200 font-medium text-[11px]">
                      {selectedState || 'Jharkhand'} › {selectedDistrict || 'Giridih'}
                    </span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('official-dashboard')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all border ${
                    activeTab === 'official-dashboard'
                      ? 'bg-[#002856] text-white border-white/40'
                      : 'text-slate-200 hover:text-white border-transparent hover:bg-[#002856]'
                  }`}
                >
                  {t('navOfficialDashboard')}
                </button>
              )}

              {/* User badge */}
              <div className="px-2 py-0.5 rounded bg-[#002856] border border-white/20 text-[11px] text-slate-200 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-[#FF9933]" />
                <span className="font-mono">{currentUser?.name || (activeRole === 'citizen' ? 'Citizen' : 'Officer')}</span>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={logoutUser}
                className="px-2 py-1 rounded bg-[#002856] hover:bg-red-800 text-slate-200 hover:text-white border border-white/20 text-xs font-semibold transition-all flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
                <span>{t('navLogout')}</span>
              </button>
            </div>
          )}

          {/* Notification Bell (Visible when authenticated) */}
          {isAuthenticated && (
            <NotificationBellDrawer />
          )}

          {/* 8-Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              id="header-language-dropdown-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#002856] hover:bg-[#001f44] text-white rounded border border-white/25 text-xs font-bold transition-all shadow-xs"
              title="Select Language (8 Languages available)"
              aria-expanded={langMenuOpen}
              aria-haspopup="true"
            >
              <Languages className="w-3.5 h-3.5 text-[#FF9933]" />
              <span className="font-semibold">{currentLangObj.nativeName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {langMenuOpen && (
              <div className={`absolute top-full mt-1.5 ${isRtl ? 'left-0' : 'right-0'} w-56 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}>
                <div className="px-3 py-2 bg-[#002856] text-white border-b border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>8 Official Languages</span>
                  </span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono text-slate-200">
                    DILRMP
                  </span>
                </div>

                <div className="py-1 max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = govLanguage === lang.code;

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setGovLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-[#003D7C] font-bold border-l-4 border-[#003D7C]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            <span>{lang.nativeName}</span>
                            <span className="text-[10px] font-normal text-slate-500">({lang.name})</span>
                            {lang.direction === 'rtl' && (
                              <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-800 text-[8px] font-bold">
                                RTL
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {lang.script}
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-[#003D7C] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Thin Saffron, White & Green Accent Lines */}
      <div className="w-full flex h-[2px]" aria-hidden="true">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-[#FFFFFF]" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </header>
  );
};
