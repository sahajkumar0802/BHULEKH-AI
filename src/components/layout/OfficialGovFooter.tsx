import React from 'react';
import { useApp } from '../../context/AppContext';

export const OfficialGovFooter: React.FC = () => {
  const { t, isRtl } = useApp();

  return (
    <footer className="bg-[#002856] text-slate-300 text-xs border-t-2 border-[#003D7C] select-none mt-auto">
      {/* Thin Tricolor Accent Line */}
      <div className="w-full flex h-[2px]" aria-hidden="true">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-[#FFFFFF]" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center ${isRtl ? 'sm:text-right' : 'sm:text-left'} text-[11px]`}>
        <div>
          <div className="font-semibold text-white">
            {t('portalTitle')} | {t('portalSubtitle')}
          </div>
          <div className="text-slate-400 mt-0.5">
            {t('ministryName')} • {t('deptName')}
          </div>
        </div>

        <div className={`text-slate-400 ${isRtl ? 'text-left' : 'text-right'}`}>
          <div>
            {t('footerCompliance')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {t('footerCopyright')}
          </div>
        </div>
      </div>
    </footer>
  );
};
